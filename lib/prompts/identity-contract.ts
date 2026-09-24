/** Legacy v1 clauses remain accepted for already-published prompt records. */
export const legacyReviewedReferencePersona =
  "REFERENCE PRESENT: The supplied person/persons are authoritative for identity. Preserve each recognizable face, facial structure, distinguishing features, age, ethnicity, skin tone, natural body proportions and hairline. The PicMagic preview supplies the creative treatment, pose, wardrobe, expression, composition, lighting and environment only; do not copy its model's face or identity. Cultural styling never determines ethnicity. Adapt hair arrangement, clothing, expression and pose only as required by the concept, keeping the person recognizable. Otherwise preserve or gently arrange the existing hair.";
export const legacyArtReferencePersona =
  "REFERENCE PRESENT: The supplied person is authoritative for identity. Preserve recognizable facial geometry, eye spacing, distinguishing features, age cues, ethnicity, natural proportions and hairline. Translate their relative complexion values into the explicitly declared paper or ink palette; artistic pigment is not literal photographic skin colour or a change of ethnicity. Keep facial landmarks and marks legible in the new medium. The PicMagic example supplies the art treatment and composition only; never substitute its model's face.";

/** Reviewed v2 clauses: identity comes from the reference; age and expression do not. */
export const reviewedReferencePersona =
  "REFERENCE PRESENT: The supplied person/persons are authoritative for identity only. Preserve recognizable face shape, facial proportions, eye geometry and spacing, eyebrows, nose, lips, jaw and chin structure, ethnicity, natural complexion, distinguishing features and hairline. Do not copy the reference smile, expression, gaze, pose, clothing, styling, lighting or environment. The creative direction controls emotion and expression; use a smile only when the scene calls for one. Expression may naturally move the mouth, brows, eyes and cheeks without changing the underlying identity. An explicit age in the creative direction overrides the reference appearance. If an adult age is not explicitly stated, use a natural young-adult appearance of approximately 22–30. Never apply an adult identity to a child or teenager. The PicMagic preview supplies the creative treatment and composition only; never substitute its model's face.";
export const artReferencePersona =
  "REFERENCE PRESENT: The supplied person is authoritative for identity only. Preserve recognizable facial geometry, eye spacing, distinguishing features, ethnicity, natural proportions and hairline. Do not copy the reference expression, smile, pose, styling or apparent age. Use the creative direction's expression and explicit age; when adult age is unspecified, use approximately 22–30. Never apply an adult identity to a child or teenager. Translate relative complexion values into the explicitly declared paper or ink palette; artistic pigment is not literal skin colour or an ethnicity change. Keep facial landmarks legible in the new medium. The PicMagic example supplies the art treatment and composition only; never substitute its model's face.";
export const reviewedProductPersona =
  "PRODUCT REFERENCE: Product fidelity takes priority. Preserve the supplied product's exact geometry, material, colour, design, pattern, weave, stitching, silhouette, label, logo and accessories actually supplied. Use only views supported by the references. Do not invent unseen construction, hide important details or redesign the item to resemble the PicMagic example. Keep model identity separate from product identity. If generated lettering or fine construction changes, use the original product layer in a composite rather than claim exact reproduction.";

export type ReferenceContract = {
  medium: "photographic" | "artistic-palette";
  identity_count: number | null;
  depiction_count: number;
  reference_age: "preserve" | "child-required" | "adult-required";
  product_views: "reference-supported" | "not-applicable";
};
