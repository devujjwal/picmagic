# Gen Z creative discovery — 15 September 2026

Status: five concepts shortlisted; four previews accepted and integrated as local-only drafts. Scanner concept rejected after correction. See FINAL-REPORT.md and PRODUCTION-PROMPTS.md for final QA and integration wording. The proposal prompts below are the pre-integration snapshot. This document does not authorize production release.

## Research

Fresh rendered-browser inspection: three examples per site, nine image/full-prompt pairs. One YouMind preview is only a document screenshot, not demonstrated output. Canghe text-only retrieval was empty but browser modals were accessible. Source popularity language is not evidence of Gen Z demand. Details and exact source locators: [research.json](research.json).

## Current catalogue and duplicates

173 local prompts: 75 locally published, 98 drafts; 40 collections. These are not a live production count. Full searchable fields and historical queues are indexed in duplicate-index.json. Sixteen nearest asset slots were compared; three draft assets were absent (blank slots in baseline), so no visual-retention claim is made for those. Existing prompts/assets remain intact.

## Candidate decisions

| ID | Title | D / N / S | Decision | Nearest PicMagic prompt |
|---|---|---|---|---|
| GZ01 | Between Two Gravities | 5 / 4 / 4 | shortlist | the-art-of-standing-still |
| GZ02 | The Listening Room Has Tides | 4 / 4 / 5 | shortlist | borrowed-moon-closing-time |
| GZ03 | Chai Between the Floors | 5 / 4 / 5 | shortlist | coffee-rain-and-college-days |
| GZ04 | One Step Outside the Frame | 4 / 4 / 4 | shortlist | footwear-the-city-in-one-step |
| GZ05 | A Face on the Scanner Glass | 4 / 4 / 4 | shortlist | small-burst-of-motion-profile |
| GZ06 | Your Shadow Gets the Encore | 4 / 3 / 4 | reject-overlap | shadow-athlete-at-dawn |
| GZ07 | The Cassette Valley | 4 / 2 / 4 | reject-duplicate | the-tailors-mountain-range |
| GZ08 | Monsoon in Your Jacket | 4 / 2 / 4 | reject-duplicate | a-mountain-journey-within |
| GZ09 | The Chrome Ripple Portrait | 3 / 2 / 4 | reject-duplicate | a-fold-around-you-profile |
| GZ10 | The Cyber Café Saved Your Evening | 3 / 3 / 3 | reject-generic | a-frame-from-another-decade |
| GZ11 | Three Friends, One Gravity Error | 5 / 4 / 4 | defer-feasibility | one-day-four-possible-worlds |
| GZ12 | Your Memory Becomes a Stamp | 3 / 2 / 3 | reject-duplicate | last-train-two-ink-portrait |
| GZ13 | The Platform Paused the Rain | 4 / 3 / 4 | defer-readability | monsoon-rider-under-the-flyover |
| GZ14 | The Photo Booth Has a Tomorrow | 4 / 2 / 4 | reject-duplicate | one-day-four-possible-worlds |
| GZ15 | You Are the Rooftop Skyline | 4 / 3 / 4 | reject-source-proximity | the-tailors-mountain-range |

D = distinctiveness; N = novelty; S = predicted shareability. These are editorial judgements, not measured user data. Five shortlisted, six duplicate/overlap rejects, one generic reject, one source-proximity reject, two deferred. The machine-readable decisions are authoritative for exact totals.

## Shortlist and complete prompts

### GZ01 · Between Two Gravities

One person sits naturally on a broad concrete landing close to camera. Behind and beside them, a second flight of the same stairwell climbs horizontally across the wall before turning upward. Repeating terracotta rail posts and daylight make one impossible quarter-turn legible. The person remains upright with ordinary anatomy, not floating or twisted.

Why AI / why try: Creates an otherwise complex or impossible production set: Your outfit stays grounded while the stairwell turns ninety degrees.

Novelty: A continuous stair flight violates spatial orientation; it is not a new wall colour or a pose variation.

Risks: Set continuity can collapse into disconnected stair fragments. Require a visible continuous rail and a stable landing.

Existing destinations: /collections/creative-transformations, /collections/cinematic. One proposed canonical: /ai-prompts/social-media/between-two-gravities.

