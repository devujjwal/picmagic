import {
  reviewedReferencePersona,
  legacyReviewedReferencePersona,
  artReferencePersona,
  legacyArtReferencePersona,
  reviewedProductPersona,
  type ReferenceContract,
} from "./identity-contract";
/** The preview brief is editorial asset data, never a copyable identity source. */
export const LEGACY_PERSONA_POLICY_VERSION = "reference-first-india-default-v1";
export const PERSONA_POLICY_VERSION = "identity-expression-age-v2";
export const SUPPORTED_PERSONA_POLICY_VERSIONS = [
  LEGACY_PERSONA_POLICY_VERSION,
  PERSONA_POLICY_VERSION,
] as const;
export type PersonaPolicy =
  "person" | "product" | "person-and-product" | "animal";
export const legacyReferencePersona =
  "REFERENCE PRESENT: The attached person/persons are authoritative. Preserve every person's recognizable facial identity, age, facial structure, distinguishing facial characteristics, skin tone, ethnicity, natural body proportions and hairline. Preserve the number and identity of people in couple/group references. Never copy the preview model's face, complexion or identity. The preview supplies styling, pose, expression, wardrobe, composition, lighting and environment only. Cultural settings and styles, including K-drama, European editorial and retro Bollywood, do not determine ethnicity. Hair may be adapted when essential to the requested transformation; preserve the hairline and recognizable identity. Otherwise preserve or gently arrange the existing hair colour, length and texture.";
export const referencePersona =
  "REFERENCE PRESENT: The attached person/persons are authoritative for identity only. Preserve every person's recognizable facial identity: face shape, facial proportions, eye geometry and spacing, eyebrows, nose, lips, jaw and chin structure, natural complexion and distinguishing features. Preserve skin tone, ethnicity, natural body proportions and hairline. Preserve the number and distinct identities of people in group references. Do not copy the reference smile, facial expression, gaze, pose, clothing, styling, lighting or environment. The creative direction controls emotion and expression; a smile or visible teeth appears only when the scene calls for it. Expression may naturally change mouth position, eyebrows, eye openness, cheeks and subtle muscle tension without changing the underlying identity. Follow any explicit age in the creative direction. When an adult age is not explicitly stated, generate a natural young-adult appearance of approximately 22–30 regardless of the reference's apparent age, formal clothing, authority or setting. Never apply an adult reference identity to a child or teenager. The preview supplies styling and composition only; never copy its face, complexion or identity.";
export const referenceRequired =
  "NO REFERENCE PRESENT: Stop and ask for reference photos of every friend. Do not invent substitute people. This identity-specific concept requires references.";
export const productPersona =
  "PRODUCT REFERENCE: Product fidelity takes priority. Preserve its exact shape, proportions, design, colour, pattern, fabric/material appearance, stitching, silhouette, existing logos, label text and accessories actually supplied. Do not redesign a supplied product to match the example. Model styling may change only without hiding or altering the advertised product. Keep model/person identity separate from product identity.";
