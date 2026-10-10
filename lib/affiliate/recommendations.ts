import type { Prompt } from "@/types/content";
import { allowedProviderUrl } from "./url-policy";
import {
  publicProviderSchema,
  type AffiliateProvider,
  type PublicAffiliateProvider,
  type Capability,
  type ToolRecommendation,
} from "./schema";

export type ToolIntent = "portrait" | "group" | "product" | "image" | "video";
export function promptToolIntent(
  p: Pick<
    Prompt,
    | "prompt_type"
    | "persona_policy"
    | "people_count"
    | "category_id"
    | "generation_mode"
  >,
): ToolIntent {
  if (["reel", "video"].includes(p.prompt_type)) return "video";
  if (["product", "person-and-product"].includes(p.persona_policy || ""))
    return "product";
  if (
    (p.people_count || 0) > 1 ||
    ["couple", "couples", "family"].includes(p.category_id)
  )
    return "group";
  if (p.persona_policy === "animal") return "image";
  return "portrait";
}
const required: Record<ToolIntent, Capability[]> = {
  portrait: ["reference_image", "photo_editing"],
  group: ["reference_image", "photo_editing"],
  product: ["product_photography", "photo_editing"],
  image: ["text_to_image"],
  video: ["image_to_video"],
};
const preference: Record<ToolIntent, string[]> = {
  portrait: ["chatgpt", "gemini", "getimg", "fotor", "adobe"],
  group: ["chatgpt", "gemini", "fotor", "getimg", "adobe"],
  product: ["photoroom", "getimg", "adobe", "fotor"],
  image: ["getimg", "chatgpt", "gemini", "fotor"],
  video: ["runway", "invideo", "getimg"],
};
export function monetizedProvider(
  p: AffiliateProvider,
  enabled: boolean,
  now = Date.now(),
) {
  const checked = Date.parse(p.affiliate_url_verified_at || "");
  return (
    enabled &&
    p.is_enabled &&
    p.affiliate_status === "Approved" &&
    !!p.program_url &&
    !!p.approval_evidence &&
    p.payout_confirmed &&
    p.placement_confirmed &&
    !!p.affiliate_url &&
    p.affiliate_url === p.verified_affiliate_url &&
    checked <= now &&
    now - checked <= 30 * 86400000 &&
    allowedProviderUrl(p.id, p.affiliate_url, true)
  );
}
export function publicProvider(
  p: AffiliateProvider,
  now = Date.now(),
): PublicAffiliateProvider {
  const ready = monetizedProvider(p, true, now);
  // Pending/unverified tracking tokens and private approval notes never leave the server.
  return publicProviderSchema.parse({
    ...p,
    affiliate_url: ready ? p.affiliate_url : null,
    monetization_ready: ready,
  });
}
function publicMonetized(
  p: PublicAffiliateProvider,
  enabled: boolean,
  now: number,
) {
  const checked = Date.parse(p.affiliate_url_verified_at || "");
  return (
    enabled &&
    p.monetization_ready &&
    p.affiliate_status === "Approved" &&
    !!p.program_url &&
    !!p.affiliate_url &&
    checked <= now &&
    now - checked <= 30 * 86400000 &&
    allowedProviderUrl(p.id, p.affiliate_url, true)
  );
}
export function recommendTools(
  records: unknown[],
  intent: ToolIntent,
  monetization = false,
  now = Date.now(),
): ToolRecommendation[] {
  const valid = records.flatMap((record) => {
    const parsed = publicProviderSchema.safeParse(record);
    return parsed.success ? [parsed.data] : [];
  });
  return valid
    .filter((p) => {
      const age = now - Date.parse(p.last_verified_at);
      return (
        p.is_enabled &&
        age >= 0 &&
        age <= 30 * 86400000 &&
        allowedProviderUrl(p.id, p.official_url) &&
        p.media.includes(intent === "video" ? "video" : "photo") &&
        required[intent].every((c) =>
          p.capabilities.some((x) => x.capability === c),
        )
      );
    })
    .sort((a, b) => {
      // Suitability order precedes admin priority and any commission relationship.
      const suitability = (p: PublicAffiliateProvider) => {
        const i = preference[intent].indexOf(p.id);
        return i < 0 ? 100 : intent === "video" ? i : Math.floor(i / 2);
      };
      const accessRank = (p: PublicAffiliateProvider) =>
        required[intent].some(
          (c) =>
            p.capabilities.find((x) => x.capability === c)?.access === "paid",
        )
          ? 2
          : required[intent].every(
                (c) =>
                  p.capabilities.find((x) => x.capability === c)?.access ===
                  "free",
              )
            ? 0
            : 1;
      return (
        suitability(a) - suitability(b) ||
        accessRank(a) - accessRank(b) ||
        a.priority - b.priority ||
        Number(publicMonetized(b, monetization, now)) -
          Number(publicMonetized(a, monetization, now)) ||
        a.id.localeCompare(b.id)
      );
    })
    .slice(0, 3)
    .map((p) => {
      const affiliate = publicMonetized(p, monetization, now);
      const features = required[intent].map((c) =>
        p.capabilities.find((x) => x.capability === c)!,
      );
      const level = features.some((f) => f.access === "paid")
        ? "paid"
        : features.some((f) => f.access === "unknown")
          ? "unknown"
          : features.some((f) => f.access === "trial")
            ? "trial"
            : "free";
      const label = {
        free: "Free plan available; limits apply",
        paid: "Paid access required",
        trial: "Trial available; check terms",
        unknown: "Check current access and pricing",
      }[level];
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        href: affiliate ? p.affiliate_url! : p.official_url,
        access_note: `${label}. ${features.map((f) => f.note).join(" ")}`,
        access_label: label,
        affiliate_enabled: affiliate,
      };
    });
}
export const articleToolIntents: Record<string, ToolIntent> = {
  "create-ai-photos-with-chatgpt": "portrait",
  "keep-your-face-the-same-in-ai-photos": "portrait",
  "ai-photo-ideas-for-men": "portrait",
  "ai-photo-ideas-for-women": "portrait",
  "ai-couple-photo-ideas-for-instagram": "group",
};
