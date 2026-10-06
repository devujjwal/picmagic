import Link from "next/link";
import { blogEditorData } from "@/features/admin/blog/data";
const overdue = (deadline: string | null) =>
  Date.parse(deadline || "") <= Date.now();
export default async function BlogAdmin() {
  const { articles } = await blogEditorData();
  return (
    <>
      <div className="admin-title">
        <h1>Blog & PicMagic Lab</h1>
        <Link className="button" href="/admin/blog/new">
          New article
        </Link>
      </div>
      <p>
        Draft and review articles are private. Normal publication includes
        indexability and internal discovery.
      </p>
      <div className="admin-list">
        {articles.map((a) => (
          <div className="admin-list-item" key={a.id}>
            <div>
              <Link href={`/admin/blog/${a.id}`}>{a.title}</Link>
              <p>
                {a.status} · {a.primary_topic}
              </p>
              {a.status === "published" && !a.is_indexable && (
                <p role="alert" className="notice">
                  {overdue(a.noindex_review_at)
                    ? "OVERDUE — publicly inaccessible. Restore indexability or return to review."
                    : "Temporary noindex exception"}{" "}
                  · Review: {a.noindex_review_at} · {a.noindex_reason}
                </p>
              )}
            </div>
            <Link href={`/admin/blog/${a.id}/preview`}>Preview</Link>
          </div>
        ))}
      </div>
    </>
  );
}
