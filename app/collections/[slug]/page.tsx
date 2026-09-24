import { notFound, permanentRedirect } from "next/navigation";
import { getCatalog, repository } from "@/lib/content";
import { CatalogPage } from "@/components/prompts/catalog-page";
import { brandedTitle, metadata } from "@/lib/seo/metadata";
import { pageNumber } from "@/lib/prompts/discovery";
import { isCollectionSeoEligible } from "@/lib/seo/eligibility";
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
  const baseTitle = (c.seo_title || c.name).replace(
    /\s*\|\s*PicMagic\s*$/i,
    "",
  );
  return metadata(
    brandedTitle(`${baseTitle}${n > 1 ? ` — Page ${n}` : ""}`),
    c.seo_description || c.description,
    `/collections/${slug}${n > 1 ? `?page=${n}` : ""}`,
    isCollectionSeoEligible(c, catalog.prompts),
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
      availablePrompts={catalog.prompts}
      {...catalog}
      prompts={catalog.prompts.filter((p) => c.prompt_ids.includes(p.id))}
      title={c.name}
      description={c.description}
      path={`/collections/${slug}`}
      page={pageNumber((await searchParams).page)}
    />
  );
}
