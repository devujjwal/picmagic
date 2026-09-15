# PicMagic Gen Z discovery — local handoff, 15 September 2026

Four concepts passed visual QA and are integrated as unpublished local drafts. Five were shortlisted from 15 candidates. The fifth, a scanner-style profile picture, was rejected after a focused correction because its mechanism disappears in small circular crops. No substitute was added to inflate the batch.

## Research and novelty review

Fresh browser inspections covered three image/full-prompt pairs per supplied site, nine total. One YouMind preview is a screenshot of editing instructions, not proof of a successful image result. Canghe was accessible through Chrome; its text-only response was empty. Its modal examples have traceable GitHub case locators. No source popularity/viral claim is treated as demand evidence. Observations, interpretations and access limits are separated in [research.json](research.json).

| Reference | Observed creative mechanism |
|---|---|
| [AP01](https://aiphotoprompt.io/prompts/transform-the-original-photo-into-a-playful-mixed-media-pop-art-portrait/) | Photo plus flat illustrated interaction |
| [AP02](https://aiphotoprompt.io/prompts/manual-1787386710681-9-qkq2a-gemini-generated-image-88j8hz88j8hz88j8/) | Direct-flash candid with extreme foreground hand |
| [AP03](https://aiphotoprompt.io/prompts/person-pet-to-ugly-ms-paint/) | Deliberately crude material/style translation |
| [YM01](https://youmind.com/prompts/selective-object-material-editing-34191) | Constrained object-only editing |
| [YM02](https://youmind.com/prompts/colossal-man-sitting-on-a-london-street-1792) | Human/environment scale mismatch |
| [YM03](https://youmind.com/prompts/amateur-snapshot-collage-prompt-34590) | Intentional capture imperfections across a sequence |
| [CG01](https://gpt-image2.canghe.ai/#case-540) | Impossible architecture with familiar scale cues |
| [CG02](https://gpt-image2.canghe.ai/#case-534) | One graphic interference across a portrait |
| [CG03](https://gpt-image2.canghe.ai/#case-539) | Raw graphic companion portrait |

The complete starting library was reconciled at **173 prompts, 40 collections, 75 locally published and 98 local drafts**. These flags are not a production inventory. Titles, slugs, descriptions, full user prompts, image briefs, transformation types, tags, memberships and preview paths were indexed; 17 historical queue files were registered. See [current-library.json](current-library.json) and [duplicate-index.json](duplicate-index.json).

Semantic comparisons used subject + mechanism + composition + payoff. Actual nearest images were inspected, rather than deciding from titles alone. Sixteen baseline comparison slots include three missing draft images, explicitly left blank. The nearest footwear draft has no preview, so its visual novelty could not be checked directly; the frame-break result was also compared with the existing folded-paper profile frame and the available miniature/physical-set library. [Comparison sheet](media/new-vs-existing.png). This is editorial review, not an exhaustive image-similarity algorithm or a claim that no similar image exists anywhere.

## All candidates

D = distinctiveness; N = novelty against PicMagic; S = predicted shareability. Scores are editorial predictions, not user research. The full candidate records include narrative, persona, preservation rules, execution risks, source mechanisms and nearest-existing reasoning in [candidates.json](candidates.json).

| Concept | D/N/S | Editorial decision | Nearest existing slug |
|---|---|---|---|
| GZ01 — Between Two Gravities | 5/4/4 | shortlist | the-art-of-standing-still |
| GZ02 — The Listening Room Has Tides | 4/4/5 | shortlist | borrowed-moon-closing-time |
| GZ03 — Chai Between the Floors | 5/4/5 | shortlist | coffee-rain-and-college-days |
| GZ04 — One Step Outside the Frame | 4/4/4 | shortlist | footwear-the-city-in-one-step |
| GZ05 — A Face on the Scanner Glass | 4/4/4 | shortlist | small-burst-of-motion-profile |
| GZ06 — Your Shadow Gets the Encore | 4/3/4 | reject-overlap | shadow-athlete-at-dawn |
| GZ07 — The Cassette Valley | 4/2/4 | reject-duplicate | the-tailors-mountain-range |
| GZ08 — Monsoon in Your Jacket | 4/2/4 | reject-duplicate | a-mountain-journey-within |
| GZ09 — The Chrome Ripple Portrait | 3/2/4 | reject-duplicate | a-fold-around-you-profile |
| GZ10 — The Cyber Café Saved Your Evening | 3/3/3 | reject-generic | a-frame-from-another-decade |
| GZ11 — Three Friends, One Gravity Error | 5/4/4 | defer-feasibility | one-day-four-possible-worlds |
| GZ12 — Your Memory Becomes a Stamp | 3/2/3 | reject-duplicate | last-train-two-ink-portrait |
| GZ13 — The Platform Paused the Rain | 4/3/4 | defer-readability | monsoon-rider-under-the-flyover |
| GZ14 — The Photo Booth Has a Tomorrow | 4/2/4 | reject-duplicate | one-day-four-possible-worlds |
| GZ15 — You Are the Rooftop Skyline | 4/3/4 | reject-source-proximity | the-tailors-mountain-range |

Five overlapping miniature/material/print/identity-montage directions were rejected as duplicates; the shadow concept overlapped existing content; the cyber-café concept was too generic; the giant-person skyline direction remained too close to its source mechanism. Three-friend gravity was deferred for identity/anatomy feasibility, and the rain-plane idea for weak small-screen readability. See each record’s similarity reason and novelty difference.

## Shortlist and media decisions

Only the five shortlisted concepts were generated. ChatGPT browser image generation was available. **No Codex/Astra generation, paid API, purchase, video generation or private-photo upload was used.** Eight outputs were produced: five initial images plus one focused correction each for the stairs, chai and scanner images. All fictional human personas were explicitly Indian adults aged 20–25 in their briefs; their appearance is not inferred from a real photograph.

| Concept | QA result | Existing collection assignments | Optimized master |
|---|---|---|---|
| Between Two Gravities | Accepted after one correction. Rotated treads, horizontal balusters and sideways door distinguish the set. Person remains upright. Optical reading is subtler than planned: final editorial D reduced from 5 to 4; not recommended for homepage. | creative-transformations, cinematic | 180 KiB, 1080×1350 WebP |
| The Listening Room Has Tides | Accepted. Five tactile acoustic ribs form a large readable wave around a natural listening pose. Hands and single subject are plausible. | creative-transformations, studio | 188 KiB, 1080×1350 WebP |
| Chai Between the Floors | Accepted after removing lettering. Exactly three separate friends; distinct faces, credible cups/hands and steel bridge. Height reads on mobile. Fictional scene, not real travel evidence. | creative-transformations, cinematic | 162 KiB, 1080×1350 WebP |
| One Step Outside the Frame | Accepted. One continuous leg exits the frame with believable floor shadow; face remains prominent. Closest footwear draft has no asset; comparison against available folded-frame and miniature assets found no same mechanism/composition. | creative-transformations | 78 KiB, 1080×1350 WebP |
| A Face on the Scanner Glass | Rejected after one correction. Face is readable at 40/64/128px, but circular cropping removes the scanner rim and reduces the mechanism to a light stripe. Final execution distinctiveness 3; do not integrate or feature. | Not integrated | No public asset |

The stair concept’s execution score was reduced from 5 to **4**: its sideways balusters/doorway distinguish it, but the illusion is less immediate than intended. The scanner’s final execution score is **3** and it is excluded. Four accepted records preserve the selection novelty/shareability scores at or above 4.

[Accepted contact sheet](media/accepted-contact-sheet.png) · [Five final attempts](media/contact-sheet.png) · [All eight attempts](media/all-attempts.png) · [New vs existing](media/new-vs-existing.png) · [40/64/128px square/circle scanner review](media/profile-crop-review.png).

Exact initial prompts, correction prompts, conversation URLs, local sources, source hashes, accepted outputs, dimensions, byte sizes and QA notes are in [generation-manifest.json](generation-manifest.json). Raw sources stay under media/sources; optimized master and thumbnail assets live under public/previews. Conversion only performs a tiny central ratio trim, resizing and WebP encoding. No generated temporary placeholder is integrated. Four masters total about 608 KiB; each has a 480×600 thumbnail. Existing responsive image delivery and reserved image proportions are reused.

## Final copyable prompts and identity rules

[PRODUCTION-PROMPTS.md](PRODUCTION-PROMPTS.md) contains complete final user prompts and separate preview-generation briefs for all five shortlisted concepts, including the rejected experiment. The earlier REVIEW.md remains a proposal snapshot; final integrated wording is authoritative in PRODUCTION-PROMPTS.md and content/additions/gen-z-prompts.json.

Reference-present prompts preserve actual age, facial geometry, ethnicity, complexion, natural proportions, hairline, glasses and facial hair. They do not make an older reference 22. Hair arrangement, expression, pose and clothes may adapt where useful. Without a reference, one fictional Indian/South Asian adult is used, or exactly three distinct fictional adults for the friend scene. The group prompt preserves three identities independently. The frame-break concept separates shoe/product fidelity from person identity and restricts product details to supported references. Child references are not silently aged into this adult batch. Identity matching is an instruction, not a guarantee; no real-person reference transfer test was performed.

## Local integration, routes and SEO

Four new draft records; **177 total local prompts, 75 locally published, 102 drafts, 40 collections**. Existing records, canonical paths and collection definitions are preserved. No new collection or homepage ordering was added. Memberships are a local preview overlay, not production collection activation.

All four detail paths use one canonical namespace:

```text
/ai-prompts/social-media/between-two-gravities
/ai-prompts/social-media/the-listening-room-has-tides
/ai-prompts/social-media/chai-between-the-floors
/ai-prompts/social-media/one-step-outside-the-frame
```

Each remains unpublished, unfeatured and noindex. The existing seed-only PICMAGIC_SOCIAL_PREVIEW guard also requires indexing disabled and refuses hosted Netlify/CONTEXT/CI environments. Default seed mode and the production Supabase repository do not expose these drafts. New records are excluded from the sitemap, rejected scanner detail returns 404, and collection appearances do not create extra canonicals. Existing related-content ranking is reused; nearest-comparison links remain editorial evidence rather than a new public routing model.

A browser test found that the Next Data Cache survived local rebuilds and returned stale seed prompt text. The seed cache key now includes the content/membership fingerprint; the Supabase cache path is unchanged. The rerun copies the exact final prompt.

## Validation performed this round

| Check | Result |
|---|---|
| Lint | Pass, no errors or warnings after removing an unused QA-script import |
| TypeScript / Next type generation | Pass |
| Content/schema/persona validation | 177 prompts, 17 categories, 40 collections; zero missing published images; four accepted draft images independently checked |
| Unit/component/repository tests | 128 passed across 21 files |
| Final desktop/mobile public + new-content E2E | 40 passed |
| New-content responsive screenshot recheck | 10 passed, image decoding awaited after viewport changes |
| Previous three social concepts | Eight regression journeys passed during this round before the seed-cache cleanup; historical report/screenshots preserved |
| Local production build | Pass, Next.js 16.3.4 |
| Accessibility | Axe checks passed in the new detail and existing public journeys |
| Responsive | 375, 430 and 1440px checks and screenshots; no horizontal overflow |
| Copy / Save / Share | Full clipboard prompt, saved-state journey and canonical copy-link checks passed |
| SEO / noindex / canonical / sitemap | Passed in local browser journeys |

The intermediate post-copy-edit run had eight stale-cache clipboard failures and 32 passing existing/public checks. This was resolved by the seed fingerprint, followed by 40/40 passing tests. A screenshot timing issue after viewport changes was resolved by awaiting image decoding before capture; final screenshots are JPEGs under [media/qa](media/qa). Earlier captures are not relied upon as final visual evidence. Logs are in [verification](verification).

Manual review inspected generated anatomy/group count, full-size images, mobile contact-sheet readability, existing-neighbour comparisons, profile masks and representative local detail layouts. The 18-journey initial run is an intermediate log, not an additional claim of distinct final tests. No Lighthouse lab score or field Core Web Vitals measurement was run for this focused content round. Authenticated admin publishing, RLS and production smoke tests were intentionally not exercised because no database/schema/admin code changed and release is held.

## Homepage recommendation only

Chai Between the Floors is the strongest candidate for a future social/friendship discovery feature. One Step Outside the Frame is the strongest immediately legible solo transformation. Consider these in a future approved homepage review; no existing feature was automatically replaced. Keep Between Two Gravities below those because its optical effect takes longer to read. Never feature the rejected scanner asset.

## Branch, changed files and release hold

Branch: `content/identity-and-collection-audit`. Starting parent: `b616def9ad3d03f366d21477f918f69df425888d`. Main remains `374fe7fe72b80c1c090af50757d418fded7aa651`. Task changes are recorded in a local feature-branch commit with `[skip netlify]`; exact resulting hash is supplied in the final handoff. No push, PR, merge, tag, Netlify build, deployment, production content/Storage write or scheduled release was made. No Netlify remote settings were changed; remote branch/preview controls have not been reverified, therefore pushing remains prohibited. The live site was not paused.

Changed application files: content/catalog.ts; new content/additions/gen-z-prompts.json and gen-z-memberships.json; lib/content.ts; lib/prompts/social-preview.ts. New tests: tests/unit/gen-z-discovery.test.ts and tests/e2e/gen-z-discovery.spec.ts; existing editorial hash coverage extended. AGENTS.md records the scoped workflow and release hold. Four image masters and four thumbnails added under public/previews. This dated audit contains research, all candidates, prompts, manifests, comparison sheets, screenshots and test logs. No dependency, migration or production environment changes.

Pre-existing release-report work and next-env.d.ts changes remain outside this task commit. Historical social screenshots generated during regression testing were restored byte-for-byte from their original commit after copies were preserved in this audit.

## Outstanding / future release checklist

- Scanner concept failed visual distinctiveness after its one correction. It is deliberately not in the local content catalogue and needs rethinking, not another automatic generation retry. Four concepts, not five, are accepted.
- The closest footwear draft has no existing preview; direct visual comparison is unavailable for that one neighbour. Available frame/scale neighbours were reviewed instead.
- Public persona prompts were statically validated; actual identity retention depends on each external image tool and user reference quality. No guarantee is made.
- Owner review of the accepted local batch and explicit future release approval are still required before production activation.
- Before any push, reverify Netlify production branch, branch deployments, deploy previews, PRs, CI/build hooks and remaining allowance. A reset alone grants no release permission. No billing reset date was newly verified in this round.
- When release is explicitly approved, activate approved records and memberships through the established release process, run final tests against that release configuration, verify indexing decisions and perform the single authorized deployment.
- No automatic release is scheduled.

## Resume locally

```sh
CONTENT_SOURCE=seed PICMAGIC_SOCIAL_PREVIEW=true NEXT_PUBLIC_INDEXING_ENABLED=false NEXT_PUBLIC_ADS_ENABLED=false NEXT_PUBLIC_GA_ID= NEXT_PUBLIC_ADSENSE_CLIENT= PICMAGIC_DIST_DIR=.next-release pnpm build
CONTENT_SOURCE=seed PICMAGIC_SOCIAL_PREVIEW=true NEXT_PUBLIC_INDEXING_ENABLED=false NEXT_PUBLIC_ADS_ENABLED=false NEXT_PUBLIC_GA_ID= NEXT_PUBLIC_ADSENSE_CLIENT= PICMAGIC_DIST_DIR=.next-release pnpm start --port 3005
```

The local review server was left on port 3005 for review. No remote service is needed to browse these seed drafts.
