import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import type { Prompt } from "@/types/content";
const prompts = JSON.parse(
  fs.readFileSync("content/additions/gen-z-prompts.json", "utf8"),
) as Prompt[];
test.skip(
  process.env.PICMAGIC_SOCIAL_PREVIEW !== "true",
  "Explicit local social preview only",
);
for (const p of prompts) {
  test(`local Gen Z preview: ${p.slug}`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const route = `/ai-prompts/social-media/${p.slug}`;
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(p.title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://picmagic.in${route}`,
    );
    await page
      .getByRole("button", { name: "Copy prompt", exact: true })
      .click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      p.prompt_text,
    );
    await page
      .getByRole("button", { name: `Save ${p.title}`, exact: true })
      .first()
      .click();
    await page.locator("#share-options summary").click();
    await page.getByRole("button", { name: "Copy link", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      `https://picmagic.in${route}`,
    );
    await expect
      .poll(() =>
        page
          .locator(".detail-visual img")
          .evaluate((n: HTMLImageElement) => n.complete && n.naturalWidth > 0),
      )
      .toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    for (const width of [375, 430, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect
        .poll(() =>
          page
            .locator(".detail-visual img")
            .evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
        )
        .toBe(true);
      await page
        .locator(".detail-visual img")
        .evaluate(async (image: HTMLImageElement) => {
          await image.decode();
        });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      await page.screenshot({
        quality: 82,
        path: `docs/audits/gen-z-discovery-2026-09-15/media/qa/${p.slug}-page-${width}.jpg`,
      });
    }
    await page.goto("/saved");
    await expect(
      page.getByRole("heading", { name: p.title, exact: true }),
    ).toBeVisible();
  });
}
test("Gen Z drafts stay out of the sitemap and use existing collection routes", async ({
  page,
  request,
}) => {
  for (const slug of ["creative-transformations", "cinematic", "studio"]) {
    expect((await page.goto(`/collections/${slug}`))?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of prompts) expect(sitemap).not.toContain(p.slug);
  expect(
    (
      await request.get("/ai-prompts/social-media/a-face-on-the-scanner-glass")
    ).status(),
  ).toBe(404);
});
