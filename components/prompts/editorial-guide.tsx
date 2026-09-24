import type { EditorialGuide as Guide } from "@/content/seo-guides";
import Link from "@/components/ui/site-link";

export function EditorialGuide({ guide }: { guide?: Guide }) {
  if (!guide) return null;
  return (
    <section className="section" aria-label="Practical guidance">
      <div className="reel-scenes">
        {guide.sections.map((section) => (
          <div className="reel-scene" key={section.heading}>
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
      {guide.links?.length ? (
        <nav className="collection-links mt-5" aria-label="Related guides">
          {guide.links.map((link) => (
            <Link className="chip" key={link.path} href={link.path}>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
}
