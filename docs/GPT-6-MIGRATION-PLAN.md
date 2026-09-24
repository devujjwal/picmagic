# GPT-6 adoption plan for PicMagic

Status: deferred under the owner's no-additional-cost decision. GPT-6 integration
is optional, not a requirement for SEO/AEO/GEO or this release. Keep the free
template generator and deterministic recommendation agent. No API integration or
paid evaluations are approved. The proposal below is retained for reference only.
Verified against official OpenAI documentation on
24 September 2026. No model call, API spend, credential change or runtime switch.

## Current baseline

`features/generator/provider.ts` exports a synchronous `TemplatePromptProvider`.
The wizard composes text locally; no active OpenAI SDK, model ID or API-backed
provider exists. `scripts/optimization-audit.ts` is an offline deterministic audit.
Therefore this is an optional capability addition, not a model-string replacement.
Public image generation remains outside PicMagic. Existing preview assets and
private reference photos are not migration inputs.

## Target and rationale

Recommend **`gpt-6-sol`**, initially with `reasoning.effort: "medium"`, for a private,
on-demand editorial review of the audit's evidence. This is a proposed balance of
reasoning and cost, not a benchmark result for PicMagic. Evaluate Luna separately
only for narrowly bounded classification; do not silently downgrade or escalate.
Reserve Astra for a separately budgeted evaluation if Sol fails complex intent reviews.

Sol supports Responses and structured outputs. Its published Standard short-context
rates are $2 per million input tokens and $10 per million output tokens; access and
the account's limits still need verification. [Official GPT-6 Sol documentation](https://developers.openai.com/api/docs/models/gpt-6-sol).

Use Responses for reasoning with tools. Preserve supported effort when migrating
an actual workload; remove sampling/log-probability parameters when using reasoning.
There are no existing model request parameters to preserve here. [Official migration guidance](https://developers.openai.com/api/docs/guides/latest-model#migration-quickstart).

## Staged implementation

1. Keep the deterministic audit and free template provider as the default. Prepare
   a redacted, bounded evidence bundle from published records and findings. Never
   send personal references, credentials, raw private search phrases or drafts by default.
2. Define a versioned structured response with record IDs, evidence IDs, suggested
   edit, rationale, uncertainty and review status. Reject invented IDs and unsupported
   factual claims. Treat retrieved prompt text as data, not instructions.
3. Add an optional server-side/offline adapter only after API access and a per-run
   budget are approved. No browser API keys. No mutation tools. Reject incomplete,
   refused or invalid responses; retain the original deterministic report.
4. Evaluate representative photographic/artistic prompts, a child prompt, a couple,
   a deliberate multi-depiction concept, a still/reel pair, ambiguous taxonomy and
   low-volume/stale search evidence. Compare usefulness, groundedness, identity/age
   constraints, latency, tokens and cost against human-reviewed expected outcomes.
5. Set acceptance thresholds before trials: no invented evidence, no publication
   decisions, no disclosure of private data, schema-valid outputs, and a reviewer
   finding practical improvement over deterministic recommendations. Report actual
   measured latency/cost; do not forecast traffic gains.
6. If accepted, enable only an explicit `--editorial-review` workflow with a request
   cap, timeout, token budget, redaction and a complete audit trail. Rollback is simply
   leaving that opt-in disabled. Public `/create` and enhancement remain unaffected.

## Separate public-generator decision

Replacing `TemplatePromptProvider` requires an asynchronous server endpoint, request
validation, rate/cost limits, consent/privacy review and UI loading/error handling.
That changes the free product's latency, privacy and operating costs. It is not
needed for the SEO batch and is not authorized by a request for a migration plan.
Do not change the synchronous interface or remove the template fallback incidentally.

## Release gates

Approve API budget/access and the optional adapter before paid evaluations. Approve
evaluated results before activation. No site deployment, account upgrade, pricing
change, model-testing claim or production database migration belongs to this plan.
The model used by the development assistant is separate from PicMagic's runtime;
this plan does not claim to change the current Codex task's model.
