"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { adSlotId, adsenseClient } from "@/config/ads";
import { advertisingConsent, subscribeConsent } from "@/lib/privacy/consent";
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
const serverConsent = () => false;

export function AdSlot({ placement }: { placement: AdPlacement }) {
  const ref = useRef<HTMLElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [visible, setVisible] = useState(false);
  const consent = useSyncExternalStore(
    subscribeConsent,
    advertisingConsent,
    serverConsent,
  );
  const enabled =
    process.env.NEXT_PUBLIC_ADS_ENABLED === "true" && Boolean(adsenseClient);
  const slot = adSlotId(placement);
  useEffect(() => {
    if (!enabled || !slot || !consent || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, slot, consent]);
  useEffect(() => {
    const element = insRef.current;
    if (!visible || !consent || !element || element.dataset.picmagicRequested)
      return;
    // Request only after React commits the actual ins element. The DOM marker
    // survives Strict Mode effects and avoids duplicate requests on rerenders.
    element.dataset.picmagicRequested = "true";
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Blocked ads never interrupt discovery or create a retry loop.
    }
  }, [visible, consent, slot]);
  if (!enabled || !slot)
    return process.env.NODE_ENV === "development" ? (
      <aside
        className="ad-reserve development-ad"
        aria-label="Reserved advertisement placement"
      >
        <span>Advertisement</span>
      </aside>
    ) : null;
  if (!consent) return null;
  return (
    <aside className="ad-reserve" aria-label="Advertisement" ref={ref}>
      <span>Advertisement</span>
      {visible && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </aside>
  );
}
