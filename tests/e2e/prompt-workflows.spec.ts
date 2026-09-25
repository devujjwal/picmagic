import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import trial from "../../content/prompt-trial.json" with { type: "json" };

test("documented trial has accessible images, exact copy inputs and responsive layout", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/guides/prompt-trial");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Two prompts, one fictional person: what actually happened",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://picmagic.in/guides/prompt-trial",
  );
  await expect(page.locator("article figure")).toHaveCount(3);
  for (const record of trial.records) {
    await page
      .getByText(`Exact input: ${record.title}`, { exact: true })
      .click();
    const detail = page
      .locator("details")
      .filter({
        has: page.getByText(`Exact input: ${record.title}`, { exact: true }),
      });
    await detail
      .getByRole("button", { name: "Copy trial input", exact: true })
      .click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(record.inputText);
    await page
      .getByText(`Exact input: ${record.title}`, { exact: true })
      .click();
  }
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
  await expect(page.locator(".toast.visible")).toHaveCount(0);
  for (const width of [375, 430, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: test.info().outputPath(`trial-${width}.png`),
      fullPage: true,
    });
  }
  for (const img of await page.locator("article figure img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});

test("existing prompt keeps copy, save and workflow corrections", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/ai-prompts/social-media/a-fold-around-you-profile");
  await expect(
    page.getByRole("heading", { name: "Try this look, step by step" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(trial.records[0].promptText);
  await page
    .getByText("Hair or chin disappears in the circular crop", { exact: true })
    .click();
  await expect(
    page.getByText(/Expand the square framing with more background/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save A Fold Around You", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /Saved|Unsave|Remove from saved/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "documented ChatGPT trial" }).click();
  await expect(page).toHaveURL(/\/guides\/prompt-trial$/);
});
