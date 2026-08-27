# Progress report — everything since the first Vercel deploy

**Period covered:** commit `9da3f41` (2026-08-25 00:32, the ImageKit fix that shipped
the first production deploy) → now, 2026-08-26.

**Read this first:** every code change described below is **uncommitted**, sitting in the
working tree. Nothing here is on `main` and nothing here is on production. The live
Vercel site is still the 2026-08-25 build, which predates every fix in this document —
including a data-corrupting timezone bug. Deploying is your call; see §9.

---

## 1. The one-paragraph version

You gave two tasks: make appointments work, and fix the images. **Task 1 is done and
verified against the live database.** Task 2 is **partially done** — 2 of 7 image slots
decided, work still running, and I'll be straight with you: it stalled once because an
agent hit a spend limit, and that cost several hours. Along the way I found and fixed a
bug that would have quietly written every appointment to the wrong time of day. That one
was worth the whole exercise: it was invisible on screen, so a demo would have looked
perfect while the database filled with garbage.

---

## 2. Scorecard

| # | Item | Status | Verified how |
|---|------|--------|--------------|
| 1 | Booking system works end to end | ✅ Done | Automated test against live DB, `all assertions passed` |
| 1a | Timezone correctness | ✅ Fixed | Dedicated test, incl. both 2026 DST changeover days |
| 1b | Double-booking impossible | ✅ Proven | DB rejects duplicate with `23505` |
| 1c | Patient data not publicly readable | ✅ Proven | Anon `select * from appointments` returns `[]` |
| 1d | Confirmation shown on screen | ✅ Built | Code reviewed — **not yet seen in a browser** |
| 1e | Confirmation email | ⚠️ Wired, untested | No `RESEND_API_KEY` set; skips cleanly by design |
| 2 | Unsplash imagery | 🔄 2 of 7 slots | Agent running, checkpointing to disk |
| — | `npm run build` | ✅ Passes | Exit 0, 13 pages, 4 service routes prerendered |
| — | 375px mobile check | ❌ Not done | Requires a browser pass |
| — | Production deploy | ⛔ Not done | Deliberately withheld — needs your go-ahead |

---

## 3. Bugs found and fixed

Ordered by how badly each would have hurt you in front of the MD.

### 3.1 🔴 Appointments were being written to the wrong time of day

**The worst thing in this report, and it was silent.**

Your `availability` table stores bare wall-clock hours — `07:00:00` to `17:00:00` — with
no timezone attached. The old code turned those into real timestamps using **whatever
timezone the visitor's computer was in.**

Concretely, on this machine (UTC+05:30), booking the "8:00 AM" slot wrote
`02:30Z` to the database. That is **8:30 PM the previous evening in Denver.** The
screen said 8:00 AM. The confirmation said 8:00 AM. The database said the night before.

Nothing looked broken. That is exactly why it mattered — you'd have demoed it
successfully and only found out when a patient showed up at the wrong time.

**Fix:** a new single source of truth, `src/lib/clinic-time.ts`. Clinic hours are now
interpreted in the clinic's own timezone regardless of where the visitor is. It uses
only the JavaScript standard library (`Intl`), so it behaves identically in the browser
and on the server — no new dependency, and no chance of the two disagreeing.

I also changed the slot function's signature from "a moment in time" to "a calendar day
at the clinic" (`2026-09-03`), because *"the 3rd of September at the clinic"* genuinely
isn't a moment in time, and treating it as one is the root cause of this entire class of
bug.

**Proof it's fixed:** `src/lib/clinic-time.test.mts` asserts exact expected timestamps
for a winter date and a summer date (so daylight saving is actually exercised, `-07:00`
vs `-06:00`), and confirms 07:00 still round-trips correctly on **both** 2026 DST
changeover days — 8 March and 1 November, the days this kind of code normally breaks.
`src/lib/booking.test.mts` additionally asserts every generated slot falls inside the
clinic's real opening hours, so this can't silently regress.

### 3.2 🔴 Two hero buttons led to a 404

Both dual-path CTAs on the homepage — the signature element of the whole design —
pointed at `/services/skin-cancer-screening` and `/services/chemical-peel`. **That route
did not exist.** Six links in total pointed into a route with no page behind it.

This would have been the first thing the MD clicked.

