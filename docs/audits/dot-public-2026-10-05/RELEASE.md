# Authorized Production Release, 5 October 2026

The owner explicitly approved the production release to `main` and the scoped
Supabase content sync after reviewing the local remediation. This approval does
not enable advertising or authorize an AdSense review submission.

## Pre-Push Evidence

- Remote `main` remains at reviewed baseline `c21f970`; the development branch
  starts there with no intervening remote changes.
- GitHub: no Actions workflows or open PRs. The existing active push webhook
  targets Netlify; it is retained for the one production push.
- Netlify: production branch `main`, builds active, branch deploys limited to
  production, PR previews disabled, no configured build hooks observed.
- Personal allowance: 864.2 of 1,000 included credits available, expiring
  15 October. Auto recharge is disabled. No billing setting changed.
- Production `NEXT_PUBLIC_ADS_ENABLED=false` was inspected directly. The new
  release keeps this hold; no ad or consent setting was changed.
- The standard `pnpm build` using Next.js 16.3.4 Turbopack passed, including
  TypeScript, 144 generated pages and generated preview cache headers. It uses
  an isolated local build directory, seed content and disabled advertising.
- Prior local evidence: 232 unit tests, 73 browser checks across desktop/mobile
  and enabled/disabled discovery, lint, TypeScript, content/SEO/release checks.
  Three focused standard-build browser smoke checks also passed: all public HTML
  and redirects, no-JavaScript guide/pagination, and 320px controls/analytics
  withdrawal. Google services were stubbed, not live regional evidence.

## Database Sync Completed

The production rollback preflight passed against the configured PicMagic
Supabase project. A private full-catalog backup was then saved under the
gitignored `.release-private/dot-release-20261005/` directory.

A second production rehearsal added full-catalog before/after assertions and
table locks. It passed and rolled back. The explicitly approved application then
committed atomically; an independent read-only verification passed afterward:

- Exactly 27 reviewed published prompt records received their approved fields,
  including the first-dance reference contract and nine history-backed dates.
- Four category descriptions changed. Edited prompt records without a specific
  historical timestamp receive the actual editorial sync timestamp.
- All other values across prompts, categories, collections and memberships are
  unchanged. The catalog remains 186 records, 91 published and 95 deferred drafts.
- No publication/indexability flags, assets, private portraits, draft activation,
  collection membership or homepage ordering were changed.
- All work aborts on unexpected changes; neither the old updater nor a whole-
  catalog overwrite was used. No schema migration was introduced.

The checked-in `release-preview.sql` remains a rollback-only reference. The
authorized execution wrapper and private snapshots are gitignored and excluded
from the commit. No credentials are included in the release artifacts.

## Code Deployment And Remaining Gates

This document records completed pre-push checks and the verified content sync;
it does not pre-claim a successful code deployment. Push the complete reviewed
batch to `main` once and confirm that Netlify publishes that exact commit. Keep
post-release evidence locally without triggering another code deployment.

Minimal live smoke checks must confirm the three permanent redirects, inclusive
guide/examples, sitemap source exclusions, cinematic collection navigation,
corrected content/date chronology and representative privacy/creator surfaces.
The full local browser matrix must not be repeated against production.

The prior work-Chrome script-blocking observation and actual regional CMP/Auto
ads/ownership/account limitations remain unresolved until separately verified.
AdSense still showed Low value content at the account inspection. Neither this
release nor the public-content audit guarantees approval; do not submit a review
or enable ads automatically.
