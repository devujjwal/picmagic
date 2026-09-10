import { test, expect } from "@playwright/test";
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
    !/^http:\/\/localhost:431[13]$/.test(process.env.E2E_BASE_URL || ""),
    "Admin mutation tests are local-only.",
  );
  test.setTimeout(120000);
  await page.goto("/admin/login");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill(process.env.E2E_ADMIN_EMAIL!);
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
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
  const publicPage = await visitor.newPage();
  const origin = new URL(page.url()).origin;
  expect(
    (await publicPage.goto(`${origin}/ai-prompts/women/${slug}`))?.status(),
  ).toBe(404);
  await page.goto(`/admin/prompts/${id}`);
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
