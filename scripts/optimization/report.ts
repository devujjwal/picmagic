import { z } from "zod";
import type { Finding, Report } from "./types";
import { hash } from "./analyze";

const sourceSchema = z
  .object({
    file: z.string().max(500),
    line: z.number().int().positive().optional(),
    recordId: z.string().max(100).optional(),
  })
  .strict();
const findingSchema = z
  .object({
    id: z.string().max(120),
    rule: z.string().max(100),
    ruleVersion: z.number().int().positive(),
    priority: z.enum(["P0", "P1", "P2", "P3"]),
    areas: z.array(
      z.enum(["SEO", "AEO", "GEO", "images", "links", "measurement"]),
    ),
    urls: z.array(z.string().max(2000)).max(500),
    sources: z.array(sourceSchema).max(500),
    issue: z.string().max(2000),
    evidence: z
      .array(
        z
          .object({
            source: z.string().max(200),
            observedAt: z.iso.datetime(),
            detail: z.string().max(20000),
          })
          .strict(),
      )
      .max(100),
    action: z.string().max(5000),
    benefit: z.string().max(2000),
    confidence: z.enum(["high", "medium", "low"]),
    uncertainty: z.string().max(3000),
    complexity: z.enum(["low", "medium", "high"]),
    detectionSafe: z.literal(true),
    approval: z.enum(["editorial", "technical", "production"]),
    status: z.enum(["new", "persistent", "resolved", "suppressed"]),
    suppressionReason: z.string().max(1000).optional(),
  })
  .strict();
// Only fields needed for comparison are accepted; graph/inventory are validated but not trusted as executable inputs.
export const priorReportSchema = z
  .object({
    version: z.literal("1.0.0"),
    mode: z.literal("recommendation-only"),
    observedAt: z.iso.datetime(),
    fingerprint: z.string().max(100),
    inventory: z.record(z.string(), z.number()),
    coverage: z.record(
      z.string(),
      z.enum(["observed", "unknown", "stale", "partial"]),
    ),
    graph: z
      .object({
        nodes: z
          .array(
            z
              .object({
                id: z.string(),
                kind: z.enum([
                  "page",
                  "prompt",
                  "category",
                  "collection",
                  "image",
                  "term",
                ]),
                url: z.string().optional(),
                published: z.boolean().optional(),
                eligible: z.boolean().optional(),
                label: z.string().optional(),
              })
              .strict(),
          )
          .max(20000),
        edges: z
          .array(
            z
              .object({
                from: z.string(),
                to: z.string(),
                kind: z.enum([
                  "category",
                  "membership",
                  "image",
                  "term",
                  "related",
                  "counterpart",
                  "catalogue",
                  "collection-link",
                  "hub",
                ]),
                link: z.boolean(),
              })
              .strict(),
          )
          .max(100000),
      })
      .strict(),
    findings: z.array(findingSchema).max(10000),
    changes: z
      .object({
        new: z.array(z.string()),
        persistent: z.array(z.string()),
        changed: z.array(z.string()),
        resolved: z.array(z.string()),
      })
      .strict(),
    limitations: z.array(z.string()).max(100),
  })
  .strict();

export const suppressionSchema = z.array(
  z
    .object({
      id: z.string().max(120),
      reason: z.string().min(10).max(1000),
      expires: z.iso.date(),
    })
    .strict(),
);

function signature(f: Finding) {
  const { status: _status, suppressionReason: _reason, evidence, ...rest } = f;
  void _status;
  void _reason;
  return hash({
    ...rest,
    evidence: evidence.map(({ source, detail }) => ({ source, detail })),
  });
}
function sourceAvailable(report: Report, finding: Finding) {
  // A query disappearing from an export can reflect privacy or row limits.
  // Never declare search opportunities resolved from absence alone.
  if (finding.rule.startsWith("search-")) return false;
  if (finding.evidence.some((e) => e.source === "production HTTP"))
    return false;
  const domain = finding.rule.startsWith("search-")
    ? "search"
    : [
          "rendered-page",
          "rendered-links",
          "rendered-image-cache",
          "crawl-directives",
        ].includes(finding.rule)
      ? "rendered"
      : finding.rule === "image-file"
        ? "images"
        : "repository";
  return report.coverage[domain] === "observed";
}
export function finalizeReport(
  report: Report,
  previous?: Report,
  suppressions: unknown = [],
): Report {
  if (
    previous &&
    (previous.version !== report.version ||
      previous.mode !== "recommendation-only" ||
      !Array.isArray(previous.findings))
  )
    throw new Error("Incompatible prior report");
  if (previous && previous.observedAt > report.observedAt)
    throw new Error("Prior snapshot is newer than this audit");
  const suppression = suppressionSchema.parse(suppressions);
  const old = new Map(
    previous?.findings
      .filter((f) => f.status !== "resolved")
      .map((f) => [f.id, f]) || [],
  );
  report.changes = { new: [], persistent: [], changed: [], resolved: [] };
  const found = new Set(report.findings.map((f) => f.id));
  for (const f of report.findings) {
    const before = old.get(f.id);
    f.status = before ? "persistent" : "new";
    report.changes[before ? "persistent" : "new"].push(f.id);
    if (before && signature(before) !== signature(f))
      report.changes.changed.push(f.id);
  }
  for (const f of old.values())
    if (!found.has(f.id)) {
      if (sourceAvailable(report, f)) {
        report.findings.push({ ...f, status: "resolved" });
        report.changes.resolved.push(f.id);
      } else {
        report.findings.push({
          ...f,
          status: "persistent",
          uncertainty:
            "Not re-observed in this run; source coverage is incomplete. Previous evidence retained without claiming resolution.",
        });
        report.changes.persistent.push(f.id);
      }
    }
  for (const f of report.findings) {
    const match = suppression.find(
      (s) => s.id === f.id && s.expires >= report.observedAt.slice(0, 10),
    );
    if (match && f.status !== "resolved") {
      f.status = "suppressed";
      f.suppressionReason = match.reason;
    } else delete f.suppressionReason;
  }
  report.findings.sort(
    (a, b) => a.priority.localeCompare(b.priority) || a.id.localeCompare(b.id),
  );
  Object.values(report.changes).forEach((ids) => ids.sort());
  return report;
}

