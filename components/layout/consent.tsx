"use client";
import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  measurementId,
  startAnalytics,
  trackPageView,
  setAnalyticsDisabled,
} from "@/lib/analytics";
import { adsenseClient, isAdvertisingPage } from "@/config/ads";
import {
  advertisingConsentKey,
  analyticsConsentKey,
  readConsent,
  subscribeConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/privacy/consent";
const adSnapshot = () => readConsent(advertisingConsentKey);
const analyticsSnapshot = () => readConsent(analyticsConsentKey);
const serverSnapshot = () => "no" as const;

export function Consent() {
  const pathname = usePathname();
  const adChoice = useSyncExternalStore(
    subscribeConsent,
    adSnapshot,
    serverSnapshot,
  );
  const analyticsChoice = useSyncExternalStore(
    subscribeConsent,
    analyticsSnapshot,
    serverSnapshot,
  );
  const ga = measurementId();
  const ads = process.env.NEXT_PUBLIC_ADS_ENABLED === "true" && adsenseClient;
  const hasAnalytics = Boolean(ga && /^G-[A-Z0-9]+$/.test(ga));
  const adPage = isAdvertisingPage(pathname);
  const privatePage = pathname === "/admin" || pathname.startsWith("/admin/");
  const adScriptLoaded = useRef(false);
  const analyticsScriptLoaded = useRef(false);
  const previousChoices = useRef({ adChoice, analyticsChoice });
  useEffect(() => {
    // Revocation in another tab also stops previously loaded vendor scripts.
    if (
      ((adScriptLoaded.current || previousChoices.current.adChoice === "yes") &&
        adChoice !== "yes") ||
      ((analyticsScriptLoaded.current ||
        previousChoices.current.analyticsChoice === "yes") &&
        analyticsChoice !== "yes")
    ) {
      window.location.reload();
    }
    previousChoices.current = { adChoice, analyticsChoice };
  }, [adChoice, analyticsChoice]);
  useEffect(() => {
    if (analyticsChoice === "yes" && hasAnalytics && !privatePage) {
      startAnalytics();
      trackPageView(pathname);
    } else {
      setAnalyticsDisabled(true);
    }
  }, [analyticsChoice, hasAnalytics, privatePage, pathname]);
  if (privatePage || (!ads && !hasAnalytics)) return null;
  const showAdChoice = Boolean(ads && adPage && adChoice === "unset");
  const showAnalyticsChoice = hasAnalytics && analyticsChoice === "unset";
  const description =
    showAdChoice && showAnalyticsChoice
      ? "advertising and analytics cookies"
      : showAdChoice
        ? "advertising cookies"
        : "analytics cookies";
  function choose(value: ConsentChoice) {
    if (ads && (value === "unset" || showAdChoice))
      writeConsent(advertisingConsentKey, value);
    if (hasAnalytics && (value === "unset" || showAnalyticsChoice))
      writeConsent(analyticsConsentKey, value);
    if (value !== "yes")
      window.gtag?.("consent", "update", {
        analytics_storage:
          readConsent(analyticsConsentKey) === "yes" ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
  }
  return (
    <>
      {(showAdChoice || showAnalyticsChoice) && (
        <aside className="consent" aria-label="Privacy preferences">
          <p>
            May we use optional {description}? Advertising supports PicMagic;
            analytics helps us understand which features are useful. You can
            reject them and still use every photo idea and creator.{" "}
            <a href="/privacy">Privacy policy</a>
          </p>
          <div>
            <button className="button small" onClick={() => choose("yes")}>
              Allow optional cookies
            </button>
            <button
              className="button secondary small"
              onClick={() => choose("no")}
            >
              Reject optional cookies
            </button>
          </div>
        </aside>
      )}
      {analyticsChoice === "yes" && hasAnalytics && (
        <>
          <Script
            id="picmagic-ga4"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
            onReady={() => {
              analyticsScriptLoaded.current = true;
            }}
          />
        </>
      )}
      {adChoice === "yes" && ads && adPage && (
        <Script
          id="picmagic-adsense"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads}`}
          strategy="afterInteractive"
          onReady={() => {
            adScriptLoaded.current = true;
          }}
        />
      )}
      <button className="privacy-control" onClick={() => choose("unset")}>
        Cookie preferences
      </button>
    </>
  );
}
