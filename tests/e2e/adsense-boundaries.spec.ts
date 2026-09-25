import { test, expect } from "./fixtures";

test.skip(
  process.env.E2E_ADS_ENABLED !== "true",
  "Requires advertising-configured local build",
);

test("only server-approved content surfaces load advertising", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/pagead/js/adsbygoogle.js*", async (route) => {
    requests++;
    await route.fulfill({
      contentType: "application/javascript",
      body: "/* no live Google requests */",
    });
  });
  for (const path of [
    "/ai-prompts/pets",
    "/collections/professional",
    "/collections/saree",
    "/collections/golden-hour",
    "/collections/diwali",
    "/ai-prompts/men/nonexistent-audit",
    "/collections/nonexistent-audit",
    "/reel-prompts/your-next-introduction-reel",
    "/reel-prompts/soft-light-unmistakably-you-reel",
    "/reel-prompts/coral-against-the-sky-reel",
    "/search",
    "/create",
    "/enhance-photo",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/saved",
    "/admin/login",
  ]) {
    await page.goto(path);
    await expect(
      page.locator(
        "script#picmagic-adsense, ins.adsbygoogle, [data-ad-surface], .ad-reserve",
      ),
    ).toHaveCount(0);
  }
  expect(requests).toBe(0);
  await page.goto("/ai-prompts/social-media/a-fold-around-you-profile");
  await expect.poll(() => requests).toBe(1);
  await expect(page.locator(".ad-reserve")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Copy complete prompt", exact: true }),
  ).toBeVisible();
  // A loaded vendor cannot survive navigation into a non-advertising document.
  const mobileMenu = page.getByLabel("Open navigation");
  if (await mobileMenu.isVisible()) await mobileMenu.click();
  const destinationRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/create")
      destinationRequests.push(request.resourceType());
  });
  await page.getByRole("link", { name: "Create", exact: true }).click();
  await expect(page).toHaveURL(/\/create$/);
  await expect(
    page.locator("script#picmagic-adsense, ins.adsbygoogle"),
  ).toHaveCount(0);
  expect(destinationRequests).toEqual(["document"]);
  await page.goBack();
  await expect(page).toHaveURL(/a-fold-around-you-profile$/);
  await expect(page.locator("script#picmagic-adsense")).toHaveCount(1);
});

test("copy actions preserve the full prompt and sharing retains its canonical URL", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/ai-prompts/social-media/a-fold-around-you-profile");
  const text = await page.locator(".prompt-text").first().innerText();
  for (const name of ["Copy complete prompt", "Copy prompt"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(text);
  }
  await page.getByText("Share this look with someone", { exact: true }).click();
  await page.getByRole("button", { name: "Copy link", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(
      "https://picmagic.in/ai-prompts/social-media/a-fold-around-you-profile",
    );
  await expect(
    page.getByRole("link", { name: "WhatsApp", exact: true }),
  ).toHaveAttribute(
    "href",
    /https%3A%2F%2Fpicmagic.in%2Fai-prompts%2Fsocial-media%2Fa-fold-around-you-profile/,
  );
});
