# Festival templates and poster editor — validated release batch

## Current verification — 10 October 2026, generation retry

The owner explicitly authorized retrying included ChatGPT generation and releasing
the complete verified batch, with optional logo/name/email/phone/custom details.
All **12 previews** have now been generated using signed-in ChatGPT web's included
allowance and individually reviewed. No paid API or alternate provider was used.
Nine portraits used the fixed matching private pool selections; three business
backgrounds are original decorative artwork without people or logos. Source
photos, reference hashes, exact source conversations, output hashes and qualitative
review limitations remain private. Original photographs are not public assets.

The approved materialized catalogue is in `content/releases/festival-approved-2026-10.json`;
the separate authoring input remains unpublished. Six existing IDs/URLs are
preserved, six new IDs added, and new collection memberships appended without
reordering previous members. Public previews are optimized, content-addressed
WebP files with matching dimensions and thumbnail variants. Historical records
and their prior review evidence remain unchanged; the scoped review links the
six refreshes to their exact historical prompt hashes.

The poster editor includes English/Hindi greetings, company/name, message,
optional website/email/phone/custom details, original-logo and photo uploads,
colour/layout/crop/reset and all three PNG sizes. Blank optional fields are hidden.
It explains that supplied details appear on the exported poster. No personal
inputs enter URLs, network requests or persistent storage. Sources are 1122×1402;
the editor exports the specified pixel sizes, not a claim of native 4K AI artwork.

Latest verification:

- Lint, TypeScript, **314 unit tests / 49 files**, content and release gates pass.
- Local final production build passed: **158 pages**, ads/analytics disabled.
  Turbopack's local worker port was denied even with escalation; the documented
  Webpack build path succeeded. Production's configured build remains unchanged.
- **11 Chromium tests passed** on that final build: all 12 detail routes,
  canonical paths, preview/thumbnail availability, sitemap entries and exclusion
  of all 89 remaining drafts; real-artwork editor at 320/390/768/1440; Hindi,
  keyboard/accessibility, 36 export combinations, pixel equality, valid and
  invalid uploads, text overflow, failures/retry/reset and memory-only privacy.
- Desktop real-art visual checks covered all three festival backgrounds. Local
  screenshots are private evidence, not a claim of deployment.
- Fresh production backup confirms **91 published / 95 drafts**. Exact forward
  activation and conflict-checked rollback rehearsed successfully and rolled back.
  No migration; unrelated catalogue, blog, admin, affiliate and redirect rows
  checked unchanged. Trigger-generated tags and memberships are guarded.
- Netlify: existing Personal allowance **772.4 credits remaining**, recharge
  disabled; production `main` only, PR previews disabled, no build hooks.
  GitHub: no open PRs or Actions workflows. No account settings changed.

Deployment and live content activation are still pending at this checkpoint.
The historic initial failed attempt below is retained as evidence, not current status.

## Historical first attempt: blocked on included ChatGPT image generation

No code has been committed, pushed or deployed for this batch. No production
content, storage, ordering, advertising, affiliate settings or account permissions
were changed. The production catalogue was read in a repeatable-read, read-only
transaction on 10 October 2026 at 13:50:55 UTC: **186 total / 91 published / 95
drafts**. All six selected records exist and remain unpublished. A private full
catalogue baseline is under `.release-private/festival-release-20261010/`.

The signed-in ChatGPT Create image workflow failed to generate the first
decorative Diwali background, reporting that its generator incorrectly required
a reference even after an explicit original-art request. No resulting image was
returned. Generation stopped, as required. No private identity reference was
uploaded in this attempt, no rotation was advanced and no fallback was used.
There is no evidence that the included allowance was exhausted; the observed
blocker is generator failure. Do not report any of the twelve previews as ready.

## Implemented locally

- `/festival-poster-maker`: English/Hindi presets, custom text, three typed design
  IDs, two fixed layouts, optional original logo/photo, photo pan/zoom, colour,
  reset, memory-only state and three full-resolution PNG formats.
- Shared Canvas renderer uses the actual preview surface for export; neither
  uploaded images nor text are sent to a backend. Native browser uploads only,
  signature/MIME/decode checks, 10 MB / 8192px / 24 MP limits, no SVG.
- Text is grapheme-aware (including Hindi), fitted within bounded boxes; overflow
  prevents export and asks for shorter text or a different layout/format.
- Local Noto Sans Devanagari variable font, SIL Open Font License, downloaded
  from the official Google Fonts repository. License retained beside the font.
- Creation-tool, festival-collection and template-to-editor links. URLs contain
  allowlisted design IDs only. Missing artwork/font fails closed with retry.
- Twelve complete staged records in `content/releases/festival-2026-10.ts`.
  This file is deliberately **not imported into the active catalogue**. Every
  staged record is unpublished, non-indexable and requires image generation.
- New authoring preserves actual reference ages using the already-supported v1
  contract. Historical v2 content/validation remains intact; no schema migration.
- `check:festival-release` is included in the production deployment command and
  deliberately fails while these records are unreviewed/unintegrated or the real
  assets are missing. Ordinary local `build` can still validate the editor.

The frontend UI engineering guidance informed existing-brand styling, semantic
field groups, accessible names, error/status feedback and responsive layout.
The image-generation guidance informed identity/provenance safeguards; the owner’s
ChatGPT-only generation restriction overrides its default image tool.

