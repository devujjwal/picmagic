import { test, expect, stubGoogleServices } from "./fixtures";
import { resolve } from "node:path";
test("admin creates, uploads, previews, publishes, duplicates, redirects and unpublishes", async ({
  page,
  browser,
}) => {
  test.skip(
    !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
    "Requires the disposable local QA administrator.",
  );
  test.skip(
    !/^http:\/\/localhost:431[1234]$/.test(process.env.E2E_BASE_URL || ""),
    "Admin mutation tests are local-only.",
  );
  test.setTimeout(120000);
  const qaOrigin = process.env.E2E_BASE_URL!;
  expect(
    (
      await page.request.post("/api/admin/upload", {
        headers: { origin: qaOrigin },
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await page.request.post("/api/admin/revalidate", {
        headers: { origin: qaOrigin },
      })
    ).status(),
  ).toBe(401);
  await page.goto("/admin/login");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  expect(
    (
      await page.request.post("/api/admin/revalidate", {
        headers: { origin: "https://untrusted.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await page.request.post("/api/admin/revalidate", {
        headers: { origin: qaOrigin },
      })
    ).status(),
  ).toBe(200);
  expect(
    (
      await page.request.post("/api/admin/upload", {
        headers: { origin: "https://untrusted.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await page.request.post("/api/admin/upload", {
        headers: { origin: qaOrigin },
        multipart: {
          file: {
            name: "rejected.svg",
            mimeType: "image/svg+xml",
            buffer: Buffer.from(
              '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
            ),
          },
        },
      })
    ).status(),
  ).toBe(400);

  await page.getByRole("link", { name: "Add a prompt", exact: true }).click();
  const suffix = Date.now().toString();
  const title = `Editorial QA look ${suffix}`;
  const slug = `editorial-qa-look-${suffix}`;
  await page.getByRole("textbox", { name: "Title", exact: true }).fill(title);
  await page
    .getByRole("combobox", { name: "Category", exact: true })
    .selectOption("women");
  await page
    .getByRole("textbox", { name: "Description", exact: true })
    .fill(
      "A natural editorial portrait for testing the complete publishing flow with accurate identity and soft window lighting.",
    );
  await page
    .getByLabel("Complete prompt", { exact: true })
    .fill(
      "Create a natural editorial portrait of the subject in the uploaded image. Preserve facial identity and natural proportions. Use soft window light, a neutral background, an 85mm lens at f/4 and a 4:5 composition.",
    );
  await page
    .getByLabel("Preview generation brief (separate from copyable prompt)")
    .fill(
      "A fictional Indian woman in an ivory saree, soft window light, natural appearance and original facial details.",
    );
  await page
    .getByRole("button", { name: "Apply persona instructions" })
    .click();
  await page
    .getByLabel("Upload preview image", { exact: false })
    .setInputFiles(
      resolve("public/previews/golden-hour-draped-in-tradition.webp"),
    );
  await expect(
    page.getByRole("textbox", { name: "preview image url", exact: true }),
  ).toHaveValue(/\/storage\/v1\/object\/public\/previews\//, {
    timeout: 20000,
  });
  await page
    .getByRole("textbox", { name: "image alt", exact: true })
    .fill("Woman in a traditional saree under soft afternoon light");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/admin/prompts/"),
    ),
    page.getByRole("button", { name: "Save prompt", exact: true }).click(),
  ]);
  await expect(page.locator('.notice[role="status"]')).toContainText(
    "Prompt saved.",
  );
  const previewHref = await page
    .getByRole("link", { name: "Preview saved version" })
    .getAttribute("href");
  const id = previewHref!.split("/").at(-1)!;
  await page.getByRole("link", { name: "Preview saved version" }).click();
  await expect(
    page.getByText("Private draft preview.", { exact: false }),
  ).toBeVisible();
  const visitor = await browser.newContext();
  await stubGoogleServices(visitor);
  const publicPage = await visitor.newPage();
  const origin = new URL(page.url()).origin;
  expect(
    (await publicPage.goto(`${origin}/ai-prompts/women/${slug}`))?.status(),
  ).toBe(404);
  await page.goto(`/admin/prompts/${id}`);
  await page
    .getByLabel("Content purpose", { exact: false })
    .selectOption("utility");
  await page.getByLabel("Distinctiveness (1–5)", { exact: true }).fill("3");
  await page
    .getByLabel("Why use AI for this?", { exact: true })
    .fill(
      "Provides a faithful studio portrait for a user without a studio, preserving their real identity and natural skin texture.",
    );
  await page.getByLabel("I reviewed identity", { exact: false }).check();
  await page
    .getByLabel("The current preview accurately", { exact: false })
    .check();
  await page.getByRole("checkbox", { name: "published", exact: true }).check();
  await page.getByRole("checkbox", { name: "indexable", exact: true }).check();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/admin/prompts/"),
    ),
    page.getByRole("button", { name: "Save prompt", exact: true }).click(),
  ]);
  await expect(page.locator('.notice[role="status"]')).toContainText(
    "Prompt saved.",
  );
  await publicPage.goto(`${origin}/ai-prompts/women/${slug}`);
  await expect(publicPage.locator("h1")).toHaveText(title);
  await expect(publicPage.locator(".detail-visual img")).toBeVisible();
  await expect
    .poll(() =>
      publicPage
        .locator(".detail-visual img")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await page
    .getByRole("textbox", { name: "URL slug", exact: false })
    .fill(`${slug}-renamed`);
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/admin/prompts/"),
    ),
    page.getByRole("button", { name: "Save prompt", exact: true }).click(),
  ]);
  await expect(page.locator('.notice[role="status"]')).toContainText(
    "Prompt saved.",
  );
  await publicPage.goto(`${origin}/ai-prompts/women/${slug}`);
  await expect(publicPage).toHaveURL(new RegExp(`${slug}-renamed$`));
  await page.goto("/admin/prompts");
  await page
    .locator(".admin-list-item")
    .filter({ hasText: title })
    .getByRole("button", { name: "Duplicate", exact: true })
    .click();
  await expect(
    page.getByRole("checkbox", { name: "published", exact: true }),
  ).not.toBeChecked();
  await expect(
    page.getByLabel("I reviewed identity", { exact: false }),
  ).not.toBeChecked();
  await page.goto(`/admin/prompts/${id}`);
  await page
    .getByRole("checkbox", { name: "published", exact: true })
    .uncheck();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/admin/prompts/"),
    ),
    page.getByRole("button", { name: "Save prompt", exact: true }).click(),
  ]);
  await expect(page.locator('.notice[role="status"]')).toContainText(
    "Prompt saved.",
  );
  expect(
    (
      await publicPage.goto(`${origin}/ai-prompts/women/${slug}-renamed`)
    )?.status(),
  ).toBe(404);
  await visitor.close();
});
