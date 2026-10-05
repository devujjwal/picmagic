import type { EditorialGuide } from "./seo-guides";

// Authored against the existing scene briefs. These are editing suggestions,
// not new generation trials or verified compatibility claims.
const reviewedAt = "2026-10-05T04:40:00Z";
function guide(
  sections: [string, string][],
  faqs?: [string, string][],
  links?: EditorialGuide["links"],
): EditorialGuide {
  return {
    updatedAt: reviewedAt,
    sections: sections.map(([heading, body]) => ({ heading, body })),
    ...(faqs && { faqs: faqs.map(([question, answer]) => ({ question, answer })) }),
    ...(links && { links }),
  };
}

export const octoberPromptGuides: Record<string, EditorialGuide> = {
  "city-lights-main-character-energy": guide([
    ["Separate subject sharpness from street motion", "Start with a sharp adult portrait showing the face at a similar three-quarter angle. Attach it as the identity reference and copy the complete prompt into your image tool. Keep the person stationary and the blur on passing commuters only. A dark olive overshirt and wet reflections carry the scene; adding light trails across the eyes defeats the contrast between a still person and a moving city."],
    ["Repair the light before adding more effects", "Inspect the hairline, jaw and overshirt edges against the moving background. Teal and amber should come from visible street sources, with readable natural complexion between them. If everything blurs, ask to sharpen only the person while retaining commuter motion. If the face turns cyan, reduce the coloured spill on skin instead of brightening the entire image. Keep this as a constructed portrait, not a claim that the person visited the pictured crossing."],
  ], [
    ["Why is my face blurred along with the commuters?", "The model may apply motion to the whole frame. Ask: Keep the same person stationary with a sharp face, hair and overshirt; restrict motion blur to background commuters. Preserve the wet street and existing light direction. Compare facial geometry with your reference after the edit."],
    ["Can I change Mumbai to my own city?", "Yes. Replace the location and storefront cues together, while keeping one crossing, wet pavement and practical night lighting. A real location reference can guide architecture. The generated scene remains an interpretation; invented shop signs should not be presented as documentary detail."],
  ]),
  "your-next-chapter-in-focus": guide([
    ["Choose a new scene or an edit of your existing photo", "This prompt constructs a navy-jacket studio portrait from an adult reference. Use a clear current photograph with both eyes, hairline and shoulders visible. If you already like your outfit and pose and only need a cleaner crop or balanced light, use A Headshot That Feels Like You instead. A reference controls requested identity, but a newly rendered jacket and background are invented presentation."],
    ["Make the headshot work at profile size", "Retain the warm grey background and gentle facial fill before changing wardrobe colour. Compare eyes, glasses, age cues and jacket seams at full size, then check a small square or circular crop. Leave space above hair and below the chin. If the result looks younger or more symmetrical, request the reference's actual features rather than a more polished face. This image cannot establish employment, qualifications or an official identity."],
  ], [
    ["Do I need a suit photograph as my reference?", "No. A sharp current face and visible shoulders are more useful than formal clothing. The prompt requests the jacket separately. Preserve your actual build; generated tailoring is a visual sketch, not evidence of fit or a garment you own."],
    ["How do I keep glasses from becoming distorted?", "Use a reference where the frame shape is clear and glare does not hide the eyes. Ask for a focused repair of the existing spectacle rims and lenses, retaining the face and studio light. If repeated redraws alter your appearance, use the original photograph with ordinary crop and exposure edits."],
  ], [{ label: "Edit an existing headshot", path: "/ai-prompts/professional/a-headshot-that-feels-like-you" }]),
  "golden-hour-draped-in-tradition": guide([
    ["Give the braid and border room", "Choose a reference with an unobstructed face and useful hair detail. Copy the full prompt and keep the head-to-below-hips composition so the shoulder turn, jasmine and narrow saree border remain visible together. For short hair, use the prompt's pinned jasmine option; asking for a long braid can change the hairstyle beyond the intended adaptation. Change the saree colour only after the over-shoulder pose reads clearly."],
    ["Check fabric under warm sidelight", "The ivory silk should retain folds and a woven gold edge, with warmth falling from the same side on face and arches. Check that the neck turn is comfortable and the earrings remain separate from hair. If sunset erases the border, reduce the gold cast on fabric while keeping evening light. If you are depicting an actual saree, supply its reference and compare the border width and weave before treating the result as product imagery."],
  ], [
    ["Can I keep short hair for the jasmine styling?", "Yes. Request a small pinned jasmine arrangement suited to the existing hair length. Keep the original hairline, colour and texture; do not invent a waist-length braid just to reproduce the fictional example."],
    ["Why does the ivory saree look entirely gold?", "Warm lighting can overwhelm the material colour. Ask to retain ivory fabric and a narrow woven gold border, with warm light on the illuminated folds and neutral detail in the shadows. Preserve the same person, arches and pose."],
  ]),
  "your-product-beautifully-simple": guide([
    ["Supply packaging evidence before changing the set", "Attach a sharp product photograph with the full cap, base and label visible. A second view can clarify glass thickness; it does not authorize inventing a new bottle design. Copy the prompt and keep the travertine and olive sprig as scenery. Without a reference, the amber bottle is a fictional blank-label example, not a representation of your stock."],
    ["Judge the bottle separately from the background", "Compare the silhouette, cap ridges, label spelling, liquid level and glass colour with the original. Narrow studio reflections should reveal the bottle rather than erase its edge. If packaging drifts, preserve the original bottle layer in a composite and generate only the set. A handsome stone background cannot compensate for an inaccurate label. Nothing about this image demonstrates ingredients, skincare results or product performance."],
  ], [
    ["What if the tool rewrites my label?", "Do not approve the changed label as a real listing image. Use a masked background edit or composite the untouched product over the generated set. Check text at full size; an instruction to preserve spelling is not a guarantee that an image model can do it."],
    ["Can I replace the bottle with a jar?", "Supply the actual jar and make it the authoritative product reference. Replace bottle-specific directions with the jar's visible construction, retaining the stone set and soft shadow. Do not infer an unseen lid, back label or transparent interior from a front-only reference."],
  ]),
  "small-burst-of-motion-profile": guide([
    ["Start with the square avatar, then the brushwork", "Use a clear portrait with the complete hairline and chin visible. Keep the 1:1 output and slight shoulder turn; the title describes implied movement in a still image. Place one broad coral arc and one teal arc behind the shoulders. Change their colours as a pair if desired, but keep the imperfect pigment edges and open space around the head."],
    ["Inspect the smallest crop first", "Preview the result at 40, 64 and 128 pixels in both square and circular crops. The eyes and mouth must remain readable without the arcs becoming extra arms. If the marks cross hair or cheeks, move them behind the shoulders rather than reducing the face size. If the circle trims headwear, extend the square background and retain the person's actual proportions."],
  ], [
    ["Is this an animated profile picture?", "No. It is a still square portrait with brush arcs suggesting a lively turn. PicMagic does not generate an animation, and the destination profile field may accept only still images."],
    ["How can I stop the arcs from looking like extra limbs?", "Ask for exactly two flat pigment marks behind the outer shoulder line, with no skin texture, hands or body attachment. Keep the same single person and remove any duplicate silhouette. Check the small circular crop again after editing."],
  ]),
  "between-two-gravities": guide([
    ["Keep the person upright while the architecture turns", "Use a clear adult portrait and retain the seated foreground landing. The impossible rule is a ninety-degree rotation in the far stair flight, not a rotated camera or person. Keep sideways treads, wall-projecting balusters and the far doorway visible together. You can change the rail colour, but removing those orientation cues makes the scene an ordinary stairwell."],
    ["Trace one continuous concrete ribbon", "Follow the near landing into the sideways flight. Check the joint, rail spacing and where daylight casts shadows. If the person floats, repair only the seat and feet against the upright landing. If the stairs simply turn a corner, explicitly rotate the far flight across the wall while leaving foreground gravity unchanged. Judge this as fictional architecture, never as a design for a real staircase."],
  ], [
    ["Why does the result look like a normal staircase?", "Specify that the entire far flight is rotated ninety degrees: treads run sideways on the wall, balusters project horizontally and the far doorway shares that rotation. Keep the camera level and the seated person upright."],
    ["Can I use the preview as an architecture reference?", "Use it only to explain the illusion. It is a fictional impossible structure, with no verified load paths, dimensions or construction suitability. Your portrait remains the identity reference."],
  ]),
  "the-listening-room-has-tides": guide([
    ["Build a physical soundwave around the listener", "Attach a current adult portrait and keep the listener on a normal low chair. Five broad felt ribs rise beside the chair and roll overhead; they are matte material, not glowing audio graphics. Keep the headphones, small player and face separated from the sculpture. Change the felt-edge colour before adding more ribs or props."],
    ["Check space around the head and seat", "Look for gaps between headphones, ears and the nearest felt edge. The ribs should connect to the floor with consistent thickness and shadows. If they become water, ask for tactile charcoal acoustic felt with dusty-rose edges while preserving the existing person and warm window light. If the face becomes tiny, move the camera closer rather than making the sculpture larger."],
  ], [
    ["Does the image visualize my actual audio?", "No. The wave is an invented sculptural setting, not a measured waveform or analysis of a song. No listening history or audio upload is required."],
    ["Why do I get neon equalizer bars?", "Request five broad continuous matte felt ribs with visible physical thickness and floor contact. Remove luminous bars, notes and screen graphics. Keep the accepted listener, headphones and side-window light unchanged."],
  ]),
  "chai-between-the-floors": guide([
    ["Assign each of the three seats", "Supply exactly three adult identity references, labelled left, centre and right. Use a group image only if all three faces are clear, and identify the intended people. Keep the camera at table height and all heads in the upper half of the frame. The small street-light gap establishes height; it should not turn the friends into tiny figures."],
    ["Make the shared moment physically readable", "Check three separate bodies, the shared bench and each cup. The stall rests on a visible steel bridge between balconies; nobody balances at an edge. If identities blend, repair one seat at a time against its labelled reference. Keep the cool ambient light and warm stall lamp consistent. This is an impossible fictional set, not evidence of a real outing or a location to recreate."],
  ], [
    ["Can I use this unchanged for two friends?", "No. The current prompt explicitly requests three adults. For two, revise the people count, seat assignment and constraints together; otherwise the model may invent a third friend. Never use one person's reference for multiple seats."],
    ["What if the third friend is hidden?", "Request a wider shoulder-to-shoulder bench with all three complete heads visible, keeping the camera close at table height. Identify the hidden friend by their reference label. Preserve the steel support and keep the gap below secondary to the faces."],
  ]),
  "one-step-outside-the-frame": guide([
    ["Establish the seated pose before the illusion", "Use a clear adult reference, plus a footwear reference if an actual shoe matters. Copy the full prompt and keep one person seated inside an upright display panel. One bent leg crosses the open lower edge below the knee; the face stays within the panel. Leave floor space for the shoe and its contact shadow."],
    ["Follow the leg across the boundary", "Trace hip, knee, ankle and shoe as one continuous limb. The panel edge should end or open where the leg passes, rather than cut through skin. If the model adds a second shoe or person, remove that duplicate and preserve the accepted torso. Compare real footwear details with the supplied reference; the illusion does not establish unseen sole construction or fit."],
  ], [
    ["Why does the leg look detached?", "Ask for a continuous bent leg connected to the seated hip, with the transition below the knee and no severed edge. Keep the panel as an open window illusion. Check the joint and anatomy after the edit instead of accepting a dramatic shadow that hides the break."],
    ["How do I make the shoe feel outside the picture?", "Keep the same shoe in the studio foreground with a coherent contact shadow on the real floor. Align its light direction with the panel scene and show enough panel edge to explain the crossing."],
  ]),
  "ink-took-my-coffee": guide([
    ["Keep two materials in one interaction", "Use a clear adult portrait and retain the waist-up table view. The bird is flat black ink on a cream placemat; the terracotta cup and person remain photographic. Its beak passes through the cup handle, while a short coffee trail explains the drag. Change the table colour before altering the bird or adding more objects."],
    ["Inspect the handle and drawn beak", "The beak-to-handle contact is the mechanism. Check that the bird stays on the placemat, the cup has one coherent handle and the reaching hand remains separate. If the bird turns realistic, request unshaded flat ink with the real cup unchanged. If the coffee becomes a large spill, reduce it to one curved trail so the action remains readable at mobile size."],
  ], [
    ["Why does the bird become a real animal?", "Specify an original unshaded black-ink drawing with no feathers, volume or realistic animal lighting. Keep the person, cup and table photographic. The contrast between flat ink and the real object is essential."],
    ["Can I put my own illustration on the placemat?", "Yes, with artwork you own or have permission to use. Supply it as an illustration reference, separately from your identity portrait, and retain a simple shape that can interact with the cup handle. Avoid copying a recognizable commercial character."],
  ]),
  "the-kite-in-my-notebook": guide([
    ["Prepare the child and the drawing separately", "Use a clear photograph of the child you have permission to edit, preserving their actual age. Keep the low table and secure seated pose. The kite is an empty black-ink diamond outline continuous with a line on the page; a real wide red bookmark ribbon provides the interaction. The child holds the other ribbon end gently."],
    ["Look for the page-to-air connection", "Check that the kite's lower tail still joins the sketchbook drawing, with background visible inside its outline. The red ribbon should pass from book to kite to hand without extra fingers or an impossible grip. If the kite gains paper fill, request an empty ink outline rather than changing the child's face or pose. Retain the supported chair and table; the child never flies with it."],
  ], [
    ["Can an adult reference be used to make the child?", "No. Supply a suitable child reference with permission, or create a fictional child without claiming a personal likeness. The prompt should not de-age an adult identity."],
    ["Why does the kite become solid paper?", "Ask for an unfilled black-ink diamond, with the real background visible inside and its tail continuous with the page line. Keep the ribbon photographic and gently tensioned. Preserve the child's age, identity and seated pose."],
  ]),
  "clouds-on-laundry-day": guide([
    ["Choose one impossible domestic detail", "Use an adult portrait with a readable face and keep the waist-up terrace composition. One small mist cloud hangs beside an ordinary striped shirt. A wooden peg and metal basin explain the chore. Change the shirt pattern or wall colour without adding a sky full of clouds; multiple effects weaken the ordinary laundry setting."],
    ["Check mist, grip and support", "The cloud should sag softly at its pegs and shed a few droplets into the basin. Inspect the fingers pinching one peg and the direction of the laundry line. If the cloud looks like cotton stuffing, request translucent condensed mist with soft volume, preserving the shirt and person. Keep the terrace broad and protected; this fictional scene needs no real work near a roof edge."],
  ], [
    ["How can I avoid a toy-cloud appearance?", "Request condensed mist with soft translucent edges and a few droplets, without seams, fabric fibres or a face. Keep one small cloud sagging at the pegs beside the real shirt."],
    ["What if the hand merges with the clothespin?", "Edit only the pinching hand and one wooden peg. Ask for distinct fingers holding the peg clear of the face, with the same laundry line and cloud. Retain the reference identity and the already correct clothing."],
  ]),
  "the-projectionist-is-me": guide([
    ["Use one identity in two deliberate depictions", "Supply a clear adult portrait and identify it as the source for both the foreground person and projected likeness. Keep one physical person beside the projector and one larger image on the angled plaster walls. A slight wall corner should bend the projection without cutting either face across a gap. Do not add framed portraits or extra people in the room."],
    ["Separate projected light from a second body", "Compare both faces against the same reference. The wall image needs surface grain and a rectangular light boundary; the foreground person remains naturally lit. If the projection becomes a ghost head, restore its boundary and plaster texture instead of adding haze. If the likeness differs, correct the projected face only. Keep the projector focus-knob hand separate from the wall image."],
  ], [
    ["Why are there two faces when I asked for one person?", "Two depictions are intentional: one physical adult and their projected portrait. They should share the same identity, not look like two unrelated people. A third face or second physical body is an error."],
    ["How do I prevent a floating duplicate head?", "Ask for a rectangular light projection on the plaster wall, bending gently across its corner and inheriting the wall grain. Keep the seated person photographic. Remove ghost outlines and any portrait outside that projected boundary."],
  ]),
  "the-lift-stops-at-the-ocean": guide([
    ["Show the lift and its sealed destination", "Use a clear adult portrait and keep the closer three-quarter framing. The inner metal doors retract, but an intact framed observation pane separates the dry lift from the ocean. Retain the threshold, overhead track and small unlabelled panel so the enclosure reads as a lift. One distant shoal and descending sunbeams supply depth without competing with the face."],
    ["Check the dry side of the glass", "Inspect shoes, floor and door frame for water crossing the sealed pane. The warm interior and turquoise outside can differ in colour while the face stays naturally lit. If the image becomes an aquarium selfie, strengthen the retracting lift-door cues; if water pours in, repair the continuous observation frame. This is a fantasy destination, not a depiction of an actual underwater lift."],
  ], [
    ["Why does the result look like an aquarium room?", "Keep visible retracted inner door leaves, overhead track and lift threshold, with the person inside the compact warm interior. Place the ocean beyond a separately framed sealed pane, rather than making every wall an aquarium."],
    ["Should there be water around the person's feet?", "No. The lift and person remain completely dry. Request an intact outer observation pane and dry floor, preserving the ocean depth outside and the same portrait inside."],
  ]),
  "katana-in-the-square-of-light": guide([
    ["Compose the turn, blade and square together", "Supply a clear adult reference and keep the full-body 4:5 frame. The body faces mostly away, while a comfortable over-shoulder turn reveals enough face for recognition. One downward-held sword stays clear of legs and floor. The square light panel must retain enough of all four sides to read as a square; a tight face crop loses the set."],
    ["Repair visibility without increasing the pose", "Check neck rotation, wrist grip, handle-to-blade continuity and shoe contact. If the face becomes a silhouette, add subtle frontal reflected fill while retaining the bright panel. If sunglasses erase recognition, reduce glare or retain meaningful reference eyewear. Keep the person's actual build beneath the tank top and loose trousers. This is a fictional still fashion composition; no combat action or physical recreation is needed."],
  ], [
    ["Why is the face unreadable against the panel?", "Strong backlight can overpower facial detail. Ask for subtle neutral reflected fill on the turned face, keeping the same square panel, rim light and natural complexion. Reduce haze and spectacle glare before brightening the whole scene."],
    ["What should I check on the sword?", "There should be one continuous handle and blade, held by a plausible wrist with the tip above the floor and clear of the legs. Reject a warped blade, a second sword or a blade crossing the body. Keep it a static fashion image."],
  ]),
  "standing-on-my-playlist": guide([
    ["Solve scale before screen detail", "Use one clear adult reference and copy the full prompt. First check that the high-angle view shows the complete person standing on one giant flat phone, with feet contacting its glass. Keep the phone edge visible to explain scale. Once perspective works, refine clothing or the playlist; a long list of track titles makes the geometry harder to judge."],
    ["Keep the playlist invented and readable", "Use original abstract tiles and fictional labels. Do not upload private listening screenshots or copy album art to fill the screen. Check that rows follow the phone's perspective and sit beneath the feet. If text melts, use fewer rows or add your own authorized graphic in an editor after the scene is accepted. Inspect cap, headphones and sunglasses for intersections; change one accessory at a time while preserving the reference hairstyle and build."],
  ], [
    ["Can this show my actual Spotify listening history?", "The prompt requests a fictional playlist, not a connection to Spotify or a record of your activity. For a personal theme, choose your own fictional labels or original graphics. Product names describe styling and do not imply sponsorship or ownership."],
    ["Why does the person float above the screen?", "Ask for both shoe soles resting on the glass, with coherent contact shadows and the same high-angle perspective. Preserve the phone's flat position, complete body and existing identity. Repair scale and contact before adding extra screen text."],
  ]),
};

