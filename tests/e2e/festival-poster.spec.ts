import { test, expect } from "./fixtures";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
const sharp: typeof import("sharp").default = createRequire(import.meta.url)(
  "sharp",
);
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { readFileSync } from "node:fs";
const approved = JSON.parse(
  readFileSync("content/releases/festival-approved-2026-10.json", "utf8"),
) as {
  id: string;
  slug: string;
  title: string;
  category_id: string;
  preview_image_url: string;
  thumbnail_url: string;
}[];
const approvedIds = new Set(approved.map((p) => p.id));
const remainingDrafts = [
  ...readFileSync("content/catalog.ts", "utf8").matchAll(
    /from\s+"\.\/([^"\n]+\.json)"/g,
  ),
].flatMap((m) => {
  const rows = JSON.parse(readFileSync(`content/${m[1]}`, "utf8"));
  return Array.isArray(rows)
    ? rows.filter((p) => p.is_published === false && !approvedIds.has(p.id))
    : [];
});

// Only a synthetic test fixture, never a public artwork or release preview.
async function fixtureArt(page: Page) {
  const art = await sharp({
    create: { width: 1080, height: 1350, channels: 3, background: "#111832" },
  })
    .webp()
    .toBuffer();
  await page.route("**/previews/festival-*-art.webp", (route) =>
    route.fulfill({ contentType: "image/webp", body: art }),
  );
}
async function open(page: Page) {
  await page.goto("/festival-poster-maker?design=diwali");
  await expect(
    page.getByRole("button", { name: "Download PNG" }),
  ).toBeEnabled();
}
test("all twelve released routes, assets and sitemap entries exclude other drafts", async ({
  page,
  request,
}) => {
  test.setTimeout(60000);
  const sitemap = await (await request.get("/sitemap-pages.xml")).text();
  const images = await (await request.get("/sitemap-images.xml")).text();
  for (const p of approved) {
    const path = `/ai-prompts/${p.category_id}/${p.slug}`;
    await page.goto(path);
    await expect(
      page.getByRole("heading", { level: 1, name: p.title, exact: true }),
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${path}$`),
    );
    expect(sitemap).toContain(path);
    expect(images).toContain(p.preview_image_url);
    for (const asset of [p.preview_image_url, p.thumbnail_url])
      expect((await request.get(asset)).ok()).toBe(true);
    if (p.slug.endsWith("business-greeting"))
      await expect(
        page.getByRole("link", { name: /poster/i }).first(),
      ).toBeVisible();
  }
  expect(remainingDrafts).toHaveLength(89);
  for (const p of remainingDrafts)
    expect(sitemap).not.toContain(`/${p.slug}</loc>`);
  expect(sitemap).toContain("/festival-poster-maker");
});
for (const width of [320, 390, 768, 1440]) {
  test(`poster layout, Hindi and keyboard ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await open(page);
    await page
      .getByRole("combobox", { name: "Greeting language", exact: true })
      .selectOption("hi");
    await expect(
      page.getByRole("textbox", { name: "Greeting", exact: true }),
    ).toHaveValue("दीपावली की शुभकामनाएँ");
    await page
      .getByRole("textbox", { name: "Company / name", exact: true })
      .fill("आपकी कम्पनी");
    await expect(
      page.getByRole("button", { name: "Download PNG" }),
    ).toBeEnabled();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("textbox", { name: "Greeting", exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("textbox", { name: "Short message", exact: true }),
    ).toBeFocused();
    const violations = (
      await new AxeBuilder({ page }).include(".poster-workspace").analyze()
    ).violations;
    expect(violations).toEqual([]);
    await page
      .locator(".poster-preview-panel")
      .screenshot({ path: test.info().outputPath(`hindi-${width}.png`) });
  });
}
test("three designs, formats, optional uploads and pixel-identical preview/export", async ({
  page,
}) => {
  test.setTimeout(60000);
  await open(page);
  const image = await sharp({
    create: {
      width: 900,
      height: 700,
      channels: 4,
      background: { r: 100, g: 180, b: 150, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  await page.getByLabel("Logo (optional)", { exact: true }).setInputFiles({
    name: "test-logo.png",
    mimeType: "image/png",
    buffer: image,
  });
  await expect(page.getByRole("button", { name: "Remove logo" })).toBeVisible();
  await page.getByLabel("Photo (optional)", { exact: true }).setInputFiles({
    name: "test-photo.webp",
    mimeType: "image/webp",
    buffer: await sharp(image).webp().toBuffer(),
  });
  await expect(page.getByRole("slider", { name: "Photo zoom" })).toBeVisible();
  await page.getByRole("slider", { name: "Photo zoom" }).fill("1.5");
  for (const [name, value] of [
    ["Company / name", "Example Studio"],
    ["Website (optional)", "example.test"],
    ["Email (optional)", "hello@example.test"],
    ["Phone (optional)", "000 000 0000"],
    ["Other details (optional)", "Made with care"],
  ])
    await page.getByRole("textbox", { name, exact: true }).fill(value);
  await page
    .getByRole("slider", { name: "Photo horizontal position" })
    .fill("30");
  for (const language of ["en", "hi"]) {
    await page
      .getByRole("combobox", { name: "Greeting language", exact: true })
      .selectOption(language);
    for (const design of ["diwali", "durga-puja", "dussehra"])
      for (const format of ["square", "portrait", "story"])
        for (const layout of ["centered", "split"]) {
          await page
            .getByRole("combobox", { name: "Festival", exact: true })
            .selectOption(design);
          await page
            .getByRole("combobox", { name: "Format", exact: true })
            .selectOption(format);
          await page
            .getByRole("combobox", { name: "Layout", exact: true })
            .selectOption(layout);
          await expect(
            page.getByRole("button", { name: "Download PNG" }),
          ).toBeEnabled();
          await expect(page.locator("canvas")).toHaveAttribute(
            "data-poster-layout",
            `${design}:${format}:${layout}`,
          );
          const preview = await page
            .locator("canvas")
            .evaluate(
              (c: HTMLCanvasElement) => c.toDataURL("image/png").split(",")[1],
            );
          const event = page.waitForEvent("download");
          await page.getByRole("button", { name: "Download PNG" }).click();
          const download = await event;
          const path = await download.path();
          expect(path).toBeTruthy();
          const exported = await sharp(path!).metadata();
          expect(exported.width).toBe(1080);
          expect(exported.height).toBe(
            format === "square" ? 1080 : format === "portrait" ? 1350 : 1920,
          );
          const previewPixels = await sharp(Buffer.from(preview, "base64"))
            .ensureAlpha()
            .raw()
            .toBuffer();
          const exportPixels = await sharp(path!)
            .ensureAlpha()
            .raw()
            .toBuffer();
          const previewHash = createHash("sha256")
            .update(previewPixels)
            .digest("hex");
          const exportHash = createHash("sha256")
            .update(exportPixels)
            .digest("hex");
          if (previewHash !== exportHash) {
            await test.info().attach("preview", {
              body: Buffer.from(preview, "base64"),
              contentType: "image/png",
            });
            const { readFile } = await import("node:fs/promises");
            await test.info().attach("export", {
              body: await readFile(path!),
              contentType: "image/png",
            });
          }
          expect(exportHash, `${language} ${design} ${format} ${layout}`).toBe(
            previewHash,
          );
        }
  }
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByRole("button", { name: "Remove photo" })).toHaveCount(
    0,
  );
  await expect(page.getByRole("button", { name: "Remove logo" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("textbox", { name: "Company / name", exact: true }),
  ).toHaveValue("");
  await expect(
    page.getByRole("textbox", { name: "Greeting", exact: true }),
  ).toHaveValue("Happy Diwali");
});
test("rejects unsupported, corrupt, oversized and excessive dimensions; handles long text and export failure", async ({
  page,
}) => {
  await open(page);
  const upload = page.getByLabel("Photo (optional)", { exact: true });
  await upload.setInputFiles({
    name: "unsafe.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  });
  await expect(
    page.locator(".poster-workspace").getByRole("alert"),
  ).toContainText("SVG");
  await upload.setInputFiles({
    name: "broken.png",
    mimeType: "image/png",
    buffer: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]),
  });
  await expect(
    page.locator(".poster-workspace").getByRole("alert"),
  ).toContainText("decode");
  await upload.setInputFiles({
    name: "large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
  });
  await expect(
    page.locator(".poster-workspace").getByRole("alert"),
  ).toContainText("10 MB");
  const wide = await sharp({
    create: { width: 8193, height: 1, channels: 3, background: "white" },
  })
    .png()
    .toBuffer();
  await upload.setInputFiles({
    name: "wide.png",
    mimeType: "image/png",
    buffer: wide,
  });
  await expect(
    page.locator(".poster-workspace").getByRole("alert"),
  ).toContainText("8192");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.getByRole("textbox", { name: "Greeting", exact: true }).fill("");
  await expect(
    page.locator(".poster-workspace").getByRole("alert"),
  ).toContainText("Add a greeting");
  await expect(
    page.getByRole("button", { name: "Download PNG" }),
  ).toBeDisabled();
  await page
    .getByRole("textbox", { name: "Greeting", exact: true })
    .fill("M".repeat(90));
  await page
    .getByRole("textbox", { name: "Short message", exact: true })
    .fill("मंगलकामनाएँ ".repeat(15).slice(0, 180));
  const hasOverflow = await page
    .locator(".poster-workspace")
    .getByRole("alert")
    .count();
  if (hasOverflow) {
    await expect(
      page.locator(".poster-workspace").getByRole("alert"),
    ).toContainText("does not fit");
    await expect(
      page.getByRole("button", { name: "Download PNG" }),
    ).toBeDisabled();
  } else
    await expect(
      page.getByRole("button", { name: "Download PNG" }),
    ).toBeEnabled();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = function (callback) {
      callback(null);
    };
  });
  await page.getByRole("button", { name: "Download PNG" }).click();
  await expect(
    page.locator(".poster-workspace").getByRole("alert"),
  ).toContainText("PNG export failed");
});
test("personal fields/uploads are not transmitted, persisted or put into URLs", async ({
  page,
}) => {
  await open(page);
  const traffic: string[] = [];
  page.on("request", (r) => traffic.push(r.url() + " " + (r.postData() || "")));
  const marker = "PRIVATE-FESTIVAL-872641";
  await page
    .getByRole("textbox", { name: "Company / name", exact: true })
    .fill(marker);
  await page
    .getByRole("textbox", { name: "Website (optional)", exact: true })
    .fill(`${marker}.test`);
  await page
    .getByRole("textbox", { name: "Email (optional)", exact: true })
    .fill(`${marker}@example.test`);
  await page
    .getByRole("textbox", { name: "Phone (optional)", exact: true })
    .fill("000 000 0000");
  await page
    .getByRole("textbox", { name: "Other details (optional)", exact: true })
    .fill(marker);
  const jpeg = await sharp({
    create: { width: 50, height: 50, channels: 3, background: "red" },
  })
    .jpeg()
    .toBuffer();
  await page.getByLabel("Photo (optional)", { exact: true }).setInputFiles({
    name: `${marker}.jpg`,
    mimeType: "image/jpeg",
    buffer: jpeg,
  });
  await expect(
    page.getByRole("button", { name: "Remove photo" }),
  ).toBeVisible();
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  await event;
  expect(traffic.join("\n")).not.toContain(marker);
  expect(traffic.join("\n")).not.toContain(jpeg.toString("base64"));
  expect(page.url()).not.toContain(marker);
  expect(
    await page.evaluate(() =>
      JSON.stringify({
        local: { ...localStorage },
        session: { ...sessionStorage },
        cookies: document.cookie,
      }),
    ),
  ).not.toContain(marker);
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Company / name", exact: true }),
  ).toHaveValue("");
  await expect(page.getByRole("button", { name: "Remove photo" })).toHaveCount(
    0,
  );
  for (const name of [
    "Email (optional)",
    "Phone (optional)",
    "Other details (optional)",
  ])
    await expect(page.getByRole("textbox", { name, exact: true })).toHaveValue(
      "",
    );
});
test("missing artwork fails closed with retry instead of a blank download", async ({
  page,
}) => {
  await page.route("**/previews/festival-*-art.webp", (r) =>
    r.fulfill({ status: 404, body: "missing" }),
  );
  await page.goto("/festival-poster-maker?design=unapproved");
  await expect(
    page.getByRole("status").filter({ hasText: "could not load" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download PNG" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("combobox", { name: "Festival", exact: true }),
  ).toHaveValue("diwali");
});
test("font failure prevents export and retry recovers", async ({ page }) => {
  await fixtureArt(page);
  await page.route("**/fonts/noto-sans-devanagari.ttf", (r) =>
    r.fulfill({ status: 404, body: "missing font" }),
  );
  await page.goto("/festival-poster-maker");
  await expect(
    page.getByRole("button", { name: "Retry artwork" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download PNG" }),
  ).toBeDisabled();
  await page.unroute("**/fonts/noto-sans-devanagari.ttf");
  await page.getByRole("button", { name: "Retry artwork" }).click();
  await expect(
    page.getByRole("button", { name: "Download PNG" }),
  ).toBeEnabled();
});
test("constrained text overflow is explicit and cannot be exported", async ({
  page,
}) => {
  await open(page);
  const photo = await sharp({
    create: { width: 50, height: 50, channels: 3, background: "green" },
  })
    .png()
    .toBuffer();
  await page
    .getByLabel("Photo (optional)", { exact: true })
    .setInputFiles({ name: "qa.png", mimeType: "image/png", buffer: photo });
  await expect(
    page.getByRole("button", { name: "Remove photo" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Format", exact: true })
    .selectOption("square");
  await page
    .getByRole("combobox", { name: "Layout", exact: true })
    .selectOption("split");
  await page
    .getByRole("textbox", { name: "Greeting", exact: true })
    .fill("W".repeat(90));
  await expect(
    page.locator(".poster-workspace").getByRole("alert"),
  ).toContainText("Greeting does not fit");
  await expect(
    page.getByRole("button", { name: "Download PNG" }),
  ).toBeDisabled();
  await page
    .getByRole("textbox", { name: "Greeting", exact: true })
    .fill("Happy Diwali");
  await expect(
    page.getByRole("button", { name: "Download PNG" }),
  ).toBeEnabled();
});
