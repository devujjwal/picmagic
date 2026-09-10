import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const origin = process.env.E2E_BASE_URL || "http://localhost:4312";
const browser = await chromium.launch();
const results = [];
for (const width of [320, 375, 430, 768, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const path of [
    "/",
    "/ai-prompts",
    "/ai-prompts/women/golden-hour-draped-in-tradition",
    "/create",
  ]) {
    await page.goto(origin + path);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    results.push({ width, path, overflow });
    if (path === "/" && [375, 1440].includes(width))
      await page.screenshot({
        path: `docs/qa/home-${width}.png`,
        fullPage: false,
      });
  }
  await page.close();
}
const zoom = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await zoom.goto(origin);
await zoom.evaluate(() => (document.documentElement.style.zoom = "2"));
results.push({
  width: 1440,
  zoom: "200%",
  overflow: await zoom.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
});
await zoom.screenshot({ path: "docs/qa/home-200-percent.png" });
await browser.close();
await fs.writeFile("docs/qa/responsive.json", JSON.stringify(results, null, 2));
console.log(results);
if (results.some((r) => r.overflow)) process.exitCode = 1;
