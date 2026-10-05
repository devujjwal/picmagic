import { test, expect, stubGoogleServices } from "./fixtures";

test("creator exposes a useful no-script route", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3002",
  });
  await stubGoogleServices(context);
  const page = await context.newPage();
  await page.goto("/create");
  await test.info().attach("creator-no-script", {
    body: await page.locator("main").innerHTML(),
    contentType: "text/html",
  });
  await page.screenshot({
    path: test.info().outputPath("creator-no-script.png"),
    fullPage: true,
  });
  await expect(
    page.locator("noscript p").filter({ visible: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "browse ready-to-use photo prompts" })
    .click();
  await expect(page).toHaveURL(/\/ai-prompts$/);
  await context.close();
});
test("last finite page exposes previous navigation", async ({ page }) => {
  await page.goto("/ai-prompts?page=3");
  await expect(
    page.getByRole("link", { name: "Previous page" }),
  ).toHaveAttribute("href", "/ai-prompts?page=2");
  await expect(
    page.getByText("Server page 3 of 3 · appended results shown above", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "More looks to explore", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath("last-page.png"),
    fullPage: true,
  });
});
test("source-preserving prompt and legacy sample limitations render", async ({
  page,
}) => {
  await page.goto("/ai-prompts/professional/your-everyday-with-better-light");
  await expect(
    page.getByText(/Output aspect ratio: preserve the source aspect ratio/),
  ).toBeVisible();
  await page.goto("/reel-prompts/the-fragrance-reveal");
  await expect(
    page.getByRole("heading", {
      name: "What the existing video sample demonstrates",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Practical guidance" }),
  ).toContainText("roughly five-second");
  await expect(page.locator("script#picmagic-adsense")).toHaveCount(0);
});
