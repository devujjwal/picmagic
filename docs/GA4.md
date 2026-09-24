# PicMagic GA4 activation

Live on 10 September 2026: the owner completed legal acceptance and created PicMagic’s account, property and web stream. Production is configured to use the real measurement ID below. The existing consent-based implementation is unchanged; the deployment and live checks are recorded below.

## Dedicated property

- Account: PicMagic, `407519981`.
- Property: PicMagic – GA4, `553531149`.
- Web stream: PicMagic, `15753357674`, `https://picmagic.in`.
- Measurement ID: **`G-DY3MC34E0S`** (public, not a secret).
- Dashboard: https://analytics.google.com/analytics/web/?authuser=1#/a407519981p553531149/reports/intelligenthome
- Reporting time zone/currency prepared during setup: India, GMT+05:30 / INR.
- Enhanced Measurement: turned off to avoid duplicate history page views and automatic collection of search/form text. The application supplies sanitized page views and feature events.
- Google signals and user-provided data collection: off. Analytics advertising personalization disabled; AdSense consent remains independent.

`netlify.toml` owns `NEXT_PUBLIC_GA_ID` in the **production** context. Preview and branch contexts explicitly leave it blank. Do not add a duplicate inline tag or a second Google Tag Manager container. No Analytics 360 upgrade, paid campaign or purchase is required.

## Verified release

- Application commit: `9ffb852a08a40436f59939efdba0812bb450e211`.
- Netlify production deploy: `6aa2adb5aa15110008581ff9`, published September 10, 2026 at 13:17:42 UTC. One production deployment for activation.
- Local validation: lint, TypeScript, 69 unit tests, four desktop/mobile analytics journeys and an isolated production build using the issued measurement ID passed.
- Real Google collection verified at 13:19:56 UTC: `page_view` and `prompt_save` both received HTTP 204 from Google Analytics for `G-DY3MC34E0S`. Page location was `https://picmagic.in/`; the diagnostic query string was excluded.
- No GA script or collection before consent or after initial rejection. After withdrawal, the reloaded page contained no GA script. Zero CSP violations. Ads were blocked in the verification browser to avoid test ad impressions.
- Google's Realtime interface initially still showed zero users. HTTP 204 confirms successful collection transport, not finished report processing; the new-property report can lag. Recheck the linked dashboard without redeploying.
- On 24 September 2026, a fresh production session enabled analytics through PicMagic's privacy controls and GA4 Realtime immediately showed one active user from India. The measurement ID and data stream therefore require no dashboard correction; the standard Home setup warning is stale until processed reporting catches up.

## Release verification procedure

Before release, run the existing local analytics browser journeys with a stubbed Google library and confirm the production build. After release, verify no GA requests before analytics consent, successful real Google collection after consent, sanitized page views and a feature event, and rejection/revocation. Inspect Realtime for receipt; the setup warning and standard reports can lag behind actual collection. Do not treat a stubbed test as proof of Google receipt.

## Measurement behavior

Analytics consent is stored under `picmagic:analytics-consent`. Advertising consent is controlled separately by Google’s CMP; see [AdSense operations](ADSENSE.md). Blocked or unavailable storage prevents collection. Cookie preferences and cross-tab changes support withdrawal; the page reloads to stop previously loaded integrations.

The September 24 SEO branch adds a visible first-visit choice for optional analytics; the choice previously existed only in footer preferences. The historical reporting gap's cause is not established. Collection remains off by default. Consented sessions also send sanitized `web_vital` events for field LCP, INP, CLS, FCP and TTFB monitoring; these events contain metric identifiers and values, never prompt text, search text or query strings.

## Search Console and Web Vitals — 24 September 2026

With explicit owner confirmation, the verified `picmagic.in` domain property was linked to the PicMagic web stream. The Queries and Google organic search traffic reports are available in GA4. The organic report already displays Search Console history: 6 clicks and 112 impressions for 27 August–23 September. This is imported historical search data, not proof of new GA4 visitor collection or an SEO gain.

Event-scoped custom definitions created: **Web Vital name** (`metric_name`), **Web Vital rating** (`metric_rating`), and custom metric **Web Vital value** (`metric_value`, Standard). Filter by metric name before interpreting values: timing metrics are milliseconds and CLS is multiplied by 1000. Do not aggregate different metric names or register the high-cardinality metric ID as a custom dimension. Processing of newly collected events may lag; consent remains mandatory.

The adapter sends one page view per public route transition and typed feature events. Query strings, URL fragments, search text, generated prompt text and arbitrary event properties are excluded. External referrers are reduced to their origin. Admin routes are excluded. Session-depth milestones are deduplicated using optional sessionStorage only after analytics consent. Google signals and advertising personalization are disabled in the Analytics tag configuration. The analytics adapter never changes advertising-storage or personalization consent; Google’s publisher CMP owns advertising signals.

## Validation and rollback

Local browser tests stub Google's library and use an isolated seed-mode production build with the synthetic `G-TEST12345` identifier; they do not establish receipt by a real Google property. Run `E2E_GA_ENABLED=true E2E_BASE_URL=http://localhost:4315 pnpm exec playwright test tests/e2e/analytics.spec.ts` against that build. Run lint, typecheck and unit tests normally.

To disable GA4, set `NEXT_PUBLIC_GA_ID = ""` under `[context.production.environment]` in `netlify.toml` and publish one reviewed release. File-based values take precedence over dashboard values, so clearing only a dashboard variable will not disable it. Existing pages already open in a browser can retain their loaded script until reload or consent withdrawal. No automatic purchases are enabled by this integration.

References: [GA4 manual page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views), [Google tag privacy controls](https://developers.google.com/tag-platform/security/guides/privacy).
