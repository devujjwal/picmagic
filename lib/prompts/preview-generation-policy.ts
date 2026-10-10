export const PREVIEW_GENERATION_POLICY_VERSION =
  "preview-reference-age-preserved-v2";

export type PreviewIdentityRole = "male" | "female" | "couple" | "neither";

export type PreviewGenerationInput = {
  identityRole: PreviewIdentityRole;
  referenceAssetId?: string;
  explicitAge?: string | null;
  mood: string;
  expression: string;
  scenePrompt: string;
  outputRequirements: string;
};

export const sharedPreviewGenerationPolicy = `PICMAGIC SHARED IDENTITY, AGE AND EXPRESSION POLICY:
1. Decide the identity role before generation: approved male, female or couple reference pool, or neither. Use the documented non-repeating rotation and keep the same selected reference through revisions. A couple reference supplies both distinct identities; never combine solo identities or include background bystanders. Identity-reference images control identity and actual age. Styling, expression, gaze, pose, clothing, lighting and environment follow the scene.
2. Preserve every referenced person's actual age and age cues; do not de-age or age them to fit the editorial audience. If reference suitability is uncertain, ask the owner before generation. Never apply an adult identity to a child or teenager. Without a reference, use an appropriate fictional adult for adult solo/couple editorial concepts. Keep numeric audience ages out of public copyable prompts.
3. Read the scene's mood and storytelling before selecting the facial expression. Serious/editorial scenes use neutral or serious expressions; cinematic scenes use restrained composed expressions; thoughtful scenes use contemplative expressions; professional scenes use composed confidence; surreal scenes use a believable reaction; happy or playful scenes may smile naturally. A smile, visible teeth or generic pleasant expression must not appear unless the scene supports it.
4. Expression may change mouth position, eyebrows, eye openness, cheeks and subtle muscle tension. It must not change face shape, eye geometry, nose, jaw or chin structure, underlying proportions, ethnicity, natural complexion or other identity-defining characteristics. If a strong expression causes identity drift, retry with a more restrained version of the same emotion rather than reverting to the reference smile.
5. The scene prompt controls hairstyle where required, clothing, pose, environment, composition, lighting, props, camera treatment and creative or surreal mechanism. Preserve the original concept and aspect ratio.
6. Before acceptance, verify likeness, preserved age, prompt-led expression, identity stability across expression, concept fidelity, cultural details, natural anatomy and skin, realistic hands, correct people count and mobile crop, and absence of beauty filtering, skin whitening, extra faces, malformed anatomy, unwanted text, logos and watermarks. Record provider, input hashes and limitations privately. Never publish original identity references.`;

export function composePreviewGenerationPrompt(input: PreviewGenerationInput) {
  if (input.identityRole !== "neither" && !input.referenceAssetId)
    throw new Error(
      "Identity-controlled previews require a reference asset ID.",
    );
  if (input.identityRole !== "neither" && input.explicitAge?.trim())
    throw new Error(
      "Age overrides are not allowed for identity-reference previews. Preserve the reference age.",
    );
  const age = input.explicitAge?.trim()
    ? `Fictional subject age direction: ${input.explicitAge.trim()}. No reference identity is involved.`
    : "Preserve reference age; never de-age or age the supplied people.";
  const identity =
    input.identityRole === "neither"
      ? "Identity role: neither approved adult identity applies. Use the scene's appropriate fictional subject and preserve child safety."
      : `Identity role: approved ${input.identityRole} identity. Resolve private reference asset ID ${input.referenceAssetId} at generation time; never place its path or binary in public prompt data.`;
  return [
    sharedPreviewGenerationPolicy,
    identity,
    age,
    `Scene mood: ${input.mood.trim()}.`,
    `Required natural expression: ${input.expression.trim()}.`,
    "SCENE-SPECIFIC CREATIVE DIRECTION:",
    input.scenePrompt.trim(),
    "OUTPUT REQUIREMENTS:",
    input.outputRequirements.trim(),
  ].join("\n\n");
}
