# PicMagic library release — work in progress

This is not a completion or deployment report. Production has not been changed by this batch. The release must remain local until the full content/media gate and final checks pass.

## Evidence already available

- `prompt-audit.json`: all 50 original published prompts reviewed; mandatory reference/no-reference architecture applied. Six substantial rewrites. The original bodies of four already-correct edits were retained while adding the required persona policy.
- `preview-audit.json`: 47 original human previews reviewed; 12 replacements integrated. South Asian generation intent increased from 25/47 to 37/47. These counts come from explicit generation briefs, not ethnicity inferred from faces.
- `content-reuse.json`: 11 existing photo concepts reused with their original canonical URLs instead of duplicate photo pages.
- New catalog: 49 photo prompts and 64 reel prompts, 113 new records, 163 total records. Fifteen photo and sixteen reel collections, four distinct concepts per collection including relevant existing photos.
- `reel-preview-manifest.json`: two accepted Kling clips, each actually 5.041667 seconds, H.264 MP4, 576×720, no audio. Anniversary 267,989 bytes; fragrance 386,630 bytes. Provider watermark retained. The anniversary loop has a small pose jump at restart.
- No Runway purchase or upgrade. Only its Free workspace is accessible; a displayed credit balance did not grant Gen-4 Turbo access. Kling last known balance 25 credits. Remaining video generation is covered by the owner's explicit exception and must be reported as outstanding.

## Local verification to date

- Lint, TypeScript, 82 unit tests and content-schema checks passed again after reel pagination/media-label changes (21:03 local). They must run again after final content/assets.
- Disposable local Supabase `picmagic-release-qa` runs at 127.0.0.1:54421. Migration 202609100003 applied locally; 11 RLS assertions passed. Production migrations remain unapplied.
- Original public E2E journeys: 34 passed across desktop/mobile. Three pairs initially failed because the QA server used 0.0.0.0 and two hydration checks assumed configured cookies. Starting Next on localhost fixed upload origin validation without weakening the production security rule; hydration checks now use Save. All six affected admin/CSP/prefetch journeys passed on rerun.
- Six new video E2E journeys passed: actual playback/pause, missing video fallback, no video download under reduced motion; desktop/mobile. Ads/GA integration tests were skipped in the unconfigured QA build and require the configured, vendor-stubbed final run.
- Production build passed before the newest changes. Local schema sync is explicitly restricted to the disposable backend.
- Responsive checks: 24 page/width combinations across 320, 375, 430, 768, 1024 and 1440; plus 200% zoom. No horizontal overflow. Reel discovery/detail manually reviewed in the in-app browser; video controls and poster behavior visible. New collection manual review is still in progress.
- First local mobile Lighthouse run: home 91/100/100/69, women category 98/100/100/66, photo detail 97/100/100/69, creator 99/100/100/66 (Performance/Accessibility/Best Practices/SEO). SEO is reduced by deliberate QA noindex. These are preliminary lab measurements, not final asset-complete measurements or field Core Web Vitals.

## Repeatable local workflow

1. Read `generation-queue.json` / `PENDING-IMAGE-GENERATION.md`. Generate each original image only in the user's ChatGPT browser workflow. Never substitute Codex image generation.
2. Inspect the full-resolution export, then write a review JSON under `image-reviews/` with the exact prompt, source conversation/file, alt text and acceptance notes. Record any exact edit prompts too.
3. Run `node scripts/content/integrate-image.mjs <review.json>` to optimize and update the relevant photo/reel poster records. This does not publish.
4. Run `node scripts/content/sync-asset-queue.mjs` and `node scripts/content/activate-reviewed-content.mjs`. These only edit local files; active collections require four reviewed/published local members.
5. Sync the disposable database using `node scripts/with-qa.mjs pnpm exec tsx scripts/content/sync-local-qa.ts`. This rejects all other backend URLs.
6. Start the QA production server with `node scripts/with-qa.mjs pnpm exec next start --hostname localhost --port 4311` after building it. `localhost` is required so same-origin upload checks match the browser origin.
7. `pnpm check:release-content` must pass before final release; unlike ordinary schema validation, it rejects missing assets, drafts and inactive requested collections. Do not rerun `build-expansion.ts`: its initial-generation guard protects reviewed editorial work.

## Still required

Finish the original ChatGPT images in the queue; review all new content and the combined image library; finish local admin video validation and enabled ads/GA test fixtures; verify reel pagination, collection links, metadata, sitemap and noindex behavior; complete final tests, build and performance/visual review. Then check Netlify's remaining free allowance and deploy once, apply controlled content changes without overwriting unrelated editorial updates, and verify the live site. Deliver the final consolidated A–J report with exact release/rollback identifiers and any remaining external video dependency.

## Temporary generation interruption

ChatGPT displayed “Too many requests” and temporarily limited conversation access during the next car-image batch. Generation was paused; no alternative provider was used. Car paint-detail conversation: https://chatgpt.com/c/6aa2cd58-e694-83e8-9581-d9080104dc70 . Estate-car conversation: https://chatgpt.com/c/6aa2cd5b-1664-83ee-8f01-f023f6890a79 . Inspect those existing jobs before submitting duplicates. At this point 12 new image jobs are integrated, 41 remain in the generation queue, and 8 of 31 new collections are ready locally.
