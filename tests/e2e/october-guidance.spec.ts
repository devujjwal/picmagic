import { test, expect } from "./fixtures";
import { octoberPromptGuides } from "../../content/october-guidance";

const examples = [
  ["men", "city-lights-main-character-energy"],
  ["social-media", "standing-on-my-playlist"],
  ["kids", "the-kite-in-my-notebook"],
  ["product-photography", "your-product-beautifully-simple"],
];
for (const [category, slug] of examples) {
  test(`${slug} has usable guidance, exact copying and consistent answers`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/ai-prompts/${category}/${slug}`);
    const guide = octoberPromptGuides[slug];
    for (const section of guide.sections) {
      await expect(
        page.getByRole("heading", { name: section.heading, exact: true }),
      ).toBeVisible();
    }
    const question = page.getByText(guide.faqs![0].question, { exact: true });
    await question.click();
    await expect(
      page.getByText(guide.faqs![0].answer, { exact: true }),
    ).toBeVisible();
    const complete = await page.locator(".prompt-text").innerText();
    await page
      .getByRole("button", { name: "Copy complete prompt", exact: true })
      .click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(complete);
    await expect(page.locator("main")).not.toContainText("forehead mark");
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${slug} at ${width}`,
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("sparse collections have comparison help and retain their noindex and advertising boundaries", async ({
  page,
}) => {
  for (const slug of ["professional", "saree", "golden-hour", "diwali"]) {
    await page.goto(`/collections/${slug}`);
    await expect(
      page.getByRole("region", { name: "Practical guidance" }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(
      page.locator("[data-ad-surface], ins.adsbygoogle, .ad-reserve"),
    ).toHaveCount(0);
  }
});
