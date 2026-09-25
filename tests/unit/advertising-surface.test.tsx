import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CatalogPage } from "@/components/prompts/catalog-page";
import { loadAuditCatalog } from "../../scripts/optimization/catalog";
vi.mock("@/components/ads/ad-slot", () => ({
  AdSlot: () => <aside data-test-ad />,
}));
vi.mock("@/components/ui/view-event", () => ({ CategoryView: () => null }));
vi.mock("@/components/prompts/paginated-grid", () => ({
  PaginatedGrid: () => null,
}));
vi.mock("@/components/prompts/collection-discovery", () => ({
  CollectionDiscovery: () => null,
}));
vi.mock("@/components/ui/site-link", () => ({
  default: ({ children, href }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href}>{children}</a>
  ),
}));
const catalog = loadAuditCatalog();
describe("content-aware ad surfaces", () => {
  it("excludes every thin collection while retaining eligible collection content", () => {
    for (const c of catalog.collections.filter((c) => c.active)) {
      const members = catalog.prompts.filter(
        (p) => p.is_published && c.prompt_ids.includes(p.id),
      );
      const html = renderToStaticMarkup(
        <CatalogPage
          {...catalog}
          prompts={members}
          availablePrompts={catalog.prompts}
          title={c.name}
          description={c.description}
          path={`/collections/${c.slug}`}
        />,
      );
      if (["professional", "saree", "diwali", "golden-hour"].includes(c.slug))
        expect(html).not.toContain("data-ad-surface");
      if (c.slug === "creative-transformations") {
        expect(html).toContain("data-ad-surface");
        expect(html).toContain("data-test-ad");
      }
    }
  });
  it("never grants an empty catalog advertising eligibility", () => {
    const html = renderToStaticMarkup(
      <CatalogPage
        {...catalog}
        prompts={[]}
        title="Pets"
        description="Pets"
        path="/ai-prompts/pets"
      />,
    );
    expect(html).not.toContain("data-ad-surface");
    expect(html).not.toContain("data-test-ad");
  });
});
