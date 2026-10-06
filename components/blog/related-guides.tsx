import Link from "@/components/ui/site-link";
export type GuideLink = { id: string; slug: string; title: string };
export function RelatedGuides({ guides = [] }: { guides?: GuideLink[] }) {
  if (!guides.length) return null;
  return (
    <section className="blog-related-guides">
      <h2>Guides for this look</h2>
      <ul>
        {guides.map((a) => (
          <li key={a.id}>
            <Link href={`/blog/${a.slug}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
