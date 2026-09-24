# Identity, age and expression policy — review gate

This branch implements the shared generation-policy correction and stops after five review samples. It does not change current preview mappings, replace any file under `public/previews`, modify production data, deploy, or copy either private identity photograph into the repository.

## Policy correction

- Identity reference photographs control identity only.
- Scene-specific prompt meaning controls expression, gaze, pose, wardrobe, styling, environment, lighting and composition.
- An explicit adult age wins. An unspecified adult defaults to approximately 22–30 regardless of formal clothing, authority, family context, traditional styling or the reference subject's apparent age.
- Adult identity references are never applied to children or teenagers.
- A smile is valid only when the scene supports it. Strong expression must be restrained and retried if it causes identity drift.
- Existing v1 prompt records remain valid; new/future generation uses `identity-expression-age-v2` and the reusable house-preview policy in `lib/prompts/preview-generation-policy.ts`.

## Expression-diversity baseline

The reproducible audit covers 76 unique published human-preview assets. Thirty-nine (51.3%) have prompt text or image briefs that explicitly call for a smile or laugh. Four have no explicit expression signal and require interpretation before regeneration. Repetition is not treated as a defect when several concepts genuinely call for happiness; the acceptance failure is a copied reference smile, a scene-inappropriate expression, or distinct concepts collapsing into the same camera-facing portrait.

See `expression-audit.json` for every record and the classification method.

## Five-sample review set

| Test                               | Existing PicMagic prompt        | Age rule         | Required expression            | Review asset                                                |
| ---------------------------------- | ------------------------------- | ---------------- | ------------------------------ | ----------------------------------------------------------- |
| Young male, serious/confident      | `katana-in-the-square-of-light` | Explicit ~25     | Serious, composed, no smile    | `samples/katana-in-the-square-of-light-serious-sample.webp` |
| Young male, happy/amused           | `coffee-and-a-real-smile`       | Default 22–30    | Natural social amusement       | `samples/coffee-and-a-real-smile-amused-sample.webp`        |
| Young female, neutral/editorial    | `the-art-of-standing-still`     | Default 22–30    | Neutral, composed, no smile    | `samples/the-art-of-standing-still-neutral-sample.webp`     |
| Young female, expressive/surprised | `the-lift-stops-at-the-ocean`   | Explicit 24      | Restrained believable surprise | `samples/the-lift-stops-at-the-ocean-surprised-sample.webp` |
| Explicitly older identity          | `a-night-at-the-cinema`         | Explicit sixties | Serious, reflective, no smile  | `samples/a-night-at-the-cinema-older-sample.webp`           |

The older sample required two correction retries because the initial attempts remained too middle-aged. Only the final clearly older result is retained in this review set. `sample-prompts.json` records each prompt overlay; `sample-validation.json` records preliminary QA and the approval state.

## Safe reference integration

`reference-manifest.json` contains logical IDs, hashes and dimensions only. A future private generation runner should resolve those logical IDs from a non-public secret/private asset registry at runtime. Local attachment paths must never appear in content JSON, database prompt fields, generated public metadata or client bundles.

## Approval gate

No bulk regeneration is authorized. Owner review is required for identity likeness, age progression and expression quality before any additional images are generated or any published mapping is changed.
