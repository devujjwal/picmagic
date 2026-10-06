import { notFound } from "next/navigation";
import { blogEditorData } from "@/features/admin/blog/data";
import { ArticleForm } from "@/features/admin/blog/article-form";
export default async function EditArticle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await blogEditorData();
  const id = (await params).id;
  const article = data.articles.find((a) => a.id === id);
  if (!article) notFound();
  return (
    <>
      <h1>Edit article</h1>
      <ArticleForm
        initial={article}
        {...data}
        saved={(await searchParams).saved === "1"}
      />
    </>
  );
}