**Fix:** built `src/app/services/[slug]/page.tsx`, mirroring the existing provider
detail page so it's consistent rather than a new pattern. It uses `generateStaticParams`,
which means the build now *prerenders every service page* — so if a link and a slug ever
disagree again, **the build fails instead of the site 404-ing.** You can see all four in
the build output at the end of §7.

### 3.3 🔴 Patient contact details were readable by anyone

Row Level Security was **off**. Your `appointments` table holds patient names, emails,
and phone numbers, and the Supabase anon key is — by design — shipped inside the browser
bundle where anyone can read it. Anyone who viewed source could have dumped every
appointment.

**Fix** (migration `enable_rls_and_booked_slots_rpc`):

- `providers`, `services`, `availability` → public read. These are public info.
- `appointments` → **insert only.** No public read at all.
- Booked times now come from a dedicated database function that returns **only start and
  end times** — never a patient column. The test asserts the returned rows have exactly
  two keys, so a future edit can't accidentally widen it.

Supabase's own linter confirms the critical `rls_disabled` error is gone.

### 3.4 🟠 Two traps that RLS set, which would have looked like features

Locking down the database broke two things in ways that produced **no error message**:

1. **Every slot would have looked free.** Reading `appointments` under insert-only RLS
   returns zero rows rather than an error — so the availability calculation would have
   believed nothing was ever booked, and cheerfully double-booked all day. This is why
   the times come from that dedicated function instead.
2. **Every booking would have failed with a permissions error.** The old code asked the
   database to hand the new row back after inserting it, which needs read permission the
   table deliberately no longer grants. Removed the read-back; the browser already has
   every detail it needs.

Both were found by actually running the queries, not by reading the code.

### 3.5 🟠 The email library crashed the entire booking action on import

`new Resend(undefined)` throws **from its constructor**, at the moment the file is
loaded — before any of your code runs. There was a `try/catch` around the send call, but
it could never fire, because the failure happened at import time. With no
`RESEND_API_KEY` set, **the whole booking action died on load.** Not "email didn't
send" — no booking at all.

**Fix:** the client is now created lazily, and returns `null` when the key is absent. The
appointment saves, the patient sees their confirmation, and the skipped email is logged.
Adding `RESEND_API_KEY` in Vercel switches emails on with **no code change**.

### 3.6 🟠 The server trusted times sent by the browser

The booking action is a public endpoint — anyone can call it with any payload, the form
is irrelevant. It was inserting whatever start and end time it was handed.

**Fix:** the server now re-derives the provider's real availability itself and takes the
end time from **its own** calculation. A crafted request can't book a 3 AM appointment or
stretch a 30-minute screening into eight hours. This sits on top of the database's
`UNIQUE (provider_id, start_time)` constraint, which is what actually makes
double-booking impossible — per your `CLAUDE.md`, application checks alone aren't the
safety mechanism.

Side benefit: a stale browser tab offering a slot someone else has since taken now gets
a clear *"that time was just booked by someone else"* message instead of a crash.

### 3.7 🟡 Smaller correctness fixes

| Problem | Why it mattered | Fix |
|---|---|---|
| Availability used `.single()` | Threw for a closed day *and* for a provider with a split morning/afternoon shift | Reads all windows; closed day returns no slots |
| DB errors returned "no slots" | An outage was indistinguishable from a fully booked day | Errors now surface as *"couldn't load times — try again"* with a retry button |
| `alert()` popup on success | Browser-chrome dialog on a medical site; unstyled, dismissible, no record | Real confirmation panel with full appointment details, announced to screen readers |
| Server errors thrown | Next.js **redacts** thrown server-action messages in production — patients would see a blank generic failure | Returns typed results, so real messages reach the user |
| Broken images | **Your screenshot.** Next.js blocks images from hosts not on an allowlist → broken-icon | Allowlisted the CDN hosts in `next.config.ts` |
| Placeholder DB IDs in content | Booking referenced services/providers that didn't exist | All 6 replaced with real database UUIDs |
| Browser tab read "Dermatology Clinic" | Generic, and the clinic name was already in `/content` | Now "Apex Dermatology — Medical & Cosmetic Dermatology" |
| `test-booking` dev page on a public route | Reachable by URL on the live site | Deleted |
| Dead `src/lib/appointment.ts` | Superseded, still importable — a future edit could pick the wrong one | Deleted |

---

## 4. Task 2 — imagery, honest status

