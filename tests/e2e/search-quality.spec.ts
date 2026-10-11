import { test, expect, stubGoogleServices } from "./fixtures";
import { createRequire } from "node:module";
import AxeBuilder from "@axe-core/playwright";

const { JSDOM } = createRequire(import.meta.url)("jsdom") as {
  JSDOM: new (
    html: string,
    options?: { contentType: string },
  ) => {
    window: { document: Document; close(): void };
  };
};

const routes = [
  "/",
  "/ai-prompts",
  "/ai-prompts/men",
  "/ai-prompts/women/durga-puja-pandal-portrait",
  "/collections",
  "/collections/indian-festivals",
  "/reel-prompts",
  "/create",
  "/enhance-photo",
  "/festival-poster-maker",
  "/guides/reference-photo-prompts",
];
if (process.env.E2E_PUBLIC_BLOG === "true")
  routes.push("/blog", "/blog/diwali-durga-puja-dussehra-business-posters");

test("shared public templates expose content, links and canonical metadata in source HTML", async ({
  request,
}) => {
  for (const path of routes) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const dom = new JSDOM(await response.text());
    const d = dom.window.document;
    expect(d.title, path).toBeTruthy();
    expect(
      d.querySelector('meta[name="description"]')?.getAttribute("content"),
      path,
    ).toBeTruthy();
    expect(d.querySelectorAll("h1"), path).toHaveLength(1);
    expect(d.querySelectorAll("a[href]").length, path).toBeGreaterThan(10);
    expect(
      d.querySelector('link[rel="canonical"]')?.getAttribute("href"),
      path,
    ).toBe(`https://picmagic.in${path === "/" ? "" : path}`);
    expect(
      [...d.querySelectorAll('meta[name="robots"]')].some((x) =>
        x.getAttribute("content")?.includes("noindex"),
      ),
      path,
    ).toBe(false);
    for (const s of d.querySelectorAll('script[type="application/ld+json"]'))
      expect(() => JSON.parse(s.textContent || "")).not.toThrow();
    if (path.includes("pandal-portrait"))
      expect(
        d.querySelector(".prompt-text")?.textContent?.length,
      ).toBeGreaterThan(200);
    dom.window.close();
  }
});

test("missing resources and exhausted pagination are real noindex 404s", async ({
  request,
}) => {
  for (const path of [
    "/ai-prompts?page=999",
    "/ai-prompts/men?page=999",
    "/collections/indian-festivals?page=999",
    "/reel-prompts?page=999",
    "/blog/missing-test",
    "/ai-prompts/men/missing-test",
    "/ai-prompts/missing-test",
    "/collections/missing-test",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    const dom = new JSDOM(await response.text());
    const robots = [
      ...dom.window.document.querySelectorAll('meta[name="robots"]'),
    ].map((x) => x.getAttribute("content"));
    expect(
      robots.some((x) => x?.includes("noindex")),
      path,
    ).toBe(true);
    expect(
      robots.some((x) => /^index(?:,|$)/.test(x || "")),
      path,
    ).toBe(false);
    dom.window.close();
  }
});

test("pagination is crawlable without JavaScript and remains self-canonical", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3002",
  });
  await stubGoogleServices(context);
  const page = await context.newPage();
  await page.goto("/ai-prompts?page=2&utm_source=qa", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://picmagic.in/ai-prompts?page=2",
  );
  await expect(
    page.getByRole("navigation", { name: "Prompt pages" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Previous page", exact: true }).click();
  await expect(page).toHaveURL(/\/ai-prompts$/);
  await page.goto("/festival-poster-maker?design=diwali");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://picmagic.in/festival-poster-maker",
  );
  await expect(
    page
      .getByRole("navigation", { name: "Festival artwork prompts" })
      .getByRole("link"),
  ).toHaveCount(4);
  await context.close();
});

test("sitemaps and robots exclude private routes and all advertised local destinations resolve", async ({
  request,
}) => {
  test.setTimeout(120000);
  const xml = await (await request.get("/sitemap-pages.xml")).text();
  const dom = new JSDOM(xml, { contentType: "text/xml" });
  const urls = [...dom.window.document.querySelectorAll("loc")].map(
    (x) => x.textContent!,
  );
  expect(new Set(urls).size).toBe(urls.length);
  for (const url of urls) {
    expect(url).not.toMatch(/\/(admin|blog-preview|search|saved)(?:\/|$)|\?/);
    const response = await request.get(new URL(url).pathname);
    expect(response.status(), url).toBe(200);
    const page = new JSDOM(await response.text());
    const canonical = page.window.document
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href");
    expect(new URL(canonical!).href, url).toBe(new URL(url).href);
    expect(
      [
        ...page.window.document.querySelectorAll(
          'meta[name="robots"], meta[name="googlebot"]',
        ),
      ].some((meta) => meta.getAttribute("content")?.includes("noindex")),
      url,
    ).toBe(false);
    page.window.close();
  }
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Sitemap: https://picmagic.in/sitemap.xml",
  );
  for (const path of ["/search?q=test", "/saved", "/admin/login"]) {
    const response = await request.get(path);
    expect(await response.text()).toContain("noindex");
  }
  expect(
    (
      await request.get(
        "/blog-preview/diwali-durga-puja-dussehra-business-posters",
      )
    ).status(),
  ).toBe(404);
  dom.window.close();
});

test("host aliases and trailing slashes redirect to established URLs", async ({
  request,
}) => {
  for (const host of ["www.picmagic.in", "picmagic-in.netlify.app"]) {
    const response = await request.get("/ai-prompts/men", {
      headers: { host },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(
      "https://picmagic.in/ai-prompts/men",
    );
  }
  const response = await request.get("/ai-prompts/men/", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/ai-prompts/men");
});

for (const width of [320, 390, 768, 1440])
  test(`representative template rendering at ${width}px`, async ({
    page,
  }, info) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/ai-prompts/men",
      "/ai-prompts/women/durga-puja-pandal-portrait",
      "/collections/indian-festivals",
      "/festival-poster-maker",
      ...(process.env.E2E_PUBLIC_BLOG === "true"
        ? ["/blog/diwali-durga-puja-dussehra-business-posters"]
        : []),
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      if (path === "/festival-poster-maker") {
        await expect(
          page.getByRole("button", { name: "Download PNG" }),
        ).toBeEnabled();
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
      }
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: info.outputPath(`${path.replaceAll("/", "-")}-${width}.png`),
          fullPage: true,
        });
    }
    expect(errors).toEqual([]);
  });
