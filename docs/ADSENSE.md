# PicMagic advertising

AdSense account: `devujjwal1989@gmail.com`, publisher `pub-4114304022167819`. Publisher and slot IDs are public identifiers, not credentials.

On 10 September 2026, PicMagic was added to AdSense, Google verified ownership through the live `google-adsense-account` metadata, and the site review was requested. The latest observed site status is **Getting ready**, not Ready. Google must approve the site before ads can serve; integration being enabled does not mean approval, filled inventory or revenue is guaranteed.

The authorized seller record is served at `https://picmagic.in/ads.txt`:

```text
google.com, pub-4114304022167819, DIRECT, f08c47fec0942fa0
```

## Placements

| AdSense unit | Slot ID | PicMagic placements |
| --- | --- | --- |
| PicMagic Discovery | 2111918706 | Homepage feed and category listings |
| PicMagic Prompt Detail | 8048334764 | One inline placement on prompt details |
| PicMagic Reels | 5859592023 | Reel discovery |

All three units are responsive display ads. Auto ads are off, so Google does not insert fullscreen, sticky or text-link ad formats. The top-of-detail and related-feed placements remain unconfigured to keep the initial ad density modest. Creators, search, saved state and admin pages contain no ad units. The loader is restricted to editorial discovery/detail routes. Preview and branch deployments explicitly disable ads.

## Consent and privacy

Google's certified European regulations message is published for PicMagic, with Consent, Do not consent and Manage options, English plus 31 additional languages, the PicMagic site name and `https://picmagic.in/privacy`. Consent-message optimization is off so the selected choices remain consistent. Google's onboarding option also establishes this three-choice default for future sites in the account.

PicMagic's own advertising permission is stored separately from analytics in `picmagic:advertising-consent:v1`; old analytics consent does not authorize ads. Ads load only after this permission. Google's AdSense tag then delivers its regional CMP message and applies Google's consent requirements. Google's revocation link and PicMagic's Cookie preferences provide ways to revisit choices. Rejection or unavailable storage prevents the tag from loading; withdrawal reloads the page to stop loaded integrations, including when changed in another tab. GA4 remains disabled.

Ad units initialize only after entering the viewport margin and after the actual `ins` element is committed. Duplicate effect runs do not request the same unit twice. Do not click live ads when testing; browser tests stub Google's script and do not create ad impressions.

## Operations

Netlify's production context stores `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_AD_SLOTS` and `NEXT_PUBLIC_ADS_ENABLED`. Public environment changes require a new build. Push to `main` to run the verified deployment pipeline. To disable advertising, set `NEXT_PUBLIC_ADS_ENABLED=false` in Netlify and redeploy; keep the ownership metadata and `ads.txt` available.

Check AdSense **Sites → picmagic.in** for the review result and ads.txt status. A submitted review is not approval. If Google requests changes, address the stated issues and request review again when eligible. Once Ready, verify ad fill, Google's regional consent message and revocation control, mobile layout, console/CSP errors and performance using ordinary traffic. Do not treat local tests as proof of Google's future ad fill or consent-message delivery in every region.

Repeat the isolated browser checks with `E2E_ADS_ENABLED=true E2E_BASE_URL=https://picmagic.in pnpm exec playwright test tests/e2e/ads.spec.ts`. The checks cover consent, revocation, excluded routes and blocked storage using a stub ad script.

Automatic hosting purchases, paid upgrades and visitor AI generation remain disabled. AdSense is publisher monetization; no Google Ads advertiser campaign was created.
