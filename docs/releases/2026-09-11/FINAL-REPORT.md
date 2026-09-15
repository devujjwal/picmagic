# PicMagic production release — 11 September 2026

**The approved integration is deployed. Full post-deployment browser sign-off is blocked by the work network’s Zscaler PageRisk filter. Do not treat this as a fully passed live acceptance run.**

## Implementation and prompt audit

The complete Phase A audit covered 162 concepts and 39 collections. Its recommendations were KEEP 80, UTILITY 40, REWORK 35, MERGE 3 and DEFEATURE 4; these are historical editorial recommendations, not counts of records deleted in this release. The approved batch added eight records, bringing the audited release to **170 prompts and 40 collection records**. Every release record has one hash-validated review entry in [content-review.json](content-review.json). No canonical owners were deleted or merged.

Production now contains **75 published prompts and 95 drafts**, up from 50 published prompts. All 50 original public URLs remain published. Compared with the fresh production backup, all 50 original copyable texts changed to incorporate the reviewed identity/quality corrections; “retained unchanged” in the approved-batch report means unchanged from the corrected local Phase A copy, not unchanged from the older production database. Twenty-two ungenerated stronger rewrites remain deferred; their matching original concepts survive as unfeatured utility. Do not confuse the 25 newly published records with the eight newly authored records in this batch.

[Release differences](release-content-diff.json) lists every published slug, whether copy/media changed, its audit evidence, and every collection’s published photo/reel counts. [Complete earlier record-level audit](../../audits/creative-upgrade-2026-09-11/complete-audit.md) preserves individual reasons, identity risks, creative scores and collection recommendations. The new indexable `/collections/creative-transformations` contains twelve approved selections; only seven collections currently qualify for indexable discovery. The broader requested expansion remains incomplete under the subsequent quality-first scope.

## Preview images and identity

This batch integrated **ten new ChatGPT-generated preview images**, plus two retained selections. It adds eight detail records and updates two existing canonical owners. Together with previously staged, reviewed replacements, **12 original production preview paths changed**. Paths and reasons are in the release differences; exact generation briefs, originals, optimized assets and observations are in the [approved media manifest](../../audits/creative-batch-2026-09-11/manifest.json).

Phase A visually reviewed 86 actual full-size asset files through contact sheets and documented additional individual inspections; 79 were human-focused. This is not a claim that every image received a separate full-resolution inspection. For the unique human-focused images actually published, documented Indian/South Asian generation briefs increased from **22 of 47 before** to **47 of 60 after** (about 47% → 78%). These are provenance counts, not ethnicity guesses from appearance. Thirteen remaining human previews have briefs without that explicit default; unknown historical provenance is not relabelled as Indian. All nine human-focused new creative images use explicit fictional Indian/South Asian briefs; the tenth is a product image.

Reference photographs determine recognizable identity, ethnicity, skin tone, facial structure, approximate age and natural proportions. Preview subjects only demonstrate styling. No-reference person generation defaults to diverse Indian/South Asian subjects. Hairline and identity remain stable while concept-appropriate hairstyle, wardrobe, expression, pose and grooming can change. Child/adult compatibility is explicit. Ink/paper treatments preserve identity and relative tonal relationships within the artistic palette. Multi-panel scenes intentionally repeat one identity rather than inventing additional people. Products retain supplied design, colour, fabric, construction and only reference-supported views. The model/person contract is distinct from the product contract.

Krishna retains context-aware hair, tilak, expression and accessory guidance. Barefoot at Blue Hour uses the reference couple rather than overriding them with a preview ethnicity. Their live detail HTML returned 200 with the original canonical URLs. New reference-contract fields and admin validation support these rules for future editorial work.

## Website, SEO and reels

The homepage now leads with the twelve approved creative treatments, with duplicate imagery removed. Discovery cards remain image-first; multi-panel work is shown uncropped. Collection suggestions are compact and only link to usable destinations. Infinite discovery replaces duplicate visible pagination controls while preserving crawlable pagination when JavaScript is unavailable. Full prompt/editorial data no longer travels to the browser merely to display cards.

There are **17 published reel concepts, two with actual existing video previews**. Both existing clips are MP4, 576 × 720 (4:5), approximately 5.04 seconds, 262 KiB and 378 KiB. They are not new 9:16 generations. Fifteen published reels remain explicitly labelled still concepts. Video playback is muted, inline and looped, with poster fallback, near-viewport loading, reduced-motion/data-saver handling and at most two simultaneous preview leases. No new Kling, Runway or Codex generation occurred. The requested Ladakh video remains deferred; no fake video was substituted.

