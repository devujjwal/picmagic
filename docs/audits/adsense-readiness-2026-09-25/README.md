# AdSense content-value remediation — 25 September 2026

> Historical first-pass implementation and verification below. The subsequently approved plan, current changes and fresh results are recorded in [implementation.md](implementation.md) and `implementation-validation.json`. Do not use the earlier test counts or lab scores as current validation.

Status: implemented locally; **not deployed and not submitted for AdSense review**. Google controls acceptance. This work does not establish that the site now meets Google's assessment or guarantee approval.

## Rejection and scope

The owner's AdSense screen reports **Low value content**, with **ads.txt Authorized**. The screen is the evidence for this rejection; we did not infer a broken ad script from absent ad units. Account activation/payment-info messaging is a separate item to confirm in AdSense, not a substitute for improving content.

The local branch is `feature/seo-aeo-geo-agent`, based on `5ab912a`. No prompt records, published flags, collection membership, existing canonical routes, homepage ordering, production database rows or production assets were changed. The 95 unfinished drafts remain deferred. No purchases, paid APIs, push, merge, deployment or AdSense confirmation/request-review action occurred.

## Implemented changes

1. **Documented walkthrough** at `/guides/prompt-trial`: two actual ChatGPT web image-generation attempts using the exact recorded PicMagic prompts. One no-reference fictional adult portrait; one same-conversation scene change referencing the first generated person. Both first results and full submitted inputs are visible. No invented model version, success rate, real-person likeness test, corrective run or tool-comparison claim.
2. **Six authored practical workflows** on existing detail URLs: reference preparation, a three-step process, two symptom-specific follow-up instructions and checks before sharing. These are guidance, explicitly not six generation tests:
   - `/ai-prompts/social-media/a-fold-around-you-profile`
   - `/ai-prompts/social-media/borrowed-moon-closing-time`
   - `/ai-prompts/couple/barefoot-at-blue-hour`
   - `/ai-prompts/kids/tiny-krishna-big-wonder`
   - `/ai-prompts/product-photography/perfume-the-water-sculpture`
   - `/ai-prompts/social-media/portrait-cut-from-monsoon-paper`
3. Where the new workflow exists, it replaces the shorter generic guidance block instead of stacking both. Other existing authored guides remain available.
4. **Manual ad-slot guards** exclude draft previews and prompts failing the existing public quality/indexability gate, and empty catalogue results. This does not claim to audit Google's Auto ads behaviour or change Google's approval state.
5. Links from About, the reference-photo guide and both tested prompts expose the walkthrough. Its canonical, structured WebPage metadata and sitemap entry are explicit. The six detail pages' sitemap/WebPage modification dates include the new workflows. No new keyword collection or duplicated canonical is created.
6. The new guide's analytics path is allowlisted without query parameters or personal data. Exact historical trial inputs remain separate from current catalogue text.

## Genuine evidence and limitations

See `test-provenance.json` and `content/prompt-trial.json`. Two original fictional images were generated through the owner's existing **ChatGPT browser workflow**, not Codex imagegen or a paid image API. No personal or competitor image was supplied. Private September 24 identity-review assets were not repurposed or published: those were different preview workflows, not proof of these user-prompt tests.

- Visible composer mode: Instant. Underlying image model/version: not disclosed by the observed interface.
- A Fold Around You: 1254×1254 download despite a 1024×1024 prompt target. Resized to 1024×1024; paper stays behind the face. Square and circular checks at 40, 64 and 128 pixels show recognizable facial landmarks and preserved hair/chin margins. Fine paper texture is lost at 40 pixels.
- Borrowed Moon: 1122×1402 download; resized to 1080×1350. Glasses, beard and hair remain broadly consistent under a changed angle and warm theatre lighting. The moon's outer left edge is clipped. The cart and supporting wheel are visible. Broad visual consistency is not a biometric or exact-likeness assessment.
- One attempt each, no corrections. Generated output can vary and is affected by conversation context. No claim is made for repeatability, real uploads, other ages, children, groups, products or other providers.
- Public WebP assets total **237,834 bytes**, including the 13,374-byte crop sheet. Responsive Next Image delivery, intrinsic dimensions and lazy loading are retained. Raw originals are local/gitignored in `.release-private/adsense-readiness-2026-09-25/`.

## Current-library triage

`library-snapshot.json` accounts for all **186 local records: 91 published, 95 drafts, 40 collections**. Existing gates permit 91 prompt detail pages, 8 collection hubs and 6 category hubs to be indexed. The live public search count was 91 earlier in this session; the snapshot is a local inventory, not a production database export or a new full visual audit.

