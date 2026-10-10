import "server-only";
import { affiliateProviderSeeds } from "@/content/affiliate/providers";
import { publicProviderSchema } from "./schema";
import {
  publicProvider,
  recommendTools,
  type ToolIntent,
} from "./recommendations";

export async function getAffiliateProviders() {
  if (process.env.CONTENT_SOURCE === "seed")
    return affiliateProviderSeeds.map((p) => publicProvider(p));
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return [];
  try {
    // Cached public projection contains no approval notes or pending tracking URLs.
    // Next's tagged fetch works with this app's existing cache configuration.
    const response = await fetch(
      `${base}/rest/v1/rpc/affiliate_public_providers`,
      {
        method: "GET",
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 300, tags: ["affiliate-providers"] },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) return [];
    const rows: unknown = await response.json();
    if (!Array.isArray(rows)) return [];
    return rows.flatMap((row) => {
      const parsed = publicProviderSchema.safeParse(row);
      return parsed.success ? [parsed.data] : [];
    });
  } catch {
    return [];
  } // Recommendation failures must never break prompt copying.
}
export async function getRecommendedTools(intent: ToolIntent) {
  return recommendTools(
    await getAffiliateProviders(),
    intent,
    process.env.AFFILIATE_MONETIZATION_ENABLED === "true",
  );
}
