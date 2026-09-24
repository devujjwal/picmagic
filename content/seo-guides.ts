/** Reviewed, versioned editorial modules. These are not generated from tags or keywords.
 * Keep references to real library routes; new hubs need an explicit editorial review.
 * The CMS still owns introductions, membership and prompt text.
 */
export type EditorialGuide = {
  updatedAt: string;
  sections: { heading: string; body: string }[];
  links?: { label: string; path: string }[];
};
const reviewed = "2026-09-24T09:15:00Z";
const guide = (sections: [string, string][], links?: EditorialGuide["links"]): EditorialGuide => ({
  updatedAt: reviewed,
  sections: sections.map(([heading, body]) => ({ heading, body })),
  links,
});
export const hubGuides: Record<string, EditorialGuide> = {
  "/ai-prompts/men": guide([
    ["Choose the portrait's job", "For a readable profile image, start with a close crop and a quiet background. City Lights gives more space to the setting and clothing; a professional headshot instead needs even facial light. Choose the use first, then keep only the props that help tell that story."],
    ["Keep character, not a template face", "Supply a clear photograph with a visible hairline and jaw. Preserve beard density, natural complexion and body proportions. A serious cinematic scene does not need the smile from your reference, and formal clothing does not require an older face. Change wardrobe or background one element at a time."],
  ], [{label:"Cinematic lighting and scenes",path:"/collections/cinematic"},{label:"Profile-picture compositions",path:"/collections/instagram-profile-picture"}]),
  "/ai-prompts/women": guide([
    ["Match styling to the scene", "Golden-hour traditional portraits and clean studio portraits need different light and framing. A saree-led image needs enough space to read the drape; a headshot needs clear eyes at small size. Use the full-body or close-up direction in the selected prompt instead of combining both."],
    ["Adapt without reshaping", "Use your reference for identity, not automatic makeup, jewellery or expression. Keep facial volume and natural skin tone. If changing hair, describe the requested hairstyle separately from the hairline. Check hands near the face and garment edges before saving the result."],
  ], [{label:"Controlled studio portraits",path:"/collections/studio"},{label:"Imaginative photo transformations",path:"/collections/creative-transformations"}]),
  "/ai-prompts/couple": guide([
    ["Let the interaction lead", "Rainy walks, blue-hour beach scenes and vintage outings work through shared gestures, not two independent portraits. Choose who looks at whom and where their hands meet. Leave space around both people so an umbrella, carriage or shoreline remains part of the story."],
    ["Prepare two clear identities", "Provide a clear reference for each adult and state which person occupies each position. Avoid blending their faces or matching their features. Clothing colours can coordinate without becoming identical; preserve each person's natural build and check overlapping arms carefully."],
  ], [{label:"Romantic settings and body language",path:"/collections/romantic"}]),
  "/ai-prompts/kids": guide([
    ["Choose play over posing", "The birthday astronaut and off-duty superhero ideas use costumes and props to create a story; the Krishna-inspired portrait relies on specific cultural details. Keep gestures gentle, costumes comfortable and expressions natural. Do not add adult styling to make a child's portrait look more polished."],
    ["Use an age-appropriate reference", "Use only photographs you have permission to edit, and preserve the child's actual age and proportions. Adult identity references are not substitutes for children. For newborn scenes, require supported positioning and a visible caregiver where needed; reject unstable poses and invented extra fingers."],
  ], [{label:"Celebration-specific portrait ideas",path:"/collections/indian-festivals"}]),
  "/ai-prompts/travel": guide([
    ["Decide how the place participates", "Mediterranean streets use architecture as a setting, while A Mountain Journey Within puts the landscape inside a portrait silhouette. The River Remembers treats travel as a physical memory artwork. Choose an environmental portrait or a deliberate composite before changing the destination."],
    ["Keep scale and location coherent", "Describe one recognisable location and one time of day. Match the person's light direction to the environment; keep vehicles, mountains and doorways at the intended scale. For a personal memory, provide your own location photograph rather than asking the model to invent documentary details."],
  ], [{label:"Explore constructed travel worlds",path:"/collections/creative-transformations"}]),
  "/ai-prompts/festival": guide([
    ["Start with the actual celebration", "Diyas call for small warm light sources; Holi needs believable colour on skin and clothing; Garba needs movement and enough room for the outfit. Krishna-inspired child portraits use different props again. Keep those rituals distinct instead of mixing every festival decoration into one image."],
    ["Check light, clothing and context", "Preserve the reference person's complexion under coloured light. Ask for readable fabric texture rather than a metallic costume effect. Check culturally specific props and gestures with someone familiar with the celebration, and avoid invented sacred text or logos."],
  ], [{label:"Diwali, Holi, Garba and Krishna portrait collection",path:"/collections/indian-festivals"}]),
  "/collections/romantic": guide([
    ["Choose a moment, not just a backdrop", "A Little Rain uses close shelter and wet city reflections; Barefoot at Blue Hour leaves room for the beach; Old-school Charm makes the journey part of the memory. Pick the interaction that suits the couple before choosing clothes or adding decorative props."],
    ["Still portrait or moving story?", "For a photograph, specify the exact shared gesture and where each person looks. For the anniversary slow-dance reel, preserve the sequence and gentle movement instead of turning every frame into a camera-facing pose. Keep both identities separately identifiable throughout."],
  ], [{label:"All couple photo ideas",path:"/ai-prompts/couple"}]),
  "/collections/cinematic": guide([
    ["Use one clear lighting idea", "City Lights relies on practical night lights; Katana in the Square of Light builds a controlled backlit set. The Projectionist Is Me uses an architectural projection as its main event. Mixing every lighting effect can flatten these differences: retain the key source and its intended shadows."],
    ["Protect the storytelling mechanism", "Choose a believable reaction to the scene, not a default smile. In an impossible environment, check perspective and contact shadows before adding haze or grain. For reels, preserve the hook and payoff; a slow camera push alone does not replace the action."],
  ], [{label:"Creative transformations and illusions",path:"/collections/creative-transformations"}]),
  "/collections/studio": guide([
    ["Choose portrait light or product light", "A professional headshot needs even facial exposure; a bridal portrait needs fabric and jewellery detail; a product hero must preserve packaging and label geometry. Start with the closest subject type, then alter backdrop colour without changing the light's purpose."],
    ["Build a controlled set", "Limit the scene to the backdrop, one main light and the props called for by the prompt. Keep feet or products grounded with contact shadows. For square profile use, leave a circle-safe margin; for fashion, leave enough frame to read the complete silhouette."],
  ], [{label:"Profile-picture crop guidance",path:"/collections/instagram-profile-picture"}]),
  "/collections/dating-profile": guide([
    ["Show different parts of ordinary life", "Coffee, a bookshop, a park and a kitchen communicate different interests. Use one as an opening portrait and another as an activity image; four variations of the same camera-facing smile tell less of a story. Choose an activity you genuinely enjoy."],
    ["Keep the result honest", "Use current photographs, natural proportions and everyday clothing. Avoid invented luxury, job claims or physical transformations. A cup or book should support the moment, not cover the face. Check that the expression feels like you rather than a stock advertising pose."],
  ], [{label:"Motion versions with a beginning and payoff",path:"/collections/dating-profile-reels"}]),
  "/collections/dating-profile-reels": guide([
    ["Give the everyday moment a small arc", "The coffee reel moves from the cup to a reaction; the bookshop reel follows a choice; park conversation uses a response; cooking gives the activity a finish. Follow the scene timings rather than extending the still photograph with an arbitrary zoom."],
    ["Keep movement restrained", "Use a short, readable action and a stable identity across frames. Let eye contact arrive naturally after the activity. Avoid rapid cuts, exaggerated laughter and finger-heavy gestures if the model cannot keep them coherent. The still image is concept art, not proof of a rendered video."],
  ], [{label:"Equivalent still-photo ideas",path:"/collections/dating-profile"}]),
  "/collections/instagram-profile-picture": guide([
    ["Design for a small circle", "Soft Light prioritises readable identity; Meet Your New Profile Picture adds colour separation; A Fold Around You frames the face with a built set; Small Burst of Motion adds controlled illustration. Keep the distinctive detail near the face, inside a circle-safe central area."],
    ["Test the crop before posting", "Preview the square result at avatar size and in a circular mask. Eyes should remain clear, with room above the hair and no important graphics at the corners. Reduce background contrast if it competes with the face; do not compensate by sharpening skin or whitening the complexion."],
  ], [{label:"Studio lighting alternatives",path:"/collections/studio"}]),
  "/collections/indian-festivals": guide([
    ["Four celebrations, four visual directions", "Krishna-inspired portraits depend on the flute, feather and age-appropriate clothing. Diwali scenes work through diya light and family connection. Holi uses powder and spontaneous expression, while Garba uses dance and textile movement. Pick the tradition first and keep its props coherent."],
    ["Personalise respectfully", "Use references for the people and clothing you intend to show. Keep infants and children age-appropriate, preserve natural skin under coloured lighting, and check garments and gestures before sharing. These are creative images, not documentary records of an event that actually happened."],
  ], [{label:"More festival portrait guidance",path:"/ai-prompts/festival"}]),
  "/collections/creative-transformations": guide([
    ["Choose one impossible rule", "The River Remembers turns memory into material; the Tailor's Mountain Range changes scale; Monsoon Paper builds sculptural depth; One Day, Four Possible Worlds keeps one identity across separate scenes. Each succeeds when the viewer can understand one visual rule immediately."],
    ["Change the surface, preserve the mechanism", "You can adapt a colour palette, personal keepsake or location, but retain the prompt's perspective, repetitions and material behaviour. Reflections and projections may intentionally show one identity more than once. Check that these are coherent depictions, not accidental extra people."],
  ], [{label:"Travel-based transformations",path:"/ai-prompts/travel"},{label:"Cinematic sets and lighting",path:"/collections/cinematic"}]),
};

