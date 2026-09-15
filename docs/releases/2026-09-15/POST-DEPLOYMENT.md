# September 15 production release outcome

## Published release

- Commit: `941970750eaa0d7d77130fe11642c714f71769d8`
- Netlify deployment: `6aa8ea86fe41b30008dad05a`
- Published: September 15, 2026, 06:51:09 UTC / 12:21:09 IST.
- Canonical website: https://picmagic.in/
- Verified deployment alias: https://picmagic-in.netlify.app/
- Exactly one main push and one successful production deployment for this release. No additional deployment was used for these post-release reports.

## Content activation

The guarded transaction committed after all 32 preview/thumbnail assets returned HTTP 200 and matched the local SHA-256 hashes. It added 16 approved prompts, 20 collection memberships and one existing profile collection metadata update. No schema migrations were required. Production now contains 186 records: 91 published, 95 drafts. All pre-existing 170 prompt records were compared against the pre-release backup and remain identical, including the original 75 published records. No new homepage feature flags were enabled.

The authenticated admin cache invalidation returned HTTP 200 with `revalidated: true`. Authenticated `/admin` returned HTTP 200 with the admin page and no login redirect. Authentication reused the existing admin account; no access grants or security settings changed.

## Verification

All 36 HTTP checks in `live-pages.json` passed through the Netlify alias: homepage, photo discovery, Men, Women, Couple, Kids, Family, Wedding, Creative Transformations, Profile Picture / DP Ideas, enhance, create, reel discovery, search, saved, robots, the couple/Krishna regressions, all 16 new detail pages, sitemap and search API. Every new detail returned its expected title, canonical URL and OpenGraph image markup. All 16 canonical URLs appear in the sitemap and all 16 records appear in the 91-record public search catalogue.

Local checks before deployment passed: lint, typecheck, 135 unit tests, content/schema validation, release gate, production build and rolled-back database rehearsal. The browser suite initially passed 73/74; its one responsive image decode race was corrected in the test, and both desktop/mobile targeted rechecks passed. All 74 distinct journeys passed across those runs. All new details were reviewed at 375, 430 and 1440 pixels; automated accessibility checks found no violations in that suite. No new Lighthouse scores were measured for this release.

## Verification limits

The corporate network returned a Zscaler HTTP 403 for `picmagic.in`. Chrome also refused the Netlify detail URL with `ERR_BLOCKED_BY_CLIENT`; the external web reader could not open the custom-domain detail URLs. No security block was bypassed. Therefore live visual interaction and direct custom-domain browsing are **not verified from this environment**. Live verification above means deployed HTTP/content/asset checks through the Netlify alias, together with local visual/browser validation. A browser/network permitted to open the custom domain should complete that final visual check.

Existing deferred video generation and unapproved content remain deferred; this release does not claim to complete them.

## Budget and rollback

Before release, the account showed Personal with 1,000 plan credits and 25.1 operational credits available. Plan credits expire October 15, 2026; operational credits expire October 10. Auto-recharge was disabled. No billing settings, purchases or top-ups were performed. Those numbers are the pre-release observation, not a claim of remaining credits after the deploy.

Rollback deployment: `6aa38307ba1c570008d9ad04`, commit `fa768aa0a8c81cc36ef2de5fb8c9e887c82dc1ee`. The private pre-release database backup and after snapshot are retained under `.release-private/release-2026-09-15/`. Any content rollback must guard against subsequent edits, undo only this release's added IDs/memberships, restore the one collection's prior metadata and revalidate caches. Do not blindly overwrite the database. Existing assets can remain additive.

Future deployments still require a new explicit release instruction. These post-deployment reports are retained on the development branch without another push/build.
