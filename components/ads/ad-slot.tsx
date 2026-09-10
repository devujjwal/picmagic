"use client";
import { useEffect, useRef, useState } from "react";
import { analyticsConsent } from "@/lib/analytics";
export const placements = [
  "home-feed-1",
  "category-inline-1",
  "prompt-detail-top",
  "prompt-detail-inline",
  "prompt-related-feed",
  "reel-page-inline",
  "desktop-sidebar",
] as const;
export type AdPlacement = (typeof placements)[number];
export function AdSlot({ placement }: { placement: AdPlacement }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
  let slots: Record<string, string> = {};
  try {
    slots = JSON.parse(process.env.NEXT_PUBLIC_AD_SLOTS || "{}");
  } catch {}
  const slot = slots[placement];
  useEffect(() => {
    if (!enabled || !slot) return;
    const element = ref.current;
    if (!element) return;
    let pushed = false;
    const tryLoad = () => {
      if (pushed || !analyticsConsent()) return;
      if (!window.adsbygoogle) {
        window.adsbygoogle = [];
      }
      pushed = true;
      setReady(true);
      setTimeout(() => {
        try {
          window.adsbygoogle?.push({});
        } catch {}
      }, 0);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) tryLoad();
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    window.addEventListener("picmagic:consent", tryLoad);
    return () => {
      observer.disconnect();
      window.removeEventListener("picmagic:consent", tryLoad);
    };
  }, [enabled, slot]);
  if (!enabled || !slot) {
    return process.env.NODE_ENV === "development" ? (
      <aside
        className="ad-reserve development-ad"
        aria-label="Reserved advertisement placement"
      >
        <span>Advertisement</span>
      </aside>
    ) : null;
  }
  return (
    <aside className="ad-reserve" aria-label="Advertisement" ref={ref}>
      <span>Advertisement</span>
      {ready && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </aside>
  );
}
