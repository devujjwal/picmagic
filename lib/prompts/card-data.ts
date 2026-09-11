import type { Prompt } from "@/types/content";

/** Only discovery fields cross the client boundary; full copy stays on detail pages. */
export type PromptCardData = Pick<
  Prompt,
  | "id"
  | "title"
  | "slug"
  | "category_id"
  | "prompt_type"
  | "display_hint"
  | "image_width"
  | "image_height"
  | "image_alt"
  | "preview_image_url"
  | "thumbnail_url"
  | "preview_video"
  | "content_intent"
  | "style"
>;
export function toPromptCard(p: PromptCardData): PromptCardData {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category_id: p.category_id,
    prompt_type: p.prompt_type,
    display_hint: p.display_hint,
    image_width: p.image_width,
    image_height: p.image_height,
    image_alt: p.image_alt,
    preview_image_url: p.preview_image_url,
    thumbnail_url: p.thumbnail_url,
    preview_video: p.preview_video,
    content_intent: p.content_intent,
    style: p.style,
  };
}
