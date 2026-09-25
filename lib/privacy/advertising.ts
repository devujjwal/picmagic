import { advertisingConsentKey } from "./consent";

export type AdQueue = unknown[] & {
  pauseAdRequests?: number;
  requestNonPersonalizedAds?: number;
};
type TCData = {
  gdprApplies?: boolean;
  eventStatus?: string;
  cmpStatus?: string;
  tcString?: string;
};
type GoogleFC = {
  callbackQueue?: Array<Record<string, () => void>>;
  showRevocationMessage?: () => void;
};
declare global {
  interface Window {
    googlefc?: GoogleFC;
    __tcfapi?: (
      command: string,
      version: number,
      callback: (data: TCData, success: boolean) => void,
    ) => void;
  }
}
let initialized = false;
let legacyHold = false;
let surfaceAllowed = true;

// Page eligibility is independent of consent. Opening privacy choices on a
// non-advertising page may load the CMP, but must keep ad requests paused.
export function setAdvertisingSurfaceAllowed(allowed: boolean) {
  const wasAllowed = surfaceAllowed;
  surfaceAllowed = allowed;
  const queue = prepareAdvertising();
  if (!allowed) queue.pauseAdRequests = 1;
  else if (!wasAllowed && !legacyHold) queue.pauseAdRequests = 0;
}

function legacyRejected() {
  try {
    return localStorage.getItem(advertisingConsentKey) === "no";
  } catch {
    // PicMagic storage availability is not a substitute for Google's CMP state.
    return false;
  }
}
export function queueGoogleConsent(callback: () => void) {
  window.googlefc ||= {};
  window.googlefc.callbackQueue ||= [];
  window.googlefc.callbackQueue.push({ CONSENT_API_READY: callback });
}

export function prepareAdvertising(): AdQueue {
  const queue = (window.adsbygoogle ||= []) as AdQueue;
  if (initialized) return queue;
  initialized = true;
  legacyHold = legacyRejected();
  let listening = false;
  const honorLegacyRejection = () => {
    if (!legacyRejected() || listening) return;
    listening = true;
    legacyHold = true;
    // The old banner rejected optional cookie storage, not just personalization.
    // NPA alone would not honor that rejection. Keep requests paused until a new
    // explicit CMP decision supersedes it; loading the CMP itself stays possible.
    const activeQueue = (window.adsbygoogle ||= []) as AdQueue;
    activeQueue.pauseAdRequests = 1;
    activeQueue.requestNonPersonalizedAds = 1;
    queueGoogleConsent(() => {
      window.__tcfapi?.("addEventListener", 2, (data, success) => {
        if (
          !legacyHold ||
          !success ||
          data.cmpStatus !== "loaded" ||
          data.eventStatus !== "useractioncomplete" ||
          data.gdprApplies !== true ||
          !data.tcString
        )
          return;
        legacyHold = false;
        try {
          localStorage.removeItem(advertisingConsentKey);
        } catch {
          /* Optional storage. */
        }
        // Google reads the original TC string. A rejection may be eligible for
        // limited ads; it is never rewritten to a grant or to cookie-using NPA.
        // Keep this page's extra non-personalization restriction until reload.
        const activeQueue = (window.adsbygoogle ||= []) as AdQueue;
        activeQueue.requestNonPersonalizedAds = 1;
        activeQueue.pauseAdRequests = surfaceAllowed ? 0 : 1;
      });
    });
  };
  honorLegacyRejection();
  window.addEventListener("storage", honorLegacyRejection);
  window.addEventListener("picmagic:consent", honorLegacyRejection);
  // All fresh CMP states (including rejection and undecided) go to AdSense.
  // Google owns regional applicability, TCF/GPP validation and permitted mode.
  // Do not construct consent strings, set personalization=0, or guess location.
  return queue;
}

export function openAdvertisingChoices(onUnavailable: () => void) {
  window.dispatchEvent(new Event("picmagic:open-advertising-choices"));
  let opened = false;
  const timer = window.setTimeout(() => {
    if (!opened) onUnavailable();
  }, 5000);
  queueGoogleConsent(() => {
    if (!window.googlefc?.showRevocationMessage) return;
    try {
      window.googlefc.showRevocationMessage();
      opened = true;
      window.clearTimeout(timer);
    } catch {
      window.clearTimeout(timer);
      onUnavailable();
    }
  });
}