User prompt:

```text
REFERENCE PRESENT: Treat the uploaded person reference as authoritative for recognizable facial identity, facial geometry, apparent age, ethnicity, natural complexion, hairline, distinguishing features and natural body proportions. The PicMagic preview is a styling example only; do not copy its model, youth, complexion or ethnicity. Preserve existing glasses, facial hair and meaningful personal features unless the user explicitly requests otherwise. Hair may be gently arranged for the concept without changing the hairline; wardrobe, pose, grooming and expression may adapt. Do not age an older reference down.

NO REFERENCE PRESENT: Create one clearly fictional Indian/South Asian adult with believable individual features and ordinary proportions. This is an invented example, not a personalized result.

CREATIVE DIRECTION: One person sits naturally on a broad concrete landing close to camera. Behind and beside them, a second flight of the same stairwell climbs horizontally across the wall before turning upward. Repeating terracotta rail posts and daylight make one impossible quarter-turn legible. The person remains upright with ordinary anatomy, not floating or twisted.

COMPOSITION: A single scene, one continuous body. Your outfit stays grounded while the stairwell turns ninety degrees.

STYLE / MATERIAL / PHOTOGRAPHY: Photographic concrete, worn terracotta railings and soft side daylight. The near landing and person obey ordinary gravity; only the distant architecture makes one ninety-degree turn.

OUTPUT: One 4:5 portrait image, target 1080 × 1350. Keep the person prominent at 375px mobile-feed width, with clear facial landmarks and no tiny protagonist.

CONSTRAINTS: Do not add readable text, logos not supplied as product reference, watermarks, additional effects, extra limbs, merged faces or duplicated people. Keep actual age cues and skin texture; no whitening, beauty-filter smoothing or body reshaping. Do not cover facial landmarks. Preserve declared optical or architectural illusion without distorting anatomy. Identity matching varies by image tool and is not guaranteed.
```

Separate fictional preview brief:

```text
Generate one finished original image for PicMagic. One fictional Indian woman, 22, deep-brown complexion, short dense curls, a softly rounded face and natural midsize build. Cobalt cropped work jacket, loose cream trousers and flat shoes. These are original fictional adult personas, not real people, celebrities or personalized customer results. Do not reuse a face from earlier images.

One person sits naturally on a broad concrete landing close to camera. Behind and beside them, a second flight of the same stairwell climbs horizontally across the wall before turning upward. Repeating terracotta rail posts and daylight make one impossible quarter-turn legible. The person remains upright with ordinary anatomy, not floating or twisted.

Photographic concrete, worn terracotta railings and soft side daylight. The near landing and person obey ordinary gravity; only the distant architecture makes one ninety-degree turn.

One 4:5 portrait image, target 1080 × 1350. Keep the person prominent at 375px mobile-feed width, with clear facial landmarks and no tiny protagonist.

Natural age cues, skin pores and ordinary proportions. No airbrushed skin, exaggerated muscles, stereotyped features, unwanted text, logos, watermark, extra people, fused limbs or distorted hands. Make the single visual mechanism readable at mobile-card size. Produce the image itself.
```

### GZ02 · The Listening Room Has Tides

A listener sits on a low normal chair in the near foreground, headphones on. Broad acoustic felt ribs rise from the floor along both sides and roll overhead in one asymmetrical frozen soundwave, like a room-sized physical sculpture. A small unbranded player rests on the seat beside them. Face and torso remain unobscured; no equalizer graphics, floating notes or album artwork.

Why AI / why try: Creates an otherwise complex or impossible production set: The music becomes a room you can sit inside.

Novelty: The set spatially embodies sound around a quiet listener rather than staging an actor returning a prop. Different material, action, silhouette and payoff.

Risks: Felt ribs may become random tubes; use only five broad continuous parallel ribs with visible felt edges.

Existing destinations: /collections/creative-transformations, /collections/studio. One proposed canonical: /ai-prompts/social-media/the-listening-room-has-tides.

User prompt:

