# Approved AdSense improvement batch — local implementation

Date: 25 September 2026. Branch: `feature/seo-aeo-geo-agent`. Base commit: `5ab912ac8591501a3460c0433d7554bcd8f23849`. No new commit or push. **Production release and AdSense review remain on hold.**

The owner approved the audit plan for implementation, not deployment or AdSense resubmission. [Audit and baseline evidence](../adsense-low-value-content-audit.md) distinguishes observed weaknesses from possible reasons for Google's decision. This document describes the resulting local changes, not the current live website.

## Implemented scope

| Area | Result | Files/data |
|---|---|---|
| Content-aware advertising | Server-rendered eligibility is required as well as an allowed pathname. Empty Pets, thin/noindex category/collection hubs, drafts and missing routes have no manual slot or automatic ad-script eligibility. Existing SEO gates are reused, not changed. | `components/prompts/catalog-page.tsx`, `components/prompts/prompt-detail.tsx`, `app/page.tsx`, `app/reel-prompts/page.tsx`, `components/layout/consent.tsx`, `components/ui/site-link.tsx` |
| Placement restraint | Detail pages have one inline manual placement after publisher guidance; top/related placements removed. Three weak portrait-reveal reels remain available but have advertising deferred. | `components/prompts/prompt-detail.tsx`, `config/ads.ts` |
| Empty ad treatment | Ads disabled or slot unconfigured: render nothing. Google signals `data-ad-status=unfilled`, or queue push fails: collapse the empty reserve. Pending/filled units retain the initial space reservation. | `components/ads/ad-slot.tsx`, `app/globals.css` |
| Consent independence | A non-advertising page remains paused even if a legacy rejection is superseded by a new Google CMP decision. Explicitly opening advertising privacy choices may load the CMP on a public non-ad page, while ad requests remain paused. Analytics consent does not grant advertising consent. | `lib/privacy/advertising.ts`, `components/layout/consent.tsx` |
| Accurate discovery | DP and festival introductions describe available concepts. The lower-ranked discovery group is labelled “More looks to explore”; fashion is no longer advertised as practical utility. Internal editorial scores and grouping remain unchanged. | `content/expansion/collections.json`, `components/prompts/paginated-grid.tsx`, `components/prompts/prompt-card.tsx` |
| Practical prompt value | Reviewed and retained six pending authored workflows. Preparation, steps, focused repairs and checks address DP cropping, two-person identity, age-appropriate Krishna styling, paper material and product fidelity. | `content/prompt-workflows.ts`, `components/prompts/prompt-workflow.tsx`, `components/prompts/prompt-detail.tsx` |
| Demonstrated usefulness | Reviewed the existing two-example trial, immutable inputs and image provenance. Linked from About, the reference guide, the relevant details and one modest homepage link. Includes crop limitations and the clipped moon edge. No new image generation. | `app/guides/prompt-trial/page.tsx`, `content/prompt-trial.json`, `public/guides/prompt-trial/*`, About/reference/home pages, existing sitemap/site-page/analytics allowlists |
| Tool clarity | Compact Create/Enhance guidance explains what the tool writes, where to attach a photo, a concrete selection example, limitations and privacy. No upload/editing claim. Tools remain ad-free. | `components/prompts/tool-guide.tsx`, `app/create/page.tsx`, `app/enhance-photo/page.tsx` |
| Copy convenience | An earlier “Copy complete prompt” action copies exactly the same complete text as the existing action. | `components/prompts/prompt-detail.tsx` |
| Validation hygiene | Ignore gitignored private build artifacts during lint; update stale public-label and pre-September-15 collection-count assertions. | `eslint.config.mjs`, related unit/E2E tests including cross-document analytics assertions |

The complete collection changes are two description fields, recorded with their expected previous values in [collection-copy-release.json](collection-copy-release.json). Production may read Supabase: this file is a review payload, not a database update. A separately approved release must verify current production copy and avoid overwriting concurrent edits.

## Inherited work preserved

Before this implementation, the working tree already contained the six workflows, two-example trial and assets, About/reference-guide links, site-page/sitemap/analytics integration, validators and earlier audit documents. These were inspected and completed rather than recreated. Historical verification in [README.md](README.md) and `validation.json` applies to that earlier snapshot. Current results are recorded separately in `implementation-validation.json`.

No prompt text, title, publication/indexability flag, category description, collection membership, canonical route or homepage feature order changed. The 95 unfinished drafts remain deferred. [Editorial dispositions](editorial-dispositions.md) record individual decisions on four thin collections and eleven photo/reel counterparts. No reel was deleted, deindexed or merged.

## Trade-offs and limits

