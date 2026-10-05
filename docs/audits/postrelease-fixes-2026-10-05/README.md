# 5 October post-release corrections — local review

**Historical local review below.** The owner subsequently authorized making these changes live and a repeat Dot audit. See [RELEASE.md](RELEASE.md) for the newer production verification and release record.

Baseline: the owner-supplied `PicMagic_postrelease_audit_2026-10-05.md` and `PicMagic_postrelease_findings.csv`, preserved as `baseline.md` and `baseline-findings.csv`. Their recommendations are evidence, not permission to release or operate accounts. This work follows the owner's narrower request. Started from a clean worktree at `4d70ca62cc85b6d59d7e2a4584dcc7517ae1dd76`; local branch `codex/postrelease-audit-oct5`. No commit, push, PR, deployment, production write, account change, social publishing or media generation.

## Reproduction and changes

| Finding | Reproduced against current code before editing | Focused correction |
|---|---|---|
| RUNTIME-01 | Text-only provider fixtures: photo, lighting, reel and friends-trip all contain approximately 22–30. Photo contains the override in both the reference block and creative direction. `age_group` validates/defaults to Keep original age but was unused; the UI offered no age selection. Help promises source age. | A separate utility reference contract retains facial geometry, complexion, ethnicity, proportions, hairline, group identities/count and child/adult safeguards. Source age is default for photo/reel/friends-trip and is always retained for narrow edits. Photo/reel adult subjects can explicitly select approximately 22–30 or 60–75, with a transformation disclosure and matching help. Subject changes reset age intent. |
| RUNTIME-02 | Photo: 4,653 → 4,650 characters after Shorten. Lighting: 4,450 → 4,447. Both repeat the full reference paragraph twice. See generated-before.json. | Emit the reference paragraph once. Shorten compacts known clauses and repeated general directions while retaining all arbitrary scene sentences, selected edits, framing, source age, identity safeguards and no-reference behavior. Identity refinement doesn't append another existing person contract. |
| RUNTIME-03 | PaginatedGrid increments batches but prints the original Page 1 of 3 forever. The current public photo catalogue contains 72 cards, 24 per server page. | Visible live progress reports Showing looks 1–24/48/72 of 72. Direct page 2 reports 25–48; page 3 reports 49–72. Original server-page state is separately labelled. Persistent Page 1/2/3 anchors remain usable after complete expansion. Existing server page ownership, self-canonicals, ordering and page-4 notFound code are untouched. |
| CONTENT-01 | Current professional category has Your Next Chapter in Focus, A Headshot That Feels Like You and Your Everyday with Better Light. Hub guidance instead named Quiet Confidence and a seated portrait. | Compare new-scene generation, adapting a suitable existing portrait, and a lighting-only edit. Each gets a use case and limitation. Remove the unrelated Quiet Confidence comparison. |
| CONTENT-02 | Original Saree prompt specifies a dominant left courtyard and two right regions; new repair guidance says left/centre/right. Four Worlds prompt specifies a dominant left portrait and three unequal curved right windows; repair guidance says a four-cell grid. | Use the existing courtyard/pavilion/studio and portrait/observer/pottery/traveller regions. Preserve asymmetry and original boundaries; change no creative composition or assets. |
| CONTENT-03 | Golden Hour copied prompt already contains the accepted short-/long-hair conditional; framing and camera fields still end in leave space around the braid. | Change just framing and camera to leave space around the selected hairstyle and jasmine. Preserve the already corrected copied prompt byte-for-byte. |
| CONTENT-04 | Outfit copied text unconditionally calls for a pantsuit, trousers and waistband; surrounding guidance already says blazer-only for waist-up input. | Put the waist-up blazer/blouse-only and visible-trousers/waistband branches inside both the opening instruction and essential details. Retain identity/source-crop safeguards and prohibit unseen lower body. |
| CONTENT-05 | Choosing guidance claims reel membership and still/motion choice. Exact baseline membership is four photo entries: Tiny Krishna, Big Wonder (Kid), A Family Evening, Lit by Diyas (Family), A Little Holi Happiness (Woman), Garba Under the Lights (Woman). | Choosing guidance describes those four stills and their actual subject requirements. The current release's collection introduction already accurately describes them; preserve it and membership. The separate festival category's Christmas distinction remains intact. |

The September 24 identity/age decision explicitly defaulted **creative editorial preview generation** to 22–30. That decision is retained in `lib/prompts/persona.ts`, `identity-contract.ts` and `preview-generation-policy.ts`. The owner's current correction and the utility's Keep original age intent govern these wizard outputs; this is not a bulk change to existing catalogue prompts or house preview policy. No global policy decision is inferred beyond this utility scope.

