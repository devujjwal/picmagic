import { ToolGuide } from "@/components/prompts/tool-guide";
import { Wizard } from "@/features/generator/wizard";
import Link from "next/link";
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
        <p>
          Choose a look and get a prompt to use with your photo in an external
          image tool.
        </p>
      </header>
      <Wizard />
      <section className="section notice">
        <h2>A greeting ready to share</h2>
        <p>
          Add English or Hindi wishes, your logo and an optional photo to a
          festival poster. Download a free PNG—everything stays in your browser.
        </p>
        <Link className="button secondary" href="/festival-poster-maker">
          Make a festival poster
        </Link>
      </section>
      <noscript>
        <p className="section">
          The prompt creator needs JavaScript. You can still{" "}
          <Link href="/ai-prompts">browse ready-to-use photo prompts</Link> and
          select the text from their pages.
        </p>
      </noscript>
      <ToolGuide />
    </div>
  );
}
