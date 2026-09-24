import { parseArgs } from "node:util";
import { z } from "zod";
import { loadAuditCatalog } from "./optimization/catalog";
import { analyzeCatalog, hash } from "./optimization/analyze";
import { inspectImages } from "./optimization/images";
import { crawl } from "./optimization/rendered";
import { analyzeSearch, measurementCoverage } from "./optimization/search";
import {
  finalizeReport,
  markdownReport,
  priorReportSchema,
} from "./optimization/report";
import { readJson, writeReports } from "./optimization/io";

async function main() {
  const { values } = parseArgs({
    options: {
      help: { type: "boolean" },
      "as-of": { type: "string" },
      out: { type: "string" },
      search: { type: "string" },
      measurements: { type: "string" },
      previous: { type: "string" },
      suppressions: { type: "string" },
      origin: { type: "string" },
      "production-smoke": { type: "boolean" },
      "preview-noindex": { type: "boolean" },
      "min-impressions": { type: "string" },
      "min-prior-clicks": { type: "string" },
    },
    strict: true,
    allowPositionals: false,
  });
  if (values.help) {
    console.log(
      "Usage: pnpm audit:optimization [--as-of ISO_TIMESTAMP] [--out RUN_NAME] [--search FILE.json] [--measurements FILE.json] [--previous report.json] [--suppressions FILE.json] [--origin http://127.0.0.1:4317] [--preview-noindex]\nOffline by default. --production-smoke explicitly enables a capped public read-only smoke check; never use it for a full crawl. Reports go only to .release-private/optimization/RUN_NAME. No production writes or release commands exist.",
    );
    return;
  }
  const asOf = z.iso
    .datetime()
    .parse(values["as-of"] || new Date().toISOString());
  if (values.origin && values["production-smoke"])
    throw new Error("Choose local origin OR production smoke");
  if (values["preview-noindex"] && !values.origin)
    throw new Error("Preview expectations require a local origin");
  const catalog = loadAuditCatalog(),
    report = analyzeCatalog(catalog, asOf);
  const images = await inspectImages(catalog, asOf, process.cwd());
  report.findings.push(...images.findings);
  Object.assign(report.inventory, images.inventory);
  report.fingerprint = hash([
    report.fingerprint,
    images.inventory,
    images.findings.map((f) => [f.id, f.evidence.map((e) => e.detail)]),
  ]);
  report.coverage.images = images.coverage;
  const attachments: Record<string, unknown> = {};
  if (values.search) {
    const input = await readJson(values.search);
    const overrides: { minImpressions?: number; minPriorClicks?: number } = {};
    if (values["min-impressions"])
      overrides.minImpressions = Number(values["min-impressions"]);
    if (values["min-prior-clicks"])
      overrides.minPriorClicks = Number(values["min-prior-clicks"]);
    const search = analyzeSearch(input, asOf, overrides);
    report.findings.push(...search.findings);
    report.coverage.search = search.coverage;
    attachments.search = search.summary;
    report.fingerprint = hash([report.fingerprint, input]);
  }
  if (values.measurements) {
    const input = await readJson(values.measurements);
    Object.assign(report.coverage, measurementCoverage(input, asOf));
    attachments.measurements = input;
    report.fingerprint = hash([report.fingerprint, input]);
    report.limitations.push(
      "Measurement availability is declared by the supplied verification/export; this CLI does not independently verify GA4 receipt or calculate field percentiles.",
    );
  }
  if (values.origin || values["production-smoke"]) {
    const result = await crawl(catalog, {
      base: values.origin || "https://picmagic.in",
      production: Boolean(values["production-smoke"]),
      observedAt: asOf,
      indexing: !values["preview-noindex"],
    });
    report.findings.push(...result.findings);
    report.coverage.rendered = result.coverage;
    attachments.rendered = result;
    report.fingerprint = hash([report.fingerprint, result.observations]);
  }
  const previous = values.previous
    ? priorReportSchema.parse(await readJson(values.previous))
    : undefined;
  const suppressions = values.suppressions
    ? await readJson(values.suppressions)
    : [];
  finalizeReport(report, previous, suppressions);
  const out = await writeReports(
    process.cwd(),
    values.out || asOf.replace(/[:.]/g, "-"),
    {
      "report.json": JSON.stringify(report, null, 2) + "\n",
      "report.md": markdownReport(report),
      "observations.json": JSON.stringify(attachments, null, 2) + "\n",
    },
  );
  console.log(
    JSON.stringify(
      {
        out,
        inventory: report.inventory,
        coverage: report.coverage,
        findings: report.findings.length,
        activeP0: report.findings.filter(
          (f) =>
            f.priority === "P0" &&
            !["resolved", "suppressed"].includes(f.status),
        ).length,
      },
      null,
      2,
    ),
  );
}
main().catch(() => {
  console.error(
    "Audit stopped: invalid input, unavailable dependency, or unsafe/existing output target. Check --help and the documented input schemas. No content or production changes were made.",
  );
  process.exitCode = 1;
});
