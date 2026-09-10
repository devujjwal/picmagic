import { getCatalog } from "@/lib/content";
import { Wizard } from "@/features/generator/wizard";
import { PromptGrid } from "@/components/prompts/prompt-grid";
import { AdSlot } from "@/components/ads/ad-slot";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "AI Reel Ideas and Video Prompts | PicMagic",
  "Discover reel concepts and create scene-by-scene video prompts, captions and music mood suggestions.",
  "/reel-prompts",
);
export default async function Reels() {
  const { prompts } = await getCatalog();
  return (
    <div className="container">
      <header className="page-heading section">
        <div className="eyebrow">A story in motion</div>
        <h1>Make the moment move.</h1>
        <p>
          Explore a reel idea, or create your own scene-by-scene story below.
        </p>
        <a href="#reel-creator" className="button mt-5">
          Create a reel prompt
        </a>
      </header>
      <PromptGrid
        prompts={prompts.filter(
          (p) => p.prompt_type === "reel" || p.prompt_type === "video",
        )}
      />
      <AdSlot placement="reel-page-inline" />
      <section id="reel-creator" className="section">
        <div className="page-heading">
          <h2 className="font-serif text-4xl">Your story starts here.</h2>
          <p className="mt-3">A few choices. A complete reel concept.</p>
        </div>
        <Wizard mode="reel" />
      </section>
    </div>
  );
}