```text
REFERENCE PRESENT: Treat the uploaded person reference as authoritative for recognizable facial identity, facial geometry, apparent age, ethnicity, natural complexion, hairline, distinguishing features and natural body proportions. The PicMagic preview is a styling example only; do not copy its model, youth, complexion or ethnicity. Preserve existing glasses, facial hair and meaningful personal features unless the user explicitly requests otherwise. Hair may be gently arranged for the concept without changing the hairline; wardrobe, pose, grooming and expression may adapt. Do not age an older reference down.

NO REFERENCE PRESENT: Create one clearly fictional Indian/South Asian adult with believable individual features and ordinary proportions. This is an invented example, not a personalized result.

CREATIVE DIRECTION: A listener sits on a low normal chair in the near foreground, headphones on. Broad acoustic felt ribs rise from the floor along both sides and roll overhead in one asymmetrical frozen soundwave, like a room-sized physical sculpture. A small unbranded player rests on the seat beside them. Face and torso remain unobscured; no equalizer graphics, floating notes or album artwork.

COMPOSITION: A single scene, one continuous body. The music becomes a room you can sit inside.

STYLE / MATERIAL / PHOTOGRAPHY: Tactile charcoal felt with dusty-rose edges, five broad continuous ribs, warm side-window light. Natural skin, matte surfaces, no luminous neon effects.

OUTPUT: One 4:5 portrait image, target 1080 × 1350. Keep the person prominent at 375px mobile-feed width, with clear facial landmarks and no tiny protagonist.

CONSTRAINTS: Do not add readable text, logos not supplied as product reference, watermarks, additional effects, extra limbs, merged faces or duplicated people. Keep actual age cues and skin texture; no whitening, beauty-filter smoothing or body reshaping. Do not cover facial landmarks. Preserve declared optical or architectural illusion without distorting anatomy. Identity matching varies by image tool and is not guaranteed.
```

Separate fictional preview brief:

```text
Generate one finished original image for PicMagic. One fictional Indian man, 24, warm medium-brown complexion, gently receding temples, loose medium-length waves, light moustache, ordinary slim build. Burgundy knit polo and worn charcoal trousers. These are original fictional adult personas, not real people, celebrities or personalized customer results. Do not reuse a face from earlier images.

A listener sits on a low normal chair in the near foreground, headphones on. Broad acoustic felt ribs rise from the floor along both sides and roll overhead in one asymmetrical frozen soundwave, like a room-sized physical sculpture. A small unbranded player rests on the seat beside them. Face and torso remain unobscured; no equalizer graphics, floating notes or album artwork.

Tactile charcoal felt with dusty-rose edges, five broad continuous ribs, warm side-window light. Natural skin, matte surfaces, no luminous neon effects.

One 4:5 portrait image, target 1080 × 1350. Keep the person prominent at 375px mobile-feed width, with clear facial landmarks and no tiny protagonist.

Natural age cues, skin pores and ordinary proportions. No airbrushed skin, exaggerated muscles, stereotyped features, unwanted text, logos, watermark, extra people, fused limbs or distorted hands. Make the single visual mechanism readable at mobile-card size. Produce the image itself.
```

### GZ03 · Chai Between the Floors

Exactly three friends sit shoulder-to-shoulder on one broad bench at a small chai counter supported between two opposing apartment balconies high above a quiet lane. A clearly built steel bridge supports the stall; a surreal gap below creates the impossible location. Camera is close at table height, faces dominate the upper half; a narrow lower gap shows small distant street lights. Everyday cups and a shared laugh provide warmth, no one balances on an edge.

Why AI / why try: Creates an otherwise complex or impossible production set: Your late-night friend stop has no street beneath it.

Novelty: Three distinct friends inhabit a suspended street-food bridge with a readable vertical drop; the impossible social set replaces the ordinary cafe two-shot.

Risks: Highest risk: extra people and inconsistent supports. Require exactly three clear faces, one bench, one counter and visible steel supports.

Existing destinations: /collections/creative-transformations, /collections/cinematic. One proposed canonical: /ai-prompts/social-media/chai-between-the-floors.

User prompt:

