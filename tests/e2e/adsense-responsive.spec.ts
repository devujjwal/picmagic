import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/create", "/enhance-photo", "/ai-prompts/pets"]) {
  test(`reviewed publisher guidance is readable: ${path}`, async ({ page }) => {
    await page.goto(path);
    for (const width of [375, 430, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator(".ad-reserve")).toHaveCount(0);
      if (path !== "/ai-prompts/pets") {
        const guide = page.getByRole("region", {
          name: "Take the instructions to your image tool",
        });
        await expect(guide).toContainText(
          "PicMagic does not receive your reference photo",
        );
        await guide.scrollIntoViewIfNeeded();
        await guide.screenshot({
          path: test.info().outputPath(`${path.slice(1)}-${width}.png`),
        });
      } else {
        await page.screenshot({
          path: test.info().outputPath(`pets-${width}.png`),
          fullPage: true,
        });
      }
    }
    expect(
      (await new AxeBuilder({ page }).include("main").analyze()).violations,
    ).toEqual([]);
  });
}
