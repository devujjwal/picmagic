"use client";
import { TextField, type BlockEditorProps } from "./editor-fields";
export function ListBlockEditor({ block: b, onChange }: BlockEditorProps) {
  const field = (label: string, value: string, update: (s: string) => void) => (
    <TextField
      key={label}
      label={label}
      value={value}
      onChange={update}
      multiline
    />
  );
  switch (b.type) {
    case "steps":
      return (
        <>
          {b.items.map((item, i) => (
            <fieldset key={i}>
              <legend>Step {i + 1}</legend>
              {field("Title", item.title, (title) =>
                onChange({
                  ...b,
                  items: b.items.map((v, n) => (n === i ? { ...v, title } : v)),
                }),
              )}
              {field("Instruction", item.text, (text) =>
                onChange({
                  ...b,
                  items: b.items.map((v, n) => (n === i ? { ...v, text } : v)),
                }),
              )}
              <button
                type="button"
                onClick={() =>
                  onChange({ ...b, items: b.items.filter((_, n) => n !== i) })
                }
              >
                Remove step
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
                  { title: "Next step", text: "Instruction" },
                ],
              })
            }
          >
            Add step
          </button>
        </>
      );
    case "faq":
      return (
        <>
          {b.items.map((item, i) => (
            <fieldset key={i}>
              <legend>FAQ {i + 1}</legend>
              {field("Question", item.question, (question) =>
                onChange({
                  ...b,
                  items: b.items.map((v, n) =>
                    n === i ? { ...v, question } : v,
                  ),
                }),
              )}
              {field("Answer", item.answer, (answer) =>
                onChange({
                  ...b,
                  items: b.items.map((v, n) =>
                    n === i ? { ...v, answer } : v,
                  ),
                }),
              )}
              <button
                type="button"
                onClick={() =>
                  onChange({ ...b, items: b.items.filter((_, n) => n !== i) })
                }
              >
                Remove FAQ
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
                  { question: "Question?", answer: "Answer." },
                ],
              })
            }
          >
            Add FAQ
          </button>
        </>
      );
  }
  return null;
}
