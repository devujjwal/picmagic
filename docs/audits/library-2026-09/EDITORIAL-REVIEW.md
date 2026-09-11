# PicMagic — editorial review before media generation

**Editorial stage complete locally. This is not a production-release completion report.** No further image or video generation requests were submitted during this pass; no deployment or production database mutation was made.

## 1. Scope and decisions

| Measure | Result |
|---|---:|
| Prompt records reviewed | 163 — 50 original + 113 expansion |
| Collections reviewed | 38 — 7 existing + 31 expansion |
| Enhancement controls reviewed separately | 16 utility controls |
| Retained creative text | 34 — 28 original + 6 expansion |
| Creatively rewritten / reel sequence reworked | 127 — 22 original + 105 expansion |
| Duplicate photo records merged | 2 |
| Removed without a replacement / editorial rejection left unresolved | 0 |
| Final retained library | 161 — 86 photo, 5 photo-edit, 70 reel |

Counts describe editorial decisions, not word-change totals. Persona safeguards, internal metadata and hook labels do not turn an otherwise retained creative scene into a rewrite. Reworked reels count as rewrites even when their useful poster scene stays the same.

## 2. The two merges

- `safe-in-your-arms` → existing `the-gentlest-new-beginning`. The babies photo collection reuses that canonical newborn/caregiver utility.
- `under-the-neem-shade` → existing `soft-light-unmistakably-you`. The profile-photo collection reuses the age-honest studio utility.

The two short-video utilities remain distinct formats; their complete scenes and posters now match the reused photo records. All 50 original production canonical paths remain unchanged. Never-deployed expansion slugs were updated to match their new concepts; no production redirects are needed for those new records. The full mapping is in `editorial-slug-changes.json`.

## 3. Distinctiveness distribution

| Score | Retained records | Treatment |
|---|---:|---|
| 1 | 0 | Not retained |
| 2 | 0 | Not retained |
| 3 | 34 | Practical utility, excluded from homepage/featured creative discovery |
| 4 | 72 | Strong visual concept |
| 5 | 55 | Strong transformation or visual story |

All 127 creative records score 4–5. These are editorial judgments, not measured generation-quality claims. The score and rationale remain internal. Homepage selection also balances audiences so one high-scoring category cannot fill the first screen.

## 4. Collection order

Top three concepts shown below in the new stored order. The full four-or-more-item order and individual rationales are in `editorial-audit.json`. Utility collections deliberately lead with the most useful deliverable rather than pretending to be dramatic campaigns.

