import { toPromptCard } from "@/lib/prompts/card-data";
import { getCatalog } from "@/lib/content";
import { LocalDiscovery } from "@/components/prompts/local-discovery";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "Your Saved Looks | PicMagic",
  "Your favourite ideas, all in one place.",
  "/saved",
  false,
);
export default async function Saved() {
  const { prompts } = await getCatalog();
  return (
    <div className="container">
      <header className="page-heading section">
        <div className="eyebrow">Your own little inspiration board</div>
        <h1>Looks you love.</h1>
        <p>Saved in this browser. Ready whenever inspiration strikes.</p>
      </header>
      <LocalDiscovery prompts={prompts.map(toPromptCard)} mode="saved" />
    </div>
  );
}
