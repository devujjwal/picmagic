import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  octoberPromptGuides,
  octoberHubGuides,
} from "@/content/october-guidance";
import { promptGuides, hubGuides } from "@/content/seo-guides";
import {
  remainingPromptGuides,
  remainingPromptFaqs,
} from "@/content/remaining-guidance";
import { PromptDetail } from "@/components/prompts/prompt-detail";
import { loadAuditCatalog } from "../../scripts/optimization/catalog";
import { sitemapEntries } from "@/lib/seo/sitemap";
import { promptPath } from "@/types/content";

vi.mock("@/components/ui/site-link", () => ({
  default: ({ children, href }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/components/share/detail-actions", () => ({
  DetailActions: () => null,
  CopyButton: () => null,
}));
vi.mock("@/components/prompts/preview-media", () => ({
  PreviewMedia: () => null,
}));
vi.mock("@/components/prompts/prompt-grid", () => ({ PromptGrid: () => null }));
vi.mock("@/components/ads/ad-slot", () => ({ AdSlot: () => null }));

const catalog = loadAuditCatalog();
vi.mock("@/config/site", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/config/site")>();
  return { ...original, site: { ...original.site, indexing: true } };
});
describe("October content guidance", () => {
  it("renders the authored answers consistently in HTML and FAQ schema, retaining the full prompt", () => {
    for (const [slug, guide] of Object.entries({
      ...octoberPromptGuides,
      ...remainingPromptGuides,
    })) {
      const prompt = catalog.prompts.find((p) => p.slug === slug)!;
      expect(prompt.is_published, slug).toBe(true);
      expect(promptGuides[slug]).toBe(guide);
      const document = new DOMParser().parseFromString(
        renderToStaticMarkup(
          <PromptDetail prompt={prompt} catalog={catalog} />,
        ),
        "text/html",
      );
      expect(document.querySelector(".prompt-text")?.textContent).toBe(
        prompt.prompt_text,
      );
      for (const section of guide.sections) {
        expect(document.body.textContent).toContain(section.body);
      }
      const visible = [...document.querySelectorAll(".faq details")].map(
        (detail) => ({
          question: detail.querySelector("summary")?.textContent,
          answer: detail.querySelector("p")?.textContent,
        }),
      );
      expect(visible, slug).toEqual(guide.faqs);
      const faq = [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ]
        .map((node) => JSON.parse(node.textContent!))
        .find((value) => value["@type"] === "FAQPage");
      expect(
        faq.mainEntity.map(
          (q: { name: string; acceptedAnswer: { text: string } }) => ({
            question: q.name,
            answer: q.acceptedAnswer.text,
          }),
        ),
        slug,
      ).toEqual(visible);
      expect(document.querySelector("section.faq")?.textContent).not.toContain(
        "forehead mark",
      );
    }
  });
  it("renders the six legacy FAQ replacements consistently", () => {
    expect(Object.keys(remainingPromptGuides)).toHaveLength(43);
    expect(Object.keys(remainingPromptFaqs)).toHaveLength(6);
    for (const [slug, faqs] of Object.entries(remainingPromptFaqs)) {
      const prompt = catalog.prompts.find((p) => p.slug === slug)!;
      expect(prompt.is_published, slug).toBe(true);
      const document = new DOMParser().parseFromString(
        renderToStaticMarkup(
          <PromptDetail prompt={prompt} catalog={catalog} />,
        ),
        "text/html",
      );
      expect(
        [...document.querySelectorAll("section.faq details")].map((detail) => ({
          question: detail.querySelector("summary")?.textContent,
          answer: detail.querySelector("p")?.textContent,
        })),
        slug,
      ).toEqual(faqs);
      const schema = [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ]
        .map((node) => JSON.parse(node.textContent!))
        .find((value) => value["@type"] === "FAQPage");
      expect(
        schema.mainEntity.map(
          (q: { name: string; acceptedAnswer: { text: string } }) => ({
            question: q.name,
            answer: q.acceptedAnswer.text,
          }),
        ),
        slug,
      ).toEqual(faqs);
    }
  });
  it("keeps CMS FAQs on pages without an authored replacement", () => {
    const prompt = catalog.prompts.find(
      (p) => p.slug === "the-heritage-railway-letter",
    )!;
    const document = new DOMParser().parseFromString(
      renderToStaticMarkup(<PromptDetail prompt={prompt} catalog={catalog} />),
      "text/html",
    );
    expect(
      [...document.querySelectorAll(".faq summary")].map((n) => n.textContent),
    ).toEqual(prompt.faqs.map((f) => f.question));
  });
  it("preserves publication and indexes only existing eligible routes while dating changed guidance", () => {
    const entries = sitemapEntries(catalog);
    expect(catalog.prompts.filter((p) => p.is_published)).toHaveLength(91);
    expect(Object.keys(octoberPromptGuides)).toHaveLength(16);
    expect(Object.keys(octoberHubGuides)).toHaveLength(12);
    for (const [slug, guide] of Object.entries(octoberPromptGuides)) {
      const p = catalog.prompts.find((p) => p.slug === slug)!;
      const entry = entries.find((entry) => entry.url.endsWith(promptPath(p)));
      expect(entry, slug).toBeDefined();
      expect(entry!.lastModified).toBe(guide.updatedAt);
    }
    for (const path of Object.keys(octoberHubGuides))
      expect(hubGuides[path]).toBe(octoberHubGuides[path]);
    for (const slug of ["professional", "saree", "golden-hour", "diwali"]) {
      expect(
        entries.some((entry) => entry.url.endsWith(`/collections/${slug}`)),
      ).toBe(false);
    }
  });
});
