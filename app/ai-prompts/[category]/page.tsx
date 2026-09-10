import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/content";
import { CatalogPage } from "@/components/prompts/catalog-page";
import { metadata } from "@/lib/seo/metadata";
import { pageNumber } from "@/lib/prompts/discovery";
type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};
export async function generateStaticParams() {
  return (await getCatalog()).categories
    .filter((c) => c.slug !== "reels")
    .map((c) => ({ category: c.slug }));
}
export async function generateMetadata({ params, searchParams }: Props) {
  const { category } = await params;
  const c = (await getCatalog()).categories.find((c) => c.slug === category);
  if (!c) return {};
  const n = pageNumber((await searchParams).page);
  return metadata(
    `${c.seo_title}${n > 1 ? ` — Page ${n}` : ""}`,
    c.description,
    `/ai-prompts/${c.slug}${n > 1 ? `?page=${n}` : ""}`,
    c.is_indexable,
  );
}
export default async function Category({ params, searchParams }: Props) {
  const { category } = await params;
  const catalog = await getCatalog();
  const c = catalog.categories.find(
    (c) => c.slug === category && c.slug !== "reels",
  );
  if (!c) notFound();
  return (
    <CatalogPage
      {...catalog}
      prompts={catalog.prompts.filter((p) => p.category_id === c.id)}
      title={`${c.name} photo ideas`}
      description={c.description}
      path={`/ai-prompts/${c.slug}`}
      page={pageNumber((await searchParams).page)}
    />
  );
}
