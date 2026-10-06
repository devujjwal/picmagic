"use client";
import { useId } from "react";
import type { ArticleBlock, Article } from "@/lib/blog/schema";
import type { Catalog } from "@/types/content";
export const newBlock = (type: ArticleBlock["type"]): ArticleBlock => {
  switch (type) {
    case "paragraph":
      return { type, content: [{ text: "New paragraph" }] };
    case "heading":
      return { type, level: 2, id: "new-section", text: "New section" };
    case "quick_answer":
      return { type, text: "Answer the main question directly." };
    case "callout":
      return { type, title: "Note", text: "Explain a useful detail." };
    case "steps":
      return {
        type,
        items: [{ title: "First step", text: "Explain the action." }],
      };
    case "faq":
      return { type, items: [{ question: "Question?", answer: "Answer." }] };
    case "table":
      return {
        type,
        caption: "Comparison",
        columns: ["Option", "Guidance"],
        rows: [["First option", "Advice"]],
      };
    case "image":
      return {
        type,
        image: { url: "", alt: "", width: 1, height: 1, caption: "" },
      };
    case "prompt_card":
      return { type, prompt_id: "", why: "", best_use: "", guidance: "" };
    case "prompt_grid":
      return {
        type,
        items: [{ prompt_id: "", why: "", best_use: "", guidance: "" }],
      };
    case "cta":
      return {
        type,
        destination: {
          path: "/ai-prompts/men",
          type: "category",
          label: "Explore men’s photo ideas",
        },
      };
  }
};
export function TextField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const id = useId();
  return (
    <div className="blog-editor-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

export function DestinationEditor({
  value,
  onChange,
  catalog,
}: {
  value: Article["primary_conversion"];
  onChange: (d: Article["primary_conversion"]) => void;
  catalog: Catalog;
}) {
  const choices = [
    ...catalog.prompts.map((p) => ({
      path: `/ai-prompts/${p.category_id}/${p.slug}`,
      type: "prompt" as const,
      name: p.title,
    })),
    ...catalog.categories.map((c) => ({
      path: `/ai-prompts/${c.slug}`,
      type: "category" as const,
      name: c.name,
    })),
    ...catalog.collections.map((c) => ({
      path: `/collections/${c.slug}`,
      type: "collection" as const,
      name: c.name,
    })),
  ];
  return (
    <>
      <label>
        Destination
        <select
          value={value.path}
          onChange={(e) => {
            const c = choices.find((c) => c.path === e.target.value);
            if (c) onChange({ path: c.path, type: c.type, label: value.label });
          }}
        >
          {!choices.some((c) => c.path === value.path) && (
            <option value={value.path}>{value.path}</option>
          )}
          {choices.map((c) => (
            <option key={c.path} value={c.path}>
              {c.type}: {c.name}
            </option>
          ))}
        </select>
      </label>
      <TextField
        label="CTA label"
        value={value.label}
        onChange={(label) => onChange({ ...value, label })}
      />
    </>
  );
}

export type BlockEditorProps = {
  block: ArticleBlock;
  onChange: (block: ArticleBlock) => void;
  catalog: Catalog;
};
