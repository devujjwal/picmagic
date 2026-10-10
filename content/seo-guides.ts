import { octoberHubGuides, octoberPromptGuides } from "./october-guidance";
import { remainingPromptGuides } from "./remaining-guidance";

/** Reviewed, versioned editorial modules. These are not generated from tags or keywords.
 * Keep references to real library routes; new hubs need an explicit editorial review.
 * The CMS still owns introductions, membership and prompt text.
 */
export type EditorialGuide = {
  updatedAt: string;
  sections: { heading: string; body: string }[];
  links?: { label: string; path: string }[];
  faqs?: { question: string; answer: string }[];
};
const reviewed = "2026-09-24T09:15:00Z";
const guide = (sections: [string, string][], links?: EditorialGuide["links"]): EditorialGuide => ({
  updatedAt: reviewed,
  sections: sections.map(([heading, body]) => ({ heading, body })),
  links,
});
// Date only the modules actually re-reviewed; do not refresh every sitemap date.
const reReviewedGuide = (sections: [string, string][], links?: EditorialGuide["links"]): EditorialGuide => ({
  ...guide(sections, links),
  updatedAt: "2026-09-25T08:11:00Z",
});
const auditReviewedGuide = (sections: [string, string][], links?: EditorialGuide["links"]): EditorialGuide => ({
  ...guide(sections, links),
  updatedAt: "2026-10-05T10:13:44Z",
});
const postreleaseGuide = (sections: [string, string][], links?: EditorialGuide["links"]): EditorialGuide => ({
  ...guide(sections, links),
  updatedAt: "2026-10-05T13:44:06Z",
});
export const hubGuides: Record<string, EditorialGuide> = {
  ...octoberHubGuides,
  "/ai-prompts/professional": postreleaseGuide([
    ["Choose generation or faithful enhancement", "Your Next Chapter in Focus creates a new navy-jacket studio headshot from an identity reference: choose it for a new set and styling rather than a faithful edit. A Headshot That Feels Like You adapts an existing portrait with balanced facial light and a quiet grey background, retaining the original outfit, spectacles and expression unless you explicitly change them. Your Everyday with Better Light adjusts exposure, white balance and shadows only: choose it to keep the existing scene, clothing and expression."],
    ["Match the source and destination", "Use a clear current portrait for generation; enhancement requires the original photograph with recoverable detail. Both headshot options suit a small profile icon; the adapted headshot needs a sharp source with eyes and shoulders visible. The lighting-only option keeps the original composition. Enhancement preserves the source ratio unless you explicitly request a crop. Generated offices, uniforms and styling do not verify an employer, job title or credential."],
  ]),
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
  "/ai-prompts/festival": auditReviewedGuide([
    ["Start with the actual celebration", "This festival category includes Christmas as well as Diwali, Holi and Garba. For Christmas, keep the tree and warm practical lights behind a readable face; add greetings later rather than generating unstable lettering. The Indian Festivals collection also includes Krishna-inspired child portraits from the kids category. These are different memberships, not interchangeable lists. Keep each celebration's props distinct."],
    ["Check light, clothing and context", "Preserve the reference person's complexion under coloured light. Ask for readable fabric texture rather than a metallic costume effect. Check culturally specific props and gestures with someone familiar with the celebration, and avoid invented sacred text or logos."],
  ], [{label:"Diwali, Holi, Garba and Krishna portrait collection",path:"/collections/indian-festivals"}]),
  "/collections/romantic": guide([
    ["Choose a moment, not just a backdrop", "A Little Rain uses close shelter and wet city reflections; Barefoot at Blue Hour leaves room for the beach; Old-school Charm makes the journey part of the memory. Pick the interaction that suits the couple before choosing clothes or adding decorative props."],
    ["Still portrait or moving story?", "For a photograph, specify the exact shared gesture and where each person looks. For the anniversary slow-dance reel, preserve the sequence and gentle movement instead of turning every frame into a camera-facing pose. Keep both identities separately identifiable throughout."],
  ], [{label:"All couple photo ideas",path:"/ai-prompts/couple"}]),
  "/collections/cinematic": auditReviewedGuide([
    ["Use one clear lighting idea", "City Lights relies on practical night lights; Katana in the Square of Light builds a controlled backlit set. The Projectionist Is Me uses an architectural projection as its main event. Mixing every lighting effect can flatten these differences: retain the key source and its intended shadows."],
    ["Protect the storytelling mechanism", "Choose a believable reaction to the scene, not a default smile. In an impossible environment, check perspective and contact shadows before adding haze or grain. For reels, preserve the hook and payoff; a slow camera push alone does not replace the action."],
    ["Read the face through practical light", "A Night at the Cinema uses a warm theatre entrance with restrained blue fill on the shadow side. Keep the eyes readable without turning the night scene into daylight. City Lights instead keeps the person stationary inside commuter motion. Check prop geometry, hands and grounded feet before adding grain; a close still portrait and a timed reel need different instructions."],
  ], [{label:"Creative transformations and illusions",path:"/collections/creative-transformations"}]),
  "/collections/studio": guide([
    ["Choose portrait light or product light", "A professional headshot needs even facial exposure; a bridal portrait needs fabric and jewellery detail; a product hero must preserve packaging and label geometry. Start with the closest subject type, then alter backdrop colour without changing the light's purpose."],
    ["Build a controlled set", "Limit the scene to the backdrop, one main light and the props called for by the prompt. Keep feet or products grounded with contact shadows. For square profile use, leave a circle-safe margin; for fashion, leave enough frame to read the complete silhouette."],
  ], [{label:"Profile-picture crop guidance",path:"/collections/instagram-profile-picture"}]),
  "/collections/dating-profile": guide([
    ["Show different parts of ordinary life", "Coffee, a bookshop, a park and a kitchen communicate different interests. Use one as an opening portrait and another as an activity image; four variations of the same camera-facing smile tell less of a story. Choose an activity you genuinely enjoy."],
    ["Keep the result honest", "Use current photographs, natural proportions and everyday clothing. Avoid invented luxury, job claims or physical transformations. A cup or book should support the moment, not cover the face. Check that the expression feels like you rather than a stock advertising pose."],
  ], [{label:"Motion versions with a beginning and payoff",path:"/collections/dating-profile-reels"}]),
  "/collections/dating-profile-reels": reReviewedGuide([
    ["Give the everyday moment a small arc", "The coffee reel moves from a held cup to an off-camera reaction; the bookshop reel shifts attention while keeping one book in hand; the park reel responds to a greeting; the kitchen reel contains one stir and a glance up. None needs a return to its opening pose. Follow the scene timings rather than adding an arbitrary zoom or forced loop."],
    ["Keep movement restrained", "Use a short, readable action and a stable identity across frames. Let eye contact arrive naturally after the activity. Avoid rapid cuts, exaggerated laughter and finger-heavy gestures if the model cannot keep them coherent. The still image is concept art, not proof of a rendered video."],
  ], [{label:"Equivalent still-photo ideas",path:"/collections/dating-profile"}]),
  "/collections/instagram-profile-picture": guide([
    ["Design for a small circle", "Soft Light prioritises readable identity; Meet Your New Profile Picture adds colour separation; A Fold Around You frames the face with a built set; Small Burst of Motion adds controlled illustration. Keep the distinctive detail near the face, inside a circle-safe central area."],
    ["Test the crop before posting", "Preview the square result at avatar size and in a circular mask. Eyes should remain clear, with room above the hair and no important graphics at the corners. Reduce background contrast if it competes with the face; do not compensate by sharpening skin or whitening the complexion."],
  ], [{label:"Studio lighting alternatives",path:"/collections/studio"}]),
  "/collections/indian-festivals": postreleaseGuide([
    ["Choose a celebration and format", "Explore festival portraits and decorative business greetings. The adult pandal portrait, still dandiya pose and standing Diwali couple each use a different setting and composition. Durga Puja, Diwali and Dussehra greeting backgrounds leave room for your original logo and editable English or Hindi text in the festival poster maker. Existing Holi, Garba, family-diya and child Krishna ideas remain available; the child concept requires an appropriate child reference. Choose the people, props and intended use before editing. Motion plans are outside this collection."],
    ["Personalise respectfully", "Use references for the people and clothing you intend to show. Keep infants and children age-appropriate, preserve natural skin under coloured lighting, and check garments and gestures before sharing. These are creative images, not documentary records of an event that actually happened."],
  ], [{label:"More festival portrait guidance",path:"/ai-prompts/festival"}]),
  "/collections/creative-transformations": guide([
    ["Choose one impossible rule", "The River Remembers turns memory into material; the Tailor's Mountain Range changes scale; Monsoon Paper builds sculptural depth; One Day, Four Possible Worlds keeps one identity across separate scenes. Each succeeds when the viewer can understand one visual rule immediately."],
    ["Change the surface, preserve the mechanism", "You can adapt a colour palette, personal keepsake or location, but retain the prompt's perspective, repetitions and material behaviour. Reflections and projections may intentionally show one identity more than once. Check that these are coherent depictions, not accidental extra people."],
  ], [{label:"Travel-based transformations",path:"/ai-prompts/travel"},{label:"Cinematic sets and lighting",path:"/collections/cinematic"}]),
};

