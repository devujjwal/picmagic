# Vercel Hobby migration — 18 October 2026

Owner authorized moving PicMagic to Vercel Hobby and retiring its Netlify hosting only after live verification. No purchase, paid trial, upgrade, database migration, content publication, advertising or affiliate activation is authorized. The owner currently intends personal non-commercial use; reassess Hobby eligibility before any monetization.

## Baseline and safeguards

- Source production revision: `eaf6c95ddd6c9324f3235af508f81639ee201422` (`origin/main`, verified remotely).
- Work on `codex/vercel-migration-20261018`; preserve unrelated cleanup/release-report changes.
- Vercel scope `devujjwals-projects`, project `picmagic`; existing other projects are out of scope. Hobby allowances are shared across the scope.
- Retain Supabase, all published content and 89 private drafts, canonical URLs, consent controls, disabled ads/affiliates, and private reference assets.
- Configure only application environment variables. Never upload database passwords, admin login passwords, provider tokens, local environment files or private evidence.
- Production build guard recognizes Vercel production contexts. Vercel previews remain noindex; local draft-review mode is disabled in Vercel. Hosting aliases receive a noindex header.
- Explicit Node.js 22, pnpm frozen lockfile, full existing release checks, Mumbai runtime region. Git-triggered Vercel deployment disabled during migration to prevent unreviewed builds; deploy the verified snapshot manually.

## DNS rollback baseline

GoDaddy remains authoritative (`ns75.domaincontrol.com`, `ns76.domaincontrol.com`). Only website records may change:

| Record | Before | TTL |
| --- | --- | --- |
| A `@` | `75.2.60.5` | 600 seconds |
| CNAME `www` | `picmagic-in.netlify.app.` | 1 hour |

Preserve MX `mx.zoho.in` / `mx2.zoho.in` / `mx3.zoho.in` with priorities 10 / 20 / 50, SPF, DKIM, DMARC, verification records and nameservers. Keep the Netlify project intact until DNS propagation and Vercel HTTPS are verified. Permanent deletion requires action-time confirmation and removes that hosting rollback. Moving hosting does not cancel or waive the overdue Netlify $9 invoice/subscription.

## Local validation

- Node.js 22 production build passed.
- Lint and TypeScript passed; 335 unit tests plus 9 IndexNow tests passed.
- Content, SEO, release, festival and blog checks passed (existing editorial notices retained).
- 20 desktop/mobile browser checks passed against the local production build with Google services stubbed: CSP nonce isolation, navigation/copy, protected admin, responsive poster controls, English/Hindi exports in three sizes, pixel-identical preview/export and upload/text privacy.
- Initial Vercel build stopped safely during tests because its inherited `NODE_ENV=production` selected React's production-only test runtime. The test command now explicitly uses `NODE_ENV=test` only for Vitest; the application build retains production mode. Reproduced the hosted environment locally: all 335 unit tests and 9 IndexNow tests passed.

## Release status

Pending hosted build, domain cutover and live verification. Do not interpret project creation or a successful build as a completed migration.
