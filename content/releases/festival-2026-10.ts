/** Staged release input, deliberately NOT imported by content/catalog.ts.
 * Materialized release records are reviewed separately; this retains authoring inputs.
 */
import { allPrompts, allCollections } from "../catalog";
import { promptSchema, type Prompt } from "../../types/content";
import {
  personaPreamble,
  AUTHORING_PERSONA_POLICY_VERSION,
} from "../../lib/prompts/persona";
import { posterDesigns } from "../../features/poster-maker/designs";

export const refreshSlugs = [
  "kurta-at-the-lantern-courtyard",
  "midnight-fuel-stop",
  "floral-shadows-a-clear-face",
  "founder-after-hours",
  "monsoon-love-story",
  "desert-moonlight-promises",
] as const;
const timestamp = "2026-10-10T13:00:00.000Z";
const quality =
  "Keep natural skin texture, distinct facial identities, plausible hands and anatomy, grounded feet, and coherent lighting. Keep faces and essential props within the central safe area for mobile cropping. No beauty filtering, skin whitening, invented branding, lettering or watermark. Preserve actual reference ages; never change age to fit a look. Ask for suitable references if the supplied people do not match the intended adult solo or adult couple composition.";
const garmentScene =
  "Create one full-body photograph of the person in an ivory cotton festive kurta with a simple band collar, standing at a heritage courtyard with warm lanterns receding into the background. Use a relaxed half-turn, hands loosely held at waist height, and a composed expression. Neutral soft light reveals fabric texture while the background stays warmly lit. Show the kurta hem and footwear completely, with breathing room around the body. If an additional garment reference is supplied, use only its visible supported details instead of inventing embroidery, collars or a stole. Without a garment reference the kurta is fictional, not an exact product reproduction. 70mm fashion photograph, 4:5 portrait.";
const bikeScene =
  "Create one environmental photograph of the person resting beside a stationary unbranded classic-style motorcycle at a quiet small petrol station after midnight. Place the person and bike in the parking area away from the pumps, engine off, no refuelling, smoking or fire. A helmet rests securely on the seat. Green-white canopy lights reveal light mist against a dark blue night and a closed kiosk, with no readable signs. Keep the person's face unobscured, expression calmly contemplative, footwear grounded and the motorcycle mechanically plausible. If a separate motorcycle reference is supplied, preserve its supported visible details; otherwise the bike is fictional and must not imply exact make or model fidelity. 35mm full-body environmental portrait, 4:5.";
const refreshed = refreshSlugs.map((slug) => {
  const raw = allPrompts.find((p) => p.slug === slug);
  if (!raw) throw Error(`Missing approved refresh target: ${slug}`);
  const p = promptSchema.parse(raw);
  const couple = p.category_id === "couple";
  const scene =
    slug === refreshSlugs[0]
      ? garmentScene
      : slug === refreshSlugs[1]
        ? bikeScene
        : p.prompt_text.split("CREATIVE DIRECTION:").at(-1)!.trim();
  const description =
    slug === refreshSlugs[0]
      ? "A lantern-lit heritage courtyard portrait with an ivory kurta, hands held at waist height and full-length framing. A separate garment reference is optional; without one, the outfit is fictional rather than a verified product photograph."
      : slug === refreshSlugs[1]
        ? "A moody portrait beside a parked motorcycle under a petrol-station canopy. An optional bike reference can guide visible details; without one, the unbranded motorcycle is fictional, not a verified make or model."
        : p.description;
  return promptSchema.parse({
    ...p,
    description,
    prompt_text: `${personaPreamble("person", couple ? "adult couple" : p.category_id === "women" ? "adult woman" : "adult man")}\n\n${scene}\n\n${quality}`,
    persona_policy: "person",
    persona_version: AUTHORING_PERSONA_POLICY_VERSION,
    image_brief: `EDITORIAL PREVIEW ONLY: Select one approved adult ${couple ? "couple" : p.category_id} reference using the private non-repeating rotation. Preserve actual age, face and distinguishing features; no de-aging. Keep this selection through revisions. ${scene} ${quality}`,
    preview_image_url: `/previews/${slug}-festival-refresh.webp`,
    thumbnail_url: `/previews/${slug}-festival-refresh-thumb.webp`,
    image_alt: `${p.title}: ${description}`,
    image_width: 1080,
    image_height: 1350,
    updated_at: timestamp,
    published_at: null,
    is_published: false,
    is_indexable: false,
    preview_review_status: "generation-required",
    editorial_review_version: null,
    faqs: [
      {
        question: "Which reference should I upload?",
        answer: couple
          ? "Use one clear photo of the intended adult couple, or clearly label separate references for both people. Preserve both distinct identities and actual ages. Exclude background bystanders; never substitute the example couple's faces."
          : "Use a clear authorized portrait of the intended adult with the face visible. Preserve their actual age and distinguishing features. The example supplies composition and styling, not identity.",
      },
      {
        question: "What can I customize?",
        answer: `Change outfit colours, setting details and expression while retaining the scene's main composition. ${slug === refreshSlugs[0] ? "For exact garment details, supply a separate clear garment photograph and verify every visible feature." : slug === refreshSlugs[1] ? "For a specific motorcycle, add a clear bike photograph; invisible parts cannot be verified." : "Keep essential props and lighting from the prompt, and preserve the intended people count."}`,
      },
      {
        question: "What should I check before sharing?",
        answer:
          "Compare each face and actual age to your references, then review hands, crop, clothing, lighting and the main scene details. AI results vary. Ask for a focused revision using the same references; do not treat generated scenes as evidence of a real event or endorsement.",
      },
    ],
  });
});

