import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.skip(
  process.env.E2E_ADS_ENABLED !== "true",
  "Requires a build with PicMagic advertising configured",
);

test("advertising requires consent, loads once, and stops after revocation", async ({
  page,
}) => {
  let scriptRequests = 0;
  await page.route("**/pagead/js/adsbygoogle.js*", async (route) => {
    scriptRequests++;
    await route.fulfill({
      contentType: "application/javascript",
      body: "window.__picmagicAdScriptLoaded = true;",
    });
  });
  await page.goto("/");
  await expect(
    page.getByRole("complementary", { name: "Privacy preferences" }),
  ).toBeVisible();
  expect(scriptRequests).toBe(0);
  const axe = await new AxeBuilder({ page })
    .include(".consent")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.getByRole("button", { name: "Allow optional cookies" }).click();
  await expect.poll(() => scriptRequests).toBe(1);
  await expect(page.locator(".consent")).toHaveCount(0);
  const placement = page
    .getByRole("complementary", { name: "Advertisement", exact: true })
    .first();
  await placement.scrollIntoViewIfNeeded();
  await expect(placement.locator("ins.adsbygoogle")).toHaveAttribute(
    "data-picmagic-requested",
    "true",
  );
  await expect(placement.locator("ins.adsbygoogle")).toHaveAttribute(
    "data-ad-client",
    "ca-pub-4114304022167819",
  );
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Reject optional cookies" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reject optional cookies" }).click();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(scriptRequests).toBe(1);
  await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
});

test("creator and administrator pages do not load advertising", async ({
  page,
}) => {
  let scriptRequests = 0;
  await page.route("**/pagead/js/adsbygoogle.js*", async (route) => {
    scriptRequests++;
    await route.abort();
  });
  await page.addInitScript(() =>
    localStorage.setItem("picmagic:advertising-consent:v1", "yes"),
  );
  for (const path of ["/create", "/admin/login"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.locator("ins.adsbygoogle, script#picmagic-adsense"),
    ).toHaveCount(0);
  }
  expect(scriptRequests).toBe(0);
});

test("blocked storage never authorizes advertising", async ({ page }) => {
  let scriptRequests = 0;
  await page.route("**/pagead/js/adsbygoogle.js*", async (route) => {
    scriptRequests++;
    await route.abort();
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.locator("ins.adsbygoogle, script#picmagic-adsense"),
  ).toHaveCount(0);
  expect(scriptRequests).toBe(0);
});
