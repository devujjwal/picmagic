import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
const origin = "http://localhost:4313";
const before = await (await fetch(origin + "/api/search")).json();
let cached = false;
try {
  const pause = spawnSync("docker", ["pause", "supabase_rest_picmagic"], {
    stdio: "ignore",
  });
  if (pause.status)
    throw new Error("Could not pause the disposable local REST service");
  const response = await fetch(origin + "/api/search", {
    signal: AbortSignal.timeout(5000),
  });
  const after = await response.json();
  cached = response.ok && JSON.stringify(before) === JSON.stringify(after);
} finally {
  spawnSync("docker", ["unpause", "supabase_rest_picmagic"], {
    stdio: "ignore",
  });
}
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:4314/search");
await page.getByRole("button", { name: "Try again", exact: true }).waitFor();
const retry = await page.getByText("A little pause in the magic.").isVisible();
const noSeeds = (await page.locator(".prompt-card").count()) === 0;
await browser.close();
const result = {
  cachedCatalogSurvivesRestOutage: cached,
  uncachedFailureShowsRetry: retry,
  uncachedFailureDoesNotSubstituteSeeds: noSeeds,
};
await fs.writeFile("docs/qa/outage.json", JSON.stringify(result, null, 2));
console.log(result);
if (Object.values(result).some((v) => !v)) process.exitCode = 1;