| Collection URL | Leading concepts, in order |
|---|---|
| `/collections/golden-hour` | The Palace of Nine Suns |
| `/collections/romantic` | The Shore That Lights Up for Two → A little rain. A lot of romance. → Old-school charm, new memories |
| `/collections/saree` | The Palace of Nine Suns → Dhunuchi Evening in Kolkata |
| `/collections/cinematic` | The City Pauses for You → City lights, main-character energy → The desert in your rear-view |
| `/collections/studio` | The birthday astronaut → A tiny superhero off duty → A modern bridal heirloom |
| `/collections/professional` | Your next chapter, in focus → A headshot that feels like you |
| `/collections/diwali` | Diwali, a Thousand Points of Light |
| `/collections/pre-wedding` | Royal Jaipur After-Hours → Monsoon Love Story → Desert Moonlight Promises |
| `/collections/pre-wedding-reels` | Royal Jaipur After-Hours → Monsoon Love Story → Desert Moonlight Promises |
| `/collections/maternity` | Moonlit Motherhood → Monsoon Maternity at the Heritage Window → Generations Waiting Together |
| `/collections/maternity-reels` | Moonlit Motherhood → Monsoon Maternity at the Heritage Window → Generations Waiting Together |
| `/collections/bikes` | Himalayan Last Rider → Midnight Fuel Stop → Monsoon Rider Under the Flyover |
| `/collections/bikes-reels` | Himalayan Last Rider → Midnight Fuel Stop → Monsoon Rider Under the Flyover |
| `/collections/cars` | Desert Road Hero → Retro Bombay, Through the Windscreen → Neon Monsoon Drive |
| `/collections/cars-reels` | Desert Road Hero → Retro Bombay, Through the Windscreen → Neon Monsoon Drive |
| `/collections/gym-fitness` | Split-Second Athlete → After the Last Rep → Shadow Athlete at Dawn |
| `/collections/gym-fitness-reels` | Split-Second Athlete → After the Last Rep → Shadow Athlete at Dawn |
| `/collections/office-corporate` | Founder After Hours → Newsroom, Before the Opening Bell → The Idea Becomes a Skyline |
| `/collections/office-corporate-reels` | Founder After Hours → Newsroom, Before the Opening Bell → The Idea Becomes a Skyline |
| `/collections/dating-profile` | Coffee and a real smile → The bookshop detour → Sunday park conversation |
| `/collections/dating-profile-reels` | Coffee and a real smile → The bookshop detour → Sunday park conversation |
| `/collections/travel` | Meghalaya Cloud Walk → Goa After the Monsoon → The Lighthouse Keeper's Morning |
| `/collections/travel-reels` | Meghalaya Cloud Walk → Goa After the Monsoon → The Lighthouse Keeper's Morning |
| `/collections/instagram-profile-picture` | Monochrome Rain, Face in Focus → Floral Shadows, a Clear Face → Soft light, unmistakably you |
| `/collections/instagram-profile-picture-reels` | Monochrome Rain, Face in Focus → Floral Shadows, a Clear Face → Coral against the sky |
| `/collections/indian-festivals` | Tiny Krishna, big wonder → Diwali, a Thousand Points of Light → Holi, the Colour Before It Falls |
| `/collections/indian-festivals-reels` | Diwali, a Thousand Points of Light → Holi, the Colour Before It Falls → Navratri, Still at the Centre |
| `/collections/babies` | First Birthday Cloud World → The Nursery Moon Mission → The Family's Little Storybook Reader |
| `/collections/babies-reels` | First Birthday Cloud World → The Nursery Moon Mission → The Family's Little Storybook Reader |
| `/collections/pets` | The Maharaja of the Window Seat → Tiny Pet, Giant Space Mission → You and Your Pet, the Adventure Poster |
| `/collections/pets-reels` | The Maharaja of the Window Seat → Tiny Pet, Giant Space Mission → You and Your Pet, the Adventure Poster |
| `/collections/product-shoots` | Perfume, the Water Sculpture → Handbag in the Architecture of Shadows → Your product, beautifully simple |
| `/collections/product-shoots-reels` | Perfume, the Water Sculpture → Handbag in the Architecture of Shadows → Skincare on stone |
| `/collections/womens-fashion-ecommerce` | The Palace Saree, Every Border Visible → The Kurta in the Jali Light → Resort Dress, the Wind Between Arches |
| `/collections/womens-fashion-ecommerce-reels` | The Palace Saree, Every Border Visible → The Kurta in the Jali Light → Resort Dress, the Wind Between Arches |
| `/collections/mens-fashion-ecommerce` | Kurta at the Lantern Courtyard → Footwear, the City in One Step → The everyday shirt catalogue |
| `/collections/mens-fashion-ecommerce-reels` | Kurta at the Lantern Courtyard → Footwear, the City in One Step → The everyday shirt catalogue |
| `/collections/ecommerce-product-showcase-reels` | The honest quarter rotation → Fabric, up close → Front, back, the real product |

## 5. Borderline concepts

No borderline creative concept is approved for prominent discovery. These eight dating-profile records remain deliberately modest, score-3 utility: they solve believable self-presentation, but would be weak homepage inspiration. Retain them in the labelled utility lane and reassess if usage does not support their value.

