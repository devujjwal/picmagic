# Pre-Review Readiness, 5 October 2026

## Decision

This is the pre-release readiness snapshot. The owner subsequently explicitly
approved the production release and scoped content sync; the completed database
sync and pre-push checks are recorded in `RELEASE.md`. The live code deployment
must still be confirmed after the single push. AdSense review is not authorized.

The reviewed remediation is implemented locally, not released. Do not request
AdSense review yet. Release authorization, conflict-free live content preflight
and post-release smoke checks are still required. Advertising stays disabled.
Actual regional consent and Auto ads/exclusion evidence remain unresolved before
separately approved advertising activation. Those activation gates are not a
claim that every consent check is a prerequisite imposed by Google for applying.

Google emphasizes original value and usable navigation; no local fix or test can
guarantee approval. [Official AdSense guidance](https://support.google.com/adsense/answer/7299563?hl=en)

## Resolved Locally

- Source framing, photographic first-dance identities, conditional hair, visible
  office hands, decade consistency, square/circular profile use and still/motion
  instructions are aligned.
- Nine history-backed date corrections retain exact provenance in
  `date-provenance.json`. Only re-reviewed guidance modules receive the October
  editorial date; neither change represents a new generation or test.
- The inclusive `/guides/double-exposure-fashion` has one complete copyable prompt,
  both existing fictional examples, preparation, checks and local repair advice.
  Proposed workflows and existing previews are clearly distinguished from tests.
- Both previous double-exposure paths and `/ai-prompts/cinematic` have static
  permanent Next.js redirects. Navigation/breadcrumbs/discovery point directly to
  destinations. Sources are excluded from sitemaps without database migrations.
- All 27 expand recommendations and the remaining similarity warnings received
  explicit editorial assessment in `EDITORIAL-DECISIONS.md`.
- No-script pagination/creator navigation and saved-source replacement discovery
  remain usable. Narrow-screen cross-links wrap rather than overflowing.

The catalog still stores 186 records, 91 published and 95 deferred drafts.
Public eligibility excludes the two archived sources: 89 prompt destinations,
72 photo discovery records and 17 reel records. No publication/indexability flags,
private reference assets, homepage ordering or unrelated drafts were activated.

## Local Verification

Final results are recorded in `REMEDIATION.md`. Tests use seed data, advertising
disabled and stubbed Google services, not production Supabase or regional Google
consent execution. The production build generates 144 pages. The public HTML
scan covers 138 responses: 134 HTML destinations and four redirects, including
the existing reel-category redirect. It checks canonical ownership, H1/title/
description, structured-data chronology, internal links and stale consolidated
paths. Changed pages are checked at 1280, 390 and 320 pixels; representative
workflows cover menu, category/filter navigation, search, copy, save/unsave,
pagination, creators, errors, no-JavaScript navigation and privacy choices.

The narrow analytics test rejects, reopens, allows, withdraws and reloads: the
stubbed GA script loads only after permission and is absent after withdrawal.
This proves the application path in the local test environment, not real vendor
cookies, collection or applicable regional CMP behavior.

## Actual Account And Live Evidence

Read-only inspection used the already signed-in Chrome account
`picmagic.ai@gmail.com` on 5 October. No access roles or account settings changed.

| Check                                      | Actual observation                                                                                                                              | Limitation / next check                                                                                                                                                    |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AdSense access                             | PicMagic Gmail selected; publisher `pub-4114304022167819`.                                                                                      | Access confirmed; no separate role-management audit.                                                                                                                       |
| Site status                                | `picmagic.in`: Needs attention, Low value content; last decision 3 October, 8:08 AM PDT.                                                        | No review requested and no claim that Google has reassessed this local batch.                                                                                              |
| Ads.txt / ownership                        | Sites table: Authorised ads.txt. Ownership drawer offers code, ads.txt and meta methods.                                                        | Authorised ads.txt is not an explicit verified-ownership success message; reconcile the accepted method before submitting.                                                 |
| Account notices                            | Home: payment profile complete and ads settings confirmed. Generic activation warning still says payment info/site connection needed.           | Record both signals; do not infer payment is incomplete solely from the generic banner.                                                                                    |
| European CMP                               | One published European-regulations message for picmagic.in, English plus 31 languages, dated 10 September; zero recorded messages/consent rate. | Publication is not observed EEA/UK/Swiss reject/reopen/withdrawal behavior.                                                                                                |
| US CMP                                     | Published PicMagic US privacy choices, en-US, 10 September; zero recorded messages/opt-outs.                                                    | Applicable regional execution was not available.                                                                                                                           |
| Auto ads / exclusions                      | By-site Ads page exposes table headings but no site row/settings in the inspected view.                                                         | Enabled state and page exclusions could not be verified. Nothing was enabled.                                                                                              |
| Search Console access                      | PicMagic Gmail accesses the picmagic.in domain property.                                                                                        | No permission changes needed or made.                                                                                                                                      |
| Homepage inspection                        | URL on Google, page indexed, HTTPS.                                                                                                             | This does not establish indexing of every content URL.                                                                                                                     |
| Corrected exposure-page inspection         | `/ai-prompts/professional/your-everyday-with-better-light`: URL unknown to Google, not on Google, no referring sitemap/crawl shown.             | Not a proved canonical defect; recheck after release. No indexing request submitted.                                                                                       |
| Live privacy                               | HTML privacy disclosure says ads disabled; footer remains a Cookie preferences fallback link, not an interactive button.                        | Live analytics rejection/reopening/withdrawal could not be exercised in this session.                                                                                      |
| Script availability in this Chrome context | Opening the page-referenced `/_next/static/chunks/0-3_0x72d6wh_.js` reports `net::ERR_BLOCKED_BY_CLIENT`.                                       | This is client/network-context evidence, not a proved server 403 or worldwide outage. No security bypass or extension changes. Retest on an ordinary permitted connection. |

No actual EEA/UK/Swiss or applicable US regional connection was available. No
synthetic geolocation, headers, local stubs or CMP publication status are counted
as live regional evidence. Optional analytics on the live site remains
unverified. Historical video provenance and bounded trial limitations remain
unchanged; this batch generated no new images or videos.

## Prepared Release, Not Applied

`release-revisions.json` describes 27 reviewed published prompt records and four
category descriptions against baseline `c21f970`. `release-preview.sql` locks
each targeted row, normalizes timestamp/JSON fields through database row types,
checks protected identity/publication/assets and each edited field against its
before or already-applied after value, and aborts on conflicts. Writes are only
the approved columns; no catalog overwrite, insertion, deletion or flag change.
The file ends with `ROLLBACK`, not `COMMIT`.

The SQL was exercised in a newly initialized socket-only disposable PostgreSQL
database: preview rollback, exact fields/dates, idempotency, untouched draft,
late-conflict rollback and protected-field conflict all passed. This is not a
production preflight, production schema/RLS check or authority to apply it.

After explicit owner release approval:

1. Inspect remaining hosting allowance and production content/schema. Regenerate
   the manifest if the reviewed local scope changed. Run the rollback preflight
   in an authorized SQL session; resolve any before/after conflict rather than
   weakening guards. Preserve all drafts and unrelated live changes.
2. Apply only the reviewed transactional content sync and release the validated
   code batch once, with advertising disabled. No incremental deployment loop.
3. Perform minimal live smoke checks: three 308 redirects, guide/images/copy,
   collection/breadcrumbs, sitemap sources/destination, representative mobile
   search/save/creator and corrected chronology. Recheck selected Search Console
   URLs; a new guide cannot be verified as indexed before release.
4. Obtain live permitted-connection privacy evidence and actual applicable
   regional CMP/Auto ads exclusions before separately approving ad activation.
5. Reconcile ownership/account notices and make a separate review decision. Do
   not automatically click the fixed-issues checkbox or Request review.

At the time of this original readiness snapshot, no commits, pushes, deployments,
production content/Storage writes, billing changes, advertising activation or
AdSense review submission had occurred. See `RELEASE.md` for the subsequently
authorized release steps; the advertising and review holds remain in force.
