import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import type { Article } from "../../lib/blog/schema";

const articles: Article[] = JSON.parse(
  fs.readFileSync("content/blog/articles.json", "utf8"),
);

test.skip(
  process.env.E2E_BLOG_DRAFTS_QA !== "true",
  "Requires explicitly enabled loopback-only private seed preview",
);
const drafts = articles.filter((a) => a.id.startsWith("fa710010-"));
test.beforeEach(() =>
  expect(process.env.E2E_BASE_URL).toBe("http://127.0.0.1:4312"),
);

for (const article of drafts) {
  test(`${article.slug}: responsive reading, accessible images, private preview`, async ({
    page,
    request,
  }, testInfo) => {
    test.setTimeout(120000);
    const remote: string[] = [];
    page.on("request", (r) => {
      if (r.url().startsWith("https://")) remote.push(r.url());
    });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      await page.goto(`/blog-preview/${article.slug}`);
      await expect(page.locator("h1")).toHaveText(article.title);
      await expect(
        page.getByText(
          "Private draft preview. Not published or indexable. Analytics and sharing are disabled.",
        ),
      ).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );
      const images = page.locator("[data-blog-body] figure img");
      await expect(images).toHaveCount(3);
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate((img: HTMLImageElement) => img.naturalWidth),
        ).toBeGreaterThan(0);
        expect(await image.getAttribute("alt")).toBeTruthy();
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      expect(violations).toEqual([]);
      expect(
        (
          await page
            .locator('script[type="application/ld+json"]')
            .allTextContents()
        ).join(),
      ).not.toContain("BlogPosting");
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: `.release-private/blog-festivals-20261010/${article.slug}-${width}-${testInfo.project.name}.png`,
          fullPage: true,
        });
      if (width === 390) {
        const toc = page.locator(".blog-mobile-toc summary");
        await toc.focus();
        await page.keyboard.press("Enter");
        await expect(page.locator(".blog-mobile-toc")).toHaveAttribute(
          "open",
          "",
        );
      }
    }
    expect(remote).toEqual([]);
    expect((await request.get(`/blog/${article.slug}`)).status()).toBe(404);
    const sitemap = await (await request.get("/sitemap-pages.xml")).text();
    expect(sitemap).not.toContain(`/blog/${article.slug}`);
  });
}

test("new article local links and editor destinations are valid", async ({
  request,
  page,
}) => {
  test.setTimeout(120000);
  const paths = new Set<string>();
  for (const a of drafts) {
    paths.add(a.primary_conversion.path);
    for (const b of a.body)
      if (b.type === "paragraph" && b.content)
        for (const s of b.content)
          if (s.href?.startsWith("/") && !s.href.startsWith("/blog/"))
            paths.add(s.href);
  }
  for (const path of paths)
    expect((await request.get(path)).status(), path).toBe(200);
  await page.goto(`/blog-preview/${drafts[0].slug}`);
  await page
    .getByRole("link", { name: "Personalize the Dussehra design", exact: true })
    .click();
  await expect(page).toHaveURL(/festival-poster-maker\?design=dussehra/);
  await expect(
    page.getByRole("combobox", { name: "Festival", exact: true }),
  ).toHaveValue("dussehra");
});
