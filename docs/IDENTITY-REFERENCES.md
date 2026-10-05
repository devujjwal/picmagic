# Project identity references

Owner instruction received 5 October 2026: retain the three supplied photographs
locally for future prompt-based generation and use them as standing identity
references. This applies to project/editorial generation, not public visitors'
personalized prompts. A visitor's own authorized reference remains authoritative.

## Reference mapping

| Attachment | Local original | Intended use |
| --- | --- | --- |
| First | `.release-private/identity-references/reference-01.png` | Default identity reference for men's photo prompts. |
| Second | `.release-private/identity-references/reference-02.jpg` | Default identity reference for women's photo prompts, explicitly confirmed by the owner on 5 October 2026. |
| Third | `.release-private/identity-references/reference-03-couple.jpg` | Default reference for couple photo prompts. Use exactly the two seated foreground subjects, not the background bystander. |

Original names and SHA-256 hashes are retained in the private manifest beside the
files. Copies preserve the original bytes; no crop, retouch or metadata removal
has been applied to these archival originals.

## Generation rules

- For a project men's generation, attach reference 01 unless the owner explicitly
  chooses another reference. Do not substitute a fictional face because the
  reference is inconvenient or unavailable.
- For a project couple generation, attach reference 03 and keep both foreground
  identities distinct. Do not borrow the solo portrait's face to replace either
  person in the couple photograph.
- For a project women's generation, attach reference 02 unless the owner
  explicitly chooses another reference. Keep its identity separate from the
  men's and couple references; do not combine solo portraits automatically.
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
Chrome. Both solo references were uploaded for the eight-prompt editorial trial.
The couple original was not uploaded. Eighteen generated results, exact inputs,
original hashes and qualitative limitations are retained under gitignored
`.release-private/adsense-evidence-2026-10-05/`; `review.html` is the private
comparison sheet. Public identifiable-output publication and production release
remain separate approvals. See the audit `REAL-TEST-REVIEW.md` for findings.
