import { CollectionDiscovery } from "./collection-discovery";
import { orderForDiscovery } from "@/lib/prompts/editorial";
import Link from "@/components/ui/site-link";
import { CategoryView } from "@/components/ui/view-event";
import { notFound } from "next/navigation";
import type { Prompt, Category, Collection } from "@/types/content";
import { promptPath } from "@/types/content";
import { PaginatedGrid } from "./paginated-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StructuredData } from "@/components/ui/structured-data";
import { AdSlot } from "@/components/ads/ad-slot";
import { site } from "@/config/site";
import { toPromptCard } from "@/lib/prompts/card-data";
import {
  isCategorySeoEligible,
  isCollectionSeoEligible,
  isPromptSeoEligible,
} from "@/lib/seo/eligibility";
import { hubGuides } from "@/content/seo-guides";
import { EditorialGuide } from "./editorial-guide";
export function CatalogPage({
  title,
  description,
  path,
  prompts,
  categories,
  collections,
  page = 1,
  availablePrompts = prompts,
  medium,
}: {
  title: string;
  description: string;
  path: string;
  prompts: Prompt[];
  categories: Category[];
  collections: Collection[];
  page?: number;
  availablePrompts?: Prompt[];
  medium?: "photo" | "reel";
}) {
  prompts = orderForDiscovery(prompts);
  const reelsOnly =
    prompts.length > 0 &&
    prompts.every((p) => p.prompt_type === "reel" || p.prompt_type === "video");
  const pages = Math.max(1, Math.ceil(prompts.length / 24));
  if (page > pages) notFound();
  const shown = prompts.slice((page - 1) * 24, page * 24);
  const cards = prompts.map(toPromptCard);
  const collection = collections.find((c) => path === `/collections/${c.slug}`);
  const category = categories.find((c) => path === `/ai-prompts/${c.slug}`);
  const showAds =
    shown.some(isPromptSeoEligible) &&
    (path === "/ai-prompts" ||
      (collection
        ? isCollectionSeoEligible(collection, availablePrompts)
        : category
          ? isCategorySeoEligible(category, availablePrompts)
          : false));
  const parentPath = path.startsWith("/collections/")
    ? "/collections"
    : reelsOnly
      ? "/reel-prompts"
      : "/ai-prompts";
  return (
    <div className="container" data-ad-surface={showAds ? path : undefined}>
      <CategoryView category={path} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          {
            name:
              parentPath === "/collections"
                ? "Collections"
                : reelsOnly
                  ? "Reels"
                  : "Photo ideas",
            path: parentPath,
          },
          ...(path !== parentPath ? [{ name: title, path }] : []),
        ]}
      />
      <header className="page-heading">
        <div className="eyebrow">Choose a look. Make it yours.</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <nav
        className="filter-bar"
        aria-label={reelsOnly ? "Explore reels" : "Explore categories"}
      >
        <Link
          className={`chip ${path === "/ai-prompts" ? "active" : ""}`}
          href={reelsOnly ? "/reel-prompts" : "/ai-prompts"}
        >
          {reelsOnly ? "All reel ideas" : "All looks"}
        </Link>
        {(reelsOnly ? [] : categories)
          .filter(
            (c) =>
              c.slug !== "reels" &&
              (isCategorySeoEligible(c, availablePrompts) ||
                path === `/ai-prompts/${c.slug}`),
          )
          .map((c) => (
            <Link
              className={`chip ${path === `/ai-prompts/${c.slug}` ? "active" : ""}`}
              key={c.id}
              href={`/ai-prompts/${c.slug}`}
            >
              {c.name}
            </Link>
          ))}
      </nav>
      <p className="result-count">
        {prompts.length} looks to make your own
        {page > 1 ? ` · Page ${page}` : ""}
      </p>
      {shown.length ? (
        <>
          <h2 className="sr-only">Explore these looks</h2>
          <PaginatedGrid
            key={`${path}-${page}`}
            prompts={cards}
            page={page}
            path={path}
          />
        </>
      ) : (
        <div className="empty-state">
          <h2>More inspiration is on its way.</h2>
          <p>Explore another category or create a look of your own.</p>
          <Link href="/create" className="button">
            Create a prompt
          </Link>
        </div>
      )}
      {page === 1 && <EditorialGuide guide={hubGuides[path]} />}
      {showAds && <AdSlot placement="category-inline-1" />}
      <CollectionDiscovery
        collections={collections}
        prompts={availablePrompts}
        contextPrompts={prompts}
        medium={medium || (reelsOnly ? "reel" : "photo")}
        path={path}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: site.url + path + (page > 1 ? `?page=${page}` : ""),
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
