import { test, expect } from "@playwright/test";

test("discovery waits for navigation instead of speculatively requesting pages", async ({
  page,
}) => {
  await page.route(
    /googlesyndication|googletagmanager|google-analytics|doubleclick/,
    (route) => route.abort(),
  );
  const prefetches: string[] = [];
  page.on("request", (request) => {
    if (
      request.headers()["next-router-prefetch"] === "1" ||
      request.headers().purpose === "prefetch"
    )
      prefetches.push(request.url());
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // Opening a client control ensures hydration completed before measuring links.
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  for (let y = 0; y < 9000; y += 700) {
    await page.evaluate((offset) => window.scrollTo(0, offset), y);
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(1000);
  expect(prefetches).toEqual([]);
  await page.locator(".prompt-card h3 a").first().click();
  await expect(
    page.getByRole("button", { name: "Copy prompt", exact: true }),
  ).toBeVisible();
  expect(prefetches).toEqual([]);
});
