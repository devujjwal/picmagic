# Proposed discovery direction and architecture

All recommendations are conditional on shortlist approval and successful assets. No homepage, route, database, content or media changes were made in Phase A.

## First screen

Use a compact introduction explaining the real journey: **Choose a look → copy/customize the prompt → use it in your chosen image tool.** Show large enough images to understand the transformation. The current `app/page.tsx` hero uses small image placements and a large heading; those small image sizes are unsuitable for multi-panel or miniature concepts. A later implementation should give a strong single scene visual priority, with two supporting concepts whose faces remain readable. Do not represent PicMagic as an in-site image generator.

Recommended opening sequence after all approvals: P01 The River Remembers, P17 Bottle/Water campaign, P04 Courtyard miniature, P06 Railway Letter, then P03 Mountain Journey Within. This alternates a photographic face, non-human product, family scale, couple story and portrait composite. Do not repeat the same images immediately in a second section. Use “Editor's picks”, not “Trending”, unless genuine recent use supports the latter.

## Section order

1. Compact intro and five strongest picks, contingent on successful output quality.
2. Creative Transformations: P08 textile scale, P13 paper relief, P02 four-world composition, P05 print and P12 consistent saree worlds. Show 3:4 art without cropping away panels. Four-world/saree panels may need wider cards rather than a dense mobile grid.
3. Familiar stories, imagined differently: retain Krishna and rain-romance assets as existing strong work; consider family light installation only when its actual replacement passes. Do not insert an unrelated attractive image to fill the section.
4. Useful tools: enhancement, headshots, restoration, profile photographs and accurate catalogue views. These remain easy to find without dominating creative discovery.
5. Reel ideas: only if enough relevant content is ready. Label poster-only concepts explicitly; genuine existing fragrance video remains product utility. Do not advertise new motion previews while generation is deferred.
6. Compact category/collection navigation. Preserve the already-completed local removal of the oversized chip wall and the qualified four-card collection shelf. Do not reinstate every collection as a link or expose inactive collections that resolve to 404.

The local infinite-loading discovery change and no-JavaScript crawlable next-page link are already present. Preserve them; no additional pagination implementation is part of Phase A.

## Canonicals and proposed membership

Add `/collections/creative-transformations` only after its title, substantive editorial copy and at least four relevant published/indexable prompts with approved assets exist. It owns a curated list, never duplicate detail pages. Keep every existing detail canonical in its primary category or `/reel-prompts/[slug]`. P06, P14 and P17 reuse their existing IDs and canonical paths. Display-title improvements do not require slug changes.

First-batch membership may include the ten selected proposals plus retained Krishna/rain examples. Their exact detail candidates are in [shortlist.json](shortlist.json). New proposals need a primary category chosen from the current category table, not a new namespace. The proposed collection is noindex and unpromoted until publication requirements pass. Paginated collection canonicals remain distinct. No sitemap or redirects are changed now.

Proposed merges preserve existing public paths:

- Local `monsoon-love-story` photo → variant/membership under existing `a-little-rain-a-lot-of-romance`; the reel remains a distinct temporal concept.
- Local `desert-road-hero` photo → strengthen existing `the-desert-in-your-rear-view`; update the existing target's person/vehicle policy before publishing.
- Local `the-idea-becomes-a-skyline` photo → bridge-shadow variant under existing `quiet-confidence` / Architect of Ideas; the reel remains distinct.

Check production and old redirect tables again before implementing any merge. If a removed source has ever been published, persist a permanent redirect rather than assume it was always a draft. Keep canonical targets usable. Do not delete old image files until references and rollback needs are reconciled.

## Editorial controls and loading

Reuse `is_featured`, ranking, editorial review status and collection membership. Current homepage eligibility already filters published/approved creative records with scores at least four. Extend editorial selection to avoid adjacent identical mechanisms and repeated assets; no new duplicated public scoring system. `transformation_type` is the one clearly missing dedicated field. Proposed identity constraints are in [generator review](generator-review.md).

After approval, send cards only the data needed for previews and navigation, not the complete prompt library. Reserve image/video dimensions. Prioritize only images actually above the fold; lazy-load lower imagery. Existing central AdSlot/consent handling stays outside the creative scope. Keep preview-first lazy video behaviour, muted inline playback, reduced-motion handling and poster fallback. Measure performance on the actual approved assets, not optimistic placeholder weights.

No current Lighthouse result is claimed for this proposal. Existing test reports are historical. Phase B needs production-mode local browser testing at 375px, 430px and desktop, then the full release gate before one coordinated deployment.
