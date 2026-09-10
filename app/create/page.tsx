import { Wizard } from "@/features/generator/wizard";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "Create Your Own AI Photo Prompt | PicMagic",
  "Choose a subject, style, outfit and lighting. Create a useful photo prompt in a few simple steps.",
  "/create",
);
export default function Create() {
  return (
    <div className="container">
      <header className="page-heading section">
        <div className="eyebrow">Your imagination, a little guidance</div>
        <h1>Make something only you could imagine.</h1>
        <p>Choose the look. We’ll find the words.</p>
      </header>
      <Wizard />
    </div>
  );
}
