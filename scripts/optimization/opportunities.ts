import {
  isCategorySeoEligible,
  isCollectionSeoEligible,
  isPromptSeoEligible,
} from "../../lib/seo/eligibility";
import { promptPath } from "../../types/content";
import { finding, origin } from "./analyze";
import type { AuditCatalog, Finding } from "./types";

/** Supply screens are candidates for review, not instructions to publish a page. */
export function opportunityFindings(
  c: AuditCatalog,
  observedAt: string,
): Finding[] {
  const eligible = c.prompts.filter(isPromptSeoEligible);
  const hubs = [
    ...c.categories
      .filter((x) => x.slug !== "reels")
      .map((x) => ({
        path: `/ai-prompts/${x.slug}`,
        id: `category:${x.id}`,
        description: x.description,
        eligible: isCategorySeoEligible(x, c.prompts),
        members: eligible.filter(
          (p) =>
            p.category_id === x.id &&
            !["reel", "video"].includes(p.prompt_type),
        ),
      })),
    ...c.collections
      .filter((x) => x.active)
      .map((x) => ({
        path: `/collections/${x.slug}`,
        id: `collection:${x.id}`,
        description: x.description,
        eligible: isCollectionSeoEligible(x, c.prompts, new Date(observedAt)),
        members: eligible.filter((p) => x.prompt_ids.includes(p.id)),
      })),
  ];
  const findings: Finding[] = [];
  for (const hub of hubs) {
    const images = new Set(hub.members.map((p) => p.preview_image_url)).size;
    if (!hub.eligible && hub.members.length >= 4 && images >= 4) {
      const overlap = hubs
        .filter((h) => h.path !== hub.path && h.eligible)
        .map((h) => ({
          path: h.path,
          shared: h.members.filter((p) =>
            hub.members.some((m) => m.id === p.id),
          ).length,
        }))
        .filter((h) => h.shared > 0)
        .sort((a, b) => b.shared - a.shared || a.path.localeCompare(b.path));
      findings.push(
        finding(
          {
            rule: "hub-supply-review",
            key: hub.path,
            priority: "P3",
            areas: ["SEO", "AEO", "GEO", "links"],
            urls: [origin + hub.path, ...overlap.map((h) => origin + h.path)],
            sources: [c.sources[hub.id]],
            issue:
              "Existing nonindexable hub has enough assets for an intent review",
            evidence: `${hub.members.length} eligible members; ${images} distinct previews. Existing eligible hub overlaps: ${overlap.map((h) => `${h.path} (${h.shared} shared members)`).join(", ") || "none"}.`,
            action:
              "Review the existing route before proposing another URL. Require distinct intent, useful guidance and contextual links; retained noindex may be intentional. Counts alone do not justify indexing.",
            benefit:
              "Surface existing supply without inventing keyword pages or cannibalizing useful hubs.",
            confidence: "low",
            uncertainty:
              "No search demand or unique intent is established by member counts.",
            complexity: "medium",
            approval: "editorial",
          },
          observedAt,
        ),
      );
    }
    if (hub.eligible && !c.hubGuides[hub.path])
      findings.push(
        finding(
          {
            rule: "hub-answer-coverage",
            key: hub.path,
            priority: "P2",
            areas: ["SEO", "AEO", "GEO"],
            urls: [origin + hub.path],
            sources: [c.sources[hub.id]],
            issue: "Eligible hub has no dedicated guidance module",
            evidence: `${hub.members.length} members; existing description has ${hub.description.length} characters. Length is not a usefulness score.`,
            action:
              "Review existing copy for selection, expected-result and customization guidance before adding any text.",
            benefit:
              "Make collection purpose and user choices easier to understand.",
            confidence: "medium",
            uncertainty:
              "Absence of a module does not prove absence of useful answers.",
            complexity: "medium",
            approval: "editorial",
          },
          observedAt,
        ),
      );
  }
  const tools = eligible.filter((p) => p.suggested_tools.length);
  if (tools.length)
    findings.push(
      finding(
        {
          rule: "testing-provenance",
          key: "suggested-tools",
          priority: "P2",
          areas: ["AEO", "GEO"],
          urls: [origin + "/about"],
          sources: [
            { file: "types/content.ts" },
            { file: "components/prompts/prompt-detail.tsx" },
          ],
          issue:
            "Suggested tools are not a structured compatibility-test record",
          evidence: `${tools.length} eligible prompts list suggested tools. The catalogue schema has editorial approval and preview status, but no model/version/test-date compatibility record.`,
          action:
            "Document truthful methodology and distinguish suggestions from verified tests. Attribute real reviewers only with approval; never expose private identity assets or invent expertise.",
          benefit:
            "Provide attributable, understandable context for people and retrieval systems.",
          confidence: "high",
          uncertainty:
            "Tests may exist outside the catalogue; this finding does not assert that prompts were never tested or predict AI citations.",
          complexity: "medium",
          approval: "editorial",
        },
        observedAt,
      ),
    );

  const routes = new Map<string, string>([
    ["/", "/"],
    ["/ai-prompts", "/ai-prompts"],
    ["/reel-prompts", "/reel-prompts"],
    ["/collections", "/collections"],
    ...eligible.map((p) => [promptPath(p), p.id] as [string, string]),
    ...hubs.map((h) => [h.path, h.id] as [string, string]),
  ]);
  for (const [path, guide] of Object.entries(c.hubGuides))
    for (const link of guide.links || []) {
      if (!routes.has(link.path))
        findings.push(
          finding(
            {
              rule: "editorial-link",
              key: `${path}:${link.path}`,
              priority: "P2",
              areas: ["SEO", "links"],
              urls: [origin + path],
              sources: [{ file: "content/seo-guides.ts" }],
              issue:
                "Editorial guide link is outside the modeled public route inventory",
              evidence: link.path,
              action:
                "Verify the destination before changing the link; a route outside the model is not necessarily a 404.",
              benefit: "Protect contextual discovery links.",
              confidence: "medium",
              uncertainty:
                "This is a repository screen; rendered availability remains separate.",
              complexity: "low",
              approval: "editorial",
            },
            observedAt,
          ),
        );
    }
  return findings;
}
