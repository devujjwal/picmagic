import { execFileSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import type { Prompt } from "../../types/content";
import { promptSchema } from "../../types/content";
import { allPrompts } from "../../content/catalog";
import categories from "../../content/categories.json";

export type Revision = {
  table: "prompts" | "categories";
  id: string;
  guard: Record<string, unknown>;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
};
const fields = new Set([
  "description",
  "prompt_text",
  "faqs",
  "why_ai",
  "framing",
  "reel",
  "reference_contract",
  "created_at",
  "updated_at",
]);
const same = (a: unknown, b: unknown) =>
  isDeepStrictEqual(a ?? null, b ?? null);

export function reviewedRevisions(baseRef: string): Revision[] {
  if (!/^[a-f0-9]{7,40}$/.test(baseRef))
    throw new Error("Use an exact baseline commit hash");
  const catalog = execFileSync(
    "git",
    ["show", `${baseRef}:content/catalog.ts`],
    { encoding: "utf8" },
  );
  const files = [...catalog.matchAll(/from\s+"\.\/([^"\n]+\.json)"/g)]
    .map((m) => `content/${m[1]}`)
    .filter((path) => !path.includes("collections"));
  const old = files
    .flatMap(
      (path) =>
        JSON.parse(
          execFileSync("git", ["show", `${baseRef}:${path}`], {
            encoding: "utf8",
          }),
        ) as Prompt[],
    )
    .map((p) => promptSchema.parse(p));
  const revisions: Revision[] = [];
  for (const raw of allPrompts) {
    const next = promptSchema.parse(raw);
    const before = old.find((p) => p.id === next.id);
    if (!before) throw new Error(`Unreviewed addition: ${next.slug}`);
    const changed = Object.keys(before).filter(
      (key) => !same(before[key as keyof Prompt], next[key as keyof Prompt]),
    );
    if (!changed.length) continue;
    if (
      !next.is_published ||
      next.preview_review_status !== "approved" ||
      changed.some((field) => !fields.has(field))
    )
      throw new Error(`Outside reviewed field scope: ${next.slug}`);
    revisions.push({
      table: "prompts",
      id: next.id,
      guard: Object.fromEntries(
        [
          "slug",
          "category_id",
          "prompt_type",
          "is_published",
          "is_indexable",
          "preview_review_status",
          "preview_image_url",
          "thumbnail_url",
          "published_at",
        ].map((k) => [k, before[k as keyof Prompt]]),
      ),
      before: Object.fromEntries(
        changed.map((k) => [k, before[k as keyof Prompt]]),
      ),
      after: Object.fromEntries(
        changed.map((k) => [k, next[k as keyof Prompt]]),
      ),
    });
  }
  const oldCategories = JSON.parse(
    execFileSync("git", ["show", `${baseRef}:content/categories.json`], {
      encoding: "utf8",
    }),
  ) as typeof categories;
  for (const next of categories) {
    const before = oldCategories.find((c) => c.id === next.id);
    if (!before) throw new Error("Unreviewed category addition");
    const changed = Object.keys(next).filter(
      (key) =>
        !same(before[key as keyof typeof next], next[key as keyof typeof next]),
    );
    if (changed.some((key) => key !== "description"))
      throw new Error("Category revision exceeds description-only scope");
    if (changed.length)
      revisions.push({
        table: "categories",
        id: next.id,
        guard: { slug: before.slug, is_indexable: before.is_indexable },
        before: { description: before.description },
        after: { description: next.description },
      });
  }
  if (old.length !== allPrompts.length)
    throw new Error("Catalogue membership changed");
  return revisions;
}

const literal = (value: unknown) =>
  `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
export function releaseSql(revisions: Revision[]) {
  const blocks = revisions.map((revision, i) => {
    const table = revision.table;
    if (table !== "prompts" && table !== "categories")
      throw new Error("Unexpected write table");
    const allowed = table === "prompts" ? fields : new Set(["description"]);
    if (!Object.keys(revision.after).every((k) => allowed.has(k)))
      throw new Error("Unexpected write column");
    if (!/^[a-z0-9-]+$/.test(revision.id)) throw new Error("Unsafe record id");
    const keys = Object.keys(revision.after);
    const timestamp =
      table === "prompts" && !keys.includes("updated_at")
        ? ", updated_at = transaction_timestamp()"
        : "";
    return `do $revision_${i}$
declare live public.${table}; old_row public.${table}; next_row public.${table}; guard_row public.${table}; key text; patch jsonb := '{}'::jsonb;
begin
  select * into strict live from public.${table} where id = '${revision.id}' for update;
  old_row := jsonb_populate_record(null::public.${table}, ${literal(revision.before)});
  next_row := jsonb_populate_record(null::public.${table}, ${literal(revision.after)});
  guard_row := jsonb_populate_record(null::public.${table}, ${literal(revision.guard)});
  for key in select jsonb_object_keys(${literal(revision.guard)}) loop
    if (to_jsonb(live)->key) is distinct from (to_jsonb(guard_row)->key) then raise exception 'Protected field conflict: ${revision.id}.%', key; end if;
  end loop;
  for key in select jsonb_object_keys(${literal(revision.after)}) loop
    if (to_jsonb(live)->key) is not distinct from (to_jsonb(next_row)->key) then continue; end if;
    if (to_jsonb(live)->key) is distinct from (to_jsonb(old_row)->key) then raise exception 'Editorial conflict: ${revision.id}.%', key; end if;
    patch := patch || jsonb_build_object(key, to_jsonb(next_row)->key);
  end loop;
  if patch <> '{}'::jsonb then
    next_row := jsonb_populate_record(live, patch);
    update public.${table} set ${keys.map((key) => `${key} = next_row.${key}`).join(", ")}${timestamp} where id = live.id;
  end if;
end $revision_${i}$;`;
  });
  return `-- Reviewed baseline c21f970; run in an authorized SQL session only.
-- Preview transaction: ALWAYS rolls back. No production application is authorized yet.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';
${blocks.join("\n")}
rollback;
`;
}
