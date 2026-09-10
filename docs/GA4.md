# PicMagic GA4 activation

Activation configuration on 10 September 2026: the owner completed legal acceptance and created PicMagic’s account, property and web stream. Production is configured to use the real measurement ID below. The existing consent-based implementation is unchanged; release completion requires the live checks recorded after deployment.

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

## Release verification

Before release, run the existing local analytics browser journeys with a stubbed Google library and confirm the production build. After release, verify no GA requests before analytics consent, successful real Google collection after consent, sanitized page views and a feature event, and rejection/revocation. Inspect Realtime for receipt; the setup warning and standard reports can lag behind actual collection. Do not treat a stubbed test as proof of Google receipt.

## Measurement behavior

Analytics consent is stored under `picmagic:analytics-consent`. Advertising consent is controlled separately by Google’s CMP; see [AdSense operations](ADSENSE.md). Blocked or unavailable storage prevents collection. Cookie preferences and cross-tab changes support withdrawal; the page reloads to stop previously loaded integrations.

The adapter sends one page view per public route transition and typed feature events. Query strings, URL fragments, search text, generated prompt text and arbitrary event properties are excluded. External referrers are reduced to their origin. Admin routes are excluded. Session-depth milestones are deduplicated using optional sessionStorage only after analytics consent. Google signals and advertising personalization are disabled in the Analytics tag configuration. The analytics adapter never changes advertising-storage or personalization consent; Google’s publisher CMP owns advertising signals.

## Validation and rollback

Local browser tests stub Google's library and use an isolated seed-mode production build with the synthetic `G-TEST12345` identifier; they do not establish receipt by a real Google property. Run `E2E_GA_ENABLED=true E2E_BASE_URL=http://localhost:4315 pnpm exec playwright test tests/e2e/analytics.spec.ts` against that build. Run lint, typecheck and unit tests normally.

To disable GA4, set `NEXT_PUBLIC_GA_ID = ""` under `[context.production.environment]` in `netlify.toml` and publish one reviewed release. File-based values take precedence over dashboard values, so clearing only a dashboard variable will not disable it. Existing pages already open in a browser can retain their loaded script until reload or consent withdrawal. No automatic purchases are enabled by this integration.

References: [GA4 manual page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views), [Google tag privacy controls](https://developers.google.com/tag-platform/security/guides/privacy).
