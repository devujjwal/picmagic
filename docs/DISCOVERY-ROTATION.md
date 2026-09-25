# Visit-based discovery rotation

Implementation on `codex/discovery-rotation`. The owner approved production
activation and default-on visit memory on 25 September 2026. See the release
preflight and post-release report for actual deployment status.

## Configuration

Set the server environment variable `PICMAGIC_DISCOVERY_ROTATION_ENABLED=true`
when building/starting a local seed-content preview. It is deliberately false
when absent. Production activation uses the owner-approved production-context
environment variable across builds/functions/runtime. Future activation changes
still require rollout and privacy review. No migration, content
sync, paid API, image generation or background task is needed.

The kill switch suppresses rotation, the preference form and cookie writes.
Existing discovery cookies are ignored, not repurposed for analytics.

## Invariants

- `orderForDiscovery`, `getCatalog`, publication, ranks and featured flags are unchanged.
- Only Home and root `/ai-prompts` use the new pure selectors. Categories,
  collections, search, related prompts and reels keep their relevance rules.
- Both selectors require SEO/editorial eligibility and approved photo/edit previews.
- Home default: the existing twelve featured concepts, deduplicated by asset.
  Returning variants: one rank-cycling featured hero, four featured cards, seven
  broader creative concepts. IDs and preview assets cannot repeat in the selection.
  Selected IDs/assets are excluded from the recent rail before its four-card
  limit. Other eligible recently viewed reels remain available in that rail.
- Explore: canonical sorting, then 24-record partitions, then independent creative
  and utility lane rotation. No cross-page movement. Small lanes degrade gracefully.
- Every deck is deterministic; category, declared subject and first style are
  balanced with editorial rank/ID tie-breaks. Unknown subjects stay unknown.
- The initial HTML and ItemList share exactly the same ordering. No browser shuffle,
  timers, seed URL parameters, bot detection or duplicated prompt text payload.
- Only the selected Home hero receives Next.js 16's responsive image preload;
  `PreviewImage` exposes an opt-in `preload` prop. Other images retain their
  existing eager/high-priority or lazy-loading behaviour. The entire hero pool
  is never preloaded. This was retained after the local LCP comparison improved.
- An open feed keeps its supplied lean-card snapshot. A different route, page,
  snapshot/order or preference remounts the append-only feed at one batch.
- Shared catalogue caching remains separate from visit state. Nonce-bearing HTML
  remains `private, no-store`; never make it publicly cacheable.

## Visit lifecycle and privacy boundary

`picmagic-discovery` contains `version.enabled.counter.lastNavigationMinute`.
The counter is bounded to 0–4095; zero means editorial default. Expiry is 30 days,
rolling with public navigation. It is host-only, HttpOnly, SameSite=Lax, and Secure
in production. There is no UUID, history list or account linkage. Minute rounding
means the idle boundary has up to one minute of granularity.

- Missing, expired or invalid memory starts at zero.
- Public GET page navigations refresh the coarse timestamp.
- Home or Explore page one after thirty idle minutes advances once.
- Direct later-page visits refresh activity without advancing.
- HEAD, APIs, assets, admin and speculative prefetches never update memory.
- An active visit retains its order. Back/forward restoration retains the cached
  presentation; a normal later navigation can use updated shared cookie state.
- Tabs may share a variation. No per-tab identity or race-serialized server state.
- Blocked cookies yield the editorial default. Turning off retains an off cookie
  and returns to editorial ordering. The control is a native Server Action form,
  usable without JavaScript; return destinations and values are allowlisted.

Default-on first-party storage is **not declared legally exempt**. Before activation,
review applicable privacy/consent requirements and approve or replace this design.
The privacy page discloses this behaviour only while the feature is enabled.
The setting is independent of analytics/ad consent, and its data is not sent in
GA4 events or advertising payloads.

## Next.js 16 integration detail

`skipProxyUrlNormalize: true` preserves Flight/prefetch headers for the activity
guard. Skipping the entire Proxy via a prefetch matcher would also skip CSP, so
Proxy continues to handle those requests but does not touch discovery memory.
An incoming internal rotation header is always removed/overwritten. Proxy forwards
the validated updated cookie before rendering. Server Components read that cookie,
not the diagnostic header, so a Server Action's freshly changed choice is also
visible during its render. Existing CSP and admin authentication remain intact.

## Local verification

Use Node 22, the repository's installed packages, `CONTENT_SOURCE=seed`, and a
separate `PICMAGIC_DIST_DIR` under `.release-private/`. All browser tests stub
Google services. Do not use production traffic for these tests.

```sh
pnpm exec vitest run --maxWorkers=2
E2E_BASE_URL=http://127.0.0.1:3075 PICMAGIC_DISCOVERY_ROTATION_ENABLED=true \
  pnpm exec playwright test tests/e2e/discovery-rotation.spec.ts \
  tests/e2e/editorial.spec.ts tests/e2e/csp.spec.ts \
  tests/e2e/navigation-budget.spec.ts --workers=1
```

Also run the disabled-rollout test against a runtime with the flag false. Use
different Playwright `--output` paths when running separate commands concurrently.
`DISCOVERY_CAPTURE=true` saves private hero screenshots at 320/375/768/1440px.

`node scripts/discovery-performance.mjs` compares localhost baseline/candidate
builds with three interleaved cold mobile runs and writes private results.
`DISCOVERY_BENCH_RUNS=5` enables a five-run comparison. Both origins are validated
as localhost; the script neither deploys nor installs anything.
Use `DISCOVERY_BENCH_LABEL` to preserve separately named reports and
`DISCOVERY_HOME_ONLY=true` for a targeted hero-loading experiment.

## Release gates

1. Owner approval for default-on memory or a revised consent design.
2. Repeatable local performance acceptance, including the selected hero assets;
   local lab measurements do not certify field CWV.
3. Review selected variations and retain existing consent/ad-surface restrictions.
4. Separate production release authorization and hosting allowance check.

This feature does not resolve AdSense low-value-content findings, publish drafts,
release the pending AdSense batch or authorize an AdSense review request.