The current structural screen returns **31 text-overlap pairs and 11 shared-preview pairs**. It matches the clusters examined in `../seo-followup-2026-09-24/intent-review.md` (historical editorial review, not a generation test). All shared previews are photo/reel counterparts. Do not remove reference-authority instructions simply to lower a similarity score.

Disposition for this batch:

- Keep existing routes and the explicit still-versus-motion descriptions; no automatic deletion/noindex/redirect based on lexical similarity.
- Keep useful dating/catalogue/profile utility choices, while resisting more near-identical additions.
- The three modest portrait-reveal reels remain **provisional** (`your-next-introduction-reel`, `soft-light-unmistakably-you-reel`, `coral-against-the-sky-reel`). Their separate value needs stronger practical evidence or an explicit consolidation decision. No generated video has been claimed or produced in this task.
- Men/women double-exposure variants were explicitly requested by the owner. Do not collapse them merely because shared instructions score 97% similar.
- The new walkthrough tests two existing ideas instead of increasing the prompt count. It improves demonstrable usefulness but is not proof that every library record was tested.

## Verification

- Lint: passed.
- TypeScript: passed.
- Unit tests: **180 passed / 29 files**. Includes exact evidence-input hashes, actual asset files, identity/material-specific correction rules and absence of manual ads on drafts/unreviewed details.
- Content validation: **186 prompts, 17 categories, 40 collections; zero missing images**.
- SEO validation: **91 eligible prompts, zero errors, 42 retained editorial notices** (31 overlaps + 11 shared previews).
- Release-content validation: **91 published, 95 deferred drafts; 50 original canonical owners preserved**.
- Browser regression tests: **46 passed** across desktop Chromium and mobile Chromium. Includes new trial exact-copy checks, workflow, copy/save, search, create/enhance/reel creators, protected admin routes, canonical metadata, no-JavaScript pagination, blocked storage and accessibility.
- New walkthrough checked at **375, 430 and 1440 pixels** with no horizontal overflow; screenshot review confirms readable type and intact image proportions. All three illustration assets load. Durable review images are in `screenshots/`; final local HTTP/canonical/sitemap probes are in `local-smoke.json`.
- Production-mode build: the complete normal `pnpm build` passed with Turbopack in a fresh `.next-release` directory, including preview cache-header generation. A cached permission failure was resolved by using a fresh build directory; no build configuration was weakened. A Webpack fallback had also passed during diagnosis. See `validation.json`.
- Lighthouse: `performance.json` and raw reports contain one mobile lab measurement per page with Google requests blocked. These are **local**, not live/field results:

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Prompt trial | 100 | 100 | 100 | 100 | 1.69s | 0 |
| Fold profile detail | 96 | 100 | 100 | 100 | 2.72s | 0 |

The final standard Turbopack bundle scores 100 for Best Practices on both pages; an earlier Webpack diagnostic run reported a CSP issue. No CSP protection was relaxed. Detail LCP exceeds 2.5s in this one lab run; these results do not establish field Core Web Vitals. Existing unused/legacy JavaScript remains a performance opportunity. The final lab measurements overlapped part of the browser regression run; they are indicative, not an isolated performance benchmark.

## Release and re-review checkpoint

The repository's standing instruction says: **“Explicit owner release approval is required before any merge, content activation or production deployment.”** September 15 approval was scoped to that release; future unapproved work remains branch-only. This remediation is therefore a local reviewable batch.

After explicit approval of this batch:

1. Check current Netlify allowance and deployment controls; release this verified batch once. No additional paid services.
2. Verify the live guide, six workflows, optimized images, original prompt copy/save/share, canonical URLs, sitemap, robots and draft protections. No database migration is required.
3. Have real users try the workflow and record concrete problems. Do not invent testimonials, buy traffic or announce a minimum traffic/article-count threshold as a Google requirement.
4. Confirm AdSense account setup separately. Reassess the provisional reel pages and remaining untested content; strengthen or propose consolidation where actual value is weak.
5. Only after the improved material is live and reviewed should the owner truthfully confirm the issues were addressed and request another AdSense review. This task has not clicked that confirmation.

The next review can still be rejected. No arbitrary waiting period, publication volume or Lighthouse score guarantees approval.

## Policy sources

Inspected 25 September 2026:

- [Google AdSense content and user experience](https://support.google.com/adsense/answer/10015918): unique value, meaningful curation, similar-page consolidation where appropriate, and usable navigation.
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938): low-value/replicated content and truthful publisher representation.
- [Publisher policy: spam policies for Google web search](https://support.google.com/publisherpolicies/answer/11035931).

The six workflows and trial are our implementation choices based on those principles. Google does not prescribe this specific page count or test format.
