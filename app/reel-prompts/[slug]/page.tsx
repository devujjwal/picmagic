import { notFound, permanentRedirect } from "next/navigation";
import { getCatalog, repository } from "@/lib/content";
import { promptMetadata } from "@/lib/seo/metadata";
import { PromptDetail } from "@/components/prompts/prompt-detail";
import { getRecommendedTools } from "@/lib/affiliate/registry";
import { promptToolIntent } from "@/lib/affiliate/recommendations";
type Props = { params: Promise<{ slug: string }> };
async function resolve({ params }: Props) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const prompt = catalog.prompts.find(
    (p) =>
      p.slug === slug &&
      (p.prompt_type === "reel" || p.prompt_type === "video"),
  );
  if (!prompt) {
    const target = await repository().resolveRedirect(`/reel-prompts/${slug}`);
    if (target) permanentRedirect(target);
    notFound();
  }
  return { prompt, catalog };
}
export async function generateStaticParams() {
  return (await getCatalog()).prompts
    .filter((p) => p.prompt_type === "reel" || p.prompt_type === "video")
    .map((p) => ({ slug: p.slug }));
}
export async function generateMetadata(props: Props) {
  return promptMetadata((await resolve(props)).prompt);
}
export default async function Detail(props: Props) {
  const resolved = await resolve(props);
  return (
    <PromptDetail
      {...resolved}
      tools={
        resolved.prompt.is_published
          ? await getRecommendedTools(promptToolIntent(resolved.prompt))
          : []
      }
    />
  );
}
