import json,hashlib,re,copy
from pathlib import Path
D=Path('docs/audits/library-2026-09');
if (D/'editorial-audit.json').exists(): raise SystemExit('Editorial pass already applied. Edit reviewed content directly; do not rebuild over asset work.')
 baseline=json.loads((D/'editorial-baseline.json').read_text()); directions=json.loads((D/'editorial-directions.json').read_text())
VERSION='why-ai-2026-09-v1'
def write(path,obj):Path(path).write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n')
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
# Keep decisions were made against complete prompt text, not only titles. Metadata does not count as a creative rewrite.
keep_rows='''a-little-rain-a-lot-of-romance|4|creative|A coordinated rain-lit Seoul romance with a clear umbrella and reference-first K-drama treatment provides a destination shoot and style transformation.
your-next-chapter-in-focus|3|utility|Produces an identity-faithful professional profile with controlled background, crop and wardrobe for users without a studio headshot.
somewhere-in-the-mediterranean|4|creative|Places the user's own identity inside a specific island-stair editorial with blue shutters, a market bag and Mediterranean scale.
the-birthday-astronaut|5|creative|Transforms a recognizable child into a handmade lunar birthday adventure without hiding the face or pretending the costume changes identity.
old-school-charm-new-memories|4|creative|Creates a coordinated period couple shoot with a vintage car, wardrobe and film treatment that ordinary contemporary photos do not supply.
city-lights-main-character-energy|4|creative|Keeps the supplied person sharp inside Mumbai commuter motion and wet reflections, a controlled multi-exposure urban portrait.
tiny-krishna-big-wonder|5|creative|Creates a recognizable child's Krishna transformation through curls, visible tilak, peacock feather, flute and clothing, with identity overriding the example child.
the-desert-in-your-rear-view|4|creative|Builds an expedition portrait with a four-wheel-drive vehicle and immense dune scale without a remote desert production.
a-modern-bridal-heirloom|4|creative|Provides a coordinated Kanjeevaram, heirloom-jewellery and heritage bridal portrait while keeping the reference person unchanged.
the-forest-princess|5|creative|Creates a believable child-sized woodland fairytale with leaf crown, fern scale and a carefully placed sunbeam.
a-headshot-that-feels-like-you|3|utility|Updates an existing portrait for professional use without changing face, age, skin texture or recognizable identity.
the-art-of-standing-still|4|creative|Combines a sculptural cobalt suit, angular pose and curved architecture into a designed fashion composition rather than an ordinary outfit photo.
your-product-beautifully-simple|3|utility|Gives a small seller a controlled product hero with exact packaging, readable label and reusable clean lighting.
the-gentlest-new-beginning|3|utility|Creates a consistent newborn-family portrait while retaining actual infant age, caregiver identity and safe supported positioning.
made-for-the-mountains|4|creative|Places a supplied couple against an immense Himalayan overlook with specific trekking wardrobe and human-to-landscape scale.
a-frame-from-another-decade|4|creative|Transforms the user's portrait into an 1980s flash-film laundromat editorial with period wardrobe and a distinctive set.
soft-light-unmistakably-you|3|utility|Supplies an age-honest studio portrait that retains natural skin and facial characteristics instead of applying generic beauty filters.
your-everyday-with-better-light|3|utility|Repairs exposure, white balance and shadows in an existing photo while preserving the documented scene and identity.
a-tiny-superhero-off-duty|5|creative|Turns a recognizable child into an off-duty superhero in a handmade miniature city without masking the child's face.
dressed-for-the-first-dance|4|creative|Builds a controlled intimate monochrome wedding-dance portrait with coordinated formal styling and an emotional shared action.
small-details-beautifully-made|3|utility|Provides a maker-focused product photograph showing honest ceramic texture and scale with controlled lighting.
meet-your-new-profile-picture|3|utility|Creates a clear circular-crop profile image with readable facial features and a consistent two-colour background.
a-memory-worth-restoring|3|utility|Restores a damaged family photograph conservatively without inventing faces, ages or documentary details absent from the source.
change-the-scene-keep-yourself|3|utility|Replaces only the background of an existing portrait while preserving the person, pose and authentic appearance.
an-outfit-with-a-new-perspective|3|utility|Previews a specific wardrobe change on the same person without changing identity or body shape.
a-birthday-in-three-little-moments|4|creative|Tells a small reveal story from ribbon to gift to a child's delight, with a meaningful emotional payoff rather than a camera pan.
the-fragrance-reveal|3|utility|Supplies a short repeatable product reveal for a seller, keeping bottle and label faithful through clear detail and hero views.
a-wedding-morning-remembered|4|creative|Builds an intimate parent-and-bride preparation story with a clear gesture and emotional reaction while preserving both people.
coffee-and-a-real-smile|3|utility|Provides a believable dating-profile alternative to a selfie: readable identity, natural expression and a relaxed everyday setting without invented glamour.
the-bookshop-detour|3|utility|Offers a dating-profile photo that communicates an interest in reading through a plausible candid moment instead of a formal pose.
sunday-park-conversation|3|utility|Provides an approachable dating-profile portrait with natural expression and environmental depth, retaining ordinary body proportions.
something-good-in-the-kitchen|3|utility|Creates a believable cooking-interest dating-profile image with safe simple activity rather than fabricated luxury or physical transformation.
the-everyday-shirt-catalogue|3|utility|Gives sellers a consistent front garment view preserving shirt pattern, stitching, buttons, colour and fit for catalogue use.
a-jacket-from-every-angle|3|utility|Creates a clear reference-backed jacket presentation for sellers, without inventing unseen panels or changing the actual silhouette.
the-honest-quarter-rotation|3|utility|Provides a controlled quarter-turn product inspection showing supplied surfaces without generating unseen designs or false claims.
fabric-up-close|3|utility|Shows actual fabric texture, seam and pattern at useful scale for buyers without replacing material with an idealized substitute.
front-back-the-real-product|3|utility|Creates a consistent multi-view seller presentation using separately supplied front and back references rather than guessing the reverse.
from-detail-to-daily-use|3|utility|Connects a faithful product detail to its plausible everyday use and scale, answering a practical buyer question.
'''
keeps={}
for line in keep_rows.strip().splitlines():
 slug,score,intent,why=line.split('|');keeps[slug]=dict(score=int(score),intent=intent,why_ai=why)
