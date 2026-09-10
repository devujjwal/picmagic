import { z } from "zod";
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
export const promptSchema = z.object({
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
});
export type Prompt = z.infer<typeof promptSchema>;
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
});
export type Collection = z.infer<typeof collectionSchema>;
export type Catalog = {
  prompts: Prompt[];
  categories: Category[];
  collections: Collection[];
};
export { promptPath } from "@/lib/routes";
