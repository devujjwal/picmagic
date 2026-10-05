import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";

test("historical evidence is usable and reports retain the canonical prompt address", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/ai-prompts/social-media/a-fold-around-you-profile");
  const evidence = page.getByRole("region", { name: "Example evidence" });
  await expect(evidence).toContainText("Documented single attempt");
  await expect(evidence).toContainText("0 corrective runs");
  await expect(evidence).toContainText("matches the complete prompt above");
  await expect(evidence.getByRole("img")).toBeVisible();
  await evidence.getByRole("img").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      evidence
        .getByRole("img")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page.getByText("Report a prompt issue", { exact: true }).click();
  const prepare = page.getByRole("link", { name: "Prepare issue email" });
  if (await prepare.count()) {
    await page
      .getByLabel("Issue", { exact: true })
      .selectOption("Likeness or anatomy problem");
    await page.getByLabel("Tool / model (optional)").fill("ChatGPT web");
    await page
      .getByLabel("What happened?")
      .fill("Glasses disappeared & the hairline changed.");
    const href = new URL((await prepare.getAttribute("href"))!);
    expect(href.searchParams.get("body")).toContain(
      "https://picmagic.in/ai-prompts/social-media/a-fold-around-you-profile",
    );
    expect(href.searchParams.get("body")).toContain(
      "Glasses disappeared & the hairline changed.",
    );
  } else {
    await expect(
      page
        .locator(".prompt-report")
        .getByRole("link", { name: "Contact PicMagic" }),
    ).toBeVisible();
  }
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Evidence and expanded reporting at ${width}px`,
    ).toBe(true);
  }
  const accessibility = await new AxeBuilder({ page })
    .include(".prompt-evidence")
    .include(".prompt-report")
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 900 });
  if (await prepare.count()) await prepare.click({ trial: true });
  await evidence
    .getByRole("link", {
      name: "Read exact input, observations and limitations",
    })
    .click();
  await expect(page).toHaveURL(
    /guides\/prompt-trial#a-fold-around-you-profile$/,
  );
  await expect(page.locator("#a-fold-around-you-profile")).toBeVisible();
  expect(errors).toEqual([]);
});

test("unexecuted plans do not become public testing claims", async ({
  page,
}) => {
  await page.goto("/ai-prompts/men/city-lights-main-character-energy");
  const evidence = page.getByRole("region", { name: "Example evidence" });
  await expect(evidence).toContainText("No tool-specific test record");
  await expect(evidence).toContainText(
    "writing update, not a new generation test",
  );
  await expect(evidence).not.toContainText("Documented single attempt");
  await expect(evidence.getByRole("img")).toHaveCount(0);
});
