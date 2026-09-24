import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { discoverCollections } from "@/lib/prompts/collections";
import { CollectionDiscovery } from "@/components/prompts/collection-discovery";
import { promptSchema, collectionSchema } from "@/types/content";
import originalPrompts from "@/content/prompts.json";
import originalCollections from "@/content/collections.json";
vi.mock("@/components/prompts/preview-image", () => ({
  PreviewImage: () => <span data-testid="cover" />,
}));
const template = promptSchema.parse(originalPrompts[0]);
const prompts = Array.from({ length: 8 }, (_, i) => ({
  ...template,
  id: `p${i}`,
  preview_image_url: `/previews/unique-${i}.webp`,
  is_published: true,
  preview_review_status: "approved" as const,
  prompt_type: "photo" as const,
}));
const base = {
  ...collectionSchema.parse(originalCollections[0]),
  active: true,
  is_indexable: true,
  prompt_ids: prompts.slice(0, 4).map((p) => p.id),
};
it("excludes inactive, expired, thin, empty, draft-only, duplicate and dangling destinations", () => {
  const collections = [
    { ...base, slug: "inactive", active: false },
    { ...base, slug: "noindex", is_indexable: false },
    { ...base, slug: "empty", prompt_ids: [] },
    { ...base, slug: "thin", prompt_ids: ["p0"] },
    { ...base, slug: "duplicate-ids", prompt_ids: ["p0", "p0", "p0", "p0"] },
    { ...base, slug: "dangling", prompt_ids: ["x", "y", "z", "a"] },
    {
      ...base,
      slug: "expired",
      kind: "seasonal" as const,
      start_date: "2025-01-01",
      end_date: "2025-01-31",
    },
    { ...base, slug: "draft-only", prompt_ids: ["d0", "d1", "d2", "d3"] },
    { ...base, slug: "ready" },
    { ...base, slug: "ready" },
  ];
  const drafts = prompts
    .slice(0, 4)
    .map((p, i) => ({ ...p, id: `d${i}`, is_published: false }));
  expect(
    discoverCollections({
      collections,
      prompts: [...prompts, ...drafts],
      medium: "photo",
      now: new Date("2026-09-10"),
    }).map((p) => p.collection.slug),
  ).toEqual(["ready"]);
});
it("caps recommendations at four, separates photo/reel destinations, and excludes current or unrelated collections", () => {
  const collections = Array.from({ length: 7 }, (_, i) => ({
    ...base,
    id: `c${i}`,
    slug: `collection-${i}`,
  }));
  expect(
    discoverCollections({ collections, prompts, medium: "photo" }),
  ).toHaveLength(4);
  expect(discoverCollections({ collections, prompts, medium: "reel" })).toEqual(
    [],
  );
  expect(
    discoverCollections({
      collections,
      prompts,
      medium: "photo",
      contextIds: ["p7"],
    }),
  ).toEqual([]);
  expect(
    discoverCollections({
      collections,
      prompts,
      medium: "photo",
      excludePath: "/collections/collection-0",
    }).some((p) => p.collection.slug === "collection-0"),
  ).toBe(false);
});
it("renders nothing instead of an empty heading when no collection is ready", () => {
  const { container } = render(
    <CollectionDiscovery
      collections={[{ ...base, active: false }]}
      prompts={prompts}
      medium="photo"
      path="/ai-prompts"
    />,
  );
  expect(container).toBeEmptyDOMElement();
});
it("uses the approved member image and accurate published count instead of stale collection cover data", () => {
  render(
    <CollectionDiscovery
      collections={[
        { ...base, slug: "ready", prompt_ids: [...base.prompt_ids, "unknown"] },
      ]}
      prompts={prompts}
      medium="photo"
      path="/ai-prompts"
    />,
  );
  expect(
    screen.getByRole("region", { name: "Explore collections" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    "/collections/ready",
  );
  expect(screen.getByText("4 photo ideas")).toBeInTheDocument();
  expect(screen.getByTestId("cover")).toBeInTheDocument();
});
