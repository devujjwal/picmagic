import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import type { Prompt } from "@/types/content";
const prompts = [
  "social-prompts",
  "gen-z-prompts",
  "reference-impact-prompts",
  "double-exposure-fashion-prompts",
  "katana-streetwear-prompts",
  "giant-playlist-prompts",
].flatMap((file) =>
  JSON.parse(fs.readFileSync(`content/additions/${file}.json`, "utf8")),
) as Prompt[];
for (const p of prompts) {
  test(`local release-september15 preview: ${p.slug}`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const route = `/ai-prompts/${p.category_id}/${p.slug}`;
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(p.title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /^index, follow/,
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
      // A viewport change can replace srcset while decode() is pending.
      // Retry decoding the current candidate; a persistently broken image still fails.
      await expect
        .poll(() =>
          page
            .locator(".detail-visual img")
            .evaluate(async (image: HTMLImageElement) => {
              try {
                await image.decode();
                return image.complete && image.naturalWidth > 0;
              } catch {
                return false;
              }
            }),
        )
        .toBe(true);
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
        path: `docs/releases/2026-09-15/qa/${p.slug}-page-${width}.jpg`,
      });
    }
    await page.goto("/saved");
    await expect(
      page.getByRole("heading", { name: p.title, exact: true }),
    ).toBeVisible();
  });
}
test("Requested preview released prompts enter the sitemap and use existing collection routes", async ({
  page,
  request,
}) => {
  for (const slug of ["studio", "cinematic"]) {
    expect((await page.goto(`/collections/${slug}`))?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /^index, follow/,
    );
  }
  const sitemap = await (await request.get("/sitemap-pages.xml")).text();
  for (const p of prompts) expect(sitemap).toContain(p.slug);
  expect(
    (
      await request.get("/ai-prompts/social-media/a-face-on-the-scanner-glass")
    ).status(),
  ).toBe(404);
});

test("new release does not change homepage features", async ({ page }) => {
  await page.goto("/");
  // The local-only recent-history component receives the catalogue in the RSC
  // payload. Inspect rendered discovery links, not serialized candidate data.
  for (const p of prompts) {
    await expect(page.locator(`main a[href$="/${p.slug}"]`)).toHaveCount(0);
  }
});