- `coffee-and-a-real-smile` — Provides a believable dating-profile alternative to a selfie: readable identity, natural expression and a relaxed everyday setting without invented glamour.
- `coffee-and-a-real-smile-reel` — Provides a believable dating-profile alternative to a selfie: readable identity, natural expression and a relaxed everyday setting without invented glamour.
- `the-bookshop-detour` — Offers a dating-profile photo that communicates an interest in reading through a plausible candid moment instead of a formal pose.
- `the-bookshop-detour-reel` — Offers a dating-profile photo that communicates an interest in reading through a plausible candid moment instead of a formal pose.
- `sunday-park-conversation` — Provides an approachable dating-profile portrait with natural expression and environmental depth, retaining ordinary body proportions.
- `sunday-park-conversation-reel` — Provides an approachable dating-profile portrait with natural expression and environmental depth, retaining ordinary body proportions.
- `something-good-in-the-kitchen` — Creates a believable cooking-interest dating-profile image with safe simple activity rather than fabricated luxury or physical transformation.
- `something-good-in-the-kitchen-reel` — Creates a believable cooking-interest dating-profile image with safe simple activity rather than fabricated luxury or physical transformation.

Headshot, restoration and seller-catalogue utilities also remain score 3. Their narrow practical value is explicit; a white background or garment detail does not need a fantasy narrative.

## 6. Final image requirement

**69 images still need generation: 63 replacements for rewritten creative concepts and 6 first assets for retained seller utilities.** Each is one asset job, shared with a photo or reel poster only when the scene aligns.

The approved manifest has 70 jobs total: 69 pending and one already integrated from an image/edit submitted before the pause. That existing kitchen image was inspected, accepted for the retained cooking-profile utility, optimized to 113,470-byte WebP plus a 35,670-byte thumbnail, and reused for its reel poster. No new image request was made. The earlier mountain output was not accepted for the new cloud-walk concept because its stationary close framing does not show the required walking composition.

`approved-image-manifest.json` contains exact briefs, dimensions, users of each shared asset, scores, rationales, target files and hashes of the reviewed user prompts. The old queue is archived and cannot be revived by the sync script. Changed prompts use pending asset paths and remain unpublished locally until alignment review.

ChatGPT remains preferred. The owner permits Codex built-in generation only when ChatGPT limits are exhausted; this does not authorize a paid image API.

## 7. Reel video shortlist

These eight creative reels have explicit hook → progression → payoff and are the next video candidates, after their posters pass visual review.

- **Royal Jaipur After-Hours** (`royal-jaipur-after-hours-reel`): Start with two moving shadows crossing the lamp-lit floor. → Lift to the couple taking two slow steps and exchanging a glance. → Reveal the long symmetrical illuminated corridor around them.
- **Himalayan Last Rider** (`himalayan-last-rider-reel`): Close on snowflakes crossing the headlamp beam. → Reveal the rider beside the stationary motorcycle. → Pull wide enough to expose the immense empty pass and mountain layers.
- **Moonlit Motherhood** (`moonlit-motherhood-reel`): Begin on the silver-lit edge of the fabric crescent. → Move inward to the mother's resting hands and face. → Reveal the complete crescent framing her supported seated silhouette.
- **Neon Monsoon Drive** (`neon-monsoon-drive-reel`): Start on a neon line reflected along the door panel. → Follow it to the owner's relaxed hand and face. → Reveal the whole car in the wet street's two-colour reflections.
- **Holi, the Colour Before It Falls** (`holi-the-colour-before-it-falls-reel`): Begin on a thin ribbon of powder suspended beside the shoulder. → Reveal the smiling face as the two colour clouds spread behind it. → Hold the complete pink-and-yellow arc around the unchanged person.
- **The Palace Saree, Every Border Visible** (`the-palace-saree-every-border-visible-reel`): Start on the exact supplied border pattern across the balustrade. → Follow the fabric to the model's natural drape. → Reveal the full garment and heritage corridor together.
- **Perfume, the Water Sculpture** (`perfume-the-water-sculpture-reel`): Start on the thin illuminated edge of the water arc. → Reveal the unchanged bottle in front of it. → Hold the full water sculpture framing the dry readable label.
- **Meghalaya Cloud Walk** (`meghalaya-cloud-walk-reel`): Begin on one boot stepping along the broad ridge path. → Lift to the traveller and the green hill line. → Reveal the enormous cloud sea lying below their eye level.

