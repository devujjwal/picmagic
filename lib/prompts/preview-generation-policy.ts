export const PREVIEW_GENERATION_POLICY_VERSION =
  "preview-identity-expression-age-v1";

export type PreviewIdentityRole = "male" | "female" | "neither";

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
1. Decide the identity role before generation: approved male reference, approved female reference, or neither. Identity-reference images control identity only. Never copy their smile, expression, gaze, pose, clothing, styling, lighting or environment.
2. Decide age from the scene prompt. Follow every explicit adult age or age band. If adult age is unspecified, use a natural young-adult appearance of approximately 22–30. Formal clothing, professional authority, marriage, family context or a traditional setting never imply an older age. Never apply either adult identity to a child or teenager.
3. Read the scene's mood and storytelling before selecting the facial expression. Serious/editorial scenes use neutral or serious expressions; cinematic scenes use restrained composed expressions; thoughtful scenes use contemplative expressions; professional scenes use composed confidence; surreal scenes use a believable reaction; happy or playful scenes may smile naturally. A smile, visible teeth or generic pleasant expression must not appear unless the scene supports it.
4. Expression may change mouth position, eyebrows, eye openness, cheeks and subtle muscle tension. It must not change face shape, eye geometry, nose, jaw or chin structure, underlying proportions, ethnicity, natural complexion or other identity-defining characteristics. If a strong expression causes identity drift, retry with a more restrained version of the same emotion rather than reverting to the reference smile.
5. The scene prompt controls hairstyle where required, clothing, pose, environment, composition, lighting, props, camera treatment and creative or surreal mechanism. Preserve the original concept and aspect ratio.
6. Before acceptance, verify identity, prompt-led age, prompt-led expression, identity stability across expression, concept fidelity, natural anatomy and skin, realistic hands, correct people count and crop, and absence of beauty filtering, skin whitening, extra faces, malformed anatomy, unwanted text, logos and watermarks.`;

export function composePreviewGenerationPrompt(input: PreviewGenerationInput) {
  if (input.identityRole !== "neither" && !input.referenceAssetId)
    throw new Error(
      "Identity-controlled previews require a reference asset ID.",
    );
  const age = input.explicitAge?.trim()
    ? `Explicit prompt age: ${input.explicitAge.trim()}. Follow it.`
    : "No adult age is explicit: use approximately 22–30.";
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