directions['the-anniversary-slow-dance']=dict(title='The Album Becomes the Anniversary',score=4,intent='creative',scene='The supplied couple slow-dances on a lamp-lit veranda beside a closed wedding album resting on a small table. A framed photograph is shown only if the user supplies the actual image; otherwise use an empty frame rather than fabricated younger identities. Keep both people their present age, with comfortable swaying steps and natural affection.',light='Warm veranda lamps with blue evening beyond; 50mm waist-up two-shot, album and both faces readable.',why_ai='Creates an anniversary story linking a real supplied memory to the same couple in the present without inventing younger faces.',hook='Begin on the closed album and an empty frame, or the actual labelled wedding photograph if supplied.',progression='Move to the present-day couple taking one gentle swaying step together.',payoff='Hold their shared smile with the album in the foreground, connecting memory and the present.')
# One duplicate photo merged into each existing canonical utility. Their reels remain independently useful utility formats.
merges={'safe-in-your-arms':'the-gentlest-new-beginning','under-the-neem-shade':'soft-light-unmistakably-you'}
reuse={'promises-in-the-courtyard':'an-intimate-jaipur-yes','the-roadside-pause':'the-open-road-portrait','between-the-sets':'built-on-quiet-discipline','your-next-introduction':'your-next-chapter-in-focus','coral-against-the-sky':'meet-your-new-profile-picture','diyas-on-the-veranda':'a-family-evening-lit-by-diyas','colour-on-the-cheeks':'a-little-holi-happiness','one-gentle-garba-turn':'garba-under-the-lights','the-little-flute-keeper':'tiny-krishna-big-wonder','skincare-on-stone':'your-product-beautifully-simple','ceramic-and-linen':'small-details-beautifully-made',**merges}
# Explicit hooks for retained concept bodies; reels still receive an edited purposeful sequence.
hooks={
'your-next-chapter-in-focus':['Begin on a soft out-of-focus jacket shoulder.','Bring the supplied face into clear focus with a natural small smile.','Hold a stable, profile-ready head-and-shoulders view.'],
'meet-your-new-profile-picture':['Start with the face centered but softly out of focus.','Resolve both eyes and a natural laugh without changing expression anatomy.','Hold the clear circular-crop-safe profile composition.'],
'soft-light-unmistakably-you':['Begin on the soft boundary between background light and shadow.','Bring the age-honest face into focus without smoothing skin.','Hold the natural expression and clear facial detail.'],
'your-product-beautifully-simple':['Start on the supplied label edge in crisp focus.','Move a few centimetres to reveal the unchanged cap and bottle shape.','Hold the entire faithful bottle with readable label.'],
'small-details-beautifully-made':['Begin on the real ceramic surface texture.','Move to the handle and rim without morphing their shapes.','Reveal the complete cup in its linen setting.'],
'the-gentlest-new-beginning':['Start on the caregiver hand visibly supporting the infant.','Reveal the baby breathing naturally in the same secure hold.','Hold both caregiver and infant faces in the warm room.'],
'coffee-and-a-real-smile':['Begin on the stationary cup beside the person.','They look up with a small spontaneous smile.','Hold the relaxed face rather than a staged glamour pose.'],
 'the-bookshop-detour':['Begin on the single closed book already in the person’s hands.','They glance towards the shelf, then towards camera.','Hold a subtle amused smile with the same book visible.'],
'sunday-park-conversation':['Start on soft leaves moving behind the seated person.','The person responds to an imagined friendly greeting with a small smile.','Hold an approachable readable face against the park depth.'],
'something-good-in-the-kitchen':['Begin on a spoon resting inside the mixing bowl.','The person makes one gentle stir, then looks up.','Hold their natural smile with the same bowl and spoon; no knives.'],
 'the-everyday-shirt-catalogue':['Begin on the supplied shirt cuff and buttons.','Rise to the unchanged front pattern and fit.','Hold a complete front catalogue view with hem visible.'],
 'a-jacket-from-every-angle':['Begin on the supplied jacket closure.','The model makes a small quarter-turn to show only reference-supported side detail.','Hold the complete garment; use a separately supplied back view only when provided.'],
 'the-honest-quarter-rotation':['Start on one supplied distinguishing product detail.','Rotate the product at most a quarter turn, showing only reference-supported surfaces.','Hold the complete product with exact proportions and readable branding.'],
 'fabric-up-close':['Begin on the real seam and adjacent fabric texture.','Move along the supplied pattern at a consistent scale.','Reveal the larger reference-backed fabric panel so the detail has context.'],
 'front-back-the-real-product':['Begin with the complete supplied front view.','Cut to the separately supplied side or back view; if absent remain on the known front.','Return to the same front hero view, unchanged colour and dimensions.'],
 'from-detail-to-daily-use':['Begin on the supplied product’s defining functional detail.','Show its plausible use at realistic hand or tabletop scale without changing the product.','Hold the full product in that use context, with no invented performance claims.'],
 'tiny-krishna-big-wonder':['Begin on the small wooden flute held in both natural hands.','Tilt up to the smiling child, visible white U-shaped tilak with red centre and softly styled curls.','Reveal the peacock feather, yellow dhoti, blue gold-edged sash and marigold courtyard around the same child.']}
