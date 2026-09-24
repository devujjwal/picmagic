# SEO implementation — 24 September 2026

This branch implements the first technical and editorial phase of the repository-wide SEO audit. It does not authorize a production deployment or any Search Console submission.

## Current Google baseline

Search Console was read on 24 September 2026 for the verified `sc-domain:picmagic.in` property:

- 6 web-search clicks, 104 impressions, 5.8% CTR and average position 9.5 for the available 9–21 September data.
- All 6 clicks currently land on the homepage; visible queries are predominantly PicMagic brand variations.
- 28 pages indexed and 92 not indexed: 87 discovered but not indexed, 1 crawled but not indexed, 2 intentional noindex URLs and 2 redirects.
- 10 valid Breadcrumb enhancements and no invalid Breadcrumb items.
- No field Core Web Vitals data yet for mobile or desktop.

GA4 property `G-DY3MC34E0S` still showed no processed historical data on 24 September. A fresh consented production session immediately appeared in Realtime as one active user from India, confirming that the tag and stream work; the limiting factor was discoverability of the optional choice rather than a broken measurement ID. This branch adds a clear first-visit analytics choice while retaining opt-in collection, admin exclusion, query sanitization, revocation and separate advertising consent. Consented visitors also send LCP, INP, CLS, FCP and TTFB measurements as a sanitized `web_vital` event.

## Implemented locally

- One shared prompt, category and collection SEO-eligibility gate is used by metadata, sitemaps and discovery.
- The SEO QA script now reads every catalogue addition rather than an older hard-coded subset.
- A content check rejects exact duplicate visible or SEO descriptions among indexable prompts and reports shared preview images for editorial follow-up.
- The exact production Netlify hostname permanently redirects to `https://picmagic.in`; deploy-preview and branch-deploy indexing controls are unchanged.
- Prompt metadata permits large Google image previews and exposes the real preview image before the branded share card.
- Prompt pages include `WebPage`, `ImageObject` and `CreativeWork` structured data plus visible concept-specific `why_ai` copy.
- A crawlable `/collections` hub links all qualifying curated collections and is included in the sitemap and footer.
- Indexable category introductions are unique and intent-specific.
- Collection titles no longer duplicate the PicMagic suffix.
- Catalogue client payloads contain card fields only, not complete prompt text and FAQs.
- Related prompts must be indexable, editorially approved, in the same medium, meaningfully related, and use a different preview image.
- Sitemap entries use the shared eligibility gate and include meaningful prompt-derived update dates for dynamic hubs.

## Local measurements

The isolated production build contains 112 sitemap URLs and 91 image entries. Representative initial HTML transfer sizes changed as follows:

| Route                                   | Audited production | Local branch |
| --------------------------------------- | -----------------: | -----------: |
| `/`                                     |             281 KB |       249 KB |
| `/ai-prompts/men`                       |             296 KB |       175 KB |
| `/collections/creative-transformations` |             387 KB |       205 KB |
| Prompt detail                           |             209 KB |       184 KB |

These are HTML byte counts, not Core Web Vitals. Field impact must be judged after a reviewed release through Search Console and consented GA4 Web Vitals.

## Remaining editorial work

Eleven indexable photo/reel pairs still share a preview image. They remain valid separate media intents, but each should receive a genuinely distinct reel poster or video preview before the library expands further. Do not create tag/style permutation pages until the current prompt, category and collection templates earn non-branded impressions and sustained indexing.

## Release follow-up

After explicit production approval, deploy this batch once after the full local release suite. Then:

1. Verify the primary hostname and exact Netlify-host redirect.
2. Accept optional analytics in one ordinary browser session and confirm one page view in GA4 Realtime without interacting with ads.
3. Submit or refresh the existing sitemap only once; do not repeatedly request all URLs.
4. Inspect the homepage, `/collections`, one category, one photo prompt and one reel prompt.
5. Compare indexing, image-search impressions and field Web Vitals after 7–14 days.
