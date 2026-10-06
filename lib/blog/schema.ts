import { z } from "zod";
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(120);
export const safeHref = z
  .string()
  .max(1000)
  .refine((v) => {
    if (/^\/(?!\/)[a-z0-9/#?=&._%-]*$/i.test(v) && !v.includes("\\"))
      return true;
    try {
      const u = new URL(v);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch {
      return false;
    }
  }, "Use a local path or HTTPS URL");
const datetime = z.iso
  .datetime({ offset: true })
  .transform((value) => new Date(value).toISOString());
const text = z.string().trim().min(1).max(12000);
export const inlineSchema = z
  .object({ text, href: safeHref.optional() })
  .strict();
const inline = z.array(inlineSchema).min(1).max(100);
const image = z
  .object({
    url: safeHref,
    alt: text,
    width: z.number().int().min(1).max(10000),
    height: z.number().int().min(1).max(10000),
    caption: z.string().max(1000).default(""),
  })
  .strict();
export const destinationSchema = z
  .object({
    path: z
      .string()
      .regex(
        /^\/(?:ai-prompts\/[a-z0-9-]+(?:\/[a-z0-9-]+)?|collections\/[a-z0-9-]+)$/,
      ),
    type: z.enum(["prompt", "category", "collection"]),
    label: text,
  })
  .strict();
export const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), content: inline }).strict(),
  z
    .object({
      type: z.literal("heading"),
      level: z.union([z.literal(2), z.literal(3)]),
      id: slug,
      text,
    })
    .strict(),
  z.object({ type: z.literal("image"), image }).strict(),
  z.object({ type: z.literal("quick_answer"), text }).strict(),
  z
    .object({
      type: z.literal("steps"),
      items: z
        .array(z.object({ title: text, text }).strict())
        .min(1)
        .max(30),
    })
    .strict(),
  z
    .object({
      type: z.literal("table"),
      caption: text,
      columns: z.array(text).min(2).max(6),
      rows: z.array(z.array(text).min(2).max(6)).min(1).max(40),
    })
    .strict(),
  z.object({ type: z.literal("callout"), title: text, text }).strict(),
  z
    .object({
      type: z.literal("faq"),
      items: z
        .array(z.object({ question: text, answer: text }).strict())
        .min(1)
        .max(20),
    })
    .strict(),
  z
    .object({
      type: z.literal("prompt_card"),
      prompt_id: z.uuid(),
      why: text,
      best_use: text,
      guidance: text,
    })
    .strict(),
  z
    .object({
      type: z.literal("prompt_grid"),
      items: z
        .array(
          z
            .object({
              prompt_id: z.uuid(),
              why: text,
              best_use: text,
              guidance: text,
            })
            .strict(),
        )
        .min(1)
        .max(12),
    })
    .strict(),
  z.object({ type: z.literal("cta"), destination: destinationSchema }).strict(),
]);
export const articleSchema = z
  .object({
    id: z.uuid(),
    version: z.literal(1),
    slug,
    title: z.string().trim().min(1).max(180),
    excerpt: z.string().trim().min(1).max(600),
    body: z.array(blockSchema).min(1).max(120),
    author_id: slug,
    reviewed_by: z.string().max(120).nullable().default(null),
    article_type: z.enum(["guide", "ideas", "lab"]),
    primary_topic: z.string().min(1).max(80),
    related_prompts: z.array(z.uuid()).max(40),
    related_collections: z
      .array(z.string().regex(/^\/(?:ai-prompts|collections)\/[a-z0-9-]+$/))
      .max(20),
    related_articles: z.array(slug).max(12),
    seo_title: z.string().trim().min(1).max(180),
    meta_description: z.string().trim().min(1).max(320),
    featured_image: image,
    primary_conversion: destinationSchema,
    status: z.enum(["draft", "review", "published"]),
    is_indexable: z.boolean(),
    is_featured: z.boolean().default(false),
    date_published: datetime.nullable(),
    date_modified: datetime,
    created_at: datetime,
    noindex_reason: z.string().max(1000).nullable().default(null),
    noindex_review_at: datetime.nullable().default(null),
    sources: z
      .array(
        z
          .object({
            title: text,
            url: safeHref,
            checked_at: z.iso.date(),
            note: text,
          })
          .strict(),
      )
      .max(40),
    evidence_note: z.string().max(2000),
  })
  .strict();
export type Article = z.infer<typeof articleSchema>;
export type ArticleBlock = z.infer<typeof blockSchema>;
export const authorSchema = z
  .object({ id: slug, name: text, bio: text, profile_path: safeHref })
  .strict();
export type BlogAuthor = z.infer<typeof authorSchema>;
export function publicationIssues(a: Article, now = new Date()) {
  const issues: string[] = [];
  const ids = a.body.filter((b) => b.type === "heading").map((b) => b.id);
  if (new Set(ids).size !== ids.length)
    issues.push("Heading anchors must be unique.");
  let previous = 1;
  for (const b of a.body) {
    if (b.type === "heading") {
      if (b.level > previous + 1) issues.push("Do not skip heading levels.");
      previous = b.level;
    }
    if (b.type === "table" && b.rows.some((r) => r.length !== b.columns.length))
      issues.push("Table rows must match their columns.");
  }
  if (a.status !== "published") {
    if (a.is_indexable)
      issues.push("Draft and review articles cannot be indexable.");
    return issues;
  }
  if (!a.date_published || Date.parse(a.date_published) > now.getTime())
    issues.push("Publication requires a current or past publication date.");
  if (!a.is_indexable) {
    const deadline = Date.parse(a.noindex_review_at || "");
    if (
      !a.noindex_reason?.trim() ||
      !Number.isFinite(deadline) ||
      deadline <= now.getTime() ||
      deadline > now.getTime() + 30 * 86400000
    )
      issues.push(
        "Temporary noindex requires a reason and a future review deadline within 30 days.",
      );
  }
  if (
    a.article_type === "lab" &&
    (!a.evidence_note.trim() || !a.sources.length)
  )
    issues.push(
      "Lab publication requires evidence references and an evidence disclosure.",
    );
  return issues;
}
export function isArticlePublic(a: Article, now = new Date()) {
  return a.status === "published" && publicationIssues(a, now).length === 0;
}
export function isArticleDiscoverable(a: Article, now = new Date()) {
  return a.is_indexable && isArticlePublic(a, now);
}
export function articlePath(a: Pick<Article, "slug">) {
  return `/blog/${a.slug}`;
}
