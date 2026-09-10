# Preview-aligned prompt review — 10 September 2026

All 50 published prompts were compared with the actual preview library and revised. The review covers 39 photo prompts, five photo edits and six reels. The preview images, original generation briefs and provenance remain unchanged; the new prompt text is an editorial improvement, not a claim that these revised prompts generated the original assets.

The Krishna example exposed missing directions for the visible white U-shaped tilak, soft curls, playful smile, head tilt, jewellery and flute grip. Its framing now leaves room for the feather, hands and flute. The rest of the library received individual appearance, pose/expression and essential-detail directions rather than a universal styling paragraph. Product prompts specify cap/handle, shape, materials, label and reflections without human anatomy boilerplate. Reel scene actions now match their written prompts, and the final hold is explicitly inside the 15-second runtime.

For reference-based portraits, the personal photo owns facial identity, age, skin tone and proportions. The PicMagic preview owns styling and composition. Requested hair styling and expression changes must keep the person recognizable. Enhancement prompts preserve the original hair, expression, marks and accessories except where the selected edit explicitly changes them. Restoration does not invent missing features or automatically colourize monochrome photographs. Background and outfit edits do not restage the subject.

Guided generators retain existing cultural marks rather than inventing them from a broad “Traditional Indian” choice. Scoped edits no longer inherit conflicting new poses, clothing and backgrounds. Shortening retains important appearance and preservation directions. No external image/video API or paid generation was added.

## Using the revised prompts

Copy the whole prompt, not only its first paragraph. Attach a clear personal reference in a tool that supports it. If attaching the preview too, label the two roles explicitly. For an omitted feature, request a local or masked edit of the generated result, specifying what to add and what must stay unchanged. For example, restore the Krishna forehead tilak without changing the child's face, hair or expression; then separately refine hair or expression if needed.

The new FAQs on every detail page explain this workflow. Specific directions address known omissions, but image tools may still ignore details. No fresh external-model generation comparison was performed during this review, so there is no measured claim of improved similarity or guaranteed identity preservation.

## Publishing and rollback

`content/prompts.json` remains the validated seed source. Ordinary seed imports are still insert-only and never overwrite editorial changes. This revision uses the explicit `scripts/update-reviewed-prompts.ts` tool, authenticated as the owner through Supabase Auth and RLS. It compares only reviewed fields against baseline commit `5ef3597`, aborts on editorial conflicts before writing, preserves unrelated fields and publication state, takes a private pre-write backup, and applies timestamp-checked updates. A concurrent edit during writes stops the batch; run the dry run again before resuming.

Run with Node 22 and the private production/admin environment files using `pnpm exec tsx --env-file=.env.production.local --env-file=.env.admin.local scripts/update-reviewed-prompts.ts --base-ref 5ef3597`. Default is dry run; `--apply` performs the reviewed updates. After an apply, save a current record through the protected editor to invalidate catalog/search/page/sitemap caches, then verify live HTML. Never commit the private environment files or backup. For rollback, restore only changed fields from the private backup with conflict checks, invalidate the same caches, and revert the matching content commit; do not re-seed the entire production database.

The per-image review is recorded in [prompt-detail-review.json](qa/prompt-detail-review.json), including hashes of the revised copied text. Unit checks cover missing Krishna details, product language, reel timing/text agreement, shortening and scoped edits. Production verification is recorded separately in [prompt-review-live.json](qa/prompt-review-live.json).

Production verification passed for all 50 canonical detail pages, exact clipboard copying, generator and shortening flows on desktop and mobile (ten browser checks), 47 unit tests and the production build. The protected owner editor save refreshed catalog, page, search and sitemap caches; the owner session was signed out afterward.
