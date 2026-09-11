import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const id = "f64b0a8b-6c59-4e0a-a3c8-457867f8dd19";
test("friends trip creator adapts people and destination without loading a video", async ({
  page,
}, testInfo) => {
  const videos: string[] = [];
  page.on("request", (r) => {
    if (/\.mp4(?:\?|$)/.test(r.url())) videos.push(r.url());
  });
  await page.goto("/reel-prompts");
  const creator = page.locator("#friends-trip-creator");
  await creator.scrollIntoViewIfNeeded();
  await creator.getByLabel("Number of friends").fill("5");
  await creator.getByLabel("Place name").fill("GOA");
  await creator.getByLabel("Mood").selectOption("Joyful");
  await creator
    .getByRole("button", { name: "Create friends trip prompt" })
    .click();
  await expect(creator.locator(".prompt-text")).toContainText(
    "Use the uploaded reference photos of exactly 5 friends",
  );
  await expect(creator.locator(".prompt-text")).toContainText(
    "Final cinematic title:\n\nGOA",
  );
  await expect(creator.locator(".prompt-text")).not.toContainText("LADAKH");
  expect(videos).toEqual([]);
  const violations = (
    await new AxeBuilder({ page }).include("#friends-trip-creator").analyze()
  ).violations;
  expect(violations).toEqual([]);
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `width ${width}`,
    ).toBe(true);
  }
  await page.setViewportSize({
    width: testInfo.project.name === "mobile" ? 375 : 1440,
    height: 1000,
  });
  await creator.getByRole("heading", { level: 2 }).scrollIntoViewIfNeeded();
  fs.mkdirSync("docs/qa/friends-trip", { recursive: true });
  await page.screenshot({
    path: `docs/qa/friends-trip/creator-${testInfo.project.name}.png`,
  });
});
test("friends collection remains noindex and source-reference draft is unavailable publicly", async ({
  page,
}) => {
  const collection = await page.goto("/collections/friends-travel-reels");
  expect(collection?.status()).toBe(404);
  const response = await page.goto(
    "/reel-prompts/cinematic-ladakh-friends-trip",
  );
  expect(response?.status()).toBe(404);
  const sitemap = await page.request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("cinematic-ladakh-friends-trip");
  expect(await sitemap.text()).not.toContain("friends-travel-reels");
  await page.goto(`/admin/preview/${id}`);
  await expect(page).toHaveURL(/admin\/login/);
});
test("admin reviews all four friends and template metadata without publishing incomplete media", async ({
  page,
}, testInfo) => {
  test.skip(
    !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
    "Disposable QA admin required",
  );
  test.skip(
    process.env.E2E_BASE_URL !== "http://localhost:4313",
    "Local QA only",
  );
  await page.goto("/admin/login");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto(`/admin/preview/${id}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Cinematic Ladakh Friends Trip Reel",
  );
  await expect(page.locator(".detail-visual-note")).toContainText(
    "Original reference photograph of 4 friends",
  );
  await expect(page.locator(".detail-visual img")).toBeVisible();
  expect(await page.locator("video").count()).toBe(0);
  expect(
    await page.locator('meta[name="robots"]').getAttribute("content"),
  ).toContain("noindex");
  await page.screenshot({
    path: `docs/qa/friends-trip/reference-${testInfo.project.name}.png`,
  });
  await page.goto(`/admin/prompts/${id}`);
  await expect(page.getByLabel("People count", { exact: true })).toHaveValue(
    "4",
  );
  await expect(page.getByLabel("Place name", { exact: true })).toHaveValue(
    "LADAKH",
  );
  await expect(page.getByLabel("Poster role")).toHaveValue("source-reference");
  await expect(page.getByLabel("Template JSON")).toContainText(
    "cinematic-friends-trip-v1",
  );
});