## Before/after prompts

Complete prompts and shortened variants are in [generated-before.json](generated-before.json) and [generated-after.json](generated-after.json). They use fictional text fixtures only, with no portrait upload or image/video call. Reproduce current fixtures with `node --import tsx scripts/content/record-postrelease-output.ts`.

Before: “When an adult age is not explicitly stated, generate a natural young-adult appearance of approximately 22–30 regardless of the reference's apparent age…” (also repeated in photo creative direction).

After, default: “Age intent: preserve every supplied person's apparent age and age-related facial texture. Do not rejuvenate or age anyone.”

After, explicitly selected older adult: “Age intent: explicitly selected creative age transformation — approximately 60–75. Apply only to adult references; preserve recognizable facial identity and natural proportions while adapting age cues.” Child/teen references require a suitable adult reference rather than an age transformation.

| Fixture | Original full / Shorten | Corrected full / Shorten |
|---|---:|---:|
| Photo | 4,653 / 4,650 | 2,752 / 2,250 |
| Lighting-only | 4,450 / 4,447 | 2,389 / 2,018 |
| Reel | 3,789 / 3,786 | 3,210 / 2,738 |
| Friends-trip | 4,992 / 4,978 | 4,732 / 4,459 |

Photo and lighting Shorten now remove about 18% and 16% of the already deduplicated output. Copied payload equality is verified in component tests for both full and shortened variants; real browser clipboard permission/access remains unverified.

## Exact database patch — UNAPPLIED

The application reads these fields from `public.prompts` in Supabase. A read-only, nonpersistent anonymous client attempted a SELECT of the four implicated detail records and the collection/membership inventory. DNS resolution failed with `ENOTFOUND lxecbrvzpmgjmsqiachc.supabase.co`. No login, write or unrestricted-network workaround followed. **There is no verified live database snapshot.** IDs and exact old values below come from the current versioned release baseline, consistent with the supplied production audit; they must not be presented as a fresh live read.

| Table / ID | Record | Fields |
|---|---|---|
| prompts / ac229bca-b98d-59ff-bda2-977203e8e083 | golden-hour-draped-in-tradition | framing, camera |
| prompts / 9826de05-2220-5039-9749-8ac3bac6d81d | an-outfit-with-a-new-perspective | prompt_text |

The composition repairs and professional/festival choosing guidance live in `content/seo-guides.ts`; they need no database edits. The festival introduction in `content/collections.json` already matches actual photo membership. Do not reapply older collection-description patches or change memberships.

[database-patch.json](database-patch.json) has exact before/after values and protected-field guards, including baseline updated_at. [database-forward.sql](database-forward.sql) and [database-rollback.sql](database-rollback.sql) are transaction scripts ending in **ROLLBACK**, with row locks, strict record selection, old-value checks, protected-field checks, exactly one affected row per record (two total), and within-transaction after-value verification. No INSERT/DELETE, migration, storage change, membership/order update or flag update. A successful authorized application advances only these records' updated_at to transaction time; rollback restores corrected text fields and advances updated_at rather than pretending the rollback happened on the original release date. It retains unrelated later fields and rejects conflicting later changes to corrected fields.

The SQL passed in a newly initialized socket-only disposable PostgreSQL instance: preview rollback, exact two-record update and verification, guarded rollback, untouched draft/membership, late-conflict atomicity, protected flag rejection, repeat-application rejection and rollback conflict rejection. See sql-tests.log. No production connection was used. Regenerate SQL with `node --import tsx scripts/content/postrelease-patch.ts`; the generator has no apply mode or database connection.

**Before any application:** obtain a permitted read-only snapshot of these exact live IDs/fields, compare with the patch, confirm the untouched collection's introduction/membership, and seek owner approval for this concrete patch. A mismatch must stop the transaction and trigger review, not a broad replacement or weakened guard. Only after approval should an authorized operator change the final ROLLBACK to COMMIT. A separately approved release/cache refresh and live copy checks would follow; none are authorized here.

## Validation evidence and limits