No existing canonical URL changed. The validated local sitemap contains 94 canonical URLs and excludes drafts, search, saved state, admin and thin collections. New details and the Creative Transformations collection reuse existing canonical route namespaces. Breadcrumbs, collection/item lists, visible FAQ markup and branded share images remain in place. Live sitemap membership, draft exclusion, `www` path preservation and the legacy reels redirect passed the smoke checks. Google indexing and ad approval/fill remain external decisions; no claim of approval is made.

## Tests and measured performance

| Check | Result |
|---|---|
| Lint / TypeScript | Passed |
| Unit tests | 123 passed |
| Full desktop/mobile E2E | 86 passed, no skips |
| Affected E2E after card-payload optimization | 42 passed |
| Local database RLS/Storage | 11 passed |
| Editorial database checks | Valid publish + five invalid changes correctly rejected |
| Atomic import dry run | Passed locally, rolled back |
| Production build | Passed locally and on Netlify |
| Content validation | 170 reviewed, 75 published, no missing published images, original 50 canonicals preserved |
| Responsive / accessibility | 320, 375, 430, 768, 1024, 1440 pixels and 200% zoom checked; axe journeys passed |

Mobile Lighthouse on the local production build, with Google services blocked:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| Homepage | 95 | 100 | 100 | 100 |
| Women | 100 | 100 | 100 | 100 |
| Creative Transformations | 100 | 100 | 100 | 100 |
| Four Possible Worlds detail | 100 | 100 | 100 | 100 |
| Creator | 97 | 100 | 100 | 100 |

The first homepage run scored 86. Removing full editorial data from client card props reduced HTML from 764 KB to 270 KB uncompressed and approximately 116 KB to 52 KB transferred. A concurrent-browser rerun scored 90; the final isolated run scored 95. These are measured lab results, not production field Core Web Vitals. The ten new optimized full-size WebPs total approximately 2.22 MiB; thumbnails are approximately 43–109 KiB each. No new full-size PNGs are served publicly. Detailed current logs and JSON reports are in this directory; older QA remains historical.

## Deployment and post-deployment verification

- Live URL: https://picmagic.in
- Commit: `fa768aa0a8c81cc36ef2de5fb8c9e887c82dc1ee`
- Netlify deployment: `6aa38307ba1c570008d9ad04`
- Published: **2026-09-11 04:28:08 UTC / 09:58:08 IST**
- Exactly one production deployment; no incremental deployment was made for fixes.
- Applied atomically after assets were available: `202609100003_persona_and_video.sql`, `202609100004_editorial_quality.sql`, `202609100005_friends_trip_template.sql`, `202609110001_creative_contract.sql`, and the reconciled content/import joins. Existing-record concurrency guards passed.
- Authenticated administrator session and cache invalidation succeeded. The post-import database backup confirmed 170 records, 75 published and 40 collections.
- Rollback point: Netlify `6aa2adb5aa15110008581ff9`, commit `9ffb852a08a40436f59939efdba0812bb450e211`. Before/after database snapshots and prepared guarded rollback SQL are private under `.release-private/`, excluded from Git. Rollback SQL has not been applied; it rejects changes made since this release. Review it before use, restore the prior content/deployment, and invalidate caches. Additive schema columns can remain.

[Live smoke evidence](live-smoke.json) confirms successful creative collection/details, both identity regressions, enhancement, ads.txt, robots, sitemap, redirects, optimized image, video range delivery and branded share-card responses. Home returned the new content initially but was subsequently blocked by the network filter.

**Fourteen routes were blocked by the Times Group Zscaler PageRisk filter during the final pass**, including home, discovery/category pages, create, reels, search, saved, admin login and Privacy. The response is from `Server: Zscaler/6.2`; Chrome also displays the organization’s “Website blocked / PageRisk block inbound response” page. This is not recorded as an application-generated 403 or a passed journey. The external web reader also could not open discovery. No network security setting was disabled, and no request for IT review was sent without authorization. A security review is required before the remaining live browser acceptance checks can be completed from this network. Successful local tests do not replace that outstanding verification.

## Cost and outstanding work

Netlify Free remained $0 with no payment card or automatic top-ups. The last verified pre-release balance was 21.6 credits; this single deployment costs 15, leaving approximately 6.6 before subsequent traffic. Exhausting the free allowance can pause the site until the October 10 reset. No purchases, upgrades or paid trials were made.

Outstanding: Zscaler review and blocked live checks; 95 deferred drafts and unapproved reserve media; the wider not-yet-qualified collection expansion; newly requested video generation; Google’s eventual approval/indexing outcomes; limited free hosting headroom. The approved creative integration is live, but the original entire expanded-library/media wish list and full live sign-off are not represented as complete.
