import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
const path = "/reel-prompts/the-fragrance-reveal";
test.beforeEach(async ({ page }) => {
  await page.route("**/pagead/js/adsbygoogle.js*", (r) =>
    r.fulfill({
      contentType: "application/javascript",
      body: "/* test stub */",
    }),
  );
  await page.route("**/gtag/js*", (r) =>
    r.fulfill({
      contentType: "application/javascript",
      body: "/* test stub */",
    }),
  );
});
test("real preview has no server video source, plays on demand and pauses", async ({
  page,
  request,
}) => {
  const html = await (await request.get(path)).text();
  for (const tag of html.match(/<video\b[^>]*>/g) || [])
    expect(tag).not.toMatch(/\ssrc=/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const downloads: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/videos/")) downloads.push(r.url());
  });
  await page.goto(path);
  const visual = page.locator(".detail-visual");
  await expect(visual.locator("img")).toBeVisible();
  expect(downloads).toHaveLength(0);
  await visual.getByRole("button", { name: /Play video preview/ }).click();
  await expect
    .poll(() =>
      visual.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0);
  await expect(visual.locator("video")).toHaveJSProperty("muted", true);
  await expect(visual.locator("video")).toHaveAttribute("playsinline", "");
  await visual.getByRole("button", { name: /Pause video preview/ }).click();
  await expect(visual.locator("video")).not.toHaveAttribute("src", /./);
  expect(downloads.length).toBeGreaterThan(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("failed video retains the poster without a broken player", async ({
  page,
}) => {
  await page.route("**/videos/**", (r) => r.abort());
  await page.goto(path);
  const visual = page.locator(".detail-visual");
  await expect(visual.locator("video")).toHaveCount(0);
  await expect(visual.locator("img")).toBeVisible();
  await expect
    .poll(() =>
      visual.locator("img").evaluate((i: HTMLImageElement) => i.naturalWidth),
    )
    .toBeGreaterThan(0);
});
test("discovery with reduced motion downloads no preview videos", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const downloads: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/videos/")) downloads.push(r.url());
  });
  await page.goto("/reel-prompts");
  await expect(page.locator(".prompt-card")).not.toHaveCount(0);
  await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
  expect(downloads).toHaveLength(0);
  expect(await page.locator("video[src]").count()).toBe(0);
});

test("reel pagination is crawlable and owns distinct canonical URLs", async ({
  page,
  context,
}) => {
  await page.goto("/reel-prompts");
  const publicCount = await page.locator(".prompt-card").count();
  expect(publicCount).toBeGreaterThan(0);
  if (publicCount < 24) {
    // Editorial staging deliberately excludes unfinished media. A nonexistent
    // second page must 404 instead of duplicating page one for crawlers.
    const response = await page.goto("/reel-prompts?page=2");
    expect(response?.status()).toBe(404);
    return;
  }
  await expect(page.locator(".prompt-card")).toHaveCount(24);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://picmagic.in/reel-prompts",
  );
  const first = await page
    .locator(".prompt-card h3 a")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  await expect(
    page.getByRole("navigation", { name: "Pagination", exact: true }),
  ).toHaveCount(0);
  await page.goto("/reel-prompts?page=2");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://picmagic.in/reel-prompts?page=2",
  );
  const second = await page
    .locator(".prompt-card h3 a")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  expect(second.length).toBeGreaterThan(0);
  expect(second.some((href) => first.includes(href))).toBe(false);
  const noJs = await context
    .browser()!
    .newContext({ javaScriptEnabled: false });
  const plain = await noJs.newPage();
  await plain.goto(new URL("/reel-prompts?page=2", page.url()).href);
  await expect(plain.locator(".prompt-card")).not.toHaveCount(0);
  await noJs.close();
});
