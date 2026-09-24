import { FriendsTripCreator } from "@/features/generator/friends-trip-creator";
import { CollectionDiscovery } from "@/components/prompts/collection-discovery";
import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/content";
import { Wizard } from "@/features/generator/wizard";
import { PaginatedGrid } from "@/components/prompts/paginated-grid";
import { AdSlot } from "@/components/ads/ad-slot";
import { StructuredData } from "@/components/ui/structured-data";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { pageNumber } from "@/lib/prompts/discovery";
import { promptPath } from "@/types/content";
import { site } from "@/config/site";
import { toPromptCard } from "@/lib/prompts/card-data";
type Props = { searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ searchParams }: Props) {
  const page = pageNumber((await searchParams).page);
  return makeMetadata(
    `AI Reel Ideas and Video Prompts${page > 1 ? ` — Page ${page}` : ""} | PicMagic`,
    "Discover reel concepts and create scene-by-scene video prompts, captions and music mood suggestions.",
    `/reel-prompts${page > 1 ? `?page=${page}` : ""}`,
  );
}
export default async function Reels({ searchParams }: Props) {
  const { prompts, collections } = await getCatalog();
  const reels = prompts.filter(
    (p) => p.prompt_type === "reel" || p.prompt_type === "video",
  );
  const page = pageNumber((await searchParams).page),
    pages = Math.max(1, Math.ceil(reels.length / 24));
  if (page > pages) notFound();
  const shown = reels.slice((page - 1) * 24, page * 24);
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
      <p className="result-count">
        {reels.length} reel concepts{page > 1 ? ` · Page ${page}` : ""}
      </p>
      <PaginatedGrid
        key={`reels-${page}`}
        prompts={reels.map(toPromptCard)}
        page={page}
        path="/reel-prompts"
      />
      <AdSlot placement="reel-page-inline" />
      <CollectionDiscovery
        collections={collections}
        prompts={prompts}
        medium="reel"
        path="/reel-prompts"
      />
      <section id="reel-creator" className="section">
        <div className="page-heading">
          <h2 className="font-serif text-4xl">Your story starts here.</h2>
          <p className="mt-3">A few choices. A complete reel concept.</p>
        </div>
        <Wizard mode="reel" />
      </section>
      <FriendsTripCreator />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "AI Reel Ideas and Video Prompts",
          url: site.url + `/reel-prompts${page > 1 ? `?page=${page}` : ""}`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: shown.map((p, i) => ({
              "@type": "ListItem",
              position: (page - 1) * 24 + i + 1,
              name: p.title,
              url: site.url + promptPath(p),
            })),
          },
        }}
      />
    </div>
  );
}
