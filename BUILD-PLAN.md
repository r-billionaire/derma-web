# Build Plan

Work through phases in order. Within a phase, follow the small-increment loop from
`vibe-coding-engineer`: describe one piece → implement → actually verify it → commit
→ next piece. Don't start a phase by asking for the whole thing in one prompt, even
though each phase description below is a paragraph - break it down further when you
get there.

## Phase 0 - Project setup & design foundation

1. `npx create-next-app` with TypeScript + Tailwind + App Router.
2. Configure the three fonts via `next/font/google` (Fraunces, Public Sans, IBM
   Plex Mono) and the color tokens in `tailwind.config`.
3. Build the base layout shell only: header (logo placeholder, nav placeholder,
   phone number, booking CTA button) and footer (contact info, hours, placeholder
   sitemap links) - no page content yet.
4. **Verify:** dev server runs, fonts render correctly (check in devtools that the
   right font is actually being applied, not falling back), header/footer show on
   a blank page.
5. Commit.

## Phase 1 - Content layer (no real UI polish yet)

1. Create `/content/` with typed placeholder data: clinic info, a services array,
   a providers array, a testimonials array - all clearly marked as placeholder per
   `CLAUDE.md`'s content policy.
2. **Verify:** import the content into a throwaway page and confirm it reads
   correctly - this is a data-layer check, not a design check yet.
3. Commit.

## Phase 2 - Homepage, section by section

Build one section at a time, in this order, verifying each renders correctly and
responsively before moving to the next:

1. Hero (the dual-path signature element)
2. Trust bar
3. Services overview grid (reading from `/content`)
4. Testimonials
5. Providers overview
6. Booking CTA section

**Milestone checklist gate:** before moving to Phase 3, run the "UX, responsive,
accessibility" section of `build-checklist.md` against the homepage specifically -
check the 375px mobile view now, not after every other page is also built.

## Phase 3 - Template detail pages

1. Build the `/services/[slug]` page template once, driven entirely by `/content` -
   verify it correctly renders for two different services before assuming it's
   generic enough.
2. Build the `/providers/[slug]` page template the same way.
3. Build the `/services` and `/providers` overview/index pages.
4. **Verify:** every service and provider in the content file has a working page;
   no broken links from the homepage into these.
5. Commit after each template is verified, not after all three.

## Phase 4 - Booking system (the highest-risk phase - go slow here)

Follow this exact sequence, verifying at each step - do not skip ahead to the UI
before the data layer is solid:

1. Create the Supabase project and the four tables (`providers`, `services`,
   `availability`, `appointments`) with the unique constraint on
   `(provider_id, start_time)`.
2. Write and test the availability-calculation logic in isolation first (a
   function that takes a provider, a service, and a date, and returns open slots)
   - verify with a few hand-checked test cases before building any UI on top of it.
3. Build the slot-picker UI, wired to the function from step 2.
4. Build the patient-info form and the booking-creation logic (the actual insert
   into `appointments`).
5. **Verify the double-booking protection actually works:** try to book the exact
   same slot twice in a row and confirm the second attempt is rejected, not just
   assumed to be handled by the constraint.
6. Wire up the Resend confirmation email.
7. **Verify end to end:** book a real test appointment through the full UI, confirm
   it appears in the Supabase table, and confirm the email actually arrives.
8. Commit only after step 7 passes, not after each sub-step - this phase's pieces
   depend on each other enough that a half-working intermediate state isn't a
   useful checkpoint on its own. (Do still commit steps 1-3 once each is
   individually verified working, per the normal loop - just don't call the
   booking system "done" until step 7 passes.)

## Phase 5 - Reviews and contact pages

1. `/reviews` - testimonials page, reading from `/content`.
2. `/contact` - location, hours, map embed, general-inquiry form (separate from
   booking - this one just sends an email, no scheduling logic).
3. Verify both pages, commit.

## Phase 6 - Full checklist pass

Run all of `build-checklist.md` against the whole site, not just the sections
already spot-checked in earlier phases - specifically sections 3 (data and
validation), 6 (security basics), and 7 (performance), which haven't had a
dedicated pass yet. Fix what it surfaces before moving on.

## Phase 7 - Content finalization & deployment

1. Replace placeholder content with the real client's approved copy, photos, and
   testimonials - this is the point where `CLAUDE.md`'s placeholder policy gets
   resolved, not before.
2. Confirm real business facts (name, address, phone, hours, provider bios) are
   correct and approved by the client.
3. Deploy to Vercel; confirm environment variables (Supabase keys, Resend API key)
   are set in the deployment environment, not just local `.env`.
4. Do one more full pass of the "deployment" and "post-launch" sections of
   `build-checklist.md` against the live, deployed site - not the local dev version.
