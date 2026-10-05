/** Planned comparison inputs only. Nothing here is evidence of a completed run. */
export const promptTestPlan = [
  {
    slug: "a-fold-around-you-profile",
    focus: "Photographic identity, physical paper folds and circular avatar framing",
    variation: "Change only the backing from petrol blue to muted forest green. Keep the same reference identity, photographic face, paper folds, lighting and square framing.",
    repairIfNeeded: "Expand the background above the hair and below the chin so the whole head remains inside a circular crop. Preserve the reference face and hairline; do not reshape or shorten the hair.",
  },
  {
    slug: "borrowed-moon-closing-time",
    focus: "Face at a new angle, painted prop, hand contact and cart support",
    variation: "Keep the same identity and theatre scene. Widen the 4:5 framing just enough to include the complete crescent and its supporting cart; retain a readable waist-up face.",
    repairIfNeeded: "Rest the painted crescent visibly on the cart beside the torso. Keep one relaxed hand on the outer rim with separate fingers. Preserve the reference face and do not turn the prop into a halo.",
  },
  {
    slug: "portrait-cut-from-monsoon-paper",
    focus: "Recognition through facial geometry in a nonphotographic material",
    variation: "Keep the reference identity and layered paper face unchanged. Change only the cloud silhouettes behind the head to two broader shapes with clear space around the eyes.",
    repairIfNeeded: "Restore the reference eye spacing, nose, mouth, hairline and distinguishing asymmetry. Keep actual stacked paper planes with visible edges and shallow cast shadows; do not replace the face with photographic skin.",
  },
  {
    slug: "small-burst-of-motion-profile",
    focus: "Readable eyes and head inside small circular crops",
    variation: "Keep the same identity, square portrait, expression and two brush arcs behind the shoulders. Change only the muted coral arc to mustard yellow; retain the deep teal arc and keep all marks off the face.",
    repairIfNeeded: "Remove motion marks from the eyes, nose and mouth. Keep the face photographic, restore the reference facial geometry and leave space around the complete hair and chin for a circular crop.",
  },
  {
    slug: "between-two-gravities",
    focus: "One upright identity and an unmistakable ninety-degree turn in the distant stairwell",
    variation: "Keep the same identity, upright seated pose and ninety-degree architectural turn. Simplify surface texture while retaining sideways treads, horizontal balusters and the sideways far doorway.",
    repairIfNeeded: "Keep the reference person upright on the near landing with ordinary anatomy. Rotate only the entire distant upper flight ninety degrees, including treads, balusters and doorway, connecting it as one concrete ribbon. Do not tilt the camera or substitute an ordinary corner-turn staircase.",
  },
  {
    slug: "city-lights-main-character-energy",
    focus: "Recognizable face under coloured night lighting, without skin-tone substitution",
    variation: "Keep the reference identity, pose and night setting. Reduce coloured light on the face and retain neutral facial fill; keep the city lights in the background.",
    repairIfNeeded: "Restore the reference facial geometry, natural complexion and hairline. Keep neon colour in the environment and edge light only, without smoothing or replacing the face.",
  },
  {
    slug: "your-next-chapter-in-focus",
    focus: "Professional framing without age reduction or automatic beautification",
    variation: "Keep the same reference identity, expression, lighting and framing. Change only the jacket colour to charcoal, preserving fabric construction and natural body proportions.",
    repairIfNeeded: "Restore the reference apparent age, skin texture, face shape and distinguishing features. Keep the professional setting and jacket; do not beautify, lighten skin or reshape the jaw.",
  },
  {
    slug: "a-headshot-that-feels-like-you",
    focus: "Conservative editing of an existing portrait rather than a new face",
    variation: "Keep the person, expression, pose and clothing unchanged. Change only the plain light-grey background to warm off-white with illumination matching the original photo.",
    repairIfNeeded: "Restore the original face and skin texture from the reference. Correct only exposure and background edges around hair, ears and glasses; do not invent facial detail or change the expression.",
  },
] as const;
