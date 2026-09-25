// Explicit local-only measurement; output is private and never part of a release.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import lighthouse from "lighthouse";
const require = createRequire(import.meta.url);
const { launch } = await import(
  require.resolve("chrome-launcher", {
    paths: [path.dirname(require.resolve("lighthouse"))],
  })
);
const baseline = process.env.DISCOVERY_BASELINE || "http://127.0.0.1:3074";
const candidate = process.env.DISCOVERY_CANDIDATE || "http://127.0.0.1:3075";
for (const origin of [baseline, candidate]) {
  const url = new URL(origin);
  if (
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    url.protocol !== "http:" ||
    url.pathname !== "/" ||
    url.username ||
    url.password
  )
    throw new Error("Local HTTP origins only");
}
const runs = Number(process.env.DISCOVERY_BENCH_RUNS || 3);
const label = process.env.DISCOVERY_BENCH_LABEL || "comparison";
if (!/^[a-z0-9-]+$/.test(label)) throw new Error("Invalid report label");
if (!Number.isInteger(runs) || runs < 3 || runs > 7)
  throw new Error("Use three to seven matched runs");
const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] });
const samples = [];
const routes =
  process.env.DISCOVERY_HOME_ONLY === "true" ? ["/"] : ["/", "/ai-prompts"];
try {
  for (let run = 0; run < runs; run++)
    for (const route of routes)
      for (const [label, origin] of [
        ["baseline", baseline],
        ["candidate", candidate],
      ]) {
        const response = await fetch(origin + route, { redirect: "error" });
        const html = await response.text();
        const result = await lighthouse(origin + route, {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: ["performance"],
          blockedUrlPatterns: [
            "*googlesyndication*",
            "*googletagmanager*",
            "*google-analytics*",
            "*doubleclick*",
            "*fundingchoicesmessages*",
          ],
        });
        if (result.lhr.runtimeError)
          throw new Error(result.lhr.runtimeError.message);
        const metric = (id) => result.lhr.audits[id].numericValue;
        const sample = {
          label,
          route,
          run,
          htmlBytes: Buffer.byteLength(html),
          lcp: metric("largest-contentful-paint"),
          cls: metric("cumulative-layout-shift"),
          tbt: metric("total-blocking-time"),
          score: result.lhr.categories.performance.score,
        };
        samples.push(sample);
        console.log(JSON.stringify(sample));
      }
} finally {
  await chrome.kill();
}
fs.mkdirSync(".release-private/discovery-qa", { recursive: true });
fs.writeFileSync(
  `.release-private/discovery-qa/performance-${label}-${runs}.json`,
  JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      mode: `${runs} interleaved cold mobile lab runs, matching editorial variant zero, Google blocked; not field CWV`,
      samples,
    },
    null,
    2,
  ),
);
