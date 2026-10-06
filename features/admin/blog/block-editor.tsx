"use client";
import { DestinationEditor, type BlockEditorProps } from "./editor-fields";
import { BasicBlockEditor } from "./basic-block-editor";
import { PromptBlockEditor } from "./prompt-block-editor";
import { ListBlockEditor } from "./list-block-editor";
import { TableBlockEditor } from "./table-block-editor";
export { newBlock, TextField, DestinationEditor } from "./editor-fields";
export function BlockEditor(props: BlockEditorProps) {
  const b = props.block;
  if (b.type === "cta")
    return (
      <DestinationEditor
        value={b.destination}
        onChange={(destination) => props.onChange({ ...b, destination })}
        catalog={props.catalog}
      />
    );
  if (b.type === "prompt_card" || b.type === "prompt_grid")
    return <PromptBlockEditor {...props} />;
  if (b.type === "steps" || b.type === "faq")
    return <ListBlockEditor {...props} />;
  if (b.type === "table") return <TableBlockEditor {...props} />;
  return <BasicBlockEditor {...props} />;
}
