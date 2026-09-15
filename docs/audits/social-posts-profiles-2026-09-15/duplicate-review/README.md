> Media generation and local draft integration are now documented in [../media/README.md](../media/README.md). The owner subsequently authorized Codex-only generation; the provider requirement below is historical.

# Duplicate and overlap review

This review supersedes the original ten-item development/generation scope. The owner approved that shortlist, then asked to skip existing prompts and reanalyse. Three unchanged, already-approved concepts remain; no replacement concepts are silently added.

**Result: 4 existing concepts skipped, 3 overlapping proposals deferred, 3 distinct concepts retained. New preview workload: 7 → 3.**

| ID | Concept | Decision | Reason |
|---|---|---|---|
| POST-01 | The River Remembers | skip-existing | Exact existing record and approved asset. Already described as reuse in the first shortlist; exclude from new development/generation. |
| POST-02 | Portrait Cut from Monsoon Paper | skip-existing | Exact existing record and approved asset. Preserve its content and canonical URL; do not regenerate. |
| POST-03 | The Last Train, Printed in Two Inks | skip-existing | Exact existing record and approved asset. Preserve it; do not count it as a new prompt. |
| POST-04 | Borrowed Moon, Closing Time | keep-approved-new | The old cinema prompt is a static exterior portrait; the new concept has a backstage prop-returning action and a personal story. A child astronaut shares a moon prop but not this use, action or composition. No matching backstage concept found. |
| POST-05 | One Ribbon, a Whole Room | defer-overlap | Not an exact duplicate. Supported cloth curved around a person and sculptural fashion settings already exist. A waist-up fashion-specific version is possible, but the marginal benefit is too small for this focused batch. Exclude rather than generate a colour/set variant. |
| DP-01 | A Fold Around You | keep-approved-new | The face stays photographic and the physical paper only frames it. Existing relief transforms the face into paper; petals create a maternity installation. The square avatar has different preservation and composition rules. |
| DP-02 | A Small Burst of Motion | keep-approved-new | Two broad illustrated shoulder arcs are distinct from a landscape inside a jacket, photographic commuter blur or natural foliage shadows. Keep one large photographic face and no repeated identities. |
| DP-03 | Monochrome Rain, Face in Focus | skip-existing | Same canonical owner and core clear-face monochrome/rain profile use already exist as a draft. Changing doorway rain to a glass pane and making a square master does not justify a new concept here. Cancel the proposed rework for this batch; leave the original draft unchanged. |
| DP-04 | Your Features, Two Bold Inks | defer-overlap | Not an exact duplicate: square linocut would differ from railway halftone. But the two-ink identity portrait is already covered. Defer the new variant and media; do not assume the current rectangular image passes circular QA. |
| DP-05 | A Cameo Made of Clay | defer-overlap | Not an exact duplicate: clay has continuous modelling rather than paper planes. Both offer a tactile shallow-relief likeness, however, and clay adds high identity risk. Material substitution alone is not enough incremental value for this batch. |

## Evidence and limits

Screened 170 local record titles/descriptions, compared closest full prompts, and checked historical planning/queue slug collisions. Not a new complete library quality audit and not a live database read.

Existing flags refer to local fixtures, not freshly verified production publication. The three original post reuses were already identified in the first shortlist; they are now excluded from new work rather than reclassified as new discoveries. Historical proposal and media queues were checked separately from application records; an old planning entry is not a published prompt. Asset existence does not prove crop suitability. No new media QA or generation occurred.

Detailed source paths, canonical owners, full-prompt hashes, preview paths and file availability are in `review.json`. New proposed slugs were also absent from historical JSON outside this batch. Preserve all existing records; defer means removing a proposal from the active queue, not deleting existing content.

The rain draft still has a paper/ink preservation phrase alongside a photographic direction; record this as a pre-existing editorial issue, not a reason to create another rain record. Its correction is outside the reduced new-concept batch.

No new ten-item target is imposed. Do not fill the vacated slots with generic concepts or variants merely to recover the count.

## Effective approved work

- POST-04: Borrowed Moon, Closing Time — one 4:5 post.
- DP-01: A Fold Around You — one square profile image.
- DP-02: A Small Burst of Motion — one square profile image.

`retained-proposals.json` preserves the three approved complete prompts and separate briefs unchanged. `generation-manifest.json` is now the only active media queue for this batch. Use ChatGPT only, then local QA/integration; release hold still applies. Do not run the historical proposal-generation script as an active work queue.

Collection treatment must now be reconsidered during local integration: reuse the existing profile collection and avoid activating a thin new post collection around a single new record. Existing posts may be linked by their canonical IDs later without duplication, regeneration or counting them as new work. No production activation is authorized.

## Validation and state

10/10 decisions reconcile; 3 retained IDs/slugs are unique and absent from the 170-record library; approved retained prompt text is unchanged; no retained preview file already exists. No application code/content, database or public assets changed. Existing `next-env.d.ts` and release-report work are unrelated and preserved. No push/build/deployment.
