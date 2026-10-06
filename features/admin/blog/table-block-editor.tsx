"use client";
import { TextField, type BlockEditorProps } from "./editor-fields";
export function TableBlockEditor({ block: b, onChange }: BlockEditorProps) {
  switch (b.type) {
    case "table":
      return (
        <>
          <TextField
            label="Table caption"
            value={b.caption}
            onChange={(caption) => onChange({ ...b, caption })}
          />
          {b.columns.map((c, i) => (
            <TextField
              key={i}
              label={`Column ${i + 1}`}
              value={c}
              onChange={(value) =>
                onChange({
                  ...b,
                  columns: b.columns.map((v, n) => (n === i ? value : v)),
                })
              }
            />
          ))}
          <button
            type="button"
            disabled={b.columns.length >= 6}
            onClick={() =>
              onChange({
                ...b,
                columns: [...b.columns, "Column"],
                rows: b.rows.map((r) => [...r, "Value"]),
              })
            }
          >
            Add column
          </button>
          <button
            type="button"
            disabled={b.columns.length <= 2}
            onClick={() =>
              onChange({
                ...b,
                columns: b.columns.slice(0, -1),
                rows: b.rows.map((r) => r.slice(0, -1)),
              })
            }
          >
            Remove last column
          </button>
          {b.rows.map((r, i) => (
            <fieldset key={i}>
              <legend>Row {i + 1}</legend>
              {r.map((cell, j) => (
                <TextField
                  key={j}
                  label={b.columns[j]}
                  value={cell}
                  onChange={(value) =>
                    onChange({
                      ...b,
                      rows: b.rows.map((v, n) =>
                        n === i ? v.map((c, k) => (k === j ? value : c)) : v,
                      ),
                    })
                  }
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  onChange({ ...b, rows: b.rows.filter((_, n) => n !== i) })
                }
              >
                Remove row
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...b,
                rows: [...b.rows, b.columns.map(() => "Value")],
              })
            }
          >
            Add row
          </button>
        </>
      );
  }
  return null;
}