write(D/'editorial-keep-decisions.json',keeps)
write(D/'editorial-directions.json',directions)
originals=copy.deepcopy(baseline['content/prompts.json']); expanded=copy.deepcopy(baseline['content/expansion/prompts.json']); before=originals+expanded; byslug={p['slug']:p for p in before}; audit=[]; media_groups={}; now='2026-09-10T18:00:00.000Z'
product_text="PRODUCT REFERENCE: Product fidelity takes priority. Preserve its exact shape, proportions, design, colour, pattern, fabric/material appearance, stitching, silhouette, existing logos, label text and accessories actually supplied. Do not redesign a supplied product to match the example. Model styling may change only without hiding or altering the advertised product. Keep model/person identity separate from product identity."
for p in before:
 old=copy.deepcopy(p); base=p['slug'].removesuffix('-reel'); key=reuse.get(base,base); isreel=p['prompt_type'] in ['reel','video']; rewritten=False
 if p['slug'] in merges:
  audit.append(dict(id=p['id'],slug=p['slug'],classification='C',decision='merged',before_score=2,after_score=None,merged_into=merges[p['slug']],reason='Duplicate utility already served by the existing canonical; collection now reuses that record.',before_sha256=digest(p['prompt_text'])))
  continue
 d=directions.get(key);k=keeps.get(key)
 assert d or k,('UNREVIEWED',p['slug'],key)
 e=d or k;p.update(distinctiveness_score=e['score'],why_ai=e['why_ai'],content_intent=e['intent'],editorial_review_version=VERSION)
 scenechanged=bool(d)
 if d:
  rewritten=True;p['title']=d['title']+(' — reel' if isreel else '')
  p['description']=d['scene']+' The identity reference determines the people; the example provides the styling and setting.' if p['persona_policy'] in ['person','person-and-product'] else d['scene']
  prefix=p['prompt_text'].split('CREATIVE DIRECTION:')[0]
  if key in ['the-open-road-portrait','the-desert-in-your-rear-view'] and product_text not in prefix:
   prefix+=product_text+'\n\n';p['persona_policy']='person-and-product'
  body=('Create an eight-second reel. ' if isreel else 'Create a photograph. ')+d['scene']+'\n\nLighting and composition: '+d['light']+'. Compose for '+p['aspect_ratio']+'.'
  body+='\n\nStyling must follow the scene without altering reference identity. Adapt hair only when styling requires it; retain the actual hairline and recognizable face. Keep natural expressions, believable hands, grounded feet, plausible shadows and realistic material texture. No beauty-filter skin, anatomical distortion, watermark or invented text.' if p['persona_policy'] in ['person','person-and-product'] else '\n\nKeep physically plausible anatomy or product geometry, realistic material texture, stable supports and believable shadows. No watermark, invented text, duplicate objects or distorted details.'
  p['prompt_text']=prefix+'CREATIVE DIRECTION:\n\n'+body
  p['lighting']=d['light'].split(';')[0];p['framing']=d['light'].split(';')[-1].strip();p['camera']=p['framing']
  p['style']=[d['title'].split(',')[0], 'Creative campaign' if p['persona_policy'] in ['product','person-and-product'] else 'Visual story']
  p['tags']=list(dict.fromkeys([*old['tags'][:2],*re.findall(r'[a-z]+',d['title'].lower())]))
  p['seo_title']=p['title']+' AI '+('Reel' if isreel else 'Photo')+' Prompt'
  p['seo_description']=(d['why_ai']+' Reference-first prompting.')[0:160]
  p['faqs']=[x for x in p['faqs'] if not any(w in x['question'].lower() for w in ['details','matter most'])]
  p['faqs'].insert(1,dict(question='What makes this concept worth creating with AI?',answer=d['why_ai']))
  p['faqs'].insert(2,dict(question='Which visual details should I check?',answer=d['scene']))
 if isreel and p['slug'] not in ['a-birthday-in-three-little-moments','the-fragrance-reveal','a-wedding-morning-remembered']:
  rewritten=True
  h=[d['hook'],d['progression'],d['payoff']] if d else hooks[key]
  r=p['reel'];r.update(duration=8,concept=p['title'].removesuffix(' — reel'),hook=h[0],progression=h[1],payoff=h[2],scenes=[dict(start=0,end=2,action=h[0],transition='Establish hook'),dict(start=2,end=6,action=h[1],transition='Continuous progression or specified reference-backed cut'),dict(start=6,end=8,action=h[2],transition='Stable final hold; use a gentle crossfade only if it preserves continuity')],caption=p['title'].removesuffix(' — reel')+'. Your story, your identity.')
  p['prompt_text']=re.split(r'\n\nREEL TIMELINE',p['prompt_text'])[0]+'\n\nREEL TIMELINE (8 seconds total):\n'+ '\n'.join(f"{s['start']}–{s['end']} seconds: {label}: {s['action']}" for label,s in zip(['HOOK','PROGRESSION','PAYOFF'],r['scenes']))+'\nKeep the same subject count, identities, wardrobe and exact supplied products throughout. No morphing, flicker, added people or invented text. The final hold is included in the duration; do not force a loop that requires teleportation. Preview must communicate without audio.'
  p['preview_video']=None
 elif isreel:
  r=p['reel'];r.update(hook=r['scenes'][0]['action'],progression=' '.join(s['action'] for s in r['scenes'][1:-1]),payoff=r['scenes'][-1]['action'])
 # New title refers to changed scene; new assets must be independently reviewed. Retained utility timelines can keep aligned poster.
 source=byslug.get(key,old)
 if d:
  persona=source.get('image_brief','').split('Lighting:')[0]
  # Source preview persona is explicit and separate. Group fallback is authoritative only for these fictional house assets.
  who={'Couple':'an Indian/South Asian adult couple with distinct faces','Kid':'an Indian/South Asian child of the age appropriate to this concept','Family':'an Indian/South Asian family with the exact count and ages described in the scene','Man':'an Indian/South Asian adult man','Woman':'an Indian/South Asian adult woman','Team':'an Indian/South Asian professional team with distinct faces','Friends':'Indian/South Asian adult friends with distinct faces','Person with pet':'an Indian/South Asian adult and their pet'}.get(p['subject'],'an Indian/South Asian person where a human model is required')
  human=p['persona_policy'] in ['person','person-and-product']
  persona=('HOUSE PREVIEW PERSONA ONLY: Use '+who+'. Vary believable complexion, age-appropriate features, hair and body proportions across the library. Do not reuse another preview model. ' if human else 'Use an original fictional product or pet matching this concept; preserve realistic construction or animal anatomy. ')
  ratio='4:5' if any(x['slug']==key and x['prompt_type'] not in ['reel','video'] for x in before) else '9:16'
  p['image_brief']=persona+'Create one original standalone photograph for '+d['title']+'. Scene: '+d['scene']+' Lighting and framing: '+d['light']+'. Aspect ratio '+ratio+'. This is the keyframe for the full concept, not a collage or storyboard. Natural texture, accurate anatomy, no watermark or generated text. Keep major props, faces and concept details inside the frame.'
  p['preview_image_url']='/previews/'+key+'-editorial-v1.webp';p['thumbnail_url']='/previews/'+key+'-editorial-v1-thumb.webp';p['image_width']=960 if ratio=='4:5' else 720;p['image_height']=1200 if ratio=='4:5' else 1280
  p['image_alt']=d['title']+': '+d['scene'];p['preview_video']=None
 else:
  p['preview_image_url']=source['preview_image_url'];p['thumbnail_url']=source['thumbnail_url'];p['image_width']=source['image_width'];p['image_height']=source['image_height'];p['image_brief']=source['image_brief'];p['image_alt']=source['image_alt']
  if base in merges:p['title']=source['title']+' — reel'
 asset_exists=Path('public'+p['preview_image_url']).exists()
 p['preview_review_status']='replacement-required' if d else ('approved' if asset_exists else 'generation-required')
 if not asset_exists:p['is_published']=False;p['is_indexable']=False
 p['is_featured']=e['intent']=='creative' and e['score']>=4;p['is_trending']=p['is_featured'];p['updated_at']=now
 reason=('Replace generic setting/pose with '+d['title']+'; update composition, visible story and media brief.' if d else ('Keep useful scene; replace generic movement with a purposeful hook, progression and payoff.' if rewritten else 'Retain complete creative text: '+k['why_ai']))
 audit.append(dict(id=p['id'],slug=p['slug'],title=p['title'],classification='B' if rewritten else 'A',decision='rewritten' if rewritten else 'retained',before_score=2 if d else e['score'],after_score=e['score'],content_intent=e['intent'],why_ai=e['why_ai'],reason=reason,before_sha256=digest(old['prompt_text']),reviewed_sha256=digest(p['prompt_text']),preview_status=p['preview_review_status'],previous_preview=old['preview_image_url'],previous_video=old.get('preview_video')))
 if not asset_exists:
  job=media_groups.setdefault(p['preview_image_url'],dict(id=key,type='image',editorial_status='approved',editorial_review_version=VERSION,status='approved-awaiting-generation',prompt=p['image_brief'],dimensions=[p['image_width'],p['image_height']],aspect_ratio='4:5' if p['image_width']==960 else '9:16',target='public'+p['preview_image_url'],used_by=[],reason='Replacement for changed concept' if d else 'No approved asset yet',workflow='ChatGPT preferred; owner permits Codex built-in only after ChatGPT limits are exhausted. No paid API generation.'))
  job['used_by'].append(p['slug'])
