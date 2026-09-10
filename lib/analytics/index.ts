export type AnalyticsEvent =
  | "prompt_view"
  | "prompt_copy"
  | "prompt_share"
  | "prompt_save"
  | "prompt_unsave"
  | "prompt_generate"
  | "prompt_regenerate"
  | "category_view"
  | "search"
  | "search_result_click"
  | "related_prompt_click"
  | "reel_prompt_generate"
  | "photo_edit_prompt_generate"
  | "whatsapp_share"
  | "session_depth_3"
  | "session_depth_5"
  | "session_depth_10";
type Properties = {
  prompt_id?: string;
  category?: string;
  method?: string;
  result_count?: number;
  query_length?: number;
  generator_type?: string;
};
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}
export function analyticsConsent() {
  try {
    return localStorage.getItem("picmagic:analytics-consent") === "yes";
  } catch {
    return false;
  }
}
export function track(event: AnalyticsEvent, props: Properties = {}) {
  if (
    typeof window === "undefined" ||
    !analyticsConsent() ||
    !process.env.NEXT_PUBLIC_GA_ID
  )
    return;
  window.gtag?.("event", event, props);
}
export function recordDepth(path: string) {
  try {
    const paths: string[] = JSON.parse(
      sessionStorage.getItem("picmagic:session-pages") || "[]",
    );
    if (paths.includes(path)) return;
    const next = [...paths, path];
    sessionStorage.setItem("picmagic:session-pages", JSON.stringify(next));
    for (const threshold of [3, 5, 10] as const) {
      if (next.length === threshold) track(`session_depth_${threshold}`);
    }
  } catch {
    /* Session storage is optional. */
  }
}
