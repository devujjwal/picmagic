import { notFound, permanentRedirect } from "next/navigation";
import { getCatalog, repository } from "@/lib/content";
import { CatalogPage } from "@/components/prompts/catalog-page";
import { metadata } from "@/lib/seo/metadata";
import { pageNumber } from "@/lib/prompts/discovery";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};
export async function generateStaticParams() {
  return (await getCatalog()).collections
    .filter((c) => c.active)
    .map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const c = catalog.collections.find((c) => c.slug === slug && c.active);
  if (!c) return {};
  const n = pageNumber((await searchParams).page);
  const count = catalog.prompts.filter((p) =>
    c.prompt_ids.includes(p.id),
  ).length;
  return metadata(
    `${c.name}${n > 1 ? ` — Page ${n}` : ""} | PicMagic`,
    c.description,
    `/collections/${slug}${n > 1 ? `?page=${n}` : ""}`,
    c.is_indexable && count >= 4 && c.description.length >= 100,
  );
}
export default async function Collection({ params, searchParams }: Props) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const c = catalog.collections.find((c) => c.slug === slug && c.active);
  if (!c) {
    const target = await repository().resolveRedirect(`/collections/${slug}`);
    if (target) permanentRedirect(target);
    notFound();
  }
  return (
    <CatalogPage
      {...catalog}
      prompts={catalog.prompts.filter((p) => c.prompt_ids.includes(p.id))}
      title={c.name}
      description={c.description}
      path={`/collections/${slug}`}
      page={pageNumber((await searchParams).page)}
    />
  );
}
