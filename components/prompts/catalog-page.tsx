import Link from "next/link";
import { CategoryView } from "@/components/ui/view-event";
import { notFound } from "next/navigation";
import type { Prompt, Category, Collection } from "@/types/content";
import { promptPath } from "@/types/content";
import { PaginatedGrid } from "./paginated-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StructuredData } from "@/components/ui/structured-data";
import { AdSlot } from "@/components/ads/ad-slot";
import { site } from "@/config/site";
export function CatalogPage({
  title,
  description,
  path,
  prompts,
  categories,
  collections,
  page = 1,
}: {
  title: string;
  description: string;
  path: string;
  prompts: Prompt[];
  categories: Category[];
  collections: Collection[];
  page?: number;
}) {
  const pages = Math.max(1, Math.ceil(prompts.length / 24));
  if (page > pages) notFound();
  const shown = prompts.slice((page - 1) * 24, page * 24);
  return (
    <div className="container">
      <CategoryView category={path} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Photo ideas", path: "/ai-prompts" },
          ...(path !== "/ai-prompts" ? [{ name: title, path }] : []),
        ]}
      />
      <header className="page-heading">
        <div className="eyebrow">Choose a look. Make it yours.</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      <nav className="filter-bar" aria-label="Explore categories">
        <Link
          className={`chip ${path === "/ai-prompts" ? "active" : ""}`}
          href="/ai-prompts"
        >
          All looks
        </Link>
        {categories
          .filter((c) => c.slug !== "reels")
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
            prompts={prompts}
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
      <AdSlot placement="category-inline-1" />
      {pages > 1 && (
        <nav aria-label="Pagination" className="pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) =>
            n === page ? (
              <span key={n} aria-current="page">
                {n}
              </span>
            ) : (
              <Link
                key={n}
                href={n === 1 ? path : `${path}?page=${n}`}
                aria-label={`Page ${n}`}
              >
                {n}
              </Link>
            ),
          )}
        </nav>
      )}
      <section className="section">
        <div className="section-head">
          <h2>A few more directions to explore</h2>
        </div>
        <div className="collection-links">
          {collections
            .filter((c) => c.active)
            .map((c) => (
              <Link key={c.id} className="chip" href={`/collections/${c.slug}`}>
                {c.name}
              </Link>
            ))}
        </div>
      </section>
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
