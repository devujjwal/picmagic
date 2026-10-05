import type { EditorialGuide } from "./seo-guides";

// Reviewed against each existing scene. Advice is not generation evidence.
export const remainingGuidanceDate = "2026-10-05T05:35:00Z";
function guide(sections: [string, string][], faqs: [string, string][]): EditorialGuide {
  return {
    updatedAt: remainingGuidanceDate,
    sections: sections.map(([heading, body]) => ({ heading, body })),
    faqs: faqs.map(([question, answer]) => ({ question, answer })),
  };
}

export const remainingPromptGuides: Record<string, EditorialGuide> = {
  "a-little-rain-a-lot-of-romance": guide([
    ["Prepare the umbrella interaction", "Use a couple photograph with both faces clear, or two labelled adult portraits. Assign the charcoal wool coat and cream trench to the intended people rather than letting the model guess. Keep the transparent umbrella above both heads and the two faces turned toward one another; a close half-body crop should still include the handle and their hands."],
    ["Check rain through the canopy", "Inspect the umbrella rim, handle, fingers and overlapping shoulders. Reflections belong on the wet street and canopy, not as streaks through the faces. Ask to repair only the umbrella if its shaft splits or passes through a head. This constructed Seoul scene does not demonstrate a real trip or weather event."],
  ], [
    ["Why does the umbrella hide one face?", "Raise and tilt only the canopy so both complete faces remain visible beneath it. Keep a single handle and a plausible shared grip; do not move either identity to make room."],
    ["Can both people wear the same colour?", "Yes, but keep each identity explicitly labelled. Different silhouettes or coat textures help the viewer separate the two bodies when the clothing overlaps."],
  ]),
  "somewhere-in-the-mediterranean": guide([
    ["Use the staircase as composition", "Supply a clear adult portrait and retain enough frame for the linen dress, market bag and feet. The white steps and blue shutters lead the eye toward the person; choose one architectural direction rather than adding boats, cafes and a beach into the same frame. A location photograph can guide the setting without supplying a replacement face."],
    ["Separate bright walls from skin", "Whitewashed walls can be luminous while the face keeps natural detail. Check the bag handle through the fingers and the placement of shoes on individual steps. If the dress merges with a wall, adjust its local contrast rather than darkening the whole scene. Invented architecture should be described as Mediterranean-inspired, not a verified landmark."],
  ], [
    ["Why are the feet floating above the steps?", "Place each foot on a defined tread with matching contact shadows. Keep the camera level and preserve the original body proportions rather than lengthening the legs."],
    ["Can I change the market bag?", "Replace that one accessory with a similarly sized plain bag. Keep the strap and grip simple; detailed lettering or a logo needs an actual product reference and separate accuracy checks."],
  ]),
  "the-birthday-astronaut": guide([
    ["Keep the costume handmade and comfortable", "Use an authorized photograph of the actual child, preserving age and proportions. Keep the silver costume lightweight, with the helmet tucked under one arm rather than covering the face. The cardboard moon and paper stars establish a birthday set, not a realistic spacecraft or a branded space suit."],
    ["Check the arm beneath the helmet", "Inspect the elbow, wrist and visible fingers supporting the prop. Leave space around the shoes and costume cuffs. If the helmet becomes a second head or the suit makes the child look older, repair the prop and clothing only while restoring the reference child's features. Do not infer a child's face from an adult reference."],
  ], [
    ["Can the child wear the helmet?", "That changes the current face-visible composition. For this prompt, keep it under the arm; a helmet-on version needs a transparent visor and a separate check that the face is not obscured."],
    ["How do I add a birthday number?", "Add readable lettering in a normal layout editor after generation. Keep the clean image as the base instead of relying on the model to spell or draw the number correctly."],
  ]),
  "old-school-charm-new-memories": guide([
    ["Coordinate two people without copying two faces", "Label both adult references and assign the mustard saree and cream shirt explicitly. Keep the maroon car parked and secondary to their shared laugh. A wide frame should include the garment drape and enough vehicle silhouette to suggest a vintage outing without making the couple tiny."],
    ["Inspect the car and garment boundaries", "Look for car panels passing through a body, invented extra doors and a saree edge fused to the vehicle. Keep the subdued film colour but retain each person's natural complexion. Change the car colour before adding props; a busier street can obscure the interaction. The vintage treatment is a fictional styling choice, not a dated family photograph."],
  ], [
    ["Why do both people have the same face?", "Reattach or relabel each reference by position and repair one identity at a time. Coordinated clothing and laughter must not make the model average their facial geometry."],
    ["Can I use a real family car?", "Supply its photograph separately as the vehicle reference. Compare body shape and details; the generated background cannot certify the real car's exact specification."],
  ]),
  "the-red-saree-moment": guide([
    ["Make the balcony portrait about the drape", "Use a current adult reference with a clear face. Keep the three-quarter crop wide enough for both hands and the red-and-white cotton drape. The iron railing should sit beneath the resting hand, not cut across the torso. Start with overcast daylight before adding jewellery or a busier Kolkata background."],
    ["Trace fabric and fingers separately", "Check the saree border from shoulder to waist and the fingers where they touch the railing. Repair a discontinuous border locally rather than requesting a new outfit and face together. The setting may evoke Kolkata without reproducing a specific balcony; use a location reference when architectural fidelity matters."],
  ], [
    ["Why does the railing pass through my hand?", "Place the relaxed hand visibly on top of one continuous rail, with separate fingers and a small contact shadow. Preserve the face, drape and camera position."],
    ["Can I recreate my own saree?", "Attach a clear garment reference and identify the border and fabric as authoritative. Check those details against the original instead of treating a similar colour as an exact reproduction."],
  ]),
  "quiet-confidence": guide([
    ["Choose a seated workplace portrait", "Use a clear adult reference and retain the charcoal suit, burgundy knit tie and oak desk as restrained styling. This differs from a close headshot: the desk and architectural window explain the setting. Keep the waist-up crop and relaxed shoulder position rather than demanding a full room and a large face simultaneously."],
    ["Keep authority separate from age", "Formal clothing is not permission to make the person older or alter their jaw. Check the tie knot, lapels and hand position near the desk edge. Match the broad window light to the face and furniture; do not combine opposing studio highlights. A generated office portrait must not imply a real employer or professional credential."],
  ], [
    ["Why does the result make me look older?", "Restore actual age cues and facial geometry from the reference while retaining the suit and office setting. Avoid requests such as executive face that can replace the person's appearance."],
    ["Should I use this for a tiny profile icon?", "A tighter headshot usually reads better at small size. If cropping this result, leave the entire head inside the circle and check the eyes at the final display size."],
  ]),
  "a-birthday-made-of-sunshine": guide([
    ["Let the cake support the portrait", "Use one adult reference and a seated garden composition. Keep the small lemon cake below the face and the cobalt dress distinct from flowers. Choose the laugh and cake placement first; multiple balloons, candles and gifts can create competing focal points or hide the hands."],
    ["Control patches of sunlight", "Inspect the eyes and cheeks for harsh leaf-shaped shadows. Dappled light should describe the garden without obscuring identity. Check that the cake sits flat on the table and that decorative flowers do not become extra fingers. Change one prop at a time, and add any birthday lettering later in a layout editor."],
  ], [
    ["Why is the cake blocking my face?", "Lower the cake onto the garden table and keep it below chest level. Preserve the seated pose and expression instead of enlarging the cake into the foreground."],
    ["Can I use a quieter expression?", "Yes. Replace laughing with a natural closed-mouth smile while keeping the same facial identity, scene and light. Expression changes should not reshape the teeth or jaw."],
  ]),
  "a-family-evening-lit-by-diyas": guide([
    ["Account for every family member", "Supply the intended family group with all faces clear, or label separate references and their seated positions. State the exact person count. Indigo, cream and marigold clothing can coordinate without making every face or outfit identical. The brass diyas belong in front of the group with visible separation from hands and fabric."],
    ["Keep the lamps warm and faces readable", "The flame colour does not need to turn every complexion orange. Retain soft warm fill so all faces remain clear, then inspect each identity and overlapping arm individually. This is a fictional festive scene; do not use unstable lamp placement or flames touching clothing as a visual model for a real celebration."],
  ], [
    ["Why has a family member disappeared?", "Repeat the exact count and seat labels, widen the composition slightly and request all complete faces visible. Do not allow the tool to invent a replacement person for a missing reference."],
    ["Can I use our couple photo for a larger family?", "Not without references for the additional people. A couple photo establishes two identities only; requesting a family otherwise invents people."],
  ]),
  "the-desert-in-your-rear-view": guide([
    ["Choose portrait scale before dune scale", "Attach one adult reference and keep the linen shirt and parked four-wheel-drive understated. A wide environmental frame needs enough face detail to remain recognizable. Put the vehicle beside the person rather than between the camera and their body; the dunes should establish depth, not reduce the subject to a silhouette."],
    ["Ground the person and vehicle", "Check shoe contact, tire placement and consistent sunset shadows on sand. The cool shadows can contrast with warm highlights without changing natural skin tone. A fictional vehicle is not a reliable depiction of a particular model, and a generated desert scene is not proof of an expedition."],
  ], [
    ["Why is the vehicle partly buried?", "Restore visible tires on a plausible sand surface with coherent contact shadows. Keep the person, dune horizon and light direction unchanged."],
    ["Can I make the dunes more dramatic?", "Increase distant dune height without shrinking the face or putting the person on an unstable crest. Keep one readable foreground and a level horizon."],
  ]),
  "a-modern-bridal-heirloom": guide([
    ["Give the ornaments enough frame", "Use an authorized adult reference and a seated half-body view showing the bun, forehead ornament, waist belt and resting hands. The emerald Kanjeevaram drape and jasmine establish the styling. If reproducing a real bridal ensemble, supply garment and jewellery references separately rather than expecting the prompt to identify them."],
    ["Check construction, not just sparkle", "Trace necklaces, earring attachments, saree borders and the waist belt. Jewellery must not merge into skin or duplicate across hands. Rembrandt light can leave a soft shadow triangle while keeping both eyes and natural complexion readable. Ask someone familiar with the intended styling to inspect cultural details before sharing."],
  ], [
    ["Why is the forehead ornament obscuring the eyes?", "Move only the ornament above the eyebrows and restore clear eye contours. Retain the reference face and do not change forehead proportions to accommodate jewellery."],
    ["Is this an accurate record of my wedding outfit?", "Not automatically. It is an interpreted portrait; compare all garment and jewellery details with real references before describing it as an exact outfit recreation."],
  ]),
  "the-forest-princess": guide([
    ["Keep the storybook styling age-appropriate", "Use a permitted reference of the actual child. Retain a simple leaf crown, comfortable moss-green dress and a gentle reach toward light. The child-eye-level crop should show enough arm and hand to understand the gesture without adding adult fashion posing or replacing the child's features."],
    ["Separate leaves from fingers", "Inspect the crown at the hairline and the reaching hand against the ferns. Light shafts should sit in the surrounding air, not erase facial features. If the forest becomes too dark, add gentle face fill rather than skin whitening. The image is a fictional woodland scene, not advice to pose a child in an unsafe outdoor location."],
  ], [
    ["Why does the leaf crown grow out of the head?", "Make it a separate lightweight band resting above the hairline with visible leaf edges. Preserve the child's hair and head shape."],
    ["Can I use an adult portrait as the reference?", "No. Supply the intended child's authorized photograph; do not age an adult down or invent a child likeness from it."],
  ]),
  "sunday-all-together": guide([
    ["Assign a simple kitchen action to each person", "Provide the actual family references and count. Keep the island uncluttered enough to see faces and hands, with one person mixing or holding a plate and others reacting naturally. A wide documentary frame benefits from distinct positions instead of several people competing for the same utensil."],
    ["Review the shared work surface", "Inspect bowl rims, plates, fingers and reflections before judging the warm atmosphere. Keep hot pans and active cooking separate from young children in the composition. Correct one prop or hand at a time. This generated candid moment should not be described as an unedited record of a family breakfast."],
  ], [
    ["Why are there extra hands around the bowl?", "Assign one utensil holder and keep everyone else's hands in separate resting positions. Restore the exact number of people and arms using the labelled references."],
    ["Can I change pancakes to another food?", "Change the food, utensils and action together. A mixing-bowl scene cannot accurately describe a meal requiring unrelated equipment without revising the composition."],
  ]),
  "paris-without-a-plan": guide([
    ["Make the folded map a believable prop", "Use one adult reference and retain the trench coat, loafers and ordinary cafe setting. A full-body street view needs shoes and a clear face, with the map held below the chin. Keep its lettering unreadable; this prompt supplies the idea of exploring, not a usable street map."],
    ["Judge likeness without relying on colour", "In black and white, compare eye spacing, hairline and facial structure rather than skin colour alone. Check the map fold and finger grip, then shoe contact with the pavement. Film contrast should retain detail in the coat and face. The scene is Paris-inspired unless actual location references establish the architecture."],
  ], [
    ["Why does the map contain nonsense text?", "Keep map markings abstract or replace the prop with a simple folded sheet. Add any real navigation information separately; never use generated map text for directions."],
    ["Can I retain the reference's colour clothing?", "The current treatment is monochrome. A colour version is a distinct edit: revise the film treatment as well as clothing colour and inspect complexion again."],
  ]),
  "the-art-of-standing-still": guide([
    ["Build the pose around a graphic shadow", "Supply a clear adult reference and keep the cobalt suit, curved white wall and angular stance as one editorial idea. A full-body frame should retain the complete shoes and head. Establish the body's actual proportions before increasing the sculptural shoulder shape or asking for stronger contrast."],
    ["Keep shadow geometry consistent", "Follow the hard light from the person to the wall and floor. A crisp shadow must attach plausibly at the feet rather than resemble a second body. Inspect suit seams around bent joints. Change the wall curvature or outfit colour independently, preserving pose and identity between edits."],
  ], [
    ["Why does the shadow look like another person?", "Use one continuous cast shadow from the existing subject and one directional light source. Remove independent facial or limb detail from the shadow."],
    ["Can I use a looser pose?", "Yes, but revise the shadow to match the new stance. Keeping an old angular shadow under a relaxed body makes the scene physically contradictory."],
  ]),
  "coffee-rain-and-college-days": guide([
    ["Keep two adult identities and two clear positions", "Label both couple references and assign the denim jacket and checked shirt. Use the half-body crop to show their shared joke, chai and rain-speckled window. The campus setting is nostalgic styling, not an instruction to make the adults younger or replace their actual features."],
    ["Let rain stay on the window", "Check chai-glass grips, steam and overlapping elbows; the glasses do not have cup handles. Raindrops should remain on glass behind the couple, while the warm interior and soft daylight illuminate the faces. If steam covers a face, reduce that local effect without changing the expression. Treat the result as a constructed memory scene, not documentary evidence of college attendance."],
  ], [
    ["Why did the tool make us teenagers?", "State that both supplied people are adults and preserve their actual age cues. Change campus styling only, not identity or age."],
    ["Can both people share one cup?", "The contact becomes harder to render. Begin with one simple cup holder and separate hands; introduce a shared grip only if that interaction is essential."],
  ]),
  "built-on-quiet-discipline": guide([
    ["Use a between-sets portrait, not an action shot", "Attach a current adult reference and retain the plain training shirt, seated pose and relaxed hands. The worn boxing equipment establishes the gym without needing an invented muscular body or a punch frozen at an impossible angle. Keep the three-quarter crop readable and the face close enough for comparison."],
    ["Distinguish contrast from body alteration", "Side light can emphasize existing contours but must not change physique or facial shape. Check hands, wrist position and seat support in the deep shadows. Lift local shadow detail if needed instead of requesting a stronger athletic body. This fictional gym portrait should not imply actual training history or performance."],
  ], [
    ["Why does the result enlarge my shoulders?", "Restore the reference's actual build and shirt fit. Keep the gym, pose and lighting; remove requests for exaggerated muscle definition."],
    ["Can I add boxing gloves?", "Add one clear glove configuration and revise the hand pose accordingly. Avoid mixing bare fingers, wraps and closed gloves on the same hand."],
  ]),
  "a-little-holi-happiness": guide([
    ["Use small colour marks rather than a hidden face", "Start with a clear portrait and keep the white cotton kurta and pink/yellow cheek marks simple. Open shade preserves facial detail better than adding powder clouds across the eyes. The visible colours are a creative treatment, not permission to replace the person's natural complexion."],
    ["Check where powder meets skin", "Keep colour as a light surface mark with skin texture underneath. Inspect eyes, nostrils and lips for accidental coverage, and reduce oversized powder patches locally. Generated styling does not establish the safety of any real powder or product; do not infer a product recommendation from the picture."],
  ], [
    ["Why is my whole face pink?", "Limit pigment to small cheek marks and restore the reference complexion elsewhere. Keep eyes, lips and facial landmarks unobstructed."],
    ["Can I add a cloud of powder?", "Put a restrained cloud behind the shoulders, not through the face. Review the silhouette and eyes again after adding it."],
  ]),
  "the-gentlest-new-beginning": guide([
    ["Require references for the actual people", "Use authorized photographs of the newborn and intended caregiver or caregivers. Label the exact count and positions; an adult couple reference alone cannot establish a baby's identity. Keep the newborn fully wrapped and visibly supported, with the window setting secondary to the close interaction."],
    ["Review support before atmosphere", "Inspect the head, neck, blanket and caregiver arms as one coherent arrangement. Reject floating bodies, unstable positioning and invented extra fingers. This is a generated portrait concept, not newborn handling or posing advice. Do not redraw missing facial details from a poor source as though they were recovered information."],
  ], [
    ["Can the tool create our baby from our faces?", "No reliable likeness follows from the parents' references alone. Use the actual newborn's authorized photo or clearly label any invented infant as fictional."],
    ["Why does the blanket become a second arm?", "Keep one continuous wrapped blanket and restore the caregiver's separate supporting arms. Do not accept decorative softness that obscures whether the baby is supported."],
  ]),
  "made-for-the-mountains": guide([
    ["Balance landscape scale with two recognizable faces", "Label both adult references and assign the mustard/navy trekking jackets. Keep the couple on the safe marked overlook, not a cliff edge. The wide scenic frame places them low in the composition, so use a sufficiently detailed result and inspect the faces before accepting a dramatic valley."],
    ["Check footing and sunrise together", "Trace both bodies to grounded feet and keep the railing or path geometry coherent. Sunrise rim light should agree with the mountains' shadows while leaving facial fill. A generated Himalayan scene does not verify a route, summit or travel achievement; location accuracy needs independent references."],
  ], [
    ["Why do we become tiny silhouettes?", "Move the camera moderately closer while retaining a visible valley and complete bodies. Add subtle frontal fill rather than replacing the faces with bright generic features."],
    ["Can I choose a specific mountain?", "Supply a landscape reference and name it as setting-only guidance. Verify its shape separately before presenting the image as that real place."],
  ]),
  "a-frame-from-another-decade": guide([
    ["Keep the snapshot treatment secondary to identity", "Use one adult reference and retain the burgundy varsity jacket, faded jeans and laundromat window. The full-body composition needs complete feet and enough face detail. Direct flash and evening ambience supply the 1990s feel; an era treatment does not require changing the person's actual age."],
    ["Inspect flash reflections and grain", "Check window reflections for accidental duplicate heads and keep lettering abstract. Grain should not erase the hairline or create false skin marks. If the face washes out, reduce flash intensity on the subject while retaining the evening background. Label the scene as retro-inspired, not an authentic old photograph."],
  ], [
    ["Why is there another face in the window?", "Simplify the glass reflection to a faint coherent silhouette without a second distinct identity. Preserve the main person's face and the flash direction."],
    ["Can I add a date stamp?", "Add it later in a layout editor and avoid implying the generated image was captured on that date. A visual era effect is not provenance."],
  ]),
  "soft-light-unmistakably-you": guide([
    ["Choose a timeless close portrait", "Use a current sharp reference with both eyes and the whole hairline visible. Retain the black boat-neck top, pale warm-grey background and steady gaze. Unlike an environmental portrait, this composition depends on facial recognition at small size rather than props or architecture."],
    ["Look for subtle identity drift", "Compare eyes, jaw, mouth corners and age cues at matched scale. Large frontal light should soften shadows without erasing skin texture or changing facial volume. Repair only the changed feature, and stop if the tool keeps replacing the face. For an already suitable photograph, ordinary crop and exposure adjustments may be more faithful than regeneration."],
  ], [
    ["Why does soft light make my skin look plastic?", "Restore natural skin texture and reduce smoothing while retaining the broad diffused light. Do not add invented pores or remove meaningful marks to compensate."],
    ["Can I keep my glasses?", "Yes. State that the existing frames remain part of the identity and keep the pupils readable through the lenses. Review reflections and frame arms at full size."],
  ]),
  "an-intimate-jaipur-yes": guide([
    ["Place the couple inside one arch", "Provide both adult references and assign the rose lehenga and ivory bandhgala. Keep the two people slightly apart with one clear handhold. A full-body symmetrical frame should show shoes, garment edges and the sandstone opening without shrinking the faces to decorative detail."],
    ["Separate the grip from garment folds", "Inspect the joined hands and sleeve edges first, then the arch's symmetry and dawn shadows. Correct an extra finger locally without replacing either person. Pink stone and pastel clothing should remain distinct in tone. The setting is Jaipur-inspired unless a real location reference supports more specific architectural claims."],
  ], [
    ["Why are the hands fused together?", "Use a relaxed single handhold with distinct wrists and naturally bent fingers. Keep both bodies separate and preserve the reference identities."],
    ["Can the outfits come from our own engagement photos?", "Supply those garment references explicitly and check embroidery and construction. Similar colours alone do not establish an accurate outfit recreation."],
  ]),
  "a-tiny-superhero-off-duty": guide([
    ["Use homemade costume cues", "Supply the actual child's permitted reference and keep the plain blue T-shirt, jeans and red cape. A child-height full-body frame should show a comfortable hands-on-hips pose and complete shoes. The cardboard city supports the playful idea without branded character symbols or adult heroic anatomy."],
    ["Check the cape attachment", "Keep the cape behind the shoulders, not tightening around the neck or becoming another arm. Inspect fingers at the waist and cardboard edges behind the head. Preserve the child's actual age and body proportions. This fictional set should not imply a real stunt or encourage an unsafe pose."],
  ], [
    ["Why does the child look like an adult bodybuilder?", "Restore the actual child's face, age and proportions. Keep the simple costume and remove muscular or mature styling cues."],
    ["Can I add a famous superhero logo?", "The current concept deliberately uses a plain homemade costume. Keep it original rather than introducing recognizable franchise branding."],
  ]),
  "dressed-for-the-first-dance": guide([
    ["Establish one stable dance hold", "Label both adult references and assign the satin dress and tuxedo. Keep a simple medium two-shot with faces visible and one plausible handhold. Guests stay softly out of focus, not additional identity references. Decide the pose before adding dramatic spins or multiple fabric movements."],
    ["Review the image in monochrome", "Compare each face by structure at the new angle. Check shoulder contact, fingers and dress edges, then how string lights illuminate the couple. Black-and-white contrast can hide errors in dark sleeves, so inspect the full-size result. This is a constructed wedding scene, not proof of a real ceremony."],
  ], [
    ["Why are our arms tangled?", "Simplify to one clear supporting arm and one separate handhold. Preserve both faces and describe the exact positions before requesting a new render."],
    ["Is this the same as a dance reel?", "No. This prompt creates one still moment; a reel needs a timed action and frame-to-frame continuity checks."],
  ]),
  "the-perfect-birthday-picnic": guide([
    ["Keep the picnic at the child's eye level", "Use the intended child's authorized reference and preserve actual age. The yellow gingham dress, blanket, small strawberry cake and simple bunting should remain separate shapes. Keep the child comfortably seated with visible hands rather than balancing a large cake or directing an adult fashion pose."],
    ["Check food placement and nearby hands", "The cake must rest on a stable surface and not merge into a knee or finger. Keep bunting behind the face and inspect the blanket pattern for body-boundary errors. Add readable birthday text later. The generated scene is illustration, not a record of an actual birthday picnic."],
  ], [
    ["Why does the cake float above the blanket?", "Put it on a visible small plate or low stable surface with a contact shadow. Preserve the child's seated pose and keep the cake below the face."],
    ["Can I use an older child's photo for a toddler look?", "Do not age the reference down. Adapt the clothing and picnic setting to the actual child's age instead."],
  ]),
  "the-open-road-portrait": guide([
    ["Keep the motorcycle parked", "Attach one adult reference and keep the riding jacket, parked motorcycle and helmet on the seat. A full-body environmental crop should retain the shoes and the vehicle's contact with the road. The image tells a quiet stop, not an action-riding scene or a claim about riding ability."],
    ["Trace the bike's support geometry", "Inspect wheels, stand, handlebars and the helmet's resting point. Repair mechanical geometry separately from the face. Overcast light should agree across person, bike and road; avoid adding a bright studio rim with no source. A real bike's design requires a separate reference and careful detail comparison."],
  ], [
    ["Why does the helmet become a second head?", "Place one recognizable helmet on the seat, clearly separate from the subject. Remove facial features from the prop and retain the adult's actual face."],
    ["Can this depict riding without changing the prompt?", "No. Riding needs different pose, safety equipment, framing and wheel motion. Keep this composition a stationary roadside portrait."],
  ]),
  "a-winter-window-story": guide([
    ["Use the cup and window for a quiet gesture", "Supply a clear adult reference and keep the oatmeal sweater and ceramic cup below the face. A three-quarter crop should show one plausible grip without turning the mug into the main subject. Frost belongs on the window, with the warm interior bounce keeping facial detail readable."],
    ["Balance cool light without replacing complexion", "Check the shadow cheek, fingers and sweater cuffs. The blue window light can be cool while natural complexion remains recognizable. If steam or frost covers an eye, remove that local effect. This differs from the garden birthday portrait through a contained indoor gesture and contrasting light, not simply a new outfit."],
  ], [
    ["Why do my fingers merge into the mug?", "Use one relaxed handle grip with separate fingers and an unobstructed wrist. Keep the mug below the chin and repair only the contact."],
    ["Can I remove the winter styling?", "Remove frost and revise the exterior light together. Retain the cup gesture and interior composition, checking that the new window view agrees with the season."],
  ]),
  "the-christmas-kitchen": guide([
    ["Assign one decorating action per person", "Provide the intended family references and exact count. Keep gingerbread, icing tools and hands separated on the wooden table. The distant tree and red/green knitwear establish the occasion; they should not crowd the faces or require everyone to reach for one cookie."],
    ["Inspect the tabletop before adding sparkle", "Check icing bags, cookie edges, finger count and flour continuity. Warm domestic light needs enough window fill for every face. Repair a single hand or tool without rerendering the group. This fictional family activity should not be represented as an unedited photograph of a real celebration."],
  ], [
    ["Why do several hands hold the same icing bag?", "Assign one holder and give the other people separate simple actions or resting hands. Preserve the exact people count from the references."],
    ["Can the cookies spell a greeting?", "Use a normal design editor for readable words after generation. Keep the generated cookies as visual props rather than relying on accurate text."],
  ]),
  "small-details-beautifully-made": guide([
    ["Supply the object's actual texture", "Use a sharp product photograph with visible edges, surface finish and the intended viewing angle. Keep the three-quarter close view and raking window light to reveal material. A texture reference helps distinguish ceramic glaze from wood or fabric; the catalogue object is not authority for your product design."],
    ["Compare surface detail with the source", "Inspect rim thickness, handles, seams and the contact with linen. Strong side light should reveal existing texture, not invent cracks or defects. If packaging or fine geometry must be accurate, preserve the original product layer and edit the surrounding set. A generated macro view cannot establish unseen craftsmanship or material quality."],
  ], [
    ["Why does the glaze look cracked?", "Restore the surface finish from the actual reference and reduce exaggerated raking contrast. Do not describe invented marks as authentic handmade detail."],
    ["Can I use this for a sales listing?", "Only after checking product fidelity. Use the real product image or a preserved product layer when the generated shape or finish differs from what customers receive."],
  ]),
  "meet-your-new-profile-picture": guide([
    ["Choose colour contrast without a busy set", "Attach one adult reference and keep the coral shirt against the sky-blue background. The centred head-and-shoulders crop and genuine laugh should remain readable at profile size. Decide the expression before changing wardrobe, and leave enough headroom for both square and circular display."],
    ["Check the smile at full size", "Compare mouth shape, teeth and cheek movement with the reference identity. A lively expression can move features naturally without replacing their structure. If the laugh looks forced, request a gentler expression while keeping lighting and colour. Test the final circle so hair, chin and eyes are not lost."],
  ], [
    ["Why does the smile change my teeth?", "Reduce the expression to a natural small smile and preserve the reference mouth geometry. Do not accept invented dental detail solely because the image looks cheerful."],
    ["Can I use another background colour?", "Change that one colour while retaining shirt, face light and crop. Recheck contrast around hair before choosing the avatar."],
  ]),
  "a-night-at-the-cinema": guide([
    ["Keep entrance light on the face", "Use one adult reference and retain the dark wool coat and asymmetric close crop. The old cinema entrance should provide a warm practical light source against blue evening shadows. Keep lettering abstract; a realistic-looking sign is not necessarily a real cinema name."],
    ["Use grain without losing landmarks", "Compare the shadow-side eye, hairline and coat edge before increasing film grain. Repair warm light spill on skin locally if it changes complexion. This is a close portrait with setting cues, unlike City Lights' commuter-motion scene. Do not present invented signage or location detail as documentary evidence."],
  ], [
    ["Why is half my face unreadable?", "Add restrained fill to the shadow side while keeping the entrance as the main warm source. Preserve the evening contrast without hiding the eye or changing facial shape."],
    ["Can I specify a real cinema?", "Use a setting reference and verify the architectural details. Add accurate signage separately where necessary instead of trusting generated lettering."],
  ]),
  "thirty-and-entirely-yourself": guide([
    ["Treat thirty as the occasion, not a face-edit instruction", "Use the actual adult reference and retain their real age cues. The cream polo, pale-blue pedestal and tiny chocolate cake create a restrained birthday portrait. Keep the full seated body and complete head in frame; avoid adding balloons and text that compete with the quiet composition."],
    ["Keep furniture and cake physically separate", "Check how the person sits and how the cake rests beside them. A pedestal edge must not cut through a leg or become a second seat. Inspect facial texture before accepting a polished studio finish. If the occasion is another birthday, revise its description without asking the model to age or de-age the person."],
  ], [
    ["Will this make me look thirty?", "It should not change the reference age. Thirty describes the celebration; retain actual facial features and age cues regardless of the preview person's appearance."],
    ["Can I add the number thirty?", "Add readable text afterwards in a layout editor. The current clean composition deliberately avoids visible lettering."],
  ]),
  "garba-under-the-lights": guide([
    ["Choose one readable turning moment", "Attach a clear adult identity reference and keep the turquoise/magenta chaniya choli prominent in a full-body frame. The skirt can move while the head and torso remain recognizable. Choose a modest turn with visible grounded feet rather than asking for several dance poses at once."],
    ["Restrict blur to moving fabric", "Inspect the face, hands, garment edges and foot contact. Festive overhead lights should agree with the courtyard shadows, while motion blur belongs mainly at the hem. Cultural clothing details need a knowledgeable review; the generated moment is not proof of a real dance performance."],
  ], [
    ["Why is my face blurred with the skirt?", "Keep the face, torso and hands sharp; limit motion treatment to the skirt hem. Preserve the existing identity and grounded stance."],
    ["Can I recreate my own outfit?", "Supply garment references and compare embroidery, drape and colour. Avoid treating a similar festive palette as an exact outfit match."],
  ]),
  "the-anniversary-slow-dance": guide([
    ["Keep the motion smaller than the frame", "Label both adult references and assign the wine-red saree and cream kurta. Start from a clear veranda two-shot with one stable dance hold. Follow the prompt's timed progression; a gentle weight shift and gaze exchange are more controllable than a spin that reveals unseen faces and tangled arms."],
    ["Review continuity, not just the opening frame", "Compare both identities, hand contact, saree edge and string-light positions at the beginning, middle and end. Repair a flickering grip before adding camera motion. The still preview illustrates the scene only; this guidance is not a documented successful video run."],
    ["What the existing video sample demonstrates", "The public roughly five-second silent clip is a legacy Kling AI VIDEO 3.0 image-to-video sample prepared on 10 September 2026 from the older veranda still. Its recorded review covered ten frames, a gentle sway and joined-hand continuity; the provider watermark remained and the loop restart changed pose slightly. It does not test the current fifteen-second, three-shot plan, every reference likeness, or compatibility with another tool."],
  ], [
    ["Why does one person change face midway?", "Reduce head rotation and camera movement, keeping both references visible and separately labelled. Inspect the full sequence rather than selecting one flattering frame."],
    ["Can I add a full twirl?", "That is a harder choreography change requiring new timing, body support and garment continuity checks. Keep the current quiet dance first."],
  ]),
  "from-suitcase-to-seaside": guide([
    ["Match three shots across the doorway", "Supply one adult reference and keep the linen co-ord, small suitcase and balcony as clear separate shapes. The default is three matched shots, cut at five and ten seconds, with a restrained camera move inside each shot. Match the rail, suitcase, clothing and light at each cut. A continuous doorway-to-balcony move is an optional adaptation requiring a revised timing plan, not the current default."],
    ["Track the suitcase and horizon", "Check that the handle, wheels, door frame and sea horizon remain consistent through the clip. A breeze can move fabric without stretching limbs or changing identity. The still is concept art, not a playable tested result, and the invented hotel view is not evidence of a real stay."],
  ], [
    ["Why does the suitcase disappear?", "Keep it in a stable resting position or assign one simple continuous carry action. Avoid having it both beside the door and in the hand at the same time."],
    ["Can I use a real hotel balcony?", "Provide a separate location reference and verify the view independently. Generated architecture can look plausible while being inaccurate."],
  ]),
  "a-birthday-in-three-little-moments": guide([
    ["Prepare the child's and helpers' references", "Use the actual child's authorized image and identify the accompanying reference parents. Keep the cake stable and the ribbon action simple. Follow the timed moments without changing the child's age or treating adult hands as interchangeable anonymous limbs."],
    ["Watch hands across each moment", "Check the ribbon, fingers and cake position at transitions as well as final frames. Preserve the same party dress and face throughout. Keep this a generated celebration plan; a still preview is not a tested animation, and adult portraits cannot establish an unseen child's identity."],
  ], [
    ["Why does the ribbon become extra fingers?", "Simplify the interaction to one helper and one visible loose ribbon, retaining distinct wrists and hands. Avoid multiple helpers reaching across the child's face."],
    ["Can I add a birthday greeting in the clip?", "Add an editable text overlay in a video editor after the image sequence is reviewed. Do not rely on generation for stable spelling across frames."],
  ]),
  "the-fragrance-reveal": guide([
    ["Start from a faithful bottle image", "Supply a sharp front or three-quarter product reference showing cap, label and liquid level. Keep the narrow softbox reflections and warm transmitted backlight separate from the bottle's actual design. Use the timed reveal as a camera or light movement, not a request for the packaging to transform."],
    ["Check every label-bearing frame", "Compare silhouette, cap, text and reflections at the start, middle and end. A plausible first frame does not establish product accuracy through the sequence. If the generator redraws the label, preserve a real product layer in a compositing workflow rather than accepting invented branding. The existing still is not a tested video sample."],
    ["What the existing video sample demonstrates", "The public roughly five-second silent clip is a legacy Kling AI VIDEO 2.1 image-to-video sample from the bottle still. The recorded review covered ten frames: one stationary bottle, stable cap and liquid level, a travelling highlight and a small lateral camera move. The provider watermark remained. This is a short sample of that older input, not a test of the current fifteen-second plan or proof of accurate reproduction of your own product label."],
  ], [
    ["Why does the label change during the reveal?", "Reduce movement and preserve the original product layer where the editor supports it. If text still morphs, stop treating the sequence as a faithful product demonstration."],
    ["Does a glowing bottle imply a product benefit?", "No. Lighting is presentation, not evidence of ingredients, effectiveness or product performance."],
  ]),
  "one-city-one-beautiful-evening": guide([
    ["Keep the person still while the setting carries motion", "Use one adult reference and retain the navy jacket and rainy pedestrian bridge. The medium profile frame needs a clear facial outline. Follow the timed progression with restrained gaze or camera movement; large turns can force the model to invent unseen identity detail."],
    ["Track railings and wet reflections", "Inspect the profile, jacket edge and bridge geometry across the sequence. Magenta and amber light should remain in the surroundings without making skin change colour between frames. The Tokyo-inspired setting is constructed, and the still preview does not verify an actual trip or a successful video generation."],
  ], [
    ["Why do the railings bend as the camera moves?", "Reduce camera travel and keep straight continuous rail geometry. Check reflections separately rather than accepting a warped bridge as motion blur."],
    ["Can I change the city?", "Revise architecture and lighting references together while keeping the same person and modest action. Do not merely relabel an invented skyline as a verified location."],
  ]),
  "a-wedding-morning-remembered": guide([
    ["Assign the bride and accompanying parent", "Supply the intended adult references and label their roles. The pale-gold lehenga and a gentle dupatta adjustment create the interaction; the parent is not an interchangeable extra. Keep the layered medium shot close enough to read both faces and the hand at the fabric edge."],
    ["Follow fabric contact through the sequence", "Inspect where fingers meet the dupatta, both expressions and jewellery continuity. Limit the adjustment to one small movement so cloth does not pass through a face. This is a planned generated scene, not documentary wedding footage; the current still does not demonstrate a successful animation."],
  ], [
    ["Why does the parent's face change?", "Provide a clear separate reference and reduce occlusion from the bride's hair or dupatta. Preserve the parent's actual age and features throughout."],
    ["Can I use only the bride's portrait?", "Not for a recognizable real parent. Supply the second identity or explicitly choose a fictional supporting person without implying they are the actual parent."],
  ]),
  "the-little-flute-keeper-reel": guide([
    ["Separate the source frame from the opening crop", "Use the actual child's permitted reference. First accept a complete three-quarter source portrait including the full flute, single feather, tilak, dhoti and sash. The first two seconds are a detail crop of that source around the flute and hands; they need not show the whole feather. Tilt up during seconds two to six, then widen to the complete source composition and hold during six to eight. Keep the existing small smile steady; no extra reaction or flute-playing motion is required."],
    ["Check cultural and identity continuity", "Watch the forehead mark, feather count, hairstyle, complexion and hands across frames. Preserve the child's actual age. A still portrait may illustrate these details but cannot show that they remain stable in animation; the video instructions are not verified compatibility evidence."],
  ], [
    ["Why does the feather multiply?", "Request one feather and reduce head movement. Inspect its attachment and silhouette at several points in the sequence, not only the opening image."],
    ["Can the child play the flute?", "That needs different mouth contact and finger choreography. Keep the current gently held prop first, without making a musical-performance claim."],
  ]),
  "the-gentlest-new-beginning-reel": guide([
    ["Make the reveal a camera change, not a pose change", "Provide the actual newborn and caregiver references. Keep the newborn fully wrapped and visibly supported in the starting frame. Follow the prompt's detail-to-portrait progression through a restrained camera reveal, avoiding movement that exposes invented anatomy or changes the supporting grip."],
    ["Check support in every frame", "Review the head, blanket and caregiver arms through the whole sequence. Do not accept floating limbs or support that disappears between frames. This is a fictional generated portrait plan, not safe-handling guidance. The still counterpart has a different output purpose and is not proof of a working reel."],
  ], [
    ["Why does the baby change appearance in the reveal?", "Use a clear actual newborn reference and limit camera travel. Do not treat reconstructed hidden facial detail as verified likeness."],
    ["Can I add a rocking motion?", "Only after a stable supported composition is established and reviewed. The current restrained reveal avoids changing the baby's pose; it should not become a tutorial for real newborn handling."],
  ]),
  "skincare-on-stone-reel": guide([
    ["Separate label crop from bottle framing", "Accept a source frame containing the complete real bottle, intact cap and readable label on stone. Seconds zero to two crop into the known label edge; two to six reveal the cap and bottle through a small camera move; six to eight hold the entire bottle. Opening detail framing does not change the source composition. Do not rotate beyond reference-supported geometry or invent lettering outside the supplied view."],
    ["Compare edges and lettering across time", "Inspect bottle outline, label, cap, stone texture and reflection at multiple points. If the packaging morphs, use a preserved real product layer and animate the surrounding scene instead. This differs from the static product prompt through continuity checks, not a claim that the shared still is video evidence."],
  ], [
    ["Why does a second bottle appear in the reflection?", "Keep one product and a restrained coherent reflection. Remove an independent duplicate silhouette rather than adding more lighting effects."],
    ["Can the video show skincare effectiveness?", "No. A generated packaging reveal cannot establish a product's effects or substantiate before-and-after claims."],
  ]),
  "ceramic-and-linen-reel": guide([
    ["Separate texture crop from the complete cup", "Accept a three-quarter source frame showing the complete cup, rim, handle, linen support and raking light. Seconds zero to two crop into the known ceramic texture; two to six move toward the handle and rim; six to eight widen to the complete cup and hold. This is an eight-second material-reveal plan, not a product photograph or a verified render. Keep the camera within reference-supported surfaces rather than inventing the unseen back."],
    ["Track texture independently from camera movement", "Inspect the rim thickness, glaze marks, cloth folds and contact shadow through the sequence. Texture should move with the object, not boil or slide across it. If accurate craftsmanship matters, animate a real product layer. The shared macro still illustrates the set but does not verify animated fidelity."],
  ], [
    ["Why do glaze marks move across the cup?", "Reduce camera movement and preserve the original product surface where supported. Sliding texture is an artifact, not evidence of a changing finish."],
    ["Can I change the material to wood?", "That is a different product concept requiring a matching reference and new surface checks. Do not transform a real ceramic product while presenting it as the same item."],
  ]),
};

