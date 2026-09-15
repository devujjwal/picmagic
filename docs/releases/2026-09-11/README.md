# PicMagic creative integration — 11 September 2026

Status: deployed in one production release. Full live browser sign-off is blocked by the work network’s Zscaler filter. See [FINAL-REPORT.md](FINAL-REPORT.md) for deployment evidence, exact results and remaining dependencies.

## Release scope

This integrates the approved twelve-selection creative batch: eight new detail records, two updated existing canonical owners, and two retained previews/prompts. Ten new ChatGPT preview images and their optimized thumbnails are now in `public/previews/`. The separate `image_brief` and copyable prompt remain independent. `reference_contract`, `transformation_type` and uncropped wide layouts support art palettes, repeated identity depictions and product-supported views. Admin publishing validates these rules.

The final local catalogue contains 170 prompts: 75 published, 95 deferred drafts; 40 collection records. All 50 existing public canonical owners remain published at their existing URLs. Twenty-two proposed stronger rewrites had no approved aligned preview. Their already-reviewed original concepts, corrected for reference identity, are retained as unfeatured utility; the pending rewrites remain in `deferred-original-rewrites.json` and the Phase A report. This preserves existing URLs without pretending the incomplete new imagery is ready.

The new indexable Creative Transformations collection contains all twelve selections. Other collections only become discoverable/indexable when their actual published membership meets the existing quality threshold. The full set of originally requested expansion collections is not all ready: unapproved/missing media and reserve concepts remain deferred under the subsequent quality-first brief. No new video generation or purchases occurred. Existing video playback infrastructure remains, with poster fallback and lazy downloads; static reels are explicitly labelled still concepts.

## Identity and audit

See `content-review.json` for an entry and current copy hash for every record, linked to the complete Phase A audit or approved media batch. G01–G09 corrections include age compatibility, owner/vehicle identity, art palettes, salt-road subject count, pet identity, source crop, reference-supported garment views and temporal reel actions. Krishna's correct copyable text and preview remain unchanged; its stale regeneration brief is corrected. Barefoot at Blue Hour retains its reference-first beach concept and actual matching preview; the ungenerated bioluminescent rewrite remains deferred.

The homepage leads with the approved creative batch, removes repeated filler sections, and explains that generation happens in the user's chosen image tool. Utility remains accessible separately. Cards retain Save and title/image navigation. Infinite discovery retains crawlable no-JavaScript pagination without showing duplicate pagination controls. Compact collection recommendations link only to usable destinations.

## Release safety

- Zero hosting spend; no payment method or upgrades. Netlify was Free with 21.6 credits remaining at the first check. One deploy costs 15 credits. Recheck immediately before release.
- Fresh content backup: `.release-private/production-before.json` (ignored, private). No production prompt text changed since Phase A.
- `scripts/content/prepare-release.py` prepares one optimistic, atomic content/migration transaction. It checks existing records before writes; concurrent editorial changes abort it.
- Nullable migration additions support rolling code deployment. Do not import data before the new image files are available on the deployed site. After the transaction, an authenticated administrator calls `/api/admin/revalidate` to expire catalog, search, page and sitemap caches. This endpoint accepts no arbitrary tags/paths, requires a trusted origin, a verified session and admin membership.
- Rollback: retain the previous Netlify deploy and private content backup. Restore backed-up public content (leaving additive nullable columns intact), invalidate caches, and restore the prior deploy. Do not delete historical assets. Never roll back by blindly overwriting newer editorial changes.

## Validation

Fresh checks: lint and TypeScript passed; 123 unit tests passed; all 86 desktop/mobile browser tests passed with no skips, including admin publishing. Responsive checks at 320, 375, 430, 768, 1024 and 1440 pixels and 200% zoom have no overflow. SEO validation passed with draft exclusion, canonical ownership and share-image response verified. Historical QA under `docs/qa/` and historical audits are not proof of this release. Current local unit suite: 123 tests passed. Current local database RLS/Storage checks: 11 passed; editorial trigger checks: valid publication plus five rejected invalid changes passed. The generated release SQL executed successfully locally and rolled back.

## Outstanding scope

- 95 deferred drafts, reserve proposals, missing/unapproved media and stronger rewrites outside the approved batch remain deferred.
- New video assets remain intentionally deferred by owner instruction; no new Kling/Runway/Codex submissions.
- Google ad approval/fill and eventual search indexing are external decisions; consent behavior is tested using local Google stubs.
- Netlify's small remaining allowance may pause service before reset. No purchase is authorized.

Previous live rollback deployment: 6aa2adb5aa15110008581ff9 (commit 9ffb852a08a40436f59939efdba0812bb450e211).

## Measured performance

Mobile Lighthouse, local production build with Google requests blocked: homepage 95; Women category 100; Creative Transformations 100; multi-panel detail 100; creator 97. Accessibility, Best Practices and SEO 100 on every measured page. These are lab results, not field Core Web Vitals. The initial homepage score was 86; trimming full editorial/prompt data from card props reduced uncompressed HTML from 764 KB to 270 KB and transferred HTML from 116 KB to 52 KB. A final isolated homepage measurement scored 95; the concurrent-browser run scored 90. No data was hidden or viewport changed to improve the score.

All 86 E2E checks passed before this performance optimization; 42 affected desktop/mobile checks passed again afterward. All 123 unit tests, TypeScript, lint, content validation and the production build passed.

Final pre-release Netlify check: 21.6 of 300 credits remain; Free $0; no card, invoices or receipts. This deployment uses 15 credits, leaving approximately 6.6 for traffic until October 10. No top-ups or purchases are enabled.
