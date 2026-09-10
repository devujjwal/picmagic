"use client";
import { useActionState } from "react";
import { saveCategory } from "./actions";
import type { Category } from "@/types/content";
export function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState(saveCategory, {});
  return (
    <form action={action} className="wizard-panel mb-5">
      <div className="form-grid">
        <label className="field">
          Slug
          <input
            name="id"
            defaultValue={category?.id}
            required
            readOnly={Boolean(category)}
          />
          <small>
            Category identifiers remain stable. Use collections for styles and
            subcategories.
          </small>
        </label>
        <label className="field">
          Name
          <input name="name" defaultValue={category?.name} required />
        </label>
        <label className="field wide">
          Introduction
          <textarea
            name="description"
            defaultValue={category?.description}
            required
            minLength={30}
          />
        </label>
        <label className="field">
          SEO title
          <input name="seo_title" defaultValue={category?.seo_title} />
        </label>
        <label className="checkbox-field">
          <input
            name="is_indexable"
            type="checkbox"
            defaultChecked={category?.is_indexable}
          />
          Indexable
        </label>
      </div>
      {state.error && (
        <p role="alert" className="error-text">
          {state.error}
        </p>
      )}
      {state.success && <p role="status">{state.success}</p>}
      <button className="button" disabled={pending}>
        Save category
      </button>
    </form>
  );
}
