import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
test("homepage drops the link wall and collection recommendations lead to populated pages", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Find your kind of beautiful" }),
  ).toHaveCount(0);
  for (const path of ["/ai-prompts", "/reel-prompts"]) {
    await page.goto(path);
    const section = page.getByRole("region", {
      name: "Explore collections",
      exact: true,
    });
    const links = section.getByRole("link");
    // The disposable QA content has one ready photo and one ready reel collection.
    await expect(section).toBeVisible();
    const hrefs = await links.evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute("href")!),
    );
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.length).toBeLessThanOrEqual(4);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    await section.scrollIntoViewIfNeeded();
    expect(
      (
        await new AxeBuilder({ page })
          .include('section[aria-label="Explore collections"]')
          .analyze()
      ).violations,
    ).toEqual([]);
    for (const width of [320, 375, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.setViewportSize({
      width: testInfo.project.name === "mobile" ? 375 : 1440,
      height: 900,
    });
    await section.scrollIntoViewIfNeeded();
    fs.mkdirSync("docs/qa/collection-navigation", { recursive: true });
    await page.screenshot({
      path: `docs/qa/collection-navigation/${path.slice(1)}-${testInfo.project.name}.png`,
    });
    for (const href of hrefs) {
      const response = await page.goto(href);
      expect(response?.status()).toBe(200);
      expect(await page.locator(".prompt-card").count()).toBeGreaterThanOrEqual(
        4,
      );
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  }
});
