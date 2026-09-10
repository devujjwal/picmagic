import { createClient } from "@supabase/supabase-js";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:54421")
  throw new Error("Local QA only");
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const [p] = JSON.parse(await fs.readFile("content/prompts.json", "utf8"));
const [c] = JSON.parse(await fs.readFile("content/collections.json", "utf8"));
const member = c.prompt_ids[0];
let preserved = false;
try {
  await db
    .from("prompts")
    .update({ title: "A deliberate editorial change for seed verification" })
    .eq("id", p.id);
  await db
    .from("collection_prompts")
    .delete()
    .eq("collection_id", c.id)
    .eq("prompt_id", member);
  const run = spawnSync("pnpm", ["exec", "tsx", "scripts/seed.ts"], {
    env: process.env,
    stdio: "inherit",
  });
  if (run.status) throw new Error("Seed failed");
  const row = await db.from("prompts").select("title").eq("id", p.id).single();
  const link = await db
    .from("collection_prompts")
    .select("*")
    .eq("collection_id", c.id)
    .eq("prompt_id", member);
  preserved =
    row.data?.title === "A deliberate editorial change for seed verification" &&
    link.data?.length === 0;
} finally {
  await db.from("prompts").update({ title: p.title }).eq("id", p.id);
  await db
    .from("collection_prompts")
    .upsert({ collection_id: c.id, prompt_id: member });
}
await fs.writeFile(
  "docs/qa/seed.json",
  JSON.stringify({ editorialTextAndMembershipPreserved: preserved }, null, 2),
);
console.log({ editorialTextAndMembershipPreserved: preserved });
if (!preserved) process.exitCode = 1;
