import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sources = [
  "content/prompts.json",
  "content/expansion/prompts.json",
  "content/additions/friends-trip-prompts.json",
  "content/additions/creative-prompts.json",
  "content/additions/social-prompts.json",
  "content/additions/gen-z-prompts.json",
  "content/additions/reference-impact-prompts.json",
  "content/additions/double-exposure-fashion-prompts.json",
  "content/additions/katana-streetwear-prompts.json",
  "content/additions/giant-playlist-prompts.json",
];

const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const prompts = sources.flatMap((source) =>
  read(source).map((prompt) => ({ ...prompt, source })),
);

function creativeText(prompt) {
  const creative = (prompt.prompt_text || "").split("CREATIVE DIRECTION:").at(-1);
  return `${prompt.image_brief || ""}\n${creative || prompt.prompt_text || ""}`
    .split("REFERENCE COMPATIBILITY:")[0]
    .replace(/\s+/g, " ")
    .trim();
}

function classify(text) {
  if (/\b(laugh(?:ing|s)?|burst of laughter|joyful laugh|open laughter|amused laugh)\b/i.test(text))
    return "laughing/open-happy";
  if (/\b(smil(?:e|es|ing)|warm grin|soft grin|happy expression|cheerful)\b/i.test(text))
    return "smiling/warm";
  if (/\b(surpris(?:e|ed)|astonish(?:ed|ment)|wide-eyed|wonder|startled|disbelief)\b/i.test(text))
    return "surprised/wonder";
  if (/\b(thoughtful|contemplat(?:e|ive)|reflective|pensive|introspective)\b/i.test(text))
    return "thoughtful/reflective";
  if (/\b(serious|stern|composed|determined|focused|confident|sharp glance|unsmiling)\b/i.test(text))
    return "serious/composed";
  if (/\b(calm|neutral|relaxed|subtle expression|quiet expression|resting expression)\b/i.test(text))
    return "calm/neutral";
  return "unspecified";
}

function subjectKind(text) {
  if (/\b(woman|women|female|girl|bride|mother|grandmother|auntie|she|her)\b/i.test(text))
    return "female-presenting";
  if (/\b(man|men|male|boy|groom|father|grandfather|he|his)\b/i.test(text))
    return "male-presenting";
  return "not-explicit";
}

const items = prompts
  .filter((prompt) =>
    ["person", "person-and-product"].includes(prompt.persona_policy),
  )
  .filter((prompt) => prompt.preview_image_url)
  .map((prompt) => {
    const text = creativeText(prompt);
    const category = classify(text);
    return {
      id: prompt.id,
      slug: prompt.slug,
      source: prompt.source,
      status: prompt.is_published ? "published" : "draft",
      preview_image_url: prompt.preview_image_url,
      subject_signal: subjectKind(text),
      expression_category: category,
      camera_facing_signal:
        /\b(direct (?:eye contact|gaze)|look(?:ing|s)? (?:at|toward) (?:the )?camera|camera-facing|front-facing)\b/i.test(
          text,
        ),
      review_reason:
        category === "unspecified"
          ? "No expression intent is explicit; review before regeneration so the reference smile cannot leak into the result."
          : null,
    };
  });

const uniqueByPreview = [...new Map(items.map((item) => [item.preview_image_url, item])).values()];
const count = (records, field) =>
  Object.fromEntries(
    [...new Set(records.map((record) => record[field]))]
      .sort()
      .map((value) => [
        value,
        records.filter((record) => record[field] === value).length,
      ]),
  );
const happyCategories = new Set(["smiling/warm", "laughing/open-happy"]);
const published = uniqueByPreview.filter((item) => item.status === "published");
const smilingPublished = published.filter((item) =>
  happyCategories.has(item.expression_category),
);

const result = {
  generated_at: new Date().toISOString(),
  method:
    "Deterministic keyword audit of scene-specific prompt text and image briefs. Identity/policy preambles are excluded. This is a triage signal, not a claim that repeated smiles are automatically wrong; visual QA remains required after generation.",
  scope: {
    records_with_person_policy_and_preview: items.length,
    unique_preview_assets: uniqueByPreview.length,
    status_counts: count(uniqueByPreview, "status"),
  },
  published_baseline: {
    unique_preview_assets: published.length,
    expression_counts: count(published, "expression_category"),
    explicit_smile_or_laugh_count: smilingPublished.length,
    explicit_smile_or_laugh_percent:
      published.length === 0
        ? 0
        : Number(((smilingPublished.length / published.length) * 100).toFixed(1)),
    camera_facing_and_smiling_count: smilingPublished.filter(
      (item) => item.camera_facing_signal,
    ).length,
    unspecified_expression_count: published.filter(
      (item) => item.expression_category === "unspecified",
    ).length,
  },
  acceptance_rule:
    "A repeated expression is acceptable when multiple scene prompts genuinely require it. Regenerate only when expression contradicts scene meaning, appears copied from an identity reference, or collapses distinct concepts into the same camera-facing portrait.",
  items: uniqueByPreview,
};

const output = path.join(
  root,
  "docs/audits/identity-expression-policy-2026-09-24/expression-audit.json",
);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result.published_baseline, null, 2));
console.log(`Wrote ${path.relative(root, output)}`);
