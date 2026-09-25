# Discovery rotation — local acceptance evidence

Date: 25 September 2026. Baseline: `853559a`. Implementation branch:
`codex/discovery-rotation`. No commit, push, database change or deployment was
performed for this implementation. Production activation remains unapproved.

## Scope and correctness

- Current repository: 186 prompts, 91 published, 95 drafts; 74 eligible photo/edit
  prompts partitioned into 24/24/24/2. Home has 36 eligible creative concepts,
  including 12 featured hero candidates.
- Stable canonical Explore page membership, deterministic ordering, independent
  creative/utility lanes, eligibility and duplicate protection are covered by tests.
- Unit freshness checks cover 144 consecutive variations: changing featured hero
  and at least four changed lower Home cards on the current catalogue. Explore
  leading-card freshness is checked where its lane has sufficient members.
- No prompt records, preview assets, publication flags, canonical URLs, database
  schemas or `orderForDiscovery` rules changed.
- Feature is off unless the server explicitly sets
  `PICMAGIC_DISCOVERY_ROTATION_ENABLED=true`. No production setting was changed.

## Validation

| Check                                                | Result                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| Unit suite                                           | 33 files, 195 tests passed                                   |
| Production build with local seed content             | Passed, including TypeScript                                 |
| Content validation                                   | 186 prompts; zero missing published preview files            |
| SEO content validation                               | 91 eligible prompts; zero errors; 42 existing review notices |
| Enabled integration run with Google services stubbed | 50 passed; 2 disabled-feature cases skipped                  |
| Disabled runtime checks                              | 2 passed                                                     |
| Final discovery run after hero preload change        | 28 passed; 2 disabled-feature cases skipped                  |

Browser coverage includes desktop/mobile, real document and RSC navigation,
prefetch/HEAD exclusions, CSP, cookie corruption/expiry/off states, native
keyboard and JavaScript-disabled preference forms, canonical/ItemList order,
74-record append-only pagination, feed reset and recent-rail duplicate protection.
The combined advertising/analytics run exercised consent and ad-surface boundaries
with test services, not real geographic CMP behaviour. Existing GA event tests
also check that discovery cookie state is absent from queued event payloads.

All 12 hero candidates were captured and inspected at 320, 375, 768 and 1440 px.
No horizontal overflow was detected. Only the selected hero has a responsive
image preload; the hero pool is not preloaded. Screenshot and raw measurement
artifacts remain in gitignored `.release-private/discovery-qa/`.

## Performance evidence and limitations

All measurements used local production builds, seed content and blocked Google
services. These are lab observations, not production or field Core Web Vitals.

- Combined pure Home selection and Explore ordering, 1,000 iterations after
  warm-up: p50 0.913 ms; p95 1.232 ms; maximum 4.834 ms.
- Final Explore five-run matched comparison: median mobile LCP 2,409 ms baseline
  versus 2,508 ms candidate (+4.1%); CLS zero. This preceded the Home-only preload
  change; Explore does not opt into that preload.
- Initial Home comparisons exceeded the 5% regression budget. The unchanged
  hero was the measured LCP element. A narrow experiment added Next.js 16's
  responsive preload for the selected Home hero only, without also specifying
  `loading`/`fetchPriority` on that image.
- Five matched Home runs after this change: median LCP 2,805 ms baseline versus
  2,337 ms candidate (-16.7%); CLS zero. HTML size was 173,388 versus 166,104 bytes.
  Retain the earlier reports as evidence of the investigation, not just the best
  result. Run-to-run variation was substantial; this is not a promised speed gain.
- One diagnostic cold-cache run per hero produced LCP from 2,342 to 3,239 ms,
  with CLS zero for all 12. Eleven returning hero variants were around 2.88–3.24 s;
  the two-ink train illustration was slowest. One run per image is insufficient
  for a statistical comparison. Repeat matched measurements for those variants
  before activation; do not claim every hero meets a 2.5 s field target.

Private raw reports: `performance.json`, `performance-5.json`,
`performance-final-5.json`, `performance-hero-preload-5.json` and `hero-sweep.json`.
The committed localhost-only measurement script supports repeatable comparisons.

## Remaining activation gates

1. Approve default-on discovery storage after privacy/consent review, or revise
   the storage design. First-party storage is not assumed legally exempt.
2. Review the local variations and repeat performance checks for slower heroes.
3. Preserve consent, no-ad surfaces and preview noindex protections. Stubbed tests
   do not resolve regional CMP or Auto ads verification dependencies.
4. Obtain separate release authorization and check the included hosting allowance.

Rotation does not resolve AdSense low-value-content concerns or certify review
readiness. No drafts were published and no review request was submitted.
