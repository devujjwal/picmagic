import { test, expect, stubGoogleServices } from "./fixtures";
import { prompts } from "./catalogue";
import { promptPath } from "../../types/content";
import {
  orderExplore,
  selectHomepage,
} from "../../lib/prompts/discovery-rotation";
import { DISCOVERY_COOKIE } from "../../config/discovery";
import { isPromptSeoEligible } from "../../lib/seo/eligibility";
import type { BrowserContext, Page } from "@playwright/test";
import fs from "node:fs";
import AxeBuilder from "@axe-core/playwright";

const now = () => Math.floor(Date.now() / 60_000);
const enabled = process.env.PICMAGIC_DISCOVERY_ROTATION_ENABLED === "true";
const baseURL = process.env.E2E_BASE_URL || "http://localhost:3002";
async function visitState(
  context: BrowserContext,
  counter: number,
  gap = 0,
  on = true,
) {
  await context.addCookies([
    {
      name: DISCOVERY_COOKIE,
      value: `1.${on ? 1 : 0}.${counter}.${now() - gap}`,
      url: baseURL,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}
async function cardPaths(page: Page) {
  return page
    .locator(".prompt-card h3 a")
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
}

test("disabled rollout ignores visit state and does not set discovery cookies", async ({
  page,
  context,
}) => {
  test.skip(enabled, "Run against the disabled build/runtime too");
  await visitState(context, 9, 31);
  const response = await page.goto("/");
  await expect(page.locator(".creative-hero-image")).toHaveAttribute(
    "href",
    promptPath(selectHomepage(prompts).hero!),
  );
  await expect(
    page.getByRole("form", { name: "Discovery preference" }),
  ).toHaveCount(0);
  expect(response?.headers()["set-cookie"] || "").not.toContain(
    DISCOVERY_COOKIE,
  );
});

test.describe("enabled local discovery preview", () => {
  test.skip(
    !enabled,
    "Feature is deliberately off unless the local preview flag is enabled",
  );
  test("recent rail keeps eligible reels without repeating homepage cards or assets", async ({
    page,
    context,
  }) => {
    const home = selectHomepage(prompts, 1);
    const assets = new Set(
      [home.hero!, ...home.next, ...home.more].map((p) => p.preview_image_url),
    );
    const reel = prompts.find(
      (p) =>
        p.prompt_type === "reel" &&
        isPromptSeoEligible(p) &&
        !assets.has(p.preview_image_url),
    )!;
    await visitState(context, 1);
    await page.addInitScript(
      (ids) => localStorage.setItem("picmagic:recent:v1", JSON.stringify(ids)),
      [...home.ids, reel.id, reel.id],
    );
    await page.goto("/");
    await expect(page.locator(".prompt-card h3 a")).toHaveCount(12);
    const paths = await cardPaths(page);
    expect(new Set(paths).size).toBe(12);
    expect(paths).toContain(promptPath(reel));
    expect(paths).not.toContain(promptPath(home.hero!));
  });
  test("first, returning, active and opted-out visits are stable SSR selections", async ({
    page,
    context,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.locator(".creative-hero-image")).toHaveAttribute(
      "href",
      promptPath(selectHomepage(prompts).hero!),
    );
    const cookie = (await context.cookies()).find(
      (c) => c.name === DISCOVERY_COOKIE,
    )!;
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe("Lax");
    await visitState(context, 0, 31);
    await page.reload();
    const selected = selectHomepage(prompts, 1);
    await expect(page.locator(".creative-hero-image")).toHaveAttribute(
      "href",
      promptPath(selected.hero!),
    );
    expect(await cardPaths(page)).toEqual(
      [...selected.next, ...selected.more].map(promptPath),
    );
    await page.reload();
    await expect(page.locator(".creative-hero-image")).toHaveAttribute(
      "href",
      promptPath(selected.hero!),
    );
    expect(
      (
        await new AxeBuilder({ page })
          .include('form[aria-label="Discovery preference"]')
          .analyze()
      ).violations,
    ).toEqual([]);
    await page
      .getByRole("button", { name: "Turn off fresh mix on return visits" })
      .focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: "Turn on fresh mix on return visits" }),
    ).toBeVisible();
    await expect(page.locator(".creative-hero-image")).toHaveAttribute(
      "href",
      promptPath(selectHomepage(prompts).hero!),
    );
    await visitState(context, 0, 31, false);
    await page.reload();
    await expect(page.locator(".creative-hero-image")).toHaveAttribute(
      "href",
      promptPath(selectHomepage(prompts).hero!),
    );
    expect(errors).toEqual([]);
  });
  test("numbered pages and JSON-LD agree without JavaScript; preference form still works", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
    });
    await stubGoogleServices(context);
    await visitState(context, 2, 31);
    const page = await context.newPage();
    for (let n = 2; n <= 3; n++) {
      await page.goto(`/ai-prompts?page=${n}`);
      const paths = await cardPaths(page);
      expect(paths).toEqual(
        orderExplore(prompts, 2)
          .slice((n - 1) * 24, n * 24)
          .map(promptPath),
      );
      const data = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      const list = data
        .map((x) => JSON.parse(x))
        .find((x) => x["@type"] === "CollectionPage")
        .mainEntity.itemListElement;
      expect(list.map((x: { url: string }) => new URL(x.url).pathname)).toEqual(
        paths,
      );
      if (n < 3)
        await expect(
          page.getByRole("link", { name: "Load more looks" }),
        ).toHaveAttribute("href", `/ai-prompts?page=${n + 1}`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://picmagic.in/ai-prompts?page=${n}`,
      );
    }
    await page
      .getByRole("button", { name: "Turn off fresh mix on return visits" })
      .click();
    await expect(
      page.getByRole("button", { name: "Turn on fresh mix on return visits" }),
    ).toBeVisible();
    expect(await cardPaths(page)).toEqual(
      orderExplore(prompts).slice(48).map(promptPath),
    );
    await context.close();
  });
  for (const counter of [0, 3])
    test(`infinite scroll covers the same 72-record snapshot once (variant ${counter})`, async ({
      page,
      context,
    }) => {
      await visitState(context, counter);
      await page.goto("/ai-prompts");
      for (let batch = 1; batch <= 3; batch++) {
        await expect(page.locator(".prompt-card h3 a")).toHaveCount(batch * 24);
        if (batch < 3)
          await page
            .locator("[data-load-more-sentinel]")
            .scrollIntoViewIfNeeded();
      }
      await expect(page.locator(".prompt-card h3 a")).toHaveCount(72);
      const paths = await cardPaths(page);
      expect(paths).toEqual(orderExplore(prompts, counter).map(promptPath));
      expect(new Set(paths).size).toBe(72);
      await page
        .getByRole("button", { name: "Turn off fresh mix on return visits" })
        .click();
      await expect(page.locator(".prompt-card h3 a")).toHaveCount(24);
      expect(await cardPaths(page)).toEqual(
        orderExplore(prompts).slice(0, 24).map(promptPath),
      );
    });
  test("prefetch and HEAD never touch memory, spoofed headers cannot select a deck, CSP remains", async ({
    request,
  }) => {
    const value = `1.1.4.${now() - 31}`;
    const prefetchHeaders: Record<string, string>[] = [
      { "next-router-prefetch": "1", rsc: "1" },
      { purpose: "prefetch" },
      { "sec-purpose": "prefetch" },
    ];
    for (const extra of prefetchHeaders) {
      const response = await request.get("/", {
        headers: { Cookie: `${DISCOVERY_COOKIE}=${value}`, ...extra },
      });
      expect(response.headers()["set-cookie"] || "").not.toContain(
        DISCOVERY_COOKIE,
      );
      expect(response.headers()["content-security-policy"]).toContain("nonce-");
      expect(response.headers()["cache-control"]).toContain("no-store");
    }
    const head = await request.head("/", {
      headers: { Cookie: `${DISCOVERY_COOKIE}=${value}` },
    });
    expect(head.headers()["set-cookie"] || "").not.toContain(DISCOVERY_COOKIE);
    const response = await request.get("/", {
      headers: { "x-picmagic-discovery": "9", "user-agent": "Googlebot" },
    });
    expect(await response.text()).toContain(
      `href="${promptPath(selectHomepage(prompts).hero!)}"`,
    );
    expect(response.headers()["set-cookie"]).toContain(
      `${DISCOVERY_COOKIE}=1.1.0.`,
    );
    // Actual RSC navigation is not prefetch and advances exactly once.
    // Inspect the first response: Playwright's API jar (unlike Chromium) drops
    // Secure cookies on an HTTP localhost redirect to Next's _rsc URL.
    const rsc = await request.get("/ai-prompts", {
      maxRedirects: 0,
      headers: { rsc: "1", Cookie: `${DISCOVERY_COOKIE}=${value}` },
    });
    expect(rsc.headers()["set-cookie"]).toContain(`${DISCOVERY_COOKIE}=1.1.5.`);
  });
  test("client navigation, back and ad-loaded document navigation retain the visit", async ({
    page,
    context,
  }) => {
    await visitState(context, 1);
    await page.goto("/");
    await visitState(context, 1, 31);
    await page
      .getByRole("link", { name: "Explore photo ideas", exact: true })
      .click();
    await expect(page).toHaveURL(/\/ai-prompts$/);
    expect(await cardPaths(page)).toEqual(
      orderExplore(prompts, 2).slice(0, 24).map(promptPath),
    );
    await page.goBack();
    await expect(page.locator(".creative-hero-image")).toBeVisible();
    const before = await page
      .locator(".creative-hero-image")
      .getAttribute("href");
    await page.evaluate(() => {
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      document.head.append(script);
    });
    await page
      .getByRole("link", { name: "Explore photo ideas", exact: true })
      .click();
    await expect(page).toHaveURL(/\/ai-prompts$/);
    await expect(page.locator(".prompt-card h3 a")).toHaveCount(24);
    expect(await cardPaths(page)).toEqual(
      orderExplore(prompts, 2).slice(0, 24).map(promptPath),
    );
    expect(before).toBeTruthy();
  });
  test("all hero candidates preserve responsive layout and only the hero has high priority on Home", async ({
    page,
    context,
  }) => {
    test.setTimeout(120_000);
    if (process.env.DISCOVERY_CAPTURE === "true")
      fs.mkdirSync(".release-private/discovery-qa/screenshots", {
        recursive: true,
      });
    for (let counter = 0; counter < 12; counter++) {
      await visitState(context, counter);
      await page.goto("/");
      await expect(page.locator(".creative-hero-image")).toHaveAttribute(
        "href",
        promptPath(selectHomepage(prompts, counter).hero!),
      );
      await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(
        1,
      );
      await expect(page.locator('img[fetchpriority="high"]')).toHaveCount(0);
      for (const width of [320, 375, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        if (process.env.DISCOVERY_CAPTURE === "true") {
          await page
            .locator(".creative-hero-figure")
            .evaluate((el) => el.scrollIntoView({ block: "center" }));
          await page.locator(".creative-hero-figure").screenshot({
            path: `.release-private/discovery-qa/screenshots/hero-${counter}-${width}.png`,
          });
        }
      }
    }
  });
  test("invalid memory and independent cookie-less visits retain editorial cards", async ({
    page,
    context,
  }) => {
    for (const value of ["broken", "2.1.20.30000000", "1.1.1.1"]) {
      await context.addCookies([
        { name: DISCOVERY_COOKIE, value, url: baseURL },
      ]);
      await page.goto("/");
      await expect(page.locator(".creative-hero-image")).toHaveAttribute(
        "href",
        promptPath(selectHomepage(prompts).hero!),
      );
    }
    for (let i = 0; i < 2; i++) {
      await context.clearCookies();
      await page.goto("/");
      expect(await cardPaths(page)).toEqual(
        [...selectHomepage(prompts).next, ...selectHomepage(prompts).more].map(
          promptPath,
        ),
      );
    }
  });
});
