import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
test.skip(
  process.env.E2E_BASE_URL !== "http://localhost:4315",
  "Affiliate browser QA requires the isolated local production build",
);
const portrait = "/ai-prompts/women/golden-hour-draped-in-tradition";

test("both copy buttons preserve text and offer dismissible ordinary tool links", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(portrait);
  const prompt = (await page.locator(".prompt-text").textContent())!.trim();
  const section = page.getByRole("region", {
    name: "Create this look with AI",
  });
  await expect(section.locator(".affiliate-tool-card")).toHaveCount(3);
  await expect(section.getByText(/ordinary links/)).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Choose an AI tool after copying" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Copy complete prompt", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(prompt);
  const chooser = page.getByRole("region", {
    name: "Choose an AI tool after copying",
  });
  await expect(
    chooser.getByText(/Nothing is transferred automatically/),
  ).toBeVisible();
  for (const link of await chooser.getByRole("link").all()) {
    expect(await link.getAttribute("target")).toBe("_blank");
    expect(await link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(await link.getAttribute("href")).not.toContain("?");
  }
  await chooser.getByRole("button", { name: "Dismiss tool choices" }).click();
  await expect(chooser).toHaveCount(0);
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await expect(chooser).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(prompt);
  await expect(
    page.getByRole("button", {
      name: "Save Golden hour, draped in tradition",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Share this look" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("manual-copy fallback remains usable without revealing the chooser", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Denied")) },
      configurable: true,
    }),
  );
  await page.goto(portrait);
  await page
    .getByRole("button", { name: "Copy complete prompt", exact: true })
    .click();
  await expect(
    page.getByText(/Select the prompt text and copy it manually/),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Choose an AI tool after copying" }),
  ).toHaveCount(0);
});

test("photo, product, couple and reel routes match intent; blog preserves author and schema", async ({
  page,
}) => {
  await page.goto("/ai-prompts/couple/a-little-rain-a-lot-of-romance");
  await expect(
    page.locator('.recommended-tools [data-provider="photoroom"]'),
  ).toHaveCount(0);
  await page.goto(
    "/ai-prompts/product-photography/perfume-the-water-sculpture",
  );
  await expect(
    page.locator('.recommended-tools [data-provider="photoroom"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('.recommended-tools [data-provider="chatgpt"]'),
  ).toHaveCount(0);
  await page.goto("/reel-prompts/a-birthday-in-three-little-moments");
  await expect(
    page.getByRole("heading", { name: "Turn this idea into a video" }),
  ).toBeVisible();
  await expect(
    page.locator('.recommended-tools [data-provider="runway"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('.recommended-tools [data-provider="invideo"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('.recommended-tools [data-provider="fotor"]'),
  ).toHaveCount(0);
  await expect(page.getByText(/Gen-4: 5 or 10 seconds/)).toBeVisible();
  await page.goto("/blog/create-ai-photos-with-chatgpt");
  await expect(
    page.getByRole("heading", { name: "Tools you can use for AI photos" }),
  ).toBeVisible();
  await expect(
    page.locator('.recommended-tools [data-provider="invideo"]'),
  ).toHaveCount(0);
  await expect(page.locator(".blog-byline")).toContainText(
    "PicMagic Editorial",
  );
  await expect(page.locator(".blog-primary")).toBeVisible();
  const article = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(article.join(" ")).toContain('"BlogPosting"');
  expect(article.join(" ")).not.toContain("Affiliate");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/blog\/create-ai-photos-with-chatgpt$/,
  );
});

test("consented affiliate events omit destinations and stop on withdrawal", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const queue: unknown[][] = [];
  await page.exposeFunction("captureAffiliateEvent", (x: unknown[]) =>
    queue.push(x),
  );
  await page.addInitScript(() => {
    const layer: unknown[] = [];
    layer.push = (...entries: unknown[]) => {
      for (const entry of entries)
        void (
          window as unknown as { captureAffiliateEvent: (x: unknown[]) => void }
        ).captureAffiliateEvent(Array.from(entry as ArrayLike<unknown>));
      return Array.prototype.push.apply(layer, entries);
    };
    window.dataLayer = layer;
  });
  // All vendor scripts are stubbed by fixtures; all tool destinations are intercepted.
  await context.route(
    /https:\/\/(chatgpt\.com|gemini\.google\.com|www\.fotor\.com)/,
    (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<title>Local tool stub</title>",
      }),
  );
  await page.goto(`${portrait}?personal=do-not-send`);
  const section = page.getByRole("region", {
    name: "Create this look with AI",
  });
  const open = section.getByRole("link", { name: "Open ChatGPT (new tab)" });
  const popup1 = page.waitForEvent("popup");
  await open.click();
  await (await popup1).close();
  expect(queue.filter((x) => String(x[1]).startsWith("affiliate_"))).toEqual(
    [],
  );
  await page
    .getByRole("button", { name: "Allow analytics", exact: true })
    .click();
  await section.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () => queue.filter((x) => x[1] === "affiliate_tool_impression").length,
    )
    .toBeGreaterThan(0);
  const popup2 = page.waitForEvent("popup");
  await open.click();
  await (await popup2).close();
  await expect
    .poll(() => queue.filter((x) => x[1] === "affiliate_outbound_click").length)
    .toBe(1);
  const data = queue.filter((x) => String(x[1]).startsWith("affiliate_"));
  expect(data.some((x) => x[1] === "affiliate_tool_click")).toBe(true);
  expect(
    data.every(
      (x) =>
        (x[2] as { affiliate_enabled: boolean }).affiliate_enabled === false,
    ),
  ).toBe(true);
  expect(JSON.stringify(data)).not.toMatch(
    /do-not-send|ref=|https:\/\/chatgpt|Create a photograph|uploaded reference/,
  );
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reject analytics", exact: true })
    .click();
  const count = queue.filter((x) =>
    String(x[1]).startsWith("affiliate_"),
  ).length;
  const popup3 = page.waitForEvent("popup");
  await open.click();
  await (await popup3).close();
  expect(
    queue.filter((x) => String(x[1]).startsWith("affiliate_")).length,
  ).toBe(count);
});

