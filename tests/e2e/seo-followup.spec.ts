import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";

test("guide is accessible, linked, and readable at narrow widths", async ({
  page,
}) => {
  await page.goto("/guides/reference-photo-prompts");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "How to use a reference photo with an AI portrait prompt",
  );
  await expect(page.locator(".reference-guide > ol > li")).toHaveCount(5);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://picmagic.in/guides/reference-photo-prompts",
  );
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({
    width: test.info().project.name === "mobile" ? 375 : 1440,
    height: 900,
  });
  await page.screenshot({
    path: test.info().outputPath("reference-guide.png"),
    fullPage: true,
  });
  await page
    .getByRole("link", {
      name: "how PicMagic reviews and describes its library",
    })
    .click();
  await expect(page.locator("#editorial-methodology")).toBeVisible();
});

test("mixed-media memberships, breadcrumbs and social alt text survive SSR", async ({
  page,
}) => {
  for (const slug of [
    "one-city-one-beautiful-evening",
    "the-anniversary-slow-dance",
  ]) {
    await page.goto(`/reel-prompts/${slug}`);
    expect(await page.locator(".collection-links a").count()).toBeGreaterThan(
      0,
    );
    await expect(
      page.locator('meta[name="twitter:image:alt"]').first(),
    ).toHaveAttribute("content", /.+/);
  }
  await page.goto("/reel-prompts");
  await expect(
    page
      .getByRole("navigation", { name: "Breadcrumb", exact: true })
      .locator("li"),
  ).toHaveCount(2);
  await page.goto("/collections/cinematic");
  await expect(
    page
      .getByRole("navigation", { name: "Breadcrumb", exact: true })
      .getByRole("link", { name: "Collections", exact: true }),
  ).toHaveAttribute("href", "/collections");
});
