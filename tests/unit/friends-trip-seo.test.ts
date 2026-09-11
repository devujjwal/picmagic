import { expect, it, vi } from "vitest";
import { promptSchema, collectionSchema } from "@/types/content";
import additions from "@/content/additions/friends-trip-prompts.json";
import collections from "@/content/additions/friends-trip-collections.json";
vi.mock("@/config/site", () => ({
  site: { url: "https://picmagic.in", name: "PicMagic", indexing: true },
}));
vi.mock("@/lib/content", () => ({ getCatalog: vi.fn() }));
import { getCatalog } from "@/lib/content";
import sitemap from "@/app/sitemap";
import { promptMetadata } from "@/lib/seo/metadata";
it("excludes the Ladakh draft and thin collection even when production indexing is enabled", async () => {
  const p = promptSchema.parse(additions[0]);
  const collection = collectionSchema.parse(collections[0]);
  vi.mocked(getCatalog).mockResolvedValue({
    prompts: [p],
    categories: [],
    collections: [{ ...collection, is_indexable: true }],
  });
  const urls = (await sitemap()).map((u) => u.url);
  expect(urls).toContain("https://picmagic.in/reel-prompts");
  expect(urls).not.toContain(
    "https://picmagic.in/reel-prompts/cinematic-ladakh-friends-trip",
  );
  expect(urls).not.toContain(
    "https://picmagic.in/collections/friends-travel-reels",
  );
  const metadata = promptMetadata(p);
  expect(metadata.alternates?.canonical).toBe(
    "https://picmagic.in/reel-prompts/cinematic-ladakh-friends-trip",
  );
  expect(metadata.robots).toMatchObject({ index: false });
});
