# Authorized post-release remediation release — 5 October 2026

The owner subsequently instructed: “make the changes live post than review the live site using dot again”. This supersedes the initial local-only restriction for this reviewed batch, including the exact two-record content patch. No advertising activation, AdSense/indexing request, social publishing, authentication change, private publication, media generation or purchase is included.

## Pre-release evidence

- Remote main remains `4d70ca62cc85b6d59d7e2a4584dcc7517ae1dd76`; no open PRs or GitHub workflows. Netlify production branch is main, branch builds are restricted to main, PR previews disabled, and no build hooks exist.
- Netlify Personal dashboard: 848.1/1,000 credits remaining, expiry 15 October; auto recharge disabled. Every deployment-context value of NEXT_PUBLIC_ADS_ENABLED remains false. No billing/configuration settings changed.
- Read-only production snapshot confirms 186 prompts, 91 published and 95 drafts. All previous release fields match its independent full-catalog verification. Both new target records match all substantive old values and protected guards. Only updated_at guards were rebased to the exact live timestamp from the previous approved release; see live-baseline-verification.json.
- Production transaction rehearsal passed and rolled back. Full before/after comparisons cover prompts, categories, collections and collection_prompts; exactly two prompt records may change, plus their editorial timestamps. All drafts, publication/indexability flags, previews, collection memberships and ordering remain identical.
- Disposable PostgreSQL regression passes forward preview/rollback, exact two-record apply, protected-field checks, late-conflict atomicity, stale apply rejection and guarded rollback.
- Desktop prompt/copy/Shorten/age/focus, progress/manual pages/history/filters, search/save/privacy tests passed. A 320px test reproduced mobile bottom-navigation interception of Copy. Added document scroll padding in app/globals.css to keep scroll targets above the navigation. Initial 390px teardown was affected by concurrent test-output cleanup; the consolidated rerun is the authoritative result.

Build, complete browser results, production commit/deployment and Dot findings are recorded below as each completes. The earlier README/browser-blocked.log are preserved historical evidence; sanctioned execution now supports these local browser tests without changing security controls.

## Local release validation

Final production `pnpm build` (Turbopack) passes. All 251 unit/component tests in 42 files pass; lint, TypeScript, formatting and diff checks pass. Content validation preserves 186 records/95 drafts; SEO check has zero errors and 41 pre-existing review notices; release validation preserves 91 published records and all 50 original canonical owners. Temporary generated Next configuration changes were restored and build outputs remain excluded from Git.

All **16 browser tests pass** in the consolidated final run: desktop 1180px, 390px and 320px each cover creator/reel/friends-trip output, full/short clipboard equality, deliberate age choices, source-preserving lighting, wizard Back/Continue/focus, loaded progress, page 2/3/self-canonicals/history/manual navigation, filters, page-4 404, menus/keyboard, search result/no-result, save/unsave and privacy rejection/reopening. Existing no-script/source-preservation/date and reel playback/pause/poster-failure/reduced-motion checks also pass. Google services were stubbed; these results do not verify actual regional CMP or analytics/network compliance.

## Production content application

At 2026-10-05T14:11:47.049Z, the approved transaction committed exactly two prompt records (Golden Hour framing/camera; Outfit prompt_text) plus editorial timestamps. Independent read-only full-catalog verification passed: all other prompt fields, all 95 drafts, categories, collections and collection memberships/order remain unchanged. The database-forward.sql/database-rollback.sql files remain rollback-only review/rehearsal artifacts; the approved execution used a private wrapper with catalogue locks, full before/after assertions and the backed-up observation timestamp. Private backup and execution records remain gitignored. No broad seed, migration or publication change was performed.

Rollback is retained for the exact reviewed fields with after-value checks and one-row counts. It has not been applied; live corrections are active.
