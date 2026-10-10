# Ordinary AI tool recommendations — 10 October 2026 release

The owner reviewed the local photo, reel, blog and protected admin screens, then
approved proceeding with one production code release plus the reviewed
`202610100001_affiliate_tools.sql` migration and eight ordinary provider records.
Affiliate monetization and advertising remain disabled. No application,
commercial acceptance, paid generation or affiliate activation is included.

## Preflight

- Production baseline: commit `3861aff04325d58b5b90f4149c39e33338bf9adc`;
  the feature branch starts from the same commit. Remote main was checked again.
- Netlify: existing Personal plan, **789.8/1,000 credits remaining**, expiry
  15 October; auto-recharge disabled. One normal production deploy is the only
  planned allowance-consuming build. No purchase, upgrade or recharge change.
- Production branch `main`; branch deploys production-only; PR previews disabled;
  no build hooks, open GitHub PRs or Actions workflows. Active build command
  `pnpm build:deploy`. No feature-branch push or PR is necessary.
- Production advertising flag verified `false` without revealing other values.
  `AFFILIATE_MONETIZATION_ENABLED=false` was saved for all deployment contexts;
  the variable change did not trigger a build.
- Real GA4 stream `G-DY3MC34E0S` / `15753357674`, PicMagic, `https://picmagic.in`:
  Enhanced Measurement's enable switch verified **off**. No analytics-account
  setting was modified. Custom analytics continue to require consent.

## Validation and preservation

Fresh lint, normal route typecheck, **300 unit tests**, content, SEO,
release-content and blog validators passed. The isolated local production build
passed with the disposable backend, monetization/ads disabled and a test GA ID.
The implementation's **54 desktop/mobile browser tests**, two expanded admin
checks and **22 database assertions** remain applicable; no application logic was
changed after those checks. Existing catalogue overlap/shared-preview advisories
are retained, not relabelled as fixed.

A new private production snapshot records exact rows from the catalogue,
memberships, redirects, tags, blog/author/redirect tables and existing admin-user
table. Baseline counts are **186 prompts, 91 published, 95 drafts and five
published articles**. The application and original publication state remain
intact. Private snapshots, credentials, browser state and screenshots are
gitignored and excluded from the commit and deployment.

The exact production migration and eight nonmonetized records were rehearsed in
a transaction and **rolled back successfully**. Anonymous access to private
provider rows is denied; ordinary authenticated writes are denied; the public
RPC contains eight enabled editorial records, no private approval notes,
no referral URLs and no monetization-ready records. Existing row values,
authorization function and unrelated migrations are compared exactly before and
after; lock and statement timeouts abort instead of permitting a partial change.
Actual application uses the same fingerprinted transaction with one commit,
not a general `supabase db push` or catalogue seed command.

The four unrelated modified/untracked audit files identified in Phase A are
preserved outside the release commit. Generated Next files are restored to the
normal repository configuration. Temporary local blog review fixtures are
restored to their exact original rows after review.

## Publication and live verification

Production application/deployment results will be recorded here after the single
authorized release. No referral URL can earn commission during this release.
Only approved, freshly verified merchant records plus a separate activation
approval may enable monetization later.

Private release evidence is under
`.release-private/affiliate-release-20261010/`. The pre-release published
Netlify deploy `6ac4b729835cbf0008763ca2` is the code rollback point. The additive affiliate schema can
remain unused if code is rolled back; do not overwrite the catalogue or remove
legitimate concurrent admin edits to roll back a recommendation feature.

Minimal live checks cover photo, reel, blog, legal disclosures, protected admin,
ordinary destinations, catalogue preservation and deployment identity. Do not
click affiliate links, generate ad impressions, submit provider applications,
purchase credits or submit AdSense/Search Console requests.
