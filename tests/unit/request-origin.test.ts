import { describe, expect, it } from "vitest";
import { isTrustedOrigin } from "@/lib/request-origin";

describe("administrator upload origins behind a hosting proxy", () => {
  const check = (origin?: string, forwardedHost?: string) =>
    isTrustedOrigin(
      new Request("http://internal:3000/api/admin/upload", {
        headers: {
          ...(origin ? { origin } : {}),
          ...(forwardedHost ? { "x-forwarded-host": forwardedHost } : {}),
        },
      }),
      ["https://picmagic.in", "https://preview--picmagic-in.netlify.app"],
    );
  it("accepts the canonical domain and explicitly configured preview", () => {
    expect(check("https://picmagic.in")).toBe(true);
    expect(check("https://preview--picmagic-in.netlify.app")).toBe(true);
  });
  it("rejects absent, opaque, lookalike and forged forwarded origins", () => {
    for (const origin of [
      undefined,
      "null",
      "https://picmagic.in.evil.example",
      "https://evil.netlify.app",
      "http://picmagic.in",
    ])
      expect(check(origin, "picmagic.in")).toBe(false);
  });
  it("supports same-origin local development", () => {
    expect(
      isTrustedOrigin(
        new Request("http://localhost:4313/api/admin/upload", {
          headers: { origin: "http://localhost:4313" },
        }),
        [],
      ),
    ).toBe(true);
  });
});
