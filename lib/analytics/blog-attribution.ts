import { analyticsConsentKey, readConsent } from "@/lib/privacy/consent";
export const blogAttributionKey = "picmagic:blog-funnel:v1";
const entryKey = "picmagic:entry-source:v1";
export type EntrySource = "organic_search" | "referral" | "direct" | "internal";
export type BlogAttribution = {
  article_slug: string;
  cta_role: "primary" | "secondary";
  destination_type: "prompt" | "category" | "collection";
  destination_path: string;
  entry_source: EntrySource;
  expires: number;
};
export const validBlogSlug = (s: unknown): s is string =>
  typeof s === "string" &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) &&
  s.length <= 120;
export const validDestination = (s: unknown): s is string =>
  typeof s === "string" &&
  /^\/(?:ai-prompts\/[a-z0-9-]+(?:\/[a-z0-9-]+)?|collections\/[a-z0-9-]+)$/.test(
    s,
  );
export const validEntrySource = (s: unknown): s is EntrySource =>
  ["organic_search", "referral", "direct", "internal"].includes(String(s));
export function clearBlogAttribution() {
  try {
    sessionStorage.removeItem(blogAttributionKey);
    sessionStorage.removeItem(entryKey);
  } catch {
    /* Optional storage. */
  }
}
function permitted() {
  if (typeof window === "undefined") return false;
  if (readConsent(analyticsConsentKey) !== "yes") {
    clearBlogAttribution();
    return false;
  }
  if (/^\/(admin|blog-preview)(\/|$)/.test(window.location.pathname)) {
    clearBlogAttribution();
    return false;
  }
  return true;
}
export function classifyEntry(referrer: string): EntrySource {
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (
      ["picmagic.in", "www.picmagic.in", "localhost", "127.0.0.1"].includes(
        host,
      )
    )
      return "internal";
    if (
      /^(?:www\.)?google\.(?:com|co\.in|co\.uk|[a-z]{2})$/.test(host) ||
      /^(?:www\.)?(?:bing\.com|duckduckgo\.com|search\.yahoo\.com)$/.test(host)
    )
      return "organic_search";
    return "referral";
  } catch {
    return "direct";
  }
}
export function blogEntrySource(): EntrySource | undefined {
  if (!permitted()) return undefined;
  try {
    const saved = sessionStorage.getItem(entryKey);
    if (validEntrySource(saved)) return saved;
    const source = classifyEntry(document.referrer);
    sessionStorage.setItem(entryKey, source);
    return source;
  } catch {
    return classifyEntry(document.referrer);
  }
}
export function setBlogAttribution(
  input: Omit<BlogAttribution, "entry_source" | "expires">,
) {
  if (
    !permitted() ||
    !validBlogSlug(input.article_slug) ||
    !validDestination(input.destination_path)
  )
    return;
  const context = {
    ...input,
    entry_source: blogEntrySource() || "direct",
    expires: Date.now() + 30 * 60 * 1000,
  };
  try {
    sessionStorage.setItem(blogAttributionKey, JSON.stringify(context));
  } catch {
    /* Events can still be sent without cross-page attribution. */
  }
}
export function readBlogAttribution():
  Omit<BlogAttribution, "expires"> | undefined {
  if (!permitted()) return undefined;
  try {
    const a = JSON.parse(sessionStorage.getItem(blogAttributionKey) || "null");
    if (
      !a ||
      !validBlogSlug(a.article_slug) ||
      !validDestination(a.destination_path) ||
      !["primary", "secondary"].includes(a.cta_role) ||
      !["prompt", "category", "collection"].includes(a.destination_type) ||
      !validEntrySource(a.entry_source) ||
      !Number.isFinite(a.expires) ||
      a.expires <= Date.now()
    ) {
      sessionStorage.removeItem(blogAttributionKey);
      return undefined;
    }
    return {
      article_slug: a.article_slug,
      destination_path: a.destination_path,
      destination_type: a.destination_type,
      cta_role: a.cta_role,
      entry_source: a.entry_source,
    };
  } catch {
    return undefined;
  }
}