```text
REFERENCE PRESENT: Use the uploaded photographs of exactly THREE distinct friends as the identity authority. Preserve each recognizable face, facial geometry, apparent age, ethnicity, complexion, hairline, distinguishing features, glasses/facial hair and natural body proportions independently. Assign the three supplied identities left-to-right and keep that assignment. The preview only supplies the scene and styling. Do not copy its models or make older references younger. Adapt clothes, hair arrangement, pose and small expressions naturally without homogenizing the friends. If any friend lacks a usable reference, ask for it rather than inventing a replacement.

NO REFERENCE PRESENT: Create exactly three clearly fictional Indian/South Asian adults with distinct believable faces, complexions and ordinary builds. These are fictional examples, not the user’s friends.

CREATIVE DIRECTION: Exactly three friends sit shoulder-to-shoulder on one broad bench at a small chai counter supported between two opposing apartment balconies high above a quiet lane. A clearly built steel bridge supports the stall; a surreal gap below creates the impossible location. Camera is close at table height, faces dominate the upper half; a narrow lower gap shows small distant street lights. Everyday cups and a shared laugh provide warmth, no one balances on an edge.

COMPOSITION: A single shared scene; exactly three separate continuous bodies. Your late-night friend stop has no street beneath it.

STYLE / MATERIAL / PHOTOGRAPHY: Quiet blue-hour ambient light with one warm practical stall lamp. Natural skin, steel supports, worn painted balconies, realistic cups. This is a fictional impossible set, not evidence of a real visit or a safe real location.

OUTPUT: One 4:5 image, target 1080 × 1350. Keep all three complete heads clearly visible at mobile-feed size, no hidden third friend and no extra people in windows or photographs.

CONSTRAINTS: Do not add readable text, logos not supplied as product reference, watermarks, additional effects, extra limbs, merged faces or duplicated people. Keep actual age cues and skin texture; no whitening, beauty-filter smoothing or body reshaping. Do not cover facial landmarks. Preserve declared optical or architectural illusion without distorting anatomy. Identity matching varies by image tool and is not guaranteed.
```

Separate fictional preview brief:

```text
Generate one finished original image for PicMagic. Exactly three fictional Indian friends aged 21–25: a medium-brown woman with long braid and square glasses, a deep-brown man with short coils and a broad natural build, and a light-brown man with straight ear-length hair and light moustache. Distinct faces; casual teal overshirt, ochre tee and plum hoodie. These are original fictional adult personas, not real people, celebrities or personalized customer results. Do not reuse a face from earlier images.

Exactly three friends sit shoulder-to-shoulder on one broad bench at a small chai counter supported between two opposing apartment balconies high above a quiet lane. A clearly built steel bridge supports the stall; a surreal gap below creates the impossible location. Camera is close at table height, faces dominate the upper half; a narrow lower gap shows small distant street lights. Everyday cups and a shared laugh provide warmth, no one balances on an edge.

Quiet blue-hour ambient light with one warm practical stall lamp. Natural skin, steel supports, worn painted balconies, realistic cups. This is a fictional impossible set, not evidence of a real visit or a safe real location.

One 4:5 image, target 1080 × 1350. Keep all three complete heads clearly visible at mobile-feed size, no hidden third friend and no extra people in windows or photographs.

Natural age cues, skin pores and ordinary proportions. No airbrushed skin, exaggerated muscles, stereotyped features, unwanted text, logos, watermark, extra people, fused limbs or distorted hands. Make the single visual mechanism readable at mobile-card size. Produce the image itself.
```

### GZ04 · One Step Outside the Frame

A seated person appears inside a large upright photographic display panel leaning on a plain studio wall. Their upper body remains within the panel, while one naturally bent leg extends through the open lower edge into the physical studio foreground. The same shoe casts a real contact shadow on the floor outside the panel; the transition happens below the knee, not across the face. The panel is a window illusion, never a severed body or a second person.

Why AI / why try: Creates an otherwise complex or impossible production set: Your sneaker steps out of a flat portrait into the room.

Novelty: One continuous limb crosses a flat-image/real-room boundary; city motion and a normal walking step do not provide this illusion.

Risks: Knee duplication and oversized shoe distortion. Keep the complete leg traceable and shoe size naturally foreshortened; preserve supplied shoe design.

Existing destinations: /collections/creative-transformations. One proposed canonical: /ai-prompts/social-media/one-step-outside-the-frame.

User prompt:

