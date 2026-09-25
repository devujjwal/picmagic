"use client";
import Script from "next/script";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  measurementId,
  startAnalytics,
  trackPageView,
  setAnalyticsDisabled,
} from "@/lib/analytics";
import {
  advertisingConfigured,
  adsenseClient,
  isAdvertisingPage,
} from "@/config/ads";
import {
  prepareAdvertising,
  setAdvertisingSurfaceAllowed,
} from "@/lib/privacy/advertising";
import {
  analyticsConsentKey,
  readConsent,
  subscribeConsent,
} from "@/lib/privacy/consent";
import { AnalyticsConsentBanner } from "./analytics-consent-banner";
const analyticsSnapshot = () => readConsent(analyticsConsentKey);
const serverSnapshot = () => "no" as const;

// Read the server-rendered eligibility decision, including after streamed navigation.
// An eligible-looking pathname alone must never enable advertising on a 404/draft.
function surfaceSnapshot() {
  return (
    document.querySelector<HTMLElement>("main [data-ad-surface]")?.dataset
      .adSurface || ""
  );
}
function subscribeSurface(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-ad-surface"],
  });
  return () => observer.disconnect();
}
const noSurface = () => "";

// One integration controller. Google Privacy & Messaging owns advertising
// consent; PicMagic's independent analytics choice never grants ad consent.
export function Consent({ nonce }: { nonce?: string }) {
  const pathname = usePathname();
  const choice = useSyncExternalStore(
    subscribeConsent,
    analyticsSnapshot,
    serverSnapshot,
  );
  const ga = measurementId();
  const privatePage = pathname === "/admin" || pathname.startsWith("/admin/");
  const [requestedChoices, setRequestedChoices] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const ads = advertisingConfigured();
  const surface = useSyncExternalStore(
    subscribeSurface,
    surfaceSnapshot,
    noSurface,
  );
  const eligible = isAdvertisingPage(pathname) && surface === pathname;
  const vendorDocument = useRef<string | null>(null);
  const loadAdvertising = ads && !privatePage && (eligible || requestedChoices);
  const previousChoice = useRef(choice);
  useEffect(() => {
    const open = () => setRequestedChoices(true);
    window.addEventListener("picmagic:open-advertising-choices", open);
    return () =>
      window.removeEventListener("picmagic:open-advertising-choices", open);
  }, []);
  useEffect(() => {
    // Removing next/script does not unload an executed vendor. Start a fresh
    // document on route changes after loading it, including browser back/forward.
    if (
      vendorDocument.current !== null &&
      (vendorDocument.current !== pathname || (!eligible && !requestedChoices))
    ) {
      setAdvertisingSurfaceAllowed(false);
      window.location.reload();
      return;
    }
    if (!loadAdvertising) return;
    setAdvertisingSurfaceAllowed(eligible);
    prepareAdvertising();
    vendorDocument.current = pathname;
    // Prepare any legacy-rejection restriction before the vendor can execute.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdReady(true);
  }, [loadAdvertising, eligible, pathname, requestedChoices]);
  useEffect(() => {
    if (previousChoice.current === "yes" && choice !== "yes") {
      setAnalyticsDisabled(true);
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      window.location.reload();
    }
    previousChoice.current = choice;
    if (choice === "yes" && ga && !privatePage) {
      startAnalytics();
      trackPageView(pathname);
    } else setAnalyticsDisabled(true);
  }, [choice, ga, privatePage, pathname]);
  if (privatePage) return null;
  return (
    <>
      {choice === "yes" && ga && (
        <Script
          nonce={nonce}
          id="picmagic-ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
          strategy="afterInteractive"
        />
      )}
      {ga && <AnalyticsConsentBanner choice={choice} />}
      {loadAdvertising && adReady && (
        <Script
          nonce={nonce}
          id="picmagic-adsense"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
