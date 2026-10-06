"use client";
import type { Article } from "@/lib/blog/schema";
import type { Catalog } from "@/types/content";
import type { UpdateArticle } from "./article-settings";
export function ArticleRelationships({
  article: a,
  update,
  catalog,
  articles,
}: {
  article: Article;
  update: UpdateArticle;
  catalog: Catalog;
  articles: { slug: string; title: string }[];
}) {
  function toggle<
    K extends "related_prompts" | "related_collections" | "related_articles",
  >(key: K, value: string) {
    update(
      key,
      a[key].includes(value)
        ? a[key].filter((v) => v !== value)
        : [...a[key], value],
    );
  }
  return (
    <>
      <h2>Relationships</h2>
      <details>
        <summary>Related prompts</summary>
        {catalog.prompts.map((p) => (
          <label key={p.id}>
            <input
              type="checkbox"
              checked={a.related_prompts.includes(p.id)}
              onChange={() => toggle("related_prompts", p.id)}
            />{" "}
            {p.title}
          </label>
        ))}
      </details>
      <details>
        <summary>Related categories and collections</summary>
        {[
          ...catalog.categories.map((c) => ({
            path: `/ai-prompts/${c.slug}`,
            name: c.name,
          })),
          ...catalog.collections.map((c) => ({
            path: `/collections/${c.slug}`,
            name: c.name,
          })),
        ].map((c) => (
          <label key={c.path}>
            <input
              type="checkbox"
              checked={a.related_collections.includes(c.path)}
              onChange={() => toggle("related_collections", c.path)}
            />{" "}
            {c.name}
          </label>
        ))}
      </details>
      <details>
        <summary>Related articles</summary>
        {articles
          .filter((r) => r.slug !== a.slug)
          .map((r) => (
            <label key={r.slug}>
              <input
                type="checkbox"
                checked={a.related_articles.includes(r.slug)}
                onChange={() => toggle("related_articles", r.slug)}
              />{" "}
              {r.title}
            </label>
          ))}
      </details>
    </>
  );
}
