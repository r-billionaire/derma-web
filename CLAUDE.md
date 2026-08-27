# Project: Dermatology Clinic Website

## What this is

A multi-page marketing website with a real, custom-built appointment booking system
for a dermatology clinic (medical + cosmetic dermatology), modeled structurally on a
proven local-medical-practice pattern. Built as a single, reusable codebase - a future
second client is a config/content change, not a rebuild - but built to be genuinely
excellent for this one first, not generic.

## Placeholder content policy - read before writing any copy

Real business facts (name, address, phone, hours) are known from research and are
listed below. Real patient reviews and identities are **not** used anywhere in this
project - write realistic, clearly-generic placeholder testimonials instead. Provider
names, bios, and photos are placeholders until supplied by the actual client. Flag
every placeholder with a `// PLACEHOLDER:` comment so nothing gets mistaken for
approved final content at review time. None of this ships publicly until the real
client's approved copy, photos, and testimonials replace the placeholders.

## Reference facts (structural/positioning reference only - see policy above)

- Practice type: dermatology clinic, US - serves both medical dermatology (skin
  cancer screening, Mohs surgery) and general/cosmetic dermatology. Both audiences
  matter - don't let the site skew to look like a cosmetic-only spa.
- Typical hours pattern for this kind of practice: weekdays only, roughly 7am-5pm,
  closed weekends. Use placeholder hours in this shape; confirm real hours before
  launch.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Database: Postgres via Supabase (free tier) - also gives a table-editor UI the
  clinic can use to see bookings in v1, without building a custom admin panel yet
- Email confirmations: Resend, plain HTML string template - no separate templating
  library needed at this scope
- Deploy target: Vercel
- Do not introduce another framework, ORM, or state-management library beyond this
  list without discussing it first - every added dependency is another place a
  smaller model can lose the thread

## Available tools - use them deliberately

This environment has MCP servers and plugins connected. Use them where they
genuinely help; their availability is not a reason to skip the verification steps
described elsewhere in this file.

