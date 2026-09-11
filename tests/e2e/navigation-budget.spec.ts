import { test, expect } from "./fixtures";

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
  const save = page.getByRole("button", {
    name: "Save The Bottle Inside a Moment of Water",
    exact: true,
  });
  await save.first().click();
  await expect(
    page
      .getByRole("button", {
        name: "Unsave The Bottle Inside a Moment of Water",
        exact: true,
      })
      .first(),
  ).toBeVisible();
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