## Concept alignment and duplicate decisions

| Concept | Distinction / required preview check |
| --- | --- |
| Kurta at the Lantern Courtyard | Full-length lantern courtyard, garment front unobstructed; optional exact garment reference, otherwise explicitly fictional. |
| Midnight Fuel Stop | Stationary unbranded motorcycle in parking area, mist/canopy light, engine off; optional exact bike reference, otherwise fictional. |
| Floral Shadows, a Clear Face | Shadows on background/shoulder, not obscuring eyes/nose/mouth; central circle-safe face. |
| Founder After Hours | Seated woman, closed notebook, thoughtful expression, lamp and city reflections; no invented company claims. |
| Monsoon Love Story | Two adults, clear umbrella, two chai glasses, readable faces and grounded feet. |
| Desert Moonlight Promises | Two adults, dunes, restrained lantern fill, visible faces rather than silhouettes. |
| Durga Puja Pandal Portrait | Layered craft architecture and alpana; no automatically assigned sindoor or named-pandal claim. |
| Navratri Dandiya Portrait | Adult man, exactly two visible sticks and still pause; not the existing spinning Garba skirt or motion variant. |
| Diwali Courtyard Celebration | Standing adult couple under a broad arch, rangoli and clear walkway; not the seated multigenerational family/flower-tray scene. |
| Durga Puja Business Greeting | Decorative cream arches/alpana on crimson; no recognizable person or endorsement. |
| Diwali Business Greeting | Decorative diyas/rangoli on indigo; no family portrait. |
| Dussehra Business Greeting | Decorative bow/arrow motifs on green, no battle or burning effigy. |

Existing six IDs and canonical paths are unchanged. The six new IDs are reserved
in the staged input; the three business IDs are shared by the editor registry.
Business designs use the existing `photo`/`product` metadata contract, with a
decorative illustration subject—not a claim of photographic people or a new type.

## Local verification completed — 10 October 2026

- ESLint, TypeScript (production build), all **314 unit tests / 49 files**, and
  `git diff --check` passed.
- General content, SEO, existing release-content and blog checks passed against
  the unchanged seed catalogue. SEO reported 41 existing editorial notices, not
  new errors. The staged twelve-record suite checks schema, IDs, canonical paths,
  complete prompts, persona requirements and collection mappings separately.
- The analytics/advertising-disabled local production build passed (146 pages).
  No build was uploaded. The local test server was stopped after verification.
- **10 Chromium tests passed** against that production build. Responsive checks
  covered 320, 390, 768 and 1440 pixels, Hindi shaping, keyboard operation and
  automated accessibility checks. All 36 combinations (three designs, three
  sizes, two layouts, English/Hindi) exported at the requested pixel dimensions
  with PNG pixels identical to the full-resolution preview canvas.
- PNG/JPEG/WebP inputs, original-logo containment, photo positioning, reset,
  optional fields, invalid SVG/corrupt/oversized/excessive-dimension inputs,
  overflow, null export, missing artwork and failed-font recovery were exercised.
  Font recovery explicitly re-fetches the same local resource and preserves edits.
- A test marker and uploaded fixture bytes did not appear in network requests,
  URLs, cookies, localStorage or sessionStorage; reload cleared in-memory inputs.
- Screenshots and browser checks use **synthetic solid-colour artwork fixtures**,
  not approved festival artwork. They do not establish final visual/identity QA.
- `check:festival-release` **fails intentionally**: reviewed assets and approved
  catalogue integration are absent. This is a release blocker, not a passed gate.
- No production HTTP smoke requests were made. Hosting allowance, deployment
  controls, exact mutation/rollback rehearsal and live activation remain pending.

## Remaining release steps

1. Restore included signed-in ChatGPT image generation. Generate all twelve
   previews; select references only at generation time using private rotations.
2. Keep actual age, identity and distinguishing features. Record actual provider,
   prompt, input hashes, outputs and limitations privately. Review likeness,
   anatomy, cultural details, composition and crop. No recognizable-original
   uploads to public assets. Request input for uncertain suitability.
3. Replace staged filenames with reviewed optimized content-addressed assets,
   include actual business artwork in the editor, and test real imagery/fonts at
   every target width and export ratio. Synthetic QA fixtures are not assets.
4. Integrate only the twelve approved records and memberships. Recheck duplicates,
   canonical URLs, sitemaps and exclusion of the 89 remaining drafts. Update local
   release-count assertions only with actual approved activation data.
5. Re-read production baseline and hosting allowance/deployment controls. Existing
   backup is evidence, not permission to overwrite intervening changes.
6. Prepare and rehearse the exact conflict-checked transaction and its rollback
   using fresh old values; preserve unrelated records, memberships and ordering.
   This mutation/rollback has **not** been prepared or rehearsed yet.
7. Run final local checks/build and real-asset browser QA. Push the complete
   code/assets once, verify deployed assets, activate exact content and invalidate
   caches. Verify deployment revision AND content activation, at most six live
   smoke requests. Expected final catalogue if unchanged: **103 / 89**.

Do not deploy this incomplete batch. Do not substitute fixture images, old
previews, original private photographs or an unapproved provider to clear the gate.