export const remainingPromptFaqs: Record<string, { question: string; answer: string }[]> = {
  "barefoot-at-blue-hour": [
    { question: "Why do our faces blend together?", answer: "Label the left and right adult references separately and repair one face at a time. Keep their distinct geometry and complexions while preserving the beach composition." },
    { question: "Why do the feet float above the foam?", answer: "Ground all four feet in wet sand under shallow foam with consistent contact shadows. Retain the relaxed handhold and do not change either person's proportions." },
  ],
  "a-headshot-that-feels-like-you": [
    { question: "Do I need a new outfit for the headshot?", answer: "No. Retain the reference outfit unless you explicitly request a change. Begin with a careful crop, facial exposure and quiet background; regeneration may be unnecessary if ordinary editing solves those problems." },
    { question: "Can this recover detail from a blurry face?", answer: "It may invent plausible detail rather than recover it. Use a sharper source for a faithful professional portrait and reject changed eyes, teeth, skin texture or age cues." },
  ],
  "your-everyday-with-better-light": [
    { question: "Why does brighter lighting make me look paler?", answer: "Restrict the edit to exposure and white balance while preserving relative skin tones and texture. Compare with the original at matched scale; brighter must not mean skin lightening." },
    { question: "Should I regenerate a photo just to fix exposure?", answer: "Try ordinary tonal controls first. Use reference-aware generation only when needed, keeping framing, outfit, pose and facial geometry unchanged." },
  ],
  "a-memory-worth-restoring": [
    { question: "Can a missing eye be accurately restored?", answer: "Not from the damaged source alone. A model can invent a plausible eye; label that as reconstruction, preserve the untouched scan and use another known reference only with explicit provenance." },
    { question: "Should I colourize the restored photograph?", answer: "Keep restoration and colour interpretation separate. Preserve the source's monochrome version and label any invented colours rather than presenting them as recovered historical information." },
  ],
  "change-the-scene-keep-yourself": [
    { question: "Why is there a halo around my hair?", answer: "Correct the background mask locally around strands and spectacle arms. Preserve the untouched subject layer where possible rather than regenerating the whole person." },
    { question: "Can I keep my exact outfit and pose?", answer: "Yes; they are part of the protected subject, not the replacement background. If the tool redraws them, use a compositing workflow instead of accepting a different portrait." },
  ],
  "an-outfit-with-a-new-perspective": [
    { question: "Why does a clothing change alter my body?", answer: "Restore the original person's proportions and pose, limiting the edit to garment construction, fabric and fit. A new outfit is not permission to reshape the body." },
    { question: "Will this predict how a real garment fits?", answer: "No. It is a visual styling interpretation, not sizing or fit verification. Compare with a real garment reference and do not treat generated folds as purchase guidance." },
  ],
};
