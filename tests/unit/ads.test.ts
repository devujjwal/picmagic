import { afterEach, describe, expect, it, vi } from "vitest";
import {
  adSlotId,
  adsTxt,
  isAdvertisingPage,
  validAdSenseClient,
} from "@/config/ads";
import {
  advertisingConsent,
  advertisingConsentKey,
  analyticsConsentKey,
  readConsent,
} from "@/lib/privacy/consent";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("AdSense publisher verification", () => {
  it("only publishes a correctly formatted publisher identity", () => {
    expect(adsTxt("ca-pub-4114304022167819")).toBe(
      "google.com, pub-4114304022167819, DIRECT, f08c47fec0942fa0\n",
    );
    for (const value of [
      undefined,
      "",
      "ca-pub-123",
      "ca-pub-4114304022167819\nother.com",
    ])
      expect(adsTxt(value)).toBe("");
    expect(validAdSenseClient("pub-4114304022167819")).toBeUndefined();
  });
  it("excludes administration, saved state and creator results from ad loading", () => {
    for (const path of [
      "/",
      "/ai-prompts",
      "/ai-prompts/women/look",
      "/collections/romantic",
      "/reel-prompts/concept",
    ])
      expect(isAdvertisingPage(path)).toBe(true);
    for (const path of [
      "/admin",
      "/admin/login",
      "/saved",
      "/search",
      "/create",
      "/enhance-photo",
      "/privacy",
      "/api/search",
    ])
      expect(isAdvertisingPage(path)).toBe(false);
  });
  it("fails closed for malformed or missing ad slots", () => {
    for (const value of [
      "null",
      "[]",
      "broken",
      '{"home-feed-1":123}',
      '{"home-feed-1":"not-a-slot"}',
    ]) {
      vi.stubEnv("NEXT_PUBLIC_AD_SLOTS", value);
      expect(adSlotId("home-feed-1")).toBeUndefined();
    }
    vi.stubEnv("NEXT_PUBLIC_AD_SLOTS", '{"home-feed-1":"2111918706"}');
    expect(adSlotId("home-feed-1")).toBe("2111918706");
  });
  it("does not reuse analytics consent as advertising permission", () => {
    localStorage.setItem(analyticsConsentKey, "yes");
    expect(advertisingConsent()).toBe(false);
    localStorage.setItem(advertisingConsentKey, "garbage");
    expect(readConsent(advertisingConsentKey)).toBe("unset");
    localStorage.setItem(advertisingConsentKey, "yes");
    expect(advertisingConsent()).toBe(true);
    localStorage.setItem(advertisingConsentKey, "no");
    expect(advertisingConsent()).toBe(false);
  });
  it("does not authorize ads when browser storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(advertisingConsent()).toBe(false);
  });
});
