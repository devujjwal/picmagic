# PicMagic GA4 activation

Status on 10 September 2026: the website integration is implemented. Lint, typecheck, 52 unit tests, four desktop/mobile analytics journeys and an isolated production build passed. Production GA4 is still disabled. The dedicated Google Analytics account/property creation form is waiting for the owner's authorization to accept Google's India Terms of Service and Google Ads Data Processing Terms. No PicMagic measurement ID has been issued yet.

## Account setup prepared

- Account: PicMagic; property: PicMagic – GA4.
- Reporting time zone: India, GMT+05:30; currency: INR.
- Industry: Arts & entertainment; size: 1–10 employees.
- Objectives: traffic and engagement/retention.
- Optional Google account data-sharing options: off.

Complete account creation only after the owner confirms legal acceptance. Create a Web stream for `https://picmagic.in`, named PicMagic Web, and record its real measurement ID here. Do not use the unrelated property displayed when account setup began.

## Activation checklist

1. Disable Enhanced Measurement for the web stream. PicMagic supplies sanitized page views and feature events itself; automatic history page views would duplicate them, and automatic search/form events could collect visitor-entered text.
2. Leave Google signals and advertising personalization disabled; no Google Ads campaign or paid service is needed.
3. Set `NEXT_PUBLIC_GA_ID` to the issued `G-…` ID in the Netlify **production** context, then deploy the checked code. It is a public identifier, not a secret. Preview and branch deployment contexts explicitly leave it blank.
4. Verify the live site sends no Analytics script or requests before analytics consent, then verify sanitized page views and a real diagnostic copy/save event after consent. Check receipt in Realtime. Verify rejection, revocation, admin exclusion and unavailable storage.
5. Record account/property/stream IDs, deployment, actual Google request verification and Realtime evidence. Update README, launch and implementation status only after activation succeeds.

## Measurement behavior

Analytics consent is stored under `picmagic:analytics-consent`. Advertising consent is controlled separately by Google’s CMP; see [AdSense operations](ADSENSE.md). Blocked or unavailable storage prevents collection. Cookie preferences and cross-tab changes support withdrawal; the page reloads to stop previously loaded integrations.

The adapter sends one page view per public route transition and typed feature events. Query strings, URL fragments, search text, generated prompt text and arbitrary event properties are excluded. External referrers are reduced to their origin. Admin routes are excluded. Session-depth milestones are deduplicated using optional sessionStorage only after analytics consent. Google signals and advertising personalization are disabled in the Analytics tag configuration. The analytics adapter never changes advertising-storage or personalization consent; Google’s publisher CMP owns advertising signals.

## Validation and rollback

Local browser tests stub Google's library and use an isolated seed-mode production build with the synthetic `G-TEST12345` identifier; they do not establish receipt by a real Google property. Run `E2E_GA_ENABLED=true E2E_BASE_URL=http://localhost:4315 pnpm exec playwright test tests/e2e/analytics.spec.ts` against that build. Run lint, typecheck and unit tests normally.

To disable GA4, clear `NEXT_PUBLIC_GA_ID` in Netlify production and rebuild. Existing pages already open in a browser can retain their loaded script until reload or consent withdrawal. No automatic purchases are enabled by this integration.

References: [GA4 manual page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views), [Google tag privacy controls](https://developers.google.com/tag-platform/security/guides/privacy).
