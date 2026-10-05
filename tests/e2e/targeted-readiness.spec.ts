import { test, expect, stubGoogleServices } from "./fixtures";

test("privacy choices remain reachable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3002",
  });
  await stubGoogleServices(context);
  const page = await context.newPage();
  await page.goto("/contact");
  await page
    .getByRole("link", { name: "Cookie preferences", exact: true })
    .click();
  await expect(page).toHaveURL(/\/privacy#privacy-choices$/);
  await expect(
    page.getByText(/Cookie preferences requires JavaScript/),
  ).toBeVisible();
  await context.close();
});

test("analytics-only privacy controls open and reject without loading ads", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("picmagic:analytics-consent", "no"),
  );
  await page.goto("/privacy");
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Optional analytics", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Advertising privacy choices" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Reject analytics", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator("script#picmagic-adsense")).toHaveCount(0);
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("picmagic:analytics-consent"),
    ),
  ).toBe("no");
});

test("rain guidance matches the complete prompt wardrobe", async ({ page }) => {
  await page.goto("/ai-prompts/couple/a-little-rain-a-lot-of-romance");
  await expect(
    page.getByRole("region", { name: "Practical guidance" }),
  ).toContainText("charcoal wool coat");
  await expect(
    page.getByRole("region", { name: "Practical guidance" }),
  ).not.toContainText("navy coat");
});
