"use client";
import { useActionState, useState } from "react";
import { saveCollection } from "./actions";
import type { Collection } from "@/types/content";
import { slugify } from "@/lib/prompts/discovery";
export function CollectionForm({
  initial,
  prompts,
  seasonal = false,
}: {
  initial?: Collection;
  prompts: { id: string; title: string; is_published: boolean }[];
  seasonal?: boolean;
}) {
  const [c, setC] = useState<Collection>(
    initial || {
      id: "",
      slug: "",
      name: "",
      description: "",
      kind: seasonal ? "seasonal" : "style",
      prompt_ids: [],
      is_indexable: false,
      active: false,
      start_date: null,
      end_date: null,
      priority: 0,
      featured_image: "",
    },
  );
  const [state, action, pending] = useActionState(saveCollection, {});
  return (
    <form action={action} className="wizard-panel">
      <input type="hidden" name="payload" value={JSON.stringify(c)} />
      <div className="form-grid">
        <label className="field">
          Name
          <input
            required
            value={c.name}
            onChange={(e) =>
              setC({
                ...c,
                name: e.target.value,
                ...(!initial
                  ? {
                      id: slugify(e.target.value),
                      slug: slugify(e.target.value),
                    }
                  : {}),
              })
            }
          />
        </label>
        <label className="field">
          URL slug
          <input
            required
            value={c.slug}
            onChange={(e) => setC({ ...c, slug: e.target.value })}
          />
        </label>
        <label className="field wide">
          Collection introduction
          <textarea
            required
            minLength={60}
            value={c.description}
            onChange={(e) => setC({ ...c, description: e.target.value })}
          />
        </label>
        <label className="field">
          Collection type
          <select
            value={c.kind}
            onChange={(e) =>
              setC({ ...c, kind: e.target.value as Collection["kind"] })
            }
          >
            {["style", "subcategory", "occasion", "seasonal"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Priority
          <input
            type="number"
            value={c.priority}
            onChange={(e) => setC({ ...c, priority: Number(e.target.value) })}
          />
        </label>
        <label className="field wide">
          Featured image URL
          <input
            value={c.featured_image}
            onChange={(e) => setC({ ...c, featured_image: e.target.value })}
          />
        </label>
        {c.kind === "seasonal" && (
          <>
            <label className="field">
              Start date (India time)
              <input
                type="date"
                value={c.start_date || ""}
                onChange={(e) =>
                  setC({ ...c, start_date: e.target.value || null })
                }
              />
            </label>
            <label className="field">
              End date (India time)
              <input
                type="date"
                value={c.end_date || ""}
                onChange={(e) =>
                  setC({ ...c, end_date: e.target.value || null })
                }
              />
            </label>
            <p className="notice wide">
              Verify movable festival dates before activation. Seasonal homepage
              placement requires both dates; the collection remains browsable
              outside its window.
            </p>
          </>
        )}
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={c.active}
            onChange={(e) => setC({ ...c, active: e.target.checked })}
          />
          Active
        </label>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={c.is_indexable}
            onChange={(e) => setC({ ...c, is_indexable: e.target.checked })}
          />
          Indexable (requires four published prompts)
        </label>
      </div>
      <fieldset className="border border-stone-200 rounded-lg p-4 my-5">
        <legend>Curated prompts</legend>
        <div className="max-h-80 overflow-auto">
          {prompts.map((p) => (
            <label className="checkbox-field" key={p.id}>
              <input
                type="checkbox"
                checked={c.prompt_ids.includes(p.id)}
                onChange={(e) =>
                  setC({
                    ...c,
                    prompt_ids: e.target.checked
                      ? [...c.prompt_ids, p.id]
                      : c.prompt_ids.filter((id) => id !== p.id),
                  })
                }
              />
              {p.title}
              {!p.is_published ? " (draft)" : ""}
            </label>
          ))}
        </div>
      </fieldset>
      {state.error && (
        <p className="error-text" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="notice">
          {state.success}
        </p>
      )}
      <button className="button" disabled={pending}>
        {pending ? "Saving…" : "Save collection"}
      </button>
    </form>
  );
}
