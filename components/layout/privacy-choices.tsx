"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { advertisingConfigured } from "@/config/ads";
import { measurementId } from "@/lib/analytics";
import { openAdvertisingChoices } from "@/lib/privacy/advertising";
import {
  analyticsConsentKey,
  readConsent,
  subscribeConsent,
  writeConsent,
} from "@/lib/privacy/consent";
const snapshot = () => readConsent(analyticsConsentKey);
const serverSnapshot = () => "no" as const;
export function PrivacyChoices() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("");
  const choice = useSyncExternalStore(
    subscribeConsent,
    snapshot,
    serverSnapshot,
  );
  const pathname = usePathname();
  const ads = advertisingConfigured();
  const ga = measurementId();
  if (pathname.startsWith("/admin") || (!ads && !ga)) return null;
  return (
    <>
      <button
        className="privacy-control"
        onClick={() => dialog.current?.showModal()}
      >
        Cookie preferences
      </button>
      <dialog
        ref={dialog}
        className="privacy-dialog"
        aria-labelledby="privacy-title"
      >
        <h2 id="privacy-title">Your privacy choices</h2>
        <button
          className="button secondary small"
          onClick={() => dialog.current?.close()}
        >
          Close
        </button>
        {ads && (
          <section>
            <h3>Advertising</h3>
            <p>
              Google manages the advertising choices that apply in your region.
              Rejecting personalization may still allow non-personalized or
              limited ads. Some choices may mean no ads can be served.
            </p>
            <button
              className="button secondary"
              onClick={() => {
                setStatus(
                  "Google will show applicable regional choices. If no message applies, see our Privacy page and any Google privacy link on this page.",
                );
                openAdvertisingChoices(() =>
                  setStatus(
                    "Google’s privacy controls could not load. Check your connection or content blocker and try again. Your existing choices have not been changed.",
                  ),
                );
                dialog.current?.close();
              }}
            >
              Advertising privacy choices
            </button>
          </section>
        )}
        {ga && (
          <section>
            <h3>Optional analytics</h3>
            <p>
              Help us understand which PicMagic features are useful. Analytics
              stays off unless you allow it. Current choice:{" "}
              {choice === "yes" ? "allowed" : "not allowed"}.
            </p>
            <div className="privacy-actions">
              <button
                className="button small"
                onClick={() => {
                  writeConsent(analyticsConsentKey, "yes");
                  dialog.current?.close();
                }}
              >
                Allow analytics
              </button>
              <button
                className="button secondary small"
                onClick={() => {
                  writeConsent(analyticsConsentKey, "no");
                  dialog.current?.close();
                }}
              >
                Reject analytics
              </button>
            </div>
          </section>
        )}
        <p>
          <a href="/privacy">Read our Privacy policy</a>
        </p>
      </dialog>
      <span className="privacy-status" role="status">
        {status}
      </span>
    </>
  );
}