- Unit/component suite: 251 passing tests across 42 files. Includes source-age photo/lighting/reel/friends-trip fixtures; explicit adult choices; child guards; one reference clause; substantive/idempotent Shorten; unknown-constraint retention; exact visible/clipboard payload equality for both variants; Back/Continue focus; 24/48/72 status transitions; precise content corrections; inclusive double-exposure guide, permanent redirect mappings, prior source-crop/identity fixes and consistent structured-data dates. See unit-tests.log and focused-tests.log.
- Lint, TypeScript and local Webpack production build: pass. The documented `next build --webpack` path produces the same application routes with seed content, advertising disabled and test-only analytics ID. Default Turbopack cannot bind its CSS-worker port under this environment; that build path remains blocked. No production release build/deployment is claimed.
- Content validation: 186 prompts, 17 categories, 40 collections, zero missing published image files; 95 drafts excluded. Release-content validation preserves 91 stored published records and all 50 original canonical owners. SEO checks pass with existing shared-preview advisories, not new policy findings.
- Browser matrix was authored for desktop 1180px, 390px and 320px: all three wizards, full copying/Shorten, explicit age choice, friends-trip output, Back/Continue focus, progress/manual pages/Back/Forward, filters, keyboard menu navigation, result/no-result search, save/unsave, rejection/reopening, and overflow. The selected existing reel-playback tests and no-script/date/source-preservation tests were also attempted. **All 16 attempted Playwright tests were blocked before page interaction by Chromium launch SIGABRT/EPERM; these are environment failures, not website failures.** See browser-blocked.log. There is no browser pass at any of these widths.
- The supported Chrome computer-use tool also timed out at tab creation (34 seconds) without returning usable browser state. Local HTTP access returned connection failure despite a local preview process reporting ready. Neither restriction was bypassed. Therefore layout, real clipboard, history/manual pagination execution, menus, filters, search/save/privacy behavior, keyboard behavior and selected video playback need a permitted browser run. No screenshot or playback pass is claimed.
- Unit and component evidence cannot certify actual regional consent, Google runtime requests/cookies, analytics withdrawal or ad exclusions. Google services would be stubbed in the prepared browser suite. Applicable-region CMP behavior, analytics/network behavior and eligible inventory are separate, still-open activation checks.

The seed-only previews contain the corrected two records while live Supabase content remains unchanged. Test configuration changes generated by Next.js are restored after validation. Private portraits, recognizable private test outputs, account screenshots, preview media, all drafts, flags, collection order/membership, authentication, advertising configuration and social publishing remain untouched.

## Changed files

Application: `features/generator/reference-policy.ts`, `provider.ts`, `friends-trip.ts`, `wizard.tsx`; `components/prompts/tool-guide.tsx`, `paginated-grid.tsx`; `content/seo-guides.ts`, `content/prompts.json` (only the two records above).

Regression/evidence: `tests/unit/postrelease-fixes.test.ts`, `postrelease-wizard.test.tsx`, `infinite-discovery.test.tsx`; existing persona/fidelity/dot/reference-impact checks now follow the exact new patch without rewriting historical source evidence; the completed-release SQL test uses its immutable saved release patch rather than regenerating that old release with new fields. The lexical similarity advisory count drops from 32 to 30 after the precise outfit correction; no content was changed to chase similarity counts. `tests/e2e/postrelease-fixes.spec.ts` contains the pending browser matrix; `dot-audit-remediation.spec.ts` follows the clarified server label. `scripts/check-release-content.ts` chains exact old/new prompt text to existing release checks. Three `scripts/content/` helpers record text fixtures, generate review-only SQL and test SQL locally. This audit directory contains the baseline, exact evidence and handoff.

## Recommendation and owner decisions

The confirmed code/content defects have focused local corrections and passing automated regressions. **Do not mark them resolved on the live site:** no release or production content application occurred, the two database changes await approval and live old-value inspection, and the browser acceptance matrix remains unverified. Keep this branch local.

A separately approved AdSense review would be reasonable after the owner approves the corrections, applies/releases them through the existing guarded workflow, and confirms the product's output and navigation in a permitted live browser. It is not reasonable to claim the live defects are fixed merely because this local branch passes unit tests. Advertising activation remains a separate decision requiring actual regional consent, requests/analytics and inventory evidence; those activation checks are not all mandatory prerequisites to asking for review while ads remain disabled.

The supplied account evidence dates “Low value content” to **3 October**, before the release. This work did not inspect or change the account and cannot call it a new rejection. No review/indexing request was submitted, and no approval is predicted. Google's [page-readiness guidance](https://support.google.com/adsense/answer/7299563?hl=en) emphasizes useful original content and usable navigation; its [review guidance](https://support.google.com/adsense/answer/12176698?hl=en) describes resubmission after addressing the actual issues. [Inventory policy](https://support.google.com/publisherpolicies/answer/11112688?hl=en) governs where ads may serve. These official pages were read on 5 October for the recommendation, without accessing an account.

Decisions requiring separate approval: production database application of the two-record patch; any push/release/deployment; an AdSense review request; and, independently, future advertising activation. No new global editorial preview-age policy or media generation is proposed.
