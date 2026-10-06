# Local verification — 6 October 2026

No production writes, pushes, deployment or real article publication were performed. Tests used the disposable `picmagic-release-qa` Supabase instance and a loopback production build with Google advertising/analytics requests stubbed.

## Completed checks

- ESLint and TypeScript: pass.
- Unit suite: 44 files, 261 tests passed.
- Disposable database pgTAP: all 20 checks passed, rolled back. Covers anonymous/ordinary/admin RLS, publication dates, duplicate/redirect ownership, related-slug updates, temporary noindex requirements/expiry and review reversal.
- Content, SEO-content, release-content and five-draft blog checks: pass. Existing SEO advisory warnings remain informational; no invented performance baseline.
- Local production build: pass, using Node 24 and isolated `.next-blog-qa` output.
- Desktop blog browser suite: 7 passed. Includes direct and category organic-entry funnels through `prompt_copy`, consent denied/granted/revoked, no preview tracking, deduplicated scroll, admin structured editing/private preview/publication reversal, metadata/sitemaps and draft exclusion.
- Mobile blog browser suite: the same 7 checks passed under iPhone 13 emulation.
- Existing public navigation, consent analytics and official social link regression suite: 20 passed.
- Automated axe checks and horizontal-overflow checks covered the hub and all five article bodies at 320, 390, 768, 1024 and 1440px, with no violations.
- Actual seed draft layouts reviewed at 1440px and 390px. Lazy-loaded original previews all loaded, typed text and links remained readable, and keyboard focus reached links. Original 16-example asset contact sheet reviewed separately; no private reference photographs used.

## Reproduction and limits

Use the commands in `IMPLEMENTATION.md`. Browser fixtures require `E2E_BASE_URL=http://localhost:4311`, `E2E_BLOG_QA=true` and the guarded `scripts/with-qa.mjs` wrapper for local admin credentials. Keep vendor requests stubbed via the existing Playwright fixture.

Local tests establish behavior, not actual Google distribution, citations, real GA4 reporting or regional consent behavior. Future release requires explicit authorization and the separate release checklist. The five real drafts are private and require editorial approval before publication.

## Final local state

Temporary public fixtures and admin-test articles were removed after validation. The local editorial release checker passed with exactly five private draft records and zero noindex exceptions. The guarded fixture cleanup confirmed all 95 unpublished prompt drafts remain intact. Production is unchanged.
