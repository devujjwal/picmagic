import { afterEach, describe, expect, it, vi } from "vitest";
import {
  discoveryRotationEnabled,
  DISCOVERY_MAX_COUNTER,
} from "@/config/discovery";
import {
  advanceDiscoverySession,
  discoveryCookieOptions,
  discoveryReturnPath,
  isDiscoveryEntry,
  isDiscoveryNavigation,
  parseDiscoverySession,
  serializeDiscoverySession,
} from "@/lib/prompts/discovery-session";
const now = 30_000_000;
const url = (path = "/") => new URL(path, "https://picmagic.in");
afterEach(() => vi.unstubAllEnvs());
describe("discovery visit lifecycle", () => {
  it("uses elapsed time across midnight and gives concurrent requests the same variation", () => {
    const midnight = Date.UTC(2026, 8, 26) / 60_000;
    const previous = { enabled: true, counter: 6, minute: midnight - 15 };
    const tabOne = advanceDiscoverySession(previous, midnight + 16, true);
    const tabTwo = advanceDiscoverySession(previous, midnight + 16, true);
    expect(tabOne.counter).toBe(7);
    expect(tabTwo).toEqual(tabOne);
    expect(advanceDiscoverySession(tabOne, midnight + 16, true)).toEqual(
      tabOne,
    );
  });
  it("defaults the rollout flag off and uses a small host-only HttpOnly cookie", () => {
    vi.stubEnv("PICMAGIC_DISCOVERY_ROTATION_ENABLED", "");
    expect(discoveryRotationEnabled()).toBe(false);
    vi.stubEnv("PICMAGIC_DISCOVERY_ROTATION_ENABLED", "true");
    expect(discoveryRotationEnabled()).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(discoveryCookieOptions()).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 2592000,
    });
  });
  it("resets missing/malformed/expired/future/oversized/unsupported cookies", () => {
    for (const value of [
      undefined,
      "",
      "1.1.4096.30000000",
      "2.1.1.30000000",
      "1.1.-1.30000000",
      "1.1.1.30000100",
      "1.1.1.20000000",
      "x".repeat(100),
    ])
      expect(parseDiscoverySession(value, now)).toBeNull();
    const first = advanceDiscoverySession(null, now, true);
    expect(first).toEqual({ enabled: true, counter: 0, minute: now });
    expect(
      parseDiscoverySession(serializeDiscoverySession(first), now),
    ).toEqual(first);
  });
  it("advances once after thirty idle minutes, never on later pages or active browsing", () => {
    const first = { enabled: true, counter: 0, minute: now };
    expect(advanceDiscoverySession(first, now + 29, true).counter).toBe(0);
    const returned = advanceDiscoverySession(first, now + 31, true);
    expect(returned.counter).toBe(1);
    expect(advanceDiscoverySession(returned, now + 31, true).counter).toBe(1);
    expect(advanceDiscoverySession(first, now + 31, false).counter).toBe(0);
    expect(
      advanceDiscoverySession({ ...first, enabled: false }, now + 31, true)
        .counter,
    ).toBe(0);
    expect(
      advanceDiscoverySession(
        { ...first, counter: DISCOVERY_MAX_COUNTER },
        now + 31,
        true,
      ).counter,
    ).toBe(1);
    expect(isDiscoveryEntry(url("/ai-prompts?page=2"))).toBe(false);
    expect(isDiscoveryEntry(url("/ai-prompts?page=1&utm_source=test"))).toBe(
      true,
    );
    expect(isDiscoveryEntry(url("/ai-prompts/women"))).toBe(false);
  });
  it("ignores prefetch, HEAD, APIs, assets and admin, independent of user agent", () => {
    for (const method of ["POST", "HEAD", "OPTIONS"])
      expect(isDiscoveryNavigation(method, url(), new Headers())).toBe(false);
    for (const path of [
      "/api/search",
      "/_next/static/a.js",
      "/previews/a.webp",
      "/admin",
      "/sitemap.xml",
      "/unknown",
    ])
      expect(isDiscoveryNavigation("GET", url(path), new Headers())).toBe(
        false,
      );
    for (const header of [
      "next-router-prefetch",
      "next-router-segment-prefetch",
      "x-middleware-prefetch",
      "purpose",
      "sec-purpose",
    ])
      expect(
        isDiscoveryNavigation(
          "GET",
          url(),
          new Headers({ [header]: "prefetch" }),
        ),
      ).toBe(false);
    for (const agent of ["Googlebot", "browser", "OAI-SearchBot"])
      expect(
        isDiscoveryNavigation(
          "GET",
          url("/ai-prompts/travel/the-river-remembers"),
          new Headers({ "user-agent": agent }),
        ),
      ).toBe(true);
    expect(
      isDiscoveryNavigation(
        "GET",
        url(),
        new Headers({ rsc: "1", "sec-fetch-dest": "empty" }),
      ),
    ).toBe(true);
    expect(
      isDiscoveryNavigation(
        "GET",
        url(),
        new Headers({ "sec-fetch-dest": "image" }),
      ),
    ).toBe(false);
  });
  it("restricts preference redirects to the two surfaces", () => {
    for (const path of ["/", "/ai-prompts", "/ai-prompts?page=4"])
      expect(discoveryReturnPath(path)).toBe(path);
    for (const path of [
      "//evil.test",
      "https://evil.test",
      "/admin",
      "/ai-prompts?foo=1",
      null,
    ])
      expect(discoveryReturnPath(path)).toBeNull();
  });
});
