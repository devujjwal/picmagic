import { spawnSync } from "node:child_process";
import fs from "node:fs";
const origin = process.env.E2E_BASE_URL || "http://localhost:4313";
for (const [name, path] of Object.entries({
  home: "/",
  category: "/ai-prompts/women",
  detail: "/ai-prompts/women/golden-hour-draped-in-tradition",
  creator: "/create",
})) {
  const output = `docs/qa/lighthouse-${name}.json`;
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
  console.log(
    name,
    Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    ),
  );
}
