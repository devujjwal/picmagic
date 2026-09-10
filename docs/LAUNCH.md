# PicMagic launch record

Launched on **10 September 2026** at **https://picmagic.in**. The custom domain has working HTTPS, protected administration and production indexing enabled. Ads and GA4 are disabled. No external account-access prerequisites remain.

## Production services

- Netlify Free: `picmagic-in`, site ID `2b145a4c-9cf9-4e4d-985c-ad52357569f0`, team `devujjwal`.
- Current production deployment: `6aa2855b992a361b8d834268` (application commit `fc5cda0`). Node 22 build and function runtime; Next.js adapter 5.15.13.
- Supabase Free: `PicMagic`, reference `lxecbrvzpmgjmsqiachc`, Mumbai (`ap-south-1`). Migration applied and 50 prompts imported.
- Public operator: Ujjwal Paul. Contact: devujjwal1989@gmail.com.
- Netlify automatic credit top-ups remain disabled. No payment method, paid add-on or automatic purchase was enabled. Default owner usage warnings are sent at 50%, 75% and 100%.
- `VS-MJR Infotech` (`zbohtifndwvokmeewsne`) is paused as explicitly authorized to free a Supabase slot. `telecotrade` remains online.

## DNS and HTTPS

GoDaddy remains the DNS provider. Only the apex parking A record and `www` CNAME were replaced; Google's verification TXT was added. NS, SOA, `_domainconnect` and `_dmarc` records were preserved. Public DNS returns apex A `75.2.60.5` and `www` CNAME `picmagic-in.netlify.app`.

Netlify issued its managed certificate for `picmagic.in` and `www.picmagic.in` on 10 September at 10:07:40 UTC; its current expiry is 9 December 2026. Renewal is managed by Netlify. Strict TLS checks return 200 for the apex. HTTP and `www` redirect with 301 to the HTTPS apex while preserving paths and query strings. The initial certificate delay resolved after Netlify provisioning; no certificate validation was bypassed. Independent HTTP-01 diagnostics passed for both hostnames.

## Administrator access

Owner login, admin membership, uploads, private draft preview, publishing, cache refresh, canonical rename/redirect, duplication and unpublishing passed on the hosted application backed by the production Supabase project. Two disposable drafts and their two uploaded files were removed afterward; the public catalog and search contain exactly 50 records. A final check on the real apex domain also passed owner login, authenticated SVG-upload rejection and sign-out (`docs/qa/production-admin-access.json`). Anonymous writes and public signup are rejected. Auth signup is disabled globally and RLS restricts content and Storage writes to administrators.

The owner credentials are in `.env.admin.local` (mode 0600, Git-ignored) on the owner's Mac. Database/provisioning credentials are in `.env.production.local` (mode 0600, Git-ignored). Neither file was included in the clean deployment directory. No service-role key or password was imported into Netlify. Keep these files private; administrator password rotation is available through Supabase Auth.

## Google Search Console

Domain property `picmagic.in` was verified in the owner's Google account using Google's supplied DNS TXT record. Keep that record in DNS.

`https://picmagic.in/sitemap.xml` was submitted successfully. Google reported **Success**, **65 discovered pages**, and a last-read date of 10 September 2026.

Live smartphone inspections passed for the homepage, `/ai-prompts/women`, `/collections/romantic`, the photo detail `/ai-prompts/women/golden-hour-draped-in-tradition`, and the reel detail `/reel-prompts/the-anniversary-slow-dance`. Every live test reported successful fetching, crawl allowed, indexing allowed and the expected user-declared canonical. Google's rendered screenshots were reviewed. Evidence is in `docs/qa/search-console.json`.

Google has not yet indexed these new pages. Its selected canonical is only determined after indexing. These are successful technical checks, not a guarantee of indexing or ranking.

## Validation and operating handoff

The production build, lint, typecheck and 30 unit tests passed. Thirty production public browser checks passed across desktop/mobile, followed by six targeted checks after the final homepage image optimization. The full hosted publishing journey passed. Local Supabase passed 11 RLS/Storage/redirect checks and database-outage tests. Final SEO checks require descriptions and canonicals in the initial document head and verify 65 unique sitemap URLs, private/draft exclusion, collection-route isolation and branded share images.

Final mobile Lighthouse measurements use three runs per representative page on the real HTTPS domain; medians and individual results are retained in `docs/qa/hosted-lighthouse-summary.json` and the linked reports. See [the implementation report](IMPLEMENTATION.md) for the scores, ranges, architecture, routes, schema and remaining product improvements. These are lab measurements; field Core Web Vitals require real traffic.

The older Chromium headless-shell test runs intermittently stalled on static assets. Full Chromium passed targeted failures and the complete suite with normal HTTP/2 behavior; the committed Playwright configuration now uses full Chromium. No application checks or browser security settings were weakened to pass tests.

## Follow-up and rollback

- Recheck Search Console's Sitemaps and Page Indexing reports around 13 and 17 September; investigate unexpected exclusions, fetch failures or canonical mismatches. Compare Google-selected canonicals after crawling. This is documented follow-up guidance, not a scheduled automation.
- Review hosting/database usage and availability within the Free allowances. Enable ads or GA4 only after configuring actual account IDs, consent requirements and integration checks.
- Restore a previous known-good deployment through Netlify Deploys if necessary; `6aa283de4d2e840fb032d8c4` is the preceding working release. Do not reverse database migrations or overwrite editorial records during a code rollback.
- Setup, secure first-admin provisioning, content/image replacement, deployment, rollback and optional Vercel guidance are in [DEPLOYMENT.md](DEPLOYMENT.md).
