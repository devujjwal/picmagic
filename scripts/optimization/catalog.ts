import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { allPrompts, allCollections } from "../../content/catalog";
import rawCategories from "../../content/categories.json";
import { promptGuides, hubGuides } from "../../content/seo-guides";
import {
  promptSchema,
  collectionSchema,
  categorySchema,
} from "../../types/content";
import { textSimilarity } from "../../lib/seo/similarity";
import type { AuditCatalog, Source } from "./types";

/** No network, writes, environment loading, or application server imports. */
export function loadAuditCatalog(root = process.cwd()): AuditCatalog {
  const sources: Record<string, Source> = {};
  const catalogSource = readFileSync(
    resolve(root, "content/catalog.ts"),
    "utf8",
  );
  const files = [
    "content/categories.json",
    ...[...catalogSource.matchAll(/from\s+"\.\/([^"\n]+\.json)"/g)].map(
      (m) => `content/${m[1]}`,
    ),
  ];
  for (const file of files) {
    if (
      /^content\/releases\/(?:premium-)?festival-memberships-2026-10\.json$/.test(
        file,
      )
    )
      continue;
    if (
      !/^content\/(?:additions\/|expansion\/|releases\/)?[a-z0-9-]+\.json$/.test(
        file,
      )
    )
      throw new Error("Unexpected catalogue source");
    const text = readFileSync(resolve(root, file), "utf8");
    const records = JSON.parse(text) as { id: string; slug: string }[];
    for (const record of records) {
      const offset = text.indexOf(`"slug": "${record.slug}"`);
      const source = {
        file,
        line: text.slice(0, Math.max(0, offset)).split("\n").length,
        recordId: record.id,
      };
      sources[record.id] = source;
      if (file === "content/categories.json")
        sources[`category:${record.id}`] = source;
      else if (/collections/.test(file))
        sources[`collection:${record.id}`] = source;
    }
  }
  return {
    prompts: allPrompts.map((p) => promptSchema.parse(p)),
    collections: allCollections.map((c) => collectionSchema.parse(c)),
    categories: rawCategories.map((c) => categorySchema.parse(c)),
    promptGuides,
    hubGuides,
    sources,
  };
}

/** Shared lexical screen. Deliberately makes no semantic-equivalence decision. */
export function overlappingPairs<T extends { prompt_text: string }>(
  prompts: T[],
  threshold = 0.7,
) {
  const pairs: { a: T; b: T; score: number }[] = [];
  for (let i = 0; i < prompts.length; i++)
    for (const b of prompts.slice(i + 1)) {
      const a = prompts[i];
      const score = textSimilarity(a.prompt_text, b.prompt_text);
      if (score >= threshold) pairs.push({ a, b, score });
    }
  return pairs;
}

export function duplicateGroups<T>(
  items: T[],
  key: (item: T) => string,
): T[][] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const value = key(item);
    if (value.trim()) groups.set(value, [...(groups.get(value) || []), item]);
  }
  return [...groups.values()].filter((group) => group.length > 1);
}
