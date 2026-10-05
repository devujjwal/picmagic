import { z } from "zod";
import { personaPreamble, productPersona } from "@/lib/prompts/persona";
import {
  utilityPreamble,
  utilityReference,
  compactUtilityReference,
  utilityExpression,
  compactUtilityExpression,
  preserveAge,
  compactPreserveAge,
} from "./reference-policy";
// Avoid runtime code generation so validation works under the production CSP.
z.config({ jitless: true });
export const subjects = [
  "Man",
  "Woman",
  "Couple",
  "Kid",
  "Family",
  "Product",
] as const;
export const lightings = [
  "Golden Hour",
  "Soft Studio",
  "Cinematic",
  "Neon",
  "Natural Daylight",
  "Moody",
  "Night",
] as const;
export const framings = [
  "Close-up",
  "Half Body",
  "Full Body",
  "Wide",
  "Portrait",
  "Editorial",
] as const;
export const ratios = ["1:1", "4:5", "3:4", "9:16", "16:9"] as const;
export const enhanceOptions = [
  "Professional Portrait",
  "LinkedIn Headshot",
  "Improve Lighting",
  "Improve Image Quality",
  "Change Background",
  "Change Outfit",
  "Hairstyle Ideas",
  "Studio Portrait",
  "Remove Unwanted Objects",
  "Restore Old Photo",
  "Couple Makeover",
  "Birthday Photoshoot",
  "Wedding Enhancement",
  "Travel Photo Enhancement",
  "Product Background",
  "Product Photoshoot",
] as const;
export const styles = [
  "Natural",
  "Cinematic",
  "Romantic",
  "Traditional Indian",
  "Studio",
  "Retro",
  "Korean drama",
  "Luxury",
  "Fashion",
  "Fantasy",
  "Professional",
  "Minimal",
] as const;
export const backgrounds = [
  "Keep original background",
  "Soft studio backdrop",
  "City street",
  "Garden",
  "Beach",
  "Heritage courtyard",
  "Mountain overlook",
  "Cosy home",
  "Luxury interior",
] as const;
export const outfits = [
  "Keep original outfit",
  "Everyday casual",
  "Traditional saree",
  "Kurta or sherwani",
  "Tailored suit",
  "Linen outfit",
  "Wedding attire",
  "Comfortable party outfit",
  "No clothing / product styling",
] as const;
export const inputSchema = z
  .object({
    subject: z.enum(subjects),
    style: z.enum(styles),
    background: z.enum(backgrounds),
    outfit: z.enum(outfits),
    lighting: z.enum(lightings),
    framing: z.enum(framings),
    aspect_ratio: z.enum(ratios),
    identity: z.boolean().default(false),
    recrop: z.boolean().default(false),
    age_group: z
      .enum(["Keep original age", "Child", "Adult", "Older adult"])
      .default("Keep original age"),
    occasion: z.string().max(80).default("Everyday"),
    improvement: z.enum(enhanceOptions).default("Professional Portrait"),
    duration: z
      .union([z.literal(5), z.literal(10), z.literal(15), z.literal(30)])
      .default(15),
    mood: z
      .enum([
        "Cinematic",
        "Romantic",
        "Emotional",
        "Viral",
        "Luxury",
        "Funny",
        "Dramatic",
        "Minimal",
        "Fashion",
      ])
      .default("Cinematic"),
    platform: z
      .enum(["Instagram Reels", "YouTube Shorts", "TikTok", "Other"])
      .default("Instagram Reels"),
    variant: z.number().int().min(0).max(999).default(0),
  })
  .superRefine((v, ctx) => {
    if (
      v.subject === "Kid" &&
      v.age_group !== "Keep original age" &&
      v.age_group !== "Child"
    )
      ctx.addIssue({
        code: "custom",
        message: "Keep children at their original age.",
        path: ["age_group"],
      });
  });
