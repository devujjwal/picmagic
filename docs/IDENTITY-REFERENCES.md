# Project identity references

Owner instruction received 5 October 2026: retain the three supplied photographs
locally for future prompt-based generation and use them as standing identity
references. This applies to project/editorial generation, not public visitors'
personalized prompts. A visitor's own authorized reference remains authoritative.

## Current reference pools — 10 October 2026

The owner added photographs and requested random selection within the matching
men, women or couple group. This supersedes the single-default selection rule
from 5 October. Group assignments follow the owner's filenames and confirmed
mapping, not an inference about a person's gender from appearance.

All paths below are relative to `.release-private/identity-references/`.

| Pool | Files | Count |
| --- | --- | --- |
| Men | `reference-01.png`, `men-1.jpg`, `men-2.jpg` | 3 |
| Women | `reference-02.jpg`, `women-1.jpg` | 2 |
| Couple | `reference-03-couple.jpg`, `couple-1.jpg`, `couple-3.jpg` | 3 |

The private manifest records stable IDs, current SHA-256 hashes and byte sizes.
Existing filenames are retained to avoid breaking historical evidence links.
No image bytes were changed by this plan update.

### Random selection procedure

1. Use an explicit owner-selected photo when supplied; a visitor's own reference
   always overrides these editorial pools. Otherwise match the prompt's intended
   use to exactly one pool. Ask when the intended group is ambiguous.
2. Read the private manifest and verify candidate files against their recorded
   hashes. Do not silently accept replacements or newly added, unregistered files.
   Confirm their group and register their current version first.
3. Shuffle the eligible IDs in that pool and select without replacement. Maintain
   independent cycles per pool. Once a cycle is exhausted, reshuffle; avoid the
   immediately previous photo at the cycle boundary when more than one is eligible.
4. At generation time, persist the remaining pool order, last selected ID and
   selection events in gitignored `selection-state.json` beside the manifest.
   Record reference ID/hash, prompt or run ID and selection time before upload so
   a resumed run reuses the same choice. Serialize updates to avoid concurrent
   runs selecting the same cycle entry. No generation or selection event has been
   performed merely by updating this plan.
5. Keep the selected photo fixed for retries, revisions and variations of the
   same concept. Choose again only for a new independent concept. Log explicit
   overrides separately; they do not advance the random cycle.
6. Check that the selected photo supports the requested composition and identity
   fidelity. Record exclusions or limitations (for example, obscured eyes), rather
   than silently substituting another pool or claiming invisible details match.
   If none is suitable, ask for a suitable reference. Never mix pools to compensate.

This is a generation workflow instruction, not a newly enabled background job or
website feature. Future generators must read this plan and its private state.

### File-version history

On 10 October, `reference-02.jpg` and `reference-03-couple.jpg` differed from their
5 October recorded hashes and sizes. Their current versions have new manifest
IDs; the former records are retained as historical provenance, not current files.
The old bytes have not been restored or verified at another location. In
particular, the current couple photo is a foreground pair in snow, not the old
seated pair. Historical test evidence must continue to reference its original
hashes and must not be relabeled as a test of these replacements.

## Generation rules

- Attach exactly the selected reference from the matching pool. Do not substitute
  a fictional face because the reference is inconvenient or unavailable.
- For couple prompts, use both intended foreground subjects from one couple
  photo, keeping their identities distinct. Never construct the couple by
  combining solo references or replace either person with a solo identity.
- Exclude background bystanders. In `couple-3.jpg`, exclude the person between
  the two prominent foreground subjects. `couple-1.jpg` includes sunglasses;
  record the resulting eye-detail limitation. Follow each manifest subject note.
- Preserve recognizable facial geometry, natural complexion, distinguishing
  features, hairline, actual age and body proportions. The scene prompt controls
  styling and composition, never substitution of the preview model's identity.
- Explicit owner direction for a specific generation overrides this default.
  Respect existing provider, budget and release restrictions. This instruction
  does not authorize purchases, public uploads, production activation or release.
- Before transferring a personal reference to an external generator, establish
  permission for that specific provider and purpose. The files are authorized
  local references; this storage update itself performs no external upload.
- New outputs must be compared with the supplied reference before making a
  likeness claim. Record the exact input, reference ID/hash, tool, date, attempts
  and observed limitations. These files alone are not completed test evidence.

## Private storage

The originals live inside the repository checkout but are **gitignored**, not
committed or pushed. They are not in `public/`, seed content, application imports,
Supabase Storage, browser-accessible routes or deployment assets. Do not force-add
them, embed them in tracked Markdown, or publish their metadata. Keep the private
directory owner-only and the files readable/writable only by the owner.

Git cloning does not restore these originals. On another checkout, ask the owner
to supply them privately; never fall back to unrelated or fictional identities.
Publishing reference photographs or recognizable generated results needs separate
explicit approval. Keep unpublished outputs private until reviewed.

## October test authorization

On 5 October 2026 the owner explicitly approved men/women reference uploads to
ChatGPT web and local recognizable-output review, then directed use of signed-in
Chrome. Both then-current solo references were uploaded for the eight-prompt trial.
The couple original was not uploaded. Eighteen generated results, exact inputs,
original hashes and qualitative limitations are retained under gitignored
`.release-private/adsense-evidence-2026-10-05/`; `review.html` is the private
comparison sheet. Public identifiable-output publication and production release
remain separate approvals. See the audit `REAL-TEST-REVIEW.md` for findings.

That historical authorization does not automatically authorize uploads of newly
added photographs or replacement versions. Confirm provider and purpose before
their first external transfer; no new upload was performed on 10 October.
