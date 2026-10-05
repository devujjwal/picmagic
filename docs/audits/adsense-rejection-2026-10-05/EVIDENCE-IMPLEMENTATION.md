# Evidence and maintenance follow-up - 5 October 2026

## Authorization and limits

The owner asked to proceed with the competitor-derived recommendations and chose
to provide authorized portraits. Three references are retained privately, with
men, women and couple defaults documented in `docs/IDENTITY-REFERENCES.md`.
The owner approved uploading the adult men/women references to ChatGPT web for
eight tests and local output review. Recognizable public output publication is
not yet approved. The owner subsequently directed use of signed-in Chrome and
enabled file-upload access. Eight baselines, eight variations and two repairs
were executed there; see `REAL-TEST-REVIEW.md`. Work is local on
`codex/adsense-content-rereview`; no deployment, production data
writes, advertising activation or AdSense review request have occurred.

The existing September trial contains two real recorded fictional-person runs,
not eight successful portrait tests. Both recorded prompt texts still match the
current catalogue inputs. Neither run demonstrates real-person likeness.

## Implemented locally

- Prompt pages now distinguish illustrative previews from documented runs. The
  two trial prompts show their actual first outputs, dates, tool/mode, undisclosed
  model version, reference conditions, attempt counts and original/export sizes.
- Exact text comparison labels an older result as historical if its prompt
  changes. Suggested tools never become tested-tool badges.
- Guidance updates have a separately labelled date. The published operator is
  drawn from the existing public configuration, not an invented reviewer.
- Each public prompt has an issue-report control. With a configured address it
  prepares an email draft containing the canonical page, issue category, optional
  tool/model and text description. It neither submits automatically nor uploads
  images. Without an address it links to the existing contact route.
- About and Contact explain the evidence and correction process. Private draft
  previews do not render these public evidence/reporting controls.
- Existing canonical paths, prompt wording, publication/indexability flags,
  previews, collection membership and homepage ordering remain unchanged.

## Eight-prompt testing plan

`content/prompt-test-plan.ts` selects Fold, Borrowed Moon, Monsoon Paper, Small
Burst, Between Two Gravities, City Lights, Next Chapter and the conservative
Headshot editing prompt. This deliberately covers avatar cropping, physical prop
contact, material translation, coloured light, impossible architecture and
conservative editing. Eight is a manageable editorial scope, not a Google rule.

Run `node --import tsx scripts/content/prepare-prompt-tests.ts` to snapshot current
complete prompts and their SHA-256 hashes into the gitignored
`.release-private/adsense-evidence-2026-10-05/planned-inputs.json`. It has empty
run arrays and `planned-not-executed` status. It is not imported into the public
application or added to the actual trial records.

Before executing:

1. Obtain the portrait, permission for transmission to ChatGPT web, and separate
   permission for publishing any recognizable reference/result. Do not infer
   public-photo consent from permission to edit. Keep the original private unless
   explicit public permission is given. Confirm the reference is an adult and is
   suitable for the selected scenes; skip unsuitable scenes rather than altering
   age or identity.
2. Use the accessible existing ChatGPT workflow only. Record visible mode and
   disclosed model details; mark an undisclosed backend as undisclosed. Do not
   purchase credits, upgrade, use a paid API or substitute unapproved generation.
3. Retain the baseline result, then run the single-change variation. Record a
   focused repair only when the baseline needs it; never fabricate a failed run
   or label an unexecuted correction as successful. Where no repair is needed,
   record that outcome rather than forcing a third generation.
4. Record exact submitted input, reference provenance privately, timestamps,
   settings, original output hashes/dimensions, all attempts and actual observed
   limitations. Keep original files separate from optimized display assets.
5. Assess recognizable features and actual age before scene aesthetics, then
   anatomy, material/prop fidelity and intended crop. Identity instructions alone
   are not a pass. No success rate can be inferred from one portrait.
6. Publish comparisons only after consent and visual review. Public captions must
   distinguish baseline, variation and correction, explain exactly what changed,
   and state the limited reference/tool scope. Keep production activation behind
   explicit release approval.

## Overlap review