**2 of 7 slots decided.** Not done. Here's exactly where it stands and why it took so long.

**Decided:**

| Slot | Shows | Why it passes |
|---|---|---|
| `mohs-surgery` | Empty, immaculate operating room — surgical table, overhead lights | Procedural and serious. **No patient, no blood, no wound** — critical on a cancer page |
| `chemical-peel` | Practitioner applying a treatment mask to a reclining patient | Cosmetic without tipping into day-spa |

**Still open:** hero, `skin-cancer-screening`, `acne-treatment`, and both provider
portraits.

**10 candidates rejected, with reasons** — this is the part that costs time, and it's the
part that protects you:

- Three were the exact *"smiling person in scrubs, arms crossed, studio backdrop"* stock
  look your `CLAUDE.md` forbids. Two of those also had **legible embroidered text in
  Portuguese and Spanish** naming a *different real practitioner* — one of them a
  physiotherapist.
- One was an anatomical model of a **brain**. Wrong specialty entirely.
- One was **radiology** — CT/MRI cross-sections with software UI text on screen.
- One was hot-stone massage on a bare back — spa imagery plus partial nudity.
- One was facial **cupping**, which isn't a dermatological treatment at all. An MD would
  notice immediately.
- One was a lotion tube with a **fully legible competitor brand name** on it.
- One was a hospital lobby with a large Spanish-language directory sign.

Every one of those would have been an unforced error in front of a dermatologist. This
is why the images are being *looked at* rather than picked from search-result titles.

**Nothing is being downloaded.** These are Unsplash CDN URLs. `next/image` fetches and
optimizes them on demand — no image files enter the repo, no bloat, no licence
bookkeeping. Unsplash's licence permits commercial use without attribution.

### Why this track is late

An agent doing this work **died mid-task** on a spend/quota limit:

```
403 pre-consume quota failed, user quota: $8.213132, need quota: $9.850888
```

The wrapper text said *"Failed to authenticate,"* which is misleading — **no credential
failed.** Not Supabase, not Resend, not ImageKit, not Vercel, not your login. It's a
dollar balance: the gateway reserves an estimated cost before running a request, and
$9.85 was needed against $8.21 available. Logging in again cannot fix it; it needs credit
on the account that issued the API key.

**The crash was cheap. The damage was that it lost 100% of its findings** — including,
annoyingly, a note that one candidate cropped to an ambiguous bare torso — because it
held everything in memory instead of writing it down. Viewing images inflates context
fast, which is exactly what drives per-request cost up into that wall.

**What I changed so it can't happen the same way twice:** the current agent owns one
file, `image-manifest.json`, and must rewrite it **after every single image decision** —
never batched at the end. The 2 picks, 10 rejections and 4 held candidates above are
already on disk. If it dies now, that reasoning survives and work resumes from it instead
of starting over. It also can't touch `src/` at all — I wire the picks in myself, which
is the cheap half and needs no image viewing.

---

## 5. Files touched

**New (6):**

| File | Purpose |
|---|---|
| `src/lib/clinic-time.ts` | Single source of truth for clinic timezone. Fixes §3.1 |
| `src/lib/clinic-time.test.mts` | DST and round-trip proofs |
| `src/lib/booking.test.mts` | End-to-end slot + RLS + double-booking test vs live DB |
| `src/app/services/[slug]/page.tsx` | The missing route. Fixes §3.2 |
| `approvals.md` | Decisions I made that need your sign-off |
| `image-manifest.json` | Agent checkpoint file (working artifact, not shipped) |

**Modified (9 code + 1 settings):** `src/lib/booking.ts`, `src/lib/email.ts`,
`src/app/actions/booking.ts`, `src/components/BookingFlow.tsx`, `src/app/layout.tsx`,
`src/content/index.ts`, `src/content/types.ts`, `next.config.ts`

**Deleted (2):** `src/lib/appointment.ts`, `src/app/test-booking/page.tsx`

Net: **+468 / −198** across 11 tracked files.

---

## 6. Database

One migration applied: **`enable_rls_and_booked_slots_rpc`** (§3.3). No schema or data
changes beyond that.

Current state — clean and demo-ready:

| Table | Rows |
|---|---|
| `appointments` | **0** — test bookings cleaned out |
| `providers` | 2 |
| `services` | 4 |
| `availability` | 10 |

