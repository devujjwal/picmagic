# Blog release preflight — 6 October 2026

Owner approval covers the exact five audited articles whose source-file SHA-256 is `2201fd540ebe517fa9007a8a42743b68db0df0ad324ad7b9e04dcdcb9bc52312`, the reviewed blog infrastructure, migration, author and relationships. Publication is authorized; advertising and unrelated catalogue changes are not.

## Scope and controls

- Starting feature branch: `codex/postrelease-audit-oct5`; HEAD, local main and remote main all `45a5c63bc1d07a1caaa05a3c2b125cd9d4b47a69` before release. No unreleased ancestor commits.
- Three unrelated audit files remain outside the release: `docs/audits/cta-discovery-2026-10-05.md`, `docs/audits/postrelease-fixes-2026-10-05/RELEASE.md`, and `docs/audits/postrelease-fixes-2026-10-05/live-smoke.json`.
- Netlify dashboard: Personal plan, 814.2/1000 credits remaining before release, recharge disabled. Production main only; branch deployments restricted to production, PR previews disabled, no build hooks. GitHub: no open PRs or Actions workflows. Build command `pnpm build:deploy`.
- Nonsecret production flags verified individually: `CONTENT_SOURCE=supabase`, indexing true, ads false. No configuration changes.
- Supabase target `lxecbrvzpmgjmsqiachc`; no pre-existing blog tables. Existing `is_admin()` verified. Apply only `202610060001_blog.sql`; do not bulk-push other local migration files.

## Data procedure

Private read-only backups capture existing schema/migration state and full rows for prompts, categories, collections, memberships, tags, prompt tags and redirects. The exact blog transaction was rehearsed in production and rolled back. It creates only blog objects, imports the approved PicMagic Editorial registry record and five audited articles, verifies draft privacy before publication, then sets published/indexable with transaction-time publication dates. The reviewed migration's initial author wording is synchronized to the approved local author registry. No article body, relationship, image, SEO or conversion fields are changed.

Before/after assertions compare every backed-up catalogue field, require exactly five published/indexable articles and one author, compare article JSON against the approved source except publication state/timestamps, and check anonymous access and ordinary-user write denial. Migration history is recorded atomically. The source JSON remains unchanged as the audited local draft record; production publication state is a separate envelope. No development seed script or QA fixture targets production.

## Validation

Fresh lint, typecheck, 261 unit tests, blog/content/SEO/release-content checks and local production build passed. All 20 local database authorization/publication checks passed. Blog Playwright suite passed 14/14 on rerun; an initial desktop sitemap assertion received stale data from the reused local build cache, while the later mobile check passed. No code correction was needed; full rerun passed. Existing catalogue checks report pre-existing advisory overlaps/shared previews, outside this release.

Browser tests stub Google ads/analytics. General prompt/analytics regression checks and live verification are recorded in the final production report.

## Rollback

Restore existing Netlify deployment `6ac3d0aef731d7000895844e` (commit `45a5c63bc1d07a1caaa05a3c2b125cd9d4b47a69`) if the release introduces production, authorization, database, major SEO or existing-route errors. Return only the five approved article IDs to review/non-indexable if content rollback is necessary; preserve first-publication history and the additive blog schema. Never restore the entire catalogue over concurrent legitimate changes. Private backups remain local under `.release-private/blog-release-20261006/` and are excluded from Git.
