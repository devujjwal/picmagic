import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";

test.skip(
  process.env.E2E_ADS_ENABLED !== "true",
  "Requires an advertising-configured build",
);

// Google is stubbed: these are integration-boundary tests, not assertions that
// Google approves or fills inventory. Original CMP signals must reach its tag.
for (const state of [
  "accepted",
  "rejected",
  "undecided",
  "outside-region",
  "unavailable",
] as const) {
  test(`Google controls ${state} advertising without PicMagic's old global gate`, async ({
    page,
  }) => {
    let scripts = 0;
    const data = {
      gdprApplies: state === "outside-region" ? false : true,
      cmpStatus: state === "unavailable" ? "error" : "loaded",
      eventStatus: state === "undecided" ? "cmpuishown" : "tcloaded",
      tcString: `opaque-${state}`,
      purpose: {
        consents: {
          1: state === "accepted",
          3: state === "accepted",
          4: state === "accepted",
        },
      },
      vendor: { consents: { 755: state === "accepted" } },
    };
    await page.addInitScript((data) => {
      localStorage.setItem("picmagic:analytics-consent", "no");
      (window as unknown as { cmpFixture: unknown }).cmpFixture = data;
      window.__tcfapi = (_command, _version, callback) =>
        callback(data, data.cmpStatus !== "error");
    }, data);
    await page.route("**/pagead/js/adsbygoogle.js*", async (route) => {
      scripts++;
      await route.fulfill({
        contentType: "application/javascript",
        body: "window.googlefc = window.googlefc || {};",
      });
    });
    await page.goto("/");
    await expect.poll(() => scripts).toBe(1);
    await expect(page.locator(".consent")).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const slot = page.locator(".ad-reserve").first();
    await slot.scrollIntoViewIfNeeded();
    const height = await slot.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    await expect(slot.locator("ins")).toHaveAttribute(
      "data-picmagic-requested",
      "true",
    );
    const result = await page.evaluate(() => ({
      signal: (window as unknown as { cmpFixture: unknown }).cmpFixture,
      pause: (window.adsbygoogle as unknown as { pauseAdRequests?: number })
        .pauseAdRequests,
      npa: (
        window.adsbygoogle as unknown as { requestNonPersonalizedAds?: number }
      ).requestNonPersonalizedAds,
      queued: window.adsbygoogle!.length,
      ga: Boolean(document.querySelector("#picmagic-ga4")),
    }));
    expect(result.signal).toEqual(data);
    expect(result.pause).toBeUndefined();
    expect(result.npa).toBeUndefined(); // No personalization override, especially no npa=0.
    expect(result.queued).toBeGreaterThan(0);
    expect(result.ga).toBe(false);
    await slot
      .locator("ins")
      .evaluate((el) => el.setAttribute("data-ad-status", "unfilled"));
    await expect(slot).toBeHidden();
    expect(await slot.evaluate((el) => el.getBoundingClientRect().height)).toBe(
      0,
    );
    expect(height).toBe(280);
    await expect(slot.locator("ins")).toBeHidden();
    await expect(
      page.getByText("Reserved advertisement placement"),
    ).toHaveCount(0);
  });
}

test("footer reopens Google choices; analytics never grants advertising consent", async ({
  page,
}) => {
  await page.route("**/pagead/js/adsbygoogle.js*", async (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `window.googlefc = window.googlefc || {};
      window.googlefc.showRevocationMessage = () => window.__reopened = true;
      const q = window.googlefc.callbackQueue || [];
      window.googlefc.callbackQueue = {push: x => x.CONSENT_API_READY()};
      q.forEach(x => x.CONSENT_API_READY());`,
    }),
  );
  await page.goto("/privacy");
  await expect(page.locator("script#picmagic-adsense")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .include(".privacy-dialog")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Advertising privacy choices", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { __reopened?: boolean }).__reopened,
      ),
    )
    .toBe(true);
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
});

test("legacy rejection is not silently changed to personalized ads", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("picmagic:advertising-consent:v1", "no"),
  );
  await page.route("**/pagead/js/adsbygoogle.js*", async (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "/* CMP pending */",
    }),
  );
  await page.goto("/");
  await expect(page.locator("script#picmagic-adsense")).toHaveCount(1);
  expect(
    await page.evaluate(
      () =>
        (window.adsbygoogle as unknown as { pauseAdRequests: number })
          .pauseAdRequests,
    ),
  ).toBe(1);
  expect(
    await page.evaluate(
      () =>
        (window.adsbygoogle as unknown as { requestNonPersonalizedAds: number })
          .requestNonPersonalizedAds,
    ),
  ).toBe(1);
});

test("excluded routes do not load ads, and blocked PicMagic storage leaves decisions to Google", async ({
  page,
}) => {
  let scripts = 0;
  await page.route("**/pagead/js/adsbygoogle.js*", async (route) => {
    scripts++;
    await route.fulfill({
      contentType: "application/javascript",
      body: "/* Google stub */",
    });
  });
  for (const path of ["/create", "/admin/login"]) {
    await page.goto(path);
    await expect(
      page.locator("ins.adsbygoogle, script#picmagic-adsense"),
    ).toHaveCount(0);
  }
  expect(scripts).toBe(0);
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw Error("blocked");
      },
    }),
  );
  await page.goto("/");
  await expect.poll(() => scripts).toBe(1);
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
});
