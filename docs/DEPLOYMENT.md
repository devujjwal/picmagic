# PicMagic deployment and operations

## Launch requirements

Launch is complete only after public HTTPS, real Supabase publishing, domain redirects, and the indexing checks below have passed. A seed-mode localhost preview is not the production launch.

Use dedicated PicMagic projects in the owner’s Netlify and Supabase accounts. Netlify Free is the approved starting tier. Keep automatic credit purchases disabled and enable available usage notifications. Free-tier exhaustion can pause the website. Supabase Free capacity and availability also need monitoring; do not promise an SLA.

## Environment

Copy `.env.example` to `.env.local` for development. `CONTENT_SOURCE=seed` explicitly selects the bundled catalog and requires no external credentials. There is no automatic production-to-seed fallback.

Production requires:

- `CONTENT_SOURCE=supabase`
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the publishable/anon key is intentionally public; RLS enforces permissions)
- `NEXT_PUBLIC_SITE_URL=https://picmagic.in` and `NEXT_PUBLIC_SITE_NAME=PicMagic`
- `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_OPERATOR_NAME`, approved for public display
- `NEXT_PUBLIC_INDEXING_ENABLED=false` until the final production-domain check

`SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_EMAILS` are provisioning inputs. Use the service-role key only in local/server-side scripts, never a `NEXT_PUBLIC_` variable. The running application does not need service-role access. Do not put it into the Netlify build environment unless an explicitly chosen secure provisioning workflow needs it.

Optional integrations: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADS_ENABLED`, and `NEXT_PUBLIC_AD_SLOTS` (JSON placement-to-slot mapping). Leave unset/false at launch. No OpenAI or Gemini keys are needed.

## Supabase setup

1. Sign in securely to Supabase and create a dedicated project named PicMagic in an appropriate nearby region. Record its reference and connection details privately.
2. Run `supabase login`, `supabase link --project-ref YOUR_PROJECT_REF`, and `supabase db push` from this checkout. Review the migration before pushing; do not point this at a shared database.
3. Confirm public email signup is disabled in the hosted Auth settings. Set the site URL to `https://picmagic.in` and the allowed auth redirect to `https://picmagic.in/admin/login`. Local `supabase/config.toml` does not configure these hosted settings automatically.
4. Set the project URL, anon key and service role privately in `.env.local`. Run `pnpm seed`. The seed importer inserts missing records and preserves existing editorial records.
5. Provision the owner’s email/password administrator using the Supabase Auth dashboard. The owner sets the password directly. Obtain the new user ID and insert it into `public.admin_users` using a trusted SQL session:
   `insert into public.admin_users(user_id) values ('THE_AUTH_USER_UUID') on conflict do nothing;`
6. Confirm anonymous and normal authenticated users cannot create, change or publish content or write to the preview bucket. Never grant service-role credentials to a browser.
7. Configure a suitable backup/export habit. Keep migrations and original generated assets under version control or separate owner-controlled backup. Free-tier backup features must be checked in the current provider dashboard.

## Local database verification

Start Docker/Colima, then run `supabase start` and `supabase test db`. PicMagic uses API 54421 and database 54422 to avoid conflicts with other local projects. If optional services cannot start on the local Docker runtime, use `supabase start -x vector,logflare,edge-runtime,supavisor,realtime,studio,postgres-meta`; Auth, REST, Storage and Postgres remain enabled. The database tests use disposable test records within a rolled-back transaction. `supabase db reset` destroys the local project’s data and is only for a disposable local test database, never production.

The local config keeps the email provider enabled while `[auth] enable_signup=false` globally blocks public registration. Keep email/password login enabled in the hosted project as well.

For authenticated browser tests, configure a local test administrator and run with `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` in the process environment. Do not run mutation tests against production.

## Netlify preview and launch

1. Connect or securely log in to the owner’s Netlify account. Create a dedicated PicMagic project. Do not enable paid features or auto recharge.
2. Keep `pnpm-workspace.yaml` in the checkout: its `supportedArchitectures` installs Linux x64 native dependencies even when building on macOS. A CLI deployment must include Sharp’s Linux binding and libvips in the server function; test a dynamic page, an upload and a share image on the hosted preview. Use `netlify.toml`: launch environment validation followed by `pnpm build`, `.next` output, Node 22, pnpm 10.30.3. Netlify’s supported Next.js adapter supplies SSR, ISR, Server Actions and image optimization. This app must not be deployed as a static export.
3. Configure production environment values, initially with indexing disabled. Keep branch/deploy previews noindex and use a separate database for any mutation testing there.
4. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm check:content`, and `pnpm build`. Deploy a preview and run public smoke tests. Confirm no credentials appear in delivered JavaScript.
5. Test authenticated draft creation, preview, publishing, editing, duplication, URL change and unpublishing. Confirm public pages, search and sitemap refresh after mutations.
6. Add `picmagic.in` as the primary custom domain and `www.picmagic.in` as its redirecting alias. Configure the DNS records Netlify supplies; do not guess or hardcode current provider IP addresses. Preserve existing MX, TXT and unrelated records.
7. Resolve the previously observed NXDOMAIN state by checking domain status, registrar delegation and authoritative nameservers. Wait for actual DNS propagation and HTTPS certificate issuance before calling launch complete.
8. Verify `https://picmagic.in`, HTTP-to-HTTPS, and `https://www.picmagic.in/path?query` redirect behavior. `www` must resolve to the apex path with the query preserved. All canonical and social URLs use the apex origin.
9. Set indexing true only for the production context and redeploy. Verify crawlable HTML, canonical URLs, robots and sitemap on the real domain. Keep service-role keys out of runtime environments.
10. Netlify Free sends default email and in-app warnings at 50%, 75% and 100% usage. Confirm the owner billing email, leave auto recharge disabled, and review any additional alert options available in the dashboard. Review deployment/runtime logs and failed requests after launch. Real field Core Web Vitals require traffic and are not inferred from Lighthouse.