# Remove only never-production duplicates; all original canonical IDs remain.
expanded=[p for p in expanded if p['slug'] not in merges];allp=originals+expanded;byid={p['id']:p for p in allp};byname={p['slug']:p for p in allp}
rank=lambda p:(0 if p['content_intent']=='creative' else 1,-p['distinctiveness_score'],p['trending_rank'],p['slug'])
for i,p in enumerate(sorted(allp,key=rank)):p['trending_rank']=i+1
collection_audit=[]
for path in ['content/collections.json','content/expansion/collections.json']:
 cs=copy.deepcopy(baseline[path])
 for c in cs:
  ids=[byname[merges[byslug_inv['slug']]]['id'] if (byslug_inv:=next(x for x in baseline['content/expansion/prompts.json']+baseline['content/prompts.json'] if x['id']==pid))['slug'] in merges else pid for pid in c['prompt_ids']]
  c['prompt_ids']=sorted(set(ids),key=lambda pid:rank(byid[pid]));members=[byid[pid] for pid in c['prompt_ids']]
  c['featured_image']=members[0]['preview_image_url']
  if path.endswith('expansion/collections.json'):
   titles=[p['title'].removesuffix(' — reel') for p in members]
   c['description']='Explore '+', '.join(titles[:-1])+' and '+titles[-1]+'. '+('Each creative concept has a specific visual story; practical catalogue or profile prompts remain available as clearly labelled utility. ' if any(p['content_intent']=='creative' for p in members) else 'These practical prompts focus on accurate presentation and useful deliverables rather than spectacle. ')+'References determine identity and supplied product design. Preview styling never overrides the people or products you provide.'
   c['seo_description']=('Explore '+', '.join(titles[:2])+', with reference-first prompts and useful creative directions.')[:160]
  if any(not p['is_published'] for p in members):c['active']=False;c['is_indexable']=False
  collection_audit.append(dict(slug=c['slug'],name=c['name'],count=len(members),ordered_concepts=[dict(slug=p['slug'],title=p['title'],score=p['distinctiveness_score'],intent=p['content_intent']) for p in members],status='approved-concepts-awaiting-media' if not c['active'] else 'ready'))
 write(path,cs)
