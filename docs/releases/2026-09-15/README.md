# PicMagic September 15 release

Owner explicitly approved production deployment after independently upgrading Netlify to Personal. Scope: 16 approved prompt additions and inspected assets, 20 collection links, and Profile Picture / DP Ideas collection activation. Total 91 published prompts; 95 deferred drafts remain unpublished. Existing 75 published prompts, their canonical paths, copy, assets and homepage feature flags are unchanged. No new image or video generation in this release.

## Preflight

Netlify: 1,000 plan credits available, 25.1 operational credits; auto-recharge Disabled. New plan credits expire October 15, 2026. No billing settings changed. Branch/PR deployments remain disabled. Production branch is main. Previous deploy/rollback point: 6aa38307ba1c570008d9ad04, commit fa768aa0a8c81cc36ef2de5fb8c9e887c82dc1ee.

Private production backup: `.release-private/release-2026-09-15/production-before.json`. Atomic transaction adds only new records, additive memberships and guarded profile-collection metadata; no existing prompt writes. The release transaction was rehearsed on local PostgreSQL and fully rolled back. No schema migrations are needed.

Local source prep is validated without the draft-preview override. Initial noindex browser run identified a test-configuration mismatch: the sitemap is intentionally empty with global indexing disabled. That run was interrupted and retained as `e2e-noindex-diagnostic.log`; the final local build enables production indexing for sitemap validation. This was not a production failure.

## Release order

1. Complete local checks and review.
2. Commit validated release and push main once, letting Netlify deploy images and code.
3. Verify deployed assets before executing the guarded database transaction.
4. Authenticate as existing admin and invalidate catalogue/page/sitemap caches.
5. Verify live routes and asset responses, and record deployment ID/content outcome.

Rollback must restore the previous deploy and undo only the new batch, using the private backup and checking for intervening edits. Retain additive assets. Do not blindly overwrite later editorial work.

## Final local sign-off
Lint, typecheck, 135 unit tests, content validation, release gate and local production build passed. The exact database transaction passed and rolled back. Browser suite: 73/74 initially passed; one responsive srcset/decode timing race was corrected in the test and both desktop/mobile targeted rechecks passed. No remaining failures. All 16 new routes were checked for images, copy, save/share, canonical/indexability and accessibility. Existing regressions, collection navigation and request-budget tests passed. No homepage feature changes. Source preview assets and representative mobile/desktop screenshots were manually reviewed.
