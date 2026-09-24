import { z } from "zod";
import { finding, hash } from "./analyze";
import type { Finding } from "./types";

const date = z.iso.date();
const rowSchema = z
  .object({
    page: z.url().refine((s) => {
      const u = new URL(s);
      return (
        ["picmagic.in", "www.picmagic.in"].includes(u.hostname) &&
        ["http:", "https:"].includes(u.protocol) &&
        !u.username &&
        !u.password
      );
    }),
    query: z.string().max(300).optional(),
    searchType: z.enum(["web", "image"]),
    device: z.string().max(30).optional(),
    country: z.string().max(10).optional(),
    clicks: z.number().int().nonnegative(),
    impressions: z.number().int().nonnegative(),
    position: z.number().finite().nonnegative(),
  })
  .strict()
  .refine((r) => r.clicks <= r.impressions, "Clicks cannot exceed impressions");
const windowSchema = z
  .object({
    start: date,
    end: date,
    lastAvailableDate: date,
    complete: z.boolean(),
    rows: z.array(rowSchema).max(50000),
  })
  .strict()
  .refine(
    (w) =>
      w.start <= w.lastAvailableDate &&
      w.lastAvailableDate <= w.end &&
      w.start <= w.end,
    "Invalid window bounds",
  );
export const searchImportSchema = z
  .object({
    version: z.literal(1),
    source: z.enum(["search-console-export", "windsor-searchconsole"]),
    current: windowSchema,
    previous: windowSchema.optional(),
  })
  .strict();
type Row = z.infer<typeof rowSchema>;
export const searchDefaults = {
  minImpressions: 100,
  minPriorClicks: 20,
  lowCtr: 0.02,
  declineRatio: 0.3,
  staleDays: 7,
};

export function canonicalFamily(page: string) {
  const url = new URL(page);
  url.protocol = "https:";
  url.hostname = "picmagic.in";
  url.port = "";
  url.hash = "";
  const pageNumber = url.searchParams.get("page");
  url.search = "";
  if (pageNumber && /^\d+$/.test(pageNumber) && Number(pageNumber) > 1)
    url.searchParams.set("page", String(Number(pageNumber)));
  return url.href;
}
const brand = (query?: string) =>
  query === undefined
    ? "unknown"
    : /pic\s*magic/i.test(query)
      ? "branded"
      : "nonbranded";
const safeRawUrl = (page: string) => {
  const u = new URL(page),
    pagination = new URL(canonicalFamily(page)).search;
  u.search = pagination;
  u.hash = "";
  return u.href;
};
const key = (r: Row) =>
  JSON.stringify([
    r.searchType,
    r.page,
    r.query ?? null,
    r.device ?? null,
    r.country ?? null,
  ]);
const days = (start: string, end: string) =>
  (Date.parse(end) - Date.parse(start)) / 86400000 + 1;

