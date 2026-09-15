# Requested preview batch — 15 September 2026

The owner explicitly authorized Codex-only preview generation for the four newly added prompts. Four built-in image_gen calls produced four fictional-person assets, with one attempt each and no supplied personal/reference photographs. No paid API or browser generation workflow was used.

All four passed visual review for composition, subject count, anatomy, wardrobe, framing and prompt alignment. The male/female double-exposure designs intentionally depict one identity twice. The katana remains a single coherent downward-held prop. The giant phone uses fictional playlist labels and original generated cover tiles; it is an AI illustration of the requested styling, not an actual listening-history screenshot or product-authenticity claim.

## Assets and exact prompts

`generation-manifest.json` records exact submitted preview prompts, source paths, provenance, QA notes, optimized dimensions, hashes and sizes. Source PNGs are preserved in `sources/`; `contact-sheet.jpg` compares the four finished assets. The user-copy prompts remain separate in the three addition JSON files. No user prompt was changed during preview generation.

| Concept | Local route | Preview bytes | Thumbnail bytes |
|---|---|---:|---:|
| double-exposure-fashion-men | `/ai-prompts/men/double-exposure-fashion-men` | 111218 | 21542 |
| double-exposure-fashion-women | `/ai-prompts/women/double-exposure-fashion-women` | 114956 | 20588 |
| katana-in-the-square-of-light | `/ai-prompts/men/katana-in-the-square-of-light` | 113774 | 24754 |
| standing-on-my-playlist | `/ai-prompts/social-media/standing-on-my-playlist` | 80368 | 19268 |

Master web assets are 1080 × 1350 WebP (quality 86); thumbnails are 480 × 600 WebP (quality 80). Existing responsive image components reserve dimensions. No new image component, eager batch loading or homepage feature was introduced.

## Local integration and release hold

The four records are explicitly allowlisted for existing seed-only local review. Their preview status is approved, but publication/indexing/featured flags remain false. Local review requires `CONTENT_SOURCE=seed`, `PICMAGIC_SOCIAL_PREVIEW=true`, `NEXT_PUBLIC_INDEXING_ENABLED=false`, and no hosted `NETLIFY`, `CONTEXT` or `CI` flags. Existing categories and collection memberships are preserved.

Branch: `content/identity-and-collection-audit`. The original verification below was performed before committing. The owner subsequently requested a commit and feature-branch push. See `push-safety.md` for the checked remote safeguards. Main, production content/Storage and deployment remain under the release hold. Previously added prompt files, catalogue registration and collection memberships are related work and were preserved. The generated `next-env.d.ts` build-directory change was restored; no unrelated work was reverted.

See `verification.json` for the pre-commit validation snapshot. Screenshots from the production-mode local app are in `media/qa/`. Server for review: http://localhost:3005 .
