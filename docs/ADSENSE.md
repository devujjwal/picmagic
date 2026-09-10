# PicMagic advertising

AdSense account: `devujjwal1989@gmail.com`, publisher `pub-4114304022167819`. Publisher and slot IDs are public identifiers, not credentials.

On 10 September 2026, PicMagic was added to AdSense, Google verified ownership through the live `google-adsense-account` metadata, and the site review was requested. The latest observed site status is **Getting ready**, not Ready. Google must approve the site before ads can serve; integration being enabled does not mean approval, filled inventory or revenue is guaranteed.

The authorized seller record is served at `https://picmagic.in/ads.txt`:

```text
google.com, pub-4114304022167819, DIRECT, f08c47fec0942fa0
```

## Placements

| AdSense unit           | Slot ID    | PicMagic placements                    |
| ---------------------- | ---------- | -------------------------------------- |
| PicMagic Discovery     | 2111918706 | Homepage feed and category listings    |
| PicMagic Prompt Detail | 8048334764 | One inline placement on prompt details |
| PicMagic Reels         | 5859592023 | Reel discovery                         |

All three units are responsive display ads. Auto optimize is off, including automatic experiments on PicMagic. Auto ads are off, so Google does not insert fullscreen, sticky or text-link ad formats. The top-of-detail and related-feed placements remain unconfigured to keep the initial ad density modest. Creators, search, saved state and admin pages contain no ad units. The loader is restricted to editorial discovery/detail routes. Preview and branch deployments explicitly disable ads.

## Consent and privacy

Google's certified European regulations message is published for PicMagic, with Consent, Do not consent and Manage options, English plus 31 additional languages, the PicMagic site name and `https://picmagic.in/privacy`. Consent-message optimization is off so the selected choices remain consistent. Google's onboarding option also establishes this three-choice default for future sites in the account.

Google's CMP is the single advertising-consent authority. The centralized controller loads the AdSense tag after interactivity on editorial routes, independently of PicMagic analytics consent. That tag deploys the published regional message. PicMagic does not manufacture TC/GPP strings, infer jurisdiction from language/timezone, or turn a rejected choice into a grant. Google's tag determines eligibility and the permitted mode from its actual CMP signals.

| CMP / configuration state                                         | Application behavior                                                                                     | Google-controlled outcome                                                               |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Appropriate personalization consent                               | Queue the visible configured slot without overriding consent                                             | Personalized ads where all requirements permit                                          |
| Personalization rejected, other relevant permissions present      | Keep inventory available; preserve CMP signals                                                           | Non-personalized ads where permitted                                                    |
| Cookie consent rejected                                           | Keep inventory available; preserve CMP signals                                                           | Eligible limited ads or no ad; **NPA is not a cookie-free fallback**                    |
| Required decision pending / CMP unavailable                       | Load the Google integration without fabricating a grant or choosing a mode                               | Google waits, restricts serving or serves an eligible limited ad under its requirements |
| Outside the regional message's scope                              | No PicMagic advertising popup or custom geography gate                                                   | Google applies regional settings and applicable opt-outs                                |
| Existing rejection from PicMagic's old banner                     | Load the CMP but pause ad requests until a new explicit TCF `useractioncomplete` replaces that rejection | A new rejection still permits only the modes Google supports; no automatic grant        |
| Disabled integration / missing slot / site not approved / no fill | No production placeholder advertisement                                                                  | Configured placements keep reserved space; unconfigured placements remain absent        |

The legacy `picmagic:advertising-consent:v1` key is read only to preserve an earlier rejection, never to authorize personalized ads. An old `yes` does not replace Google's consent. The migration hold does not time out or clear after merely loading old CMP data. In regions with no applicable TCF interaction, an old rejection remains paused; it cannot safely be reinterpreted as permission for cookie-using NPA. New CMP choices never write this legacy key. Cross-tab legacy rejections also pause subsequent requests.

Cookie preferences is a persistent footer control. It opens a compact preferences dialog on request, not a large automatic advertising popup. Advertising privacy choices use Google's documented `CONSENT_API_READY` callback queue and `showRevocationMessage()`. On a non-advertising public page this explicit action can load the tag to provide privacy controls, without adding ad units. Google's native regional US opt-out link remains enabled and is not overridden. If blocked, the control reports the failure without changing any stored choice.

