# PicMagic AdSense low-value audit and remediation

Audit: 25 September 2026. Production baseline: `5ab912ac8591501a3460c0433d7554bcd8f23849`. Implementation remains local on `feature/seo-aeo-geo-agent`; no release or AdSense resubmission is authorized. Google controls approval.

## 1. Executive summary

**Production readiness: NOT_READY.** PicMagic has genuine visual-discovery and prompt-building utility. Its uneven supporting guidance, unfinished advertising surfaces and stale collection introductions are stronger explanations than a basic crawler or ad installation problem. Google did not identify offending URLs, so no particular cause is proven. Implementation status and fresh validation are recorded separately in [the implementation report](adsense-readiness-2026-09-25/implementation.md).

## 2. Likely reasons ranked by evidence

| Finding | Assessment |
|---|---|
| Uneven original supporting guidance; only 16 dedicated prompt editorial modules | HIGHLY_LIKELY contributor |
| Empty Pets route with advertising reserve; four active collections with one/two items | CONFIRMED weakness, not proven rejection cause |
| DP introduction names drafts; festival introduction names different concepts | CONFIRMED maintenance issue |
| Repeated FAQs and formulaic category/SEO copy | CONFIRMED pattern, POSSIBLE contributor |
| No public recorded tool trial at audit time | Supporting weakness |
| Incorrect publisher/robots installation | UNLIKELY: IDs agree and advertising crawlers received 200 |
| Site-wide crawler denial | Not reproduced; independent reader failure unresolved |
| Low traffic alone | Context, not a fabricated approval threshold |

## 3. Existing strengths

Keep original reviewed imagery, full identity-aware prompts, external-tool disclosure, copy/save/share/search, related prompts, canonical detail URLs, category/collection navigation, image SEO, structured data, public reference guide, About methodology and operator contact. Do not rebuild these features or turn the product into a generic blog.

## 4. Scope and content quality

68 live URLs were inspected: homepage/discovery, every category type, 12 active collections, 22 prompt details, tools, trust/legal pages and technical endpoints. 66 returned 200; the two 404s were deliberate probes (nonexistent route and the local-only trial). Local inventory: 186 records, 91 published, 95 drafts, 17 categories, 40 collections. Local publication flags are not a complete production database export. See `adsense-readiness-2026-09-25/audit-evidence.json` for the live sample and duplication screen.

PAGE_VALUE is editorial, not Google's metric. STRONG means distinctive output plus specific help; ACCEPTABLE means useful with context gaps; THIN means limited differentiated help; VERY_THIN means empty/unfinished. No word threshold determines a rating.

| Page | Rating | Evidence |
|---|---|---|
| Homepage | STRONG | Distinctive previews and explicit copy/reference workflow |
| Men, Women | ACCEPTABLE | Differentiated category guidance; broad utility labels |
| Cinematic collection | STRONG | Comparative lighting and storytelling guidance |
| Professional collection | THIN | Two cards, short intro, little comparative help |
| River Remembers | STRONG | Specific ink-transition and adaptation guidance |
| Bottle Inside a Moment of Water | STRONG | Product reference and fidelity checks |
| Portrait Cut from Monsoon Paper | STRONG | Material/recognition trade-offs |
| Tiny Krishna | ACCEPTABLE | Detailed styling and correction advice; workflow could be clearer |
| A Fold Around You | ACCEPTABLE | Strong prompt; little guidance outside it |
| Your next chapter, in focus | ACCEPTABLE | Useful headshot, generic supporting FAQ |
| Your next introduction — reel | THIN | Limited incremental utility over still counterpart |
| Create/Enhance/Reels | ACCEPTABLE | Functional tools, sparse entry explanation/uneven concepts |
| About | STRONG for purpose | Transparent process and limitations |
| Pets | VERY_THIN | Zero available concepts |

## 5. Homepage

The hero already explains choosing, copying and using references externally. No manual ad precedes it. Preserve layout and featured order; add one modest link to the documented trial, not an essay or redesign.

## 6. Categories

Six eligible categories already have authored guidance: Men (use/crop), Women (garment framing), Couples (separate identities), Kids (age/permission), Travel (scale/location), Festival (specific cultural details). Retain these. Ten other category descriptions use similar wording; most are intentionally noindex. Do not expand/index them just to meet a count.

## 7. Collections

