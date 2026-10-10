# Local affiliate system — Phases B–F

Local implementation completed 10 October 2026 on `codex/affiliate-phase-a`, based on `3861aff`. The owner approved local implementation of the Phase A shortlist. At that review point all changes were uncommitted and unpushed, and no program application, commercial agreement, production migration, affiliate activation or deployment had occurred. The owner subsequently approved one ordinary-link production release; see [release evidence](RELEASE.md) for its separate scope and outcome.

PicMagic still offers free discovery and copying. Recommendations lead to independent tools where visitors paste their prompt and upload their own permitted reference. PicMagic performs no image/video generation and introduces no paid dependency, tracking service or subscription.

## Implemented architecture

| Module                                                 | Responsibility                                                                                                                                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/affiliate/providers.ts`                       | Eight evidence-backed editorial fixtures: Fotor, getimg.ai, Photoroom, Adobe Photoshop and InVideo; ChatGPT, Gemini and Runway as ordinary options. No referral URLs or approvals |
| `lib/affiliate/schema.ts`                              | Application states, capability/access records, bounded metadata and separate explicit public projection                                                                           |
| `lib/affiliate/url-policy.ts`                          | Exact provider hosts, HTTPS, limited issued-token syntax, rejection of credentials, ports, redirect routes, nested destinations and prompt-prefill parameters                     |
| `lib/affiliate/registry.ts`                            | Server-only reader; tagged Supabase public RPC cache for five minutes; explicit local seeds; backend failures omit recommendations                                                |
| `lib/affiliate/recommendations.ts`                     | Deterministic intent/capability filtering, suitability/access/priority ordering and approval/verification/release gates                                                           |
| `lib/affiliate/tracking.ts`                            | Thin consent-aware GA4 wrapper; in-memory impression deduplication; native navigation survives tracking failures                                                                  |
| `components/affiliate/`                                | `AffiliateToolCard`, `AffiliateToolList`, `AffiliateDisclosure`, `RecommendedTools`, `CopyJourney` and `PromptCopyChooser`                                                        |
| `features/admin/affiliate/`                            | Authorized server action and provider editor                                                                                                                                      |
| `supabase/migrations/202610100001_affiliate_tools.sql` | Private RLS-protected records, verification-reset trigger and curated read-only public RPC                                                                                        |

The installed Next.js mutation, fetch-cache and invalidation guides were read. New provider caching uses tagged `fetch`, compatible with this application's current configuration, with immediate `updateTag` invalidation in the admin Server Action. Existing catalog/blog caches were preserved; there is no unrelated caching migration.

The SQL public projection explicitly enumerates permitted fields. It does not automatically expose future columns, approval notes, payout confirmations or the private exact-URL review field. Unapproved/unverified affiliate tokens are withheld. Every admin write calls the existing `requireAdmin()` before querying or mutating data; ordinary authenticated users and anonymous visitors cannot modify provider settings.

## Current provider and activation state

- Fotor, getimg.ai, Photoroom, Adobe and InVideo: **Application required**.
- ChatGPT, Gemini and Runway: **Unavailable** for a verified applicable cash program, while still usable as ordinary recommendations.
- Approved providers: **0**. Configured affiliate URLs: **0**. Submitted applications: **0**.
- `AFFILIATE_MONETIZATION_ENABLED` is a server-side release switch that defaults to false and is false in the local QA runner and example environment.

A monetized recommendation requires an enabled suitable provider, Approved status, recorded acceptance evidence, a program URL, confirmed Indian cash payout and content placement, an exact matching verified issued URL, verification within the previous 30 days and the explicit release switch. Otherwise a suitable provider uses its official ordinary URL or is omitted.

Changing the program, status or affiliate URL invalidates exact-link verification in the database and application. Save changes first; then separately review every redirect and confirm the exact saved URL. Public capability/access claims require fresh evidence review when edited. Claims and URL verification expire after 30 days; no automatic background job renews them.

The initial URL policy accepts only reviewed direct provider hosts. Shared-network tracking domains are deliberately not broadly allowed. Once a real campaign URL is issued, its exact network host/path, final provider destination and parameters require a campaign-specific policy review. Later link changes within that policy can be managed through admin without a deployment. New provider IDs can be saved as disabled research records, but cannot appear publicly until their domain policy is reviewed.

There is no redirect endpoint or server-side fetch of an admin-entered destination. Redirect review is manual, avoiding SSRF and per-visitor network calls. Issued URLs are used unchanged: no invented sub-IDs, UTM parameters, prompt-prefilling or visitor identifiers. Approved sub-ID support remains a later provider-specific decision after documentation establishes its exact mechanism.

## User experience and page scope

The shared photo/reel detail view keeps both existing copy buttons, Save, Share, suggested-tool text, collections, related content and editorial guidance. A successful copy reveals one dismissible inline chooser beside the button used; failure retains manual-copy instructions. No autofocus, blocking modal, forced redirect, automatic new tab or photograph transfer is introduced.

The post-copy chooser is compact on phones. The permanent “Create this look with AI” section presents up to three cards with descriptions and verified capability/access limitations. Free access, paid access, trials and unknown access are distinct. If any required capability needs payment, the tool cannot receive a free-access label. Ordinary-only modules explicitly state that PicMagic receives no referral commission.

Portrait/group matching requires reference-image editing. Product/fashion matching requires product photography and editing capabilities; the initial product list is Photoroom and getimg.ai. Animal/general-image concepts use text-to-image matching. Reel/video pages use “Turn this idea into a video,” suitable image-to-video tools and model-qualified duration/aspect notes. Runway precedes InVideo for clip generation; commission does not determine suitability. Longer/multi-scene reels are not promised as one generation.

Recommendations are server-rendered from cached local data; no recommendation API, LLM or logo download runs per visit. Plain tool names avoid licensing assumptions and external image requests. Public prompt routes pass recommendations only for published records. Admin and private prompt/article previews omit the modules.

The five existing article slugs receive a supplementary image-tool module after the primary PicMagic conversion section. Article bodies, source JSON, author records, canonical URLs, internal destinations and BlogPosting structured data are unchanged. The ChatGPT guide retains its primary ChatGPT workflow. No video cards are inserted into these image guides. No homepage, discovery ordering, grid, collection copy, prompt slug or sitemap change was made.

## Admin and disclosure

`/admin/affiliate-tools` is inside the existing protected admin. It supports add/edit, official/program/issued URLs, all six application states, capability access/limits, evidence URLs, photo/video relevance, enable/disable, priority, verification date and private acceptance/payout/placement review. Approval without the required evidence is rejected; arbitrary external domains are rejected. Disabling and re-enabling were verified against a fresh visitor page after completed admin writes.

Approved commercial links use `rel="sponsored noopener noreferrer"` with a new-tab label; ordinary links use `noopener noreferrer`. Monetized cards carry an Affiliate link label and visible commission disclosure. No fictional partnership, rating, review or endorsement is added. Terms explains conditional affiliate commissions and external pricing. Privacy explains manual external uploads, third-party attribution and optional outbound measurement. Advertising remains disabled.

## Analytics

| Event                       | Meaning                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `affiliate_tool_impression` | At least half the card is visible with analytics consent; deduplicated per provider/placement/page in memory |
| `affiliate_tool_click`      | Activation of Open Tool, including keyboard/modified clicks                                                  |
| `affiliate_outbound_click`  | Outbound navigation intent; not proof that the destination loaded or a purchase occurred                     |

Properties are `provider`, `prompt_type`, `placement`, `content_slug`, `destination_type` (`official` or `affiliate`) and `affiliate_enabled`. Values are bounded/sanitized by the existing analytics abstraction. Placements distinguish photo/reel detail, photo/reel copy chooser and blog article.

No prompts, photographs, identity, private selections, full outbound URLs, query strings or referral tokens are included. Rejected/unavailable storage produces no analytics events. Pre-consent interactions are not replayed; withdrawal stops tracking. Ordinary links emit `affiliate_enabled=false` and cannot be counted as revenue. Click and outbound events represent the same interaction at different stages and must not be summed as unique clicks.

No earnings dashboard or provider-report API was added. Actual commission figures must come from provider/network reports. Before monetization release, inspect the real GA4 stream's Enhanced Measurement settings: automatic outbound collection must be disabled or demonstrated not to collect raw referral URLs. The existing environment guidance already requires Enhanced Measurement off; this work did not change or verify the account setting. Browser stubs are not evidence of real account or regional advertising-consent behavior.

## Local validation

| Check                                                           | Result                                                                                                                                                                                       |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`                                                     | Passed, no warnings                                                                                                                                                                          |
| `pnpm typecheck`                                                | Passed with Next route type generation                                                                                                                                                       |
| Full Vitest suite                                               | 47 files, **300 tests passed**                                                                                                                                                               |
| Affiliate-focused suite after final public-projection hardening | **39 tests passed**                                                                                                                                                                          |
| Selected Playwright suite                                       | **54 desktop/mobile tests passed**, no skips: affiliate, public journey, analytics and prompt evidence                                                                                       |
| Expanded admin priority/persistence check                       | **2 additional desktop/mobile executions passed**; priority restored and providers re-enabled                                                                                                |
| Affiliate database tests                                        | **22 assertions passed**, rolled back: private access, writes, approval/URL/expiry gates, future-column exclusion and claim review                                                           |
| Fresh migration installation with the same database tests       | Passed inside a rolled-back disposable transaction                                                                                                                                           |
| Local production build                                          | Passed, including final schema/projection revision; no remote build                                                                                                                          |
| Responsive/visual/accessibility review                          | 1440px, 390px and 320px; no horizontal overflow; new tool section and existing full detail pass axe checks; native links can receive keyboard focus                                          |
| Preservation                                                    | Exact original five local blog rows restored, including timestamp precision; **95 prompt drafts** remain unpublished; eight provider rows have zero approved programs and zero referral URLs |
| Diff/format                                                     | `git diff --check` and scoped formatting check passed                                                                                                                                        |

