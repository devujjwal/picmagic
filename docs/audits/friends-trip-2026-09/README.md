# Friends Travel addition — local, media deferred

The owner stopped Kling/Runway video attempts. No new generation, credits, upgrades or purchases were made. Codex's available image capability cannot produce the requested moving reel. The exact reference-conditioned video brief remains in `video-manifest.json`; it is not a completed video.

## Implemented

- Added **Cinematic Ladakh Friends Trip Reel**, `/reel-prompts/cinematic-ladakh-friends-trip`, as a private draft in the combined local library. Score **5**, with a specific why-AI rationale, hook, progression, payoff, complete 12-second scenes, FAQs, tags and SEO copy.
- Added **Friends Travel Reels**, `/collections/friends-travel-reels`. One genuinely relevant concept; **noindex**, excluded from the sitemap. Do not pad it with unrelated concepts to reach four members.
- Added the reusable **Cinematic Friends Trip Reel** creator to `/reel-prompts#friends-trip-creator` and template-backed detail pages. It accepts 2–8 friends, place, 10–15 second full duration and four distinct moods. Ladakh, Goa, Manali, Meghalaya and Jaipur have suitable environment directions; unfamiliar places require verified scenery rather than fabricated landmarks.
- The copyable prompt starts with the exact chosen friend count, preserves every reference person's identity independently, and ends with the chosen place title. This identity-specific template explicitly requires references. It never invents Indian or other substitute friends if a reference is missing. Styles and locations do not determine ethnicity.
- The original supplied photograph retains **all four people**, its complete square framing, and their unmodified identities. WebP conversion strips source metadata; the 640×640 reference and 480×480 thumbnail are optimized. It is visibly labelled as a source photograph, **not** a completed Ladakh scene or AI preview.
- Preview generation instructions are stored separately from the reusable user prompt. The private original has a SHA-256 identity/provenance record. The proposed vertical poster must recompose around all four friends, not crop either outer friend out.
- Added admin fields for reference mode, place, people count, poster role and template JSON, plus a validated regeneration action. Template edits require renewed editorial/media review. Publication of a source-only poster is rejected.
- Kept video rendering centralized in `PreviewMedia`: poster first, absent video source in server HTML, viewport-proximity loading, muted/inline playback, at most two active video leases, reduced-motion/data-saver handling and poster fallback on failure. The new record has **null video metadata** until a real clip passes review.
- Added read-only database aliases `preview_video_url`, `poster_image_url`, `video_width`, `video_height`, `video_duration`, `video_format`, derived from the existing central media fields. `place_name` and `people_count` are stored and validated against template variables. This avoids two independently editable video configurations.
- Creator analytics uses the existing consent-respecting typed adapter. Only event type and generator type are sent; no generated text, destination, friend count, images or identity data are sent.

## Validation

| Check | Result |
|---|---|
| Lint | Pass |
| TypeScript | Pass |
| Unit tests | **111 passed**, 16 files |
| Content schema/persona/editorial validation | **162 prompts, 17 categories, 39 collections**, zero missing published image files |
| Browser tests | **22 passed**, desktop and mobile |
| Production build | Pass, local QA configuration |
| Local SQL integration | Media alias check and four invalid-state rejection checks pass; test changes rolled back |
| Accessibility | No axe violations in the new creator; existing real-video player axe check passes |
| Responsive | No horizontal overflow at 320, 375, 430, 768, 1024 and 1440 pixels |
| Manual visual review | Inspected creator/mobile and private source-reference/desktop screenshots; all four original friends retained |
| Indexability | Draft detail returns 404 publicly; private preview requires admin and is noindex; collection is noindex; both excluded from sitemap |
| Production-indexing regression | Unit test enables indexing and still excludes the draft and thin collection |
| Existing video regression | Real fragrance clip plays muted/inline on demand; failed delivery retains poster; reduced motion suppresses automatic video downloads |

Final-build mobile Lighthouse for `/reel-prompts`: **Performance 99, Accessibility 98, Best Practices 100, SEO 66**. LCP **2.214 s**, TBT **22 ms**, CLS **0**. Earlier pre-final run: 96 / 98 / 100 / 66. These are single-run local lab results, not field Core Web Vitals. Google endpoints were blocked to avoid live advertising or analytics during the audit. SEO 66 reflects the deliberately noindex QA environment. Accessibility's remaining heading-order observation is in the existing discovery cards. Full-library release Lighthouse remains outstanding until its assets are ready.

Evidence: `../../qa/friends-trip/`, including final Lighthouse JSON and mobile/desktop screenshots. The four new identity/format database rejection cases are reproducible with `local-sql-check.sql` against the disposable database only.

## Media remains outstanding

- **No Ladakh video generated or integrated.** Desired 7.5-second preview/9:16/multi-shot sequence remains queued. Actual identity continuity, anatomy, Ladakh location quality, motion, final LADAKH lettering, loop quality and video file size cannot be verified without an output.
- **No Ladakh concept poster generated.** The square supplied reference is preserved, clearly labelled and cannot be published as the finished preview. One exact 1080×1920 reference-edit job is queued in `image-manifest.json`.
- Kling was observed with 25 existing credits; selected 720p 10-second I2V required 40 credits. Five seconds was not accepted as a substitute for the requested 6–8 second multi-shot preview. Runway remained the Free workspace previously blocked by its upgrade requirement despite the displayed credit balance. The owner subsequently stopped provider attempts entirely.
- The rest of the approved overhaul still has **69 pending image jobs**. With this addition, **70 image jobs remain**. Current library: **162 retained prompts / 39 collections**, **43 locally published / 119 held as drafts**. Original editorial audit remains intact; this new concept is covered by `editorial-addendum.json`.
- The strict batch release gate correctly fails **324 content checks** across pending media, drafts and unfinished collection readiness. This is not a claim that there are 324 separate prompts. Code/test success does not make the larger release complete.

## Deployment

Migration `202609100005_friends_trip_template.sql` applied **only** to the disposable QA Supabase instance (`127.0.0.1:54421`). Existing RLS/admin protections retained. No production schema/content mutation, commit, push or deployment was made. Include the completed content/media changes in the single final verified deployment after the wider overhaul's release gate passes. No standalone Ladakh release.
