> **Superseded scope:** See [duplicate-review/README.md](duplicate-review/README.md). Following approval and the owner’s duplicate-check instruction, only POST-04, DP-01 and DP-02 remain in the active new-work queue. This original shortlist is preserved as history.

# Instagram posts and profile pictures — approval checkpoint

Prepared 15 September 2026. This is a focused proposal, **not an integrated or release-ready collection**.

Read [SHORTLIST.md](SHORTLIST.md) for the ten concepts, full user prompts and separate fictional preview briefs. [RESEARCH.md](RESEARCH.md) records source evidence and limitations. [BRANCH-SAFETY.md](BRANCH-SAFETY.md) records fresh remote checks and the local-only decision.

## Scope and selection

- Five Instagram posts: three existing approved 4:5 assets plus two original story/fashion proposals.
- Five purpose-composed square profile pictures: physical paper frame, illustrated shoulder motion, clear-centre rain glass, two-ink portrait and clay relief.
- Six proposed new records, one existing draft rework and three existing record reuses. No records inserted or activated.
- Seven previews would need generation after concept approval; three existing images should be retained. Profile treatments score 4 provisionally, not 5 by default. Clay and linocut have the greatest identity risk and must be dropped if they fail small-size recognition.
- Reuse `instagram-profile-picture` without a canonical rename; propose `instagram-post-ideas` as the only new collection. No per-app duplicate collections. No homepage redesign or video work.

The existing three post images were visually reinspected full-size for this use. Their fictional Indian personas are supported by existing generation provenance, not inferred ethnicity. Approved fictional portrait fixtures are proposed for the print/clay tests. No personal user photographs or competitor assets are reused.

[proposals.json](proposals.json) is a planning fixture outside application content. [generation-manifest.json](generation-manifest.json) contains exact future briefs, dimensions, assets, filenames, provisional alt text and QA/provenance fields. Every entry has generation authorization false. Reuse entries retain historical prompts/dimensions; they are not regeneration orders. Null generation dates/URLs for future media must be filled from actual output, not fabricated.

## Approval requested

Approve, omit or replace concepts by `POST-01`–`POST-05` and `DP-01`–`DP-05`. Approval concerns collection membership for the three reused posts and generation/integration for the seven new previews. It does **not** authorize production deployment.

## After approval, locally

1. Use accessible ChatGPT only. If unavailable, keep the exact manifest queued; no Codex/Astra or paid API fallback.
2. Generate seven approved previews, retaining existing approved assets. Review actual output and record provenance, dimensions, alt text and rejection/retry decisions.
3. Produce a contact sheet and real 40/64/128px square/circular crops. Compare print/clay against the approved fictional references. Review full post images in 375px/430px feeds and desktop.
4. Integrate into local fixtures or an isolated test database; preserve canonical owners, keep production untouched. Use existing model fields/components.
5. Run lint, typecheck, content/schema validation, unit/component tests, relevant E2E and a local production build. Verify full Copy Prompt, saves/sharing, collections, responsive images/layout, canonical/sitemap and unchanged existing functionality.
6. Hand off exact feature commit IDs, screenshots, media QA and measured test results. Recheck deployment prevention before considering any feature push. Do not create a PR automatically.

## Outstanding / not claimed complete

Concept approval, seven new assets, new contact sheet/circular crops, application integration, new-batch browser/responsive QA and application tests/build remain pending. Existing release tests are historical. The 98 proposal-integrity assertions passed, and `git diff --check` passed. Current checks cover proposal integrity only; they cannot establish actual facial fidelity or avatar quality.

## Later release checklist

- Obtain explicit owner release approval; a billing reset alone is insufficient.
- Verify actual current allowance/reset and preserve Free/no top-ups/no purchases.
- Reconcile branch changes, production content and latest main; review migrations/content diff and rollback point.
- Complete local checks and media acceptance before one authorized release.
- Only with approval, perform the controlled main merge/content activation/deployment and minimal live verification. No scheduled automatic release.