export function analyzeSearch(
  input: unknown,
  observedAt: string,
  overrides: Partial<typeof searchDefaults> = {},
) {
  const data = searchImportSchema.parse(input),
    settings = { ...searchDefaults, ...overrides };
  for (const [name, value] of Object.entries(settings))
    if (
      !Number.isFinite(value) ||
      value <= 0 ||
      ((name === "lowCtr" || name === "declineRatio") && value >= 1)
    )
      throw new Error("Invalid search threshold");
  const findings: Finding[] = [];
  for (const window of [data.current, data.previous].filter(
    (w) => w !== undefined,
  )) {
    if (new Set(window.rows.map(key)).size !== window.rows.length)
      throw new Error(
        "Duplicate search rows; aggregate at a single declared grain before importing",
      );
    const grain = new Set(
      window.rows.map((r) =>
        JSON.stringify([
          r.query !== undefined,
          r.device !== undefined,
          r.country !== undefined,
        ]),
      ),
    );
    if (grain.size > 1)
      throw new Error(
        "Mixed search aggregation grains cannot be compared or summed",
      );
  }
  const age = days(data.current.lastAvailableDate, observedAt.slice(0, 10)) - 1;
  if (age < 0) throw new Error("Search observations cannot be in the future");
  const stale = age > settings.staleDays;
  const complete =
    data.current.complete &&
    data.current.lastAvailableDate === data.current.end;
  const prior = data.previous;
  const comparable = Boolean(
    prior &&
    complete &&
    !stale &&
    prior.complete &&
    prior.lastAvailableDate === prior.end &&
    prior.end < data.current.start &&
    days(prior.start, prior.end) === days(data.current.start, data.current.end),
  );
  const priorRows = new Map(prior?.rows.map((r) => [key(r), r]) || []);
  for (const row of [...data.current.rows].sort((a, b) =>
    key(a).localeCompare(key(b)),
  )) {
    const qualified =
      complete && !stale && row.impressions >= settings.minImpressions;
    const ranking = row.position >= 8 && row.position <= 20;
    const lowCtr =
      row.impressions > 0 &&
      row.clicks / row.impressions < settings.lowCtr &&
      row.position <= 20;
    const previous = priorRows.get(key(row));
    const decline =
      comparable &&
      previous &&
      previous.clicks >= settings.minPriorClicks &&
      row.clicks <= previous.clicks * (1 - settings.declineRatio);
    if (!ranking && !lowCtr && !decline && row.searchType !== "image") continue;
    const actionable = (qualified && (ranking || lowCtr)) || Boolean(decline);
    findings.push(
      finding(
        {
          rule: "search-opportunity",
          key: key(row),
          priority: actionable ? "P1" : "P3",
          areas: [
            "SEO",
            "measurement",
            ...(row.searchType === "image" ? ["images" as const] : []),
          ],
          urls: [canonicalFamily(row.page)],
          sources: [],
          issue: actionable
            ? "Search opportunity merits human investigation"
            : "Low-confidence search watchlist signal",
          evidence: `${row.searchType}; ${brand(row.query)}; query ${row.query === undefined ? "not supplied" : `hash ${hash(row.query).slice(0, 12)}`}; URL variant (non-pagination parameters removed) ${safeRawUrl(row.page)}; ${row.clicks} clicks / ${row.impressions} impressions; position ${row.position}; device ${row.device || "unspecified"}; country ${row.country || "unspecified"}; complete=${complete}; stale=${stale}; ranking-band=${ranking}; low-CTR-screen=${lowCtr}; comparable-decline=${Boolean(decline)}.`,
          evidenceSource: data.source,
          action:
            "Inspect the source query, intent, snippet and relevant links. Compare equivalent complete periods; do not rewrite or publish based on this screen alone.",
          benefit:
            "Focus editorial investigation on observed search behaviour instead of invented traffic forecasts.",
          confidence: actionable ? "medium" : "low",
          uncertainty:
            "Thresholds are workflow heuristics, not statistical significance. Average position is not a fixed rank; query privacy means totals may differ. No causal claim or AI-citation count is inferred.",
          complexity: "medium",
          approval: "editorial",
        },
        observedAt,
      ),
    );
  }
  // Multiple pages per identical query are a review candidate, never a verdict.
  const queryGroups = new Map<string, Row[]>();
  for (const row of data.current.rows.filter((r) => r.query !== undefined)) {
    const group = JSON.stringify([
      row.query,
      row.searchType,
      row.device,
      row.country,
    ]);
    queryGroups.set(group, [...(queryGroups.get(group) || []), row]);
  }
  for (const [group, rows] of queryGroups) {
    const urls = [...new Set(rows.map((r) => canonicalFamily(r.page)))].sort();
    if (urls.length < 2) continue;
    findings.push(
      finding(
        {
          rule: "search-intent-review",
          key: group,
          priority: "P3",
          areas: ["SEO", "measurement"],
          urls,
          sources: [],
          issue: "One reported query reaches multiple canonical pages",
          evidence: `Query hash ${hash(group).slice(0, 12)}; ${urls.length} canonical families.`,
          evidenceSource: data.source,
          action:
            "Review query-to-page intent in the private source export. Different useful answers may legitimately rank; do not consolidate automatically.",
          benefit:
            "Identify potential intent mismatches without confusing host aliases with cannibalization.",
          confidence: "low",
          uncertainty:
            "Multiple ranking pages are not proof of cannibalization.",
          complexity: "medium",
          approval: "editorial",
        },
        observedAt,
      ),
    );
  }
  return {
    findings,
    coverage: stale
      ? ("stale" as const)
      : complete
        ? ("observed" as const)
        : ("partial" as const),
    summary: {
      source: data.source,
      current: {
        start: data.current.start,
        end: data.current.end,
        lastAvailableDate: data.current.lastAvailableDate,
        complete,
      },
      rows: data.current.rows.length,
      comparablePreviousWindow: comparable,
      settings,
    },
  };
}

// GA4 receipts and field CWV need their own evidence, not inference from code presence.
export const measurementImportSchema = z
  .object({
    version: z.literal(1),
    observedAt: z.iso.datetime(),
    analytics: z.enum(["observed", "unknown"]),
    fieldCWV: z.enum(["observed", "unknown"]),
    source: z.enum(["ga4-export", "crux-export", "manual-verification"]),
    note: z.string().max(1000),
  })
  .strict();
export function measurementCoverage(input: unknown, asOf: string) {
  const data = measurementImportSchema.parse(input),
    age = Date.parse(asOf) - Date.parse(data.observedAt);
  if (age < 0) throw new Error("Future measurement observation");
  return {
    analytics:
      data.analytics === "observed" && age > 7 * 86400000
        ? ("stale" as const)
        : data.analytics,
    fieldCWV:
      data.fieldCWV === "observed" && age > 7 * 86400000
        ? ("stale" as const)
        : data.fieldCWV,
  };
}
