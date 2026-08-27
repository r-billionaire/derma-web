# Build Plan - Phase 8 onward

Phases 0-7 are complete and archived in `BUILD-PLAN-PHASES-0-7-COMPLETE.md`.
This file is the active plan - start here, at Phase 8. Same rule as before:
within a phase, small increments - describe one piece, implement, verify,
commit, next piece. A short phase description below is not permission to
take the whole phase in one prompt.

## Phase 8 - Safety: commit immediately

Everything from the Phase 7 progress report is sitting uncommitted. This
happens before anything else below - before even reading the rest of this plan.

1. `git add` and commit everything currently in the working tree, in logical
   groups if there's an obvious split (the timezone fix, the RLS migration, the
   missing route, the smaller fixes) - but committed *today*, before any more
   work happens on top of it.
2. Do not deploy yet - the current production build predates all of these
   fixes and is actively unsafe (open patient data, wrong appointment times).
   Confirm nothing points anyone at that production URL until Phase 12.

## Phase 9 - Close the verification gap

Work through §8 of the progress report as literal tasks, not just noted risk:

1. Add `generateStaticParams` to `src/app/providers/[slug]/page.tsx` - closes
   the same class of bug §3.2 fixed for services, small and quick.
2. Click through the entire booking flow in an actual browser - provider →
   service → slot → info → confirmation - at both a normal desktop width and a
   real 375px mobile width. This is the biggest remaining gap: the data layer
   is proven, the visual layer has never been seen rendered.
3. Set `RESEND_API_KEY` (in `.env.local` first, Vercel later) and send one real
   test booking confirmation end to end - confirm it actually arrives, not just
   that the send call doesn't throw.
4. Audit keyboard focus and `prefers-reduced-motion` across the booking flow and
   the homepage's hero interaction specifically - `CLAUDE.md`'s quality floor
   requires this, and it's the one item in §8 with no automated proof possible.
   If Claude Opus 5 is available when you reach this step, this is a good place
   to spend it - a broad cross-file consistency check is exactly where a
   smaller model tends to miss the one file it wasn't looking at.
5. Sweep the small debt from the report's §9: duplicate timezone constant in
   `email.ts` (read from `clinic-time.ts` instead), remove the unused
   `@imagekit/javascript` dependency, fix the duplicate Tailwind import in
   `globals.css`, compress `logo.png` (1.5 MB is the heaviest thing on the
   homepage), silence the one hook-dependency warning in `BookingFlow.tsx`.
6. Commit after each verified item, per the normal loop - this list is exactly
   the small-increment pattern, just applied to closing gaps instead of building
   new features.

## Phase 10 - Finish imagery

1. Resume from `image-manifest.json` - the 2 decided slots and the reasoning
   behind the 10 rejections stay as-is; don't re-litigate them.
2. Re-do the image-evaluation step per `CLAUDE.md`'s updated photography policy:
   Gemma's native vision via Ollama, low visual token budget, checkpoint to the
   manifest after every single decision - this is both cheaper and exactly what
   avoids repeating the spend-limit failure from the last run.
3. For the two provider headshots specifically: build the monogram/initials
   placeholder component instead of continuing to search for stock photos of
   real people to stand in for fictional doctors.
4. Finish the remaining open slots (hero, `skin-cancer-screening`,
   `acne-treatment`) using the same rejection rigor already demonstrated - the
   10 rejected candidates in the report are a good reference for what "fails
   immediately in front of an MD" looks like.
5. Once all 7 slots are decided, promote `image-manifest.json` from a working
   checkpoint file to the real, permanent per-client asset config described in
   `CLAUDE.md`'s theming section.

## Phase 11 - Lightweight theming extraction (supports the multi-client goal)

Do this after Phase 9 and Phase 10, not before - the theme layer should be
extracted from a codebase that's already correct, not built alongside
last-minute fixes. Another good candidate for Claude Opus 5 if it's available
for this step - a scattered hardcoded value that gets missed here defeats the
entire point of the extraction.

1. Consolidate the color and font tokens currently in `tailwind.config` (plus
   anywhere a hex value or font name is hardcoded in a component) into
   `/content/theme.ts`.
2. Move the logo out of a hardcoded static reference into the same config.
3. Confirm the promoted image manifest (Phase 10, step 5) and the theme config
   together account for everything that's actually client-specific - the goal
   is that a future second client is "replace `theme.ts` and the image
   manifest," not a grep through components.

## Phase 12 - Demo readiness for the MD

1. Deploy the now-fixed, now-verified build to Vercel.
2. Don't disable Deployment Protection entirely - generate a **Shareable Link**
   for this specific deployment instead, and send that to the MD. This lets
   them view and click through it without hitting the Vercel login wall, without
   making the preview publicly indexable.
3. Confirm the booking flow is genuinely usable by someone with zero context,
   since "testable by the client" was the explicit bar - have someone other
   than whoever built it try booking an appointment without guidance first.
4. Only after Phase 9-11 are done and verified - don't share a link to
   anything that still has an item open in Phase 9's list.

