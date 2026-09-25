# Combined discovery and AdSense release preflight

## Owner decisions

On 25 September the owner requested review and production release, explicitly
included the pending AdSense batch, and separately approved default-on visit
memory. These approvals supersede the earlier local-only scope for those batches;
they do not authorize an AdSense review submission, paid upgrades or publication
of unfinished drafts. No deployment has occurred during this preflight.

Discovery implementation was locally committed as `a010dd3` on
`codex/discovery-rotation`. The combined branch includes `6b89063` (AdSense
remediation) and `853559a` (audit evidence). Production Git and Netlify both remain
at `5ab912a`. No force push, feature-branch push or pull request was performed.

## Verified release inputs

- Netlify Personal allowance: 940 plan credits plus 3.4 operational credits.
  Auto recharge disabled. A single production release fits the included allowance.
- Netlify production branch is `main`, auto publishing is on, branch deploys and
  Deploy Previews are off. Build command is `pnpm build:deploy`.
- Production `NEXT_PUBLIC_ADS_ENABLED` is currently `true`; it has not been changed.
- Git fetch succeeded. The separately configured GitHub CLI could not resolve the
  private repository, so its PR/workflow inspection is unavailable. No feature
  branch or PR will be pushed as a workaround.
- Read-only Supabase verification: 91 published prompts and 95 drafts. Both
  collection descriptions exactly match the expected old values in
  `docs/audits/adsense-readiness-2026-09-25/collection-copy-release.json`.
  No database write was made. Only those two descriptions need guarded content
  synchronization; no schema migration is required.

## Local review

No new code-blocking defect found in the discovery diff. Lint, 195 unit tests,
content validation and release validation passed. SEO validation reported zero
errors and 42 existing editorial review notices. The combined seed-content
Webpack production build and TypeScript validation passed.

The first combined browser run used an incorrect dummy detail-ad slot name and
failed two placement assertions. The test build configuration was corrected to
`prompt-detail-inline`; no production code or test assertions were weakened.
The corrected combined run passed 56 desktop/mobile browser tests, with two
disabled-rollout cases intentionally skipped on the enabled runtime. Google
services are stubbed in these tests. Earlier discovery performance and
visual evidence, including slower hero variants, is retained in
`docs/qa/discovery-rotation-2026-09-25.md`.

## Advertising gate and subsequent owner decision

The live AdSense account still shows low-value-content rejection and an account
activation/payment-information warning. Privacy & Messaging shows one active
European message and one active US message. This is configuration evidence only,
not proof of real regional consent behaviour. Effective Auto ads exclusions were
not established from the site list. No AdSense setting or review request changed.

The owner has been asked whether to release all reviewed code/content and enabled
discovery with **ad loading temporarily disabled**, or hold until regional CMP and
Auto ads verification can be completed. This choice remains a gate: do not treat
the default selected answer in an unanswered UI question as approval. Publishing
the code does not certify AdSense readiness or legal compliance.

Once resolved, prepare one final release commit, push to `main` once without force,
perform the guarded two-description sync, verify Netlify published that exact
commit and make only minimal live smoke requests. Preserve the unrelated untracked
draft-publication audit directory and all 95 drafts.

The owner subsequently answered yes to the proposed release with ad loading
temporarily disabled and requested live verification before a future AdSense
review. The authorized runtime flags are discovery rotation `true` and advertising
`false`, production context only. This permits the code/content release, not a
claim of regional consent verification or AdSense acceptance. The historical
preflight observations above are retained; post-release evidence is recorded
separately.
