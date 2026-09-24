"use client";

import Link from "@/components/ui/site-link";
import {
  analyticsConsentKey,
  type ConsentChoice,
  writeConsent,
} from "@/lib/privacy/consent";

export function AnalyticsConsentBanner({ choice }: { choice: ConsentChoice }) {
  if (choice !== "unset") return null;
  return (
    <aside className="analytics-consent" aria-label="Optional analytics">
      <div>
        <strong>Help improve PicMagic?</strong>
        <p>
          Allow optional analytics to help us learn which ideas and features
          work best. It stays off unless you choose Allow.
        </p>
      </div>
      <div className="analytics-consent-actions">
        <button
          className="button small"
          onClick={() => writeConsent(analyticsConsentKey, "yes")}
        >
          Allow analytics
        </button>
        <button
          className="button secondary small"
          onClick={() => writeConsent(analyticsConsentKey, "no")}
        >
          No thanks
        </button>
        <Link href="/privacy">Privacy details</Link>
      </div>
    </aside>
  );
}
