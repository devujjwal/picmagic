"use client";
import { useState } from "react";
import type { Article, ArticleBlock } from "@/lib/blog/schema";
import type { Catalog } from "@/types/content";
import type { UpdateArticle } from "./article-settings";
import { BlockEditor, newBlock } from "./block-editor";
export function ArticleBodyEditor({
  article: a,
  update,
  catalog,
}: {
  article: Article;
  update: UpdateArticle;
  catalog: Catalog;
}) {
  const [blockType, setBlockType] = useState<ArticleBlock["type"]>("paragraph");
  function move(i: number, direction: number) {
    const body = [...a.body];
    [body[i], body[i + direction]] = [body[i + direction], body[i]];
    update("body", body);
  }
  return (
    <>
      <h2>Article body</h2>
      {a.body.map((b, i) => (
        <section className="blog-block" key={i}>
          <div className="blog-block-tools">
            <strong>
              Block {i + 1}: {b.type.replaceAll("_", " ")}
            </strong>
            <button
              type="button"
              disabled={i === 0}
              onClick={() => move(i, -1)}
            >
              Move up
            </button>
            <button
              type="button"
              disabled={i === a.body.length - 1}
              onClick={() => move(i, 1)}
            >
              Move down
            </button>
            <button
              type="button"
              onClick={() =>
                update(
                  "body",
                  a.body.filter((_, n) => n !== i),
                )
              }
            >
              Remove block
            </button>
          </div>
          <BlockEditor
            block={b}
            catalog={catalog}
            onChange={(value) =>
              update(
                "body",
                a.body.map((v, n) => (n === i ? value : v)),
              )
            }
          />
        </section>
      ))}
      <div className="blog-block-tools">
        <label>
          New block
          <select
            value={blockType}
            onChange={(e) =>
              setBlockType(e.target.value as ArticleBlock["type"])
            }
          >
            {[
              "paragraph",
              "heading",
              "image",
              "quick_answer",
              "steps",
              "table",
              "callout",
              "faq",
              "prompt_card",
              "prompt_grid",
              "cta",
            ].map((t) => (
              <option key={t} value={t}>
                {t.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button secondary"
          type="button"
          onClick={() => update("body", [...a.body, newBlock(blockType)])}
        >
          Add block
        </button>
      </div>
    </>
  );
}
