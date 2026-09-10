"use client";
import Script from "next/script";
import { useSyncExternalStore } from "react";
const subscribe = (cb: () => void) => {
  window.addEventListener("picmagic:consent", cb);
  return () => window.removeEventListener("picmagic:consent", cb);
};
function snapshot() {
  try {
    return localStorage.getItem("picmagic:analytics-consent") || "unset";
  } catch {
    return "no";
  }
}
export function Consent() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "no");
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const ads =
    process.env.NEXT_PUBLIC_ADS_ENABLED === "true" &&
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const configured = Boolean(ga || ads);
  function choose(value: string) {
    const previous = snapshot();
    try {
      localStorage.setItem("picmagic:analytics-consent", value);
    } catch {}
    window.dispatchEvent(new Event("picmagic:consent"));
    if (value === "no")
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    if (previous === "yes" && value !== "yes") window.location.reload();
  }
  if (!configured) return null;
  return (
    <>
      {value === "unset" && (
        <aside className="consent" aria-label="Privacy preferences">
          <p>
            May we use optional analytics and advertising cookies? Your saved
            looks work either way.
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
      {value === "yes" && ga && /^G-[A-Z0-9]+$/.test(ga) && (
        <>
          <Script
            id="ga-init"
            strategy="afterInteractive"
          >{`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config',${JSON.stringify(ga)},{send_page_view:true});`}</Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
        </>
      )}
      {value === "yes" && ads && /^ca-pub-\d+$/.test(ads) && (
        <Script
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads}`}
          strategy="lazyOnload"
        />
      )}
      <button
        className="privacy-control"
        onClick={() => choose(value === "unset" ? "no" : "unset")}
      >
        Cookie preferences
      </button>
    </>
  );
}
