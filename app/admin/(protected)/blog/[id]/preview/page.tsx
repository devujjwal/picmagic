import { notFound } from "next/navigation";
import { blogEditorData } from "@/features/admin/blog/data";
import { ArticleView } from "@/components/blog/article";
export const dynamic = "force-dynamic";
export default async function PreviewArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const data = await blogEditorData();
  const id = (await params).id;
  const article = data.articles.find((a) => a.id === id);
  const author = data.authors.find(
    (author) => author.id === article?.author_id,
  );
  if (!article || !author) notFound();
  return (
    <ArticleView
      article={article}
      author={author}
      catalog={data.catalog}
      preview
    />
  );
}