test("desktop and narrow layouts retain keyboard access and no axe violations", async ({
  page,
}) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(portrait);
    const section = page.getByRole("region", {
      name: "Create this look with AI",
    });
    await section.scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const link = section.getByRole("link").first();
    await link.focus();
    await expect(link).toBeFocused();
    expect(
      (await new AxeBuilder({ page }).include(".recommended-tools").analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({
      path: `.release-private/affiliate-qa/detail-${width}.png`,
      fullPage: true,
    });
  }
});

test("protected admin changes priority and enablement without activating referrals", async ({
  page,
  browser,
}) => {
  test.skip(
    !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
    "Disposable local admin required",
  );
  await page.goto("/admin/affiliate-tools");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page
    .getByLabel("Email", { exact: true })
    .fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page
    .getByRole("link", { name: "Affiliate Tools", exact: true })
    .click();
  await expect(page.getByText(/Monetization is disabled/)).toBeVisible();
  const record = page
    .locator(".affiliate-admin-record")
    .filter({ has: page.locator("summary").filter({ hasText: /^Fotor ·/ }) });
  const save = async () => {
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.request().method() === "POST" &&
          response.url().includes("/admin/affiliate-tools"),
      ),
      record
        .getByRole("button", { name: "Save provider", exact: true })
        .click(),
    ]);
    await expect(
      record.getByRole("button", { name: "Save provider", exact: true }),
    ).toBeEnabled();
  };
  await record.locator("summary").click();
  await record
    .getByRole("combobox", { name: "Application status", exact: true })
    .selectOption("Approved");
  await save();
  await expect(record.getByRole("alert")).toContainText(
    "Approval requires acceptance evidence",
  );
  await record
    .getByRole("combobox", { name: "Application status", exact: true })
    .selectOption("Application required");
  await record
    .getByRole("textbox", { name: /^Issued affiliate URL/ })
    .fill("https://evil.example/?ref=test");
  await save();
  await expect(record.getByRole("alert")).toContainText("URL rejected");
  await record.getByRole("textbox", { name: /^Issued affiliate URL/ }).fill("");
  await record
    .getByRole("spinbutton", { name: /^Display priority/ })
    .fill("40");
  await record
    .getByLabel("Enable editorial recommendation", { exact: true })
    .uncheck();
  await save();
  await expect(record.getByRole("status")).toContainText("Provider saved");
  const visitor = await browser.newContext();
  const publicPage = await visitor.newPage();
  await publicPage.goto(`${process.env.E2E_BASE_URL}${portrait}`);
  await expect(
    publicPage.locator('.recommended-tools [data-provider="fotor"]'),
  ).toHaveCount(0);
  await page.reload();
  await record.locator("summary").click();
  await expect(
    record.getByRole("spinbutton", { name: /^Display priority/ }),
  ).toHaveValue("40");
  await record
    .getByRole("spinbutton", { name: /^Display priority/ })
    .fill("50");
  await record
    .getByLabel("Enable editorial recommendation", { exact: true })
    .check();
  await save();
  await expect(record.getByRole("status")).toContainText("Provider saved");
  await publicPage.reload();
  await expect(
    publicPage.locator('.recommended-tools [data-provider="fotor"]'),
  ).toHaveCount(1);
  await visitor.close();
});