Analytics remains an independent opt-in in this dialog. The GA4 loader stays off until `picmagic:analytics-consent=yes`; rejection/withdrawal disables it and reloads to stop an already loaded script, including cross-tab changes. Analytics code only writes `analytics_storage`, never advertising consent fields. Google CMP consent-mode integration is **off**, so it does not silently authorize PicMagic analytics. GA4 production activation remains pending the owner's Google terms acceptance and a real measurement ID.

Visible ad units initialize after viewport intersection and after their `ins` is committed. Each DOM node is queued once, including React Strict Mode. Slots reserve 280px with a 250px-high ad creative and responsive width; full-width expansion is disabled. Empty/unfilled slots retain their height, hide empty content and carry no fake ad. The advertisement label appears only when Google marks inventory filled. Never click live ads during testing.

### Account verification, 10 September 2026

- European regulations: **1 active** Google message; Consent / Do not consent / Manage options, English plus 31 languages. Google currently supports IAB TCF **2.3**. Consent-mode integration and device-characteristic special feature 2 are off.
- Brand safety → Content → Blocking controls → Ad serving: **Limited ads: Allowed** (invalid-traffic-detection cookies). Share full IP address with buyers: Blocked. These settings were inspected, not broadened.
- US regional opt-out message: `PicMagic US privacy choices`, PicMagic only, English, all current/future supported US states, Google's opt-out link and confirmation. Confirmed **Published** in Google’s dashboard. The unused logo is disabled. Google advises allowing up to an hour for propagation.
- Site approval remains **Getting ready**; ads.txt still shows **Not found** in the dashboard despite the live authorized seller file. Actual regional delivery, eligible modes and fill must be rechecked after approval/propagation.

### Requirements and sources

Google requires its certified TCF CMP framework for personalized serving in the EEA, UK and Switzerland. Non-personalized ads still require cookie consent where applicable. Limited ads can use delivery information and, when enabled, fraud-detection-only cookies/local storage; they are not a claim of zero data processing. The original TC string determines supported serving. See [publisher CMP requirements](https://support.google.com/adsense/answer/13554116), [TCF 2.3 publisher integration](https://support.google.com/adsense/answer/9804260), [limited ads](https://support.google.com/adsense/answer/14210870), [publisher ad-tag controls](https://support.google.com/adsense/answer/7670312) and [Google Privacy & Messaging API](https://developers.google.com/funding-choices/fc-api-docs).

## Operations

Netlify's production context stores `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_AD_SLOTS` and `NEXT_PUBLIC_ADS_ENABLED`. Public environment changes require a new build. Push to `main` to run the verified deployment pipeline. To disable advertising, set `NEXT_PUBLIC_ADS_ENABLED=false` in Netlify and redeploy; keep the ownership metadata and `ads.txt` available.

The live `ads.txt` returned HTTP 200 with the exact publisher record during verification. AdSense still displayed **Not found** on 10 September; its crawler has not yet reflected the deployed file. Check AdSense **Sites → picmagic.in** for the review result and ads.txt status. A submitted review is not approval. If Google requests changes, address the stated issues and request review again when eligible. Once Ready, verify ad fill, Google's regional consent message and revocation control, mobile layout, console/CSP errors and performance using ordinary traffic. Do not treat local tests as proof of Google's future ad fill or consent-message delivery in every region.

Repeat the isolated browser checks with `E2E_ADS_ENABLED=true E2E_BASE_URL=https://picmagic.in pnpm exec playwright test tests/e2e/ads.spec.ts`. The checks cover accepted, rejected, undecided, outside-region and failed CMP states; unchanged consent signals; legacy rejections; excluded routes; blocked PicMagic storage; accessible footer controls and reserved unfilled slots. They stub Google at the integration boundary and do not prove Google’s regional rendering or real ad fill.

Automatic hosting purchases, paid upgrades and visitor AI generation remain disabled. AdSense is publisher monetization; no Google Ads advertiser campaign was created.

## Refactor validation

The CMP refactor passed lint, typecheck, 60 unit tests, an isolated production build, and 20 desktop/mobile advertising/analytics journeys. Footer privacy controls passed axe checks; layouts at 320, 768, 1024 and 1440px had no horizontal overflow or browser exceptions, and Escape closed the native dialog. These are application integration tests with Google stubbed, not a certification of real ad serving. After production publication, verify the real Google CMP with `?fc=alwaysshow&fctype=gdpr` and the US preview with `?fc=alwaysshow&fctype=ccpa`, then recheck actual regional traffic after site approval.
