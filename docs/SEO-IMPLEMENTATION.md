# SEO implementation — 24 September 2026

The owner authorized completing this SEO batch and one final push to main. Development and local validation took place on `feature/seo-improvements`; no incremental production deployments were used for implementation. Existing previews, homepage ordering and 95 drafts are preserved.

## Delivery matrix

| Audit item | Implementation / decision |
| --- | --- |
| Complete-library QA | `scripts/seo-catalog.ts` loads the canonical catalogue. SEO QA checks 127 public routes, all 186 records and all 95 draft 404s. |
| Shared eligibility | `lib/seo/eligibility.ts` combines publication, editorial review, approved images and index flags. Hubs require qualifying members; collections also require four distinct images. Metadata, discovery, sitemaps and collection-admin validation use the gate. |
| Duplicate/thin content | Exact duplicate descriptions fail validation; lexical similarity and shared-image warnings receive editorial review in `SEO-DUPLICATE-REVIEW.md`. No automatic noindex based on similarity alone, or new tag permutation URLs. |
| Individual prompts | Existing substantive templates retained; 11 reviewed concept-specific guides added. Reel hooks, progression and payoff now visible. Shared photo/reel concepts have reciprocal links explaining their different outputs. |
| Categories / collections | Six category introductions rewritten; all six indexable categories and all eight eligible collections receive specific guidance and contextual links. Sparse categories remain noindex. |
| Editorial architecture | `content/seo-guides.ts` is a typed, reviewed, version-controlled registry rendered by the server. This avoids duplicating fields across seed and CMS or adding unnecessary database schema. The CMS still owns descriptions and memberships; guide changes require code review. |
| Internal linking | New `/collections` hub and footer link; eligible category navigation; related prompts require meaningful relevance, distinct images and style diversity. |
| Metadata / social | Titles normalized, actual preview precedes branded OG card, image alt supplied, large image previews allowed, stable canonicals retained. |
| Structured data | Prompt WebPage, CreativeWork and ImageObject relationships, dimensions and dates; visible breadcrumbs and FAQs retained. FAQ rich-result eligibility is not promised. |
| Sitemaps | `/sitemap.xml` indexes `/sitemap-pages.xml` (112 URLs) and `/sitemap-images.xml` (91 prompt/image associations). Meaningful content/guide dates; preview indexes empty. Static utility routes without a reliable change timestamp omit lastmod. |
| Host / robots | Exact production alias permanently redirects to picmagic.in. Branch/preview noindex remains. Robots declares the same sitemap entry point. |
| Rendering / payload | Initial HTML remains server-rendered. Full prompt records removed from catalogue and preview client boundaries; cards receive only required data. |
| Images / caching | Existing responsive WebP/AVIF and reserved dimensions retained. Only content-hashed previews receive one-year immutable caching; legacy names revalidate. No image replacements in this SEO batch. |
| CSS / performance | External CSS default after A/B comparison removes about 77.6 KB of repeated CSS per HTML response and permits cross-page reuse. Inline mode remains an opt-in benchmark switch. |
| CSP / public caching | Investigated and intentionally retained fresh per-request nonces and private/no-store HTML. Reusing nonces or relaxing script security to obtain prerendering is not acceptable. This is not represented as an implemented ISR redesign. |
| Analytics | First-visit optional analytics choice, consent-gated Web Vitals, admin/query exclusions and withdrawal retained. No duplicate tag or automatic form/search capture. |
| Google integration | Owner-approved Search Console domain property linked to PicMagic GA4 stream. Queries and organic search reports available; Web Vital name/rating dimensions and value metric created. |

## Google baseline and interpretation

Search Console on 24 September: 28 indexed, 92 excluded (87 discovered, 1 crawled, 2 noindex, 2 redirects), 10 valid Breadcrumb items, no field Core Web Vitals. The earlier 9–21 September view showed 6 clicks / 104 impressions. The linked GA4 Search Console report for 27 August–23 September shows 6 clicks / 112 impressions; these are different reporting windows, not an implementation gain. All clicks in that report land on the homepage.

A fresh consented production visit was received in GA4 Realtime. This confirms tag/stream operation, not the cause of missing historical data. The banner makes the optional choice discoverable without enabling collection by default. New Web Vitals definitions require new consented traffic and processing time.

## Local validation

- Lint, TypeScript and 143 unit tests pass.
- 78 desktop/mobile browser checks pass, including analytics consent, CSP, navigation and the previous image release.
- Full SEO crawl: 127 public routes, 112 page URLs, 91 image associations, 95 draft 404s, zero failures (`docs/qa/seo.json`).
- Content: 186 prompts, 17 categories, 40 collections, zero missing published assets. Published/draft counts remain 91/95.
- Editorial screening: zero errors, 31 lexical-similarity notices and 11 shared-image groups reviewed, not silently ignored.
- Isolated production build passed with webpack; local Turbopack socket permissions prevented that local build mode. Netlify retains its normal build and full release gates.
- Google services were stubbed/blocked in full local browser/performance tests; those tests are not proof of real Google collection.

## Performance evidence

Three cold mobile Lighthouse runs per route, local production builds, not field CWV. Full records: `docs/qa/seo-performance-inline.json` and `seo-performance-external.json`.

| Route | Inline HTML | External HTML | Inline median LCP | External median LCP |
| --- | ---: | ---: | ---: | ---: |
| Home | 249,792 B | 172,222 B | 2.65 s | 2.87 s |
| Men category | 176,710 B | 99,106 B | 2.44 s | 2.11 s |
| One Day prompt | 184,027 B | 106,421 B | 2.41 s | 2.41 s |

CLS was zero throughout. Homepage cold LCP is mixed and still above 2.5 seconds in these medians; do not claim universal CWV improvement or a field pass. External CSS is chosen for consistent transfer reduction and a reusable stylesheet, not a fabricated across-the-board LCP win. Final-build measurements are recorded separately in `seo-performance-final.json`.

## Release and monitoring

Only `202609240002_seo_editorial_copy.sql` is required: six category descriptions, two prompt descriptions/why_ai and seven collection metadata records. Back up those rows privately before applying; do not run unrelated historical migrations. Assets, identities, publication and ordering are untouched.

Check Netlify allowance before the single main push; verified 985/1000 plan credits remained and auto-recharge disabled. After deployment, smoke-test the sitemap index/children, metadata, collections hub, exact-host redirect and cache headers. Submit the existing sitemap root once. Compare Web and Image search separately, indexed prompt/category/collection counts, non-brand queries and consented field CWV after 7–14 days. This observation period is not a claim that Google indexing or traffic growth is complete.

Preserve the 11 shared concept images until genuinely distinct reel assets are reviewed; publishing cosmetic duplicates solely for SEO is not useful. Continue targeted differentiation based on real queries before expanding the library.