export type GeneratorInput = z.input<typeof inputSchema>;
export type Scene = {
  start: number;
  end: number;
  action: string;
  camera: string;
  environment: string;
  lighting: string;
  transition: string;
};
export type GeneratedPrompt = {
  text: string;
  concept?: string;
  scenes?: Scene[];
  caption?: string;
  hashtags?: string[];
  music?: string;
};
export type Improvement = "cinematic" | "realistic" | "shorten" | "identity";
export interface PromptGenerationProvider {
  generatePhotoPrompt(input: GeneratorInput): GeneratedPrompt;
  generatePhotoEditPrompt(input: GeneratorInput): GeneratedPrompt;
  generateReelPrompt(input: GeneratorInput): GeneratedPrompt;
  improvePrompt(result: GeneratedPrompt, kind: Improvement): GeneratedPrompt;
}
export interface ImageGenerationProvider {
  generate(input: {
    prompt: string;
    aspectRatio: string;
    referenceImage?: Blob;
  }): Promise<{ url: string }>;
}
export const identityInstruction = utilityReference;
export const referenceDetailInstruction =
  "Essential reference details: retain the identity-defining hairline, original hair part and texture, facial hair characteristics, spectacles, jewellery, headwear, visible cultural marks such as a bindi or tilak, and distinguishing facial features unless a requested direction explicitly changes that detail. For a scoped edit, preserve the source expression and all details outside the requested change. Do not invent a religious mark merely from a broad style choice. Keep defining accessories and held objects visible within the crop. Use a personal photo for identity and any separate style preview only for styling, never as a replacement face.";
const compactReferenceDetails =
  "Essential reference details: retain hairline, original hair part and texture, facial hair, spectacles, jewellery, headwear, bindi or tilak and distinguishing facial features unless explicitly changed. Do not invent a religious mark from a broad style. For a scoped edit, preserve the original expression, pose, outfit and background and all details outside the requested change. Keep accessories and held objects inside the crop. Personal references supply identity; style previews supply styling only.";
