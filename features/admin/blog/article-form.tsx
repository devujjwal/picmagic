"use client";
import { ArticleBodyEditor } from "./article-body-editor";
import { ArticleRelationships } from "./article-relationships";
import { ArticleEvidence } from "./article-evidence";
import { ArticleSettings } from "./article-settings";
import { useActionState, useState } from "react";
import type { Article, BlogAuthor } from "@/lib/blog/schema";
import type { Catalog } from "@/types/content";
import { saveArticle } from "./actions";
import { DestinationEditor, TextField } from "./block-editor";
export function ArticleForm({
  initial,
  authors,
  catalog,
  articles,
  saved = false,
}: {
  initial: Article;
  authors: BlogAuthor[];
  catalog: Catalog;
  articles: { slug: string; title: string }[];
  saved?: boolean;
}) {
  const [a, setArticle] = useState(initial);
  const [state, action, pending] = useActionState(
    saveArticle,
    saved
      ? { success: "Article saved. Drafts and review records remain private." }
      : {},
  );
  const update = <K extends keyof Article>(key: K, value: Article[K]) =>
    setArticle((prev) => ({ ...prev, [key]: value }));
  const text = (
    label: string,
    key:
      | "title"
      | "slug"
      | "excerpt"
      | "primary_topic"
      | "seo_title"
      | "meta_description"
      | "evidence_note",
    multiline = false,
  ) => (
    <TextField
      label={label}
      value={a[key]}
      onChange={(v) => update(key, v)}
      multiline={multiline}
    />
  );
  return (
    <form action={action} className="blog-editor">
      <input type="hidden" name="payload" value={JSON.stringify(a)} />
      {text("Title", "title")}
      {text("Slug", "slug")}
      {text("Excerpt", "excerpt", true)}
      <label>
        Author
        <select
          value={a.author_id}
          onChange={(e) => update("author_id", e.target.value)}
        >
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </label>
      <TextField
        label="Reviewed by (only after a genuine review)"
        value={a.reviewed_by || ""}
        onChange={(v) => update("reviewed_by", v || null)}
      />
      <label>
        Article type
        <select
          value={a.article_type}
          onChange={(e) =>
            update("article_type", e.target.value as Article["article_type"])
          }
        >
          <option value="guide">Guide</option>
          <option value="ideas">Ideas</option>
          <option value="lab">PicMagic Lab</option>
        </select>
      </label>
      {text("Primary topic", "primary_topic")}
      <label>
        Featured image
        <select
          value={a.featured_image.url}
          onChange={(e) => {
            const p = catalog.prompts.find(
              (p) => p.preview_image_url === e.target.value,
            );
            if (p)
              update("featured_image", {
                url: p.preview_image_url,
                alt: p.image_alt,
                width: p.image_width,
                height: p.image_height,
                caption:
                  "Original PicMagic AI-generated preview. Illustrative; results vary.",
              });
          }}
        >
          <option value="">Choose an existing approved image</option>
          {catalog.prompts.map((p) => (
            <option key={p.id} value={p.preview_image_url}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      <TextField
        label="Featured image alt text"
        value={a.featured_image.alt}
        onChange={(alt) =>
          update("featured_image", { ...a.featured_image, alt })
        }
      />
      <TextField
        label="Featured image caption"
        value={a.featured_image.caption}
        onChange={(caption) =>
          update("featured_image", { ...a.featured_image, caption })
        }
      />
      <h2>Primary conversion</h2>
      <DestinationEditor
        value={a.primary_conversion}
        onChange={(d) => update("primary_conversion", d)}
        catalog={catalog}
      />
      <ArticleBodyEditor article={a} update={update} catalog={catalog} />
      <ArticleRelationships
        article={a}
        update={update}
        catalog={catalog}
        articles={articles}
      />
      <ArticleEvidence article={a} update={update} />
      <ArticleSettings article={a} initial={initial} update={update} />
      {state.error && (
        <p role="alert" className="notice">
          {state.error}
        </p>
      )}
      {state.success && <p role="status">{state.success}</p>}
      <button className="button" disabled={pending}>
        {" "}
        {pending ? "Saving…" : "Save article"}
      </button>
    </form>
  );
}
