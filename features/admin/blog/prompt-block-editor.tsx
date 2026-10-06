"use client";
import { TextField, type BlockEditorProps } from "./editor-fields";
export function PromptBlockEditor({
  block: b,
  onChange,
  catalog,
}: BlockEditorProps) {
  const field = (label: string, value: string, update: (s: string) => void) => (
    <TextField
      key={label}
      label={label}
      value={value}
      onChange={update}
      multiline
    />
  );
  const promptFields = (
    item: {
      prompt_id: string;
      why: string;
      best_use: string;
      guidance: string;
    },
    update: (value: {
      prompt_id: string;
      why: string;
      best_use: string;
      guidance: string;
    }) => void,
  ) => (
    <>
      <label>
        Example prompt
        <select
          value={item.prompt_id}
          onChange={(e) => update({ ...item, prompt_id: e.target.value })}
        >
          <option value="">Select a public approved prompt</option>
          {catalog.prompts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      {field("What makes it interesting", item.why, (why) =>
        update({ ...item, why }),
      )}
      {field("Best use", item.best_use, (best_use) =>
        update({ ...item, best_use }),
      )}
      {field("Guidance", item.guidance, (guidance) =>
        update({ ...item, guidance }),
      )}
    </>
  );
  switch (b.type) {
    case "prompt_card":
      return promptFields(b, (item) =>
        onChange({ ...item, type: "prompt_card" }),
      );
    case "prompt_grid":
      return (
        <>
          {b.items.map((item, i) => (
            <fieldset key={i}>
              <legend>Example {i + 1}</legend>
              {promptFields(item, (value) =>
                onChange({
                  ...b,
                  items: b.items.map((v, n) => (i === n ? value : v)),
                }),
              )}
              <button
                type="button"
                onClick={() =>
                  onChange({ ...b, items: b.items.filter((_, n) => n !== i) })
                }
              >
                Remove example
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...b,
                items: [
                  ...b.items,
                  { prompt_id: "", why: "", best_use: "", guidance: "" },
                ],
              })
            }
          >
            Add example
          </button>
        </>
      );
  }
  return null;
}