Creative Transformations and Cinematic are strong. Romantic, Studio and Dating Profile have useful existing guides. Dating Profile Reels needs clear explanation of each motion story's distinct value. DP copy must describe its four published options, not Monochrome Rain/Floral Shadows drafts. Festival copy must match Krishna, family diyas, Holi happiness and Garba cards. Golden Hour, Saree, Professional and Diwali remain noindex and should not carry ads pending greater value. No membership, canonical, publication or indexability change is approved.

## 8. Prompt details

Sampled pages contained approximately 715–1,103 extracted words including prompts/UI. This is not simply a word-count deficit. Useful additions are best-reference advice, essential creative ingredients, safe customization, symptom-specific edits and review checks. Six existing local workflows cover avatar, theatre, couple, Krishna, product and paper relief. They replace shorter guidance where present; other authored guides remain. Exact copyable prompt text stays intact. A second early Copy action improves access without changing copied text.

## 9. Tools

Create/Enhance build prompts; they do not process uploaded images. Explain that at entry, provide one illustrative selection-to-instruction example, explain where to attach the reference, privacy and limitations. Keep tools ad-free. Reels must continue distinguishing still concept art and actual playable clips; timed plans require an external tool.

## 10. Trust/About/legal

Live Contact names Ujjwal Paul and provides email. About explains curation, AI previews, result variability, external tools and unverified compatibility. Privacy/Terms describe storage, consent and responsible use. No invented credentials/history or duplicate methodology page. Link real limited-scope trial evidence from existing pages. Account activation/payment notices are separate from the low-value rejection.

## 11. Navigation and functionality

Copy/save/share/search/related content are real features, not decorative controls. Preserve routes and full prompts. Remove misleading public “Practical utility” labels from the broad secondary group without inflating editorial scores or promoting it to homepage eligibility. Existing historical browser tests do not substitute for final fresh regression checks.

## 12. Ad placement audit

| Surface | Baseline | Approved disposition |
|---|---|---|
| Homepage | One reserve after first content | Retain only with reviewed hero; collapse confirmed unfilled |
| Category | One including empty Pets | Content-aware eligibility; no empty/thin category ads |
| Collection | One including thin collections | Existing eligibility safeguards; thin collections excluded |
| Prompt | One configured; three code locations | One inline placement only, after publisher guidance |
| Search/saved | None | Keep none |
| Create/enhance | None | Keep none |
| Reel directory | One | Require actual content |
| About/contact/privacy/terms | None | Keep none |
| 404/admin/draft | No normal slot / incomplete script guard | Deny default script eligibility and manual slots |

The baseline reserved 280px plus margins even when unfilled. No ad fill was claimed. Auto ads settings cannot be inferred from React slot code.

## 13. AdSense technical review

ads.txt returned 200 with `google.com, pub-4114304022167819, DIRECT, f08c47fec0942fa0`; page publisher identity agrees. AdSense reports Authorized. The European message for picmagic.in is Published and the account shows an active US message. Regional delivery/consent is not proven by those statuses. The Auto ads screen exposed no effective site setting, so exclusions remain unverified. Preserve nonce/CSP and independent analytics consent. Explicitly reopening Google privacy choices may require loading the CMP on a non-advertising page; requests must remain paused there. Do not represent this as geographic compliance certification.

## 14. Duplication analysis

Normalized exact match plus SequenceMatcher >=0.80 screening (not semantic identity):

| Field | Exact groups | Near pairs |
|---|---:|---:|
| 91 published descriptions | 0 | 7 |
| 91 SEO descriptions | 0 | 23 |
| 17 category descriptions | 0 | 45 |
| 12 active collection descriptions | 0 | 0 |

257 FAQ occurrences contain 87 distinct Q/A pairs. One reference answer appears 47 times; one missing-detail answer appears 46 times. Its forehead-mark example is irrelevant to some professional pages. All seven description overlaps are photo/reel counterparts. Existing validator reports 31 broader text overlaps plus 11 shared preview pairs. Necessary identity/safety instructions are not treated as bad duplication. Inactive draft duplication is not evidence of a live violation. Improve meaning, not the metric.

## 15. Crawler/indexability/performance/traffic

