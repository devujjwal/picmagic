"use client";
import type { Article } from "@/lib/blog/schema";
import type { UpdateArticle } from "./article-settings";
import { TextField } from "./editor-fields";
export function ArticleEvidence({
  article: a,
  update,
}: {
  article: Article;
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
      <h2>Provenance</h2>
      {text("Evidence and creation disclosure", "evidence_note", true)}
      {a.sources.map((s, i) => (
        <fieldset key={i}>
          <legend>Source {i + 1}</legend>
          {(["title", "url", "checked_at", "note"] as const).map((key) => (
            <TextField
              key={key}
              label={key.replaceAll("_", " ")}
              value={s[key]}
              onChange={(value) =>
                update(
                  "sources",
                  a.sources.map((v, n) =>
                    n === i ? { ...v, [key]: value } : v,
                  ),
                )
              }
            />
          ))}
          <button
            type="button"
            onClick={() =>
              update(
                "sources",
                a.sources.filter((_, n) => n !== i),
              )
            }
          >
            Remove source
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() =>
          update("sources", [
            ...a.sources,
            {
              title: "Source",
              url: "https://",
              checked_at: new Date().toISOString().slice(0, 10),
              note: "What this evidence supports",
            },
          ])
        }
      >
        Add source
      </button>
    </>
  );
}
