import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";

test("official social links are accessible and server rendered", async ({
  page,
}) => {
  const response = await page.goto("/contact");
  const html = await response!.text();
  const profiles = [
    ["Instagram", "https://www.instagram.com/picmagic.in/"],
    ["Facebook", "https://www.facebook.com/picmagic.in/"],
  ];
  for (const [name, href] of profiles) {
    expect(html).toContain(href);
    const links = page.getByRole("link", { name, exact: true });
    await expect(links).toHaveCount(2);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("href", href);
      await link.focus();
      await expect(link).toBeFocused();
    }
  }
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const organization = jsonLd
    .flatMap((value) => JSON.parse(value)["@graph"] ?? [])
    .find((entity) => entity["@type"] === "Organization");
  expect(organization.sameAs).toEqual(profiles.map(([, href]) => href));
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .locator(".site-footer")
      .screenshot({
        path: test.info().outputPath(`social-footer-${width}.png`),
      });
  }
  expect(
    (
      await new AxeBuilder({ page })
        .include("main")
        .include(".site-footer")
        .analyze()
    ).violations,
  ).toEqual([]);
});
