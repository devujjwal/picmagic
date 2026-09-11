import fs from "node:fs";
import type { Prompt, Collection } from "../../types/content";

// Deliberate editorial reuse: do not publish a second photo URL for the same idea.
const reuse: Record<string, string> = {
  "promises-in-the-courtyard": "an-intimate-jaipur-yes",
  "the-roadside-pause": "the-open-road-portrait",
  "between-the-sets": "built-on-quiet-discipline",
  "your-next-introduction": "your-next-chapter-in-focus",
  "coral-against-the-sky": "meet-your-new-profile-picture",
  "diyas-on-the-veranda": "a-family-evening-lit-by-diyas",
  "colour-on-the-cheeks": "a-little-holi-happiness",
  "one-gentle-garba-turn": "garba-under-the-lights",
  "the-little-flute-keeper": "tiny-krishna-big-wonder",
  "skincare-on-stone": "your-product-beautifully-simple",
  "ceramic-and-linen": "small-details-beautifully-made",
};
const existing: Prompt[] = JSON.parse(fs.readFileSync("content/prompts.json", "utf8"));
let prompts: Prompt[] = JSON.parse(fs.readFileSync("content/expansion/prompts.json", "utf8"));
const collections: Collection[] = JSON.parse(fs.readFileSync("content/expansion/collections.json", "utf8"));
const queue = JSON.parse(fs.readFileSync("docs/audits/library-2026-09/generation-queue.json", "utf8"));
const report = [];
for (const [stem, sourceSlug] of Object.entries(reuse)) {
  const source = existing.find(p => p.slug === sourceSlug)!;
  if (!source) throw new Error(`Missing source: ${sourceSlug}`);
  const duplicate = prompts.find(p => p.slug === stem);
  if (duplicate) {
    for (const collection of collections) collection.prompt_ids = collection.prompt_ids.map(id => id === duplicate.id ? source.id : id);
    prompts = prompts.filter(p => p.id !== duplicate.id);
  }
  const reel = prompts.find(p => p.slug === `${stem}-reel`)!;
  // The reel adapts this established photo concept; identity rules and styling
  // come from the audited source, with a separate explicit timed motion block.
  reel.prompt_text = source.prompt_text
    .replace(/Create a photograph/g, "Create an eight-second reel")
    .replaceAll("4:5", "9:16") +
    "\n\nREEL TIMELINE (8 seconds total):\n" + reel.reel!.scenes.map(s =>
      `${s.start}–${s.end} seconds: ${s.start === 0 ? "Establish the exact styling, people, objects and setting described above. Keep the complete subject visible." : s.action}`
    ).join("\n") + "\nKeep the same identity, wardrobe, props and product design throughout; no added people, morphing, flicker or invented text.";
  reel.reel!.scenes[0].action = "Establish the exact styling, people, objects and setting described in the generation prompt. Keep the complete subject visible.";
  for (const key of ["preview_image_url", "thumbnail_url", "image_width", "image_height", "image_alt", "image_brief", "subject", "lighting", "framing", "camera", "persona_policy", "persona_version"] as const) {
    Object.assign(reel, { [key]: source[key] });
  }
  reel.description = `${source.description} This eight-second reel adds a deliberate movement and a quiet closing hold.`;
  const imageJob = queue.find((q: {id:string;type:string}) => q.id === stem && q.type === "image");
  if (imageJob) Object.assign(imageJob, { status: "reuse-reviewed-existing", source_slug: sourceSlug, target: `public${source.preview_image_url}`, prompt: source.image_brief });
  const videoJob = queue.find((q: {id:string;type:string}) => q.id === reel.slug && q.type === "video");
  if (videoJob) Object.assign(videoJob, { poster: `public${source.preview_image_url}`, prompt: `Create an eight-second video from the approved ${sourceSlug} poster. ${reel.reel!.scenes.slice(1).map(s => `${s.start}–${s.end}s: ${s.action}`).join(" ")} Preserve all people, clothing, accessories and product geometry exactly. No added text, morphing or audio.` });
  report.push({ collection_concept: stem, canonical_photo: sourceSlug, new_reel: reel.slug, reason: "Reuse the established photo concept and its canonical URL; the new reel adds medium-specific timing and motion." });
}
for (const collection of collections) {
  collection.featured_image = [...existing, ...prompts].find(p => p.id === collection.prompt_ids[0])!.preview_image_url;
}
fs.writeFileSync("content/expansion/prompts.json", JSON.stringify(prompts, null, 2) + "\n");
fs.writeFileSync("content/expansion/collections.json", JSON.stringify(collections, null, 2) + "\n");
fs.writeFileSync("docs/audits/library-2026-09/generation-queue.json", JSON.stringify(queue, null, 2) + "\n");
fs.writeFileSync("docs/audits/library-2026-09/content-reuse.json", JSON.stringify(report, null, 2) + "\n");
console.log(`${report.length} duplicate photo concepts reused; ${prompts.length} new prompts remain.`);
