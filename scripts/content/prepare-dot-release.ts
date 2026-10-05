/** Offline preparation only: never connects to Supabase or applies a revision. */
import { writeFileSync } from "node:fs";
import { reviewedRevisions, releaseSql } from "./dot-release";
const revisions = reviewedRevisions("c21f970");
const root = "docs/audits/dot-public-2026-10-05/";
writeFileSync(
  root + "release-revisions.json",
  JSON.stringify({ baseline: "c21f970", revisions }, null, 2) + "\n",
);
writeFileSync(root + "release-preview.sql", releaseSql(revisions));
console.log(
  `Prepared ${revisions.filter((r) => r.table === "prompts").length} published prompt and ${revisions.filter((r) => r.table === "categories").length} category revisions. SQL ends with ROLLBACK; no network or production writes.`,
);
