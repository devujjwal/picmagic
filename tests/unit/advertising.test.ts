import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  advertisingConsentKey,
  analyticsConsentKey,
} from "@/lib/privacy/consent";
import type { AdQueue } from "@/lib/privacy/advertising";
beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  window.adsbygoogle = [];
  delete window.googlefc;
  delete window.__tcfapi;
});
afterEach(() => vi.restoreAllMocks());

describe("Google CMP owns advertising decisions", () => {
  it.each([
    ["accepted", undefined, undefined],
    ["rejected", undefined, 1],
    ["undecided", 1, undefined],
    ["outside-region", undefined, undefined],
    ["cmp-error", 1, 1],
  ] as const)(
    "preserves the vendor's %s request restrictions",
    async (_state, pause, npa) => {
      const upstream = window.adsbygoogle as AdQueue;
      upstream.pauseAdRequests = pause;
      upstream.requestNonPersonalizedAds = npa;
      const { prepareAdvertising } = await import("@/lib/privacy/advertising");
      const queue = prepareAdvertising();
      queue.push({});
      expect(queue).toBe(upstream);
      expect(queue).toHaveLength(1);
      expect(queue.pauseAdRequests).toBe(pause);
      expect(queue.requestNonPersonalizedAds).toBe(npa);
    },
  );
  it("analytics acceptance/rejection cannot change advertising signals", async () => {
    const { prepareAdvertising } = await import("@/lib/privacy/advertising");
    for (const choice of ["yes", "no"]) {
      localStorage.setItem(analyticsConsentKey, choice);
      expect(prepareAdvertising().pauseAdRequests).toBeUndefined();
      expect(prepareAdvertising().requestNonPersonalizedAds).toBeUndefined();
    }
  });
  it("blocked PicMagic storage defers to the CMP, never grants personalized ads", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw Error("blocked");
    });
    const { prepareAdvertising } = await import("@/lib/privacy/advertising");
    expect(prepareAdvertising()).toEqual([]);
  });
  it("preserves legacy cookie rejection until a fresh explicit CMP choice, including rejection", async () => {
    localStorage.setItem(advertisingConsentKey, "no");
    const { prepareAdvertising } = await import("@/lib/privacy/advertising");
    const queue = prepareAdvertising();
    expect(queue.pauseAdRequests).toBe(1);
    expect(queue.requestNonPersonalizedAds).toBe(1);
    let listener: Parameters<NonNullable<Window["__tcfapi"]>>[2] | undefined;
    window.__tcfapi = vi.fn((_command, _version, cb) => {
      listener = cb;
    });
    window.googlefc!.callbackQueue![0].CONSENT_API_READY();
    for (const eventStatus of ["tcloaded", "cmpuishown"]) {
      listener!(
        {
          gdprApplies: true,
          cmpStatus: "loaded",
          eventStatus,
          tcString: "old",
        },
        true,
      );
      expect(queue.pauseAdRequests).toBe(1);
    }
    listener!({ gdprApplies: false, eventStatus: "useractioncomplete" }, true);
    expect(queue.pauseAdRequests).toBe(1);
    listener!(
      {
        gdprApplies: true,
        cmpStatus: "error",
        eventStatus: "useractioncomplete",
        tcString: "invalid",
      },
      false,
    );
    expect(queue.pauseAdRequests).toBe(1);
    const vendorQueue: AdQueue = [];
    window.adsbygoogle = vendorQueue;
    listener!(
      {
        gdprApplies: true,
        cmpStatus: "loaded",
        eventStatus: "useractioncomplete",
        tcString: "new-cmp-rejection",
      },
      true,
    );
    expect(vendorQueue.pauseAdRequests).toBe(0);
    expect(vendorQueue.requestNonPersonalizedAds).toBe(1);
    expect(localStorage.getItem(advertisingConsentKey)).toBeNull();
    expect(localStorage.getItem(analyticsConsentKey)).toBeNull();
  });
  it("a new CMP decision cannot release an excluded page's advertising hold", async () => {
    localStorage.setItem(advertisingConsentKey, "no");
    const { setAdvertisingSurfaceAllowed, prepareAdvertising } =
      await import("@/lib/privacy/advertising");
    setAdvertisingSurfaceAllowed(false);
    let listener: Parameters<NonNullable<Window["__tcfapi"]>>[2] | undefined;
    window.__tcfapi = vi.fn((_command, _version, cb) => {
      listener = cb;
    });
    window.googlefc!.callbackQueue![0].CONSENT_API_READY();
    listener!(
      {
        gdprApplies: true,
        cmpStatus: "loaded",
        eventStatus: "useractioncomplete",
        tcString: "real-vendor-signal",
      },
      true,
    );
    expect(prepareAdvertising().pauseAdRequests).toBe(1);
    setAdvertisingSurfaceAllowed(true);
    expect(prepareAdvertising().pauseAdRequests).toBe(0);
    expect(prepareAdvertising().requestNonPersonalizedAds).toBe(1);
  });
  it("queues reopening through Google's supported callback API", async () => {
    const { openAdvertisingChoices } =
      await import("@/lib/privacy/advertising");
    const show = vi.fn();
    openAdvertisingChoices(vi.fn());
    window.googlefc!.showRevocationMessage = show;
    window.googlefc!.callbackQueue![0].CONSENT_API_READY();
    expect(show).toHaveBeenCalledOnce();
    expect(
      (window.adsbygoogle as AdQueue).requestNonPersonalizedAds,
    ).toBeUndefined();
  });
});
