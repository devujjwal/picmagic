import { blogEditorData } from "@/features/admin/blog/data";
import { ArticleForm } from "@/features/admin/blog/article-form";
import { type Article } from "@/lib/blog/schema";
export default async function NewArticle() {
  const data = await blogEditorData();
  const p = data.catalog.prompts[0];
  if (!p || !data.authors[0])
    return (
      <p>
        Prepare an author and approved public image before creating an article.
      </p>
    );
  const now = new Date().toISOString();
  const initial: Article = {
    id: crypto.randomUUID(),
    version: 1,
    slug: "new-guide",
    title: "New guide",
    excerpt: "Describe what the reader will learn.",
    body: [
      { type: "paragraph", content: [{ text: "Start with a useful answer." }] },
    ],
    author_id: data.authors[0].id,
    reviewed_by: null,
    article_type: "guide",
    primary_topic: "Guides",
    related_prompts: [],
    related_collections: [],
    related_articles: [],
    seo_title: "New guide",
    meta_description: "Describe this guide.",
    featured_image: {
      url: p.preview_image_url,
      alt: p.image_alt,
      width: p.image_width,
      height: p.image_height,
      caption: "Original PicMagic AI-generated preview.",
    },
    primary_conversion: {
      type: "category",
      path: "/ai-prompts/men",
      label: "Explore men’s photo ideas",
    },
    status: "draft",
    is_indexable: false,
    is_featured: false,
    date_published: null,
    date_modified: now,
    created_at: now,
    noindex_reason: null,
    noindex_review_at: null,
    sources: [],
    evidence_note: "",
  };
  return (
    <>
      <h1>New article</h1>
      <ArticleForm initial={initial} {...data} />
    </>
  );
}
