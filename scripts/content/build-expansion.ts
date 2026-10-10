import fs from "node:fs";

if (fs.existsSync("content/expansion/prompts.json")) {
  throw new Error("Expansion already exists. Edit its reviewed content directly; rebuilding would discard editorial and asset work.");
}
import { createHash } from "node:crypto";
import {
  personaPreamble,
  AUTHORING_PERSONA_POLICY_VERSION as PERSONA_POLICY_VERSION,
  type PersonaPolicy,
} from "../../lib/prompts/persona";
import { promptSchema, collectionSchema } from "../../types/content";
type Theme = {
  slug: string;
  title: string;
  subject: string;
  category: string;
  description: string;
  commercial?: boolean;
  reelOnly?: boolean;
  concepts: string[][];
};
const themes: Theme[] = JSON.parse(
  fs.readFileSync("content/expansion/concepts.json", "utf8"),
);
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const uuid = (s: string) => {
  const h = createHash("sha256")
    .update(`picmagic:expansion:2026-09:${s}`)
    .digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
const now = "2026-09-10T14:00:00.000Z";
const newPrompts = [];
const newCollections = [];
const queue = [];
const subjectOverrides: Record<string, string> = {
  "Two hands, one new beginning": "Couple",
  "Diyas on the veranda": "Family",
  "The little flute keeper": "Kid",
  "The weekend map stop": "Couple",
  "Ideas around the table": "Family",
  "Together on the doorstep": "Family",
};
const objects: Record<string, string> = {
  "First light on the bonnet":
    "a fictional graphite-grey compact hatchback with five-spoke wheels and no branding",
  "Inside the drive":
    "the empty cabin of a fictional charcoal-grey compact car, fabric seats, simple analog dashboard with no readable logos",
  "Rain on the paint":
    "a fictional deep-red sedan bonnet and silver multi-spoke front wheel",
  "Weekend estate":
    "a fictional dark-green station wagon with silver trim and no brand badges",
  "Skincare on stone":
    "one amber-glass skincare bottle, short black screw cap and plain cream label",
  "Ceramic and linen":
    "one handmade terracotta cup with cream glaze and one curved handle",
  "Packaging with purpose":
    "one sage-green soap bar beside a matching simple cardboard sleeve without lettering",
  "A useful everyday scale":
    "one tan leather handbag with two short handles, brass hardware and an adjustable strap",
  "The honest quarter rotation":
    "one matte cream cylindrical skincare carton with a muted green band and no lettering",
  "Fabric, up close":
    "one folded indigo cotton shirt with fine white woven stripes and visible blue stitching",
  "Front, back, the real product":
    "one chestnut leather shoulder bag with a single front flap, plain back panel and brass strap anchors",
  "From detail to daily use":
    "one blue stainless-steel reusable bottle with a detachable screw cap, no branding",
};
const garments: Record<string, string> = {
  "The saree drape catalogue":
    "an ivory cotton-silk saree with a narrow forest-green woven border, matching green blouse, no additional jewellery",
  "Kurta, seam to silhouette":
    "a rust cotton kurta with small cream block-printed flowers, three-quarter sleeves, a round notched neckline and side slits",
  "A dress that moves naturally":
    "an opaque sage linen midi dress with short sleeves, fabric waist tie and subtle side pockets",
  "Jewellery, honestly close":
    "a small pair of gold-toned leaf earrings with one clear stone in each leaf",
  "The everyday shirt catalogue":
    "a sky-blue cotton shirt with thin navy vertical stripes, white buttons and long sleeves",
  "The festive kurta edit":
    "a cream cotton men's kurta with restrained tonal collar embroidery, straight hem and matching trousers",
  "A jacket from every angle":
    "a dark-olive cotton jacket with two plain front pockets, brass zipper and an unadorned back panel",
  "Footwear on the move":
    "a pair of tan leather lace-up shoes with brown soles, five pairs of eyelets and visible tonal stitching",
};
const personas = [
  "a fictional Indian adult with medium-brown skin, short naturally wavy dark hair and ordinary proportions",
  "a fictional South Asian adult with deep-brown skin, shoulder-length loose curls and ordinary proportions",
  "a fictional Indian adult with warm-brown skin, straight dark hair and ordinary proportions",
  "a fictional South Asian adult with light-brown skin and naturally greying hair, visible age lines and ordinary proportions",
];
for (const [ti, theme] of themes.entries()) {
  const photoIds: string[] = [],
    reelIds: string[] = [];
  for (const [ci, [title, scene, light, motion]] of theme.concepts.entries()) {
    const stem = slugify(title),
      subject = subjectOverrides[title] || theme.subject;
    const policy: PersonaPolicy = theme.commercial
      ? "person-and-product"
      : subject === "Product"
        ? "product"
        : subject === "Pet"
          ? "animal"
          : "person";
    const isBaby = theme.slug === "babies",
      isChild = subject === "Kid";
    const fallback = isBaby
      ? "caregiver and infant, with any additional family members specified in the scene"
      : isChild
        ? "child"
        : subject === "Couple"
          ? "adult couple"
          : subject === "Family"
            ? "group matching the scene's family or team roles"
            : `adult ${subject.toLowerCase()}`;
    const safeguard = isBaby
      ? "Keep the baby's original developmental stage, with the head and neck securely supported. No unsupported posing, unstable surfaces, loose objects around the face or invented teeth."
      : theme.slug === "maternity"
        ? "Retain the expectant person's actual pregnancy stage and body shape. Do not enlarge the bump or reshape the waist. Use comfortable supported positions."
        : theme.slug === "bikes" || theme.slug === "cars"
          ? "Keep the vehicle parked and stable. Preserve the supplied make/model geometry, wheels, paint, badges and trim; no riding or driving action."
          : isChild
            ? "Keep the child at their reference age, with natural child proportions and no adult makeup. For the Krishna theme, adapting hair into loose curls is intentional; preserve hairline and recognizable identity, with the tilak unobscured."
            : theme.commercial
              ? "Product design takes priority over dramatic styling. Preserve colour, print scale, fabric opacity, seams, garment length, closures, logos and every supplied accessory. Match clothes to the original body rather than reshaping the model."
              : subject === "Pet"
                ? "Preserve fur markings and natural limb and paw anatomy. No stressful handling, invented accessories or unnatural poses."
                : "Use comfortable, natural body positioning. Preserve actual body shape and facial asymmetry; do not beautify by changing identity.";
    const example = objects[title]
      ? `Without a product reference, the fictional example is ${objects[title]}.`
      : garments[title]
        ? `Without a product reference, the fictional garment/accessory example is ${garments[title]}.`
        : "";
    const previewPersona = objects[title]
      ? `No people. Use ${objects[title]}.`
      : subject === "Pet"
        ? "Use a fictional pet matching the scene: an Indian domestic mixed-breed cat or an Indian Indie dog as appropriate, natural markings and anatomy."
        : isChild
          ? "One fictional Indian child about five years old, with a distinct natural face, warm-brown complexion and soft hair; keep childlike proportions."
          : isBaby
            ? "A fictional Indian family with a newborn infant and securely supporting caregivers in their thirties; diverse natural brown complexions and distinct faces, no repeating faces from other previews."
            : subject === "Couple"
              ? `Two fictional Indian/South Asian adults in their ${ci === 3 ? "forties" : "thirties"}, distinct faces, varied natural brown complexions and different hairstyles, ordinary proportions.`
              : subject === "Family"
                ? "A fictional Indian/South Asian group matching the family/team roles in the scene, distinct faces, realistic age and complexion diversity; include only the people needed for this scene."
                : `${personas[(ti + ci) % 4]}. Match ${subject.toLowerCase()} presentation to the concept, with no stereotyped uniform face.`;
    const brief = `Generate one original photographic preview, 4:5 portrait, ideally 1200 × 1500. ${previewPersona} Scene: ${scene.replaceAll("reference ", "").replaceAll("supplied ", "")}. ${garments[title] ? `The exact advertised item is ${garments[title]}.` : ""} Lighting and framing: ${light}. ${safeguard} Photographic realism, natural pores and material texture, believable shadows, complete essential props and hands in frame. Do not reuse the previous image's face, pose, grading or outfit. No collage, text overlay, watermark or external brand assets. This brief creates PicMagic's fictional preview persona only; it is separate from the user's copyable prompt.`;
    queue.push({
      id: stem,
      type: "image",
      workflow: "ChatGPT UI only — never Codex imagegen",
      status: "awaiting_generation",
      dimensions: [1200, 1500],
      aspect_ratio: "4:5",
      prompt: brief,
      target: `public/previews/${stem}.webp`,
      reel_poster_target: `public/previews/${stem}-reel.webp`,
    });
    for (const type of (theme.reelOnly ? ["reel"] : ["photo", "reel"]) as (
      "photo" | "reel"
    )[]) {
      const reel = type === "reel",
        slug = stem + (reel ? "-reel" : ""),
        id = uuid(slug);
      const scenes = [
        {
          start: 0,
          end: 2,
          action: `Establish the complete scene: ${scene}. Keep the subject clearly visible before movement begins.`,
          transition: "Continuous shot",
        },
        {
          start: 2,
          end: 6,
          action: motion + ".",
          transition: "Return gently to the starting composition",
        },
        {
          start: 6,
          end: 8,
          action:
            "Settle into the starting composition and hold through second 8, with natural breathing or ambient motion only. The final hold is included in the eight-second duration.",
          transition: "Loop-compatible hold",
        },
      ];
      const text =
        personaPreamble(policy, fallback) +
        `\n\n${reel ? "Create an 8-second vertical 9:16 reel" : "Create a 4:5 editorial photograph"}. Scene: ${scene}.\n\nLighting and composition: ${light}. Keep faces, defining clothing and major accessories within the frame; use a deliberate central crop for a vertical preview. ${example}\n\nStyling and identity: ${safeguard} ${theme.slug === "pets" && subject !== "Pet" ? "Preserve the reference animal's markings, size and appearance as well as the person's identity." : ""}\n\n${reel ? scenes.map((s) => `${s.start}–${s.end} seconds: ${s.action} Transition: ${s.transition}.`).join("\n") + "\n\nContinuity: keep the same people, product design, wardrobe, hairstyle and props across all shots; a chosen initial hairstyle adaptation stays consistent thereafter. No morphing, flashing, duplicated hands, changing logos or invented product claims." : "Pose and expression: choose the resting moment at the start of this action, not a collage of positions: " + motion + ". Express warmth or focus appropriate to the activity; use natural hands and relaxed joints."}\n\nRetain realistic texture, plausible contact shadows and clear subject separation. No added text or watermarks. Suggested camera directions describe a look, not guaranteed tool controls.`;
      const imageStem = stem + (reel ? "-reel" : "");
      const p = promptSchema.parse({
        id,
        slug,
        title: title + (reel ? " — reel" : ""),
        description: `${title}. ${scene[0].toUpperCase() + scene.slice(1)}. ${reel ? "An eight-second visual story with timed movement and a quiet closing hold." : "A distinct composition with practical lighting, framing and reference-preservation guidance."}`,
        prompt_text: text,
        category_id: reel
          ? "reels"
          : subject === "Kid"
            ? "kids"
            : subject === "Couple"
              ? "couple"
              : subject === "Family" && theme.slug !== "pets"
                ? "family"
                : theme.category,
        prompt_type: type,
        subject,
        style: [
          theme.title.split(",")[0],
          reel ? "Reel" : "Editorial",
          theme.commercial ? "E-commerce" : "Natural",
        ],
        occasion: theme.slug.replaceAll("-", " "),
        aspect_ratio: reel ? "9:16" : "4:5",
        preview_image_url: `/previews/${imageStem}.webp`,
        thumbnail_url: `/previews/${imageStem}-thumb.webp`,
        image_width: reel ? 675 : 960,
        image_height: 1200,
        image_alt: `${scene[0].toUpperCase() + scene.slice(1)} — AI-generated ${reel ? "reel poster" : "photo example"}`,
        lighting: light.split(";")[0],
        framing: light.split(";")[1]?.trim() || "Environmental portrait",
        camera: light.split(";")[1]?.trim() || "Natural lens perspective",
        suggested_tools: [
          "ChatGPT",
          ...(reel ? ["Image-to-video tool supporting references"] : []),
        ],
        tags: [
          theme.slug,
          ...slug.split("-").filter((w) => w.length > 3),
          reel ? "reel" : "photo",
          ...(theme.commercial ? ["product fidelity", "catalogue"] : []),
        ],
        is_featured: false,
        is_trending: false,
        trending_rank: 100 + newPrompts.length,
        is_published: false,
        is_indexable: false,
        seo_title: `${title}${reel ? " Reel" : " Photo"} Prompt`,
        seo_description:
          `${title}: ${reel ? "timed reel concept" : "photo idea"} with ${light.split(";")[0]}, reference-first identity and practical styling directions.`.slice(
            0,
            160,
          ),
        created_at: now,
        updated_at: now,
        published_at: null,
        faqs: [
          {
            question: "How should I use a reference photo?",
            answer:
              policy === "product"
                ? "Supply clear product views. The reference determines its actual shape, colour, material and branding; the example object is used only without a reference."
                : policy === "animal"
                  ? "Use a clear photograph of your pet. Keep its markings and proportions; the preview animal is only a pose and lighting example."
                  : "Label each identity reference clearly. The supplied people determine face, age, ethnicity, skin tone and body proportions. Without references, the prompt defaults to fictional Indian/South Asian subjects; a style category does not change ethnicity.",
          },
          {
            question: "Which details matter most for this concept?",
            answer:
              safeguard +
              " " +
              (example ||
                "Keep the setting, clothing and major props shown in the scene distinct and unobscured."),
          },
          {
            question: "What if the tool leaves out a detail?",
            answer:
              "Ask for a focused revision of the missing feature while keeping the rest of the image or clip unchanged. Compare identity, hands, important accessories and product details to the references; results vary by tool.",
          },
        ],
        reel: reel
          ? {
              duration: 8,
              concept: title,
              scenes,
              caption: `${title}. Make the moment your own.`,
              hashtags: [
                "#PicMagic",
                `#${theme.slug.replaceAll("-", "")}`,
                "#CreativeReel",
              ],
              music_mood:
                "Gentle instrumental pulse; preview communicates without audio. Use music you have rights to publish.",
            }
          : null,
        image_brief: brief,
        persona_policy: policy,
        persona_version: PERSONA_POLICY_VERSION,
        preview_video: null,
      });
      newPrompts.push(p);
      (reel ? reelIds : photoIds).push(id);
      if (reel)
        queue.push({
          id: slug,
          type: "video",
          status: "external_generation_required",
          workflow:
            "Real image-to-video generation; no pan/zoom still substituted",
          duration: 8,
          dimensions: [720, 1280],
          format:
            "MP4 H.264, no audio, yuv420p, faststart, target under 1.5 MB",
          prompt: `Create an 8-second 9:16 video from the approved ${stem} still as first frame. ${motion}. Use 0–2s to establish, 2–6s for the specified action, 6–8s to settle into the initial composition for a gentle loop. ${safeguard} No audio, added words, face changes, product drift, extra limbs, flicker or artificial zoom-only motion. Preserve approved preview identity and all major details.`,
          poster: `public/previews/${slug}.webp`,
          target: `public/videos/${slug}.mp4`,
        });
    }
  }
  for (const [suffix, ids] of [
    ["", photoIds],
    ["-reels", reelIds],
  ] as const) {
    if (!ids.length) continue;
    const reel = suffix !== "";
    newCollections.push(
      collectionSchema.parse({
        id: theme.slug + suffix,
        slug: theme.slug + suffix,
        name: theme.title + (reel ? " — reel ideas" : ""),
        description:
          theme.description +
          (reel
            ? " Each reel includes timed scenes, camera movement and continuity directions for an eight-second preview."
            : ""),
        kind: "subcategory",
        prompt_ids: ids,
        is_indexable: false,
        active: false,
        start_date: null,
        end_date: null,
        priority: 20,
        featured_image: newPrompts.find((p) => p.id === ids[0])!
          .preview_image_url,
        seo_title: `${theme.slug.replaceAll("-", " ")} ${reel ? "Reel" : "Photo"} Ideas`,
        seo_description: theme.description.slice(0, 157) + "…",
      }),
    );
  }
}
fs.writeFileSync(
  "content/expansion/prompts.json",
  JSON.stringify(newPrompts, null, 2) + "\n",
);
fs.writeFileSync(
  "content/expansion/collections.json",
  JSON.stringify(newCollections, null, 2) + "\n",
);
fs.writeFileSync(
  "docs/audits/library-2026-09/generation-queue.json",
  JSON.stringify(queue, null, 2) + "\n",
);
console.log(
  `${newPrompts.length} complete draft prompts, ${newCollections.length} collections, ${queue.filter((q) => q.type === "image").length} image briefs and ${queue.filter((q) => q.type === "video").length} video briefs. Assets must be reviewed before publication.`,
);
