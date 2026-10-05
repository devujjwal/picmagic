import { execFileSync } from "node:child_process";
import type { Catalog } from "../../types/content";

// Playwright's ESM loader does not support this catalogue's JSON imports.
// Reuse the canonical read-only QA exporter via the installed TS loader.
export const catalog: Catalog = JSON.parse(
  execFileSync(
    process.execPath,
    ["--import", "tsx", "scripts/seo-catalog.ts"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  ),
);
export const prompts = catalog.prompts;
