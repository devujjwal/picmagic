import { analyticsConsentKey, readConsent } from "@/lib/privacy/consent";
import {
  blogEntrySource,
  readBlogAttribution,
  validBlogSlug,
  validDestination,
  validEntrySource,
} from "./blog-attribution";
export type AnalyticsEvent =
  | "blog_view"
  | "blog_prompt_click"
  | "blog_collection_click"
  | "blog_cta_click"
  | "blog_share"
  | "blog_scroll_depth"
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
export type Properties = {
  article_slug?: string;
  destination_path?: string;
  destination_type?: "prompt" | "category" | "collection";
  cta_role?: "primary" | "secondary";
  cta_location?: "inline" | "primary" | "related";
  entry_source?: "organic_search" | "referral" | "direct" | "internal";
  scroll_percent?: number;
  prompt_id?: string;
  category?: string;
  method?: string;
  result_count?: number;
  query_length?: number;
  generator_type?: string;
};
type WebVitalMetric = {
  id: string;
  name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
  rating: "good" | "needs-improvement" | "poor";
  value: number;
};
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}
export function analyticsConsent() {
  return (
    typeof window !== "undefined" && readConsent(analyticsConsentKey) === "yes"
  );
}
export function measurementId() {
  const id = process.env.NEXT_PUBLIC_GA_ID || "";
  return /^G-[A-Z0-9]{5,20}$/.test(id) ? id : "";
}
export function safeAnalyticsPath(value: string): string | null {
  try {
    const path = new URL(value, "https://picmagic.in").pathname;
    if (
      ["/guides/reference-photo-prompts", "/guides/prompt-trial"].includes(path)
    )
      return path;
    if (
      !/^\/(?:$|ai-prompts(?:\/[a-z0-9-]+){0,2}$|collections(?:\/[a-z0-9-]+)?$|reel-prompts(?:\/[a-z0-9-]+)?$|create$|enhance-photo$|search$|saved$|blog(?:\/[a-z0-9-]+)?$|about$|privacy$|terms$|contact$)/.test(
        path,
      )
    )
      return null;
    return path;
  } catch {
    return null;
  }
}
export function safeReferrer(value: string) {
  try {
    const u = new URL(value);
    if (!/^https?:$/.test(u.protocol)) return "";
    if (["picmagic.in", "www.picmagic.in"].includes(u.hostname)) {
      const path = safeAnalyticsPath(u.pathname);
      return path ? "https://picmagic.in" + path : "";
    }
    return u.origin + "/";
  } catch {
    return "";
  }
}
export function cleanProperties(props: Properties): Properties {
  const result: Properties = {};
  if (validBlogSlug(props.article_slug))
    result.article_slug = props.article_slug;
  if (validDestination(props.destination_path))
    result.destination_path = props.destination_path;
  if (
    ["prompt", "category", "collection"].includes(props.destination_type || "")
  )
    result.destination_type = props.destination_type;
  if (["primary", "secondary"].includes(props.cta_role || ""))
    result.cta_role = props.cta_role;
  if (["inline", "primary", "related"].includes(props.cta_location || ""))
    result.cta_location = props.cta_location;
  if (validEntrySource(props.entry_source))
    result.entry_source = props.entry_source;
  if ([25, 50, 75, 100].includes(props.scroll_percent || 0))
    result.scroll_percent = props.scroll_percent;
  if (props.prompt_id && /^[a-f0-9-]{36}$/.test(props.prompt_id))
    result.prompt_id = props.prompt_id;
  if (props.category && /^[a-z0-9-]{1,80}$/.test(props.category))
    result.category = props.category;
  if (
    props.method &&
    ["native", "whatsapp", "facebook", "x", "copy_link"].includes(props.method)
  )
    result.method = props.method;
  if (
    props.generator_type &&
    ["photo", "edit", "reel"].includes(props.generator_type)
  )
    result.generator_type = props.generator_type;
  for (const key of ["result_count", "query_length"] as const) {
    const n = props[key];
    if (typeof n === "number" && Number.isFinite(n) && n >= 0)
      result[key] = Math.min(100000, Math.floor(n));
  }
  return result;
}
let initializedId = "";
let lastPath = "";
export function setAnalyticsDisabled(disabled: boolean) {
  const id = measurementId();
  if (typeof window !== "undefined" && id)
    (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] =
      disabled;
}
export function startAnalytics() {
  const id = measurementId();
  if (
    !id ||
    !analyticsConsent() ||
    !safeAnalyticsPath(window.location.pathname)
  )
    return false;
  setAnalyticsDisabled(false);
  if (initializedId === id) return true;
  window.dataLayer ||= [];
  window.gtag ||= function () {
    // Google's command queue uses an Arguments object, including before load.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", id, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location:
      "https://picmagic.in" + safeAnalyticsPath(window.location.pathname),
    page_referrer: safeReferrer(document.referrer),
    page_title: "PicMagic",
  });
  initializedId = id;
  return true;
}
export function trackPageView(pathname: string) {
  const path = safeAnalyticsPath(pathname);
  if (!path) {
    setAnalyticsDisabled(true);
    lastPath = "";
    return;
  }
  if (!startAnalytics() || lastPath === path) return;
  blogEntrySource();
  const context = {
    page_location: "https://picmagic.in" + path,
    page_referrer: lastPath
      ? "https://picmagic.in" + lastPath
      : safeReferrer(document.referrer),
    page_title:
      path === "/search" ? "Search | PicMagic" : document.title || "PicMagic",
  };
  window.gtag!("set", context);
  window.gtag!("event", "page_view", context);
  lastPath = path;
  recordDepth(path);
}
export function track(event: AnalyticsEvent, props: Properties = {}) {
  if (!startAnalytics()) return;
  trackPageView(window.location.pathname);
  window.gtag!("event", event, {
    ...cleanProperties({
      ...(event === "prompt_view" || event === "prompt_copy"
        ? readBlogAttribution()
        : {}),
      ...props,
    }),
    page_location:
      "https://picmagic.in" + safeAnalyticsPath(window.location.pathname),
    page_referrer: safeReferrer(document.referrer),
  });
}
export function trackWebVital(metric: WebVitalMetric) {
  if (!startAnalytics()) return;
  const path = safeAnalyticsPath(window.location.pathname);
  if (!path || !/^[\w-]{1,100}$/.test(metric.id)) return;
  window.gtag!("event", "web_vital", {
    metric_name: metric.name,
    metric_id: metric.id,
    metric_value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value,
    ),
    metric_rating: metric.rating,
    non_interaction: true,
    page_location: `https://picmagic.in${path}`,
  });
}
export function recordDepth(path: string) {
  if (!measurementId() || !analyticsConsent() || !safeAnalyticsPath(path))
    return;
  try {
    const raw: unknown = JSON.parse(
      sessionStorage.getItem("picmagic:session-pages:v2") || "[]",
    );
    const paths = Array.isArray(raw)
      ? [
          ...new Set(
            raw.filter(
              (x): x is string =>
                typeof x === "string" && safeAnalyticsPath(x) === x,
            ),
          ),
        ].slice(0, 100)
      : [];
    if (paths.includes(path)) return;
    const next = [...paths, path];
    sessionStorage.setItem("picmagic:session-pages:v2", JSON.stringify(next));
    for (const threshold of [3, 5, 10] as const)
      if (next.length === threshold) track(`session_depth_${threshold}`);
  } catch {
    /* Session storage is optional. */
  }
}
