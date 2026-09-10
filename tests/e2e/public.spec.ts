import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("home → category → detail → copy", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page
    .getByRole("link", { name: "Explore photo ideas", exact: true })
    .first()
    .click();
  await page
    .getByRole("navigation", { name: "Explore categories" })
    .getByRole("link", { name: "Women", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Golden hour, draped in tradition" })
    .getByRole("link")
    .click();
  await expect(page.locator("h1")).toHaveText(
    "Golden hour, draped in tradition",
  );
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Prompt copied" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Create a photograph",
  );
});
test("creator produces a useful result", async ({ page }) => {
  await page.goto("/create");
  await page.getByRole("button", { name: "Man", exact: true }).click();
  for (let i = 0; i < 6; i++)
    await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Generate prompt" }).click();
  await expect(
    page.getByRole("heading", { name: "Here’s your magic prompt." }),
  ).toBeVisible();
  await expect(page.locator(".prompt-text")).toContainText("4:5");
});
test("search → prompt detail", async ({ page }) => {
  await page.goto("/search");

  await page
    .getByRole("searchbox", { name: "Search photo ideas", exact: true })
    .fill("couple rain");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".prompt-card")).toHaveCount(2);
  await page.locator(".prompt-card h3 a").first().click();
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy prompt", exact: true }),
  ).toBeVisible();
});
test("save → saved → unsave survives reload", async ({ page }) => {
  await page.goto("/ai-prompts/women");
  await page
    .getByRole("button", {
      name: "Save Golden hour, draped in tradition",
      exact: true,
    })
    .click();
  await page.goto("/saved");
  await expect(page.locator(".prompt-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".prompt-card")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Unsave Golden hour, draped in tradition",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your next favourite is out there." }),
  ).toBeVisible();
});
test("collection and prompt namespaces never overlap", async ({ page }) => {
  await page.goto("/collections/romantic");
  await expect(page.locator("h1")).toHaveText("A little more romance");
  const response = await page.goto("/ai-prompts/couple/romantic");
  expect(response?.status()).toBe(404);
});
test("admin is protected and preview is noindex", async ({ page }) => {
  await page.goto("/admin/prompts");
  await expect(page).toHaveURL(/\/admin\/login/);
  expect(
    await page.locator('meta[name="robots"]').getAttribute("content"),
  ).toContain("noindex");
});
test("reel creator produces timed scenes", async ({ page }) => {
  await page.goto("/reel-prompts#reel-creator");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "5 seconds", exact: true }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Generate prompt" }).click();
  await expect(page.locator("#reel-creator .reel-scene")).toHaveCount(2);
  await expect(page.locator("#reel-creator .reel-scene").last()).toContainText(
    "5s",
  );
});
test("detail accessibility", async ({ page }) => {
  await page.goto("/ai-prompts/women/golden-hour-draped-in-tradition");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
test("homepage accessibility and no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("pagination progressively loads more and keeps canonical ownership", async ({
  page,
}) => {
  await page.goto("/ai-prompts");
  await expect(page.locator(".prompt-card")).toHaveCount(24);
  await expect(
    page.getByRole("link", { name: "Load more looks" }),
  ).toHaveAttribute("href", "/ai-prompts?page=2");
  await page.getByRole("link", { name: "Load more looks" }).click();
  await expect(page.locator(".prompt-card")).toHaveCount(44);
  await page.goto("/ai-prompts?page=2");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://picmagic.in/ai-prompts?page=2",
  );
});
test("blocked storage and failed clipboard leave usable controls", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    });
  });
  await page.goto("/ai-prompts/women/golden-hour-draped-in-tradition");
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await expect(
    page.getByText(
      "Copy unavailable. Select the prompt text and copy it manually.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Prompt copied", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Save Golden hour, draped in tradition",
      exact: true,
    })
    .first()
    .click();
  await expect(
    page
      .getByRole("button", {
        name: "Unsave Golden hour, draped in tradition",
        exact: true,
      })
      .first(),
  ).toBeVisible();
});
test("broken preview keeps title navigation available", async ({ page }) => {
  await page.route("**/_next/image?**", (route) => route.abort());
  await page.goto("/ai-prompts/women");
  await expect(page.getByText("Preview unavailable").first()).toBeVisible();
  await page.locator(".prompt-card h3 a").first().click();
  await expect(page.locator("h1")).toBeVisible();
});
test("legacy reel category redirects to its own namespace", async ({
  page,
}) => {
  await page.goto("/ai-prompts/reels");
  await expect(page).toHaveURL(/\/reel-prompts$/);
});

test("enhancement keeps identity and age preservation by default", async ({
  page,
}) => {
  await page.goto("/enhance-photo");
  await page
    .getByRole("button", { name: "Improve Lighting", exact: true })
    .click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Generate prompt", exact: true })
    .click();
  await expect(page.locator(".prompt-text")).toContainText(/age/i);
  await expect(page.locator(".prompt-text")).toContainText(/identity/i);
});
test("pagination works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3002",
  });
  const page = await context.newPage();
  await page.goto("/ai-prompts");
  await expect(page.locator(".prompt-card")).toHaveCount(24);
  await page.getByRole("link", { name: "Load more looks" }).click();
  await expect(page).toHaveURL(/\?page=2$/);
  await expect(page.locator(".prompt-card")).toHaveCount(20);
  await context.close();
});
