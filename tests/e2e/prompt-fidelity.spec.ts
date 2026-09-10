import { test, expect } from "@playwright/test";
import prompts from "../../content/prompts.json" with { type: "json" };
const krishna = prompts.find((p) => p.slug === "tiny-krishna-big-wonder")!;
test("Krishna details and copy preserve the full reviewed prompt", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.addInitScript(() =>
    localStorage.setItem("picmagic:advertising-consent:v1", "no"),
  );
  await page.goto(`/ai-prompts/kids/${krishna.slug}`);
  await expect(page.locator(".prompt-text")).toHaveText(krishna.prompt_text);
  await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    krishna.prompt_text,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(
    page.getByText("What if the tool leaves out a detail?", { exact: true }),
  ).toBeVisible();
});
test("enhancement and shortening retain source appearance and scoped edit instructions", async ({
  page,
}) => {
  await page.goto("/enhance-photo");
  await page
    .getByRole("button", { name: "Improve Lighting", exact: true })
    .click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Generate prompt", exact: true })
    .click();
  await expect(page.locator(".prompt-text")).toContainText("bindi or tilak");
  await expect(page.locator(".prompt-text")).toContainText(
    "original expression, pose, outfit and background",
  );
  await page
    .getByRole("button", { name: "Shorten prompt", exact: true })
    .click();
  await expect(page.locator(".prompt-text")).toContainText("bindi or tilak");
  await expect(page.locator(".prompt-text")).toContainText(
    "Do not invent a religious mark",
  );
});
