# SEO release — 24 September 2026

Owner authorization: complete the SEO plan, then push to main. Search Console–GA4 permission sharing separately confirmed by the owner. No purchases, plan changes or automatic recharge changes.

## Pre-release verification

- Development branch: `feature/seo-improvements`, containing `origin/main` image release `57e1bfb`.
- 143 unit tests, 78 desktop/mobile browser tests, lint, typecheck and local webpack production build passed.
- Complete local crawl: 127 public routes, 112 sitemap page URLs, 91 image associations, 95 draft 404s; zero failures.
- Content validation: 186 prompts, 17 categories, 40 collections, zero missing published previews; original homepage features retained.
- Responsive category guidance inspected at desktop and 375px mobile using the existing PicMagic design system.
- Final three-run mobile Lighthouse: performance 95–100, accessibility/SEO 100. Home/category best practices 100; prompt best practices 96 with an inspector-issues diagnostic. CLS zero. Median LCP: home 2.11s, men category 2.33s, prompt 2.41s. Local lab results, not a field CWV claim. Earlier A/B variance is retained in the implementation report rather than hidden.
- Only test-regenerated historical screenshots were restored; pre-existing untracked indexing audit preserved and excluded from commit.

## Database

`202609240002_seo_editorial_copy.sql` applied atomically and migration history recorded. Verified six category introductions, seven collection metadata rows and unchanged publication counts (91/95). Two double-exposure descriptions/why_ai were differentiated. No preview paths, publication flags, drafts or ordering changed.

Private pre-migration row backup: `.release-private/seo-release/pre-migration.json` (gitignored, mode 0600). If rollback is required, restore only the changed description/why_ai/SEO fields from that backup in a reviewed transaction; do not overwrite whole rows or reverse unrelated migrations.

## Google / hosting

- Verified domain Search Console property linked to GA4 property 553531149, stream 15753357674 with explicit owner permission.
- Google organic search traffic report verified with historical 6 clicks / 112 impressions (27 August–23 September). Queries report available.
- Web Vital name/rating event dimensions and value custom metric registered; metric values must be filtered by name (timings ms, CLS ×1000).
- Existing consented GA4 Realtime receipt verified. Analytics stays opt-in, Enhanced Measurement and Google signals remain off.
- Netlify main auto-publishing confirmed; current deployment before release is `57e1bfb`. 985/1000 plan credits remain and recharge is disabled. One authorized main push will trigger the batch release.

## Decisions and follow-up

See `docs/SEO-IMPLEMENTATION.md` for the full delivery matrix and `docs/SEO-DUPLICATE-REVIEW.md` for 31 near-duplicate notices and 11 shared photo/reel concept images. Shared concept images remain recoverable/unchanged; no synthetic poster duplicates were published for SEO. Fresh CSP nonces remain, so public HTML remains dynamic/private. Reduced serialization, external CSS and immutable hashed-image caching provide independent improvements.

After publication: verify the release commit, sitemap index/children, collections, metadata, alias redirect and cache headers; refresh content through the authenticated admin endpoint; submit the existing sitemap root once. Google recrawling, indexing selection, non-brand growth and field CWV are post-release observations, not guaranteed outcomes.
