import { StrictMode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  advertisingConsentKey,
  analyticsConsentKey,
} from "@/lib/privacy/consent";
vi.mock("@/config/ads", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/config/ads")>()),
  adsenseClient: "ca-pub-4114304022167819",
  advertisingConfigured: () => process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
}));
let enterViewport: () => void;
beforeEach(() => {
  localStorage.clear();
  window.adsbygoogle = [];
  vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_AD_SLOTS", '{"home-feed-1":"2111918706"}');
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        enterViewport = () =>
          callback(
            [{ isIntersecting: true } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it("requires viewport visibility and a committed element, then delegates once to Google", () => {
  localStorage.setItem(analyticsConsentKey, "yes");
  const view = render(
    <StrictMode>
      <AdSlot placement="home-feed-1" />
    </StrictMode>,
  );
  expect(view.container.querySelector("ins")).toBeNull();
  expect(window.adsbygoogle).toHaveLength(0);
  act(() => {
    localStorage.setItem(advertisingConsentKey, "yes");
    window.dispatchEvent(new Event("picmagic:consent"));
  });
  expect(view.container.querySelector("ins")).toBeNull();
  act(() => enterViewport());
  expect(
    view.container
      .querySelector("ins")
      ?.getAttribute("data-picmagic-requested"),
  ).toBe("true");
  expect(window.adsbygoogle).toHaveLength(1);
  view.rerender(
    <StrictMode>
      <AdSlot placement="home-feed-1" />
    </StrictMode>,
  );
  act(() => window.dispatchEvent(new Event("picmagic:consent")));
  expect(window.adsbygoogle).toHaveLength(1);
  act(() => {
    localStorage.setItem(advertisingConsentKey, "no");
    window.dispatchEvent(new Event("storage"));
  });
  expect(view.container.querySelector("ins")).not.toBeNull();
  expect(window.adsbygoogle).toHaveLength(1);
});
it("ignores missing placement IDs and disabled integrations", () => {
  localStorage.setItem(advertisingConsentKey, "yes");
  const view = render(<AdSlot placement="prompt-detail-top" />);
  expect(view.container.querySelector("aside")).toBeNull();
  vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "false");
  view.rerender(<AdSlot placement="home-feed-1" />);
  expect(view.container.querySelector("aside")).toBeNull();
  expect(window.adsbygoogle).toHaveLength(0);
});
