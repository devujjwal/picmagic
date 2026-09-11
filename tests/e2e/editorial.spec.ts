import { test, expect } from "./fixtures";
import fs from "node:fs";
const allPrompts: unknown[] = [
  ...JSON.parse(fs.readFileSync("content/prompts.json", "utf8")),
  ...JSON.parse(fs.readFileSync("content/expansion/prompts.json", "utf8")),
  ...JSON.parse(fs.readFileSync("content/additions/creative-prompts.json", "utf8")),
];
import { promptSchema, promptPath } from "../../types/content";
import { isHomepageEligible } from "../../lib/prompts/editorial";
const prompts = allPrompts.map((p) => promptSchema.parse(p));
test("homepage cards use only approved distinctive creative concepts", async ({
  page,
}) => {
  await page.goto("/");
  const cards = page.locator(".prompt-card h3 a");
  await expect(cards.first()).toBeVisible();
  for (const href of await cards.evaluateAll((nodes) =>
    nodes.map((n) => n.getAttribute("href")),
  )) {
    const p = prompts.find((p) => promptPath(p) === href)!;
    expect(p, href || "").toBeTruthy();
    expect(isHomepageEligible(p), p.slug).toBe(true);
  }
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `width ${width}`,
    ).toBe(true);
  }
});
test("catalogue separates useful utility and keeps rewritten missing-asset concepts private", async ({
  page,
}) => {
  await page.goto("/ai-prompts/professional");
  await expect(
    page.getByRole("region", { name: "Practical utility prompts" }),
  ).toBeVisible();
  const awaiting = prompts.find((p) => p.slug === "neon-monsoon-drive")!;
  expect(awaiting.preview_review_status).toBe("replacement-required");
  const response = await page.goto(promptPath(awaiting));
  expect(response?.status()).toBe(404);
  await page.goto("/ai-prompts/kids/tiny-krishna-big-wonder");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Krishna",
  );
  await expect(
    page.getByText(/hairstyle transformation is essential/).first(),
  ).toBeVisible();
});
test("new conceptual metadata is not shown as a public score", async ({
  page,
}) => {
  await page.goto("/ai-prompts");
  await expect(page.locator("body")).not.toContainText("distinctiveness_score");
  await expect(page.locator("body")).not.toContainText("why-ai-2026");
  await page.goto("/reel-prompts");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Application error");
});
