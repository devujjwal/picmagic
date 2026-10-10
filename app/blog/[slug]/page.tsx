import { notFound, permanentRedirect } from "next/navigation";
import {
  getPublicArticles,
  getBlogAuthors,
  resolveBlogRedirect,
} from "@/lib/blog/repository";
import { isArticlePublic, isArticleDiscoverable } from "@/lib/blog/schema";
import { articleMetadata } from "@/lib/blog/seo";
import { ArticleView } from "@/components/blog/article";
import { getCatalog } from "@/lib/content";
import { getRecommendedTools } from "@/lib/affiliate/registry";
import { articleToolIntents } from "@/lib/affiliate/recommendations";
type Props = { params: Promise<{ slug: string }> };
async function find(slug: string) {
  return (await getPublicArticles()).find(
    (a) => a.slug === slug && isArticlePublic(a),
  );
}
export async function generateMetadata({ params }: Props) {
  const a = await find((await params).slug);
  return a
    ? articleMetadata(
        a,
        (await getBlogAuthors()).find((author) => author.id === a.author_id),
      )
    : { robots: { index: false, follow: false } };
}
export default async function BlogArticle({ params }: Props) {
  const { slug } = await params;
  const a = await find(slug);
  if (!a) {
    const target = await resolveBlogRedirect(slug);
    if (target) permanentRedirect(target);
    notFound();
  }
  const author = (await getBlogAuthors()).find(
    (author) => author.id === a.author_id,
  );
  if (!author) notFound();
  const related = (await getPublicArticles()).filter(
    (r) => isArticleDiscoverable(r) && a.related_articles.includes(r.slug),
  );
  return (
    <ArticleView
      article={a}
      author={author}
      catalog={await getCatalog()}
      related={related}
      tools={
        articleToolIntents[a.slug]
          ? await getRecommendedTools(articleToolIntents[a.slug])
          : []
      }
    />
  );
}
