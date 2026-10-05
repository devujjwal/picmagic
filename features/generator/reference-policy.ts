/** User-facing utility policy. Editorial preview generation retains its own policy. */
export const utilityReference =
  "REFERENCE PRESENT: The attached person/persons are authoritative for identity. Preserve every person's recognizable facial identity: face shape, facial proportions, eye geometry and spacing, eyebrows, nose, lips, jaw and chin structure, natural complexion and distinguishing features. Preserve skin tone, ethnicity, natural body proportions and hairline. Preserve the number and distinct identities of people in group references. Never apply an adult reference identity to a child or teenager. The preview supplies styling and composition only; never copy its face, complexion or identity.";
export const compactUtilityReference =
  "REFERENCE PRESENT: Preserve each person's facial identity: face shape and proportions, eye geometry and spacing, eyebrows, nose, lips, jaw, chin, distinguishing features, skin tone, ethnicity, natural body proportions and hairline. Keep every distinct group identity and count; never apply an adult identity to a child or teenager. A preview supplies styling/composition only, never a replacement face or complexion.";
export const utilityExpression =
  "For a new creative scene, do not copy the reference smile, expression, gaze, pose, clothing or lighting. The scene controls emotion and expression; use a smile only when it belongs in that scene, without changing underlying facial geometry.";
export const compactUtilityExpression =
  "New-scene expression, gaze, pose, clothing and lighting follow the scene, not the reference; smile only when appropriate and keep facial geometry unchanged.";
export const preserveReferenceAge =
  "Age intent: preserve every supplied person's apparent age and age-related facial texture. Do not rejuvenate or age anyone.";
export const preserveAge = `${preserveReferenceAge} Without a reference, use a subject-appropriate fictional age; never turn a child or teenager into an adult.`;
export const compactPreserveAge =
  "Age intent: preserve every supplied person's apparent age and age-related facial texture; do not rejuvenate or age anyone. No reference: use a subject-appropriate fictional age, never age children/teenagers into adults.";
export function ageIntent(age: string = "Keep original age", subject: string) {
  if (subject === "Kid" || age === "Child")
    return "Age intent: preserve the supplied child's actual age and proportions. If the reference is not a child, ask for a suitable child reference instead of changing age. Without a reference, use an age-appropriate fictional child.";
  if (age === "Adult" || age === "Older adult")
    return `Age intent: explicitly selected creative age transformation — ${age === "Adult" ? "approximately 22–30" : "approximately 60–75"}. Apply only to adult references; preserve recognizable facial identity and natural proportions while adapting age cues. If the source is a child or teenager, ask for a suitable adult reference instead. Without a reference, use a fictional adult in the selected age band.`;
  return preserveAge;
}
export function utilityPreamble(
  subject: string,
  editing = false,
  age = "Keep original age",
) {
  return [
    utilityReference,
    ageIntent(age, subject),
    !editing && utilityExpression,
    `NO REFERENCE PRESENT: Default to an appropriate fictional Indian/South Asian ${subject.toLowerCase()}. Use believable diversity in appearance, complexion and hair, with ordinary natural proportions; do not repeat a stereotypical face.${editing ? " Without a source photo, this is a newly generated illustrative example, not an edit or authentic restoration. A faithful edit requires the original image." : ""}`,
    "CREATIVE DIRECTION:",
  ]
    .filter(Boolean)
    .join("\n\n");
}
