# Dot Audit Remediation, 5 October 2026

## Scope And Evidence

The five original owner-supplied audit files are preserved in this directory.
They are evidence, not execution instructions. The report reviewed cached HTML
for 131 discovered content URLs; it did not successfully render those pages in
a browser. Its 173 requests, selected asset retrievals and explicit exclusions
must not be described as complete runtime or regional consent verification.

Local-only branch: `codex/dot-audit-remediation`. Baseline: `c21f970`.
This describes the original local remediation stage. The owner subsequently
approved production release and the scoped sync; see `RELEASE.md`.
No push, deployment, production database/Storage write, publication flag change,
advertising activation or AdSense review submission is part of this batch.
All 95 drafts and private reference assets remain intact. The three explicitly
approved consolidation sources redirect to their replacement destinations;
other canonical owners remain intact.

## Implemented Locally

- PHOTO-01: four faithful edits preserve source aspect ratio and framing; any
  recrop or canvas extension requires an explicit request. Detail facts identify
  preview ratio and example camera/framing/light, not a forced edit destination.
- PHOTO-02: first dance uses separate adult photographic identities and relative
  monochrome tones; its structured reference contract is photographic.
- PHOTO-04: four dating photographs specify one still instant, with different
  cup/book/foot/utensil repairs rather than a copied motion sequence.
- PHOTO-05: nine dates use first known and last record-changing Git author
  timestamps. `date-provenance.json` preserves exact commits. These are repository
  history dates, not dates of image generation, an original idea or a new test.
- PHOTO-06/07/08: braid visibility is conditional on reference hair length;
  desk-edge hands fit the waist-up frame; the retro benefit now says 1990s.
- PHOTO-09: square-master/circular-safe export supersedes the illustrative 4:5
  profile preview rather than simultaneously demanding two output ratios.
- PHOTO-10: panel-local mapping and repair, editor assembly alternatives and an
  ink-boundary repair are explicitly proposed workflows, not new test evidence.
- PHOTO-11 (partial): tailor guidance explains the walking illustrative preview
  versus the standing prompt. The existing truthful alt remains unchanged.
- RC-01/02/04: birthday payoff follows the waist bow, complete source frames are
  separated from video detail crops, and seaside defaults to three matched shots.
- RC-03: public guidance distinguishes each legacy roughly five-second Kling
  excerpt from today's full fifteen-second plan. Local MP4 hashes match the
  original manifest; its recorded review is attributed, not presented as a new run.
- RC-05/07/08: professional generation versus faithful edit guidance, Christmas
  versus Indian-festival membership, and an editor-controlled quiet introduction.
- RC-09/10 and SITE-01: first reel-list heading, context-specific list labels,
  product/family/wedding/birthday introductions, suppression of empty creative
  headings, singular counts, previous-page links and finite page counts.
- SITE-02: creator no-script guidance exists in both the page and streamed loading
  fallback, with ordinary prompt navigation. This does not bypass network filters.

`changes.json` and `reel-changes.json` record exact prompt field before/after
values. Historical review manifests are not rewritten; release checks connect
the old review hash through the explicit revision to the current prompt.

## Remaining Decisions And Gates

- PHOTO-03: implemented the subsequently approved inclusive double-exposure
  guide, with both fictional examples, complete prompt and proposed repair
  workflow. Both former URLs permanently redirect. Stored source records/assets
  remain intact; discovery and sitemaps exclude them.
- RC-06: implemented the subsequently approved cinematic category-to-collection
  permanent redirect; transferred useful lighting guidance and updated direct
  internal navigation/breadcrumbs.
- PHOTO-11: Mediterranean preview pixels were not verified by the original audit;
  no unsupported alt correction has been made.
- SITE-03: retain the existing legal-page sitemap omission for this batch. Those
  pages remain reachable through footer links; this is not an approval blocker.
- SITE-04: retain useful truthful FAQs; no rich-result or approval claim is added.
- SITE-05: no new product/motion trial or recognizable private output publication
  is authorized by this audit implementation. Existing bounded trial stays intact.
- GATE-01: all public local HTML and changed-page desktop/390px/320px rendering
  checks pass. These are not all-page live QA; the work Chrome context blocks a
  referenced script. See `READINESS.md` for the precise observation.
- GATE-02: ads remain disabled. Real applicable regional CMP/Auto ads/inventory
  checks remain required before separately approved advertising activation.
- GATE-03: read-only PicMagic Gmail account and selected Search Console evidence
  are recorded in `READINESS.md`. AdSense still reports low value content; accepted
  ownership status and generic account-notice reconciliation remain unresolved.
  No invented traffic threshold or assurance of approval.

## Release Requirements

These seed edits are not live Supabase content. A future approved release needs
a conflict-checked sync of only the reviewed prompt/category fields, including
the first-dance reference contract and history-backed dates in addition files.
The existing original-prompt updater alone does not cover that full scope.
The prepared `release-revisions.json` and `release-preview.sql` cover 27 prompts
and four category descriptions. The SQL ends with rollback; a socket-only
disposable PostgreSQL test verifies exact updates, idempotency, protected-field
checks, an untouched draft and atomic rollback on a late conflict. This is not a
production preflight or application. Do not overwrite the entire catalog.
Check included hosting allowance, complete local validation, then release the
approved batch once. Approval for the earlier `c21f970` release does not authorize
this new audit batch or an AdSense review request.

## Validation

- 232 unit tests passed across 40 files.
- ESLint and TypeScript checks passed; `git diff --check` passed.
- Content validation: 186 records, 91 published and 95 drafts, no missing images.
- SEO content validation: 89 eligible prompts, zero errors and 43 review notices.
  `EDITORIAL-DECISIONS.md` assesses all 32 text pairs and 11 shared previews, as
  well as all 27 original expand recommendations. No warning was suppressed.
- Release-content gate passed, preserving 50 baseline canonical owners and all
  explicitly deferred drafts. This is validation, not release authorization.
- Local production webpack build succeeded and generated 144 pages.
- Final representative/remediation Playwright run: 55 passed, 23 intentional
  skips (18 enabled-discovery cases tested separately, five viewport-independent
  duplicate checks). Changed pages fit at desktop, 390px and 320px.
- Enabled-discovery Playwright run: 18 passed, two disabled-rollout cases skipped
  (those two passed in the preceding disabled run). Three 24-item pages and both
  infinite-scroll variants expose the same 72-record snapshot without duplicates.
  Covered creator/reel generation, copy, search, save/unsave, finite pagination,
  broken assets, blocked storage/clipboard, accessibility, privacy rejection and
  reopening/allowing/withdrawal/reload, the no-script creator fallback, and
  displayed evidence limitations. Public HTML checks cover 134 destinations and
  four redirects: links, canonical ownership, headings and date chronology.
  Guide, final-page and no-script screenshots were inspected locally.

The first browser pass found the streamed creator fallback gap; it was corrected
in the loading shell as well as the page. Subsequent inspection also separated
the readable fallback from the busy skeleton's accessibility state. Initial
privacy failures used a build without the analytics test ID and are not evidence
of a production consent defect. The final run used a fictional analytics ID,
Google request stubs, advertising disabled and no private uploads. It does not
verify real Google services, geography-dependent consent or production changes.

The new 320px pass found cross-links inheriting `nowrap`; those now wrap. Its
first-visit privacy journey explicitly dismisses the optional-analytics banner
before reopening footer choices. The corrected workflow passes without forced
clicks or bypassing overlays. See `READINESS.md` for actual account evidence,
release gates and unresolved live/regional checks.
