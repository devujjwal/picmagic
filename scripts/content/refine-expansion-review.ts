/** Idempotent corrections from the manual scene/continuity review. Local files only. */
import fs from "node:fs";
import { createHash } from "node:crypto";
import type { Prompt } from "../../types/content";
import { productPersona } from "../../lib/prompts/persona";
const read = (path: string) => JSON.parse(fs.readFileSync(path, "utf8"));
const write = (path: string, value: unknown) =>
  fs.writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
const file = "content/expansion/prompts.json";
const prompts: Prompt[] = read(file);
const replacements: [string, string][] = [
  [
    "The person closes the notebook once and looks up towards the camera, hands and desk objects remain consistent",
    "The person rests one hand on the already-closed notebook and looks up towards the camera; hands and desk objects remain consistent",
  ],
  [
    "The person takes one book from a shelf, looks briefly at it, then glances towards the camera with a small smile",
    "The person looks down at the single closed book already in their hands, then glances towards the camera with a small smile; no additional book is taken",
  ],
  [
    "The partner gently places a hand beside the existing hand, they look at each other, settle without changing body shape",
    "With their hands already resting lightly together near the bump, the partners exchange a soft glance and settle without changing body shape or adding hands",
  ],
  [
    "with neckline framing that keeps every original stone, clasp and metal tone visible",
    "with a close crop appropriate to the supplied piece, showing its visible stones and original metal tone without inventing hidden clasps or surfaces",
  ],
];
function replaceStrings<T>(value: T): T {
  if (typeof value === "string")
    return replacements.reduce<string>(
      (s, [a, b]) => s.replaceAll(a, b),
      value,
    ) as T;
  if (Array.isArray(value)) return value.map(replaceStrings) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, replaceStrings(v)]),
    ) as T;
  return value;
}
const changed = [];
for (let i = 0; i < prompts.length; i++) {
  const before = JSON.stringify(prompts[i]);
  const p = (prompts[i] = replaceStrings(prompts[i]));
  if (!p.image_brief) throw new Error(`Missing preview brief: ${p.slug}`);
  p.tags = [...new Set(p.tags)];
  const nonhuman = ["product", "animal"].includes(p.persona_policy || "");
  const detail =
    p.slug.startsWith("footwear-on-the-move") ||
    p.slug.startsWith("jewellery-honestly-close");
  if (nonhuman || detail) {
    p.prompt_text = p.prompt_text.replaceAll(
      "Keep faces, defining clothing and major accessories within the frame; use a deliberate central crop for a vertical preview.",
      detail
        ? "Frame only the body area needed to show the actual advertised item clearly; a detail crop does not need to include the face or hands. Keep the complete item within the vertical frame."
        : "Keep the defining subject and material details within the frame; use a deliberate vertical composition. Do not add people or human body parts.",
    );
    p.prompt_text = p.prompt_text.replaceAll(
      "Express warmth or focus appropriate to the activity; use natural hands and relaxed joints.",
      p.persona_policy === "animal"
        ? "Keep the animal comfortable with natural paws, limbs and posture."
        : detail
          ? "Keep any visible limbs natural and avoid anatomical distortion."
          : "Keep object geometry and contact shadows physically plausible.",
    );
    p.image_brief = p.image_brief.replaceAll(
      "complete essential props and hands in frame",
      "the complete advertised item in frame, with only the relevant body area visible",
    );
  }
  if (p.persona_policy === "product") {
    const human =
      "Use comfortable, natural body positioning. Preserve actual body shape and facial asymmetry; do not beautify by changing identity.";
    const product =
      "Retain the supplied object’s proportions, surface finish, construction and branding. Supporting props must not hide or redesign the product.";
    p.prompt_text = p.prompt_text.replaceAll(human, product);
    p.image_brief = p.image_brief.replaceAll(human, product);
    p.faqs = replaceStrings(
      p.faqs.map((f) => ({
        ...f,
        answer: f.answer.replaceAll(human, product),
      })),
    );
  }
  if (p.slug.startsWith("together-on-the-doorstep")) {
    p.subject = "Person with pet";
    p.prompt_text = p.prompt_text.replace(
      "Indian/South Asian group matching the scene's family or team roles",
      "Indian/South Asian adult with one Indian Indie dog",
    );
    p.image_brief = p.image_brief.replace(
      "A fictional Indian/South Asian group matching the family/team roles in the scene, distinct faces, realistic age and complexion diversity; include only the people needed for this scene.",
      "Exactly one fictional Indian adult, about 45, with medium-brown skin and short natural greying hair, seated beside one tan-and-white Indian Indie dog. No other people or animals.",
    );
  }
  if (
    /^(the-roadside-pause|garage-hours|city-chrome-after-rain|the-weekend-map-stop)(-reel)?$/.test(
      p.slug,
    )
  ) {
    p.persona_policy = "person-and-product";
    if (!p.prompt_text.includes(productPersona))
      p.prompt_text = p.prompt_text.replace(
        "CREATIVE DIRECTION:",
        productPersona + "\n\nCREATIVE DIRECTION:",
      );
    p.prompt_text = p.prompt_text.replace(
      "classic motorcycle with round headlamp and one helmet on the seat",
      "the supplied motorcycle with its original headlamp, bodywork, trim and one helmet on the seat (classic round-headlamp bike only when no vehicle reference is supplied)",
    );
  }
  if (JSON.stringify(p) !== before)
    changed.push({
      slug: p.slug,
      reviewed_sha256: createHash("sha256").update(p.prompt_text).digest("hex"),
    });
}
write(file, prompts);
write(
  "content/expansion/concepts.json",
  replaceStrings(read("content/expansion/concepts.json")),
);
write(
  "docs/audits/library-2026-09/generation-queue.json",
  replaceStrings(read("docs/audits/library-2026-09/generation-queue.json")),
);
write("docs/audits/library-2026-09/expansion-continuity-corrections.json", {
  scope:
    "Manual review of new concept scene and movement instructions, with the following corrections applied. This is not a visual asset acceptance record.",
  corrections: [
    "Notebook and held-book movements start from the established poster state",
    "Maternity couple keeps already-positioned hands instead of adding another hand",
    "Detail crops do not demand a face, all clasps or hands outside the composition",
    "Nonhuman subjects have no human posing or facial-texture instructions",
    "Owner/pet fallback specifies one person and one dog",
    "Motorcycle reference fidelity is separate from rider identity",
    "Duplicate tags removed",
  ],
  records: changed,
});
console.log(`${changed.length} new records refined locally.`);
