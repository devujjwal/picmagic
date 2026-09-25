/** Authored instructions, not claims of successful tests in every suggested tool. */
export type PromptWorkflow = {
  updatedAt: string;
  preparation: string;
  steps: string[];
  fixes: { symptom: string; correction: string }[];
  checks: string[];
};
const reviewed = "2026-09-25T04:00:00Z";
export const promptWorkflows: Record<string, PromptWorkflow> = {
  "a-fold-around-you-profile": {
    updatedAt: reviewed,
    preparation: "Choose one clear, current portrait with the whole hairline visible. Keep glasses or facial hair if they are part of your everyday appearance. Upload it to your chosen image tool, not to PicMagic. Without a reference, this prompt creates a fictional adult.",
    steps: [
      "Copy the complete prompt above, attach your portrait and identify it as the identity reference. Keep the square output request; changing it to a vertical fashion crop loses the avatar composition.",
      "Keep the cream folds behind the shoulders. Personalise the backing colour first; avoid requesting several new props or a paper face at the same time.",
      "Save a square result. Preview it at 40, 64 and 128 pixels in both a square and a circle before choosing it as your DP. A circle removes the corners even when the square looks good.",
    ],
    fixes: [
      { symptom: "Paper crosses the face or wraps the neck", correction: "Edit only the paper set. Move both folds behind the shoulders, leaving the entire face and neck unobstructed. Keep the person photographic and preserve their current identity, expression and glasses." },
      { symptom: "Hair or chin disappears in the circular crop", correction: "Expand the square framing with more background above the hair and below the chin. Keep the face centred and recognizable; do not shrink or reshape the head. Preserve the paper folds behind the shoulders." },
    ],
    checks: ["Eyes remain readable at 40 pixels without extra sharpening.", "The circle contains the hair and chin with breathing room.", "The paper casts shadows; it does not replace skin or clothing."],
  },
  "borrowed-moon-closing-time": {
    updatedAt: reviewed,
    preparation: "Use one adult portrait with a clear face. This is a fictional theatre scene, not evidence of a real performance. The moon is a painted stage prop; the cart, not the person's arms, carries its weight.",
    steps: [
      "Attach the portrait and copy the full prompt. Keep the waist-up subject prominent in the 4:5 frame, leaving enough room beside them to understand the crescent and its support.",
      "Choose an everyday outfit you would plausibly wear backstage. Keep the quiet sideways reaction; a straight-to-camera glamour pose loses the returning-a-prop story.",
      "Check how the hand meets the rim and how the prop meets the cart. Request one repair at a time so a lighting change does not also replace the person's face.",
    ],
    fixes: [
      { symptom: "The moon becomes a halo or floats", correction: "Keep the same person, face and theatre scene. Move the painted crescent beside the torso and visibly rest its lower edge on a low wheeled cart. It is a lightweight physical prop, not a glowing moon or a halo behind the head." },
      { symptom: "The hand merges into the prop", correction: "Edit the hand-to-prop contact only. Place one relaxed hand on the accessible outer rim, with separate naturally bent fingers. Keep the cart supporting the weight and preserve the face, pose and composition elsewhere." },
    ],
    checks: ["One recognizable adult; glasses and distinguishing features remain coherent.", "Painted surface, support and contact shadows tell the same physical story.", "The face and prop still read at phone-feed size."],
  },
  "barefoot-at-blue-hour": {
    updatedAt: reviewed,
    preparation: "Use a clear couple photograph or two separately labelled adult portraits. Name them Person A and Person B and state who is on the left. The beach example supplies clothing and light, never either person's ethnicity or complexion.",
    steps: [
      "Attach both identities and copy the prompt. Keep exactly two people; if a reference contains bystanders, identify the intended couple before generating.",
      "Coordinate the off-white clothing without changing either person's build. Keep the ankle-deep foam, held nearest hands and glance toward each other; these create the shared moment.",
      "Compare each face separately with its reference, then inspect the joined hands and both pairs of feet. Dusk can cool the scene without replacing natural differences in complexion.",
    ],
    fixes: [
      { symptom: "Both faces look alike or identities switch positions", correction: "Use Person A's reference only for the person on the left and Person B's only for the person on the right. Preserve their separate facial geometry, apparent ages, complexions and builds. Keep exactly two people and retain the beach, clothing and walking interaction." },
      { symptom: "Hands fuse or feet float above the foam", correction: "Keep both identities and the composition. Simplify the nearest-hand hold into a relaxed grip with clearly separated wrists. Ground all four feet in wet sand beneath shallow foam, with coherent contact shadows and small splashes." },
    ],
    checks: ["Two distinct identities remain separately recognizable.", "No ethnicity, skin-tone or body-shape substitution.", "Four grounded feet and a plausible handhold; no invented third person."],
  },
  "tiny-krishna-big-wonder": {
    updatedAt: reviewed,
    preparation: "Use a photograph of the child you have permission to edit. Preserve that child's actual age and features. Do not use an adult reference and ask the model to turn the adult into a child. The hairstyle can change for Krishna styling while the hairline remains recognizable.",
    steps: [
      "Copy the complete prompt with the child reference. Keep the eye-level three-quarter composition with room above the feather and below the flute.",
      "Prioritise the single peacock feather, U-shaped tilak, yellow dhoti, blue sash and gently held flute. Keep the child relaxed; the flute is held across the chest, not played.",
      "Review the face before jewellery detail. Then check both hands, forehead marking and feather. Ask someone familiar with the intended cultural styling to review details before sharing.",
    ],
    fixes: [
      { symptom: "The model freezes the original haircut", correction: "Keep the child's recognizable face, actual age, hairline and natural complexion. Adapt only the hair arrangement into soft tousled curls with the fringe lifted enough to reveal the tilak. Preserve the hair colour; do not replace the child with a different face." },
      { symptom: "Skin turns blue or the face becomes older", correction: "Restore the child's natural complexion and apparent age from the reference. Krishna inspiration applies to clothing, feather, tilak and hairstyle only, not skin colour or facial anatomy. Keep the existing gentle pose and courtyard." },
    ],
    checks: ["The same child, with age-appropriate features and natural skin tone.", "One fully visible feather and readable tilak; no accidental crown.", "Both hands hold one flute naturally, without extra fingers."],
  },
  "perfume-the-water-sculpture": {
    updatedAt: reviewed,
    preparation: "Supply a sharp photograph showing the bottle's front, cap and label. Keep an unedited product image for comparison and compositing. Without a reference, the prompt makes a fictional blank-label bottle; it cannot demonstrate your real product.",
    steps: [
      "Copy the complete prompt and label the bottle photo as the product reference. Choose a source angle close to the desired front view so the tool does not have to invent unseen construction.",
      "Keep the bottle upright and dry. The single water arch goes behind it, while neutral front fill keeps the label readable. Change the backdrop before changing the product lighting.",
      "Compare the cap, bottle outline, label spelling and liquid level at full size. If the label or geometry changes, retain the original product layer in a composite rather than presenting the new bottle as an accurate listing.",
    ],
    fixes: [
      { symptom: "The water hides the label or emerges from the cap", correction: "Edit the water only. Place one separate arch entirely behind the dry bottle, with clear space around the cap and front label. Keep bottle geometry, liquid level, label and plinth unchanged. Do not imply that the bottle is waterproof." },
      { symptom: "Lettering or bottle design changes", correction: "Do not redraw or reinterpret the packaging. Preserve the original supplied bottle as the product layer and adjust only the background, water and contact shadow. If this tool cannot retain the original layer, stop and use a compositing workflow." },
    ],
    checks: ["Cap shape, label, colour and liquid level match the actual product.", "Only one bottle; reflections do not invent a second product.", "The campaign makes no unsupported waterproofness or performance claim."],
  },
  "portrait-cut-from-monsoon-paper": {
    updatedAt: reviewed,
    preparation: "Choose a clear portrait with readable eye spacing, hairline and expression. This prompt translates the person into paper relief. Recognition comes from geometry and age cues, not from demanding literal photographic skin inside a limited paper palette.",
    steps: [
      "Copy the full prompt with your reference. Keep the umber, indigo, cream and grey material direction, with layered cheeks and nose rather than a paper texture pasted over a photograph.",
      "Adapt the cloud shapes behind the head or the balance of the paper colours. Keep facial landmarks clear and preserve distinguishing asymmetry instead of requesting a perfectly symmetrical face.",
      "Compare recognition at mobile size, then inspect the physical construction at full size. Side lighting should reveal cut edges and shallow shadows without making the layers look like scars.",
    ],
    fixes: [
      { symptom: "It looks like a flat photo filter", correction: "Keep the reference person's recognizable geometry and age cues. Build actual stacked paper planes with visible cut edges, fibres, thickness and shallow side-lit shadows. Keep cloud forms behind the head and the eye shapes clear." },
      { symptom: "The paper palette changes the apparent identity", correction: "Restore the reference's eye spacing, nose and mouth geometry, hairline, distinguishing marks and age cues. Translate relative complexion values into the declared paper palette without lightening the person's appearance or replacing their features. Do not add photographic skin patches." },
    ],
    checks: ["Facial proportions and age cues survive the material change.", "The paper has coherent depth rather than random cuts across the eyes.", "No unrelated faces, invented writing or contradictory photographic patches."],
  },
};