Exact prompts, source-poster paths and 8-second specifications are in `approved-video-manifest.json`. Prefer 9:16, but first approve a safe 9:16 crop/keyframe where the shared photo is 4:5. Videos remain muted, playsinline, lazy-loaded and poster-backed. Never claim a poster is a real motion preview.

The existing fragrance utility clip remains available; it is not promoted as a new creative campaign. The old anniversary clip is archived and detached because the anniversary story changed. Kling may use existing credits only. The last observed balance was 25 credits; no assumption is made that it can cover all eight jobs. Runway Free did not grant the required generation feature. Actual generation remains an external dependency under the owner’s stated exception; no purchase or upgrade is authorized.

## 8. Content-model and publication safeguards

- `content_intent`, `distinctiveness_score`, `why_ai`, `editorial_review_version` and `preview_review_status` are stored separately from the copyable prompt.
- Applicable user prompts remain reference-first; no-reference subjects default to Indian/South Asian. House-preview persona remains in `image_brief`. Cultural style never determines the reference person’s ethnicity.
- A publication requires meaningful rationale, score ≥3, approved current preview and a completed editorial review. Creative discovery requires score 4–5. Utility cannot be featured/trending.
- Every reel requires hook, progression and payoff, with scene timing summing to the selected duration. The guided reel builder now follows this structure too.
- Editing creative text, purpose or quality decisions invalidates the admin review checkbox. Media changes require a new preview check. Asset integration requires the current prompt hash so an old image-review file cannot silently approve a changed concept.
- The local database migration enforces publication checks even when writes bypass the form. The main production migration is not applied yet.
- Collections order by creative purpose, score and editorial rank; utility is rendered in a separate labelled section. Homepage cards require approved images and creative eligibility, with category variety.

## 9. Validation and release state

**Passed: lint, TypeScript, 95 unit tests (14 files), content validation, eight desktop/mobile browser journeys including the complete admin publishing flow, six local SQL assertions, and the local production build.** Responsive checks at 320, 375, 430, 768, 1024 and 1440 pixels found no horizontal overflow. Exact evidence is in `editorial-validation.json` and `docs/qa/editorial/`. Unit tests cover all records and merges, identity regressions, scores, homepage eligibility/variety, collection order, utility separation, media approval, reel timing and guided durations. Local SQL tests exercise valid publication and five rejection cases. Browser tests cover desktop/mobile discovery, privacy of pending concepts, utility sections and canonical regression routes; Google services are stubbed.

Currently 43 asset-ready records are visible in the local staged library; 118 are deliberately held for media. That temporary local reduction is not a recommendation to remove those concepts and has not been deployed. Production remains unchanged.

The single production release, final asset-complete Lighthouse/accessibility audit, final full E2E suite and live verification are still outstanding. The release gate intentionally fails until the approved assets are integrated and the requested collections are ready. Do not use a successful code build as permission to bypass that gate.

## 10. Files to use next

- `editorial-audit.json`: all 163 decisions, before/after hashes, reasons and collection ordering.
- `editorial-summary.json`: machine-readable counts.
- `editorial-generator-review.json`: enhancement and guided-generator review.
- `approved-image-manifest.json`: current approved image work only.
- `approved-video-manifest.json`: eight selected video briefs.
- `editorial-slug-changes.json`: never-production URL updates.