1. **Loaded vendor navigation:** removing a React/Next Script component cannot unload an executed vendor. After advertising loads, normal internal links to another pathname perform one direct document navigation; they do not first fetch an RSC response. Modified/new-tab/download links keep browser behaviour. Consent also retains a reload fallback for imperative/history route changes. This clears vendor state before a non-ad page is used. Document navigation can be slower than an SPA transition, and fallback navigations can still add a request. Existing CSP nonce, cache and proxy policies remain unchanged. Retain this conservative boundary unless a separately reviewed server/client navigation design provides an equivalent guarantee with fewer requests.
2. **Empty reserves:** collapse requires an explicit unfilled signal or a failed queue push. An ad blocker or a vendor that never reports status may leave pending space; no arbitrary timeout hides a potentially valid paid unit. Collapsing a reserve can shift content. The visual tests verify the resulting layout, not field CLS or real ad-fill behaviour.
3. **Google control:** local tests simulate CMP states and block all Google advertising/analytics network requests. They cannot prove Google's regional message deployment, real TCF/GPP operation, approved ad serving or effective Auto ads exclusions.
4. **Editorial claims:** six workflows are authored guidance, not six provider tests. The trial contains two historical ChatGPT attempts involving a fictional persona; it does not demonstrate universal compatibility, exact likeness or repeatable success for every age, group or product.
5. **Deployment consistency:** local seed data does not prove the production Supabase catalog matches. Review and update the two approved collection descriptions only through the controlled release workflow.
6. **Availability work:** no speculative fix to CSP, proxy, caching, robots or Supabase was made. Slow-response and independent-reader issues remain separate diagnostic tasks.

## Verification

Fresh final results are in [implementation-validation.json](implementation-validation.json):

- Lint: passed, no warnings. Type checking: passed.
- Unit tests: **183 passed across 30 files**.
- Content, SEO and release checks: passed; **186 prompts, 91 published / 95 drafts, 17 categories, 40 collections**, zero missing local images, zero SEO errors, 42 retained editorial notices and 50 original canonical owners preserved.
- Full production-mode browser suite: **136 passed, 52 conditional skips, zero failures** across desktop/mobile Chromium. Four skipped analytics cases were then exercised successfully in a separate analytics-enabled build; that follow-up passed **all eight** analytics/advertising/copy/share cases. The other 48 skips are authenticated database-mutating admin tests (4) and historical unpublished-preview mode tests (44); their released counterparts are covered by the current release suite. No production mutation tests were enabled.
- Normal Turbopack production build and post-build versioned-preview headers: passed. An additional local build with a dummy GA ID also passed.
- New tools, trial and empty-page layouts checked at **375, 430 and 1440px**; no horizontal overflow; new surfaces pass main-content axe checks. [Current screenshots](implementation-screenshots/) retain the actual sticky mobile navigation, which may appear midway through a full-page capture. Text remains reachable by scrolling.
- The complete-prompt and canonical share-link clipboard checks pass. Google-script isolation also passes when navigating to Create and back; ordinary eligible-to-tool links make one document request, without an additional RSC fetch.

Initial verification found a narrow-screen link overflow and a navigation/reload race. Both were corrected and the final suite rerun. Stale historical collection-count/region assertions and a mobile-menu locator were updated. Historical reports and screenshots were preserved separately; no old Lighthouse score is represented as a current measurement.

 Browser checks use the final production build, `CONTENT_SOURCE=seed`, advertising enabled with local test slots, and vendor request interception. No real ad impressions, clicks, Search Console submissions or production data writes are part of this QA.

## Release and reapplication checkpoints

### Local completion

- [x] Audit and machine-readable baseline evidence saved.
- [x] Thin/draft/error advertising boundaries implemented.
- [x] Two stale collection introductions corrected locally.
- [x] Six workflows and two trial examples reviewed; limits disclosed.
- [x] Tool guidance and full-copy convenience implemented.
- [x] Weak reel/thin collection dispositions recorded without publication changes.
- [x] Final local QA evidence assembled (see validation file).

### Still required, outside this local implementation

- [ ] Observe a clean real EEA/UK/Swiss session: message shown as configured, rejection/acceptance respected, withdrawal works; record location/method and actual network behaviour. A browser timezone or mocked CMP is not equivalent.
- [ ] Inspect the effective AdSense Auto ads configuration and page exclusions. Any account change requires explicit approval. Preserve no-ad tool/search/legal/error/draft surfaces and the local manual-slot limits.
- [ ] Confirm account activation/payment details separately; this is not a cure for low-value content.
- [ ] Obtain explicit production release approval, check current Netlify allowance and deployment controls, and release the verified batch once.
- [ ] Reconcile the two collection descriptions against production data before any controlled write. No publication/indexability changes are included.
- [ ] Smoke-test the live copy/save/search/tool/trial journeys, guide assets, canonical/sitemap output, consent and empty-slot behaviour.
- [ ] Manually reconsider important pages as a visitor. Request AdSense review only when the owner can truthfully confirm the issues have been addressed.

**AdSense readiness remains NOT_READY to request review now.** The local changes are a focused improvement batch, not a guarantee of acceptance. No production release or AdSense request has occurred.
