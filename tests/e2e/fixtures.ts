import { test as base, expect, type BrowserContext } from "@playwright/test";
export async function stubGoogleServices(context: BrowserContext) {
  await context.route(
    /googlesyndication|googletagmanager|google-analytics|doubleclick|fundingchoicesmessages/,
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: "/* Local test: no live vendor requests. */",
      }),
  );
}
// Test-specific page routes take precedence over this default vendor boundary.
export const test = base.extend({
  context: async ({ context }, runFixture) => {
    await stubGoogleServices(context);
    await runFixture(context);
  },
});
export { expect };