```text
REFERENCE PRESENT: Treat the uploaded person reference as authoritative for recognizable facial identity, facial geometry, apparent age, ethnicity, natural complexion, hairline, distinguishing features and natural body proportions. The PicMagic preview is a styling example only; do not copy its model, youth, complexion or ethnicity. Preserve existing glasses, facial hair and meaningful personal features unless the user explicitly requests otherwise. Hair may be gently arranged for the concept without changing the hairline; wardrobe, pose, grooming and expression may adapt. Do not age an older reference down.

NO REFERENCE PRESENT: Create one clearly fictional Indian/South Asian adult with believable individual features and ordinary proportions. This is an invented example, not a personalized result.

CREATIVE DIRECTION: A seated person appears inside a large upright photographic display panel leaning on a plain studio wall. Their upper body remains within the panel, while one naturally bent leg extends through the open lower edge into the physical studio foreground. The same shoe casts a real contact shadow on the floor outside the panel; the transition happens below the knee, not across the face. The panel is a window illusion, never a severed body or a second person.

COMPOSITION: A single scene, one continuous body. Your sneaker steps out of a flat portrait into the room.

STYLE / MATERIAL / PHOTOGRAPHY: Neutral soft studio illumination, warm-white wall and pale floor; a crisp panel edge and coherent contact shadow make the frame crossing legible. If footwear is supplied, preserve its design, colour, visible branding, stitching and sole. Never invent unseen product construction.

OUTPUT: One 4:5 portrait image, target 1080 × 1350. Keep the person prominent at 375px mobile-feed width, with clear facial landmarks and no tiny protagonist.

CONSTRAINTS: Do not add readable text, logos not supplied as product reference, watermarks, additional effects, extra limbs, merged faces or duplicated people. Keep actual age cues and skin texture; no whitening, beauty-filter smoothing or body reshaping. Do not cover facial landmarks. Preserve declared optical or architectural illusion without distorting anatomy. Identity matching varies by image tool and is not guaranteed.
```

Separate fictional preview brief:

```text
Generate one finished original image for PicMagic. One fictional Indian woman, 25, light-brown complexion, shoulder-length straight hair with off-centre part, small round glasses and ordinary broad-hipped proportions. Sage overshirt, loose dark jeans, original unbranded cream canvas low-top sneakers with gum sole. These are original fictional adult personas, not real people, celebrities or personalized customer results. Do not reuse a face from earlier images.

A seated person appears inside a large upright photographic display panel leaning on a plain studio wall. Their upper body remains within the panel, while one naturally bent leg extends through the open lower edge into the physical studio foreground. The same shoe casts a real contact shadow on the floor outside the panel; the transition happens below the knee, not across the face. The panel is a window illusion, never a severed body or a second person.

Neutral soft studio illumination, warm-white wall and pale floor; a crisp panel edge and coherent contact shadow make the frame crossing legible. If footwear is supplied, preserve its design, colour, visible branding, stitching and sole. Never invent unseen product construction.

One 4:5 portrait image, target 1080 × 1350. Keep the person prominent at 375px mobile-feed width, with clear facial landmarks and no tiny protagonist.

Natural age cues, skin pores and ordinary proportions. No airbrushed skin, exaggerated muscles, stereotyped features, unwanted text, logos, watermark, extra people, fused limbs or distorted hands. Make the single visual mechanism readable at mobile-card size. Produce the image itself.
```

### GZ05 · A Face on the Scanner Glass

A close photographic face appears just above a clean glass plane viewed straight on, with no pressure deforming the skin. The deep black scanner-bed border stays outside the circular safe area. A single pale moving-scan streak runs across the lower shoulders only, with a restrained cyan edge echo at the outer clothing. Eyes, nose, mouth and hairline stay crisp, neutrally lit and unwarped. No hands or props cover the face.

Why AI / why try: Creates an otherwise complex or impossible production set: A tiny portrait that looks captured by a machine with personality.

Novelty: The capture device, glass depth and one mechanical scan streak replace illustrated brush arcs. No drawn graphics or folded frame.

Risks: If it reads merely as neon light, reject. The black glass-bed surround and below-face scan line must establish the capture process; face readability wins.

Existing destinations: /collections/instagram-profile-picture, /collections/creative-transformations. One proposed canonical: /ai-prompts/social-media/a-face-on-the-scanner-glass.

