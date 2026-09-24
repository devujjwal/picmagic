# PicMagic SEO + AEO + GEO recommendation agent

Batch 1 is a local report tool, not a publisher or autonomous content editor.
It uses one content/link graph and shared findings tagged SEO, AEO, GEO, images,
links and measurement. It does not assign an invented overall optimization score.

## Run

From the repository root, with the existing dependencies installed:

```sh
pnpm audit:optimization --out initial-review
```

This is offline: it reads the canonical catalogue, schemas, editorial guides and
published preview/thumbnail metadata. It does not read `.env` files, private identity
references, database credentials, or connect to any service. Existing assets are
never rewritten.

Each run creates **new** files under the already ignored directory
`.release-private/optimization/initial-review/`:

- `report.md`: prioritized rule-level review queues, evidence coverage, and up to
  three example findings per rule/priority. This avoids treating hundreds of page
  checks as equally important tasks.
- `report.json`: all findings, inventory, normalized graph, limitations and diff.
- `observations.json`: optional rendered/search/measurement observations.

Run directories use mode 0700 and files 0600. Existing output names and symlinked
report directories are rejected. `--out` is a simple run name, not an arbitrary
filesystem destination. Reports and raw exports must not be committed or moved to
public/static directories. Query hashes are pseudonymous, not anonymization.

To reproduce a dated fixture, use an explicit UTC timestamp. For actual observations,
omit `--as-of` so evidence records the real run time:

```sh
pnpm audit:optimization --as-of 2026-09-24T12:00:00.000Z --out dated-fixture
pnpm audit:optimization --previous .release-private/optimization/initial-review/report.json --out comparison
```

## Optional rendered checks

Start a **local production build** using the established project workflow, seed
content, the expected indexing configuration, and stubbed ads/analytics for browser
tests. The audit itself does not start servers or execute builds. Point it at the
running loopback server:

```sh
pnpm audit:optimization --origin http://127.0.0.1:4317 --out local-rendered
```

Use `--preview-noindex` when deliberately checking a preview/noindex build. Local
checks cover catalogue pagination, category/active collection routes, all published
and draft prompt paths, noindex utilities, redirect/404 fixtures and sitemap/image
ownership. Status and indexing expectations derive from the repository, not a
production database snapshot. Intentional seed/database differences require review.

The HTML parser does not execute scripts or fetch page resources. It checks initial
HTML, not post-hydration behaviour or screenshots. It observes status, canonical,
robots/X-Robots, title/description, H1, prompt text, prompt/image JSON-LD and prompt
social images. Checked 404 destinations can produce broken-link findings; unchecked
links are not declared broken. One hashed preview receives a HEAD cache-header check.

Only HTTP loopback origins are permitted for full crawls (500-request cap). If
separately appropriate, an explicit production smoke option reads at most 12 URLs
on the exact primary host:

```sh
pnpm audit:optimization --production-smoke --out authorized-smoke
```

The smoke run is always **partial coverage**. It never substitutes for a full crawl.
It samples key templates, one prompt, a redirect, a missing route, robots, all three
sitemap endpoints and one image header. No cookies or credentials are sent. Only
GET/HEAD are implemented; redirects are checked against an allowlist but never
followed. Responses have a 15-second timeout and 5 MB body limit. The production
option is never enabled by default or invoked from builds/CI. No production smoke
run is needed to accept Batch 1.

## Optional Search Console import

Prepare a JSON export with **one aggregation grain per window**, not a mixture of
property totals and query/device/country breakdowns. Raw connector/Google CSV output
must first be mapped into this explicit schema; the CLI does not log in or call a
connector itself. `source` identifies provenance, not proof of authenticity.

```json
{
  "version": 1,
  "source": "search-console-export",
  "current": {
    "start": "2026-08-27",
    "end": "2026-09-23",
    "lastAvailableDate": "2026-09-23",
    "complete": true,
    "rows": [
      {
        "page": "https://picmagic.in/ai-prompts/men",
        "query": "example portrait query",
        "searchType": "web",
        "device": "mobile",
        "country": "ind",
        "clicks": 0,
        "impressions": 3,
        "position": 10
      }
    ]
  }
}
```

`previous` is optional and has the same window shape. `query`, `device` and `country`
are optional but their presence must be consistent within a window. `searchType`
is `web` or `image`; source can also be `windsor-searchconsole`. Other hosts,
credentials, duplicate rows, mixed aggregation grains, invalid dates, negative
counts and clicks exceeding impressions are rejected. Limits: 20 MB per imported
file and 50,000 rows per window.

```sh
pnpm audit:optimization --search .release-private/search-export.json --out search-review
```

Search rules:

- Separate web/image, device, country and branded/nonbranded observations.
- Keep host/protocol URL variants as evidence and group canonical families for
  intent screening. Non-pagination query parameters and fragments are removed
  from rendered evidence. Raw search phrases are hashed, not copied into reports.
- Ranking screen: average position 8–20. Low-CTR screen: below 2% at position ≤20.
- Require 100 impressions, complete periods and evidence at most seven days old
  for a P1 review candidate. Lower samples are P3 watchlist signals.
- Decline screen: ≥20 prior clicks and ≥30% reduction across equal-length,
  nonoverlapping, complete periods with a matching row. Missing rows are not zero.
