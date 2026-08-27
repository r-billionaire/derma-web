# Approvals needed — Apex Dermatology site

Decisions I made autonomously while you were away. I defaulted to the **safest**
option in each case. Nothing here is irreversible; every item lists exactly how to
change it if you disagree.

Review order: **P0 items block a public launch.** P1/P2 are judgment calls.

---

## P0 — Must be resolved before the site is publicly live

### 1. Doctor portraits are photos of real strangers
**Status:** Live on the site now, at your explicit direction (you chose
"Unsplash portraits as the doctors").

`Dr. Jane Smith` and `Dr. Michael Chen` are shown using Unsplash stock portraits of
real people who have no connection to the clinic. This is fine for an internal demo
and is flagged with `// PLACEHOLDER:` in `src/content/index.ts`.

**Why it's P0:** publishing a stranger's face captioned as your clinic's doctor is a
real-person misrepresentation, separate from any licensing question.

**To resolve:** send me the two real headshots; it's a one-line swap per provider in
`src/content/index.ts`.

### 2. Provider names and bios are invented
"Dr. Jane Smith" / "Dr. Michael Chen" and both bios are placeholders, per
`CLAUDE.md`. All flagged with `// PLACEHOLDER:`.

**To resolve:** supply real names, credentials, and bios.

### 3. Testimonials are written by me, not by patients
Generic placeholder reviews, per the `CLAUDE.md` policy of never using real patient
identities. They read as plausible, so they must not ship as if approved.

**To resolve:** supply real approved testimonials, or we remove the section.

---

## P1 — Decisions I made that you should confirm

### 4. Row Level Security enabled on the database
Patient contact details in `appointments` were readable by anyone holding the public
anon key. I enabled RLS with these policies:

- `providers` / `services` / `availability` → public read (they're public info)
- `appointments` → **insert only**; no public read
- Slot availability now computed server-side, exposing only times, never patient data

**Confirm:** this is the safe configuration. No action needed unless you wanted the
Supabase table editor to stay readable from the browser — it still works from the
Supabase dashboard, which uses a different key.

### 5. Confirmation emails are disabled, not broken
`RESEND_API_KEY` isn't set. Rather than let bookings fail, the email step is skipped
and logged; the booking still saves and the patient still sees an on-screen
confirmation.

**To resolve:** add `RESEND_API_KEY` to Vercel and the email starts sending with no
code change. Note Resend only delivers to arbitrary addresses once you've verified a
sending domain.

### 6. Production deploys — I did not deploy
I stopped at a verified local build. Deploying to production unattended, with nobody
awake to notice a regression, isn't a safe default.

**To resolve:** say the word and I'll deploy, or run `vercel --prod` yourself.

### 7. Clinic timezone is hardcoded to `America/Denver`
`availability` stores bare wall-clock hours (`07:00:00`–`17:00:00`) with no timezone,
so something has to decide *whose* 7am that is. I set `CLINIC_TIME_ZONE` in
`src/lib/clinic-time.ts` to `America/Denver`, matching the Denver address.

**Why this matters:** before this, slots were built in the *viewer's* timezone. Booking
"8:00 AM" from this machine (UTC+05:30) wrote `02:30Z` to the database — 8:30 the
previous evening in Denver — while the screen still read 8:00 AM. Nothing looked wrong.
That is now fixed and covered by a regression test, but the timezone value itself is
still an assumption.

**To resolve:** confirm the clinic's real timezone. One-line change if it's wrong.
It belongs in `/content` with the other clinic facts eventually.

### 8. Booking is now validated server-side
The server no longer trusts the times the browser sends. It re-derives the provider's
real availability and takes the appointment's end time from its own calculation, so a
crafted request can't book outside working hours or stretch an appointment. Combined
with the database `UNIQUE (provider_id, start_time)` constraint, which is what actually
prevents double-booking.

**Confirm:** no action needed. Noted because it changes behaviour — a stale browser tab
offering a slot that has since been taken now gets a clear "no longer available" message
instead of silently succeeding.

---

## P2 — Minor, safe to leave

### 9. Clinic contact details left exactly as they were
You confirmed "Apex Dermatology" / `+1 303-261-1525` / Denver are real and approved,
so I did not touch them. Flagging only because `CLAUDE.md` says to confirm real hours
before launch.

### 8. Unsplash licence
Unsplash images are free for commercial use with no attribution required. Attribution
is still courteous, and the `next.config.ts` allowlist for `images.unsplash.com`
should be removed once all photography is client-owned.

---

*Appended as work proceeds. See `NIGHT_LOG.md` for the running build log.*
