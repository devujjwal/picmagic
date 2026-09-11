# PicMagic — editorial handoff, media paused

## Latest addition and owner steering (10 September)

See `../friends-trip-2026-09/README.md` for the separately requested Friends Travel addition. One score-5 concept is approved editorially; retained library is now **162 prompts / 39 collections**, with **43 ready locally / 119 drafts**. The earlier 163-record audit and 161-retained summary below describe their original review snapshot, not the new total. Original media queue: 69 pending images; addition: one reference-based Ladakh poster pending. The added Friends Travel collection has one concept and stays noindex.

**The owner has now stopped Kling/Runway video attempts. Do not resume them or spend credits.** Codex cannot generate this reel video in the current environment. Keep exact briefs queued and continue the rest of the overhaul. This supersedes the video-generation step below.

Migration `202609100005_friends_trip_template.sql` was applied only to disposable local QA. No standalone deployment. The Ladakh source photo is a clearly labelled square reference, not a finished 9:16 Ladakh poster/video. Do not publish it as generated inspiration.

Read EDITORIAL-REVIEW.md and editorial-summary.json first. This stage does not complete the production release.

- All 163 original/expanded records reviewed; 34 retained, 127 rewritten, 2 duplicate photo utilities merged. Retained library: 161 records, 38 collections.
- Creative discovery: 72 score-4 and 55 score-5 concepts. 34 score-3 utilities are separately labelled and excluded from homepage/featured discovery.
- All 50 original production canonical paths preserved. New never-deployed slugs updated to match their concepts.
- Approved-image-manifest.json has 70 jobs: one existing pre-pause kitchen output reviewed/integrated; **69 still pending** (63 replacement concepts, 6 seller utility images). No new media generation requests during the editorial pass.
- Approved-video-manifest.json selects eight creative reels with exact hooks, actions, payoffs and poster dependencies. Existing fragrance utility clip remains. The rewritten anniversary uses no old clip. Do not generate archived manifests.
- ChatGPT preferred; owner permits Codex built-in ONLY after ChatGPT limits are exhausted. No paid API, subscriptions, extra credits or upgrades. Existing Kling credits only; last known balance 25, not assumed sufficient for all jobs. Runway Free is not available for the required paid generation feature.
- 43 records currently asset-ready locally, 118 held for media. This deliberate staging restriction was NOT deployed.
- Migration 202609100004_editorial_quality.sql applied to disposable local QA only. Production remains unchanged. Check editorial-validation.json for exact current test evidence.

## Next authorized work after the editorial handoff

1. Use only approved-image-manifest.json; review original outputs for anatomy, identity, visual story, exact product detail and India-first house personas. Do not regenerate an existing usable output without checking it.
2. Image review files must include editorialReviewVersion and reviewedPromptHashes for every related slug. Integrate-image.mjs refuses stale review hashes. Then sync-asset-queue.mjs and activate-reviewed-content.mjs update local state only.
3. Generate selected reel clips only where existing free/owned credits permit. Review 9:16 crop/keyframe before I2V when a shared photo poster is 4:5. Record provider, exact prompt, source poster, duration, review and optimized bytes.
4. Preserve the separate preview persona / reference-first user prompt model. Do not use the house preview face as the user's identity.
5. Complete media, local migrations, full E2E/admin/accessibility/responsive/performance/SEO validation. Final Lighthouse must use the asset-complete production build; preliminary results are not release results.
6. Only after release checks pass, recheck Netlify Free allowance and make one production deployment. Apply controlled content updates and verify live public/admin/canonical/media journeys. Deliver consolidated A–J release report.

No production push, deployment, paid purchase or production database mutation occurred in this editorial stage. Historical status and old media queues are archived; they are not instructions for future generation.
