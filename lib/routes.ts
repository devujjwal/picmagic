import type { Prompt } from "@/types/content";
/** Pure route helper: safe in client bundles without importing validation schemas. */
export function promptPath(
  p: Pick<Prompt, "prompt_type" | "category_id" | "slug">,
) {
  return p.prompt_type === "reel" || p.prompt_type === "video"
    ? `/reel-prompts/${p.slug}`
    : `/ai-prompts/${p.category_id}/${p.slug}`;
}