Supabase security linter: the critical `rls_disabled` **error is cleared.** Two `WARN`s
remain, both saying the public can call `get_booked_slots`. **That is intentional** —
it's the function that lets the booking page show which times are taken without exposing
patient data. Documented rather than "fixed," because silencing it would break booking.

---

## 7. Verification actually run

```
booking:     all assertions passed
clinic-time: all assertions passed
npm run build: exit code 0
```

Build output:

```
○ /                     ● /services/skin-cancer-screening
○ /book                 ● /services/mohs-surgery
○ /contact              ● /services/chemical-peel
○ /providers            ● /services/acne-treatment
○ /reviews              ƒ /providers/[slug]
○ /services
```

All four service pages now prerender (`●`), which is the build-time guarantee that every
service link resolves.

**What the booking test actually proves, against the live database:** public reference
data is still readable with RLS on · several slots are offered on a normal weekday ·
every slot falls inside real clinic hours · a booking succeeds with the anon key ·
`select * from appointments` returns **nothing** · the booked-times function leaks no
patient columns · booking removes **exactly** that slot and no neighbours · a duplicate
booking is rejected by the database with `23505` · nothing inside the 2-hour notice
buffer is ever offered.

---

## 8. Not verified — please treat as unproven

I'd rather flag these than let you find them live.

1. **No browser click-through.** The booking flow is proven by automated test at the data
   layer; I have not personally clicked through all five steps in a browser.
2. **The success screen has never been seen rendered.** The code is right, but "renders
   correctly" is not something I've confirmed with my eyes.
3. **No 375px mobile check.** `CLAUDE.md` requires this at every milestone. Not done for
   the booking flow or the new service pages.
4. **No email has ever been sent.** No `RESEND_API_KEY` is set. The skip path is
   tested — the send path is not.
5. **Keyboard focus and reduced-motion** are implemented in the new code but not
   audited across the site.

---

## 9. Open items and debt

**Demo-critical:**

- **Vercel Deployment Protection is on.** An unauthenticated visitor — i.e. the MD, on
  their own phone — hits an SSO login wall, not your site. Worth settling before any
  link gets shared.
- **Production is 2 days stale**, and predates every fix above, including §3.1 and §3.3.
  So the live site right now has readable patient data and the timezone bug.
- **Provider photos point at files that don't exist** (`/photos/providers/*.jpg`) —
  broken images on the providers page until the imagery track lands.

**Genuine debt, all small:**

- `providers/[slug]` has no `generateStaticParams`, so provider slugs get no build-time
  check — the exact protection that just caught §3.2 for services. ~4 lines.
- Timezone constant duplicated in `email.ts`; should read from `clinic-time.ts`.
- `@imagekit/javascript` is installed with **zero imports** — removable.
- `globals.css` imports Tailwind twice (lines 1 and 3).
- `logo.png` is **1.5 MB** — that's the single heaviest thing on the homepage.
- One React hook dependency warning in `BookingFlow.tsx` (benign, worth silencing).

---

## 10. Needs your sign-off

Full detail in [approvals.md](approvals.md). The ones that actually matter:

**Blocks a public launch (fine for a demo):**

1. Doctor portraits will be photos of **real strangers**, captioned as your doctors.
2. Provider names, credentials and bios are **invented**.
3. Testimonials are **written by me**, not by patients. They read as plausible, which is
   precisely the risk.

**One real question only you can answer:**

4. **I hardcoded the clinic timezone to `America/Denver`** to match the address. Your
   availability rows store bare `07:00`–`17:00` with no timezone, so something had to
   decide whose 7am that is. If it's wrong, it's a one-line change — but every
   appointment time depends on it.

---

## 11. What I'd do next, in this order

1. Finish the 5 remaining image slots and wire all 7 in (in progress).
2. Add `generateStaticParams` to `providers/[slug]` — 4 lines, closes the same class of
   bug as §3.2.
3. **Click through the booking flow in a real browser at 375px**, including the success
   screen. This is the biggest remaining gap: the data layer is proven, the visual layer
   isn't.
4. Sweep the small debt in §9 — including the 1.5 MB logo.
5. Commit. Everything above is one `git reset` from oblivion, which is not where a day's
   fixes should live.
6. Then decide on deploy + Deployment Protection.

I have not committed or deployed anything. Both are waiting on you.