Earlier crawler matrix: 112/112 GET/HEAD successes across eight URLs/seven user agents; 12 follow-up homepage requests succeeded. This audit: 12/12 Mediapartners-Google/AdsBot-Google requests across six URLs returned 200. Useful initial HTML exists. Agents were simulated, not verified provider IPs. Independent web-reader fetch remains unresolved; local TLS is intercepted and native IPv6 was not established. Median fresh TTFB ~0.75s with an 8.73s ai-prompts outlier. No correlated Netlify/Supabase trace proves its source. Supabase cold failures are a code-path risk, not a demonstrated rejection cause. Do not alter CSP/cache/proxy/robots or offer llms.txt as a fix. See [crawler audit](crawler-accessibility-audit.md).

Historical GSC snapshot requested Aug 27–Sep 23; last returned day Sep 21 and completeness false. Roughly six web clicks/104 impressions, zero image clicks/86 impressions. Tiny samples do not establish engagement quality or a minimum traffic requirement.

## 16. Priorities

| ID | Change | Impact | Effort | AdSense | SEO | User | Risk | Classification |
|---|---|---|---|---|---|---|---|---|
| R1 | Advertising boundaries/reserves | High | Medium | Direct | Low | High | Medium | MUST_FIX_BEFORE_REVIEW |
| R2 | Two intros/public labels | High | Small | Direct | Medium | High | Low | MUST_FIX_BEFORE_REVIEW |
| R3 | Six workflows | High | Medium | Direct | High | High | Low | STRONGLY_RECOMMENDED |
| R4 | Documented trial | High | Medium | Direct | Medium | High | Low | STRONGLY_RECOMMENDED |
| R5 | Tool explanation | Medium | Small | Supporting | Medium | High | Low | STRONGLY_RECOMMENDED |
| R6 | Weak variants review | Medium | Medium | Direct | Medium | High | Medium | STRONGLY_RECOMMENDED |
| R7 | Regional CMP/Auto ads checks | High | Medium | Direct | Low | High | Medium | MUST_FIX_BEFORE_REVIEW |
| R8 | Correlated latency investigation | Medium | Medium | Indirect | High | High | Medium | UNRELATED_TO_CONFIRMED_REJECTION |
| R9 | Earlier Copy | Low | Small | Indirect | Low | Medium | Low | NICE_TO_HAVE |

## 17. Files/data affected

Advertising: `components/layout/consent.tsx`, `components/ads/ad-slot.tsx`, `config/ads.ts`, `lib/privacy/advertising.ts`, `app/globals.css`, server page markers in homepage/reels/catalog/detail. Supporting content: `content/prompt-workflows.ts`, `components/prompts/prompt-workflow.tsx`, `app/guides/prompt-trial/page.tsx`, `content/prompt-trial.json`, optimized `public/guides/prompt-trial/`, existing About/reference links/sitemap metadata. Copy: two descriptions in `content/expansion/collections.json`; old/new release payload is recorded, not executed. Tools: `components/prompts/tool-guide.tsx`, Create/Enhance pages. No prompt text, canonical owners, memberships or publication flags change.

## 18. Implementation phases

1. Advertising boundaries and accuracy: route/consent/slot regression tests and two copy corrections.
2. Six workflows: exact-copy and identity/material regression checks.
3. Trial: provenance, exact inputs, crop/image QA and honest limitations.
4. Tools and weak variants: useful explanation plus documented retain/defer decisions.
5. Local lint/types/unit/content/E2E/build and responsive review; release remains a separate approval. No live content mutation or automatic review request.

## 19. Reapplication checklist

Already evidenced: clear homepage; operator/contact; honest AI disclosure; useful initial HTML; consistent ads.txt; existing sitemap gates. Still required before production re-review: approved local changes released; stale live copy corrected; empty/draft/error ad handling verified live; real regional CMP behavior and Auto ads exclusions verified; workflows/trial reviewed; weak variants disposition accepted; fresh journeys/responsive checks; live smoke; truthful owner confirmation. No arbitrary waiting period, article count or traffic target.

## 20. Readiness and boundaries

NOT_READY for production resubmission until the release and external checks above complete. The smallest useful batch strengthens the existing image-first product. A local build does not imply Google approval. No automatic publishing, indexing, review request or deployment is permitted.

Sources inspected 25 September 2026: [AdSense content/UX](https://support.google.com/adsense/answer/10015918), [ads on screens without publisher content](https://support.google.com/publisherpolicies/answer/11112688), [AdSense eligibility](https://support.google.com/adsense/answer/9724). These do not prescribe this implementation or a universal word-count threshold.
