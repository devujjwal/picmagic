# PicMagic Blog + PicMagic Lab — local implementation

## Delivery and release boundary

Implemented on `codex/postrelease-audit-oct5`. No commit, push, PR, deployment, production Supabase migration/content write, article publication, advertising activation or generation purchase. The existing audit edits and untracked live-smoke record were preserved. All five real articles remain `draft`, non-indexable, with no publication date. All 95 existing prompt drafts remain unpublished.

The database migration was exercised only in the existing `supabase_db_picmagic-release-qa` disposable Docker container. Clearly named `qa-blog-*` published records were temporary browser fixtures, not publication of the real drafts. The test accounts are local-only; public signup was not changed. Existing guide URLs and canonical prompt/category ownership remain intact.

## What is implemented

- `/blog`, `/blog/[slug]`, the PicMagic Lab section, authenticated admin list/new/edit/preview routes, and explicitly enabled development-only loopback seed previews.
- Versioned, Zod-validated JSON blocks: paragraph with safe inline links, H2/H3 heading, image, Quick Answer, Steps, Comparison Table, Callout, FAQ, PromptCard/PromptGrid and CTA. The UI edits typed blocks without requiring JSON or arbitrary HTML.
- Supabase article/author/redirect tables, server-side role checks, RLS, atomic canonical history and updates to related-article slugs. First publication dates and substantive modification dates are maintained server-side.
- Normal public publication enables indexability and blog/internal/sitemap discovery. Draft/review records are publicly inaccessible. Noindex publication requires a reason and a review deadline within 30 days; overdue exceptions are hidden by both RLS and application gates and called out in admin and the full-state release checker.
- Shared metadata/sitemap architecture supplies canonical URLs, article OG metadata, X cards, BlogPosting and breadcrumbs. Publisher/WebSite entities remain shared. Visible FAQs carry no FAQ rich-result markup. The empty initial blog hub is noindex and has no public navigation link until discoverable articles exist.
- Approved public catalogue previews are reused with dimensions, responsive sizes, alt text and captions. No private references, competitor images or new generated media. `ASSETS.json` records 16 reviewed public examples and hashes.
- Specific published-article relationships drive reciprocal prompt/category/collection links. Search remains prompt-focused; no thin archives, tag routes or feed are added.
- About and Privacy explain the editorial method, identity limitations and consented conversion attribution.

Two consolidated double-exposure prompt records failed the existing SEO-eligibility gate. Their individual old routes were not used as conversion cards: the men's selection uses **The Projectionist Is Me**, and the women's selection uses **An Outfit With a New Perspective**. Both articles retain links to the existing consolidated double-exposure guide. The two agreed primary prompt destinations remain unchanged and eligible.

## Primary conversion destinations

| Article | Primary CTA | Destination | Funnel click event |
| --- | --- | --- | --- |
| How to Create AI Photos With ChatGPT Using Your Own Photo | Try City Lights | `/ai-prompts/men/city-lights-main-character-energy` | `blog_prompt_click`, `destination_type=prompt` |
| How to Keep Your Face the Same in AI-Generated Photos | Try an identity-aware look | `/ai-prompts/men/change-the-scene-keep-yourself` | `blog_prompt_click`, `destination_type=prompt` |
| AI Photo Ideas for Men That Are Actually Worth Trying | Explore men's photo ideas | `/ai-prompts/men` | `blog_collection_click`, `destination_type=category` |
| AI Photo Ideas for Women That Are Actually Worth Trying | Explore women's photo ideas | `/ai-prompts/women` | `blog_collection_click`, `destination_type=category` |
| AI Couple Photo Ideas for Instagram | Explore couple photo ideas | `/ai-prompts/couple` | `blog_collection_click`, `destination_type=category` |

The primary conversion is stored separately from example-card CTAs. Example cards and inline destination links are secondary; the final primary CTA carries `cta_role=primary`. `blog_cta_click` also measures CTA placement but should not be added to the funnel click count, because the same action already emits a prompt/collection event.

## Analytics: entering and using PicMagic

The existing consent-aware analytics abstraction measures:

`blog_view → blog_prompt_click / blog_collection_click → prompt_view → prompt_copy`

Validated properties carry `article_slug`, `destination_path`, `destination_type`, `cta_role`, `cta_location` and coarse `entry_source`. Prompt-view/copy events automatically inherit the originating article and CTA after a blog conversion click. Attribution lives in optional sessionStorage for up to 30 minutes; category browsing does not require a new visitor identifier. Private preview/admin navigation, withdrawn consent and expired state clear attribution. `blog_share` and once-per-view 25/50/75/100% `blog_scroll_depth` events are also available.

For a future authorized analytics configuration, register the content/funnel properties as event-scoped dimensions and create a funnel exploration. Start with `blog_view` where `entry_source=organic_search`, then the two conversion-click event names, then attributed `prompt_view`, then attributed `prompt_copy`. Break down by article and primary/secondary CTA. Use existing GA session/source reporting alongside this coarse classification; do not count `blog_cta_click` again. No analytics account changes were made in this batch.

Limits: consent refusal, blocked vendors/storage, missing referrers, a new browser tab/session, expiry and cross-device browsing can prevent attribution. “organic_search” is a conservative classification of recognized search referrer hosts, not verified Search Console attribution or a complete AI-search cohort. GA's existing session measurement remains in use. No additional visitor ID, personal information, photographs, raw referrer queries, search text, article text or private paths are added. `prompt_copy` demonstrates use of PicMagic's copy action; it does not prove generation in an external tool.

## Local review

Use Node 24 or a compatible current runtime; the default shell Node 20 cannot run the installed jsdom/undici test dependencies.

```sh
PATH=/opt/homebrew/opt/node@24/bin:$PATH node scripts/blog-seed-preview.mjs
```

The preview listens only on `127.0.0.1:4312`, uses seed data, blanks backend credentials, disables analytics/ads/indexing and requires development mode. Open:

- `http://localhost:4312/blog-preview/create-ai-photos-with-chatgpt`
- `http://localhost:4312/blog-preview/keep-your-face-the-same-in-ai-photos`
- `http://localhost:4312/blog-preview/ai-photo-ideas-for-men`
- `http://localhost:4312/blog-preview/ai-photo-ideas-for-women`
- `http://localhost:4312/blog-preview/ai-couple-photo-ideas-for-instagram`

Normal `/blog/[slug]` URLs still return 404 for those drafts. Sharing and article measurement are disabled in previews. Stop the preview with Ctrl-C.

For admin QA, use the existing private `.env.qa` local account and the migration-tested disposable backend. `scripts/blog-local-fixtures.ts` is restricted to `127.0.0.1:54421`; its default mode seeds private drafts and removes the five known public QA fixture IDs and the explicit admin-test slug prefix. `--public-fixtures` is only for browser tests. The full-state read-only checker is `check:blog-release`; remote inspection requires the explicit `--authorized-production-read` flag and owner authorization. It must not be run remotely as part of this unreleased batch.

See `QA.md` for final verification evidence, `RESEARCH.md` for qualitative topic research and gap decisions, and `ROADMAP.md` for future clusters and Lab evidence requirements.

## Future release checklist — requires explicit approval

1. Obtain approval for code release, production migration/content import and the exact articles to publish. A Netlify reset is not authorization.
2. Inspect production branch, branch deploy/preview controls, CI, open PRs, hooks and current allowance before any push. Keep auto-recharge and additional purchases unchanged; do not open a PR automatically.
3. Review all five drafts and their public assets, primary destinations, external source currency and canonical ownership. Resolve temporary noindex exceptions; do not leave permanent orphans.
4. Re-run local checks and the production-build browser suite. Apply the reviewed migration and import only the approved records after production data authorization; preserve 95 prompt drafts and existing catalogue/homepage order.
5. Use the authenticated import revalidation handoff for both catalogue and blog. Validate publication/discovery, canonical metadata, sitemap and structured data. Batch code release once; keep advertising disabled.
6. Perform minimal live smoke checks only after release approval. Search Console indexing requests, AdSense review, experiment generation and scheduled publication are separate actions and are not authorized here.
