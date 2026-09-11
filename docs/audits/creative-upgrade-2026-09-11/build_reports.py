"""Rebuild Phase A planning reports from explicitly authored editorial judgments. No content writes."""
from pathlib import Path
import json,hashlib,collections,re
ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent
load=lambda p:json.loads((ROOT/p).read_text())
write=lambda name,data:(OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
paths=['content/prompts.json','content/expansion/prompts.json','content/additions/friends-trip-prompts.json']
prompts=sum((load(f) for f in paths),[])
cols=sum((load(f) for f in ['content/collections.json','content/expansion/collections.json','content/additions/friends-trip-collections.json']),[])
prod=load(str(OUT.relative_to(ROOT)/'production-public-snapshot.json'))
# Each line is a fresh, explicit human editorial judgment; photo/reel variants are reviewed separately.
raw='''0|KEEP|4|Repeated illuminated arches create an expensive architectural portrait; no further adjective-only rewrite.
1|KEEP|4|Connected eyelines under one umbrella and layered rain supply a readable two-person story.
2|UTILITY|3|A clear professional headshot solves a practical profile need; keep outside creative hero.
3|REWORK|2|Dress and staircase remain a tourist pose. Make the carried market bag release a trail of painted island memories around an intact person, or retain only as utility.
4|KEEP|4|A handmade lunar set makes a child's astronaut wish concrete; retain the uncovered face.
5|KEEP|4|Period wardrobe and an older couple's shared laugh make a personal era-memory scene.
6|KEEP|4|Sharp subject against moving Mumbai commuters makes city pace the story; do not intensify complexion with grading.
7|KEEP|4|Dhunuchi smoke, warm pandal light and a specific ritual distinguish this from a saree pose.
8|KEEP|5|Bioluminescent footprints make the shore respond to two people; preserve the corrected identity-first body.
9|KEEP|4|Glass sketches, scale model and layered city reflections give a professional idea physical depth.
10|KEEP|4|An orchard-length birthday table implies a gathering about to begin; costly location/set rather than a standard cake portrait.
11|KEEP|5|Krishna hairstyle, tilak, feather, flute and playful expression are explicit and coherent. Retain local wording and asset.
12|KEEP|5|Successive courtyard diya layers create exceptional depth around the actual family.
13|REWORK|2|Standing beside an SUV in dunes is weak. Absorb the distant-storm/highway treatment from desert-road-hero, retaining this existing canonical.
14|UTILITY|3|Bridal drape and jewellery visualization is useful even when the studio composition is conventional.
15|KEEP|4|Leaf crown, fern layers and a reaching child make a small storybook transformation.
16|UTILITY|3|Natural headshot editing is useful; resolve optional recrop versus mandatory 4:5 without broad restaging.
17|KEEP|5|A family breakfast opens into a life-size illustrated world; a clear reality-to-story threshold.
18|REWORK|3|A bookstall and trench add place but limited transformation. Let the last book's illustrated river continue into the real scene, while preserving the face and existing path.
19|UTILITY|3|Sculptural suit and shadow support fashion/posing utility; do not mistake a posed studio image for a high-concept transformation.
20|KEEP|4|The last chai before graduation gives the ordinary table an emotional occasion and a meaningful prop.
21|KEEP|4|Empty gym, discarded tape and recovery breath portray commitment without fabricating a physique.
22|UTILITY|3|An accurate bottle presentation solves seller needs; maintain supplied label rather than the example's blank label.
23|KEEP|5|Suspended powder becomes a visible colour sculpture while facial features stay clear.
24|UTILITY|3|A supported newborn with supplied caregivers is a valuable family portrait, not a fantasy pitch.
25|UTILITY|3|A mountain-overlook couple portrait is useful travel visualization but too ordinary for the main hero.
26|REWORK|2|Varsity jacket and laundromat lack action. Use a missing-train-ticket discovery at a period laundromat, with one meaningful prop and no readable generated copy.
27|UTILITY|3|Age-honest close-up utility should remain without a surreal embellishment.
28|KEEP|4|After-hours lamps and a private connected glance make a meaningful palace shoot.
29|UTILITY|3|Exposure-only correction should preserve the source crop unless recropping is explicitly requested.
30|KEEP|4|Homemade cardboard city and child-scale cape create an imaginative, non-franchise world.
31|UTILITY|3|First-dance memory is useful. Explain monochrome rendering rather than demanding literal skin colour preservation.
32|KEEP|5|A giant teddy arriving with a cake creates scale and a child-readable birthday story.
33|KEEP|5|Headlamp, approaching snow and an immense pass justify the difficult travel-film setup.
34|KEEP|4|A carved Kashmir window and first snowfall create a specific experiential moment.
35|KEEP|4|A miniature gingerbread village gives family activity a constructed-world payoff.
36|UTILITY|3|Glaze and handmade asymmetry are commercially useful details; keep the supplied handle count.
37|UTILITY|3|Readable face and colour contrast solve a small profile-picture use case.
38|KEEP|4|One person at the end of an empty screening provides emotional scale and an original fictional still.
39|REWORK|3|Abstract past/future frames are not yet an immediate visual story. Make one future frame open onto a chosen pursuit, without invented relatives or age changes.
40|KEEP|5|A readable face at the centre of circular movement is a strong festival motion concept.
41|UTILITY|3|Conservative restoration is valuable; preserve source ratio and uncertain features rather than inventing detail.
42|UTILITY|3|Background-only change is narrowly useful; do not force a crop or pose change.
43|UTILITY|3|Outfit-only edit is useful; keep original shape and make any recrop explicit.
44|REWORK|3|Album opening/title promise is stronger than the slow-dance sequence. Keep the album closed as a prop or explicitly require a supplied memory for the transition.
45|KEEP|4|A travel-case detail opens to misty Kerala water: a clear destination reveal with modest motion.
46|UTILITY|3|Ribbon-helping birthday memory is useful; partial adult hands need identity/source handling and a simpler tie action.
47|UTILITY|3|A faithful fragrance reveal is seller utility; an existing clip does not prove arbitrary label fidelity.
48|REWORK|4|City motion is strong, but still-exposure language needs a concrete temporal treatment rather than frozen/moving contradictions.
49|KEEP|4|A parent's dupatta adjustment and exchanged glance provide a specific emotional action.
50|KEEP|4|Moving shadows lead to a connected couple and private palace corridor; a coherent reveal.
51|MERGE|3|Umbrella, rain and connected eyelines duplicate the existing rain-romance mechanism; keep Indian-street treatment as an optional variant, not another photo record.
52|KEEP|4|Reflection-to-couple reveal adds temporal purpose; associate with the retained rain concept after the proposed photo merge.
53|KEEP|4|Lantern, visible faces and huge moonlit dunes make a costly, coherent couple scene.
54|KEEP|4|Sand movement leads to hands and moonlit scale; do not hide faces in the payoff.
55|KEEP|5|One letter exchanged through station steam gives a period scene a legible emotional narrative.
56|KEEP|5|Letter hand-off, reaction and carriage reveal supply a genuine short story; simplify hand transfer in production.
57|KEEP|4|Rain traces on a heritage window make maternity anticipation atmospheric without reshaping pregnancy.
58|KEEP|4|Raindrop-to-hand-to-face progression expresses waiting, with supported posture throughout.
59|KEEP|4|Supported fabric crescent is a constructed maternity set; retain actual pregnancy stage.
60|KEEP|4|Fabric edge reveals a complete crescent around the supported mother; no floating body.
61|REWORK|3|Empty nested frames do not clearly communicate generations. Require labelled family references for a generational version or rename the metaphor honestly.
62|REWORK|3|The shadow reveal inherits the ambiguous generational claim; do not invent ancestors to supply the payoff.
63|KEEP|4|Oversized folded petals give maternity a tactile commissioned-installation setting.
64|KEEP|4|Passing between stationary petals reveals the installation; foreground motion need not morph the body.
65|KEEP|5|Snow in a headlamp opens to the rider and immense mountain pass; strong scale progression.
66|KEEP|4|One lit fuel stop surrounded by mist creates a solitary road-trip chapter.
67|REWORK|4|Keep the solitary-station story; replace deliberate flicker with a steady reflection so it does not conflict with anti-flicker continuity.
68|KEEP|4|The boundary between dry shelter and a wall of rain makes a stopped rider's moment distinctive.
69|KEEP|4|Rain striking shelter reveals a dry rider and the weather boundary; avoid simulated moving traffic.
70|REWORK|4|Fix plural friends in the no-reference/preview persona against the lone rider scene. A folded map and a road disappearing into salt provide a specific scale story.
71|REWORK|4|Fix plural friends against the lone rider scene before generation. Map-to-horizon reveal has a clear visual answer; keep the rider readable before widening.
72|MERGE|4|Stronger desert-car treatment belongs under the existing desert-in-your-rear-view canonical; retain exact vehicle fidelity and add a person policy there.
73|REWORK|4|Storm reflection is a good hook; add person-and-product identity handling and a fictional human preview brief.
74|REWORK|4|Era/car contrast is explicitly intentional, but product-only persona omits the driver's full identity contract and India-first preview.
75|REWORK|4|Keep parked-car reflection-to-face story; repair driver persona and label the setting period-inspired, not historically exact.
76|REWORK|3|Neon on a parked car is still largely a pose. Add a rain-delayed last-pickup story and person-and-product policy.
77|REWORK|3|A door reflection followed by a face is not enough payoff; tie it to a specific waiting/arrival story and fix the human persona.
78|REWORK|4|Tunnel framing and cloud valley have scale; add explicit person-and-product policy and define a feasible camera side relative to the parked car.
79|REWORK|4|Tunnel-to-valley reveal works; clarify camera geography and preserve driver as well as vehicle.
80|KEEP|4|Tape, recovery breath and empty-gym reveal are emotionally specific without changing physique.
81|KEEP|4|Chalk at the peak of one modest jump is an expensive split-second setup, not a muscle transformation.
82|REWORK|4|Use a brief slowed peak followed by a real landing; do not demand chalk stay frozen through moving video.
83|KEEP|4|A physically matching large shadow makes an ordinary athlete monumental without modifying their body.
84|KEEP|4|Shadow-to-real-person reveal expresses scale; preserve actual mobility and a small stretch.
85|REWORK|3|A towel-holding stadium pose needs a visible reason to be there. Use an untied starting ribbon and one resolved preparation action.
86|REWORK|3|Opening on a towel is a weak hook. Begin with one empty starting lane, then the athlete's preparation, then vast empty stands.
87|UTILITY|3|A stable introduction clip can serve profile utility; do not spend first-batch video credits on focus alone.
88|KEEP|4|Cooling cup, closed notebook and city reflections make after-hours effort an intelligible story.
89|KEEP|4|Desk detail, thoughtful pause and empty-office reveal give context; avoid invented success metrics.
90|REWORK|4|Newsroom pace works, but anonymous staff conflict with exact team count. Separate named reference identities from permitted background extras, or omit extras.
91|REWORK|4|The blurred newsroom hook needs the same explicit background-extra contract; maintain stable sharp team identities.
92|MERGE|4|Glass sketch and model-shadow imagery substantially overlap Architect of Ideas. Fold the bridge-shadow variant into that existing canonical.
93|KEEP|4|Small bridge arch to huge shadow is a meaningful scale reveal; associate with Architect of Ideas after proposed photo consolidation.
94|UTILITY|3|An approachable cafe portrait serves dating/profile needs; never imply a fabricated lifestyle is documentary fact.
95|DEFEATURE|2|Focus and a smile add little beyond the cafe photo; keep off creative discovery and defer video.
96|UTILITY|3|A believable bookshop profile provides a distinct interest cue, without needing glamour or fantasy.
97|DEFEATURE|2|Book-to-smile movement is weak video value; keep optional profile utility only, no media allocation.
98|UTILITY|3|An unforced garden portrait supplies a useful casual full-body profile.
99|REWORK|2|The scene says standing while the hook says seated. Resolve posture and treat as utility, not a creative reel.
100|UTILITY|3|Kitchen activity provides a plausible personal-interest portrait; retain the already available asset.
101|UTILITY|3|One stir followed by a smile has clear modest utility; verify bowl matches poster and avoid presenting staged activity as factual history.
102|KEEP|4|Rain, identifiable facades and a doorway glance make travel experiential rather than a beach pose.
103|KEEP|4|Petals in a puddle lead to a quiet lane reveal; slow believable movement is sufficient.
104|KEEP|5|Walking above a cloud sea creates unusual scale while remaining on a supported path.
105|KEEP|5|Boot-to-traveller-to-cloud-sea reveal provides a strong environmental payoff.
106|KEEP|4|A brass lens and curved gallery put a traveller inside an unusual coastal experience.
107|KEEP|4|Sea reflection to readable face to gallery gives a clear spatial reveal.
108|KEEP|4|A curved train seen from the carriage frames an identifiable hill-railway experience.
109|KEEP|4|Journal, reaction and train-through-clouds reveal are coherent; journal must not carry fabricated writing.
110|DEFEATURE|2|Focus-to-laugh is not a strong separate reel; keep photo DP utility and defer motion asset.
111|DEFEATURE|2|Light-to-face focus is ordinary profile utility, not a first-batch creative reel.
112|UTILITY|3|Rain close-up and circular-safe face serve DP needs; clarify monochrome complexion rendering.
113|UTILITY|3|A rain-motion profile loop can be useful; keep outside featured cinematic stories and clarify monochrome.
114|UTILITY|3|Floral shadows around a clear face solve a modest profile styling use case.
115|UTILITY|3|One moving leaf shadow is profile utility, not a major creative reveal.
116|KEEP|5|Diya-to-family-to-layered-courtyard reveal is visually strong; all family members require references.
117|REWORK|5|Particle reveal is strong; specify a temporal powder burst and settling instead of static hanging clouds for eight seconds.
118|REWORK|5|Translate long-exposure trails into controlled background compositing; do not ask a normal video frame to use two shutter durations without an execution method.
119|KEEP|5|Flute-to-tilak-to-costume reveal follows concept essentials; preserve the already-correct child identity/hair rules.
120|UTILITY|3|Supported newborn breathing is a useful gentle family clip; ensure all supplied caregivers remain represented in final frame.
121|KEEP|4|Oversized cloud props create a commissioned birthday set with age-appropriate support.
122|KEEP|4|Cloud edge to supported baby to full set is clear; include the referenced caregiver rather than inventing one.
123|KEEP|4|Nursery and handmade lunar world meet around a supported infant; no spacewalk claim.
124|REWORK|4|Keep the set already transformed; replace the instruction that the wall becomes a diorama mid-shot, which invites morphing.
125|KEEP|4|An oversized book extends into family space while the baby stays supported.
126|KEEP|4|Illustrated leaf to family to room-scale scenery creates a tactile story reveal.
127|REWORK|4|Royal canopy is distinctive, but a supplied cat clause conflicts with generic pet applicability. Require a cat or adapt the setting to the supplied species.
128|REWORK|4|Keep the canopy reveal, but fix species handling so a dog reference is not turned into a cat.
129|KEEP|4|Harmless birthday aftermath gives a pet scene a legible comic cause and effect.
130|KEEP|4|Overturned hat leads to the dog's curious face and paper mess; the joke works without audio.
131|KEEP|4|Cardboard spacecraft preserves ordinary pet anatomy while providing an imaginative constructed set.
132|KEEP|4|Moon window to resting pet to whole spacecraft is a coherent scale reveal.
133|KEEP|4|Owner and actual pet share an oversized forest threshold; separate animal and human identity checks are needed in tooling.
134|KEEP|4|Boot and paw lead to a shared gaze and forest arch; count one person and one pet separately.
135|UTILITY|3|Bottle label-to-full-pack presentation is useful seller footage, not a creative campaign hook.
136|UTILITY|3|Texture-to-handle-to-whole-cup offers practical product understanding.
137|KEEP|5|A constructed water arc behind an unchanged dry bottle is a high-budget product illusion.
138|KEEP|5|Illuminated water edge reveals an intact bottle and full sculpture; motion execution requires separate review.
139|KEEP|4|Architectural shadows build a campaign around an unchanged handbag, with readable hardware.
140|KEEP|4|Shadow-to-stitch-to-whole-bag reveal serves campaign and product comprehension together.
141|KEEP|4|A long pallu across stone architecture makes pattern fidelity the visual story rather than merely a dressed model.
142|KEEP|4|Border-to-drape-to-corridor reveals the actual garment; reference coverage limits camera travel.
143|UTILITY|3|Jali background plus even garment light is useful catalogue location styling, but limited creative novelty.
144|UTILITY|3|Known seam and front view serve seller utility; no need for first-batch video.
145|REWORK|3|Standing in resort arches remains conventional. Let reflected pool light create a large moving shell pattern on architecture, leaving supplied garment neutral and unchanged.
146|REWORK|3|Hem motion alone lacks a hook. Use the pool-light architectural reveal while preserving exact fabric weight and print.
147|KEEP|4|Sculpted sandstone supports a difficult macro jewellery campaign without inventing stones or settings.
148|KEEP|4|Setting-to-chain-to-whole-piece makes scale and craftsmanship understandable.
149|UTILITY|3|Accurate shirt catalogue solves a seller problem; do not remove it for simplicity.
150|UTILITY|3|Cuff and front-view reveal has practical catalogue value; no need for new creative-video allocation.
151|KEEP|4|Deep lantern layers with neutral garment light create a useful festive campaign rather than altering fabric.
152|REWORK|4|Replace half-turn with a reference-supported small turn; never show unknown back details to fulfill motion.
153|UTILITY|3|Keep the jacket prompt but rename display title to match the supported view; one image does not show every angle.
154|UTILITY|3|Quarter-turn utility is sound; the every-angle title overpromises and must change without changing slug.
155|UTILITY|3|Shoe contact, stitching and realistic flex are seller utility; background blur alone is not a major campaign idea.
156|REWORK|3|Resolve frozen-step wording in the video body; use a real small step and keep the same shoes. Utility placement.
157|UTILITY|3|Reference-supported quarter rotation is practical product coverage, not an invented all-angle reconstruction.
158|UTILITY|3|Macro weave and seam provide real ecommerce utility; use actual detail references.
159|UTILITY|3|Separate supplied front/back cuts are useful; missing back correctly falls back to known front.
160|REWORK|3|No-human instruction conflicts with possible hand-scale use. Specify tabletop-only use or require a separate hand/person reference.
161|KEEP|5|Four real friends, connected actions and Ladakh scale make an identity-specific travel memory; source photo is not a finished Ladakh preview.
'''
judgments={}
for line in raw.strip().splitlines():
 n,action,score,reason=line.split('|',3);judgments[int(n)]=(action,int(score),reason)
assert len(judgments)==len(prompts)==162
merge={51:1,72:13,92:9}
assets=load(str(OUT.relative_to(ROOT)/'actual-assets.json'))
assetby={x['path']:x for x in assets}
provenance=load('content/image-provenance.json');provby={x.get('preview',{}).get('path'):x for x in provenance}
# Actual visible observations, in the contact-sheet order; no demographic inference from pixels.
notes='''Birthday ribbon; parents partly cropped
Garden birthday; no long orchard table
Conventional office presentation, unused revised concept
Four seated family members; no thousand-diya courtyard
Varsity laundromat portrait; no narrative action
Teal blouse headshot; utility single example only
Small cheek powder, no suspended Holi sculpture
Two faces and umbrella, wardrobe and rain align
Original umbrella couple; same mechanism as replacement
Faded portrait, no verified before/after pair
Emerald bridal drape and jewellery readable
Cinema exterior, not revised empty interior
Ordinary window maternity; no heritage rain
Ordinary indoor stretch; no large dawn shadow
Cardboard superhero city, uncovered face
Bride and parent, supported drape adjustment
Apartment frost window, not Kashmir carved window
Daylight Jaipur arch, not after-hours corridor
Terracotta suit studio, no proof of source-preserving edit
Two beach walkers, no glowing waves
Wide beach couple, no glowing footprints
Boxing-gym window portrait, not after-closing pool of light
Stone-wall headshot utility; not a verified transformation pair
Original stone-wall portrait, same utility scene
Four-person square user source; not generated Ladakh footage
City bike portrait, not midnight fuel stop
Sharp person and blurred commuters align
Cafe cup portrait aligns utility
Two chai drinkers; no graduation gown
Wedding dance monochrome aligns utility
Car-only forecourt; cannot stand in for owner/storm concept
Hotel seaside doorway; not Kerala boat
Original seaside balcony; not Kerala boat
Workshop rider; not current featured mountain story
Garba skirt moving, no strong circular trail surround
Ivory saree and arches; not nine illuminated sun pools
Four coworkers, no financial-newsroom motion
Car cabin only, not reference driver in period street
Lacing shoes, not chalk jump
Couple letter terrace; not steam railway
Couple Himalayan overlook aligns utility
Coral profile close-up aligns utility
Older couple laughing beside vintage car aligns
Bridge city portrait; no visible revised commuter-trail treatment
Original bridge city portrait, same missing trail concept
Paris map outside cafe; not riverside last bookstall
Office desk portrait, not glass-sketch model concept
Original office desk portrait, same mismatch
Red car detail; no owner or complete neon scene
Ordinary gym equipment portrait, no empty stadium
Riverside couple, not moonlit dunes
Window maternity, not paper-petal installation
Ceramic glaze and handle clearly visible
Age-honest grey studio close-up aligns utility
Kitchen bowl and spoon align utility
Island stairs and market bag; generic treatment
Original island stairs; generic treatment
Family kitchen pancakes; no storybook environment
Original family kitchen; no storybook environment
Standing park subject, contrary to seated reel hook
Anniversary dance; no album hook
Cobalt sculptural suit and graphic shadow
Child astronaut, helmet held, face clear
Bookshop portrait with closed book aligns utility
Family baking; no room-scale gingerbread village
Desert SUV portrait; generic pose
Leaf crown and woodland light align
Original leaf-crown woodland scene
Perfume bottle, citrus and stone align product utility
Garden maternity; not revised crescent concept
Wrapped newborn and two caregivers align
Original newborn and caregivers align
Overcast mountain motorcycle; no fog headlamp snow scene
Birthday picnic; no giant teddy
Original picnic; no giant teddy
Saree balcony; not dhunuchi smoke scene
Two riders and map; not lone salt-road rider
Small studio cake; no past/future frame installation
Krishna curls, tilak, feather, smile, flute, sash all readable
Two cups at home; not distinct new pre-wedding narrative
Expectant couple, no generational frames
Car-only country road; not person/tunnel scene
Window portrait utility exposure example
Navy headshot utility example
Original navy headshot utility example
Amber bottle, blank label example, actual product must override
'''.strip().splitlines()
assert len(notes)==86,len(notes)
nonhuman={30,37,48,52,68,81,85}
assetreviews=[]
for a,note in zip(assets,notes):
 pv=provby.get(a['path']);brief=(pv or {}).get('brief','')
 rep='not-human-focused' if a['index'] in nonhuman else ('Indian/South-Asian-explicit-brief' if re.search(r'\bIndian\b|South Asian',brief,re.I) else 'brief-without-explicit-Indian-default' if brief else 'unknown')
 assetreviews.append({**a,'observation':note,'inspection':'contact sheet actual-%02d.jpg; full-size source file used to make contact sheet'%(a['index']//16+1),'full_resolution_inspected':a['index'] in [7,78], 'human_focused':a['index'] not in nonhuman,'representation_provenance':rep,'provenance_source':'content/image-provenance.json' if pv else None,'provenance_brief':brief or None,'historical_tool':(pv or {}).get('tool'),'historical_review_status':(pv or {}).get('review_status'),'phase_a_status':'reviewed; retention recommendation only, not generation approval'})
write('asset-review.json',assetreviews)
prodby={x['id']:x for x in prod['prompts']}
entries=[]
for i,x in enumerate(prompts):
 action,score,reason=judgments[i];px=prodby.get(x['id']);a=assetby.get(x['preview_image_url']);old=assetby.get((px or {}).get('preview_image_url'))
 risks=[]
 if x['persona_policy'] in ('person','person-and-product'):risks.append('Reference-first/no-reference contract present; enforce suitable reference age and complete identity coverage before generation (G01).')
 if i in [70,71]:risks.append('No-reference and preview persona says friends, but creative scene specifies one rider (G04).')
 if i in range(72,80):risks.append('Human included but persona_policy=product; full person contract and fictional India-first person brief missing (G02).')
 if i in [31,112,113]:risks.append('Monochrome needs artistic luminance interpretation, not literal photographic skin colour (G03).')
 if i in [90,91]:risks.append('Named team versus anonymous background people requires explicit count distinction (G04).')
 if i in [127,128]:risks.append('Generic pet reference can conflict with fixed cat in creative body (G05).')
 if i in [133,134]:risks.append('Human policy does not structurally map animal identity; pet coat/shape instructions exist in body (G05).')
 if x['prompt_type']=='photo_edit':risks.append('Preserve source crop versus forced 4:5 needs explicit user-selected override (G06).')
 if x['persona_policy'] in ('product','person-and-product'):risks.append('Exact supplied product needs visible-surface references; label fidelity remains a QA/compositing dependency (G07).')
 if i in [82,117,118,124,152,156,160]:risks.append('Assembled temporal instructions need the targeted correction in recommendation (G08).')
 if i in [99,153,154]:risks.append('Title/body or posture contradiction identified (G09).')
 if i==161:risks.append('Source has exactly four visible people; public transformation remains unverified. Do not infer their ethnicity or source location (G10).')
 prod_risk=[]
 if px:
  if 'example demographics below' in px['prompt_text']:prod_risk.append('Production prepends an override caveat but still commands a fixed example persona in the creative body; use the local separated reference/default architecture on eventual release.')
  if 'If a product reference' in px['prompt_text']:prod_risk.append('Production fidelity caveat conflicts with later example product/blank-label wording; local reference-conditional wording is clearer.')
 if i in [11,119]:risks.append('Correct copyable Krishna styling is not fully recorded in inherited image_brief: missing explicit tilak/curls and different crop; reconcile regeneration metadata without rewriting correct user prompt (G11).')
 if i in [13,26,27,30,31,111]:risks.append('Legacy preview brief has another explicit persona or no explicit India-first default; retain evidence honestly and apply fictional Indian brief if future replacement is approved (G11).')
 currentobs=notes[a['index']] if a else 'Referenced local preview file is absent; no alignment or retention claim is possible.'
 if not a and old:currentobs+=' Older production file inspected: '+notes[old['index']]+'.'
 aligned=a and i not in [3,39,44,45,48,99,153,154,161] and not any(k in currentobs.lower() for k in ['not revised','no graduation','no storybook','no thousand','no suspended','no long orchard','not after','no strong','not nine','no room-scale','no fog','no giant','no past/future'])
 retain=('Candidate retain after detailed final QA; single output does not prove reference preservation.' if aligned else 'Do not present as an aligned finished preview; keep historical asset, then replace/reframe only after concept approval.')
 if i==11:retain='Retain recommended: full-resolution inspection confirms curls, narrow U tilak/red centre, one feather, expression, flute and clothes. No new image needed.'
 if i==1:retain='Retain recommended: full-resolution inspection confirms two distinct faces, one umbrella, connected eyelines and matching wardrobe/rain scene.'
 path=('/reel-prompts/'+x['slug']) if x['prompt_type']=='reel' else '/ai-prompts/'+x['category_id']+'/'+x['slug']
 entries.append({'index':i,'id':x['id'],'slug':x['slug'],'type':x['prompt_type'],'local_canonical_candidate':path,'production_canonical':px.get('canonical_path') if px else None,'production_published':bool(px),'local_published':x['is_published'],'collection_memberships':[c['slug'] for c in cols if x['id'] in c['prompt_ids']],'classification':action,'distinctiveness_score':score,'previous_local_score':x['distinctiveness_score'],'why_ai':reason,'recommended_action':reason,'merge_target_id':prompts[merge[i]]['id'] if i in merge else None,'merge_target_slug':prompts[merge[i]]['slug'] if i in merge else None,'identity_risks':risks,'production_findings':prod_risk,'preview_image_url':x['preview_image_url'],'local_asset_exists':bool(a),'preview_alignment':currentobs,'asset_reuse':retain,'existing_asset_index':a['index'] if a else None,'production_asset_index':old['index'] if old else None,'preview_brief_review':'Human persona omitted despite human scene' if i in range(72,80) else 'Reference-only specific group; not fictional preview' if i==161 else 'Scene/persona separation inspected; actual generation remains approval-gated','evidence':[f'{paths[0 if i<50 else 1 if i<161 else 2]}#{x["id"]}','asset-review.json','generator-review.md','research.json'],'production_prompt_changed_locally':px['prompt_text']!=x['prompt_text'] if px else None})
write('prompt-audit.json',entries)
# Canonical category IDs in this repository are slugs; cross-check explicit production path.
colreviews=[]
for c in cols:
 members=[e for e in entries if e['id'] in c['prompt_ids']];eligible=sorted((e for e in members if e['classification'] not in ['MERGE','DEFEATURE']),key=lambda e:(e['classification']=='UTILITY',-e['distinctiveness_score'],e['index']))
 targeted={
 'golden-hour':'Only one member and generic style label; keep inactive/noindex, not a broken promoted chip.',
 'romantic':'Broad overlap with pre-wedding; keep canonical if live, do not promote an inactive link.',
 'saree':'Useful broad style entry; avoid duplicating fashion catalogue intent. Lead with strongest story after assets align.',
 'cinematic':'Adjective-only taxonomy is too broad. Prefer creative-transformations editorial curation; preserve existing path.',
 'studio':'Keep utility discovery for controlled portrait work; not a homepage creative section.',
 'professional':'Preserve practical headshots and avoid duplicate corporate promises.',
 'friends-travel-reels':'One draft and source-only poster: remain noindex and absent from public promotion. Video deferred.',
 }
 base=c['slug'].removesuffix('-reels');r=targeted.get(c['slug'],'Lead with the ranked concepts below; replace boilerplate collection prose with specific choices, reference requirements and outcomes.')
 if base=='dating-profile':r+=' Keep believable profile utility; do not invent a fantasy lifestyle or force novelty. Defeature weak motion variants.'
 if base=='cars':r+=' Repair all human/car persona policies first; proposed desert photo merge reduces distinct membership to three.'
 if base=='pre-wedding':r+=' Umbrella photo merge leaves three direct photo members; add relevant retained canonical membership only if substantively useful.'
 if base=='office-corporate':r+=' Glass-model merge reduces direct photo membership; add Architect of Ideas through membership, not a duplicate URL.'
 if base=='indian-festivals':r+=' Use specific festival context; preserve Krishna and verify scheduling before seasonal activation.'
 if base=='babies':r+=' Require a suitable-age child reference and the actual caregiver whenever shown.'
 if base in ['womens-fashion-ecommerce','mens-fashion-ecommerce','product-shoots','ecommerce-product-showcase']:r+=' Separate creative campaign cards from accurate catalogue utility; require supported product views.'
 r+=' Do not activate/index until at least four relevant published, aligned-media prompts and substantive unique copy are present.'
 colreviews.append({'id':c['id'],'slug':c['slug'],'title':c['name'],'production_active':any(p['id']==c['id'] for p in prod['collections']),'local_active':c['active'],'local_is_indexable':c['is_indexable'],'member_count':len(members),'recommendation':r,'top_concepts':[{'slug':e['slug'],'score':e['distinctiveness_score'],'classification':e['classification']} for e in eligible[:4]],'evidence':['prompt-audit.json','research.json','homepage-and-architecture.md']})
write('collection-audit.json',colreviews)
summary={'total_unique_concepts':len(entries),'production_published':len(prodby),'local_published':sum(x['local_published'] for x in entries),'local_drafts':sum(not x['local_published'] for x in entries),'classifications':dict(collections.Counter(x['classification'] for x in entries)),'scores':dict(sorted(collections.Counter(x['distinctiveness_score'] for x in entries).items())),'collections':len(cols),'actual_full_size_assets_reviewed':len(assets),'human_focused_files':sum(x['human_focused'] for x in assetreviews),'representation_all_existing_files':dict(collections.Counter(x['representation_provenance'] for x in assetreviews)),'local_unique_preview_paths':len(set(x['preview_image_url'] for x in prompts)),'local_missing_unique_preview_paths':len({x['preview_image_url'] for x in prompts if not (ROOT/'public'/x['preview_image_url'].lstrip('/')).exists()}),'notes':'Recommendations only; zero application/content mutations, merges, unpublishes or generated assets applied.'}
write('audit-counts.json',summary)
print(json.dumps(summary,indent=2))
