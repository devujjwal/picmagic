import { spawnSync } from "node:child_process";
import fs from "node:fs";
const origin = process.env.E2E_BASE_URL || "http://localhost:4313";
const runs = Number(process.env.LH_RUNS || 1);
const prefix = process.env.LH_REPORT_PREFIX || "lighthouse";
if (
  !Number.isInteger(runs) ||
  runs < 1 ||
  runs > 5 ||
  !/^[a-z0-9-]+$/.test(prefix)
)
  throw new Error("Use 1–5 runs and a lowercase report prefix.");
const summary = {
  origin,
  measuredAt: new Date().toISOString(),
  runs,
  pages: {},
};
for (const [name, path] of Object.entries({
  home: "/",
  category: "/ai-prompts/women",
  detail: "/ai-prompts/women/golden-hour-draped-in-tradition",
  creator: "/create",
})) {
  const measurements = [];
  for (let run = 1; run <= runs; run++) {
    const output = `docs/qa/${prefix}-${name}${runs > 1 ? `-${run}` : ""}.json`;
    const result = spawnSync(
      "pnpm",
      [
        "exec",
        "lighthouse",
        origin + path,
        "--chrome-flags=--headless --no-sandbox",
        "--only-categories=performance,accessibility,best-practices,seo",
        "--output=json",
        `--output-path=${output}`,
        "--quiet",
      ],
      { stdio: "inherit" },
    );
    if (result.status) process.exit(result.status);
    const report = JSON.parse(fs.readFileSync(output));
    if (report.runtimeError) throw new Error(report.runtimeError.message);
    const scores = Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    );
    measurements.push({ file: output, scores });
    console.log(name, run, scores);
  }
  const median = Object.fromEntries(
    Object.keys(measurements[0].scores).map((key) => [
      key,
      measurements.map((m) => m.scores[key]).sort((a, b) => a - b)[
        Math.floor(runs / 2)
      ],
    ]),
  );
  summary.pages[name] = { path, median, measurements };
  if (runs > 1) {
    const representative = [...measurements].sort(
      (a, b) => a.scores.performance - b.scores.performance,
    )[Math.floor(runs / 2)];
    fs.copyFileSync(representative.file, `docs/qa/${prefix}-${name}.json`);
  }
}
fs.writeFileSync(
  `docs/qa/${prefix}-summary.json`,
  JSON.stringify(summary, null, 2) + "\n",
);
console.log(
  "Mobile lab medians",
  Object.fromEntries(
    Object.entries(summary.pages).map(([name, page]) => [name, page.median]),
  ),
);
