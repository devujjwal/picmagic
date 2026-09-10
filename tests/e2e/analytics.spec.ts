import { test, expect } from "@playwright/test";
test.skip(
  process.env.E2E_GA_ENABLED !== "true",
  "Requires a build configured with a GA4 measurement ID",
);
test("analytics consent, sanitized SPA pageviews, events and revocation", async ({
  page,
  context,
}) => {
  await page.route("**/pagead/js/adsbygoogle.js*", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "/* AdSense stub */",
    }),
  );
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  let requests = 0;
  await page.route("**/gtag/js*", async (route) => {
    requests++;
    await route.fulfill({
      contentType: "application/javascript",
      body: "window.__gaVendorLoaded = true;",
    });
  });
  await page.addInitScript(() =>
    localStorage.setItem("picmagic:advertising-consent:v1", "no"),
  );
  await page.goto("/?email=do-not-send@example.com");
  expect(requests).toBe(0);
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Allow analytics", exact: true })
    .click();
  await expect.poll(() => requests).toBe(1);
  await page
    .getByRole("link", { name: "Explore photo ideas", exact: true })
    .first()
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.dataLayer!.filter(
            (x) => (x as ArrayLike<unknown>)[1] === "page_view",
          ).length,
      ),
    )
    .toBe(2);
  await page
    .getByRole("navigation", { name: "Explore categories" })
    .getByRole("link", { name: "Women", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.dataLayer!.filter(
            (x) => (x as ArrayLike<unknown>)[1] === "page_view",
          ).length,
      ),
    )
    .toBe(3);
  await page
    .getByRole("heading", { name: "Golden hour, draped in tradition" })
    .getByRole("link")
    .click();
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.dataLayer!.some(
          (x) => (x as ArrayLike<unknown>)[1] === "prompt_copy",
        ),
      ),
    )
    .toBe(true);
  const queue = await page.evaluate(() =>
    window.dataLayer!.map((x) => Array.from(x as ArrayLike<unknown>)),
  );
  const views = queue.filter((x) => x[0] === "event" && x[1] === "page_view");
  expect(views).toHaveLength(4);
  expect(
    new Set(views.map((x) => (x[2] as { page_location: string }).page_location))
      .size,
  ).toBe(4);
  expect(queue.some((x) => x[1] === "prompt_copy")).toBe(true);
  expect(JSON.stringify(queue)).not.toContain("do-not-send");
  expect(JSON.stringify(queue)).not.toContain("Create a photograph");
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reject analytics", exact: true })
    .click();
  await page.reload();
  expect(requests).toBe(1);
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
});
test("admin and unavailable storage never load GA4", async ({ page }) => {
  await page.route("**/pagead/js/adsbygoogle.js*", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "/* AdSense stub */",
    }),
  );
  let requests = 0;
  await page.route("**/gtag/js*", async (r) => {
    requests++;
    await r.abort();
  });
  await page.addInitScript(() =>
    localStorage.setItem("picmagic:analytics-consent", "yes"),
  );
  await page.goto("/admin/login");
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw Error("blocked");
      },
    }),
  );
  await page.goto("/");
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
  expect(requests).toBe(0);
});
