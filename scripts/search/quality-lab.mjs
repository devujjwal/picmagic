// Local production-build lab only. Never crawl production or send analytics.
// Start Next locally with CONTENT_SOURCE=supabase (public reads only) to include
// the already-published blog sample; the seed articles intentionally stay drafts.
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
const origin = process.env.E2E_BASE_URL || "http://127.0.0.1:3002";
const url = new URL(origin);
if (
  !["localhost", "127.0.0.1"].includes(url.hostname) ||
  url.protocol !== "http:" ||
  url.pathname !== "/" ||
  url.username ||
  url.password
)
  throw Error("Local HTTP origins only");
const label = process.env.SEARCH_LAB_LABEL || "baseline";
if (!/^[a-z0-9-]+$/.test(label)) throw Error("Invalid label");
const routes = [
  "/",
  "/ai-prompts/men",
  "/ai-prompts/women/durga-puja-pandal-portrait",
  "/collections/indian-festivals",
  "/blog/diwali-durga-puja-dussehra-business-posters",
  "/festival-poster-maker",
];
const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] });
const results = [];
try {
  for (const route of routes)
    for (const desktop of [false, true]) {
      const { lhr } = await lighthouse(origin + route, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: [
          "performance",
          "accessibility",
          "seo",
          "best-practices",
        ],
        ...(desktop
          ? {
              formFactor: "desktop",
              screenEmulation: {
                mobile: false,
                width: 1440,
                height: 900,
                deviceScaleFactor: 1,
                disabled: false,
              },
              throttling: {
                rttMs: 40,
                throughputKbps: 10240,
                cpuSlowdownMultiplier: 1,
                requestLatencyMs: 0,
                downloadThroughputKbps: 0,
                uploadThroughputKbps: 0,
              },
            }
          : {}),
        blockedUrlPatterns: [
          "*googlesyndication*",
          "*googletagmanager*",
          "*google-analytics*",
          "*doubleclick*",
          "*fundingchoicesmessages*",
        ],
      });
      if (lhr.runtimeError) throw Error(lhr.runtimeError.message);
      const row = {
        route,
        device: desktop ? "desktop" : "mobile",
        scores: Object.fromEntries(
          Object.entries(lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
        lcpMs: lhr.audits["largest-contentful-paint"].numericValue,
        cls: lhr.audits["cumulative-layout-shift"].numericValue,
        tbtMs: lhr.audits["total-blocking-time"].numericValue,
        transferBytes: lhr.audits["total-byte-weight"].numericValue,
        failed: Object.values(lhr.audits)
          .filter((a) => a.score !== null && a.score < 1)
          .map((a) => ({
            id: a.id,
            title: a.title,
            displayValue: a.displayValue,
            details: a.details,
          })),
      };
      results.push(row);
      console.log(
        JSON.stringify({ ...row, failed: row.failed.map((x) => x.id) }),
      );
    }
} finally {
  await chrome.kill();
  fs.mkdirSync(".release-private/search-quality-20261011", { recursive: true });
  fs.writeFileSync(
    `.release-private/search-quality-20261011/lab-${label}.json`,
    JSON.stringify(
      {
        measuredAt: new Date().toISOString(),
        origin,
        mode: "Single-run diagnostic lab samples, local production build, Google blocked. TBT is not INP; no field improvement claims.",
        results,
      },
      null,
      2,
    ),
  );
}
