import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/blog/article";
import {
  getLocalDraft,
  localBlogPreviewEnabled,
  getBlogAuthors,
} from "@/lib/blog/repository";
import { getCatalog } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private PicMagic editorial preview",
  robots: { index: false, follow: false },
};
export default async function LocalPreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!localBlogPreviewEnabled((await headers()).get("host") || "")) notFound();
  const a = getLocalDraft((await params).slug);
  if (!a) notFound();
  const author = (await getBlogAuthors()).find(
    (author) => author.id === a.author_id,
  );
  if (!author) notFound();
  return (
    <ArticleView
      article={a}
      author={author}
      catalog={await getCatalog()}
      preview
    />
  );
}