// Imported content is always text, never raw HTML, links, or instructions.
const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\\`*_{}\[\]()#!|]/g, "\\$&")
    .replace(/[\r\n]+/g, " ");
export function markdownReport(report: Report) {
  const lines = [
    "# PicMagic SEO + AEO + GEO recommendations",
    "",
    `Mode: recommendation-only · Version: ${report.version} · Observed: ${report.observedAt}`,
    "",
    "No content or production changes are made by this tool. Findings are evidence-backed review requests, not publishing instructions.",
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([k, v]) => `- ${k}: ${v}`),
    "",
    "## Evidence coverage",
    "",
    ...Object.entries(report.coverage).map(([k, v]) => `- ${k}: ${v}`),
    "",
    "## Limitations",
    "",
    ...report.limitations.map((v) => `- ${escape(v)}`),
    "",
    "## Snapshot changes",
    "",
    ...Object.entries(report.changes).map(([k, v]) => `- ${k}: ${v.length}`),
  ];
  lines.push(
    "",
    "## Review queues",
    "",
    "Rule-level queues keep repeated checks from becoming hundreds of equally weighted tasks. Full per-page findings, sources and graph edges are retained in report.json. The detail section shows at most three examples per rule and priority.",
    "",
  );
  const queues = new Map<string, Finding[]>();
  for (const f of report.findings) {
    const key = `${f.priority} / ${f.rule}`;
    queues.set(key, [...(queues.get(key) || []), f]);
  }
  for (const [key, entries] of [...queues].sort(([a], [b]) =>
    a.localeCompare(b),
  ))
    lines.push(
      `- ${escape(key)}: ${entries.length} findings; ${entries.filter((f) => !["resolved", "suppressed"].includes(f.status)).length} active.`,
    );
  for (const priority of ["P0", "P1", "P2", "P3"]) {
    const findings = report.findings.filter((f) => f.priority === priority);
    lines.push("", `## ${priority} (${findings.length})`, "");
    if (!findings.length) lines.push("No findings in the available evidence.");
    const shown = new Map<string, number>();
    for (const f of findings) {
      const count = shown.get(f.rule) || 0;
      shown.set(f.rule, count + 1);
      if (count >= 3) continue;
      lines.push(
        `### ${escape(f.issue)}`,
        "",
        `ID: ${escape(f.id)} · ${f.areas.join(" / ")} · ${f.status}`,
        "",
        ...f.urls.map((u) => `- URL: ${escape(u)}`),
        ...f.sources
          .filter(Boolean)
          .map(
            (s) =>
              `- Source: ${escape(s.file)}${s.line ? `:${s.line}` : ""}${s.recordId ? ` (${escape(s.recordId)})` : ""}`,
          ),
        ...f.evidence.map(
          (e) =>
            `- Evidence (${escape(e.source)}, ${escape(e.observedAt)}): ${escape(e.detail)}`,
        ),
        `- Action: ${escape(f.action)}`,
        `- Benefit: ${escape(f.benefit)}`,
        `- Confidence: ${f.confidence}; complexity: ${f.complexity}; approval: ${f.approval}`,
        `- Uncertainty: ${escape(f.uncertainty)}`,
        ...(f.suppressionReason
          ? [`- Suppression: ${escape(f.suppressionReason)}`]
          : []),
        "",
      );
    }
  }
  return lines.join("\n") + "\n";
}
