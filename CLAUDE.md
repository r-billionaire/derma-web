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

- Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS v4
- Database: Postgres via Supabase (free tier) - also gives a table-editor UI the
  clinic can use to see bookings in v1, without building a custom admin panel yet
- Email confirmations: Resend, plain HTML string template - no separate templating
  library needed at this scope
- Deploy target: Vercel
- Do not introduce another framework, ORM, or state-management library beyond this
  list without discussing it first - every added dependency is another place a
  smaller model can lose the thread

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
No generic stock "smiling family in scrubs" imagery. Until real photos exist, use
clearly-flagged placeholder blocks (`// PLACEHOLDER: photo of...`) rather than
shipping generic stock as if it were final.

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

*(grows as they come up - add a line here the first time the model makes the same
mistake twice, per the vibe-coding-engineer skill's pattern)*

- Env var names must match `process.env.*` in code exactly. `src/lib/imagekit.ts`
  has hardcoded fallback values, so a misnamed ImageKit var fails **silently** -
  images still render off the fallback and nothing looks broken. Check
  `.env.example` for the canonical names.
- `vercel env add` defaults new vars to *sensitive*, and Vercel rejects a
  `NEXT_PUBLIC_*` var as sensitive on Production/Preview (`invalid_visibility`).
  Add those with `--value '...' --no-sensitive`. Piping the value over stdin is
  also unreliable in the current CLI - use `--value`.

## Out of scope for v1

- Online payment / insurance verification
- Patient portal / medical records access
- Multi-language support
- A custom admin dashboard (use Supabase's table editor for now)
- Generalizing this into a formal multi-tenant template - revisit once there's a
  second real client to generalize from, not before