The first browser pass caught Supabase's offset timestamp representation being rejected, which safely omitted recommendations. Offset-aware validation and a regression test corrected this. Admin QA waits for completed Server Action responses before testing cache invalidation. Generated Next type files/config changes were restored to normal repository paths after the isolated build.

Browser tests used an isolated production build on localhost:4315, the disposable Supabase backend at 127.0.0.1:54421 and stubbed Google/provider requests. The five local draft articles were temporarily exposed solely for contextual browser testing, then restored exactly. No production backend was queried or modified during implementation. Local test-only synthetic referral tokens were never navigated, activated or persisted outside rolled-back/unit fixtures.

[Performance summary](PERFORMANCE.json): one cold mobile Lighthouse comparison against a private archive of baseline HEAD `3861aff`, using the same local backend and route. Baseline/new performance scores were 95/97; accessibility, best practices and SEO were 100/100 in both. Baseline/new LCP was 2.966/2.675 seconds; CLS was 0/0 and TBT 36/24 milliseconds. No Google vendor requests were observed. This single lab pair shows no measured regression, not a field-CWV guarantee or proof of a causal improvement. LCP remains above 2.5 seconds in this throttled sample.

Raw logs, traces, original-row snapshots and screenshots remain gitignored under `.release-private/affiliate-qa/`. The baseline archive is also private. No screenshots, credentials, private identity references or recognizable test outputs were added to public assets or Git.

