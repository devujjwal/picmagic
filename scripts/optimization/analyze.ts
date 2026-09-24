import { createHash } from "node:crypto";
import { promptPath, type Prompt } from "../../types/content";
import {
  isPromptSeoEligible,
  isCategorySeoEligible,
  isCollectionSeoEligible,
} from "../../lib/seo/eligibility";
import { relatedPrompts } from "../../lib/prompts/discovery";
import { promptCollections } from "../../lib/prompts/collections";
import { duplicateGroups, overlappingPairs } from "./catalog";
import { opportunityFindings } from "./opportunities";
import {
  REPORT_VERSION,
  type AuditCatalog,
  type Finding,
  type FindingInput,
  type GraphEdge,
  type GraphNode,
  type Report,
} from "./types";

export const origin = "https://picmagic.in";
function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, stableValue(item)]),
    );
  return value;
}
export const hash = (value: unknown) =>
  createHash("sha256")
    .update(JSON.stringify(stableValue(value)))
    .digest("hex");
export function finding(input: FindingInput, observedAt: string): Finding {
  const { key, evidence, evidenceSource, ...fields } = input;
  return {
    ...fields,
    id: `${input.rule}:${hash(key).slice(0, 16)}`,
    ruleVersion: 1,
    detectionSafe: true,
    status: "new",
    evidence: [
      { source: evidenceSource || "repository", observedAt, detail: evidence },
    ],
  };
}
const isReel = (p: Prompt) => ["reel", "video"].includes(p.prompt_type);

