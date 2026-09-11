"""Reproducible editorial amendments against the immutable public baseline.
Never connects to Supabase. Do not rerun against production editorial changes.
"""
import json, re, hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
AUDIT=ROOT/'docs/audits/library-2026-09'
baseline=json.loads((AUDIT/'baseline.json').read_text())['prompts']
byid={p['id']:p for p in baseline}
original=json.loads((ROOT/'content/prompts.json').read_text())
# Explicit, individually reviewed scene and appearance replacements in library order.
scenes={
1:'the person in an ivory silk saree with a narrow gold border and jasmine hair adornment, glancing over one shoulder beside weathered sandstone arches',
2:'the two people in the couple reference, one in a charcoal wool coat and one in a cream trench, smiling at one another under a transparent umbrella on a rainy Seoul side street',
3:'the person in a navy unstructured jacket over a white crew-neck shirt, relaxed shoulders and direct eye contact against a warm grey studio background',
4:'the person wearing a linen rust sundress and holding a woven market bag on a sunlit whitewashed Greek island staircase with blue shutters',
5:'the child in a handmade silver astronaut costume with a helmet tucked beneath one arm; a small cardboard moon and paper stars decorate a navy studio set',
6:'the couple laughing beside a vintage maroon car, one in a mustard printed saree and the other in a cream open-collar shirt and brown trousers, on a quiet tree-lined avenue',
7:'the person wearing a dark olive overshirt, standing still at a busy Mumbai crossing while commuters blur behind them',
8:'the person wearing a red-and-white cotton saree on a traditional Kolkata balcony, one hand resting on the iron railing',
9:'the two people in the couple reference wearing loose off-white cotton clothing, walking barefoot along a quiet beach with small waves around their ankles',
10:'the person in a textured charcoal suit and burgundy knit tie, seated at the edge of a modern oak desk with an architectural window behind them',
11:'the person wearing a cobalt blue dress, laughing beside a small lemon cake on a garden table surrounded by flowers',
12:'the child in a Krishna-inspired portrait wearing a comfortable yellow dhoti and blue sash, a single peacock feather in the hair, holding a small wooden flute in a courtyard with marigold garlands',
13:'the reference family in indigo, cream and marigold festive clothing, seated around brass diyas on a home veranda',
14:'the person wearing a sand-coloured linen shirt, standing beside a dusty parked four-wheel-drive with immense dunes behind them',
15:'the bride wearing an emerald Kanjeevaram saree, traditional gold jewellery and jasmine flowers, looking gently towards the camera against a textured deep brown studio backdrop',
16:'the child wearing a moss-green storybook dress and a simple leaf crown in a fern-filled woodland, reaching towards a sunbeam',
18:'the reference family making pancakes around a modest sunny kitchen island, casual knitwear and genuinely candid gestures',
19:'the person wearing a tailored trench coat and loafers, reading a folded map outside an ordinary Paris cafe',
20:'the person wearing a sculptural cobalt blue cotton suit, standing in a strong angular pose beside a curved white wall',
21:'the two adults in the couple reference, one in a denim jacket and the other in a checked shirt, sharing a joke over steaming chai beside a rain-speckled campus window',
22:'the person wearing a plain charcoal training shirt, seated between sets in a real boxing gym with worn leather equipment, unchanged body proportions and relaxed hands',
24:'the person wearing a simple white cotton kurta with small pink and yellow Holi colour marks on the cheeks, outdoors against a softly blurred courtyard',
25:'the two reference parents gently holding their fully wrapped newborn by a bedroom window, neutral cotton clothing and a serene lived-in setting',
26:'the couple wearing practical mustard and navy trekking jackets, standing on a safe marked overlook above a Himalayan valley with distant snowy peaks',
27:'the person in a burgundy varsity jacket and faded jeans, leaning against a laundromat window with vintage lettering kept unreadable',
28:'the person wearing a black boat-neck top against a pale warm-grey studio backdrop, steady direct gaze and their actual age retained',
29:'the couple wearing a pastel rose lehenga and ivory bandhgala, standing apart but holding hands within a pink sandstone archway in Jaipur',
31:'the child wearing a homemade red cape over a plain blue T-shirt and jeans, hands on hips in front of a playful cardboard city set, no branded superhero symbols',
32:'the wedding couple in a simple satin wedding dress and dark tuxedo, slowly dancing in an intimate restaurant wedding venue, guests softly out of focus',
33:'the child wearing a yellow gingham dress, sitting on a picnic blanket beside a small strawberry birthday cake and simple paper bunting',
34:'the person wearing a brown riding jacket, standing beside a parked classic motorcycle on a quiet mountain road, helmet resting on the seat',
35:'the person wearing a chunky oatmeal sweater, holding a ceramic cup by a frost-edged apartment window',
36:'the reference family decorating gingerbread at a flour-dusted wooden kitchen table, red and green knitwear with an understated Christmas tree in the distance',
38:'the person wearing a coral T-shirt against a saturated sky-blue backdrop, candid laughing expression',
39:'the person wearing a dark wool coat, standing outside an old cinema entrance at night, lettering abstract and unreadable',
40:'the person celebrating a thirtieth birthday in a cream knit polo and dark trousers, seated beside a tiny chocolate cake on a pale blue studio pedestal, no balloons or visible text. This occasion does not instruct you to age or de-age the supplied person',
41:'the person wearing a vibrant turquoise and magenta chaniya choli, captured mid-turn with fabric moving naturally in an outdoor garba courtyard',
45:'the reference couple, one in a wine-red silk saree and the other in a cream kurta, sharing a slow dance on their veranda at dusk',
46:'the person wearing a white linen co-ord on a coastal hotel balcony overlooking the sea, a small suitcase beside the open door',
47:'the child in a comfortable peach party dress standing beside a small birthday cake, the reference parents’ hands entering the frame to help with a ribbon, no readable lettering',
49:'the person wearing a navy jacket, looking across a rainy Tokyo pedestrian bridge at twilight, blurred city lights reflected on wet metal railings',
50:'the reference bride wearing a pale gold lehenga, seated beside a tall window while the accompanying reference parent gently adjusts the edge of the dupatta, intimate candid expressions',
}
appearances={
1:'For the jasmine styling, gather sufficient-length hair into a loose low braid; on shorter hair, use a small pinned jasmine arrangement instead of inventing length. Retain hairline, colour and texture. A small bindi, delicate gold drop earrings and a restrained closed-mouth smile complete the requested look.',
2:'Gently arrange each person’s own hair clear of the eyes without changing colour or texture. Both wear genuine open smiles and look into each other’s eyes. Assign the two coats to the supplied people as requested; do not alter gender presentation to match the preview.',
3:'Groom the existing hairstyle and any existing facial hair neatly without adding a beard, changing hair colour or removing distinguishing features. Use a calm, approachable closed-mouth expression with soft eye catchlights.',
4:'Let the person’s own hair move slightly in the breeze. Use a cheerful smile while preserving their actual freckles or other distinguishing features; do not add freckles or recolour their hair to match the preview.',
5:'Gently arrange the child’s existing hair away from the eyes. Use lifted cheeks and a broad delighted smile with bright eyes. Keep the face uncovered, recognizable and at the child’s original age.',
6:'Gently arrange the saree wearer’s hair back where its length allows, and tidy the partner’s existing hair and any facial hair. Preserve actual hair colour and smile lines as both laugh towards one another.',
7:'Keep the existing hair texture, length and facial hair, with only light grooming. Lips relaxed and closed, eyes alert and thoughtful, looking away across the crossing.',
8:'A low bun is suitable if the hair is long enough; otherwise pin it neatly without inventing length. Keep original spectacles if worn. Include a tiny bindi and small gold earrings as requested saree styling. Use a gentle closed-mouth smile and direct, relaxed gaze.',
9:'Use each partner’s own hair colour, texture and length, gently moved by the sea breeze; do not impose braids, a haircut or facial hair. Both have soft smiles and look towards each other rather than posing towards the camera. Retain both recognizable facial identities, their individual skin tones and natural body proportions.',
10:'Neatly arrange the existing hair and facial hair without imposing silver hair or a clean shave. Use a quiet, composed closed-mouth expression, retaining the person’s actual facial lines.',
11:'Gently shape the person’s own hair without changing its colour or texture. Capture an open, spontaneous laugh with smiling eyes and their natural laugh lines.',
12:'The hairstyle transformation is essential to this Krishna styling: adapt the child’s hair into soft, voluminous tousled waves and loose curls around the ears, lifting the fringe away from the centre of the forehead. This may change the original hairstyle and curl arrangement, while preserving the hairline, hair colour and recognizable facial identity. Add a clearly visible sacred forehead tilak: two slender white lines joined into a narrow U, with a fine reddish vertical line inside. Centre it between the eyebrows and the hairline. Use bright eyes looking at the camera, softly raised cheeks and a playful closed-mouth smile.',
13:'Preserve each reference family member’s distinct face, age, hair and existing spectacles. Gently arrange hair clear of faces; retain meaningful cultural marks and jewellery. Give everyone small natural smiles and attentive downward gazes. Do not invent relatives or change ages to match the preview’s four-person arrangement.',
14:'Keep the person’s own hair texture and existing facial hair, tidied only as needed. A calm, thoughtful expression with lips closed; let the gaze travel towards the distant dunes.',
15:'For the bridal transformation, arrange sufficient-length hair into a low bun edged with white jasmine; on shorter hair use a secure jasmine pin arrangement. Preserve hairline, hair colour and recognizable face. Include a small bindi and a separate gold forehead pendant. Softly defined eyes and a gentle closed-mouth smile, without reshaping eyes, nose or jaw.',
16:'Nestle a simple leafy crown securely into the child’s own hair, preserving its length, colour and texture. Use quiet wonder, lips slightly parted and eyes following the sunbeam. Do not change the child’s ethnicity or age.',
18:'Retain each family member’s own hair, age and facial features. Tie longer hair away from food where practical. Give each person a different attentive smile or absorbed expression. Preserve the reference group’s number and identities; the four-person preview is only a composition example.',
19:'Keep the person’s original haircut and texture with gentle grooming. A focused, quiet expression, eyes lowered towards the map. Preserve natural facial contrast in monochrome without lightening the underlying skin tone.',
20:'For the sculptural fashion styling, arrange sufficient-length hair into a sleek low bun or smooth shorter hair away from the face, preserving the hairline. Serious and composed expression, chin slightly lifted and eyes beyond the camera. Do not lengthen the body or slim the waist.',
21:'Lightly arrange each person’s own hair and existing facial hair. Capture shared laughter: one raises a free hand near their smile while the other turns towards them. Preserve both reference identities and ages; the campus setting does not require younger faces.',
22:'Retain the person’s own hairstyle and any facial hair. A light believable sheen of sweat and a reflective, closed-mouth expression towards the side window. Do not add muscle, reduce body fat, broaden shoulders or alter skin tone.',
24:'Gather hair into a loose ponytail if its length allows, or gently pin shorter hair away from the cheeks. Preserve hairline, texture and colour. Use an open joyful smile with natural teeth and lively eyes towards the camera.',
25:'Retain both parents’ actual hairstyles and features, gently arranging hair away from the infant. Both look down tenderly at their newborn with relaxed mouths and soft expressions. Preserve the newborn’s recognizable features and infant proportions, without beautifying or ageing them.',
26:'Arrange each person’s own hair practically for a trek, retaining any facial hair. Both have relaxed smiles; one looks towards the horizon while the other glances towards the camera.',
27:'Let the person’s own hair sit naturally, with believable flyaways rather than a polished salon finish. A relaxed, slightly aloof expression and a soft gaze towards the camera; do not impose shoulder-length hair.',
28:'Gently arrange the person’s own hair away from the eyes without adding length or silver colour. Steady direct eye contact and a slight closed-mouth smile; retain their actual fine lines and visible age.',
29:'Gently style each person’s own hair for the engagement look, keeping hairline and actual colour. Preserve existing facial hair. Both exchange gentle closed-mouth smiles. Assign the lehenga and bandhgala to the appropriate reference people without changing their identities.',
31:'Gently arrange the child’s own hair away from the eyes. A proud closed-mouth grin, slightly raised chin and lively eyes towards the camera. Keep the child’s natural age and proportions.',
32:'Gently gather the dress wearer’s hair if length permits; otherwise use their own neatly styled hair. Tidy the tuxedo wearer’s existing hair and any facial hair. Both smile softly while looking into each other’s eyes. Preserve the identities and gender presentation of both reference people.',
33:'Keep the child’s own hair length and texture, gently arranging it clear of the eyes. A small contented closed-mouth smile and gentle direct eye contact; no adult makeup.',
34:'Preserve the person’s existing hair, facial hair and meaningful headwear. The preview’s neatly wrapped navy turban is retained when supplied in the reference or explicitly requested; do not assign Sikh identity or invent a beard from this motorcycle theme. A thoughtful closed-mouth expression looking down the mountain road.',
35:'Keep the person’s own hair length, colour, texture and hairline, with natural flyaways. Lips gently closed and gaze thoughtfully directed through the window.',
36:'Retain each reference family member’s own hair, age and distinguishing features. Tie longer hair back for the cooking activity where practical. Absorbed smiles and shared laughter; do not change ethnicity, family composition or age to match the preview.',
38:'Lightly arrange the person’s own hair clear of the eyes, preserving colour and texture. Small silver hoops are optional styling rather than identity features. Use an open laugh with lifted cheeks and bright eyes.',
39:'Lightly sweep back the existing hair if its length allows, keeping natural strands and existing facial hair. Retain actual facial lines without adding wrinkles or grey hair. Serious and reflective, lips closed and gaze past the camera.',
40:'Tidy the existing hair and any facial hair without changing colour, texture or hairline. A warm understated smile towards the camera, with a slight relaxed head tilt.',
41:'For dance styling, secure longer hair in a pinned-up bun with soft tendrils, or pin shorter hair securely. Preserve hairline and colour. Include a small bindi, traditional earrings, a close-fitting necklace and stacked bangles. A joyful soft smile, eyes towards the moving skirt.',
45:'Retain each partner’s actual age, hair colour, facial hair and spectacles. Gather longer hair if suitable for the saree styling. A small bindi, gold earrings and bangles complement the saree when requested. Both exchange warm restrained smiles; do not age them to match the older preview couple.',
46:'Keep the person’s own hairstyle, colour and texture; let a few strands move naturally in the breeze. A relaxed closed-mouth smile and gaze towards the sea. Do not impose braids or change ethnicity.',
47:'Gently arrange the child’s own hair away from the face; use a small pale flower clip only where it can attach naturally. A shy happy smile, looking down at the ribbon and then towards a reference parent. Keep the child’s actual age and hair length.',
49:'Gently arrange the person’s existing hair and any facial hair. A thoughtful closed-mouth expression looking across the city rather than towards the lens. Do not impose black hair, a centre part, clean-shaven skin or a different ethnicity.',
50:'For the bridal styling, gently arrange the bride’s hair beneath the sheer dupatta, adapting it into a low bun if length permits while preserving hairline and identity. Include a small bindi, centred forehead pendant, traditional earrings and a close-fitting necklace. Preserve the accompanying parent’s actual age, hair and identity; both look towards the dupatta adjustment.',
}
contract='Reference identity comes first: when a personal photo is supplied, preserve every person’s recognizable facial identity, facial structure, distinguishing facial characteristics, skin tone, approximate age, natural body proportions and hairline. Preserve the number and identity of people in couple or group references; never merge faces or add or replace relatives. Do not change ethnicity, skin colour, body shape or gender presentation to match a preview. The scene controls clothing, accessories, expression, pose, lighting and setting. Hair styling may adapt only as specified below; otherwise preserve or gently arrange the existing hair texture, colour and length. Use a separate style preview only for styling and composition, never as a replacement face.'
product='Product identity comes first: if a product reference is attached, preserve its exact shape, proportions, design, colour, fabric or material appearance, pattern, stitching, existing logos, label text and supplied accessories. The presentation below must not replace or redesign the supplied product. Do not erase branding or invent lettering. When no product reference is supplied, use the explicitly labelled example object below.'
records=[]
for i,current in enumerate(original,1):
 p=json.loads(json.dumps(byid[current['id']]))
 unchanged=i in (17,30,43,44)
 issues=[]; reasons=[]
 text=p['prompt_text']
 if i in scenes:
  text=re.sub(r'If a personal reference photo is attached,.*?not as the face to copy\.',contract,text,flags=re.S)
  if p['prompt_type']=='reel': text=re.sub(r'Scene: .*?\n\n',f'Scene: {scenes[i]}.\n\n',text,count=1,flags=re.S)
  else: text=re.sub(r'Create a photograph of .*?\n\n',f'Create a photograph of {scenes[i]}.\n\n',text,count=1,flags=re.S)
  text=re.sub(r'Appearance: .*?\n\n',f'Appearance: {appearances[i]}\n\n',text,count=1,flags=re.S)
  issues=['Identity-preservation issue','Hair adaptation issue']
  reasons=['Removed preview-person demographic and grooming instructions that conflicted with the reference; retained the scene, lighting and composition.']
  if re.search(r'Indian|African|Asian|Latino|heritage|white bride|Black|white father|Bengali|Gujarati|Sikh',p['prompt_text']):issues.append('Demographic/ethnicity issue')
  if re.search(r'skin|tall|athletic',p['prompt_text'].split('Create a photograph of')[-1].split('Appearance:')[0]):issues.append('Body/skin-tone issue')
  if re.search(r'year-old|twenties|thirties|forties|fifties|sixties|seventies|young|mature|aged thirty',p['prompt_text']):issues.append('Gender/age issue')
 replacements={
 3:[('individual beard hairs and natural facial lines','natural hair detail and existing facial lines')],
 7:[('sharp face and curls','sharp face and natural hair detail')],
 8:[('Do not hide the glasses or bindi with glare or hair.','Keep any original spectacles and the requested bindi visible without glare or hair obscuring them.')],
 13:[('The girl reaches towards a flower tray while an adult assists nearby; the others watch.','Assign the flower-tray gesture to one reference person, with adult assistance if the person is a child; the others watch.'),('Grandfather in cream with an indigo waistcoat, grandmother in indigo, mother in marigold yellow and girl in dark blue;','Distribute cream, indigo and marigold outfits appropriately across the supplied family;'),('Exactly four family members.','Use exactly the reference family members. Without a reference, the example composition uses four family members across three generations.')],
 16:[('textured curls, layered ferns','natural hair detail, layered ferns')],
 18:[('The mother supports the toddler securely at her hip beside a mixing bowl; the father tends the pan and the older child helps at the counter.','An adult tends the pan and the others help with mixing and arranging pancakes. If the reference includes a toddler, another adult supports the toddler securely away from the stove.'),('Exactly two adults and two children;','Exactly the supplied family members; without a reference use an example of two adults and two children;')],
 22:[('retain an ordinary athletic physique','retain the reference person’s actual physique')],
 26:[('Mustard jacket on the woman, navy jacket on the man','One mustard jacket and one navy jacket assigned to the reference couple')],
 28:[('individual silver strands','individual natural hair strands')],
 34:[('Navy turban, brown riding jacket','Original or explicitly requested headwear, brown riding jacket'),('Do not replace the turban with a cap or crop its top.','Do not replace meaningful reference headwear or crop its top.')],
 36:[('one child pipes icing and the other arranges decorations, with the adults assisting','one family member pipes icing and another arranges decorations, with adult help for any children'),('Exactly four family members,','Exactly the supplied family members (four in the no-reference example),')],
 38:[('two small silver hoops and distinct curls','optional small silver hoops and natural hair detail')],
 45:[('mature facial lines','each person’s actual facial lines'),('Preserve glasses, bindi, bun and joined-hand positions between shots.','Preserve the chosen styling, any original glasses, requested bindi and joined-hand positions between shots.')],
 46:[('braids','hair')],
 47:[('two parents help tie one ribbon','the reference parents help tie one ribbon'),('candle flames','unlit candles')],
 49:[('the man leaning','the person leaning'),('his profile','their profile'),('as he makes','as the person makes')],
 50:[('her mother','the reference parent'),('Her mother','The reference parent'),('the mother','the parent'),('mother in a muted','parent in a muted'),('mother’s','parent’s')],
 }
 for a,b in replacements.get(i,[]):text=text.replace(a,b)
 if i in (13,18,36):reasons.append('Made group composition reference-controlled instead of forcing the preview family count, ages and roles.');issues.append('Requires substantial rewrite')
 if i==12:reasons.append('Kept essential Krishna curls, expression, U-shaped tilak, feather and safe flute pose; explicitly allowed hairstyle transformation without replacing the child.');issues.append('Pose/expression issue')
 if i==22:reasons.append('Removed physique enhancement and retained the supplied body proportions.')
 if i in (23,37,48):
  text=re.sub(r'If a product reference is attached,.*?erase its label\.',product,text,flags=re.S)
  if i==23:
   text=text.replace('Create a photograph of an unbranded amber glass skincare bottle with a blank cream label','Create a photograph of the supplied skincare bottle').replace('Appearance: Show one small cylindrical amber glass bottle','Appearance: Only when no product reference is supplied, use this example: one small cylindrical amber glass bottle').replace('Essential visible details: One bottle, one black cap attached correctly, blank cream label,','Essential visible details: One reference bottle with its actual cap and existing label intact (black cap and blank cream label only for the no-reference example),')
  elif i==37:
   text=text.replace('Create a photograph of a handmade terracotta ceramic cup','Create a photograph of the supplied ceramic cup').replace('showing uneven glaze and the maker’s texture, no branding','showing its actual glaze and maker’s texture, preserving any supplied branding').replace('Appearance: Show a single handmade rounded terracotta mug','Appearance: Only without a product reference, use this example: a single handmade rounded terracotta mug').replace('Essential visible details: One attached handle, open rim, uneven glaze,','Essential visible details: The supplied number of handles, original rim and glaze,')
  else:
   text=text.replace('Scene: an unbranded clear perfume bottle with pale amber liquid','Scene: the supplied perfume bottle').replace('Appearance: Show one clear rectangular perfume bottle','Appearance: Only without a product reference, use this example: one clear rectangular perfume bottle').replace('Use no label or lettering.','Use no label or lettering for this fictional example only; preserve existing product branding in reference-based work.').replace('one gold cap','its original cap').replace('bevelled glass','original glass geometry')
  issues=['Image-generation ambiguity','Requires substantial rewrite'];reasons=['Separated the no-reference example object from mandatory reference product fidelity; removed blank-label, shape and colour instructions that would redesign a supplied product.']
 if i==42:
  text=text.replace('actual sitter’s grey hair arrangement','actual sitter’s hair arrangement').replace('Original saree pattern and border, period blouse','Original clothing pattern, borders and construction')
  issues=['Minor optimization required'];reasons=['Removed assumptions that every restored source has grey hair and a saree; preserved conservative restoration instructions.']
 if not unchanged:
  p['prompt_text']=text
  if p.get('reel'):
   for s in p['reel']['scenes']:
    for a,b in replacements.get(i,[]):s['action']=s['action'].replace(a,b)
    if i==48:s['action']=s['action'].replace('bevelled glass','original glass geometry')
  for f in p['faqs']:
   if 'essential' in f['question'].lower() or 'details' in f['question'].lower():
    m=re.search(r'Essential visible details: (.*?)(?:\n\n|$)',text,re.S)
    if m:f['answer']=m.group(1)
  p['updated_at']='2026-09-10T14:00:00.000Z'
  current.update({k:p[k] for k in ('prompt_text','faqs','reel','updated_at')})
 records.append({'id':p['id'],'slug':p['slug'],'type':p['prompt_type'],'classification':issues or ['No change required'],'substantial': 'Requires substantial rewrite' in issues,'reason':reasons or ['Scoped edit already preserves the source identity and restricts styling changes appropriately.'],'baseline_sha256':hashlib.sha256(byid[p['id']]['prompt_text'].encode()).hexdigest(),'reviewed_sha256':hashlib.sha256(current['prompt_text'].encode()).hexdigest(),'preview_review':'contact-sheet reviewed; individual replacement review tracked separately'})
(ROOT/'content/prompts.json').write_text(json.dumps(original,ensure_ascii=False,indent=2)+'\n')
(AUDIT/'prompt-audit.json').write_text(json.dumps({'baseline':'baseline.json','scope':'All 50 published records at snapshot time, including text, scene output, metadata and visible preview contact sheets','records':records},ensure_ascii=False,indent=2)+'\n')
print('Reviewed',len(records),'unchanged',sum(r['classification']==['No change required'] for r in records),'modified',sum(r['classification']!=['No change required'] for r in records))
