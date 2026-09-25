import { execFileSync } from "node:child_process";
import type { Prompt } from "../../types/content";

// Playwright's ESM loader does not support this catalogue's JSON imports.
// Reuse the canonical read-only QA exporter via the installed TS loader.
export const prompts: Prompt[] = JSON.parse(
  execFileSync(
    process.execPath,
    ["--import", "tsx", "scripts/seo-catalog.ts"],
    { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 },
  ),
).prompts;