export const promptGuides: Record<string, EditorialGuide> = {
  ...octoberPromptGuides,
  ...remainingPromptGuides,
  "your-everyday-with-better-light": reReviewedGuide([
    ["Try an exposure adjustment before generation", "Start with the original image at its largest available size, not a screenshot of the preview. If the problem is only darkness or a colour cast, ordinary exposure and white-balance controls may solve it without redrawing the face. Use this prompt when you need a reference-aware editor, and ask for the original framing rather than forcing a 4:5 crop."],
    ["Compare the light, then the identity", "Keep the source beside the result at the same zoom. Check the shadow cheek, hairline and shirt texture: brighter should not mean paler skin, a smoother face or invented detail in a clipped highlight. If the jaw, eyes or background move, return to the original and restrict the edit to tonal adjustments. Do not use a polished reconstruction as evidence of what was in the source."],
  ], [{label:"Background replacement is a different edit",path:"/ai-prompts/men/change-the-scene-keep-yourself"}]),
  "a-headshot-that-feels-like-you": reReviewedGuide([
    ["Start with a source that can become a headshot", "Choose a current, sufficiently sharp photograph with both eyes visible, room above the hair and the shoulders in frame. A distant group photo is a poor source for facial detail. First request a head-and-shoulders crop and balanced facial light; retain glasses and the existing outfit. A grey background is optional, not a reason to replace the person."],
    ["Check whether it still represents you", "Inspect spectacle rims, lens glare, ears and flyaway hair at full size, then check the face at profile-picture size. Reject changes to age, teeth, facial shape or body proportions. If the source lacks usable eye detail, take a clearer photograph instead of asking the model to invent it. This is a profile-photo edit, not an identity-document or professional-credential verification."],
  ], [{label:"Create a new studio scene instead",path:"/ai-prompts/professional/your-next-chapter-in-focus"}]),
  "a-memory-worth-restoring": reReviewedGuide([
    ["Keep the scan as your evidence", "Save an untouched scan before making a working copy. Start with dust and scratches away from faces, then inspect fading separately. Preserve the source aspect ratio and monochrome unless you deliberately choose a labelled colour interpretation. The example on this page is not a verified restoration pair and cannot show which details existed in your family photograph."],
    ["Leave missing information uncertain", "Compare expressions, jewellery, garment borders and handwritten details with the scan. A missing eye or obscured face cannot be reliably recovered from a prompt alone; use another known photograph only as an explicitly labelled reconstruction reference. Prefer an unresolved damaged area to an invented relative. Save restored and reconstructed versions separately and explain any invented detail when sharing them."],
  ]),
  "change-the-scene-keep-yourself": reReviewedGuide([
    ["Replace the background, not the subject", "Use a source with a clear outline and choose the stone-grey wall before requesting extra props. In an editor with masking, select the background and protect the person. Match the wall's light and perspective to the existing photograph; keep the original framing instead of expanding an unseen body to fill the preview's 4:5 shape."],
    ["Inspect the boundary at full size", "Look through gaps between fingers and around loose hair, spectacle arms and translucent fabric. Halos, missing strands or old background fragments need a local mask correction, not a second complete portrait. If the tool keeps changing clothing or facial features, composite the untouched subject over the new wall rather than accepting the redraw. Retain believable contact shadows where the subject meets the ground."],
  ]),
  "an-outfit-with-a-new-perspective": reReviewedGuide([
    ["Use a pose that shows the clothes", "Choose a source with the torso and intended trouser area visible. Ask for a blazer-only edit if the photograph ends at the waist; do not invent legs to display a full suit. Mask clothing where supported and protect the face, hair, hands and jewellery. Change the outfit before requesting a different setting or light."],
    ["Treat this as a styling sketch", "Check lapels, cuffs, button alignment and the waistband against the original pose. Fingers should emerge from sleeves, not fabric seams, and the new suit should follow the actual body rather than slim it. A generated drape does not predict garment sizing, comfort or fit. For a real product, use its reference images and verify all visible construction instead of treating the invented suit as a catalogue photograph."],
  ]),
  "your-next-introduction-reel": reReviewedGuide([
    ["Choose a clip only when movement has a purpose", "Use the eight-second focus reveal as an opening to a personal introduction, not as a replacement for a still headshot on a service that accepts only images. Establish an accepted portrait first with the navy jacket, white shirt and grey background. Keep the face and shoulders inside the vertical crop before asking a video tool to shift attention from the jacket to the eyes."],
    ["Make the final hold usable", "Review the final two seconds for stable eyes, mouth, hairline and jacket texture. If the focus pull changes the face, shorten the blurred opening or use a simple editor-controlled crop of the accepted still, clearly presented as a still-image animation. Do not add lip movement without an intended speech workflow. This page offers a motion plan; the shared photograph is not a demonstrated video result."],
  ]),
  "soft-light-unmistakably-you-reel": reReviewedGuide([
    ["Use light to reveal, not to rejuvenate", "This restrained clip suits a quiet introduction: attention moves from the grey background's light boundary to the same person's face. Begin with an accepted portrait and keep the light direction fixed. Preserve the actual age, hairline and facial texture as focus resolves; smoothing skin is not part of the reveal."],
    ["Use an editor-controlled quiet introduction", "For a low-motion alternative, keep the accepted portrait as one fixed layer in a video editor. Animate a small opening blur to zero, with no face animation or perspective warp, then hold the sharp image for the final two seconds. Compare a paused final frame to the original at equal scale: glasses, fine lines and black-top texture must not change. Label this as still-image animation, not a generated performance. No moving result is documented here; the eight-second plan may need trimming for tools with other duration limits."],
  ]),
  "coral-against-the-sky-reel": reReviewedGuide([
    ["Separate the animated portrait from the avatar", "The eight-second coral-and-blue clip is a social-video idea; do not assume your profile-picture field accepts animation. Start from an accepted sharp portrait and keep the head within a central square safe area throughout the vertical sequence. Save a separate sharp still for the avatar instead of exporting the blurred opening frame."],
    ["Check the laugh frame by frame", "The moving expression must retain the same jaw, teeth and eye geometry. If the laugh distorts the mouth, reduce it to a small amused reaction while keeping the colour concept. Check the final hold in a circular crop without cropping hair or chin. The still preview illustrates styling; it is not evidence that any named tool reproduced the expression or a seamless loop."],
  ]),
  "coffee-and-a-real-smile-reel": reReviewedGuide([
    ["One cup, one small reaction", "Use a source frame with the cup already below the face and both hand and handle readable. Keep the camera still while the person lowers that same cup slightly and reacts to someone beside the camera. Do not ask for a sip, a set-down and eye contact in the same short action; each extra contact increases continuity demands."],
    ["End naturally instead of forcing a loop", "Compare the cup rim, fingers and liquid level at the opening, middle and closing frames. End on the two-second hold; do not teleport the cup back into its initial position. If grip or identity drifts, reduce hand movement and keep the reaction. This is an untested motion brief, not a promised result or evidence of a real café visit."],
  ]),
  "the-bookshop-detour-reel": reReviewedGuide([
    ["Let the gaze do the work", "Keep one closed book already in the person's hands for the full eight seconds. Attention moves toward the shelf and then the camera; there is no new book selection or page turn. Use an unbranded cover or your own material and keep incidental shelf lettering unobtrusive. The setting communicates an interest, not proof of having read a particular book."],
    ["Check object continuity before exporting", "The same book should keep its thickness, corners and grip through all three beats. If the shelf bends or extra fingers appear, retain a static hand pose and reduce the gaze change. End on the quiet smile rather than reversing the movement. Use the still-photo version if an animated result cannot retain the person and book reliably; this page does not document a successful video test."],
  ]),
  "sunday-park-conversation-reel": reReviewedGuide([
    ["A greeting, not a walking demonstration", "Start with the person planted on a level path and leave some background depth. A brief gaze change and response to an off-camera greeting provide the story; keep the feet and camera still. Gentle foliage motion can establish the setting without adding a camera orbit or a second person."],
    ["Keep the reaction plausible", "Check that the head turn does not change face shape or cause the body to slide across the path. If the expression becomes a fixed advertising grin, request a smaller friendly reaction rather than a different identity. Preserve the final hold as an ending, not an artificial loop. The preview is still concept art and the movement remains a proposed workflow."],
  ]),
  "something-good-in-the-kitchen-reel": reReviewedGuide([
    ["Prepare a readable starting frame", "Put one spoon in one bowl, with the supporting hand and countertop visible before animation. The only action is one gentle stir followed by a glance up. Keep knives out of motion, ingredients unchanged and the apron tied consistently. This is a personal-interest scene, not a recipe or a demonstration of cooking expertise."],
    ["Inspect the spoon and supporting hand", "Watch the spoon pass through the mixture without bending, disappearing or crossing the bowl wall. Keep the bowl grounded and the grip consistent. If motion fails, use a smaller stirring arc or hold the spoon still and retain only the glance. Do not claim a seamless loop or tested recipe: the closing smile is an end frame, and the shared photograph does not prove successful video generation."],
  ]),
  "the-heritage-railway-letter": guide([
    ["Keep the exchange readable", "Choose two separately identifiable adult references. The folded letter connects their hands and gaze; keep it blank and the carriage stationary. Period clothing and a heritage setting do not determine the people's age. Use a quiet relieved smile for this scene, not unrelated glamour posing."],
    ["Check the emotional centre", "Keep steam behind the couple, away from faces and hands. Inspect the two grips on opposite ends of the letter and preserve space between fingers. Change luggage or garment colour without replacing the shared exchange with two independent portraits."],
  ]),
  "perfume-the-water-sculpture": guide([
    ["Separate product evidence from the effect", "Supply a clear view of the actual bottle and readable packaging. Keep the bottle dry, upright and unchanged on its plinth. The water arc belongs behind the product; it must not replace the label, penetrate the bottle or imply a redesigned container."],
    ["Review before commercial use", "Check bottle proportions, cap shape, label geometry and any legible lettering against the source. Reflections should agree with the light and plinth. Treat the result as a concept until product fidelity has been verified; visual polish is not proof of an accurate listing."],
  ]),
  "our-courtyard-small-enough-to-hold": reReviewedGuide([
    ["Make the family readable at miniature scale", "Identify every intended family member separately and preserve their ages. The three-person example does not override your actual family. Keep the group near the model's front edge around the tiny chessboard, with enough space to distinguish faces; use a wider composition if needed rather than omitting someone. Do not duplicate one reference across different family members."],
    ["Keep the handmade construction", "Visible card, carved wood and glue seams establish that this is a shallow model on a shelf. Change personal courtyard details without converting it into a normal house photograph. Inspect chessboard scale, contact shadows and the rear balconies' recession."],
  ]),
  "the-tailors-mountain-range": auditReviewedGuide([
    ["Let cloth create the landscape", "The miniature designer, oversized spool and fabric folds establish the scale relationship. Keep the face close enough to read and the seam visible as a trail. Changing fabric colour is simpler than adding several competing giant props."],
    ["Check scale before adding detail", "Follow the fold ridges toward the distant fabric pass; shadows should make the cloth feel physical. Keep feet in contact with the fabric and inspect the spool's scale. This imaginative artwork is not evidence of an accurately represented sellable garment."],
    ["Preview stance versus requested stance", "The illustrative preview shows a walking stance, while the copyable prompt asks for a standing designer. It is not evidence of exact prompt reproduction. For the standing version, keep both feet grounded and the seam readable without adding a walking sequence; retain the truthful walking description of the existing preview."],
  ]),
  "last-train-two-ink-portrait": guide([
    ["Keep print texture away from essential features", "Use the plum-and-saffron ink treatment, coarse halftone and paper fibres deliberately. Registration offset can enrich the background, but keep the eyes readable. The diagonal carriage-window shadow crosses the shoulder, not the entire face."],
    ["Adapt the print, not a film identity", "Change the paper tone or ink balance while preserving the two-colour construction. Avoid actor references, copied film posters and invented titles. This is an illustrated print treatment, so evaluate coherent marks and recognizability rather than demanding photographic skin everywhere."],
  ]),
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
  "the-river-remembers": auditReviewedGuide([
    ["Make the memory specific", "Use a clear adult portrait and, optionally, your own river photograph. Keep the open journal on the ghat step and the curved indigo shoreline flowing from its page into the river. Change the remembered location without letting ink cover the face or turning the scene into a straight split-screen."],
    ["Review the ink transition", "Check the journal edge, hand contact and the curved shoreline at full size. The face, nearest stone and hand should stay photographic while the ink becomes the landscape. Reject a second unrelated portrait, private handwriting or an ordinary background that loses the page-to-river transition."],
    ["Repair the boundary locally", "Suggested untested repair: mask only the shoreline where it exits the journal and ask for one continuous indigo curve from paper to river. Protect the photographic face, hand and nearest stone. If ink spills over fingers, remove that spill without regenerating the portrait or flattening the transition into a straight dividing line."],
  ]),
  "a-mountain-journey-within": guide([
    ["Build the portrait before the landscape", "Choose a clear, nearly frontal reference. Keep eyes to mouth readable while the Himalayan road runs through the jacket and outer shoulder silhouette. Personalise the mountain range or atmospheric colour without covering the facial centre or introducing a second human silhouette."],
    ["Control the composite", "Use the prompt's restrained mood rather than the reference photograph's smile. Check that landscape texture does not obscure the eye, nose or lips, and that the silhouette remains readable at mobile-card size."],
  ]),
  "one-day-four-possible-worlds": postreleaseGuide([
    ["Choose four worlds with a shared anchor", "Keep the same person recognisable in all four scenes. Change an individual setting or clothing concept only within its panel, and preserve the original layout. Give each scene a distinct purpose without turning the set into four unrelated stock portraits."],
    ["Review the set together", "Compare face shape, complexion and body proportions across panels, then inspect each hand and prop separately. Expressions should follow each setting; consistency does not mean copying one smile four times."],
    ["Map and repair panels separately", "Suggested workflow, not a documented generation test: label the dominant left portrait and the three unequal curved right-side windows: night-sky observer, pottery maker and mountain traveller, and attach the same identity reference for each. If one panel drifts, mask that panel only and repeat its scene and identity instructions. Preserve the other three regions and the original curved boundaries. If a single generation cannot retain identity, assemble four separately reviewed depictions within the same asymmetric left-plus-three-right layout in an ordinary editor."],
  ]),
  "portrait-cut-from-monsoon-paper": guide([
    ["Keep the portrait sculptural", "Adapt the paper palette to a personal monsoon memory while preserving the layered cut-paper construction. Use the reference to guide the portrait's geometry; do not demand photographic skin where the scene explicitly calls for paper."],
    ["Check depth and recognition", "Layer edges should cast coherent shadows, and the face should remain recognisable in the material. Reject a flat digital filter, unreadable facial layers or rain details that accidentally become text."],
  ]),
  "one-saree-three-campaign-worlds": postreleaseGuide([
    ["Treat the garment as evidence", "Provide clear garment photographs showing the weave, border and drape. Keep those details stable across the three campaign environments. Do not ask the model to invent unseen embroidery or change the product colour to match each background."],
    ["Compare before publishing", "Check the saree's pattern scale, border width and colour in every panel, alongside the model's identity. Use the images as creative campaign concepts until the represented product details have been verified against the real garment."],
    ["Assign evidence to each panel", "Suggested untested assembly: label the dominant left basalt courtyard view and the two right-side regions: rain-lit glass pavilion and ivory sculptural studio, using the same labelled model and garment references in each. Repair only the panel with a changed border or weave, protecting the other panels and the original dominant-left/two-right composition and boundaries. If the tool cannot keep construction exact, preserve an actual garment layer in an editor or reject the inaccurate panel; matching colour alone does not demonstrate product fidelity."],
  ]),
};
