import { z } from "zod";
import {
  friendsTripInputSchema,
  FRIENDS_TRIP_TEMPLATE,
} from "@/features/generator/friends-trip";
// Avoid runtime code generation so validation works under the production CSP.
z.config({ jitless: true });
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(140);
export const safeImageSchema = z.string().refine((value) => {
  if (/^\/previews\/[a-z0-9-]+(?:-thumb)?\.webp$/.test(value)) return true;
  try {
    const url = new URL(value);
    const approved = new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://invalid.local",
    );
    const secure =
      url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["127.0.0.1", "localhost"].includes(url.hostname));
    return (
      secure &&
      url.origin === approved.origin &&
      !url.username &&
      !url.password &&
      url.pathname.startsWith("/storage/v1/object/public/previews/")
    );
  } catch {
    return false;
  }
}, "Use a local preview or approved Supabase Storage image");
export const faqSchema = z.object({
  question: z.string().min(5).max(250),
  answer: z.string().min(10).max(2000),
});
export const reelSchema = z.object({
  hook: z.string().nullish(),
  progression: z.string().nullish(),
  payoff: z.string().nullish(),
  duration: z.number().int().positive(),
  concept: z.string(),
  scenes: z.array(
    z.object({
      start: z.number(),
      end: z.number(),
      action: z.string(),
      transition: z.string(),
    }),
  ),
  caption: z.string(),
  hashtags: z.array(z.string()),
  music_mood: z.string(),
});
export const previewVideoSchema = z.object({
  url: z.string().regex(/^\/videos\/[a-z0-9-]+\.mp4$/),
  width: z.number().int().min(240).max(1920),
  height: z.number().int().min(240).max(1920),
  duration: z.number().min(5).max(8),
  bytes: z.number().int().positive().max(4_000_000),
  mime_type: z.literal("video/mp4"),
  provenance: z.string().min(10),
});
export const promptSchema = z
  .object({
    transformation_type: slugSchema.nullish(),
    display_hint: z.enum(["standard", "wide"]).nullish(),
    reference_contract: z
      .object({
        medium: z.enum(["photographic", "artistic-palette"]),
        identity_count: z.number().int().min(1).max(20).nullable(),
        depiction_count: z.number().int().min(1).max(12),
        reference_age: z.enum(["preserve", "child-required", "adult-required"]),
        product_views: z.enum(["reference-supported", "not-applicable"]),
      })
      .nullish(),
    generation_mode: z
      .enum(["reference-optional", "reference-required"])
      .nullish(),
    reel_template: z
      .object({
        key: z.literal(FRIENDS_TRIP_TEMPLATE),
        variables: friendsTripInputSchema,
      })
      .nullish(),
    place_name: z.string().max(40).nullish(),
    people_count: z.number().int().min(1).max(20).nullish(),
    poster_role: z.enum(["concept-preview", "source-reference"]).nullish(),
    distinctiveness_score: z.number().int().min(1).max(5).nullish(),
    why_ai: z.string().max(2000).nullish(),
    content_intent: z.enum(["creative", "utility"]).nullish(),
    editorial_review_version: z.literal("why-ai-2026-09-v1").nullish(),
    preview_review_status: z
      .enum(["approved", "replacement-required", "generation-required"])
      .nullish(),
    id: z.uuid(),
    slug: slugSchema,
    title: z.string().min(5).max(160),
    description: z.string().min(20).max(2000),
    prompt_text: z.string().min(60).max(15000),
    category_id: slugSchema,
    prompt_type: z.enum(["photo", "photo_edit", "reel", "video"]),
    subject: z.string().min(2),
    style: z.array(z.string()).min(1),
    occasion: z.string(),
    aspect_ratio: z.enum(["1:1", "4:5", "3:4", "9:16", "16:9"]),
    preview_image_url: safeImageSchema,
    thumbnail_url: safeImageSchema,
    image_width: z.number().int().positive(),
    image_height: z.number().int().positive(),
    image_alt: z.string().min(5),
    lighting: z.string(),
    framing: z.string(),
    camera: z.string(),
    suggested_tools: z.array(z.string()),
    tags: z.array(z.string()),
    is_featured: z.boolean(),
    is_trending: z.boolean(),
    trending_rank: z.number().int().nonnegative(),
    is_published: z.boolean(),
    is_indexable: z.boolean(),
    seo_title: z.string(),
    seo_description: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    published_at: z.string().nullable(),
    faqs: z.array(faqSchema),
    reel: reelSchema.nullable(),
    image_brief: z.string().nullish(),
    preview_video: previewVideoSchema.nullish(),
    persona_policy: z
      .enum(["person", "product", "person-and-product", "animal"])
      .nullish(),
    persona_version: z.literal("reference-first-india-default-v1").nullish(),
  })
  .superRefine((p, ctx) => {
    const invalid = (message: string) =>
      ctx.addIssue({ code: "custom", message });
    if (
      p.poster_role === "source-reference" &&
      (p.is_published || p.preview_video)
    )
      invalid("A source reference is not an approved public concept preview.");
    if (!p.reel_template) return;
    const v = p.reel_template.variables;
    if (
      p.prompt_type !== "reel" ||
      p.aspect_ratio !== "9:16" ||
      p.generation_mode !== "reference-required"
    )
      invalid(
        "Friends trip templates require a vertical reference-required reel.",
      );
    if (
      p.place_name !== v.place_name ||
      p.people_count !== v.friends_count ||
      p.reel?.duration !== v.duration
    )
      invalid(
        "Template variables must match place, people count and full reel duration.",
      );
    if (
      !p.prompt_text.startsWith(
        `Use the uploaded reference photos of exactly ${v.friends_count} friends`,
      ) ||
      !p.prompt_text.endsWith(v.place_name)
    )
      invalid("Regenerate the prompt after changing template variables.");
    if (
      p.preview_video &&
      (Math.abs(p.preview_video.width / p.preview_video.height - 9 / 16) >
        0.005 ||
        p.preview_video.duration < 6)
    )
      invalid("Friends trip previews require 9:16 video lasting 6–8 seconds.");
  });
export type Prompt = z.infer<typeof promptSchema>;
/** Flat media contract for integrations; never persist a second independent video state. */
export function reelMediaFields(p: Prompt) {
  return {
    preview_video_url: p.preview_video?.url ?? null,
    poster_image_url: p.preview_image_url,
    video_width: p.preview_video?.width ?? null,
    video_height: p.preview_video?.height ?? null,
    video_duration: p.preview_video?.duration ?? null,
    video_format: p.preview_video ? "mp4" : null,
    place_name: p.place_name ?? null,
    people_count: p.people_count ?? null,
  };
}
export const categorySchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  name: z.string().min(2),
  description: z.string().min(30),
  is_indexable: z.boolean(),
  seo_title: z.string(),
});
export type Category = z.infer<typeof categorySchema>;
export const collectionSchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  name: z.string().min(3),
  description: z.string().min(60),
  kind: z.enum(["style", "subcategory", "occasion", "seasonal"]),
  prompt_ids: z.array(z.uuid()),
  is_indexable: z.boolean(),
  active: z.boolean(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  priority: z.number().int(),
  featured_image: z.union([z.literal(""), safeImageSchema]),
  seo_title: z.string().max(160).nullish(),
  seo_description: z.string().max(500).nullish(),
});
export type Collection = z.infer<typeof collectionSchema>;
export type Catalog = {
  prompts: Prompt[];
  categories: Category[];
  collections: Collection[];
};
export { promptPath } from "@/lib/routes";
