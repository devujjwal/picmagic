import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";

test("Magic Frame branding is accessible and fits the header and footer", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/about");
  const logos = page.getByRole("link", { name: "PicMagic home", exact: true });
  await expect(logos).toHaveCount(2);
  for (const logo of await logos.all()) {
    await expect(logo).toHaveAttribute("href", "/");
    await expect(logo).toHaveText("PicMagic");
    await expect(logo.locator(".brand-mark")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(logo.locator(".brand-wordmark")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(logo.locator("svg path")).toHaveCount(4);
  }
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(logos.first()).toBeVisible();
    const mark = await logos.first().boundingBox();
    const actions = await page.locator(".header-actions").boundingBox();
    expect(mark!.x + mark!.width).toBeLessThanOrEqual(actions!.x);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator(".site-header").screenshot({
      path: test.info().outputPath(`brand-header-${width}.png`),
    });
  }
  await logos.first().focus();
  await expect(logos.first()).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .include(".site-header")
        .include(".site-footer")
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .locator(".site-footer")
    .screenshot({ path: test.info().outputPath("brand-footer.png") });
  const favicon = await page
    .locator('link[rel="icon"][type="image/svg+xml"]')
    .getAttribute("href");
  expect(favicon).toContain("/icon.svg");
  const response = await page.request.get(favicon!);
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("M6 20H32V28");
  expect(errors).toEqual([]);
});