User prompt:

```text
REFERENCE PRESENT: Treat the uploaded person reference as authoritative for recognizable facial identity, facial geometry, apparent age, ethnicity, natural complexion, hairline, distinguishing features and natural body proportions. The PicMagic preview is a styling example only; do not copy its model, youth, complexion or ethnicity. Preserve existing glasses, facial hair and meaningful personal features unless the user explicitly requests otherwise. Hair may be gently arranged for the concept without changing the hairline; wardrobe, pose, grooming and expression may adapt. Do not age an older reference down.

NO REFERENCE PRESENT: Create one clearly fictional Indian/South Asian adult with believable individual features and ordinary proportions. This is an invented example, not a personalized result.

CREATIVE DIRECTION: A close photographic face appears just above a clean glass plane viewed straight on, with no pressure deforming the skin. The deep black scanner-bed border stays outside the circular safe area. A single pale moving-scan streak runs across the lower shoulders only, with a restrained cyan edge echo at the outer clothing. Eyes, nose, mouth and hairline stay crisp, neutrally lit and unwarped. No hands or props cover the face.

COMPOSITION: A single scene, one continuous body. A tiny portrait that looks captured by a machine with personality.

STYLE / MATERIAL / PHOTOGRAPHY: Photographic capture with black glass depth, neutral frontal face illumination and a faint cyan scan echo limited to outer clothing. This is an artistic scanner illusion, not a real scan or an instruction to press a face against equipment.

OUTPUT: One 1:1 square master, target 1024 × 1024. Centre the entire head and chin within a circular safe area with breathing room; head height around 60% of canvas. Keep both eyes, nose and mouth clear in square and circular crops at 40, 64 and 128 pixels. Put the capture effect below the face, not across the eyes.

CONSTRAINTS: Do not add readable text, logos not supplied as product reference, watermarks, additional effects, extra limbs, merged faces or duplicated people. Keep actual age cues and skin texture; no whitening, beauty-filter smoothing or body reshaping. Do not cover facial landmarks. Preserve declared optical or architectural illusion without distorting anatomy. Identity matching varies by image tool and is not guaranteed.
```

Separate fictional preview brief:

```text
Generate one finished original image for PicMagic. One fictional Indian man, 20, medium-deep complexion, oval face, short uneven fringe, faint acne texture, slim natural shoulders and thin metal glasses. Simple off-white tee. These are original fictional adult personas, not real people, celebrities or personalized customer results. Do not reuse a face from earlier images.

A close photographic face appears just above a clean glass plane viewed straight on, with no pressure deforming the skin. The deep black scanner-bed border stays outside the circular safe area. A single pale moving-scan streak runs across the lower shoulders only, with a restrained cyan edge echo at the outer clothing. Eyes, nose, mouth and hairline stay crisp, neutrally lit and unwarped. No hands or props cover the face.

Photographic capture with black glass depth, neutral frontal face illumination and a faint cyan scan echo limited to outer clothing. This is an artistic scanner illusion, not a real scan or an instruction to press a face against equipment.

One 1:1 square master, target 1024 × 1024. Centre the entire head and chin within a circular safe area with breathing room; head height around 60% of canvas. Keep both eyes, nose and mouth clear in square and circular crops at 40, 64 and 128 pixels. Put the capture effect below the face, not across the eyes.

Natural age cues, skin pores and ordinary proportions. No airbrushed skin, exaggerated muscles, stereotyped features, unwanted text, logos, watermark, extra people, fused limbs or distorted hands. Make the single visual mechanism readable at mobile-card size. Produce the image itself.
```

## Release and media hold

Feature branch: content/identity-and-collection-audit. No main commits, pushes, merges, PRs, build hooks, production writes or deployments. No reset date is treated as permission. This round uses ChatGPT only; the previous Codex-only permission belonged to the previous three-asset batch.

No homepage edit is proposed automatically. If QA confirms them, GZ01 and GZ03 are potential creative-discovery replacements for ordinary urban portraits; recommend only after side-by-side review.

Generation queue contains only five shortlisted concepts. No source assets or personal photographs will be uploaded. No purchase, video generation, or API setup is needed.
