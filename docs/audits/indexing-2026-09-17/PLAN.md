# Search Console indexing review and fix plan — 17 September 2026

> Historical snapshot retained for comparison. Counts, routes, asset mappings and
> recommendations below describe the September 17 observation, not the current
> release. `live-probes.json` belongs to this same snapshot. Later releases changed
> sitemap architecture and content; revalidate before acting on this plan.

Scope: review the supplied Google email, inspect Search Console and current public responses, and prepare a plan. No application, database, deployment, billing or Search Console submission changes. Working branch: `content/identity-and-collection-audit`; initially clean. Only this audit directory was added.

## Findings and evidence

The email reports newly observed exclusion reasons, not a site-wide failure or a manual penalty. The aggregate report is labelled last updated September 14: 27 indexed, 76 not indexed (2 noindex, 2 redirect, 71 discovered, 1 crawled). Individual crawl/detection dates include September 15, so the aggregate date must not be treated as the exact freshness of every URL. It is not a complete verdict on the September 15 release.

| Group | Exact findings | Recommendation |
| --- | --- | --- |
| Noindex (2) | `/saved`, crawled September 12; `/ai-prompts/cinematic`, crawled September 12 | Preserve both for now. Saved is browser-specific utility. Cinematic has only one published primary-category prompt and its explicit content flag is false. Do not indiscriminately enable indexing. |
| Redirect (2) | `https://www.picmagic.in/`, crawled September 14; `http://picmagic.in/`, crawled September 11 | Correct canonical-host/HTTPS consolidation. Both currently return a single 301 to `https://picmagic.in/`. Keep them. This is “Page with redirect”, not “Redirect error”. |
| Discovered (71) | Viewed all 71 examples; last crawl N/A throughout. Includes category hubs, collections, photo details, reel details, Create and Enhance. Men URL Inspection shows sitemap discovery and a referring link from Women, with no recorded crawl. Its fresh Google live test at 09:39 IST passed: URL available to Google, page can be indexed, one valid Breadcrumb item. | Investigate crawl scheduling and representative fetchability, then targeted discovery/content improvements only if evidence warrants. These are not 71 demonstrated code errors. |
| Crawled (1) | `/ai-prompts/family/the-gentlest-new-beginning`; Googlebot smartphone successfully fetched September 15 at 14:11:23. Historical canonical/indexability fields N/A. | Google's fresh live test September 17 at 09:37:48 IST passed: crawl allowed, fetch successful, indexing allowed, correct self-canonical, one valid Breadcrumb item. Do not interpret historical N/A as proof of missing tags. Review usefulness/internal linking if it stays excluded. |

### Sitemap and robots

Search Console: sitemap submitted September 10; last read September 16; **Success**, **111 discovered pages**, 0 videos. Current sitemap fetched HTTP 200 and contains 111 unique canonical URLs, no duplicate `<loc>` entries. `/saved` and `/ai-prompts/cinematic` are absent as intended; the family prompt and the six discovered collection examples are present. No resubmission is needed just to clear the email.

`robots.txt` fetched HTTP 200: allows `/`, disallows `/api/`, declares the canonical sitemap. `/saved` currently returns HTTP 200 with `noindex, follow` and a self-canonical. The public catalogue still has 91 prompts; Cinematic primary category count is one. The code distinguishes `/ai-prompts/cinematic` from `/collections/cinematic`: the latter is a curated collection in the sitemap. Do not conflate their indexing settings.

Current HTTP evidence is retained in `live-probes.json`. The corporate Zscaler response blocks a direct check of `/ai-prompts/cinematic` from this machine; that local security response is not evidence that Google receives a 403. Its prior Google noindex finding and explicit current repository flag are confirmed. Do not bypass the network block.

## Prioritized plan

1. **Preserve intended exclusions and redirects.** Do not remove all noindex directives, index Saved/search/admin/drafts, add excluded URLs to the sitemap, or disable canonical-host/HTTPS redirects. Do not click Validate Fix for behavior that should remain unchanged.
2. **Complete a targeted URL matrix before code changes.** Classify the 71 discovered URLs against the current sitemap/public catalogue. Check initial HTML status, robots meta/HTTP header, self-canonical, real content, and crawlable incoming links for representative category, collection, photo and reel routes. Expand testing only when a template failure is found. Existing source already has server-rendered 24-item batches with real `?page=` anchor links; do not replace lazy loading merely because it exists. Verify page 2+ linking in rendered HTML rather than assuming it is broken.
3. **Check crawl-health evidence.** Read Search Console Crawl Stats/host availability and historical response errors, particularly around the prior Netlify credit constraint. Do not assume the site was down or diagnose a crawl-budget problem from the discovered label alone. Investigate repeat 5xx/429/long responses if actually observed.
4. **Prioritize valuable URLs.** After successful live checks, request indexing for a small selection of important unindexed hubs and strong detail pages, not all 71 repeatedly. The sitemap already provides bulk discovery. Keep the family detail available; optionally improve its concept-specific use guidance/FAQs and contextual family links if sustained exclusion suggests a quality/discovery opportunity. This is an editorial hypothesis, not Google's stated rejection reason. Do not promise indexing.
5. **Only implement demonstrated defects locally.** If the matrix finds indexable content accidentally noindexed, wrong canonicals, noindex URLs in sitemap, broken crawl paths or response errors, fix that narrow cause on the feature branch. Add regression checks for intended Saved/Cinematic exclusions, host redirects, sitemap eligibility and crawlable pagination as relevant. Run lint/typecheck, relevant unit/E2E and local production build. Seek a new explicit release instruction for any production change; this review does not authorize a deploy.
6. **Review progress after 7–14 days.** Compare URL-level inspections, sitemap last-read, crawls and indexed count. This is a recommended review window, not an indexing SLA or an automatic scheduled task. Escalate persistent exclusions based on URL evidence. Some intentional exclusions will remain and should not be “fixed” to achieve a zero count.

### Optional future Cinematic work

Keep the existing canonical category path. Only make it indexable after it has a coherent, useful body of published content, substantive category-specific guidance and a distinct purpose relative to the Cinematic collection and Creative Transformations. Assess this separately; indexing a one-item category is not the immediate remedy.

## Acceptance criteria for a subsequent implementation

- Intended exclusions remain noindex and absent from sitemap.
- Both alternate homepage URLs permanently redirect to the canonical HTTPS root without loops.
- Intended public URLs return 200, correct self-canonical and indexable metadata in initial HTML, with at least one crawlable internal route.
- Sitemap is accepted by Google and contains only intended canonical indexable public URLs.
- Representative Google live tests pass; indexing itself is acknowledged as Google's decision.
- No release/purchase or bulk indexing submissions without their appropriate scope.

## Primary guidance

- Google Page indexing report: https://support.google.com/webmasters/answer/7440203?hl=en
- Google URL Inspection tool: https://support.google.com/webmasters/answer/9012289?hl=en
- Google recrawl requests: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl

Google states that crawl requests do not guarantee indexing; repeated requests for the same URL do not accelerate crawling. Its live test can confirm current access/indexability but does not prove that a URL will be selected as canonical or indexed.

No full Lighthouse run or complete live crawl of all 111 URLs was performed in this targeted planning review. Historical release test results were not relabelled as current results. No Request Indexing, Validate Fix, sitemap submit, removal, code edit, content mutation or deployment was performed.