export function analyzeCatalog(
  catalog: AuditCatalog,
  observedAt: string,
): Report {
  const now = new Date(observedAt);
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid audit date");
  const { prompts, categories, collections, sources } = catalog;
  const published = prompts.filter((p) => p.is_published);
  const eligible = prompts.filter(isPromptSeoEligible);
  const hubs = collections.filter((c) =>
    isCollectionSeoEligible(c, prompts, now),
  );
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const findings: Finding[] = [];
  const add = (input: FindingInput) =>
    findings.push(finding(input, observedAt));
  const edge = (
    from: string,
    to: string,
    kind: GraphEdge["kind"],
    link = false,
  ) => edges.push({ from, to, kind, link });
  const base: Pick<
    FindingInput,
    | "priority"
    | "areas"
    | "confidence"
    | "complexity"
    | "approval"
    | "uncertainty"
    | "benefit"
  > = {
    priority: "P2",
    areas: ["SEO", "AEO", "GEO"],
    confidence: "medium",
    complexity: "medium",
    approval: "editorial",
    uncertainty:
      "Editorial usefulness and search impact require human review; no ranking gain is predicted.",
    benefit:
      "Improve intent clarity and useful discovery without adding redundant pages.",
  };
  const promptFinding = (
    p: Prompt,
    rule: string,
    issue: string,
    evidence: string,
    action: string,
  ) =>
    add({
      ...base,
      rule,
      key: p.id,
      issue,
      evidence,
      action,
      urls: [origin + promptPath(p)],
      sources: [
        sources[p.id] || { file: "content/catalog.ts", recordId: p.id },
      ],
    });

  for (const path of ["/", "/ai-prompts", "/reel-prompts", "/collections"])
    nodes.push({ id: path, kind: "page", url: origin + path });
  for (const path of ["/ai-prompts", "/reel-prompts", "/collections"])
    edge("/", path, "hub", true);
  for (const c of categories)
    nodes.push({
      id: `category:${c.id}`,
      kind: "category",
      url: `${origin}/ai-prompts/${c.slug}`,
      eligible: isCategorySeoEligible(c, prompts),
      label: c.name,
    });
  for (const c of collections) {
    nodes.push({
      id: `collection:${c.id}`,
      kind: "collection",
      url: `${origin}/collections/${c.slug}`,
      eligible: hubs.includes(c),
      label: c.name,
    });
    if (hubs.includes(c))
      edge("/collections", `collection:${c.id}`, "hub", true);
    for (const id of c.prompt_ids) {
      if (prompts.some((p) => p.id === id))
        edge(
          `collection:${c.id}`,
          id,
          "membership",
          c.active && published.some((p) => p.id === id),
        );
      else
        add({
          ...base,
          rule: "dangling-membership",
          key: `${c.id}:${id}`,
          issue: "Collection references an unknown prompt",
          evidence: id,
          action: "Review the membership against the canonical catalogue.",
          urls: [`${origin}/collections/${c.slug}`],
          sources: [sources[`collection:${c.id}`]],
          confidence: "high",
        });
    }
  }
  const imageIds = new Set<string>(),
    termIds = new Set<string>();
  for (const p of prompts) {
    nodes.push({
      id: p.id,
      kind: "prompt",
      url: origin + promptPath(p),
      published: p.is_published,
      eligible: isPromptSeoEligible(p),
      label: p.title,
    });
    if (!p.is_published) continue; // Drafts are inventory, never growth recommendations.
    edge(isReel(p) ? "/reel-prompts" : "/ai-prompts", p.id, "catalogue", true);
    edge(p.id, `category:${p.category_id}`, "category", !isReel(p));
    const imageId = `image:${p.preview_image_url}`;
    if (!imageIds.has(imageId))
      nodes.push({
        id: imageId,
        kind: "image",
        url: new URL(p.preview_image_url, origin).href,
      });
    imageIds.add(imageId);
    edge(p.id, imageId, "image");
    // Normalize spelling only. These are descriptive terms, not new public entities.
    for (const raw of [...p.tags, ...p.style, p.subject, p.occasion]) {
      const term = raw.trim().toLowerCase().replace(/\s+/g, " ");
      if (!term) continue;
      const id = `term:${term}`;
      if (!termIds.has(id)) nodes.push({ id, kind: "term", label: term });
      termIds.add(id);
      edge(p.id, id, "term");
    }
    for (const other of relatedPrompts(p, published))
      edge(p.id, other.id, "related", true);
    const counterpart = eligible.find(
      (o) =>
        o.id !== p.id &&
        isReel(o) !== isReel(p) &&
        o.preview_image_url === p.preview_image_url,
    );
    if (counterpart) edge(p.id, counterpart.id, "counterpart", true);
    const memberships = hubs.filter((c) => c.prompt_ids.includes(p.id));
    const shown = promptCollections(p, collections, published, now);
    for (const collection of shown)
      edge(p.id, `collection:${collection.id}`, "collection-link", true);
    if (memberships.length && !shown.length)
      promptFinding(
        p,
        "mixed-medium-link",
        "Eligible collection membership is not exposed by detail discovery",
        memberships.map((c) => c.slug).join(", "),
        "Separate membership links from the same-medium four-card recommendation threshold; review before changing discovery.",
      );
    if (!memberships.length)
      promptFinding(
        p,
        "curated-context",
        "No eligible collection membership (not an orphan verdict)",
        "Catalogue links remain available; related-link reachability is represented separately.",
        "Consider an existing, genuinely relevant collection. Do not create one just to satisfy a count.",
      );
    if (!/(prompt|photo|portrait|image|reel|headshot)/i.test(p.seo_title))
      promptFinding(
        p,
        "title-intent",
        "Creative title may not explain the search task",
        p.seo_title,
        "Review a descriptive task phrase while retaining the creative title; do not keyword-stuff.",
      );
    if (!catalog.promptGuides[p.slug])
      promptFinding(
        p,
        "answer-coverage",
        "No dedicated concept-specific usage guide",
        `${p.faqs.length} FAQs already exist; absence of a guide does not prove thin content.`,
        "Review whether the existing explanation answers expected result, best use and customization questions; add only missing useful guidance.",
      );
    if (
      p.tags.some((t) => t.toLowerCase() === "couple") &&
      /\bone adult\b/i.test(p.prompt_text) &&
      !/\b(two adults|a couple)\b/i.test(p.description)
    )
      promptFinding(
        p,
        "taxonomy-conflict",
        "Couple tag may conflict with single-adult instructions",
        "The record includes a couple tag and the literal instruction ‘one adult’.",
        "Review prompt intent and tag accuracy manually; never infer demographic attributes from the image.",
      );
    for (const field of ["seo_title", "seo_description", "image_alt"] as const)
      if (!p[field]?.trim())
        promptFinding(
          p,
          "missing-content-field",
          `Missing ${field}`,
          field,
          "Supply accurate, reviewed content for this field.",
        );
  }
  for (const { a, b, score } of overlappingPairs(eligible))
    add({
      ...base,
      rule: "lexical-overlap",
      key: [a.id, b.id].sort().join(":"),
      urls: [a, b].map((p) => origin + promptPath(p)),
      sources: [sources[a.id], sources[b.id]],
      issue: "Prompt pair needs intent review",
      evidence: `Lexical trigram overlap ${score.toFixed(3)}; includes shared identity/safety boilerplate.`,
      action:
        "Compare scene-specific instructions, medium and output. Do not auto-merge, rewrite or noindex.",
      uncertainty:
        "Lexical similarity is not semantic equivalence or proven cannibalization.",
    });
  for (const group of duplicateGroups(eligible, (p) => p.preview_image_url))
    add({
      ...base,
      areas: ["SEO", "images"],
      rule: "shared-preview",
      key: group
        .map((p) => p.id)
        .sort()
        .join(":"),
      urls: group.map((p) => origin + promptPath(p)),
      sources: group.map((p) => sources[p.id]),
      issue: "Multiple pages share a preview",
      evidence: group[0].preview_image_url,
      action:
        "Review still/reel intent differentiation. Keep accurate shared alt text rather than inventing differences.",
    });
  for (const field of ["seo_title", "seo_description", "description"] as const)
    for (const group of duplicateGroups(eligible, (p) =>
      p[field].trim().toLowerCase(),
    ))
      add({
        ...base,
        rule: `duplicate-${field}`,
        key: group
          .map((p) => p.id)
          .sort()
          .join(":"),
        urls: group.map((p) => origin + promptPath(p)),
        sources: group.map((p) => sources[p.id]),
        issue: `Exact duplicate ${field}`,
        evidence: `${group.length} eligible records have the same normalized field.`,
        action:
          "Review intent and differentiate useful pages; do not apply automated canonical changes.",
        confidence: "high",
      });
  for (const group of duplicateGroups(
    published.flatMap((p) => p.faqs.map((f) => ({ p, answer: f.answer }))),
    (f) => f.answer.trim(),
  )) {
    if (group.length < 10) continue;
    add({
      ...base,
      rule: "shared-answer",
      key: hash(group[0].answer),
      urls: [...new Set(group.map((x) => origin + promptPath(x.p)))].sort(),
      sources: [],
      issue: "Common answer reused across the library",
      evidence: `${group.length} occurrences. Reuse can be useful and is not a penalty diagnosis.`,
      action:
        "Retain useful common instructions; review whether concept-specific questions are also answered.",
    });
  }
  findings.push(...opportunityFindings(catalog, observedAt));
  const reachable = new Set(["/"]);
  for (let n = 0, previous = -1; previous !== n; n = reachable.size) {
    previous = n;
    for (const e of edges)
      if (e.link && reachable.has(e.from)) reachable.add(e.to);
  }
  return {
    version: REPORT_VERSION,
    mode: "recommendation-only",
    observedAt,
    fingerprint: hash(catalog),
    inventory: {
      total: prompts.length,
      published: published.length,
      drafts: prompts.length - published.length,
      eligible: eligible.length,
      categories: categories.length,
      eligibleCategories: categories.filter((c) =>
        isCategorySeoEligible(c, prompts),
      ).length,
      collections: collections.length,
      activeCollections: collections.filter((c) => c.active).length,
      eligibleCollections: hubs.length,
      uniqueImages: imageIds.size,
      relatedEdges: edges.filter((e) => e.kind === "related").length,
      modeledUnreachablePrompts: published.filter((p) => !reachable.has(p.id))
        .length,
      withoutCollection: published.filter(
        (p) => !collections.some((c) => c.prompt_ids.includes(p.id)),
      ).length,
      withoutEligibleCollection: published.filter(
        (p) => !hubs.some((c) => c.prompt_ids.includes(p.id)),
      ).length,
    },
    coverage: {
      repository: "observed",
      images: "unknown",
      rendered: "unknown",
      search: "unknown",
      analytics: "unknown",
      fieldCWV: "unknown",
      productionDatabase: "unknown",
    },
    graph: {
      nodes: nodes.sort((a, b) => a.id.localeCompare(b.id)),
      edges: [
        ...new Map(edges.map((e) => [JSON.stringify(e), e])).values(),
      ].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    },
    findings,
    changes: { new: [], persistent: [], changed: [], resolved: [] },
    limitations: [
      "Recommendation mode only: no publication or production changes.",
      "Graph links are repository-derived template expectations, not a live crawl or external backlink graph.",
      "Terms preserve lexical labels; platform/audience/use-case classification requires editorial review.",
      "Preview identity, artistic accuracy and tool compatibility require human review.",
      "No verified author, public methodology or model-testing provenance is inferred from internal approval flags.",
      "No new landing page is approved: supply, distinct intent, cannibalization and contextual links require review.",
    ],
  };
}