## Cost and release boundary

Additional fixed subscription cost is **₹0 within existing service allowances**. The implementation uses the existing hosting, database and GA4 abstraction, one small cached provider query and a small chooser/tracking controller. No package/dependency, paid generation, new database, affiliate SDK, pixel, background job, Redis or microservice was added. Network payout/FX fees may affect earnings and must be confirmed during onboarding.

At local implementation completion, the branch was `codex/affiliate-phase-a` and HEAD was `3861aff`. No commit, push, PR, main merge, release tag, build hook or deployment had been created. Netlify/account settings, advertising flags, production Supabase, homepage ordering, private references and social publishing were unchanged. The four pre-existing modified/untracked audit files listed in Phase A were preserved. Subsequent explicitly authorized production work is recorded separately in [RELEASE.md](RELEASE.md).

## Exact next steps to activate monetization

1. The owner chooses and submits applications using the [Phase A official links](PHASE-A.md). Start with Fotor/getimg.ai; add Photoroom for products, Adobe for a confirmed eligible creative SKU and InVideo for appropriate video workflows. Confirm Indian publisher acceptance, a supported cash payout method, thresholds/fees, eligible purchases, content-page placement and deep-link restrictions. No application has been submitted.
2. After actual acceptance, record the program URL, private acceptance evidence and payout/placement confirmations in admin. Mark Applied only after submission and Approved only after acceptance. Resolve Photoroom's exact Awin/Dub route without mixing offers; do not assume standalone Firefly eligibility.
3. Enter the issued URL without alteration. Review the actual tracking host/campaign policy where needed, every redirect, final destination and permitted parameters. Save first, then separately verify the exact saved URL. Do not self-refer, buy a subscription or purchase generation credits to test.
4. Review the implementation and obtain separate explicit production migration/release/activation authorization. Recheck production branch, branch/PR deploy controls, hooks/Actions/open PRs and remaining hosting allowance before any future push. Nothing in this implementation authorizes a release or automatic scheduling.
5. Under that future authorization, apply only the reviewed provider migration and provider records, keep existing content/drafts and ads state intact, verify the real GA4 Enhanced Measurement setting, and release the approved batch once. Only then enable the release switch and verified approved records. Ordinary recommendations continue to work independently of this switch.
6. Manually reverify changing capability/pricing and program evidence; reconcile earned/pending/refunded commission using the actual provider dashboard. Leave rejected, unavailable, expired or unverified referrals nonmonetized or hidden.

Local review commands, after preparing the disposable backend and reviewed migration:

```sh
node scripts/with-qa.mjs pnpm exec tsx scripts/affiliate-local-fixtures.ts
node scripts/with-qa.mjs node scripts/affiliate-local-run.mjs pnpm build
node scripts/with-qa.mjs node scripts/affiliate-local-run.mjs pnpm exec next start --hostname 127.0.0.1 --port 4315
```

For the contextual article browser suite, prepare `affiliate-local-blog-fixtures.ts` before building/testing and always run it with `--restore` afterward. It refuses a non-local backend and refuses to overwrite an unrecovered original-row snapshot. Admin mutation tests require the existing disposable `.env.qa` administrator; secrets remain private. No `supabase db push`, seed-to-production command or deployment command is part of local review.
