# Three retained concepts — generated media and local integration

The owner explicitly changed this batch to **Codex-only image generation**. All three images were made with the built-in `image_gen` tool, not ChatGPT browser automation or an API/CLI purchase. No personal or competitor photographs were used. Indian personas are supported by the exact generation briefs, not inferred ethnicity.

| Concept | Final file | Dimensions | Bytes |
|---|---|---|---:|
| Borrowed Moon, Closing Time | `public/previews/borrowed-moon-closing-time-social-v1.webp` | 1080 × 1350 | 162,378 |
| A Fold Around You | `public/previews/a-fold-around-you-profile-social-v1.webp` | 1024 × 1024 | 93,440 |
| A Small Burst of Motion | `public/previews/small-burst-of-motion-profile-social-v1.webp` | 1024 × 1024 | 104,352 |

Each has a 480px WebP thumbnail. Original PNGs are retained under `sources/`. `manifest.json` records exact original prompts, output paths, timestamps, final sizes and alt text. `correction-prompt.txt` records the one targeted edit: the initial motion portrait had unwanted transparency and tight headroom; the accepted edit supplies an opaque warm-grey background and more headroom while retaining the same fictional face. The rejected original remains at its recorded Codex source location and is not a public asset.

## Visual review

[Contact sheet](contact-sheet.png) and [square/circular review](avatar-crop-review.png) are included. The crop sheet shows paper portrait above motion portrait; each row is square/circle at 40, 64 and 128 pixels. Faces, glasses, head and chin remain readable; effects remain behind the face. At 40px the detailed brush/paper texture simplifies, as expected, but the face remains the focal point. This is preview readability QA, not a guarantee of future customer likeness preservation.

The theatre image retains a prominent face, believable hand/prop contact, painted crescent supported on a cart, empty seats and warm/cool theatre light. Mobile 375/430px feed samples are in `qa/`. The requested rolled curtain is rendered as a gathered hanging stage curtain; the theatrical setting and prop-returning story remain clear. There is no generated caption or watermark.

Manually inspected integrated screenshots at 375px and 430px for profiles and desktop for the post. Automated overflow/image/canonical/accessibility checks cover all three at 375, 430 and 1440px. Source images were resized proportionally and encoded as WebP; no creative edits or ethnic/skin alterations were made with code. Existing Next Image components reserve the detail aspect ratio and provide responsive delivery.

## Local integration and scope

- `content/additions/social-prompts.json`: three complete **unpublished, noindex** records. Existing IDs/slugs/content untouched; total library 173 records, 75 published and 98 drafts in normal seed mode.
- Existing approved prompt wording is retained in the planning artifact. Integrated reference clauses use the existing canonical persona validator, retaining explicit single-person authority, glasses/facial hair, age and styling rules. Hashes are recorded in `content-review.json`.
- `content/catalog.ts`: includes the three drafts. `lib/prompts/social-preview.ts` and `lib/content.ts`: explicit local review mode. Requires `CONTENT_SOURCE=seed`, `PICMAGIC_SOCIAL_PREVIEW=true`, `NEXT_PUBLIC_INDEXING_ENABLED=false`, and no Netlify, CONTEXT or CI marker. Supabase repository is unchanged. All three records remain false for publication/indexing even in local review.
- Reuses `/collections/instagram-profile-picture` through a local-only collection overlay; the two new profile concepts lead, existing members remain. No duplicate cross-app collection. No thin one-record Instagram collection was created; broader curation remains a release-review decision.
- Three canonical detail paths are `/ai-prompts/social-media/<slug>` using the slugs above. No redirects or new route implementations. No production sitemap entries, content activation or Storage writes.
- AGENTS.md records the owner's media-provider change while preserving the release hold.

## Verification

- Lint: pass.
- TypeScript and Next type generation: pass. Final `tsc --noEmit` also checked the E2E source.
- Unit/component suite: **125 passed across 20 files**, including preview-mode safety and draft persona validation.
- Content validation: **173 prompts, 17 categories, 40 collections; zero missing published images**. Standard tsx CLI first hit the sandbox IPC restriction; equivalent `node --import tsx scripts/check-content.ts` passed.
- Local production build: pass (127 prerender tasks), seed source, indexing/ads/GA disabled, `.next-release` output.
- Chromium E2E: **19 passed** (15 existing public journeys plus four new social journeys). Four social tests then passed again to improve top-of-page screenshot coverage. Checks include full clipboard equality, save persistence, copy-share URL, real loaded images, noindex/canonical ownership, profile membership, sitemap exclusion, existing search/creators, protected admin redirect, storage/clipboard failure and image fallback.
- Axe: no violations in the tested new detail pages and existing public accessibility journeys.
- Tests used localhost only with Google requests stubbed. No live ad impressions, remote database mutations or deployment.

A full authenticated admin create/publish cycle, new Lighthouse measurements and real-user Core Web Vitals were not run for this media batch. No claim is made that these local checks constitute production release verification.

## Local review

The current local production server is at port 3003. Start it again after stopping with:

```sh
CONTENT_SOURCE=seed PICMAGIC_SOCIAL_PREVIEW=true NEXT_PUBLIC_INDEXING_ENABLED=false NEXT_PUBLIC_ADS_ENABLED=false NEXT_PUBLIC_GA_ID='' PICMAGIC_DIST_DIR=.next-release pnpm start --port 3003
```

Use `/ai-prompts/social-media/borrowed-moon-closing-time`, `/ai-prompts/social-media/a-fold-around-you-profile`, `/ai-prompts/social-media/small-burst-of-motion-profile` or `/collections/instagram-profile-picture`.

## Release hold and remaining work

Everything remains on `content/identity-and-collection-audit`. No push, PR, main merge, Netlify build hook or deployment. Feature push remains disallowed until preview/build triggers are conclusively verified. Billing reset is not release approval. Production activation, release content review, any deployment and live verification require the owner's explicit release instruction.

The earlier ten-item and three-item planning manifests remain historical. This directory is authoritative for completed media provenance and current local QA. Existing unrelated release reports and `next-env.d.ts` work are excluded from the batch commit.
