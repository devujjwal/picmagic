import { test, expect } from "./fixtures";
import {
  remainingPromptGuides,
  remainingPromptFaqs,
} from "../../content/remaining-guidance";
import { readFileSync } from "node:fs";
import { promptPath } from "../../lib/routes";

test("reviewed pages expose their authored guidance and matching FAQ schema", async ({
  page,
}) => {
  test.setTimeout(180000);
  const source = readFileSync("content/catalog.ts", "utf8");
  const prompts = [...source.matchAll(/from\s+"\.\/([^"\n]+\.json)"/g)].flatMap(
    (match) => JSON.parse(readFileSync(`content/${match[1]}`, "utf8")),
  ) as {
    slug: string;
    prompt_type: "photo";
    category_id: string;
  }[];
  for (const slug of new Set([
    ...Object.keys(remainingPromptGuides),
    ...Object.keys(remainingPromptFaqs),
  ])) {
    const prompt = prompts.find((p) => p.slug === slug)!;
    await page.goto(promptPath(prompt));
    const guide = remainingPromptGuides[slug];
    for (const section of guide?.sections ?? []) {
      await expect(
        page.getByRole("heading", { name: section.heading, exact: true }),
      ).toBeVisible();
    }
    const faqs = remainingPromptFaqs[slug] ?? guide.faqs;
    await expect(page.locator("section.faq summary")).toHaveText(
      faqs!.map((faq) => faq.question),
    );
    const schema = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
        nodes
          .map((node) => JSON.parse(node.textContent!))
          .find((value) => value["@type"] === "FAQPage"),
      );
    expect(
      schema.mainEntity.map(
        (question: { name: string; acceptedAnswer: { text: string } }) => ({
          question: question.name,
          answer: question.acceptedAnswer.text,
        }),
      ),
      slug,
    ).toEqual(faqs);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      slug,
    ).toBe(true);
  }
});
