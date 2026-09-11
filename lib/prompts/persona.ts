import {
  reviewedReferencePersona,
  artReferencePersona,
  reviewedProductPersona,
  type ReferenceContract,
} from "./identity-contract";
/** The preview brief is editorial asset data, never a copyable identity source. */
export const PERSONA_POLICY_VERSION = "reference-first-india-default-v1";
export type PersonaPolicy =
  "person" | "product" | "person-and-product" | "animal";
export const referencePersona =
  "REFERENCE PRESENT: The attached person/persons are authoritative. Preserve every person's recognizable facial identity, age, facial structure, distinguishing facial characteristics, skin tone, ethnicity, natural body proportions and hairline. Preserve the number and identity of people in couple/group references. Never copy the preview model's face, complexion or identity. The preview supplies styling, pose, expression, wardrobe, composition, lighting and environment only. Cultural settings and styles, including K-drama, European editorial and retro Bollywood, do not determine ethnicity. Hair may be adapted when essential to the requested transformation; preserve the hairline and recognizable identity. Otherwise preserve or gently arrange the existing hair colour, length and texture.";
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
  const fallback = `NO REFERENCE PRESENT: Default to an appropriate fictional Indian/South Asian ${subject.toLowerCase()}. Use believable diversity in Indian appearance, complexion, age and hair, with ordinary natural proportions; do not repeat a stereotypical face. Match age and number only where essential to this concept.${editing ? " Without a source photo, this is a newly generated illustrative example, not an edit or authentic restoration of someone's photograph. A faithful edit requires the original image." : ""}`;
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
  if (!p.persona_policy || p.persona_version !== PERSONA_POLICY_VERSION)
    issues.push(
      "Choose a persona policy and apply the reference/no-reference instructions.",
    );
  const person = ["person", "person-and-product"].includes(
    p.persona_policy || "",
  );
  if (
    person &&
    (!(
      p.prompt_text.includes(referencePersona) ||
      (p.reference_contract &&
        p.prompt_text.includes(
          p.reference_contract.medium === "artistic-palette"
            ? artReferencePersona
            : reviewedReferencePersona,
        ))
    ) ||
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
