import { z } from "zod";

export const affiliateStatuses = [
  "Researching",
  "Application required",
  "Applied",
  "Approved",
  "Rejected",
  "Unavailable",
] as const;
export const capabilities = [
  "text_to_image",
  "image_to_image",
  "reference_image",
  "photo_editing",
  "image_upscaling",
  "product_photography",
  "text_to_video",
  "image_to_video",
  "multi_image_reference",
] as const;
export const accessLevels = ["free", "paid", "trial", "unknown"] as const;
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80);
const httpsUrl = z
  .string()
  .max(2000)
  .refine((value) => {
    try {
      const u = new URL(value);
      return (
        u.protocol === "https:" &&
        !u.username &&
        !u.password &&
        !u.port &&
        !u.hash
      );
    } catch {
      return false;
    }
  }, "Use an HTTPS URL without credentials, port or fragment");
const providerFields = z.object({
  id: slug,
  name: z.string().trim().min(2).max(80),
  official_url: httpsUrl,
  affiliate_url: httpsUrl.nullable(),
  affiliate_status: z.enum(affiliateStatuses),
  description: z.string().trim().min(15).max(240),
  capabilities: z
    .array(
      z.object({
        capability: z.enum(capabilities),
        access: z.enum(accessLevels),
        note: z.string().trim().min(5).max(200),
      }),
    )
    .max(9),
  media: z
    .array(z.enum(["photo", "video"]))
    .min(1)
    .max(2),
  is_enabled: z.boolean(),
  priority: z.number().int().min(0).max(100),
  program_url: httpsUrl.nullable(),
  evidence_urls: z.array(httpsUrl).min(1).max(12),
  last_verified_at: z.iso.datetime({ offset: true }),
  approval_evidence: z.string().trim().max(1000),
  payout_confirmed: z.boolean(),
  placement_confirmed: z.boolean(),
  verified_affiliate_url: httpsUrl.nullable(),
  affiliate_url_verified_at: z.iso.datetime({ offset: true }).nullable(),
});
export const providerSchema = providerFields.superRefine((p, ctx) => {
  if (
    new Set(p.capabilities.map((c) => c.capability)).size !==
    p.capabilities.length
  )
    ctx.addIssue({ code: "custom", message: "Capabilities must be unique" });
  if (
    p.affiliate_url_verified_at &&
    p.verified_affiliate_url !== p.affiliate_url
  )
    ctx.addIssue({
      code: "custom",
      message: "Verification must match the exact affiliate URL",
    });
  if (
    p.affiliate_status === "Approved" &&
    (!p.program_url ||
      !p.approval_evidence ||
      !p.payout_confirmed ||
      !p.placement_confirmed)
  )
    ctx.addIssue({
      code: "custom",
      message:
        "Approval requires acceptance evidence, India payout and content-placement confirmation",
    });
});
export type AffiliateProvider = z.infer<typeof providerSchema>;
export const publicProviderSchema = providerFields
  .pick({
    id: true,
    name: true,
    official_url: true,
    affiliate_url: true,
    affiliate_status: true,
    description: true,
    capabilities: true,
    media: true,
    is_enabled: true,
    priority: true,
    program_url: true,
    evidence_urls: true,
    last_verified_at: true,
    affiliate_url_verified_at: true,
  })
  .extend({ monetization_ready: z.boolean() });
export type PublicAffiliateProvider = z.infer<typeof publicProviderSchema>;
export type Capability = (typeof capabilities)[number];
export type ToolRecommendation = {
  id: string;
  name: string;
  description: string;
  href: string;
  access_note: string;
  access_label: string;
  affiliate_enabled: boolean;
};
export type RecommendationContext = {
  prompt_type: "photo" | "photo_edit" | "reel" | "video" | "article";
  content_slug: string;
  placement:
    | "photo_detail"
    | "reel_detail"
    | "blog_article"
    | "photo_copy"
    | "reel_copy";
};
