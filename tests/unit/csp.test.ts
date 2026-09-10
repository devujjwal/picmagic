import { describe, it, expect } from "vitest";
import { contentSecurityPolicy } from "@/lib/security/csp";
describe("publisher CSP", () => {
  it("uses a nonce and strict-dynamic without a fragile advertising host list", () => {
    const policy = contentSecurityPolicy("abc123==", true);
    expect(policy).toContain("'nonce-abc123==' 'strict-dynamic'");
    expect(policy).toContain("connect-src 'self' https:");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
  it("keeps admin connections restricted and rejects nonce injection", () => {
    expect(contentSecurityPolicy("admin123", false)).not.toContain(
      "connect-src 'self' https:;",
    );
    expect(() => contentSecurityPolicy("bad'; script-src *", true)).toThrow();
  });
});
