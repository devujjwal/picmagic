"use client";
import {
  analyticsConsent,
  measurementId,
  safeAnalyticsPath,
  track,
} from "@/lib/analytics";
import type { RecommendationContext, ToolRecommendation } from "./schema";

let pagePath = "";
const impressions = new Set<string>();
export function trackAffiliate(
  event:
    | "affiliate_tool_impression"
    | "affiliate_tool_click"
    | "affiliate_outbound_click",
  tool: ToolRecommendation,
  context: RecommendationContext,
) {
  if (
    !analyticsConsent() ||
    !measurementId() ||
    !safeAnalyticsPath(window.location.pathname)
  )
    return false;
  if (pagePath !== window.location.pathname) {
    pagePath = window.location.pathname;
    impressions.clear();
  }
  const key = `${context.content_slug}:${context.placement}:${tool.id}`;
  if (event === "affiliate_tool_impression" && impressions.has(key))
    return true;
  try {
    track(event, {
      provider: tool.id,
      ...context,
      destination_type: tool.affiliate_enabled ? "affiliate" : "official",
      affiliate_enabled: tool.affiliate_enabled,
    });
    if (event === "affiliate_tool_impression") impressions.add(key);
    return true;
  } catch {
    return false;
  } // Analytics cannot prevent navigation or copying.
}
