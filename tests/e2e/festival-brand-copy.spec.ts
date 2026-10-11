import { test, expect } from "./fixtures";

test.skip(
  process.env.E2E_LOCAL_BLOG_PREVIEW !== "true" ||
    !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(process.env.E2E_BASE_URL || ""),
  "Copy review requires an explicitly enabled local seed dev preview, never production",
);

test("festival copy, complete metadata and guide render without overflow", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  for (const festival of ["diwali", "durga-puja", "dussehra"]) {
    await page.goto(`/ai-prompts/festival/${festival}-business-greeting`);
    await page.getByRole("button", { name: "Copy complete prompt", exact: true }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("[PASTE YOUR WEBSITE URL]");
    expect(copied).toContain("consistent thin-line icon");
    expect(copied).toContain("Do not redraw, imitate or regenerate it with AI");
    expect(copied).toContain("PicMagic-branded example");
    const preview = page.locator(`img[src*="${festival}-business-greeting-brand-"]`).first();
    await expect(preview).toBeVisible();
    expect(await preview.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await page.goto("/ai-prompts/women/durga-puja-pandal-portrait");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /your face and actual age\.$/);
  await page.goto("/blog-preview/diwali-durga-puja-dussehra-business-posters");
  await expect(page.getByRole("heading", { name: "For a custom branded poster, research the website first", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Use icons that explain real services", exact: true })).toBeVisible();
  await expect(page.locator("main")).toContainText("homepage request timed out");
  await expect(page.locator("main")).toContainText("not an export from the fixed-layout poster maker");
  await expect(page.locator('main img[src*="-business-greeting-brand-"]')).toHaveCount(3);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});