## Google Search Console

1. In the owner’s Google Search Console account, add a **Domain property** for `picmagic.in` (no scheme or path).
2. Google provides an account-specific `google-site-verification=...` TXT value. Add that exact value at the DNS apex through the registrar/DNS provider. Preserve other TXT records. Wait until authoritative DNS returns it, then select Verify in Search Console. Do not invent a token or remove it after verification.
3. Submit `https://picmagic.in/sitemap.xml` and confirm Search Console can fetch and process it. A pending processing status is not an indexing failure.
4. Inspect the homepage, an indexable category, an indexable collection, a photo detail and a reel detail. Run the live URL test, checking crawl access, rendered content, robots directives and the declared canonical. Request indexing for a small set of representative URLs when appropriate.
5. Verify excluded pages intentionally remain noindex: search, saved, admin, drafts, thin collections and previews. A `/collections/...` page must never canonicalize to a prompt-detail URL or vice versa.
6. After Google crawls, compare the Google-selected canonical with the declared one. Review Page Indexing and Sitemaps reports for blocked pages, redirect errors, soft 404s and unexpected duplicates. Recheck after meaningful content or route changes.
7. Technical readiness and sitemap acceptance do not guarantee indexing, ranking or the timing of either. Record the real outcomes separately.

## Ads and analytics activation

GA4 is centralized in `lib/analytics`. Configure only the actual property ID. Verify consent, reject/withdraw behavior, event names, SPA navigation and absence of personal data in the browser’s network panel.

AdSense activation requires an approved publisher account and real slot identifiers, an appropriate `ads.txt` publisher entry if requested, and a consent setup that satisfies Google’s current requirements for the audience served. In regions where Google requires a certified CMP, configure that CMP before serving ads; the app’s basic preference panel is not a substitute for certification. Test the actual vendor scripts against CSP and Core Web Vitals before enabling `NEXT_PUBLIC_ADS_ENABLED`.

Placements: `home-feed-1`, `category-inline-1`, `prompt-detail-top`, `prompt-detail-inline`, `prompt-related-feed`, `reel-page-inline`, and optional `desktop-sidebar`. Slots reserve space and are separated from primary interactions. No forced interstitials. Disabled integrations make no vendor requests.

## Rollback and recovery

Restore the previous known-good Netlify deployment if a release breaks public flows. Database migrations are additive; do not automatically reverse a migration that may contain new editorial data. Restore data from a verified export only after assessing affected records. Admin mutations invalidate the catalog and dependent paths. Database failures never silently replace live content with seeds.

If a canonical URL changes, database triggers preserve redirect history. Do not delete redirect history casually. Unpublished content must not remain publicly accessible after cache invalidation.

## Optional Vercel portability

The same Next.js app can deploy to Vercel using `pnpm build` and identical environment settings. An ad-funded commercial launch needs a plan permitting commercial use; do not use Hobby on the assumption it is eligible. Repeat custom-domain, redirect, cache, auth and indexing checks when changing hosts.

## Verified provider references

- [Netlify Next.js support and cache invalidation](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
- [Netlify current Free plan and hard credit limits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- [Google domain ownership verification](https://support.google.com/webmasters/answer/9008080?hl=en)
- [Google sitemap submission and processing](https://support.google.com/webmasters/answer/7451001?hl=en)
- [Google URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en)

For a CLI release, export committed files into a clean directory so private `.env` files are excluded. Link its `.netlify/state.json` to the dedicated site, install with the frozen lockfile, and run `netlify build --context deploy-preview` followed by `netlify deploy --no-build --alias preview`. The `--context` option belongs to the build step and cannot be combined with `--no-build`. Use the production context for the final release. New Netlify projects are private by default; configure this project’s visitor visibility explicitly before public smoke tests. Keep preview indexing disabled even when its visitor visibility is public.
