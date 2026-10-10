"use server";
import { requireAdmin } from "@/lib/supabase/server";
import {
  capabilities,
  providerSchema,
  type AffiliateProvider,
} from "@/lib/affiliate/schema";
import {
  allowedProviderUrl,
  hasProviderPolicy,
} from "@/lib/affiliate/url-policy";
import { updateTag, revalidatePath } from "next/cache";
export type AffiliateActionState = { error?: string; success?: string };

export async function saveAffiliateProvider(
  _: AffiliateActionState,
  form: FormData,
): Promise<AffiliateActionState> {
  const { db } = await requireAdmin();
  try {
    const id = String(form.get("id") || "");
    const { data: old, error: readError } = await db
      .from("affiliate_providers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (readError)
      return {
        error:
          "Affiliate storage is unavailable. Apply the reviewed migration only to the disposable local backend for QA.",
      };
    const now = new Date().toISOString();
    const affiliateUrl = String(form.get("affiliate_url") || "").trim() || null;
    const programUrl = String(form.get("program_url") || "").trim() || null;
    const status = String(form.get("affiliate_status"));
    const changed =
      !old ||
      old.affiliate_url !== affiliateUrl ||
      old.program_url !== programUrl ||
      old.affiliate_status !== status;
    const verified =
      !changed &&
      status === "Approved" &&
      !!affiliateUrl &&
      form.get("verify_link") === "on";
    if (form.get("verify_link") === "on" && !verified)
      return {
        error:
          "Save the approved program and issued URL first. Then review the complete redirect chain and verify that exact saved URL.",
      };
    const input = {
      id,
      name: form.get("name"),
      description: form.get("description"),
      official_url: form.get("official_url"),
      affiliate_url: affiliateUrl,
      program_url: programUrl,
      affiliate_status: status,
      is_enabled: form.get("is_enabled") === "on",
      priority: Number(form.get("priority")),
      media: ["photo", "video"].filter((m) => form.get(`media_${m}`) === "on"),
      capabilities: capabilities
        .filter((c) => form.get(`cap_${c}`) === "on")
        .map((capability) => ({
          capability,
          access: form.get(`access_${capability}`),
          note: form.get(`note_${capability}`),
        })),
      evidence_urls: String(form.get("evidence_urls") || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      last_verified_at:
        form.get("verify_features") === "on"
          ? now
          : old?.last_verified_at || now,
      approval_evidence: form.get("approval_evidence") || "",
      payout_confirmed: form.get("payout_confirmed") === "on",
      placement_confirmed: form.get("placement_confirmed") === "on",
      verified_affiliate_url: verified
        ? affiliateUrl
        : changed
          ? null
          : old?.verified_affiliate_url || null,
      affiliate_url_verified_at: verified
        ? now
        : changed
          ? null
          : old?.affiliate_url_verified_at || null,
    };
    const parsed = providerSchema.safeParse(input);
    if (!parsed.success)
      return {
        error: parsed.error.issues
          .slice(0, 4)
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(" · "),
      };
    const p: AffiliateProvider = parsed.data;
    const previous = old ? providerSchema.parse(old) : null;
    const claimSignature = (record: AffiliateProvider) =>
      JSON.stringify({
        official_url: record.official_url,
        description: record.description,
        capabilities: [...record.capabilities].sort((a, b) =>
          a.capability.localeCompare(b.capability),
        ),
        media: [...record.media].sort(),
        evidence_urls: [...record.evidence_urls].sort(),
      });
    const claimsChanged =
      previous && claimSignature(previous) !== claimSignature(p);
    if (claimsChanged && form.get("verify_features") !== "on")
      return {
        error:
          "Recheck the official capability/access evidence and tick today's feature review before changing public claims.",
      };
    if (previous && !claimsChanged) {
      p.capabilities = previous.capabilities;
      p.media = previous.media;
      p.evidence_urls = previous.evidence_urls;
    }
    if (hasProviderPolicy(id)) {
      if (
        !allowedProviderUrl(id, p.official_url) ||
        (affiliateUrl && !allowedProviderUrl(id, affiliateUrl, true))
      )
        return {
          error:
            "URL rejected by the provider domain/parameter policy. Shared affiliate networks need a reviewed campaign-specific policy before use.",
        };
    } else if (
      p.is_enabled ||
      p.affiliate_url ||
      p.affiliate_status === "Approved"
    )
      return {
        error:
          "New providers stay disabled and nonmonetized until their domain and capability policy is reviewed.",
      };
    const { error } = await db.from("affiliate_providers").upsert(p);
    if (error)
      return {
        error:
          "Unable to save provider. Check database constraints and verification dates.",
      };
    updateTag("affiliate-providers");
    revalidatePath("/admin/affiliate-tools");
    return {
      success:
        "Provider saved. Monetization still requires the release switch and a verified approved URL.",
    };
  } catch {
    return {
      error: "Unable to save provider. Check the fields and your connection.",
    };
  }
}
