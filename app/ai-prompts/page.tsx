import { getCatalog } from "@/lib/content";
import { CatalogPage } from "@/components/prompts/catalog-page";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { pageNumber } from "@/lib/prompts/discovery";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const n = pageNumber((await searchParams).page);
  return makeMetadata(
    `AI Photo Ideas${n > 1 ? ` — Page ${n}` : ""} | PicMagic`,
    "Discover beautiful photo ideas for every person, occasion and mood. Choose a look and copy the prompt.",
    "/ai-prompts" + (n > 1 ? `?page=${n}` : ""),
  );
}
export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const c = await getCatalog();
  return (
    <CatalogPage
      {...c}
      prompts={c.prompts.filter(
        (p) => p.prompt_type !== "reel" && p.prompt_type !== "video",
      )}
      title="Find a look you love."
      description="A mood, a moment, a new version of your favourite photo. Your next idea starts here."
      path="/ai-prompts"
      page={pageNumber((await searchParams).page)}
    />
  );
}
