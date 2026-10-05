# Real portrait tests - 5 October 2026

## Scope and evidence

Executed through the owner-approved signed-in ChatGPT Chrome workflow: eight
original-reference baselines, eight same-chat variations and two focused repairs.
Visible mode: Instant. Image model/backend version: undisclosed. No paid API,
upgrade, fallback generator, video work or production changes were used.

The men reference was used for Fold, Moon, Small Burst, Gravities, City Lights and
Next Chapter; the women reference for Monsoon Paper and Headshot. The couple
reference was not uploaded. This small, selected trial is not a success-rate
measurement or evidence of compatibility across tools or identities.

All 18 original PNGs, SHA-256 hashes, dimensions, exact inputs and conversation
references are in the private `executed-runs.json`. Archival files remain
unchanged. Resized WebP copies are display exports, not additional generations.
`review.html` is an owner-only local comparison sheet, including the unsuccessful
attempts. The original portraits are not embedded in that sheet.

## Findings

| Prompt | Baseline and variation | Limitation / editorial decision |
| --- | --- | --- |
| A Fold Around You | Cream paper folds and photographic subject; green backing variation visually close. | Facial light remains warm. Full head remains legible in inspected 40/64/128px circular crops; owner likeness review required. |
| Borrowed Moon | Physical prop and recognizable subject. Wider variation includes crescent and cart. | Baseline crops support; wider result makes the face smaller and extends below waist. Show the framing tradeoff rather than declaring an unconditional fix. |
| Monsoon Paper | Visible layered edges, paper hair and recognizable features; simpler cloud forms reduce clutter. | Some facial planes still resemble a texture treatment. Artistic pigment changes perceived complexion; not photographic skin-colour fidelity. |
| Small Burst | Two pigment arcs remain clear of facial landmarks; mustard variation retains teal. | Square/circle avatars are inspectable at three sizes. Single-change edits may regenerate brush edges or face detail. |
| Between Two Gravities | Three attempts retain an upright recognizable person. | Baseline, focused repair and texture variation fail to clearly establish the required coherent 90-degree staircase turn. Do not label these successful executions. |
| City Lights | Face readable amid a wet street scene; neutral-fill variation reduces coloured face light. | Background people and lights change too; sign lettering violates the no-unwanted-text instruction. Not a perfectly isolated edit. |
| Next Chapter | Coherent studio portrait and jacket; charcoal variation follows colour request. | Facial/fabric texture is regenerated; professional styling is not proof of exact source preservation. |
| Headshot | Light-grey and off-white backgrounds achieved; source features remain recognizable. | Facial/hair rendering and texture change beyond background/exposure. Focused repair does not establish exact original-pixel preservation. Retain conservative-edit warning. |

Actual output sizes differ from requested targets: square outputs are
1254 x 1254; most portraits are 1122 x 1402; Gravities outputs are 1092 x 1440.
Do not report requested dimensions as native delivered dimensions.

## Publication gates

The new recognizable outputs are not in public assets, seed records, production
Supabase or the existing two-example published trial. Historical fictional tests
remain correctly labelled. Public output consent and owner likeness acceptance
are pending. Production release approval is also separate; no deploy or AdSense
review request was made.

The 43 newly guided pages and six FAQ replacements remain locally validated.
The 42 lexical/shared-preview notices are not declared fixed by this trial.
Failed spatial execution and conservative-edit drift should become explicit
limitations in any selected published comparisons, not hidden rejected attempts.

## Local verification

`prepare-test-review.ts` verifies original hashes before export and requires all
eight baseline/variation pairs. The comparison sheet contains 18 figures, no
broken images, and no horizontal overflow at 320px and 1440px. Both screenshots
were visually inspected. Inputs and originals are retained privately, with no
reference photos or identifiable outputs added to tracked documentation.
