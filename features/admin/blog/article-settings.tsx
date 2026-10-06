"use client";
import Link from "next/link";
import type { Article } from "@/lib/blog/schema";
import { TextField } from "./editor-fields";
export type UpdateArticle = <K extends keyof Article>(
  key: K,
  value: Article[K],
) => void;
export function ArticleSettings({
  article: a,
  initial,
  update,
}: {
  article: Article;
  initial: Article;
  update: UpdateArticle;
}) {
  const text = (
    label: string,
    key: "seo_title" | "meta_description" | "evidence_note",
    multiline = false,
  ) => (
    <TextField
      label={label}
      value={a[key]}
      onChange={(value) => update(key, value)}
      multiline={multiline}
    />
  );
  return (
    <>
      <h2>SEO and publication</h2>
      {text("SEO title", "seo_title")}
      {text("Meta description", "meta_description", true)}
      <label>
        Status
        <select
          value={a.status}
          onChange={(e) => {
            const status = e.target.value as Article["status"];
            update("status", status);
            update("is_indexable", status === "published");
            update("noindex_reason", null);
            update("noindex_review_at", null);
          }}
        >
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="published">Published</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          disabled={a.status !== "published"}
          checked={a.is_indexable}
          onChange={(e) => update("is_indexable", e.target.checked)}
        />{" "}
        Indexable (normal publication)
      </label>
      {a.status === "published" && !a.is_indexable && (
        <div className="notice">
          <p>
            Exceptional temporary state only. Resolve within 30 days. Expired
            exceptions become publicly inaccessible.
          </p>
          <TextField
            label="Temporary noindex reason"
            value={a.noindex_reason || ""}
            onChange={(v) => update("noindex_reason", v || null)}
          />
          <label>
            Review deadline
            <input
              type="datetime-local"
              value={a.noindex_review_at?.slice(0, 16) || ""}
              onChange={(e) =>
                update(
                  "noindex_review_at",
                  e.target.value
                    ? new Date(e.target.value + "Z").toISOString()
                    : null,
                )
              }
            />{" "}
            UTC
          </label>
        </div>
      )}
      <label>
        <input
          type="checkbox"
          checked={a.is_featured}
          onChange={(e) => update("is_featured", e.target.checked)}
        />{" "}
        Featured guide candidate
      </label>
      <label>
        First publication date (UTC; preserved after first publication)
        <input
          type="datetime-local"
          disabled={Boolean(initial.date_published)}
          value={a.date_published?.slice(0, 16) || ""}
          onChange={(e) =>
            update(
              "date_published",
              e.target.value
                ? new Date(e.target.value + "Z").toISOString()
                : null,
            )
          }
        />
      </label>
      <p>
        Last substantive update: {initial.date_modified}. Modification dates are
        maintained server-side.
      </p>
      <div className="blog-editor-preview">
        <h2>Canonical and OpenGraph preview</h2>
        <p>https://picmagic.in/blog/{a.slug}</p>
        <h3>{a.seo_title}</h3>
        <p>{a.meta_description}</p>
        <p>
          Image: {a.featured_image.url} ({a.featured_image.width} ×{" "}
          {a.featured_image.height})
        </p>
        <p>Alt: {a.featured_image.alt}</p>
        <p>
          Save before opening the private article preview. Unsaved changes are
          not shown there.
        </p>
        <Link className="button secondary" href={`/admin/blog/${a.id}/preview`}>
          Preview saved article
        </Link>
      </div>
    </>
  );
}