write('content/prompts.json',originals);write('content/expansion/prompts.json',expanded)
write(D/'editorial-audit.json',dict(version=VERSION,reviewed=len(audit),records=audit,collections=collection_audit,merges=merges,scope='All 50 original and 113 expanded records; all 38 collections. Retained counts exclude metadata-only additions from creative rewrites.'))
write(D/'approved-image-manifest.json',list(media_groups.values()))
# Selected budget-conscious featured set, not all 69 reels. Utility product clip already available separately.
selected=['promises-in-the-courtyard-reel','the-roadside-pause-reel','the-garden-waiting-room-reel','rain-on-the-paint-reel','colour-on-the-cheeks-reel','the-saree-drape-catalogue-reel','packaging-with-purpose-reel','clouds-below-the-path-reel']
videos=[]
for slug in selected:
 p=byname[slug];videos.append(dict(slug=slug,title=p['title'],editorial_status='approved',status='wait-for-approved-poster',provider_preference=['Kling existing credits only','Runway only if available without payment'],duration_seconds=8,aspect_ratio='9:16',source_poster='public'+p['preview_image_url'],poster_ready=False,exact_generation_prompt=p['prompt_text'],hook=p['reel']['hook'],progression=p['reel']['progression'],payoff=p['reel']['payoff'],web_output='Muted H.264 MP4, playsinline, poster fallback, lazy viewport loading; review anatomy, identity and motion before approval.'))
