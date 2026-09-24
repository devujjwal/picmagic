import lighthouse from "lighthouse";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const launcher = await import(
  require.resolve("chrome-launcher", {
    paths: [path.dirname(require.resolve("lighthouse"))],
  })
);
const origin = process.env.E2E_BASE_URL || "http://127.0.0.1:4316";
if (!["localhost", "127.0.0.1"].includes(new URL(origin).hostname))
  throw new Error("Benchmark local builds only.");
const label = process.env.PICMAGIC_BENCH_LABEL || "inline";
if (!/^[a-z-]+$/.test(label)) throw new Error("Invalid label");
const chrome = await launcher.launch({
  chromeFlags: ["--headless", "--no-sandbox"],
});
const results = [];
try {
  for (const route of [
    "/",
    "/ai-prompts/men",
    "/ai-prompts/social-media/one-day-four-possible-worlds",
  ]) {
    const samples = [];
    const html = await (await fetch(origin + route)).text();
    for (let i = 0; i < 3; i++) {
      const result = await lighthouse(origin + route, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
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
      samples.push({
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([k, v]) => [
            k,
            Math.round(v.score * 100),
          ]),
        ),
        lcp: metric("largest-contentful-paint"),
        cls: metric("cumulative-layout-shift"),
        tbt: metric("total-blocking-time"),
        ttfb: metric("server-response-time"),
        failedAudits: Object.values(result.lhr.audits)
          .filter((a) => a.score !== null && a.score < 1)
          .map((a) => ({
            id: a.id,
            title: a.title,
            displayValue: a.displayValue,
            details: a.id === "errors-in-console" ? a.details : undefined,
          })),
      });
    }
    results.push({ route, htmlBytes: Buffer.byteLength(html), samples });
    console.log(label, results.at(-1));
  }
} finally {
  await chrome.kill();
}
fs.writeFileSync(
  `docs/qa/seo-performance-${label}.json`,
  JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      origin,
      mode: "Mobile Lighthouse, 3 cold runs; Google blocked. Local lab, not field CWV.",
      results,
    },
    null,
    2,
  ) + "\n",
);