- Configure volume screens with `--min-impressions` and `--min-prior-clicks`.
- Thresholds are workflow heuristics, **not statistical significance**. No causal
  diagnosis, forecast, ranking guarantee or AI citation count is inferred.
- Query privacy and export limits can hide rows. An absent search finding is never
  automatically marked resolved by a later export.

## Measurement availability

Optional `--measurements FILE.json` accepts an explicit verification summary:

```json
{
  "version": 1,
  "observedAt": "2026-09-24T09:00:00.000Z",
  "source": "manual-verification",
  "analytics": "unknown",
  "fieldCWV": "unknown",
  "note": "No fresh event receipt or field report was available."
}
```

Source may be `ga4-export`, `crux-export` or `manual-verification`. Availability may
be `observed` or `unknown`; observed data older than seven days becomes stale. The
summary is retained privately as evidence. The agent does not independently verify
GA4 receipt, calculate field percentiles or treat source-code instrumentation as
proof that events arrived. Local HTML size/cache checks are not a Lighthouse or
real-user Core Web Vitals measurement.

## Finding and snapshot contract

Version 1 findings contain stable rule/key-derived IDs, rule version, priority,
classifications, URLs, file/record locations, timestamped evidence, action, qualitative
benefit, confidence, uncertainty, complexity and required approval. Detection is
read-only; **no recommended change is automatically applied**.

Snapshots classify findings as new, persistent, changed, resolved or suppressed.
Evidence timestamps alone do not count as material changes. Absent/stale/partial
source coverage cannot resolve an old finding. Older evidence remains clearly
labelled when not re-observed. Incompatible or future snapshots are rejected.
Local passes never resolve prior production-HTTP findings: production smoke
coverage is deliberately partial, so those require manual verification/suppression.

Optional suppression input (`--suppressions FILE.json`):

```json
[
  {
    "id": "shared-preview:REPLACE_WITH_REAL_ID",
    "reason": "Editorially reviewed, intentionally shared still/reel preview.",
    "expires": "2026-10-24"
  }
]
```

Suppressions need a reason and expiry, are visible in reports, and do not change
indexability or source records. Imported content is validated as data and escaped
in Markdown; it cannot provide commands, scripts or tool instructions.

## Architecture and limits

Entry: `scripts/optimization-audit.ts`. Modules under `scripts/optimization/`:

| Module             | Responsibility                                                              |
| ------------------ | --------------------------------------------------------------------------- |
| `catalog.ts`       | Canonical schema parsing, record provenance, reusable duplicate screens     |
| `analyze.ts`       | Content/entity/link graph, inventory, answer/taxonomy/duplicate findings    |
| `opportunities.ts` | Existing-hub supply/overlap review, hub answer coverage, testing provenance |
| `images.ts`        | Allowlisted local source/thumbnail metadata, dimensions and aspect ratios   |
| `rendered.ts`      | Guarded HTTP collection and technical comparisons                           |
| `search.ts`        | Validated optional imports, freshness and sample-size safeguards            |
| `report.ts`        | Versioned validation, evidence-aware diff, suppressions, readable queues    |
| `io.ts`            | Bounded JSON imports and exclusive private output writes                    |
| `types.ts`         | Finding/report/graph contract                                               |

The tool reuses existing eligibility/discovery helpers and lexical similarity, so
it does not invent a separate publication gate. Existing `seo-catalog.ts` and
`check-seo-content.ts` reuse the side-effect-free catalogue/similarity helpers.
The new command is not part of a production build or automatic schedule.

Graph links are **template-derived expectations**, not proof that Google crawled
them. Membership and entity edges are distinguished from modeled hyperlinks.
Descriptive terms are only case/space normalized: platform, use case and demographic
classification are not inferred from faces or guessed from ambiguous labels.
Dedicated-guide absence is a review screen, not a thin-content verdict. Similarity
includes shared identity/safety boilerplate; it never causes automatic merging or
noindexing. Hub supply does not prove demand or unique intent. New pages still
require editorial proof and approval; no public taxonomy graph is introduced.

Publication, migrations, uploads, revalidation, personal-reference ingestion,
image generation, arbitrary shell execution, branch creation, commits, pushes,
deployments and paid APIs are absent from the agent. Future public-content,
measurement-setting, caching and architecture changes remain separately approved
batches. The trusted repository runtime/dependencies are not a sandbox for executing
untrusted third-party code; imported reports are data only.

## Validation

```sh
pnpm exec tsc --noEmit
pnpm exec eslint scripts/optimization scripts/optimization-audit.ts tests/unit/optimization-audit.test.ts
pnpm test
node --import tsx scripts/check-content.ts
node --import tsx scripts/check-seo-content.ts
```

Acceptance tests recalculate the current 186/91/95 inventory, 112 expected sitemap
URLs, 80 unique published previews, 31 overlap pairs, 11 shared-image groups and two
mixed-media collection-link cases. These baseline fixtures must be deliberately
updated when approved library changes occur; the CLI itself does not hard-code
these totals. Tests also cover snapshot differences, unsafe exports/output paths,
query privacy, stale data, no-script HTML extraction and capped read-only requests.
