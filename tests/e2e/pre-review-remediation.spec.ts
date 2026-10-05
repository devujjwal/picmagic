import { test, expect, stubGoogleServices } from "./fixtures";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { prompts } from "./catalogue";
import { promptPath } from "../../types/content";
type CheckedPage = ReturnType<
  typeof import("../../scripts/optimization/rendered").expectedPages
>[number];
import {
  editorialRedirects,
  doubleExposureGuidePath,
} from "../../content/consolidations";
const require = createRequire(import.meta.url);
const changes =
  require("../../docs/audits/dot-public-2026-10-05/changes.json") as {
    id: string;
  }[];
const reels =
  require("../../docs/audits/dot-public-2026-10-05/reel-changes.json") as {
    id: string;
  }[];
const { JSDOM } = createRequire(import.meta.url)("jsdom") as {
  JSDOM: new (html: string) => {
    window: { document: Document; close(): void };
  };
};

test("all public HTML has valid canonicals, dates, links and consolidation responses", async ({
  request,
}) => {
  test.skip(
    test.info().project.name !== "chromium",
    "HTML is viewport-independent",
  );
  test.setTimeout(180_000);
  const pages = (
    JSON.parse(
      execFileSync(
        process.execPath,
        ["--import", "tsx", "scripts/pre-review-pages.ts"],
        { encoding: "utf8" },
      ),
    ) as CheckedPage[]
  ).filter((p) => p.status !== 404 && p.path !== "/admin/login");
  pages.push(
    ...["/privacy", "/terms", "/contact"].map((path) => ({
      path,
      status: 200,
      indexable: false,
    })),
  );
  const failures: string[] = [];
  const links = new Set<string>();
  const coverage: { path: string; status: number }[] = [];
  for (const expected of pages) {
    const response = await request.get(expected.path, { maxRedirects: 0 });
    const html = await response.text();
    coverage.push({ path: expected.path, status: response.status() });
    if (response.status() !== expected.status)
      failures.push(expected.path + ": unexpected status " + response.status());
    if (
      expected.redirect &&
      new URL(response.headers().location, "https://picmagic.in").pathname !==
        expected.redirect
    )
      failures.push(expected.path + ": incorrect redirect");
    if (response.status() !== 200) continue;
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    if (doc.querySelectorAll("h1").length !== 1)
      failures.push(expected.path + ": expected one H1");
    const canonical = doc
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href");
    const expectedUrl = new URL(expected.path, "https://picmagic.in");
    if (Number(expectedUrl.searchParams.get("page") || 1) <= 1)
      expectedUrl.search = "";
    if (canonical?.replace(/\/$/, "") !== expectedUrl.href.replace(/\/$/, ""))
      failures.push(expected.path + ": incorrect canonical " + canonical);
    if (
      !doc.title.trim() ||
      !doc.querySelector('meta[name="description"]')?.getAttribute("content")
    )
      failures.push(expected.path + ": missing title or description");
    const robots =
      doc.querySelector('meta[name="robots"]')?.getAttribute("content") || "";
    if (expected.indexable && robots.includes("noindex"))
      failures.push(expected.path + ": unexpected noindex");
    for (const anchor of dom.window.document.querySelectorAll("a[href]")) {
      const href = anchor.getAttribute("href")!;
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const url = new URL(href, "https://picmagic.in");
      const path = url.pathname + url.search;
      links.add(path);
      if (editorialRedirects.some((r) => r.source === url.pathname))
        failures.push(expected.path + ": stale link " + href);
    }
    const visit = (value: unknown) => {
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (!value || typeof value !== "object") return;
      const data = value as Record<string, unknown>;
      const dates: Record<string, number> = {};
      for (const key of ["dateCreated", "datePublished", "dateModified"]) {
        if (!(key in data)) continue;
        if (
          typeof data[key] !== "string" ||
          !Number.isFinite(Date.parse(data[key]))
        )
          failures.push(expected.path + ": invalid " + key);
        else dates[key] = Date.parse(data[key]);
      }
      for (const key of ["dateCreated", "datePublished"])
        if (
          dates.dateModified !== undefined &&
          dates[key] !== undefined &&
          dates.dateModified < dates[key]
        )
          failures.push(expected.path + ": dateModified precedes " + key);
      Object.values(data).forEach(visit);
    };
    for (const script of dom.window.document.querySelectorAll(
      'script[type="application/ld+json"]',
    ))
      visit(JSON.parse(script.textContent || ""));
    dom.window.close();
  }
  const visited = new Set(pages.map((p) => p.path));
  for (const href of links) {
    if (visited.has(href) || href.startsWith("/admin")) continue;
    const response = await request.get(href, { maxRedirects: 0 });
    if (response.status() >= 400)
      failures.push("Broken internal link: " + href + " " + response.status());
  }
  const sitemap = await (await request.get("/sitemap-pages.xml")).text();
  expect(sitemap).toContain(doubleExposureGuidePath);
  for (const r of editorialRedirects)
    expect(sitemap).not.toContain(r.source + "</loc>");
  await test.info().attach("public-html-coverage", {
    body: JSON.stringify(
      { coverage, linksChecked: links.size, failures },
      null,
      2,
    ),
    contentType: "application/json",
  });
  expect(failures).toEqual([]);
});