export function interpolate(
  template: string,
  variables: Record<string, string>,
) {
  return template.replace(/\{\{([a-z_]+)\}\}/g, (_, key: string) => {
    if (
      !Object.prototype.hasOwnProperty.call(variables, key) ||
      !variables[key]?.trim()
    )
      throw new Error(`Missing template variable: ${key}`);
    return variables[key];
  });
}
const poses = [
  "a relaxed natural pose, with attention directed slightly beyond the camera",
  "a candid moment of gentle movement, keeping the subject clearly in focus",
  "an intentional composed pose with a calm, direct visual connection",
];
const editDirections: Record<(typeof enhanceOptions)[number], string> = {
  "Professional Portrait":
    "Refine the portrait for a professional context with restrained styling and an approachable expression.",
  "LinkedIn Headshot":
    "Create an approachable head-and-shoulders professional headshot. Keep the eyes sharp, the shoulders relaxed and the background quiet.",
  "Improve Lighting":
    "Correct the exposure and white balance, recover facial shadows and create soft flattering light without changing facial structure.",
  "Improve Image Quality":
    "Reduce compression artefacts and distracting noise while retaining natural detail. Do not invent facial features or oversharpen edges.",
  "Change Background":
    "Replace only the background. Preserve the subject edges, hair, outfit and expression; match perspective, colour temperature and contact shadows.",
  "Change Outfit":
    "Replace the clothing with the selected outfit, using realistic seams, drape and fabric texture. Preserve the person’s pose, face and natural body proportions.",
  "Hairstyle Ideas":
    "Explore a neatly styled variation of the existing hair with believable roots, hairline and strands. Change only the hairstyle; preserve the facial features.",
  "Studio Portrait":
    "Create a controlled studio portrait with a clean backdrop and coherent key, fill and catchlights.",
  "Remove Unwanted Objects":
    "Remove clearly distracting background objects while preserving intentional belongings, all people and the main subject. Reconstruct the surrounding scene naturally; leave ambiguous objects unchanged.",
  "Restore Old Photo":
    "Repair scratches, dust and fading conservatively. Retain period clothing, original facial features and natural grain. Do not modernize or invent missing identity details.",
  "Couple Makeover":
    "Refresh the couple’s clothing and environment while preserving both distinct identities, expressions and natural proportions.",
  "Birthday Photoshoot":
    "Create a tasteful birthday setting with a small cake and restrained decorations appropriate to the subject’s original age.",
  "Wedding Enhancement":
    "Refine wedding lighting and colour while preserving both identities, meaningful jewellery, embroidery and the original ceremony details.",
  "Travel Photo Enhancement":
    "Improve travel-photo lighting and composition while preserving recognizable landmarks, the subject and authentic environmental detail.",
  "Product Background":
    "Replace only the product background. Keep branding, label text, geometry and material properties unchanged; add believable contact shadows.",
  "Product Photoshoot":
    "Create a polished commercial product photograph while preserving the exact object, proportions, labels and materials.",
};
export class TemplatePromptProvider implements PromptGenerationProvider {
  generatePhotoPrompt(input: GeneratorInput): GeneratedPrompt {
    const v = inputSchema.parse(input);
    const product = v.subject === "Product";
    const subject = product
      ? "the product in the reference, preserving its geometry, materials and existing label text"
      : `the person or group from the reference when supplied, otherwise the fictional ${v.subject.toLowerCase()} specified above. Preserve natural proportions. If the reference does not match the requested ${v.subject.toLowerCase()} concept or omits intended group members, ask for suitable complete references instead of inventing people`;
    const pose = product
      ? "a clean three-quarter product presentation with stable geometry"
      : poses[v.variant % poses.length];
    return {
      text:
        (product
          ? personaPreamble("product", v.subject)
          : utilityPreamble(
              v.subject === "Kid" ? "child" : v.subject,
              false,
              v.age_group,
            )) +
        "\n\n" +
        interpolate(
          "Create a {{style}} photograph of {{subject}}. Place the subject in {{background}}, using {{lighting}} lighting and {{pose}}. Styling: {{outfit}}. Framing: {{framing}}. Camera direction: {{camera}}. Build a clear composition with realistic depth, consistent shadows and natural colour. {{texture}} Output aspect ratio: {{aspect_ratio}}. {{reference_details}} No added text or watermarks.",
          {
            style: v.style.toLowerCase(),
            subject,
            background: v.background.toLowerCase(),
            lighting: v.lighting.toLowerCase(),
            pose,
            outfit: product
              ? "restrained supporting props that do not obscure the product"
              : v.outfit.toLowerCase(),
            framing: v.framing.toLowerCase(),
            camera: product
              ? "90mm macro lens, f/8, controlled reflections"
              : v.framing === "Wide"
                ? "35mm lens, f/5.6, environment in context"
                : "85mm lens, f/4, subject clearly in focus",
            texture: product
              ? "Retain fine material texture, legible original labels and realistic reflections."
              : "Retain skin texture and believable hands. Avoid beauty filters and exaggerated proportions.",
            aspect_ratio: v.aspect_ratio,
            reference_details: product
              ? "Essential reference details: preserve the exact cap, handle, label, logo, geometry and material texture of the supplied product. Keep the complete object visible and never replace its branding with invented lettering."
              : referenceDetailInstruction,
          },
        ),
    };
  }
  generatePhotoEditPrompt(input: GeneratorInput): GeneratedPrompt {
    const v = inputSchema.parse(input);
    const scopedEdits = [
      "Improve Lighting",
      "Improve Image Quality",
      "Change Background",
      "Change Outfit",
      "Hairstyle Ideas",
      "Remove Unwanted Objects",
      "Restore Old Photo",
      "Wedding Enhancement",
      "Travel Photo Enhancement",
      "Product Background",
    ];
    // A local edit must not inherit a new pose, outfit and setting from the
    // photoshoot template: those directions can erase the details being kept.
    if (scopedEdits.includes(v.improvement)) {
      const product = v.subject === "Product";
      const requested =
        v.improvement === "Change Background" ||
        v.improvement === "Product Background"
          ? `New background: ${v.background}. Match it to the existing subject's light and perspective.`
          : v.improvement === "Change Outfit"
            ? `Requested outfit: ${v.outfit}. Fit the fabric to the original body and pose.`
            : v.improvement === "Improve Lighting"
              ? `Lighting direction: ${v.lighting}; preserve the subject's skin tone and the scene's original character.`
              : v.improvement === "Restore Old Photo"
                ? "Retain the source's monochrome or colour treatment; do not colourize unless requested."
                : "";
      return {
        text: `${product ? personaPreamble("product", v.subject, true) : utilityPreamble(v.subject, true)}\n\nEdit the supplied photo. ${editDirections[v.improvement]} ${requested} ${product ? "Preserve all original product details, placement and supporting props outside the requested edit." : `${referenceDetailInstruction} Preserve the original expression, pose, outfit and background except for the specifically requested change.`} ${v.recrop ? `Recrop to ${v.aspect_ratio} only as explicitly requested` : "Preserve the source aspect ratio and original crop; do not recrop merely to match the preview"}${product ? "" : " and do not invent unseen body parts"}. No added text or watermarks.`,
      };
    }
    const base = this.generatePhotoPrompt({
      ...v,
      identity: v.subject !== "Product",
    });
    let directive = editDirections[v.improvement];
    if (v.improvement === "Hairstyle Ideas")
      base.text = base.text.replace("hairstyle, ", "");
    if (v.improvement === "LinkedIn Headshot")
      directive +=
        " Prioritize head-and-shoulders framing over any wider framing direction below.";
    return {
      text: `Edit the uploaded photo. ${directive} ${base.text} Make only changes needed for the requested enhancement; preserve other meaningful details.`,
    };
  }
  generateReelPrompt(input: GeneratorInput): GeneratedPrompt {
    const v = inputSchema.parse(input);
    // Guided results are user-directed utility, not automatically approved library concepts.
    // Every duration still includes a specific reveal, action and resolution.
    const story =
      v.subject === "Product"
        ? [
            "HOOK: Begin close on one supplied distinguishing material or functional detail.",
            "PROGRESSION: Reveal the same product at realistic tabletop scale, showing only reference-supported surfaces.",
            "PAYOFF: Hold the complete unchanged product with readable original label and enough context to understand its size.",
          ]
        : v.subject === "Couple"
          ? [
              "HOOK: Begin on one folded, unmarked note between the couple’s nearest hands.",
              "PROGRESSION: One person passes the note; the other receives it with a natural small smile.",
              "PAYOFF: Reveal both unchanged people sharing a connected glance, with the note still in the recipient’s hand.",
            ]
          : v.subject === "Family"
            ? [
                "HOOK: Start on a closed family album held securely by an adult.",
                "PROGRESSION: The family gathers closer and exchanges a warm glance; do not invent photographs inside the album.",
                "PAYOFF: Reveal every supplied family member together with the album still closed, preserving exact identities and count.",
              ]
            : v.subject === "Kid"
              ? [
                  "HOOK: Start on a large paper pinwheel held safely by the child with an adult nearby if needed.",
                  "PROGRESSION: A gentle breeze turns the pinwheel and the child responds with a small delighted smile.",
                  "PAYOFF: Reveal the same recognizable child and the selected setting; keep posture supported and natural.",
                ]
              : [
                  "HOOK: Start on a small folded, unmarked map held in the person’s relaxed hand.",
                  "PROGRESSION: The person looks up from the map towards something beyond camera with quiet anticipation.",
                  "PAYOFF: Reveal the unchanged person within the selected environment, making the destination the answer to their glance.",
                ];
    const boundaries = [
      0,
      Math.max(1, Math.round(v.duration * 0.25)),
      Math.round(v.duration * 0.75),
      v.duration,
    ];
    const scenes: Array<Scene> = story.map((action, i) => ({
      start: boundaries[i],
      end: boundaries[i + 1],
      action,
      camera: [
        "Close detail establishing the question",
        "Follow the specified action without morphing",
        "Wider reveal and stable final hold",
      ][i],
      environment: v.background,
      lighting: v.lighting,
      transition:
        i === 2
          ? "Hold and end within the selected duration"
          : "Continuous movement or reference-consistent match cut",
    }));
    const concept =
      v.subject === "Product"
        ? "From a defining detail to the complete product"
        : v.subject === "Couple"
          ? "One note, a shared moment"
          : v.subject === "Family"
            ? "The people behind the family album"
            : v.subject === "Kid"
              ? "A little breeze, a little wonder"
              : "The destination behind the glance";
    return {
      concept,
      scenes,
      text: `${v.subject === "Product" ? personaPreamble("product", v.subject) : utilityPreamble(v.subject, false, v.age_group)}\n\nCreate a ${v.duration}-second ${v.aspect_ratio} video for ${v.platform}. Concept: ${concept}. Visual style: ${v.style}. ${scenes.map((s, i) => `Scene ${i + 1}, ${s.start}–${s.end}s: ${s.action} Camera: ${s.camera}. Environment: ${s.environment}. Lighting: ${s.lighting}. Transition: ${s.transition}.`).join(" ")} ${v.subject === "Product" ? `Essential continuity: preserve the exact product shape, cap, label, material, liquid level and props across every shot; reflections should move consistently with the camera.` : `Wardrobe: ${v.outfit}. ${referenceDetailInstruction} Essential continuity: keep the same people, age, hairstyle, facial marks, jewellery and wardrobe across every shot; expressions change only subtly with the action.`} Keep the final hold inside the selected duration. Use natural motion; avoid morphing, flashing lights, added text and watermarks.`,
      caption: `${v.mood === "Funny" ? "A little unexpected joy." : "A moment worth keeping."} ${v.subject === "Product" ? "It’s all in the details." : "Make this story your own."}`,
      hashtags: ["#PicMagic", `#${v.subject}Reel`, "#CreativeVideo"],
      music:
        v.mood === "Funny"
          ? "Light playful instrumental with gentle rhythmic accents."
          : v.mood === "Dramatic"
            ? "A restrained cinematic instrumental with a gradual build."
            : "Warm instrumental with a gentle pulse. Choose music you have permission to use.",
    };
  }
  improvePrompt(result: GeneratedPrompt, kind: Improvement) {
    const additions = {
      cinematic:
        "Use motivated side lighting, restrained film colour, subtle foreground depth and a deliberate focal point.",
      realistic:
        "Prioritize physically believable light, natural skin or material texture and accurate proportions. Avoid plastic surfaces and excessive sharpening.",
      identity: identityInstruction,
    };
    if (kind === "shorten") {
      // Compact known utility clauses only. Never drop arbitrary scene sentences.
      // Unknown/library constraints remain intact.
      const text = result.text
        .replaceAll(utilityReference, compactUtilityReference)
        .replaceAll(utilityExpression, compactUtilityExpression)
        .replaceAll(preserveAge, compactPreserveAge)
        .replaceAll(referenceDetailInstruction, compactReferenceDetails)
        .replaceAll(
          "Use believable diversity in appearance, complexion and hair, with ordinary natural proportions; do not repeat a stereotypical face.",
          "Use diverse natural appearances, complexion, hair and proportions; avoid stereotypical faces.",
        )
        .replaceAll(
          "Build a clear composition with realistic depth, consistent shadows and natural colour.",
          "Use realistic depth, shadows and colour.",
        )
        .replaceAll(
          "Keep the final hold inside the selected duration.",
          "End within the selected duration.",
        )
        .replace(/\s+/g, " ")
        .trim();
      return { ...result, text };
    }
    if (kind === "identity") {
      if (/REFERENCE PRESENT:/.test(result.text)) return result;
      // Existing person, product or artistic contracts already govern identity.
      const instruction =
        /PRODUCT REFERENCE:/.test(result.text) &&
        !/REFERENCE PRESENT:/.test(result.text)
          ? productPersona
          : /relative complexion|artistic pigment/.test(result.text)
            ? "Retain the reference facial geometry and age cues in the declared artistic palette; do not replace the identity."
            : identityInstruction;
      return result.text.includes(instruction)
        ? result
        : { ...result, text: `${result.text} ${instruction}` };
    }
    return result.text.includes(additions[kind])
      ? result
      : { ...result, text: `${result.text} ${additions[kind]}` };
  }
}
export const promptProvider: PromptGenerationProvider =
  new TemplatePromptProvider();
