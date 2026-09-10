import { getCatalog } from "@/lib/content";
import { Search } from "@/features/search/search";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "Find Your Next Photo Idea | PicMagic",
  "Search photo ideas by subject, style, occasion or mood.",
  "/search",
  false,
);
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { prompts } = await getCatalog();
  const { q } = await searchParams;
  return (
    <div className="container">
      <header className="page-heading section">
        <div className="eyebrow">Follow your curiosity</div>
        <h1>What’s your kind of magic?</h1>
        <p>Find a look for the person, mood or moment you have in mind.</p>
      </header>
      <Search
        prompts={prompts}
        initialQuery={typeof q === "string" ? q.slice(0, 120) : ""}
      />
    </div>
  );
}
