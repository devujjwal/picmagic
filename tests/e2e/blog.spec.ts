import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const drafts: { slug: string }[] = JSON.parse(
  fs.readFileSync("content/blog/articles.json", "utf8"),
);
test.skip(
  process.env.E2E_BLOG_QA !== "true",
  "Requires isolated disposable blog fixtures and stubbed local build",
);
test.beforeEach(() => {
  expect(process.env.E2E_BASE_URL).toBe("http://localhost:4311");
});
const slugs = [
  "qa-blog-direct",
  "qa-blog-men",
  "qa-blog-women",
  "qa-blog-couple",
];
test("drafts and review content stay outside public routes, APIs and discovery", async ({
  page,
  request,
}) => {
  for (const a of drafts)
    expect((await request.get(`/blog/${a.slug}`)).status()).toBe(404);
  expect(
    (await request.get("/blog-preview/create-ai-photos-with-chatgpt")).status(),
  ).toBe(404);
  await page.goto("/admin/blog");
  await expect(page).toHaveURL(/\/admin\/login/);
  const search = await (await request.get("/api/search")).text();
  for (const a of drafts) expect(search).not.toContain(a.slug);
  await page.goto("/blog");
  for (const a of drafts)
    await expect(page.locator(`a[href='/blog/${a.slug}']`)).toHaveCount(0);
  await expect(page.locator("a[href='/blog/qa-blog-noindex']")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Evidence before conclusions." }),
  ).toBeVisible();
});
test("published articles have canonical metadata, visible schema and sitemap membership", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get("/sitemap-pages.xml")).text();
  for (const slug of slugs)
    expect(sitemap).toContain(`https://picmagic.in/blog/${slug}`);
  expect(sitemap).not.toContain("qa-blog-noindex");
  for (const a of drafts) expect(sitemap).not.toContain(`/blog/${a.slug}`);
  await page.goto("/blog/qa-blog-direct");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://picmagic.in/blog/qa-blog-direct",
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(schemas.join()).toContain('"@type":"BlogPosting"');
  expect(schemas.join()).toContain('"@type":"BreadcrumbList"');
  expect(schemas.join()).not.toContain("FAQPage");
  await page.goto("/blog/qa-blog-noindex");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
