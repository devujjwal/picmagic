# PicMagic launch record

Launched on **10 September 2026** at **https://picmagic.in**. The custom domain has working HTTPS, protected administration and production indexing enabled. AdSense integration is enabled with CMP-controlled manual placements; Google site review is pending. GA4 is configured for PicMagic with explicit analytics consent; see [GA4 operations](GA4.md). No external account-access prerequisites remain.

## Production services

- Netlify Free: `picmagic-in`, site ID `2b145a4c-9cf9-4e4d-985c-ad52357569f0`, team `devujjwal`.
- Verified automatic production deployment: `6aa28bc33b1c180008583594` (commit `42f2bd0`), published 10 September 2026 at 16:22:44 IST after a real GitHub push. Node 22 build and function runtime; Next.js adapter 5.15.13.
- Private source repository: [devujjwal/picmagic](https://github.com/devujjwal/picmagic). Pushes to `main` automatically validate, build and publish through the existing Netlify project. GitHub delivered the push webhook with HTTP 204; the deployment completed in 55 seconds. No manual deploy command was used for this verification.
- The remote build passed lint, type checking, 30 unit tests, 50-prompt content validation and the production build. Eight desktop/mobile production smoke tests and the 65-URL sitemap/SEO audit passed afterward. Evidence: [continuous-deployment.json](qa/continuous-deployment.json); operating guidance: [automatic deployment](DEPLOYMENT.md#automatic-deployment-from-github).
- Supabase Free: `PicMagic`, reference `lxecbrvzpmgjmsqiachc`, Mumbai (`ap-south-1`). Migration applied and 50 prompts imported.
- Public operator: Ujjwal Paul. Contact: devujjwal1989@gmail.com.
- Netlify automatic credit top-ups remain disabled. No payment method, paid add-on or automatic purchase was enabled. Default owner usage warnings are sent at 50%, 75% and 100%.
- `VS-MJR Infotech` (`zbohtifndwvokmeewsne`) is paused as explicitly authorized to free a Supabase slot. `telecotrade` remains online.

## AdSense activation

Production deployment `6aa29046864db90009de565e` (commit `3f31b29`) was published automatically from GitHub on 10 September 2026 at 16:42:04 IST. Ownership was verified and review requested; Google currently reports **Getting ready**. Three manual display units and Google’s three-choice European regulations message are configured. Auto ads and Auto optimize are off. The live `ads.txt` is correct; Google’s dashboard has not yet recognized it. Integration enabled is not site approval or proof of served ads. See [ADSENSE.md](ADSENSE.md) and [activation evidence](qa/adsense-activation.json).

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

The production build, lint, typecheck and 37 unit tests passed after AdSense integration. Thirty production public browser checks passed across desktop/mobile, followed by six targeted checks after the final homepage image optimization. The full hosted publishing journey passed. Local Supabase passed 11 RLS/Storage/redirect checks and database-outage tests. Final SEO checks require descriptions and canonicals in the initial document head and verify 65 unique sitemap URLs, private/draft exclusion, collection-route isolation and branded share images.

The pre-advertising mobile Lighthouse measurements use three runs per representative page on the real HTTPS domain; medians and individual results are retained in `docs/qa/hosted-lighthouse-summary.json` and the linked reports. See [the implementation report](IMPLEMENTATION.md) for the scores, ranges, architecture, routes, schema and remaining product improvements. These are lab measurements; field Core Web Vitals require real traffic.

The older Chromium headless-shell test runs intermittently stalled on static assets. Full Chromium passed targeted failures and the complete suite with normal HTTP/2 behavior; the committed Playwright configuration now uses full Chromium. No application checks or browser security settings were weakened to pass tests.

## Follow-up and rollback

- Recheck Search Console's Sitemaps and Page Indexing reports around 13 and 17 September; investigate unexpected exclusions, fetch failures or canonical mismatches. Compare Google-selected canonicals after crawling. This is documented follow-up guidance, not a scheduled automation.
- Review hosting/database usage and availability within the Free allowances. Check AdSense site review and ads.txt processing, then verify ad fill, regional Google CMP delivery and performance after approval. GA4 is configured for PicMagic with explicit analytics consent; see [GA4 operations](GA4.md). See [AdSense operations](ADSENSE.md).
- Restore a previous known-good deployment through Netlify Deploys if necessary; `6aa283de4d2e840fb032d8c4` is the preceding working release. Do not reverse database migrations or overwrite editorial records during a code rollback.
- Setup, secure first-admin provisioning, content/image replacement, deployment, rollback and optional Vercel guidance are in [DEPLOYMENT.md](DEPLOYMENT.md).
