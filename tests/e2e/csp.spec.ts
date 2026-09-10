import { test, expect } from "@playwright/test";
test("HTML uses fresh matching nonces and blocks an unapproved inline script", async ({
  page,
  request,
}) => {
  await page.route("**/pagead/js/adsbygoogle.js*", (r) =>
    r.fulfill({ contentType: "application/javascript", body: "/* stub */" }),
  );
  const first = await request.get("/");
  const second = await request.get("/");
  const extract = (h: string) => h.match(/'nonce-([^']+)'/)?.[1];
  const one = extract(first.headers()["content-security-policy"] || "");
  const two = extract(second.headers()["content-security-policy"] || "");
  expect(one).toBeTruthy();
  expect(two).toBeTruthy();
  expect(one).not.toBe(two);
  expect(first.headers()["cache-control"]).toContain("no-store");
  expect(await first.text()).toContain(`nonce="${one}"`);
  // Parser-inserted attacker markup, not DevTools evaluation (which is trusted).
  await page.route(
    new URL("/", process.env.E2E_BASE_URL || "http://localhost:3002").href,
    async (route) => {
      const response = await route.fetch();
      const html = (await response.text()).replace(
        "</body>",
        "<script>window.__untrustedExecuted=true</script></body>",
      );
      await route.fulfill({ response, body: html });
    },
  );
  const response = await page.goto("/");
  const nonce = extract(response!.headers()["content-security-policy"]);
  const scriptNonces = await page
    .locator("script[src]")
    .evaluateAll((els) => els.map((el) => (el as HTMLScriptElement).nonce));
  expect(scriptNonces.length).toBeGreaterThan(0);
  expect(scriptNonces.every((n) => n === nonce)).toBe(true);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __untrustedExecuted?: boolean })
          .__untrustedExecuted,
    ),
  ).toBeUndefined();
  await page
    .getByRole("button", { name: "Cookie preferences", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
