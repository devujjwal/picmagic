import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";
import { prompts as allPrompts } from "./catalogue";
import { isConsolidatedPrompt } from "../../content/consolidations";
const count = allPrompts.filter(
  (p) =>
    p.is_published &&
    p.prompt_type !== "reel" &&
    p.prompt_type !== "video" &&
    !isConsolidatedPrompt(p),
).length;
const fit = async (page: Page) =>
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
async function finish(page: Page, scope = ".wizard") {
  const wizard = page.locator(scope);
  await expect(
    wizard.getByRole("button", { name: "Continue", exact: true }),
  ).toBeVisible();
  while (
    await wizard.getByRole("button", { name: "Continue", exact: true }).count()
  )
    await wizard.getByRole("button", { name: "Continue", exact: true }).click();
  await wizard
    .getByRole("button", { name: "Generate prompt", exact: true })
    .click();
  return wizard.locator(".prompt-text");
}
for (const width of [1180, 390, 320]) {
  test(`postrelease wizard/copy/Shorten/age/focus ${width}px`, async ({
    page,
    context,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() =>
      localStorage.setItem("picmagic:analytics-consent", "no"),
    );
    for (const path of [
      "/create",
      "/enhance-photo",
      "/reel-prompts#reel-creator",
    ]) {
      await page.goto(path);
      const wizard = page.locator(".wizard");
      if (path === "/enhance-photo")
        await wizard
          .getByRole("button", { name: "Improve Lighting", exact: true })
          .click();
      await wizard
        .getByRole("button", { name: "Continue", exact: true })
        .click();
      await expect(wizard.locator("h2")).toBeFocused();
      await wizard.getByRole("button", { name: "Back", exact: true }).click();
      await expect(wizard.locator("h2")).toBeFocused();
      const output = await finish(page);
      const text = await output.textContent();
      expect(text).toContain("preserve every supplied person's apparent age");
      expect(text).not.toContain("22–30");
      expect(text?.match(/(?<!NO )REFERENCE PRESENT:/g)).toHaveLength(1);
      await wizard
        .getByRole("button", { name: "Copy prompt", exact: true })
        .click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        text,
      );
      await wizard
        .getByRole("button", { name: "Shorten prompt", exact: true })
        .click();
      const shortened = await output.textContent();
      expect(shortened!.length).toBeLessThan(
        text!.length * (path.startsWith("/reel-prompts") ? 0.9 : 0.85),
      );
      expect(shortened).toContain("apparent age");
      expect(shortened).toContain("hairline");
      await wizard
        .getByRole("button", { name: /Copy prompt|Prompt copied/, exact: true })
        .click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        shortened,
      );
      await fit(page);
      await output.screenshot({
        path: test
          .info()
          .outputPath(`output-${path.split(/[\/#]/)[1]}-${width}.png`),
      });
    }
    await page.goto("/create");
    const wizard = page.locator(".wizard");
    await expect(
      wizard.getByRole("button", { name: "Continue", exact: true }),
    ).toBeVisible();
    while (
      await wizard
        .getByRole("button", { name: "Continue", exact: true })
        .count()
    )
      await wizard
        .getByRole("button", { name: "Continue", exact: true })
        .click();
    await wizard
      .getByRole("combobox", { name: "Age intent" })
      .selectOption("Older adult");
    await wizard
      .getByRole("button", { name: "Generate prompt", exact: true })
      .click();
    await expect(wizard.locator(".prompt-text")).toContainText(
      "explicitly selected creative age transformation — approximately 60–75",
    );
    await page.goto("/reel-prompts#friends-trip-creator");
    await page
      .locator("#friends-trip-creator")
      .getByRole("button", { name: "Create friends trip prompt" })
      .click();
    await expect(
      page.locator("#friends-trip-creator .prompt-text"),
    ).toContainText("preserve every supplied person's apparent age");
    await fit(page);
  });
  test(`postrelease progress/navigation/filter/history ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() =>
      localStorage.setItem("picmagic:analytics-consent", "no"),
    );
    await page.goto("/ai-prompts");
    expect(count).toBe(72);
    await expect(
      page.getByRole("status").filter({ hasText: "Showing looks" }),
    ).toHaveText(`Showing looks 1–24 of ${count}.`);
    await page.locator("[data-load-more-sentinel]").scrollIntoViewIfNeeded();
    await expect(page.locator(".prompt-card")).toHaveCount(48);
    await expect(
      page.getByRole("status").filter({ hasText: "Showing looks" }),
    ).toHaveText(`Showing looks 1–48 of ${count}.`);
    await page.locator("[data-load-more-sentinel]").scrollIntoViewIfNeeded();
    await expect(page.locator(".prompt-card")).toHaveCount(count);
    await expect(
      page.getByRole("status").filter({ hasText: "Showing looks" }),
    ).toHaveText(`Showing looks 1–72 of ${count}.`);
    const nav = page.getByRole("navigation", { name: "Prompt pages" });
    await nav.getByRole("link", { name: "Page 2", exact: true }).click();
    await expect(page).toHaveURL(/page=2$/);
    await expect(page.locator(".prompt-card")).toHaveCount(24);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://picmagic.in/ai-prompts?page=2",
    );
    await nav.getByRole("link", { name: "Page 3", exact: true }).click();
    await expect(page.locator(".prompt-card")).toHaveCount(24);
    await expect(
      page.getByRole("status").filter({ hasText: "Showing looks" }),
    ).toHaveText("Showing looks 49–72 of 72.");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://picmagic.in/ai-prompts?page=3",
    );
    await page.goBack();
    await expect(page).toHaveURL(/page=2$/);
    await page.goForward();
    await expect(page).toHaveURL(/page=3$/);
    await nav.getByRole("link", { name: "Previous page" }).click();
    await expect(page).toHaveURL(/page=2$/);
    await page
      .getByRole("navigation", { name: "Explore categories" })
      .getByRole("link", { name: "Women", exact: true })
      .click();
    await expect(page.locator("h1")).toContainText(/women/i);
    await fit(page);
    expect((await page.goto("/ai-prompts?page=4"))?.status()).toBe(404);
  });
  test(`postrelease menu/search/save/privacy/detail-copy ${width}px`, async ({
    page,
    context,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByRole("button", { name: "No thanks", exact: true }).click();
    if (width < 600) {
      const menu = page.getByLabel("Open navigation", { exact: true });
      await menu.focus();
      await page.keyboard.press("Enter");
      await expect(
        page.getByRole("navigation", { name: "Mobile menu" }),
      ).toBeVisible();
      await page
        .getByRole("navigation", { name: "Mobile menu" })
        .getByRole("link", { name: "Explore", exact: true })
        .click();
    } else {
      const link = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Explore", exact: true });
      await link.focus();
      await expect(link).toBeFocused();
      await page.keyboard.press("Enter");
    }
    await expect(page).toHaveURL(/ai-prompts$/);
    await page.goto("/ai-prompts/women/golden-hour-draped-in-tradition");
    const text = await page.locator(".prompt-text").textContent();
    await page
      .getByRole("button", { name: "Copy prompt", exact: true })
      .click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      text,
    );
    await page
      .getByRole("button", {
        name: "Save Golden hour, draped in tradition",
        exact: true,
      })
      .first()
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
    await page.goto("/search");
    await page
      .getByRole("searchbox", { name: "Search photo ideas", exact: true })
      .fill("couple rain");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.locator(".prompt-card").first()).toBeVisible();
    await page
      .getByRole("searchbox", { name: "Search photo ideas", exact: true })
      .fill("zzzauditnomatchzzz");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.locator(".prompt-card")).toHaveCount(0);
    await expect(page.locator(".empty-state")).toBeVisible();
    await fit(page);
    await page.goto("/privacy");
    await page
      .getByRole("button", { name: "Cookie preferences", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog
      .getByRole("button", { name: "Reject analytics", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Cookie preferences", exact: true })
      .click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    await page.reload();
    expect(
      await page.evaluate(() =>
        localStorage.getItem("picmagic:analytics-consent"),
      ),
    ).toBe("no");
    await expect(
      page.locator("script#picmagic-ga4,script#picmagic-adsense"),
    ).toHaveCount(0);
    await fit(page);
  });
}