export const promptGuides: Record<string, EditorialGuide> = {
  "coffee-and-a-real-smile": guide([
    ["Choose a genuine café moment", "Use a current identity reference and ordinary clothing. Keep the cup below the face, with a relaxed hand around it rather than a complicated grip. A small amused reaction suits the conversation implied here; teeth do not need to show."],
    ["Vary the setting without adding status claims", "Change the café colour or seat position, but retain soft ambient light and the everyday scale. Avoid invented luxury accessories. For a profile sequence, pair this close, sociable image with the bookshop or park idea rather than another seated coffee pose."],
  ]),
  "the-bookshop-detour": guide([
    ["Let the book selection tell the story", "Keep attention on the shelf or selected book before introducing eye contact. Use a readable face angle without making the person hold a book squarely toward the camera. Avoid inventing a visible book title; cover lettering is a common source of image errors."],
    ["Preserve a plausible browsing gesture", "Inspect fingers along the book spine, shelf perspective and the direction of the gaze. Change shelf colour or clothing if desired, but keep the browsing action distinct from a posed library headshot."],
  ]),
  "sunday-park-conversation": guide([
    ["Use the space between camera and subject", "Keep the person engaged with an implied conversation rather than rigidly facing the lens. Choose an unhurried expression and natural outdoor posture. The path and greenery should provide depth without becoming a dramatic travel landscape."],
    ["Adapt time of day carefully", "If changing the daylight, update facial shadows and background light together. Avoid a brightly lit face against a dark park. Keep clothing ordinary and leave enough environmental context to distinguish this from the tighter café portrait."],
  ]),
  "something-good-in-the-kitchen": guide([
    ["Keep the cooking action simple", "Choose a single plausible action already supported by the scene, such as mixing or preparing an ingredient. Let the expression follow concentration or a small reaction to the activity. Do not force simultaneous eye contact, laughter and complicated knife work."],
    ["Check the working surface", "Inspect hand-to-utensil contact, food scale and counter perspective. A kitchen that looks lived-in can communicate an interest better than an invented luxury set. Keep appliances and brands unobtrusive, and reject unsafe or anatomically impossible handling."],
  ]),
  "the-river-remembers": guide([
    ["Make the memory specific", "Use a personal travel photo whose person and river setting remain readable. Change the keepsake's colours or the remembered location, but retain the prompt's physical artwork construction and perspective. The memory should feel contained in the object, not pasted over the face."],
    ["Review the material illusion", "Check edges, paper depth and contact shadows at full size. Reject a result that turns the person into a second unrelated portrait or replaces the material construction with an ordinary landscape background."],
  ]),
  "a-mountain-journey-within": guide([
    ["Build the portrait before the landscape", "Choose a reference with a clean, readable facial outline. Keep the mountain scene inside the intended silhouette and leave the identity-defining profile intact. Personalise the mountain range or atmospheric colour without moving the face into an unrelated outdoor portrait."],
    ["Control the composite", "Use the prompt's restrained mood rather than the reference photograph's smile. Check that landscape texture does not obscure the eye, nose or lips, and that the silhouette remains readable at mobile-card size."],
  ]),
  "one-day-four-possible-worlds": guide([
    ["Choose four worlds with a shared anchor", "Keep the same person recognisable in all four scenes. Change an individual setting or clothing concept only within its panel, and preserve the original layout. Give each scene a distinct purpose without turning the set into four unrelated stock portraits."],
    ["Review the set together", "Compare face shape, complexion and body proportions across panels, then inspect each hand and prop separately. Expressions should follow each setting; consistency does not mean copying one smile four times."],
  ]),
  "portrait-cut-from-monsoon-paper": guide([
    ["Keep the portrait sculptural", "Adapt the paper palette to a personal monsoon memory while preserving the layered cut-paper construction. Use the reference to guide the portrait's geometry; do not demand photographic skin where the scene explicitly calls for paper."],
    ["Check depth and recognition", "Layer edges should cast coherent shadows, and the face should remain recognisable in the material. Reject a flat digital filter, unreadable facial layers or rain details that accidentally become text."],
  ]),
  "one-saree-three-campaign-worlds": guide([
    ["Treat the garment as evidence", "Provide clear garment photographs showing the weave, border and drape. Keep those details stable across the three campaign environments. Do not ask the model to invent unseen embroidery or change the product colour to match each background."],
    ["Compare before publishing", "Check the saree's pattern scale, border width and colour in every panel, alongside the model's identity. Use the images as creative campaign concepts until the represented product details have been verified against the real garment."],
  ]),
  "double-exposure-fashion-men": guide([
    ["Balance the two menswear views", "Use the close profile to carry recognisable facial structure and the full-length figure to show the corduroy-and-denim silhouette. Keep beard and hairline consistent between layers. Change jacket colour only after the two exposures read clearly."],
    ["Avoid a second invented person", "The profile and standing figure are two depictions of one man, not two models. Keep the full-body feet grounded, leave the translucent layer soft, and use a composed editorial expression rather than reproducing a reference smile."],
  ]),
  "double-exposure-fashion-women": guide([
    ["Use hair and silhouette as structure", "Preserve the woman's hairline and facial proportions in the soft profile, while the standing figure carries the garment shape. Keep strands from becoming an opaque mask over the layered face. Adjust the outfit's fit without slimming the person."],
    ["Separate pose from identity", "The larger profile and full-length pose can have different gaze directions but must remain one woman. Keep the studio palette warm without lightening her complexion, and inspect overlapping fabric and hair for cut-out artefacts."],
  ]),
};
