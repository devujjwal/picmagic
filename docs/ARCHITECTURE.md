# Architecture

Next.js App Router server components render the public library. Small client components handle saves, copy/share, guided creators, search interactions, and consent. Tailwind and semantic CSS tokens share the same visual system. Next/Image delivers responsive images with explicit geometry.

## Content boundary

`ContentRepository` separates `SeedRepository` from `SupabaseRepository`. The environment selects exactly one. The catalog is cached for an hour and tagged `catalog`; successful administrator writes expire the tag and invalidate dependent routes. Transient revalidation failures preserve existing cached content; uncached requests show the error UI. A production outage cannot resurrect seeds.

Photo and photo-edit records own `/ai-prompts/{primary-category}/{slug}`. Reels own `/reel-prompts/{slug}`. Curated groupings own `/collections/{slug}`. Database canonical-path uniqueness and redirect triggers protect this separation. Collection membership never creates another prompt URL. Categories have stable identifiers; collections are the editorial home for styles/subcategories/seasonal groups.

Tables: categories, prompts, tags, prompt_tags, collections, collection_prompts, admin_users, and content_redirects. Prompt tags are synchronized transactionally by a database trigger. Collection metadata and membership are saved through an authorized transaction. Public reads are limited by RLS to published records and active groupings; writes require authenticated admin membership.

## Generators

`PromptGenerationProvider` defines photo, photo-edit, reel and improvement methods. `TemplatePromptProvider` uses Zod inputs and literal interpolation; no eval, network requests or paid APIs. Reel scenes partition the chosen duration. Identity language is a request to the external model, never a guarantee.

`ImageGenerationProvider` is an inactive future interface. A future remote prompt or image provider needs server-only keys, the same validated inputs, a distributed host-level rate limit, request-size limits, timeouts, provider spend limits and abuse controls. Do not treat a per-process in-memory counter as a production rate limiter. No public generation endpoint exists in V1.

## Public state and privacy

Saved IDs and recently viewed IDs use localStorage with schema checks and an in-memory failure mode. Public accounts and syncing are absent. Session depth uses sessionStorage, never fingerprinting. Analytics accepts only typed, bounded non-sensitive properties; no raw prompt text or search query is sent.

## Administration

Supabase SSR cookies are refreshed only on admin paths. Each protected server page/action checks `getUser()` plus admin membership. RLS repeats authorization at the database. Uploads check session, role, origin, MIME, byte size and decoded dimensions, strip metadata through re-encoding, and use random immutable object names. The public preview bucket is explicitly unsuitable for private uploads. No service-role key is used by application clients.

## SEO

Metadata, canonicals and structured data share central helpers. Indexability requires published content and editorial opt-in; collections also require substantive copy and at least four published prompts. The sitemap excludes private and thin state. Admin/search/saved previews are noindex but are not hidden from crawlers using robots disallow alone. OpenGraph cards use the corresponding prompt image, title and branding.

## Content and asset workflow

`content/prompts.json` is the initial 50-record dataset. `content/image-provenance.json` is the diversity brief and generated-source manifest. Built-in imagegen creates separate original assets; `scripts/ingest-image.mjs` makes WebP previews and thumbnails. Images are inspected individually and as a contact sheet. The authoring script is a bootstrap aid; do not rerun it over edited production content or the completed provenance manifest.

## Operational constraints

A noindex seed-mode preview is for development only. Production needs the real Supabase project, operator contact details, domain DNS/HTTPS, and successful launch checks. Free-tier usage limits are operational constraints, not performance guarantees. Neither Search Console indexing nor field Core Web Vitals can be guaranteed before real crawling and traffic.