for (const width of [1280, 390, 320])
  test(`changed pages fit and guide images render at ${width}px`, async ({
    page,
    context,
  }) => {
    test.skip(
      test.info().project.name !== "chromium",
      "Explicit viewport matrix",
    );
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height: 900 });
    await context.addInitScript(() => {
      localStorage.setItem("picmagic:analytics-consent", "no");
    });
    const paths = [
      ...new Set([
        ...[...changes, ...reels]
          .map((change) => promptPath(prompts.find((p) => p.id === change.id)!))
          .filter((path) => !editorialRedirects.some((r) => r.source === path)),
        "/ai-prompts/professional",
        "/ai-prompts/festival",
        "/ai-prompts/family",
        "/ai-prompts/product-photography",
        "/ai-prompts/birthday",
        "/collections/cinematic",
        "/create",
        "/reel-prompts",
        doubleExposureGuidePath,
      ]),
    ];
    const overflows: string[] = [];
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator("main h1"), path).toHaveCount(1);
      if (
        !(await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ))
      ) {
        overflows.push(path);
        await test
          .info()
          .attach("overflow-" + path.replaceAll("/", "-"), {
            body: await page.screenshot({ fullPage: true }),
            contentType: "image/png",
          });
      }
      await expect(page.locator("#picmagic-adsense")).toHaveCount(0);
    }
    expect(overflows).toEqual([]);
    await page.goto(doubleExposureGuidePath);
    for (const image of await page
      .locator(".double-exposure-examples img")
      .all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await page.screenshot({
      path: test.info().outputPath(`double-exposure-${width}.png`),
      fullPage: true,
    });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "Copy complete prompt" }).click();
    await expect(
      page.getByRole("button", { name: "Prompt copied", exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      "exactly two intentional depictions",
    );
  });

test("consolidated guide and pagination work without JavaScript", async ({
  browser,
  request,
}) => {
  for (const r of editorialRedirects) {
    const response = await request.get(r.source, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(
      new URL(response.headers().location, "https://picmagic.in").pathname,
    ).toBe(r.destination);
  }
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3002",
  });
  await stubGoogleServices(context);
  const page = await context.newPage();
  await page.goto("/ai-prompts");
  await page
    .getByRole("link", {
      name: "Double-exposure fashion: one workflow, two styling examples",
    })
    .click();
  await expect(page).toHaveURL(new RegExp(doubleExposureGuidePath + "$"));
  await expect(page.locator(".prompt-text")).toContainText("one person");
  await page.goto("/ai-prompts?page=3");
  await page.getByRole("link", { name: "Previous page" }).click();
  await expect(page).toHaveURL(/page=2$/);
  await context.close();
});

test("320px controls and analytics withdrawal remain usable", async ({
  page,
  context,
}) => {
  test.skip(
    test.info().project.name !== "chromium",
    "Explicit narrow viewport",
  );
  await page.setViewportSize({ width: 320, height: 900 });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByLabel("Open navigation", { exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile menu", exact: true }),
  ).toBeVisible();
  await page.goto("/search");
  await page
    .getByRole("searchbox", { name: "Search photo ideas", exact: true })
    .fill("couple rain");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.locator(".prompt-card h3 a").first().click();
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Prompt copied", exact: true }),
  ).toBeVisible();
  await page.goto("/ai-prompts/women");
  await page
    .getByRole("button", {
      name: "Save Golden hour, draped in tradition",
      exact: true,
    })
    .click();
  await page.goto("/saved");
  await expect(page.locator(".prompt-card")).toHaveCount(1);
  await page
    .getByRole("button", {
      name: "Unsave Golden hour, draped in tradition",
      exact: true,
    })
    .click();
  await expect(page.locator(".prompt-card")).toHaveCount(0);
  await page.goto("/ai-prompts?page=3");
  await page.getByRole("link", { name: "Previous page", exact: true }).click();
  await expect(page).toHaveURL(/page=2$/);
  await page.goto("/create");
  await page.getByRole("button", { name: "Man", exact: true }).click();
  for (let step = 0; step < 6; step++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Generate prompt", exact: true })
    .click();
  await expect(page.locator(".prompt-text")).toContainText("4:5");
  await page.goto("/privacy");
  await page
    .getByRole("complementary", { name: "Optional analytics", exact: true })
    .getByRole("button", { name: "No thanks", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reject analytics", exact: true })
    .click();
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Allow analytics", exact: true })
    .click();
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reject analytics", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("picmagic:analytics-consent")),
    )
    .toBe("no");
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("script#picmagic-ga4")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("not allowed");
  await expect(page.locator("script#picmagic-adsense")).toHaveCount(0);
});
