import { test, expect } from "./fixtures";
test.skip(
  process.env.E2E_GA_ENABLED !== "true",
  "Requires a build configured with a GA4 measurement ID",
);
test("poster exports are consent-gated and never include personal fields", async ({
  page,
}) => {
  await page.goto(
    "/festival-poster-maker?design=diwali&email=private@example.test",
  );
  await page
    .getByRole("textbox", { name: "Company / name", exact: true })
    .fill("PRIVATE COMPANY");
  await page
    .getByRole("textbox", { name: "Email (optional)", exact: true })
    .fill("private@example.test");
  const download = async () => {
    const ready = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Download PNG", exact: true })
      .click();
    await ready;
  };
  const events = () =>
    page.evaluate(() =>
      (window.dataLayer || []).map((x) => Array.from(x as ArrayLike<unknown>)),
    );
  await download();
  expect((await events()).some((x) => x[1] === "poster_export")).toBe(false);
  await page
    .getByRole("button", { name: "Allow analytics", exact: true })
    .click();
  await download();
  const queue = await events();
  const exports = queue.filter((x) => x[1] === "poster_export");
  expect(exports).toHaveLength(1);
  expect(exports[0][2]).toMatchObject({
    poster_design: "diwali",
    poster_format: "portrait",
    poster_language: "en",
  });
  expect(JSON.stringify(queue)).not.toMatch(
    /PRIVATE COMPANY|private@example|email=/,
  );
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  // Revocation deliberately reloads to unload the vendor and clear its queue.
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("button", { name: "Reject analytics", exact: true }).click(),
  ]);
  await download();
  expect((await events()).filter((x) => x[1] === "poster_export")).toHaveLength(
    0,
  );
});
test("analytics consent, sanitized pageviews across navigation, events and revocation", async ({
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
  // Capture across documents: advertising-isolated links may navigate without SPA state.
  const queue: unknown[][] = [];
  await page.exposeFunction("captureAnalyticsForTest", (entry: unknown[]) =>
    queue.push(entry),
  );
  await page.addInitScript(() => {
    const layer: unknown[] = [];
    layer.push = (...entries: unknown[]) => {
      for (const entry of entries) {
        void (
          window as unknown as {
            captureAnalyticsForTest: (value: unknown[]) => Promise<void>;
          }
        ).captureAnalyticsForTest(Array.from(entry as ArrayLike<unknown>));
      }
      return Array.prototype.push.apply(layer, entries);
    };
    window.dataLayer = layer;
  });
  await page.addInitScript(() =>
    localStorage.setItem("picmagic:advertising-consent:v1", "no"),
  );
  await page.goto("/?email=do-not-send@example.com");
  expect(requests).toBe(0);
  await page
    .getByRole("button", { name: "Allow analytics", exact: true })
    .click();
  await expect.poll(() => requests).toBe(1);
  await page
    .getByRole("link", { name: "Explore photo ideas", exact: true })
    .first()
    .click();
  await expect
    .poll(() => queue.filter((x) => x[1] === "page_view").length)
    .toBe(2);
  await page
    .getByRole("navigation", { name: "Explore categories" })
    .getByRole("link", { name: "Women", exact: true })
    .click();
  await expect
    .poll(() => queue.filter((x) => x[1] === "page_view").length)
    .toBe(3);
  await page
    .getByRole("heading", { name: "Golden hour, draped in tradition" })
    .getByRole("link")
    .click();
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await expect.poll(() => queue.some((x) => x[1] === "prompt_copy")).toBe(true);
  const views = queue.filter((x) => x[0] === "event" && x[1] === "page_view");
  expect(views).toHaveLength(4);
  expect(
    new Set(views.map((x) => (x[2] as { page_location: string }).page_location))
      .size,
  ).toBe(4);
  expect(queue.some((x) => x[1] === "prompt_copy")).toBe(true);
  expect(JSON.stringify(queue)).not.toContain("do-not-send");
  expect(JSON.stringify(queue)).not.toContain("Create a photograph");
  expect(JSON.stringify(queue)).not.toContain("picmagic-discovery");
  const requestsBeforeRevocation = requests;
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reject analytics", exact: true })
    .click();
  await page.reload();
  expect(requests).toBe(requestsBeforeRevocation);
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
