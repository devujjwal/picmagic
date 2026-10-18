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
- Hosted retry passed 334/335 tests; the branding test correctly detected that the upload exclusions omitted its public master-logo SVG fixture. Allowlisted that single tracked SVG, keeping all other social exports and private assets excluded.

## Release and cutover verification

- Deployed application revision: `3fef809` (subsequent documentation-only commits do not require a redeploy).
- Ready production deployment: `dpl_7tQzizFGufVAtSsEnnJJdbe8pFG1`, https://picmagic-83eqlqbi9-devujjwals-projects.vercel.app.
- Public hosting alias: https://picmagic-eta.vercel.app. Homepage, poster maker and page sitemap returned HTTP 200 with `Server: Vercel`, canonical `picmagic.in` addresses and alias-only `X-Robots-Tag: noindex, nofollow`.
- Vercel full validation/build passed after the two packaging corrections above. Runtime functions are in `bom1` and approximately 11.24 MB each.
- On October 18 around 06:35 UTC / 12:05 IST, changed only A `@` to `216.198.79.1` (600 seconds) and CNAME `www` to `aeeb0af4e049d0c3.vercel-dns-017.com.` (1 hour). GoDaddy confirmed both saves. All other 13 records were left untouched.
- Vercel showed **Valid Configuration** for both custom domains after SSL issuance. Google `8.8.8.8` and Cloudflare `1.1.1.1` returned the new A and CNAME records; some local/authoritative-edge responses were still stale during propagation.
- The first six-request normal-DNS smoke reached the still-healthy Netlify origin via this machine's cache. Six additional requests pinned to Vercel's newly published IP, with normal certificate validation, verified the actual custom-domain Vercel origin: `/`, `/robots.txt`, `/sitemap.xml`, `/sitemap-pages.xml`, `/festival-poster-maker` all HTTP 200, and `www` HTTP 308 to `https://picmagic.in/`. Public pages retain `index, follow`, correct canonicals and no accidental noindex header. Sitemap index has two children; page sitemap has 135 canonical URLs including the poster maker and no admin/preview/hosting-alias URLs.
- Hosted poster editor loaded its artwork/fonts, enabled export and produced no captured browser warnings/errors; the complete export/privacy matrix was tested locally, not repeated against production. No new analytics consent was granted.
- Netlify automatic builds are **Stopped**. Existing branch deploys / Deploy Previews remain disabled; no build hooks, GitHub workflows or open PRs were present. No Vercel repository connection or automated build trigger was enabled.
- Supabase, content, private references, mail services, ads/affiliate settings and existing URLs were not changed. No paid plan, trial, credit purchase or payment detail was added.

## Pending retirement

Netlify project `picmagic-in` remains intact for cached DNS visitors and rollback.
Do not delete it before the prior one-hour CNAME TTL has elapsed (allow until
**13:10 IST on October 18**, then recheck DNS/HTTPS). This is a minimum cache window,
not a guarantee of worldwide propagation. Permanent browser deletion requires
action-time confirmation; preserve source/configuration and do not delete the
Supabase project or any other provider/account/project.

The overdue $9 Netlify invoice and Personal subscription remain unresolved.
Project deletion alone is not evidence that the subscription has ended. Do not
pay it or add a card without explicit authorization.

Private screenshots are under `.release-private/vercel-migration-2026-10-18/`;
they are excluded from Git and deployments. Keep Netlify rollback DNS values above
until retirement is complete.