type Concept = {
  id: string;
  slug: string;
  title: string;
  category: "men" | "women" | "couple" | "festival";
  subject: string;
  description: string;
  scene: string;
  alt: string;
  lighting: string;
  framing: string;
  why: string;
  collections: string[];
  decorative?: boolean;
};
const concepts: Concept[] = [
  {
    id: "70731da7-b45d-44db-a462-7c360c811004",
    slug: "durga-puja-pandal-portrait",
    title: "Durga Puja Pandal Portrait",
    category: "women",
    subject: "Woman",
    description:
      "A composed portrait beneath a decorative Durga Puja pandal entrance, with shola-inspired craftwork, alpana floor patterns and warm festive light. Architectural details frame an unobscured face without assigning religious marks or marital status.",
    scene:
      "Create a respectful adult solo portrait at a fictional Durga Puja pandal entrance. Frame the person beneath layered cream shola-inspired decorative arches and red textile accents, with an alpana pattern visible on the ground. Use an ivory saree with a restrained red border or a user-chosen festive outfit, a gently arranged hairstyle and a calm expression looking slightly past the camera. Do not automatically add sindoor, religious marks or marital symbols. Keep the setting architectural, not a deity impersonation or a claim of access to a named pandal. No idol needs to appear. Warm evening light and soft neutral face fill, 50mm three-quarter portrait, 4:5. The arch surrounds rather than cuts through the head; hands relaxed and visible.",
    alt: "A woman beneath cream decorative pandal arches and red fabric, with warm light and an alpana floor pattern.",
    lighting: "Warm evening practicals and soft neutral face fill",
    framing: "50mm three-quarter portrait within decorative arches",
    why: "Combines elaborate layered pandal architecture with controlled portrait lighting without requiring a crowded on-location shoot.",
    collections: ["indian-festivals"],
  },
  {
    id: "70731da7-b45d-44db-a462-7c360c811005",
    slug: "navratri-dandiya-portrait",
    title: "Navratri Dandiya Portrait",
    category: "men",
    subject: "Man",
    description:
      "A poised full-length dandiya portrait with two visible wooden sticks, a saffron kurta and an indigo waistcoat. The subject pauses between steps against festive lights; this is not a spinning Garba skirt composition.",
    scene:
      "Create an adult solo Navratri dandiya portrait during a pause between dance steps. Dress the person in a saffron kurta, indigo embroidered waistcoat and simple trousers. Hold exactly two slim decorated wooden dandiya sticks, one in each hand, angled outward below shoulder level and clear of the face. Keep fingers wrapped naturally around each stick, feet on a flat courtyard floor, shoulders relaxed and expression quietly joyful. Use a layered canopy of warm festive lights and distant abstract silhouettes without recognizable additional faces. No spinning skirt, circular light trails, weapon-like pose, raised sticks near eyes or excessive motion blur. 50mm full-body photograph with every stick tip and both feet inside the 4:5 frame.",
    alt: "A man in a saffron kurta and indigo waistcoat holding two dandiya sticks beneath festive courtyard lights.",
    lighting: "Warm courtyard lights with balanced face fill",
    framing: "50mm full-body still pose with both sticks visible",
    why: "Builds a carefully staged festive dance setting while keeping hands, stick geometry and the reference face readable.",
    collections: ["indian-festivals"],
  },
  {
    id: "70731da7-b45d-44db-a462-7c360c811006",
    slug: "diwali-courtyard-celebration",
    title: "Diwali Courtyard Celebration",
    category: "couple",
    subject: "Couple",
    description:
      "An adult couple stands together at the centre of an open Diwali courtyard, with a sweeping rangoli and rows of diyas around a clear walkway. A wide architectural composition, distinct from the seated family-and-flower-tray scene.",
    scene:
      "Create a festive photograph of exactly the two intended adults from the supplied couple reference, standing together beneath a broad courtyard arch at blue hour. Style coordinated deep teal and warm ivory festive outfits without changing their actual ages or body proportions. They hold nearest hands loosely at waist height and exchange a natural relaxed glance; keep both faces readable in three-quarter view. A sweeping rangoli and rows of small diyas frame a clear walkway; place flames safely away from fabric and hands. Use no child, extra relative, flower-tray gesture, seated family arrangement or fireworks. Keep architecture spacious, the pair central and both feet visible. Warm diyas balanced by neutral soft face fill against a blue evening sky, 35mm full-body two-shot, 4:5.",
    alt: "An adult couple in teal and ivory stands beneath a courtyard arch framed by rangoli and safely spaced diyas.",
    lighting: "Blue-hour ambience, warm diyas and neutral face fill",
    framing: "35mm full-body two-shot within a broad courtyard arch",
    why: "Combines large-scale rangoli, architectural depth and layered festive lighting with a readable two-person portrait.",
    collections: ["indian-festivals", "diwali"],
  },
  ...posterDesigns.map((d) => ({
    id: d.templateId,
    slug: d.slug,
    title: `${d.id === "durga-puja" ? "Durga Puja" : d.id === "diwali" ? "Diwali" : "Dussehra"} Business Greeting`,
    category: "festival" as const,
    subject: "Decorative artwork",
    decorative: true,
    description: `Create decorative ${d.id.replaceAll("-", " ")} artwork with a calm centre for editable English or Hindi wishes and your own branding. No recognizable people or implied endorsements. Add accurate text and logos in the free browser poster editor after generation.`,
    scene:
      d.id === "diwali"
        ? "Create a luxurious handcrafted paper-cut Diwali illustration, portrait 4:5. Rich midnight indigo background, layered warm gold and terracotta diyas with an intricate rangoli concentrated in the lower quarter; restrained hanging marigold strings at the upper outer corners. Dimensional paper texture and warm pools of light. Keep the central 60 percent dark, calm and uncluttered for separately added editable greetings and branding."
        : d.id === "durga-puja"
          ? "Create an elegant decorative Durga Puja greeting background, portrait 4:5. Deep crimson paper texture, layered cream shola-inspired arch motifs around the outer edges, a restrained white alpana pattern at the lower edge and small marigold accents. Subtle handcrafted relief and soft warm side lighting. Keep the central 60 percent calm and uncluttered for separately added editable greetings and branding. Use decorative architectural craft motifs, no deity face or likeness, no invented religious inscription."
          : "Create a refined Dussehra greeting background, portrait 4:5. Deep forest-green textured paper, a stylized gold ceremonial bow and a separate decorative arrow arranged along the outer lower corners, marigold accents and a gentle amber sunrise glow at the lower edge. Dimensional paper-cut illustration with no battle, burning effigy or human figures. Keep the central 60 percent calm and uncluttered for separately added editable greetings and branding. Treat the bow and arrow as decorative festive symbols, not a depiction of violence.",
    alt:
      d.id === "diwali"
        ? "Gold and terracotta diyas and rangoli on an indigo decorative background with empty central space."
        : d.id === "durga-puja"
          ? "Cream shola-inspired arches and white alpana motifs on a crimson decorative background."
          : "Decorative gold bow and arrow motifs with marigold accents on a forest-green background.",
    lighting: "Soft dimensional paper-cut lighting",
    framing: "4:5 decorative border composition with a clear central text area",
    why: "Creates layered original festive artwork while the browser editor preserves actual logo artwork and renders editable lettering deterministically.",
    collections:
      d.id === "diwali" ? ["diwali", "indian-festivals"] : ["indian-festivals"],
  })),
];
const additions = concepts.map((c) => {
  const base = refreshed[0];
  const decorative = Boolean(c.decorative);
  const scene = decorative
    ? `Generate one high-definition festival poster background at the highest available included resolution. ${c.scene} No people, faces, text, letters, numbers, logos or watermark. Generate the decorative artwork only. Add your own greeting, company or personal name, message, website, email, phone and other optional details later in the PicMagic poster editor. Upload your original logo or optional photo there; never regenerate supplied logos or lettering with AI. Leave generous central space for this editable information.`
    : `${c.scene} ${quality}`;
  return promptSchema.parse({
    ...base,
    id: c.id,
    slug: c.slug,
    title: c.title,
    category_id: c.category,
    subject: c.subject,
    description: c.description,
    prompt_text: `${personaPreamble(decorative ? "product" : "person", c.subject === "Couple" ? "adult couple" : `adult ${c.subject.toLowerCase()}`)}\n\n${scene}`,
    persona_policy: decorative ? "product" : "person",
    style: [decorative ? "Paper-cut illustration" : "Festival portrait"],
    occasion: c.title,
    tags: ["festival", c.slug, decorative ? "business-greeting" : "portrait"],
    image_brief: decorative
      ? `EDITORIAL ARTWORK ONLY: Original decorative illustration; no identity reference or brand upload. ${scene}`
      : `EDITORIAL PREVIEW ONLY: Use the approved adult ${c.category} pool and keep the same selected reference through revisions. Preserve all actual ages and identities. ${scene}`,
    preview_image_url: `/previews/${c.slug}-festival-preview.webp`,
    thumbnail_url: `/previews/${c.slug}-festival-preview-thumb.webp`,
    image_alt: c.alt,
    lighting: c.lighting,
    framing: c.framing,
    camera: decorative ? "Illustration; no physical camera" : c.framing,
    seo_title: `${c.title} AI Prompt | PicMagic`,
    seo_description: c.description.slice(0, 155),
    why_ai: c.why,
    distinctiveness_score: 4,
    created_at: timestamp,
    updated_at: timestamp,
    faqs: [
      {
        question: "Do I need a reference photo?",
        answer: decorative
          ? "No reference is needed for the decorative artwork. Do not send your logo to an image generator: upload the original logo directly into the browser editor. A personal photo is optional and placed or cropped, not face-swapped."
          : c.category === "couple"
            ? "Use a clear authorized photo of the intended adult couple. Preserve both faces, actual ages and distinguishing features; exclude background bystanders. Without references the people are fictional."
            : "Use a clear authorized adult portrait for a recognizable result. Preserve actual age, complexion, facial features and hairline. Without a reference the subject is fictional; never copy the preview model's identity.",
      },
      {
        question: "How can I personalize the result?",
        answer: decorative
          ? "Open the festival poster maker, choose English or Hindi, edit the greeting, company/name, short message and optional website, email, phone or other details, then upload an optional original logo or photo. Blank fields stay hidden. Include only information you want people to see when you share the exported poster. Choose a colour and layout and export a square, portrait or story PNG."
          : "Adjust outfit colours, expression and modest setting details while keeping the named festival and its essential props coherent. Do not add religious marks or marital symbols unless you specifically want them. Review cultural details before sharing.",
      },
      {
        question: "What are the limitations?",
        answer: decorative
          ? "AI artwork can contain imperfect motifs; review it before use. The editor does not generate faces, remove photo backgrounds, rewrite logos or publish socially. Check spelling, Hindi shaping, contrast and cropping. Uploads and text stay in browser memory and are lost on refresh."
          : "Generated scenes are not evidence of attending an actual festival. Compare likeness, age cues, hands, clothing, cultural details and mobile crop with your references. Lighting and faces may need a revision; results vary by generator.",
      },
    ],
  });
});
export const festivalReleaseDrafts: Prompt[] = [...refreshed, ...additions];
export const festivalReleaseMemberships = Object.fromEntries(
  festivalReleaseDrafts.map((p) => [
    p.id,
    concepts.find((c) => c.id === p.id)?.collections ??
      allCollections
        .filter((c) => c.prompt_ids.includes(p.id))
        .map((c) => c.id),
  ]),
);
