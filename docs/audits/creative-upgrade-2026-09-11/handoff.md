# Dependency register and resumable handoff

Status: **Phase A review delivered; awaiting concept approval.** This plan's approval does not authorize the shortlisted concepts, media production or release automatically.

## Freeze ledger

All earlier image/video queues are operationally frozen for future execution by this review, without altering historical files or erasing their old approvals. This overrides `approved`/`approved-awaiting-generation` strings in:

- `docs/audits/library-2026-09/generation-queue.json` and `approved-image-manifest.json` (70 historical image entries, not 140 separate jobs).
- `pre-editorial-generation-queue.json`, `existing-asset-queue.json`, and earlier image-review/keep decisions.
- `approved-video-manifest.json` (8 old selected concepts), `reel-preview-manifest.json` and its pre-editorial version.
- `docs/audits/friends-trip-2026-09/image-manifest.json` and `video-manifest.json`.

The new first batch recommends 12 discovery previews: 10 new outputs and 2 retained assets. It is not a claim that all 69 missing local preview paths or every prior replacement is resolved. Those remain future backlog decisions, not silently abandoned deliverables and not permission to generate them. A safe later release must keep any remaining incomplete content draft or obtain an explicit approved reduction of release scope.

## Dependencies

| Dependency | State and next action |
|---|---|
| Concept approval | Required next checkpoint: approve/revise the ranked 12-preview batch and proposed consolidation direction. No production generation now. |
| ChatGPT image workflow | Previously accessible through the user's browser, but availability/limit is not checked by a generation submission during Phase A. Confirm access when the batch is approved. Use ChatGPT only; no automatic Codex/Astra/API fallback. If unavailable, deliver exact ready-to-paste briefs and stop media execution. |
| Identity/product fixtures | Complex multi-panel, family, material and garment work needs approved fictional fixtures or references authorized for the specific use. The user's four-friends photo is not a general-purpose public asset for other concepts. |
| Video | Deferred by latest owner instruction. No Kling, Runway or other submissions. Existing source poster and exact Ladakh brief remain queued; no claimed completed Ladakh film. The image-generation tool does not supply a verified video workflow here. |
| Existing clips | Two local MP4 files are historical outputs; fragrance is still attached as utility, anniversary was detached after concept changes. Their prior playback QA is historical. Neither is a new Phase A approved reel. Provider watermarks must not be misrepresented or silently removed. |
| Source limitations | YouMind YM01 lacks an actual output demonstration and YM04 lacks a full prompt. Documented; enough other complete pairs were inspected. |
| Production status | Read-only public Supabase snapshot obtained. Local publish flags are not production. Re-read records and redirect history before an eventual activation. No service-role credential needed for this audit. |
| Hosting | Zero spend, Netlify Free and no top-ups. Prior allowance figures are stale; inspect current remaining allowance before the later release. Phase A triggers no deployment. |
| Release | All approved code/content/media must pass local checks, manual review and a coordinated activation plan before one production deployment. Main is automatically deployed, so do not push unfinished work there. |

## Resume without repeating the audit

1. Read [README](README.md), [shortlist](shortlist.md), [proposals](proposals.json), [record audit](prompt-audit.json), [generator review](generator-review.md), and this freeze ledger.
2. Compare source hashes in `inventory.json` against current files. If changed, audit the delta rather than reuse stale counts.
3. Record the user's exact approved concept IDs, retained asset decisions and any exclusions. Do not infer approval of all 20 proposals from approval of the plan or one example.
4. Only then prepare final user prompts and separate production image briefs. Resolve listed contradictions and establish references before using limited image capacity.
5. Conduct one reference-conditioned feasibility trial for high-risk multi-panel/material/product work; stop and review if fidelity fails. The ten-output batch is a recommendation, not an unlimited retry budget.
6. After approved media exists, integrate only that approved scope and run current local lint/type/unit/integration/E2E/build/accessibility/performance checks. Preserve unrelated existing changes.
7. Report unresolved backlog and release scope explicitly, back up affected records, verify allowance, then coordinate one release and live smoke checks. No release is authorized by this Phase A report alone.

## Measurement boundaries

This review completed research, record-level editorial analysis, local asset contact-sheet inspection and planning validation. It did not run fresh application tests, Lighthouse, field Core Web Vitals, video playback QA or a production deployment. Prior reports with successful builds, 117 unit tests and browser journeys remain historical and are not counted as new validation.