write(D/'approved-video-manifest.json',videos)
# Make obsolete entry points visibly non-actionable. Original manifests preserved for provenance.
for f in ['generation-queue.json','reel-preview-manifest.json']:
 a=json.loads((D/f).read_text());archive=D/('pre-editorial-'+f)
 if not archive.exists():write(archive,a)
write(D/'generation-queue.json',list(media_groups.values()))
(D/'PENDING-IMAGE-GENERATION.md').write_text('# Generation paused pending editorial handoff\n\nThe old queue is superseded. Use approved-image-manifest.json only after the editorial report has been delivered. Existing output is not proof of alignment with rewritten concepts. Do not generate the archived queue.\n')
# Stop original expansion source from silently rebuilding generic variants.
concepts=json.loads(Path('content/expansion/concepts.json').read_text())
for group in concepts:
 group['editorial_review_version']=VERSION
 for c in group['concepts']:
  key=reuse.get(re.sub(r'[^a-z0-9]+','-',c[0].lower()).strip('-'),re.sub(r'[^a-z0-9]+','-',c[0].lower()).strip('-'))
  if key in directions:
   d=directions[key];c[:]=[d['title'],d['scene'],d['light'],d['hook']+' '+d['progression']+' '+d['payoff']]
write('content/expansion/concepts.json',concepts)
print('Reviewed',len(audit),'Retained',sum(r['decision']=='retained' for r in audit),'Rewritten',sum(r['decision']=='rewritten' for r in audit),'Merged',len(merges),'Remaining',len(allp),'Image jobs',len(media_groups),'Selected videos',len(videos))
print('Scores',{i:sum(p['distinctiveness_score']==i for p in allp) for i in range(1,6)})