- **Context7 (MCP)** - pull current docs before implementing against anything
  version-sensitive: Next.js 15 App Router conventions, the Supabase client, the
  Resend SDK, the Motion animation library (which has renamed and changed APIs
  across versions - don't trust memory here). This matters more than usual since
  this project runs on a smaller model that may have stale or partial knowledge
  of recent API shapes.
- **Supabase MCP** - use directly for all schema and migration work in Phase 4
  (creating the four tables, the unique constraint on `(provider_id, start_time)`,
  any RLS policies). Don't hand-write SQL to paste into a dashboard separately -
  run it through the MCP so it's tracked as a real migration.
- **Motion (MCP)** - reserved for the hero's dual-path signature interaction and
  restrained scroll-reveals only. The design system's restraint principle still
  applies: an available animation tool is not a reason to add motion anywhere
  that wasn't already called for above.
- **Ponytail** - default implementation stance for this project: standard
  library and native platform features before a new dependency, shortest correct
  diff. This changes *how* something gets implemented, not *whether* the
  verification and checklist steps in this file happen.
- **Superpowers** - use its TDD workflow specifically for the booking
  availability-calculation logic in Phase 4: write the test cases before the
  implementation, not after. Use its verification-before-completion discipline
  as the default across every phase, not just booking. Parallel/subagent
  dispatch is a good fit for genuinely independent chunks (e.g. the service and
  provider page templates in Phase 3) - not for Phase 4, which is intentionally
  sequential and higher-risk.
- **Code-Review / Simplify** - run at the Phase 6 checklist pass, and any time a
  piece of the booking logic starts looking more complex than the rules
  described above.
- **Frontend-Design** - reinforces the restraint and quality-floor principles
  below; it doesn't override the specific palette, type, and layout decisions
  already locked in - those were decided deliberately so a smaller model has
  something concrete to build against instead of an open-ended creative brief.

## Model escalation - Claude Opus 5 is sometimes available

Gemma 4 via Ollama stays the default for routine work - that's the budget
decision already made. Claude Opus 5 is available occasionally, not as a
standing upgrade, so treat it as a scarce resource to spend deliberately on the
handful of tasks where a smaller model is most likely to miss something, per
`vibe-coding-engineer`'s own escalation guidance:

- Broad, cross-file consistency work where a smaller model tends to check the
  files it's looking at and miss the one it isn't - e.g. an accessibility audit
  across the whole site, or the theming extraction in Phase 11 (pulling every
  scattered hardcoded color/font reference into one config - the risk isn't
  writing the config, it's missing an instance).
- A bug that resists a fix after a couple of attempts on the default model -
  that's the signal to switch, not to keep retrying the same approach.
- Anything touching the booking system's correctness or the RLS policies again -
  this code has already had two rounds of silent, invisible-on-screen bugs
  (§3.1, §3.3 of the last progress report); getting it right the first time is
  worth spending the scarce resource on.

Not worth it for: routine page-building, content wiring, small mechanical
fixes (the `generateStaticParams` addition, the debt sweep) - save it for where
Gemma is most likely to fall short, not for everything just because it's
available that day.

However a piece of work got done, the same verification standard in this file
applies to it - a stronger model's output still gets clicked through, still
gets checked at 375px, still goes through the checklist. It's less likely to
need correction, not exempt from being checked.

## Design system - do not deviate without discussion

Decided deliberately to avoid generic "AI-website" defaults (cream+serif+terracotta,
dark-mode+neon accent, broadsheet/hairline-rule style). Grounded in the subject:
skin health reads as calm, natural, clinically confident - not corporate-medical-blue,
not cosmetic-spa-pastel.

**Colors**
- Background: `#F7F5F2` (warm off-white, not stark clinical white)
- Primary / dark text / header+footer: `#1F2420` (near-black with a green undertone)
- Accent (primary - CTAs, links, active states): `#2F4B3C` (deep forest green)
- Accent (secondary - used sparingly: badges, dividers, highlights): `#C9A66B`
  (warm muted gold)
- Supporting neutral (borders, secondary text): `#8B8478`

**Type** (all via `next/font/google`)
- Display / headlines: Fraunces (serif, characterful, used with restraint - not on
  every heading, reserve for the pieces that should feel considered: hero, section
  titles)
- Body: Public Sans (clean, highly legible - this is a healthcare site, legibility
  is not optional)
- Labels / hours / phone numbers / credentials: IBM Plex Mono, small size,
  letter-spaced - reserved for factual/data-like content only, never decorative

**Layout concept**
Editorial, asymmetric - not a centered-stat-block hero, not a uniform 3-card grid
for services. Generous whitespace. Section dividers are a thin gold (`#C9A66B`)
rule, not heavy boxed cards.

**Signature element - the one deliberate risk**
The homepage hero splits into two clear paths immediately, because that's genuinely
how people arrive at a dermatology site with two different intents: "Concerned about
a spot?" (routes toward skin cancer screening / urgent) and "Want healthier, clearer
skin?" (routes toward general/cosmetic). Each path leads somewhere actually specific,
not a generic "learn more" button. Keep everything else on the page disciplined and
quiet around this one moment.

**Photography**
No generic stock "smiling family in scrubs" imagery. For provider headshots
specifically: **never use a real, identifiable stranger's photo as a placeholder
for a fictional doctor** - that's not a placeholder-quality issue, it's depicting
an actual uninvolved person as a licensed medical professional they have no
connection to. Use a stylized initials/monogram placeholder (in the palette
above) for any provider without an approved real photo, until one exists. For
everything else (hero, service pages, office shots), use clearly-flagged
placeholder blocks (`// PLACEHOLDER: photo of...`) rather than shipping generic
stock as if it were final.

When evaluating candidate stock photos (for slots where a real stock photo *is*
appropriate - not provider headshots), do it with Gemma's native vision via
Ollama, not a separate paid vision service - keep this on the free setup, and
set a low visual token budget (~140) since coarse content classification
("does this show blood, a competitor's logo, the wrong specialty") doesn't need
fine-grained detail. Checkpoint every decision to disk immediately (not batched
at the end) so a crash or quota limit loses at most one decision, not the whole
run.

**Non-negotiable floor**
Responsive down to a 375px mobile viewport. Visible keyboard focus on every
interactive element. Respect `prefers-reduced-motion`. This is checked at every
milestone, not just before launch - see the build plan.

## Site structure

- `/` - home: hero (dual-path split), trust bar, services overview, testimonials,
  providers overview, booking CTA
- `/services` - services overview grid
- `/services/[slug]` - one page per service
- `/providers` - providers overview
- `/providers/[slug]` - one page per provider
- `/reviews` - testimonials page
- `/book` - the real booking flow: provider → service → date/time slot → patient
  info → confirmation
- `/contact` - location, hours, map, general-inquiry contact form (separate from
  booking)
- Phone number and a booking CTA appear in the header on every page

## Booking system - data model and rules

Tables (Supabase/Postgres):
- `providers` (id, name, slug, bio, photo_url, specialties)
- `services` (id, name, slug, description, duration_minutes, category)
- `availability` (provider_id, day_of_week, start_time, end_time) - recurring
  weekly working hours per provider
- `appointments` (id, provider_id, service_id, patient_name, patient_email,
  patient_phone, start_time, end_time, status, created_at)

Rules:
- Available slots = provider's recurring availability, minus already-booked
  appointments, minus a minimum-notice buffer (no booking within the next 2 hours),
  sliced by the selected service's duration.
- A unique constraint on `(provider_id, start_time)` at the database level prevents
  double-booking - this is the actual safety mechanism, not a check in application
  code alone.
- Booking form collects only name, phone, email, and appointment time - no health
  details, no reason-for-visit free text. This is deliberate: keep the booking
  system out of PHI/HIPAA territory for v1. If real patient health information
  ever needs to be collected or stored, that's a distinct decision requiring a
  compliance review of the hosting/database provider (BAA availability, etc.)
  before building it - don't add fields "while we're in there."
- On successful booking: send a confirmation email via Resend, and show an
  on-screen confirmation with the same details.

## Conventions

- All content (clinic facts, services, provider bios, copy) lives in typed files
  under `/content/`, not hardcoded inside components - this is what makes adapting
  the site for a future client a config change, not a rebuild.
- Components stay presentational - they read from `/content`, they don't contain
  business facts directly.
- One component per file. Tailwind classes directly in JSX; no separate CSS files
  unless something genuinely can't be expressed in Tailwind.
- Watch CSS selector specificity where a type-based selector (e.g. `.section`) and
  an element/utility-based one could cancel each other out - this shows up most
  often in section spacing/padding.

## Theming & multi-client reuse

The booking system, page structure, and routing are permanent - the same
functionality serves every future dermatology-clinic client, not just this one.
What needs to swap fast per client is the visual identity. Keep this separation
real but lightweight - don't build a multi-tenant admin system for a client base
of one:

- **Colors, fonts, logo**: consolidate into a single theme config
  (`/content/theme.ts`) rather than scattered across `tailwind.config` and
  component code - swapping a client's palette should mean editing one file, not
  hunting through components. Keep the underlying design *system* (the
  editorial layout, the restraint principles, the quality floor) fixed; only the
  token values change per client.
- **Images**: the working `image-manifest.json` from the imagery task becomes
  the real, permanent per-client asset config once this build is done - not a
  disposable checkpoint file. A new client's image set is a new manifest, not a
  code change.
- **Motion**: keep animation parameters (what animates, how much) defined in one
  place rather than inline per-component, so toning motion up or down for a
  different client's brand is a config edit.
- This is being built now, ahead of a second confirmed client, on the bet that
  the pattern holds - that's a real risk (the right abstraction is easier to see
  with two real cases than one). Keep it to plain config objects, not a
  framework - cheap to build, cheap to be wrong about, cheap to redo once a
  second client actually shows what varies.

## How to verify a change works

- `npm run dev` and manually check the actual page that changed - not just that it
  compiles.
- `npm run build` before calling any milestone done - working only in dev mode is
  not done.
- Check at a real 375px mobile width, not a resized desktop window.
- For the booking flow specifically: actually step through booking a test slot
  end to end, including confirming the email arrives - don't just confirm the UI
  renders.

## Known gotchas for this project

- `availability` stores bare wall-clock hours with no timezone. Never derive a
  real timestamp from a visitor's local timezone - always interpret clinic hours
  in the clinic's own timezone via `src/lib/clinic-time.ts`. A "calendar day at
  the clinic" is not the same type as "a moment in time" - treating one as the
  other is how this broke the first time.
- Under RLS with `appointments` set to insert-only, reading that table returns
  **zero rows, not an error** - a naive availability check would conclude
  nothing is ever booked. Booked times must come from the dedicated
  `get_booked_slots` function (returns only start/end, never patient columns),
  never a direct table read.
- Never ask the database to read back a row immediately after inserting it into
  a table the current role can't read - it will fail. The browser already has
  every detail it needs from the insert itself.
- A client that needs an API key (Resend, etc.) must be constructed lazily and
  degrade gracefully when the key is absent - constructing it eagerly at module
  load time means a missing key crashes everything that imports the module, not
  just the feature that needed the key.
- Never trust a time, price, or duration sent by the browser for anything that
  writes to the database - re-derive it server-side from the same source of
  truth used to display it. The unique constraint is the actual double-booking
  safeguard; server-side re-derivation closes the gap before that constraint
  ever gets tested.
- Thrown errors from a Next.js Server Action are redacted to a generic message
  in production - return typed results instead if the real message needs to
  reach the user.

## Out of scope for v1

- Online payment / insurance verification
- Patient portal / medical records access
- Multi-language support
- A custom admin dashboard (use Supabase's table editor for now)
- A formal multi-tenant system (per-client databases, an onboarding UI, a
  client-facing theme editor) - the lightweight config-based theming above is
  in scope now; a real multi-tenant *system* still waits for a second client
