export const advertisingConsentKey = "picmagic:advertising-consent:v1";
export const analyticsConsentKey = "picmagic:analytics-consent";
export type ConsentChoice = "yes" | "no" | "unset";

export function readConsent(key: string): ConsentChoice {
  try {
    const value = localStorage.getItem(key);
    return value === "yes" || value === "no" ? value : "unset";
  } catch {
    return "no";
  }
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener("picmagic:consent", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("picmagic:consent", callback);
    window.removeEventListener("storage", callback);
  };
}

export function writeConsent(key: string, value: ConsentChoice) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Unavailable storage cannot grant optional analytics consent.
  }
  window.dispatchEvent(new Event("picmagic:consent"));
}
