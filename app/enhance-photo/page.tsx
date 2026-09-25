import { ToolGuide } from "@/components/prompts/tool-guide";
import { Wizard } from "@/features/generator/wizard";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "Enhance Your Photo with AI Editing Prompts | PicMagic",
  "Create photo enhancement prompts for lighting, backgrounds, professional portraits and more. Keep your appearance natural.",
  "/enhance-photo",
);
export default function Enhance() {
  return (
    <div className="container">
      <header className="page-heading section">
        <div className="eyebrow">
          A fresh perspective on your favourite photo
        </div>
        <h1>A little polish. Still you.</h1>
        <p>
          Write editing instructions for your image tool while keeping your
          appearance natural.
        </p>
      </header>
      <Wizard mode="edit" />
      <ToolGuide edit />
    </div>
  );
}