export const octoberHubGuides: Record<string, EditorialGuide> = {
  "/collections/professional": guide([
    ["Choose between constructing and editing", "Your Next Chapter in Focus creates a new navy-jacket studio scene. A Headshot That Feels Like You edits an existing photograph while keeping its outfit and pose. Choose the edit when the source already represents you well; choose the new scene when you deliberately want invented presentation. Both need a clear current face, visible eyes and space around hair."],
    ["Check the image where it will be used", "Preview a small square or circle before selecting your headshot. Glasses, hairline and expression should remain recognizable. Compare age cues and facial proportions with the source, and reject invented credentials, badges or employer branding. If the source is too blurred to check eyes, taking a clearer photograph is more reliable than reconstructing them."],
  ], undefined, [{ label: "Edit an existing headshot", path: "/ai-prompts/professional/a-headshot-that-feels-like-you" }, { label: "Create a studio portrait", path: "/ai-prompts/professional/your-next-chapter-in-focus" }]),
  "/collections/saree": guide([
    ["Evening arches or a controlled studio", "Golden Hour, Draped in Tradition uses warm sidelight, an over-shoulder glance and ivory silk with a narrow border. The Red Saree Moment relies on a studio composition and stronger garment colour. Choose the first for setting and jasmine styling, the second for controlled textile presentation. Keep enough framing to read the drape rather than turning either into a tight headshot."],
    ["Preserve the saree you actually supply", "For a real garment, attach clear border, weave and drape references separately from the identity portrait. Changing the environment should not change embroidery, border width or fabric colour. Compare pleats and hand contact at full size. The generated image is a styling concept until the garment has been checked against the actual item."],
  ]),
  "/collections/golden-hour": guide([
    ["One look built around evening sidelight", "This small collection currently centres on Golden Hour, Draped in Tradition. Use its complete prompt for the ivory saree, jasmine and sandstone arches; it is a focused route to that look rather than a large selection of different sunset scenes. The three-quarter frame keeps the hair arrangement and garment readable."],
    ["Change warmth without changing complexion", "Keep the evening source to one side and retain detail in the shadow cheek. If fabric and skin both become orange, reduce the colour cast while preserving the light direction. For a different mood, compare the controlled lighting in the studio collection instead of combining sunset and studio effects in one prompt."],
  ], undefined, [{ label: "The complete golden-hour prompt", path: "/ai-prompts/women/golden-hour-draped-in-tradition" }, { label: "Compare studio lighting", path: "/collections/studio" }]),
  "/collections/diwali": guide([
    ["Start with the family scene available here", "A Family Evening Lit by Diyas is the current still concept in this collection. Identify each intended family member and preserve their actual ages. Small warm light sources should illuminate the gathering without replacing natural complexion or hiding faces. Keep the family interaction central instead of adding unrelated festival props."],
    ["Check flames, hands and the shared frame", "Inspect each diya, hand and garment edge separately. A flame should not pass through fingers or fabric. If additional family members are needed, supply their references and revise the people count consistently before generating. For another celebration, the Indian Festivals collection compares Holi, Garba and Krishna-inspired scenes; those have different props and gestures."],
  ], undefined, [{ label: "The family diya portrait", path: "/ai-prompts/festival/a-family-evening-lit-by-diyas" }, { label: "Compare celebration concepts", path: "/collections/indian-festivals" }]),
  "/ai-prompts/family": guide([
    ["A shared portrait, a miniature memory or a restoration", "Sunday, All Together is a family portrait; Our Courtyard, Small Enough to Hold places the family inside a handmade miniature. A Memory Worth Restoring has a different job: improving an existing scan while leaving missing information uncertain. Choose the intended output before uploading references. An invented courtyard cannot establish what was in an old family photograph."],
    ["Account for everyone before editing", "Label each intended person, their position and actual age. Check each face separately, then overlapping arms and shared props. For a newborn concept, retain supported positioning and age-appropriate proportions. Keep originals and reconstructed versions separate so relatives can tell which details were supplied and which were invented."],
  ], undefined, [{ label: "Restore a source photograph", path: "/ai-prompts/family/a-memory-worth-restoring" }, { label: "Build a miniature family scene", path: "/ai-prompts/family/our-courtyard-small-enough-to-hold" }]),
  "/ai-prompts/wedding": guide([
    ["Choose garment detail or a shared moment", "A Modern Bridal Heirloom centres on a bridal portrait, while An Intimate Jaipur Yes and Dressed for the First Dance depend on people interacting. For textile and jewellery detail, favour clear framing and controlled light. For a couple scene, decide the handhold and gaze first; two separately posed headshots cannot explain the shared moment."],
    ["Treat attire and identities as separate references", "Label each adult reference and supply actual garments or jewellery when those details matter. Preserve individual complexion and build beneath formal clothes. Check rings, fingers, drape and neckline against the sources. A generated wedding setting is an interpretation, not proof that a ceremony or venue booking occurred."],
  ]),
  "/ai-prompts/birthday": guide([
    ["Pick a portrait or a party scene", "Thirty and Entirely Yourself is an adult birthday direction; A Birthday Made of Sunshine and The Perfect Birthday Picnic use celebration surroundings. Match the actual person's age and the amount of setting you want to show. The Birthday Astronaut in Kids is a costume-based alternative for a child, with a different reference requirement."],
    ["Keep the celebration readable", "Limit the important props to the chosen concept, leaving faces and hands clear. Inspect candles, balloons and cake edges before adding more decorations. If a name or age must be exact, add it in an editor after accepting the image rather than relying on generated lettering. A decorative age number must never change the person's apparent age."],
  ], undefined, [{ label: "Child costume birthday idea", path: "/ai-prompts/kids/the-birthday-astronaut" }]),
  "/ai-prompts/fashion": guide([
    ["A garment can be the subject or the scenery", "One Saree, Three Campaign Worlds asks for garment consistency across environments. The Tailor's Mountain Range instead turns cloth into an impossible landscape. Choose the campaign when actual weave and border fidelity matter; choose the miniature artwork when material and scale tell the story. The latter is not a catalogue view of a sellable garment."],
    ["Compare the garment before the mood", "Supply clear front and detail references for real products, and identify the model separately. Inspect seam placement, pattern scale and the same person's build. Reject a scene that changes the product just to suit the background. Where a model invents unseen construction, preserve the original garment layer or return to a source-supported view."],
  ], undefined, [{ label: "Compare a three-scene garment campaign", path: "/ai-prompts/fashion/one-saree-three-campaign-worlds" }]),
  "/ai-prompts/product-photography": guide([
    ["Simple set or impossible campaign effect", "Your Product, Beautifully Simple places a bottle on travertine under diffused light. The Bottle Inside a Moment of Water builds a separate water arch behind the bottle. Start with the simple set to judge packaging; use the water treatment when the actual product already has a reliable reference. Neither scene demonstrates performance or waterproofness."],
    ["Keep an untouched product layer", "Check cap, outline, label spelling, material colour and visible accessories against the source. Background generation and compositing can preserve packaging more reliably than repeatedly redrawing it. A front photograph cannot establish back-label text or unseen geometry. Avoid approving inaccurate packaging because the surrounding campaign looks polished."],
  ], undefined, [{ label: "Controlled stone product set", path: "/ai-prompts/product-photography/your-product-beautifully-simple" }, { label: "Water-arch campaign guidance", path: "/ai-prompts/product-photography/perfume-the-water-sculpture" }]),
  "/ai-prompts/social-media": guide([
    ["Choose the crop for its destination", "A Fold Around You and Small Burst of Motion are square avatar concepts that must survive a circular crop. Standing on My Playlist and Borrowed Moon at Closing Time use vertical scenes whose props need more space. Choose an avatar for a small profile field and a scene for a feed post; squeezing a full set into a small circle loses its defining idea."],
    ["Review at the size people will see", "Check the face at 40 to 128 pixels for an avatar, then inspect the full output for hand, prop and material errors. For a scene, confirm that the person and defining effect read at phone width. Use original graphics instead of copying private app screenshots or album art. Share the image as a creative interpretation when it invents a place or activity."],
  ], undefined, [{ label: "Square and circle-safe compositions", path: "/collections/instagram-profile-picture" }, { label: "Two prompts with documented first results", path: "/guides/prompt-trial" }]),
  "/ai-prompts/retro": guide([
    ["Photographic era styling or a printed portrait", "A Frame from Another Decade uses era-inspired photographic styling. The Last Train, Printed in Two Inks deliberately translates the portrait into plum-and-saffron print texture. Choose a photograph when natural skin and fabric matter, or the print treatment when halftone, fibres and registration offsets are part of the intended output."],
    ["Keep nostalgia separate from identity", "The person's actual age, complexion and distinguishing geometry stay authoritative. Change clothing or paper treatment without substituting an actor's face, copied movie poster or invented film title. Check the printed eyes at small size; registration texture can enrich the background while making facial landmarks unreadable if applied everywhere."],
  ], undefined, [{ label: "Two-ink construction and checks", path: "/ai-prompts/retro/last-train-two-ink-portrait" }]),
  "/ai-prompts/cinematic": guide([
    ["Decide what creates the cinematic effect", "A Night at the Cinema uses a theatre setting; City Lights uses a stationary person inside commuter motion. Katana in the Square of Light depends on a geometric backlit set. Choose the source of the effect first. Adding fog, neon, lens flare and grain to every scene can conceal the different compositions rather than strengthen them."],
    ["Read the face through the lighting", "Keep the reference face recognizable under the chosen practical light or reflected fill. Check hands, prop geometry and grounded feet before adjusting atmosphere. For a night scene, retain detail in dark clothing without making it look like daylight. A moody still and a timed reel are different outputs; use the motion brief only when movement serves the scene."],
  ], undefined, [{ label: "Compare cinematic sets", path: "/collections/cinematic" }, { label: "Stationary subject with street motion", path: "/ai-prompts/men/city-lights-main-character-energy" }]),
};
