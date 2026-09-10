import { requireAdmin } from "@/lib/supabase/server";
import { PromptForm } from "@/features/admin/prompt-form";
import { categorySchema, type Prompt } from "@/types/content";
export default async function NewPrompt() {
  const { db } = await requireAdmin();
  const { data, error } = await db.from("categories").select("*");
  if (error) throw new Error("Unable to load categories");
  const categories = data.map((c) => categorySchema.parse(c));
  const now = new Date().toISOString();
  const initial: Prompt = {
    id: crypto.randomUUID(),
    slug: "",
    title: "",
    description: "",
    prompt_text: "",
    category_id: categories[0]?.id || "men",
    prompt_type: "photo",
    subject: "Woman",
    style: ["Natural"],
    occasion: "Everyday",
    aspect_ratio: "4:5",
    preview_image_url: "",
    thumbnail_url: "",
    image_width: 960,
    image_height: 1200,
    image_alt: "",
    lighting: "Soft daylight",
    framing: "Half body",
    camera: "85mm lens, f/4",
    suggested_tools: ["ChatGPT Images", "Gemini"],
    tags: [],
    is_featured: false,
    is_trending: false,
    trending_rank: 0,
    is_published: false,
    is_indexable: false,
    seo_title: "",
    seo_description: "",
    created_at: now,
    updated_at: now,
    published_at: null,
    faqs: [],
    reel: null,
  };
  return (
    <>
      <div className="admin-title">
        <h1>A new idea starts here.</h1>
      </div>
      <PromptForm initial={initial} categories={categories} />
    </>
  );
}