The current scan retains 31 text-overlap notices and 11 shared-preview notices.
Twenty overlap pairs have the same medium; eleven cross photo/reel intent.
These scores include necessary shared identity and safety instructions and are
not Google's findings or sufficient reasons to delete a route.

Reviewed distinctions:

- Lighting repair versus background replacement changes different portions of
  the original photograph. Retain both utilities; do not merge on shared safety
  wording.
- Birthday garden versus winter window, folded-paper versus brush-arc avatar,
  rotated stairwell versus acoustic sculpture, and ink/sky/lift scenes have
  different mechanisms. Retain their specific guidance and test output fidelity.
- The cafe, bookshop, park and kitchen cluster shares large instruction blocks,
  but has different objects, framing, lighting and actions. Its editorial depth
  requires real output comparisons; a scene substitution is not evidence of
  substantial value by itself. Guidance is not a substitute for those tests.
- Photo/reel pairs need different output instructions. Their shared still is
  explicitly concept art, not a video test. No new video work is authorized.
- The men/women double-exposure pair has about 97% text overlap and the same
  composition. It is the strongest candidate for a later unified comparison or
  variant presentation. Preserve both existing canonical URLs and the approved
  records for now; no blind redirect, deletion or publication flag change was
  made. A canonical-consolidation proposal needs a separate reviewed migration.

This review does not mark the 42 notices resolved. It prioritizes actual evidence
over expanding the catalogue or cosmetically rewriting necessary shared rules.

## Remaining-page editorial pass

`content/remaining-guidance.ts` adds two individually authored practical sections
and two relevant FAQs to each of the 43 published pages previously lacking a
guide or workflow. Six legacy prompts replace unrelated generic FAQs. Topics
include subject/reference suitability, framing, physical contact, garment and
product fidelity, conservative restoration and still-versus-video limitations.
Every published prompt now has guidance or a workflow. This is an editorial
coverage result, not a claim of Google approval or newly executed model tests.

No prompt inputs, publication flags, canonical routes, media or production data
were changed by this pass. The 42 overlap notices are retained rather than
declared resolved. New guide dates describe writing updates only.

Validation: 215 unit tests and 16 targeted desktop/mobile browser tests passed.
The latter includes all 49 revised pages, visible FAQ/schema agreement and
horizontal overflow checks. Lint, TypeScript and the local webpack production
build passed. Content validation retains 186 records, 91 published prompts and
95 excluded drafts, with no missing image files. Desktop/mobile guidance
screenshots were inspected. These are application checks, not image-model runs
or verification of real regional advertising consent.

## Verification

- Full unit suite: 213 passed after explicit report-field labels were added.
- Final production build and TypeScript check passed using the existing webpack
  fallback with advertising and analytics disabled. Earlier builds emitted four
  generated CSS optimizer warnings; the final build did not emit them.
- Final full lint passed. The first full lint traversed the concurrently generated
  `.next-logo-check/**` output and failed. Source lint then passed with that folder
  excluded on the command line; the final full command passed after the separate
  workflow removed its output. No unrelated branding changes were reverted.
- Content and release-content checks preserve 186 total records, 91 published,
  95 deferred drafts and 50 baseline canonical owners. SEO-content checks report
  zero errors and the same 42 review notices.
- Final Playwright batch: 20 desktop/mobile checks passed for evidence, reporting,
  October guidance and the existing responsive publisher boundaries. A further
  four evidence checks passed after adding a mobile email-action reachability
  check that does not open or send an email. Axe reported zero violations in the
  evidence/reporting regions. The earlier broad advertising-boundary file was
  skipped because this local build deliberately disables advertising; it is not
  counted as passing live-ad verification.
- Final 320px and 1440px evidence/report screenshots were inspected under
  `evidence-screenshots/`. The link wraps, the output image loads and form controls
  fit. The form action can be scrolled clear of the fixed mobile navigation.
- Temporary build-route imports and TypeScript include entries introduced by this
  local build were restored. No production configuration was changed.

Local browser checks stub Google services. They do not establish AdSense approval,
real regional consent behavior or actual advertising delivery.
