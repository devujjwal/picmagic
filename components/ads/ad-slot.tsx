"use client";
import { useEffect, useRef, useState } from "react";
import { adSlotId, adsenseClient, advertisingConfigured } from "@/config/ads";
import { prepareAdvertising } from "@/lib/privacy/advertising";
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
  const ref = useRef<HTMLElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [visible, setVisible] = useState(false);
  const enabled = advertisingConfigured();
  const slot = adSlotId(placement);
  useEffect(() => {
    if (!enabled || !slot || !ref.current) return;
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
  }, [enabled, slot]);
  useEffect(() => {
    const element = insRef.current;
    if (!visible || !element || element.dataset.picmagicRequested) return;
    // Request only after React commits the actual ins element. The DOM marker
    // survives Strict Mode effects and avoids duplicate requests on rerenders.
    element.dataset.picmagicRequested = "true";
    try {
      prepareAdvertising().push({});
    } catch {
      // Blocked ads never interrupt discovery or create a retry loop.
    }
  }, [visible, slot]);
  if (!slot) return null;
  if (!enabled)
    return <div className="ad-reserve ad-empty" aria-hidden="true" />;
  return (
    <aside className="ad-reserve" aria-label="Advertisement" ref={ref}>
      <span>Advertisement</span>
      {visible && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: 250 }}
          data-ad-client={adsenseClient}
          data-ad-slot={slot}
          data-full-width-responsive="false"
        />
      )}
    </aside>
  );
}