export function personaPreamble(
  policy: PersonaPolicy,
  subject: string,
  editing = false,
) {
  const person = policy === "person" || policy === "person-and-product";
  const product = policy === "product" || policy === "person-and-product";
  const fallback = `NO REFERENCE PRESENT: Default to an appropriate fictional Indian/South Asian ${subject.toLowerCase()}. Use believable diversity in Indian appearance, complexion and hair, with ordinary natural proportions; do not repeat a stereotypical face. Follow an explicitly stated age. If an adult age is not explicit, use approximately 22–30; never age a child or teenager into an adult. Derive expression from the creative direction rather than defaulting to a smile.${editing ? " Without a source photo, this is a newly generated illustrative example, not an edit or authentic restoration of someone's photograph. A faithful edit requires the original image." : ""}`;
  return [
    person && referencePersona,
    person && fallback,
    product && productPersona,
    policy === "animal" &&
      "ANIMAL REFERENCE: Preserve the supplied pet's species, breed or mixed-breed traits, markings, size and recognizable appearance. Do not change an animal to match a preview. Without a reference, use the fictional pet described below. Keep anatomy, posture and handling natural.",
    "CREATIVE DIRECTION:",
  ]
    .filter(Boolean)
    .join("\n\n");
}
export function personaIssues(p: {
  persona_policy?: string | null;
  persona_version?: string | null;
  prompt_text: string;
  image_brief?: string | null;
  generation_mode?: string | null;
  reference_contract?: ReferenceContract | null;
}) {
  const issues: string[] = [];
  const supportedVersion = SUPPORTED_PERSONA_POLICY_VERSIONS.includes(
    p.persona_version as (typeof SUPPORTED_PERSONA_POLICY_VERSIONS)[number],
  );
  if (!p.persona_policy || !supportedVersion)
    issues.push(
      "Choose a persona policy and apply the reference/no-reference instructions.",
    );
  const person = ["person", "person-and-product"].includes(
    p.persona_policy || "",
  );
  const currentPolicy = p.persona_version === PERSONA_POLICY_VERSION;
  const expectedReferenceClause = p.reference_contract
    ? p.reference_contract.medium === "artistic-palette"
      ? currentPolicy
        ? artReferencePersona
        : legacyArtReferencePersona
      : currentPolicy
        ? reviewedReferencePersona
        : legacyReviewedReferencePersona
    : currentPolicy
      ? referencePersona
      : legacyReferencePersona;
  if (
    person &&
    (!p.prompt_text.includes(expectedReferenceClause) ||
      !(p.generation_mode === "reference-required"
        ? p.prompt_text.includes(referenceRequired) &&
          !p.prompt_text.includes("Default to an appropriate fictional")
        : p.prompt_text.includes(
            "NO REFERENCE PRESENT: Default to an appropriate fictional Indian/South Asian",
          )))
  )
    issues.push(
      "Keep the reference-first and Indian/South Asian no-reference sections intact.",
    );
  if (
    person &&
    currentPolicy &&
    (!p.prompt_text.includes("identity only") ||
      !p.prompt_text.includes("approximately 22–30") ||
      !p.prompt_text.includes("creative direction controls emotion"))
  )
    issues.push(
      "Keep identity separate from prompt-led age and expression in the current persona policy.",
    );
  const body = p.prompt_text.split("CREATIVE DIRECTION:").at(-1) || "";
  if (
    person &&
    /(?:photograph of|Scene:|Create|Generate)\s+(?:a |an |the )?(?:(?:young|mature|dark-skinned|light-skinned)\s+)?(?:Indian|South Asian|East Asian|African|Black|white|Latino)\s+(?:man|woman|couple|family|boy|girl|bride|groom)/i.test(
      body,
    )
  )
    issues.push(
      "Move identity demographics out of creative direction and into the separate preview brief or no-reference section.",
    );
  if (!p.image_brief?.trim())
    issues.push(
      "Add a separate preview generation brief; never use preview demographics as the user's identity.",
    );
  if (p.image_brief?.trim() === p.prompt_text.trim())
    issues.push(
      "Store the preview persona separately from the copyable user prompt.",
    );
  if (
    ["product", "person-and-product"].includes(p.persona_policy || "") &&
    !(
      p.prompt_text.includes(productPersona) ||
      (p.reference_contract?.product_views === "reference-supported" &&
        p.prompt_text.includes(reviewedProductPersona))
    )
  )
    issues.push("Keep the product-reference fidelity instructions intact.");
  if (p.reference_contract) {
    const c = p.reference_contract;
    if (
      c.depiction_count > 1 &&
      (!p.prompt_text.includes("intentional depictions") ||
        !/same|one identity/i.test(p.prompt_text))
    )
      issues.push(
        "Repeated depictions must explicitly preserve the same identity, not add people.",
      );
    if (
      ["product", "person-and-product"].includes(p.persona_policy || "") &&
      c.product_views !== "reference-supported"
    )
      issues.push(
        "Commercial transformations require reference-supported product views.",
      );
  }
  if (
    p.persona_policy === "animal" &&
    !p.prompt_text.includes("ANIMAL REFERENCE: Preserve the supplied pet")
  )
    issues.push(
      "Keep the reference animal's identity and markings authoritative.",
    );
  return issues;
}