for (const [slug, cta, targetType, path] of [
  [
    "qa-blog-direct",
    "Try City Lights",
    "prompt",
    "/ai-prompts/men/city-lights-main-character-energy",
  ],
  ["qa-blog-men", "Explore men’s photo ideas", "category", "/ai-prompts/men"],
] as const) {
  test(`complete consented organic funnel: ${targetType}`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const queue: unknown[][] = [];
    await page.exposeFunction("captureBlogAnalytics", (entry: unknown[]) =>
      queue.push(entry),
    );
    await page.addInitScript(() => {
      localStorage.setItem("picmagic:analytics-consent", "yes");
      const layer: unknown[] = [];
      layer.push = (...entries: unknown[]) => {
        for (const e of entries)
          void (
            window as unknown as {
              captureBlogAnalytics: (entry: unknown[]) => Promise<void>;
            }
          ).captureBlogAnalytics(Array.from(e as ArrayLike<unknown>));
        return Array.prototype.push.apply(layer, entries);
      };
      window.dataLayer = layer;
    });
    await page.goto(`/blog/${slug}?private=do-not-collect`, {
      referer: "https://www.google.co.in/search?q=do-not-collect",
    });
    await expect.poll(() => queue.some((e) => e[1] === "blog_view")).toBe(true);
    await page.getByRole("link", { name: cta, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    if (targetType === "category")
      await page
        .getByRole("link", {
          name: "City lights, main-character energy",
          exact: true,
        })
        .first()
        .click();
    await page
      .getByRole("button", { name: "Copy prompt", exact: true })
      .click();
    await expect
      .poll(() => queue.some((e) => e[1] === "prompt_copy"))
      .toBe(true);
    const clickEvent =
      targetType === "prompt" ? "blog_prompt_click" : "blog_collection_click";
    for (const event of ["blog_view", clickEvent, "prompt_view", "prompt_copy"])
      expect(queue.some((e) => e[1] === event)).toBe(true);
    const copy = queue.find((e) => e[1] === "prompt_copy")?.[2] as Record<
      string,
      unknown
    >;
    expect(copy.article_slug).toBe(slug);
    expect(copy.cta_role).toBe("primary");
    expect(copy.destination_type).toBe(targetType);
    expect(copy.entry_source).toBe("organic_search");
    expect(JSON.stringify(queue)).not.toContain("do-not-collect");
    await page
      .getByRole("button", { name: "Cookie preferences", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Reject analytics", exact: true })
      .click();
    expect(
      await page.evaluate(() =>
        sessionStorage.getItem("picmagic:blog-funnel:v1"),
      ),
    ).toBeNull();
    const count = queue.filter((e) => e[1] === "prompt_copy").length;
    await page
      .getByRole("button", { name: /^(Copy prompt|Prompt copied)$/ })
      .click();
    expect(queue.filter((e) => e[1] === "prompt_copy").length).toBe(count);
  });
}
test("no-consent visits emit no blog measurement; scroll milestones deduplicate after consent", async ({
  page,
}) => {
  await page.goto("/blog/qa-blog-direct");
  expect(await page.evaluate(() => (window.dataLayer || []).length)).toBe(0);
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("picmagic:blog-funnel:v1"),
    ),
  ).toBeNull();
  await page
    .getByRole("button", { name: "Allow analytics", exact: true })
    .click();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window.dataLayer || [])
            .map((e) => Array.from(e as ArrayLike<unknown>))
            .filter((e) => e[1] === "blog_scroll_depth").length,
      ),
    )
    .toBe(4);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.scrollTo(0, document.body.scrollHeight);
  });
  expect(
    await page.evaluate(
      () =>
        (window.dataLayer || [])
          .map((e) => Array.from(e as ArrayLike<unknown>))
          .filter((e) => e[1] === "blog_scroll_depth").length,
    ),
  ).toBe(4);
});
test("article and hub layouts are accessible at all requested widths", async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/blog",
      ...[...slugs, "qa-blog-noindex"].map((s) => `/blog/${s}`),
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
  }
});
test("admin edits structured blocks, validates, previews and reverses publication locally", async ({
  page,
  request,
}) => {
  await page.goto("/admin/login");
  await page
    .getByLabel("Email", { exact: true })
    .fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/blog/new");
  const slug = `qa-admin-blog-${Date.now()}`;
  await page.getByLabel("Title", { exact: true }).fill("QA structured guide");
  await page.getByLabel("Slug", { exact: true }).fill(slug);
  await page
    .getByRole("combobox", { name: "New block", exact: true })
    .selectOption("quick_answer");
  await page.getByRole("button", { name: "Add block", exact: true }).click();
  await page
    .getByLabel("Quick answer", { exact: true })
    .fill("A short useful answer from a structured block.");
  await page.getByRole("button", { name: "Save article", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Article saved" }),
  ).toBeVisible();
  expect((await request.get(`/blog/${slug}`)).status()).toBe(404);
  await page
    .getByRole("link", { name: "Preview saved article", exact: true })
    .click();
  await expect(
    page.getByText("Private draft preview.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("A short useful answer from a structured block.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.goBack();
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("published");
  await expect(
    page.getByLabel("Indexable (normal publication)", { exact: true }),
  ).toBeChecked();
  // Past date avoids local VM clock skew while exercising user-entered publication dates.
  await page
    .getByLabel("First publication date", { exact: false })
    .fill("2026-10-05T00:00");
  await page.getByRole("button", { name: "Save article", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Article saved" }),
  ).toBeVisible();
  await expect
    .poll(async () => (await request.get(`/blog/${slug}`)).status())
    .toBe(200);
  expect(await (await request.get("/sitemap-pages.xml")).text()).toContain(
    `/blog/${slug}`,
  );
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("review");
  await page.getByRole("button", { name: "Save article", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Article saved" }),
  ).toBeVisible();
  await expect
    .poll(async () => (await request.get(`/blog/${slug}`)).status())
    .toBe(404);
  expect(await (await request.get("/sitemap-pages.xml")).text()).not.toContain(
    `/blog/${slug}`,
  );
});
