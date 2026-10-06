"use client";
import { TextField, type BlockEditorProps } from "./editor-fields";
export function BasicBlockEditor({
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
  switch (b.type) {
    case "paragraph":
      return (
        <>
          {b.content.map((s, i) => (
            <fieldset key={i}>
              <legend>Text segment {i + 1}</legend>
              {field("Text", s.text, (text) =>
                onChange({
                  ...b,
                  content: b.content.map((v, n) =>
                    n === i ? { ...v, text } : v,
                  ),
                }),
              )}
              <TextField
                label="Link (optional, HTTPS or local path)"
                value={s.href || ""}
                onChange={(href) =>
                  onChange({
                    ...b,
                    content: b.content.map((v, n) =>
                      n === i ? { text: v.text, ...(href ? { href } : {}) } : v,
                    ),
                  })
                }
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...b,
                    content: b.content.filter((_, n) => n !== i),
                  })
                }
              >
                Remove segment
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...b,
                content: [...b.content, { text: "Linked text" }],
              })
            }
          >
            Add text / link segment
          </button>
        </>
      );
    case "heading":
      return (
        <>
          <label>
            Heading level
            <select
              value={b.level}
              onChange={(e) =>
                onChange({ ...b, level: Number(e.target.value) as 2 | 3 })
              }
            >
              <option value="2">H2</option>
              <option value="3">H3</option>
            </select>
          </label>
          <TextField
            label="Anchor ID"
            value={b.id}
            onChange={(id) => onChange({ ...b, id })}
          />
          {field("Heading", b.text, (text) => onChange({ ...b, text }))}
        </>
      );
    case "quick_answer":
      return field("Quick answer", b.text, (text) => onChange({ ...b, text }));
    case "callout":
      return (
        <>
          {field("Title", b.title, (title) => onChange({ ...b, title }))}
          {field("Text", b.text, (text) => onChange({ ...b, text }))}
        </>
      );
    case "image":
      return (
        <>
          <label>
            Approved public asset
            <select
              value={b.image.url}
              onChange={(e) => {
                const p = catalog.prompts.find(
                  (p) => p.preview_image_url === e.target.value,
                );
                if (p)
                  onChange({
                    ...b,
                    image: {
                      url: p.preview_image_url,
                      alt: p.image_alt,
                      width: p.image_width,
                      height: p.image_height,
                      caption: b.image.caption,
                    },
                  });
              }}
            >
              <option value="">Select an existing asset</option>
              {catalog.prompts.map((p) => (
                <option key={p.id} value={p.preview_image_url}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          {field("Alt text", b.image.alt, (alt) =>
            onChange({ ...b, image: { ...b.image, alt } }),
          )}
          {field("Caption", b.image.caption, (caption) =>
            onChange({ ...b, image: { ...b.image, caption } }),
          )}
        </>
      );
  }
  return null;
}
