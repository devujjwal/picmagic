// Explicit release tool, separate from the read-only optimization agent.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";

const mode = process.argv[2];
if (!["--prepare", "--apply", "--verify"].includes(mode))
  throw new Error("Use --prepare, --apply or --verify with the production env file");
const root = ".release-private/seo-followup-release";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (url !== "https://lxecbrvzpmgjmsqiachc.supabase.co")
  throw new Error("Unexpected project");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) throw new Error("Missing server credential");
const manifest = JSON.parse(await readFile("docs/audits/seo-followup-2026-09-24/editorial-changes.json", "utf8"));
if (manifest.length !== 11 || new Set(manifest.map(c => c.slug)).size !== 11)
  throw new Error("Unexpected release manifest");
for (const change of manifest)
  for (const field of Object.keys(change.after))
    if (!["seo_title", "seo_description", "tags", "reel", "updated_at"].includes(field))
      throw new Error("Unapproved field");

async function request(query, patch) {
  const response = await fetch(`${url}/rest/v1/prompts?${query}`, {
    method: patch ? "PATCH" : "GET",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: patch ? JSON.stringify(patch) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Database HTTP ${response.status}`);
  return response.json();
}
const rows = await request("select=*&order=id&limit=1000");
if (rows.length !== 186 || rows.filter(p => p.is_published).length !== 91)
  throw new Error("Catalogue publication counts drifted");
const fields = c => Object.keys(c.after).filter(k => k !== "updated_at");
const find = (items, slug) => {
  const found = items.filter(p => p.slug === slug);
  if (found.length !== 1 || !found[0].is_published) throw new Error(`Target mismatch: ${slug}`);
  return found[0];
};
await mkdir(root, { recursive: true, mode: 0o700 });

if (mode === "--prepare") {
  for (const c of manifest) {
    const row = find(rows, c.slug);
    for (const field of fields(c))
      if (!isDeepStrictEqual(row[field], c.before[field]))
        throw new Error(`Editorial drift: ${c.slug}.${field}`);
  }
  await writeFile(`${root}/before.json`, JSON.stringify({ observedAt: new Date().toISOString(), rows }, null, 2), { flag: "wx", mode: 0o600 });
  console.log("Backed up 186 content rows privately; all 11 editorial targets match. No database writes.");
} else {
  const backup = JSON.parse(await readFile(`${root}/before.json`, "utf8"));
  if (mode === "--apply") {
    if (!isDeepStrictEqual(rows, backup.rows)) throw new Error("Database changed after backup; review before applying");
    for (const c of manifest) {
      const row = find(rows, c.slug);
      const query = new URLSearchParams({ id: `eq.${row.id}`, updated_at: `eq.${row.updated_at}`, select: "*" });
      // Guard edited fields too: not all legacy writers advance updated_at.
      for (const field of fields(c)) {
        const v = row[field];
        const value = Array.isArray(v)
          ? `{${v.map(x => `"${String(x).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`).join(",")}}`
          : typeof v === "object" ? JSON.stringify(v) : v;
        query.set(field, v === null ? "is.null" : `eq.${value}`);
      }
      const patch = Object.fromEntries(fields(c).map(k => [k, c.after[k]]));
      patch.updated_at = new Date().toISOString();
      const changed = await request(query, patch);
      if (changed.length !== 1) throw new Error(`Concurrent edit: ${c.slug}; stop and inspect backup`);
      console.log(`Updated ${c.slug}`);
    }
  }
  const current = mode === "--apply" ? await request("select=*&order=id&limit=1000") : rows;
  for (const old of backup.rows) {
    const row = current.find(p => p.id === old.id);
    const change = manifest.find(c => c.slug === old.slug);
    if (!row) throw new Error("Missing original row");
    const expected = change ? { ...old, ...change.after, updated_at: row.updated_at } : old;
    if (!isDeepStrictEqual(row, expected)) throw new Error(`Verification mismatch: ${old.slug}`);
  }
  if (current.length !== backup.rows.length) throw new Error("Unexpected new records");
  await writeFile(`${root}/verified-${Date.now()}.json`, JSON.stringify({ observedAt: new Date().toISOString(), changed: 11, published: 91, drafts: 95, unchangedOtherRows: 175 }, null, 2), { flag: "wx", mode: 0o600 });
  console.log("Verified 11 exact editorial changes; 175 other rows unchanged; 91 published / 95 drafts. No schema migration required.");
}
