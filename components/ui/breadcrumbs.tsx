import Link from "@/components/ui/site-link";
import { ChevronRight } from "lucide-react";
import { breadcrumbs } from "@/lib/seo/metadata";
import { StructuredData } from "./structured-data";
export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {items.map((item, i) => (
            <li key={item.path}>
              {i > 0 && <ChevronRight size={12} />}
              {i === items.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <StructuredData data={breadcrumbs(items)} />
    </>
  );
}
