import lighthouse from "lighthouse";
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const chromeLauncher = await import(
  require.resolve("chrome-launcher", {
    paths: [path.dirname(require.resolve("lighthouse"))],
  })
);
import fs from "node:fs";
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless", "--no-sandbox"],
});
const previous = process.env.LIGHTHOUSE_PAGE
  ? JSON.parse(
      fs.readFileSync("docs/releases/2026-09-11/performance.json", "utf8"),
    ).results
  : [];
const results = [...previous];
try {
  for (const [name, path] of Object.entries({
    home: "/",
    category: "/ai-prompts/women",
    collection: "/collections/creative-transformations",
    detail: "/ai-prompts/social-media/one-day-four-possible-worlds",
    creator: "/create",
  })) {
    if (process.env.LIGHTHOUSE_PAGE && name !== process.env.LIGHTHOUSE_PAGE)
      continue;
    const r = await lighthouse("http://localhost:4313" + path, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      blockedUrlPatterns: [
        "*googlesyndication*",
        "*googletagmanager*",
        "*google-analytics*",
        "*doubleclick*",
        "*fundingchoicesmessages*",
      ],
    });
    fs.writeFileSync(
      `docs/releases/2026-09-11/lighthouse-${name}.json`,
      r.report,
    );
    const scores = Object.fromEntries(
      Object.entries(r.lhr.categories).map(([k, v]) => [
        k,
        Math.round(v.score * 100),
      ]),
    );
    const index = results.findIndex((item) => item.name === name);
    if (index >= 0) results.splice(index, 1, { name, path, scores });
    else results.push({ name, path, scores });
    console.log(name, scores);
  }
} finally {
  await chrome.kill();
}
fs.writeFileSync(
  "docs/releases/2026-09-11/performance.json",
  JSON.stringify(
    {
      measured_at: new Date().toISOString(),
      mode: "Local production build, mobile Lighthouse simulation, Google requests blocked; lab measurements, not field Core Web Vitals",
      results,
    },
    null,
    2,
  ),
);
