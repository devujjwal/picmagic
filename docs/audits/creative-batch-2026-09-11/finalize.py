from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import json, hashlib, shutil, textwrap
root=Path(__file__).parent
rows=json.loads((root/'manifest.json').read_text())
submissions=json.loads((root/'submitted-prompts.json').read_text())
source_map={'P01':'p01-river','P02':'p02-four-worlds','P03':'p03-mountain','P04':'p04-family','P05':'p05-print','P06':'p06-railway','P08':'p08-tailor','P12':'p12-saree-worlds','P13':'p13-paper','P17':'p17-water'}
bindings={'P01':'river','P02':'gpt','P03':'mountain','P04':'family','P05':'printArt','P06':'railway','P08':'tailor','P12':'saree','P13':'paper','P17':'bottle'}
chats={'P01':'6aa3782a-5f8c-83e9-bc68-1459bcce9bf0','P02':'6aa377ff-08e4-83ee-8d63-d24dd06d53b7','P03':'6aa378bb-94d4-83ee-997f-0bedc670f7a8','P04':'6aa3792c-357c-83e8-b10a-656223d4c653','P05':'6aa37a76-4ccc-83ee-be3d-7b703f6ea6e2','P06':'6aa3798b-3190-83e9-815c-382f4b47b105','P08':'6aa37a02-6a28-83ee-8382-471b858831f2','P12':'6aa37954-5a48-83ee-b573-b09c6fb81943','P13':'6aa37a47-d728-83ee-9e40-803641e1f63f','P17':'6aa3788d-f250-83ee-9711-e71a9c364f15'}
refs={'P02':['p02-identity-fixture.png','p02-observer-trial.png'],'P12':['p12-saree-fixture.png'],'P13':['p13-portrait-fixture.png'],'P17':['p17-bottle-fixture.png']}
alt={'P01':'Woman beside a river at sunset, with an indigo ink shoreline flowing from her open journal into the real water','P02':'The same fictional man in four curved panels: a main portrait, stargazing, making pottery and mountain travel','P03':'Mature man with a clear photographic face above a Himalayan road and mountain landscape blended into his jacket','P04':'Three family members playing chess in a miniature courtyard model on a wooden shelf','P05':'Plum-and-saffron halftone portrait of a mature woman beside a railway window','P06':'Two adults exchange a folded letter beside a heritage railway carriage under warm station lamps','P08':'Miniature tailor with spectacles beside an enormous spool and mountain-like indigo fabric folds','P12':'The same woman and indigo saree with copper border in a basalt courtyard, rain-lit pavilion and pale sculptural studio','P13':'Layered paper-relief portrait of an older woman, with grey paper hair and indigo cloud shapes behind her','P17':'A single dry perfume bottle with bronze cap and blank cream label, framed by a clear water arc on an acrylic plinth'}
qa={'P01':'Curved ink shoreline connects the journal to the river. Face, resting hands and stone remain photographic; background incidental people are not identity subjects. Main subject is readable at card size.', 'P02':'Four intentional depictions, one fictional identity. Compared to both saved fixture and observer trial: face shape, curls, beard and proportions remain recognizable. All panels remain inside 3:4 framing. No claim of guaranteed user-reference fidelity.', 'P03':'One clear face; scenery starts below face in shoulders/jacket. No road over eyes or hollow face. One unoccupied tent, no second protagonist.', 'P04':'Exactly three distinct people with adult/child age contrast. Shelf and cutaway walls establish miniature scale; faces and limbs examined at full resolution. Chess arrangement is decorative, not an exact game position. Use a wide card: family faces are small in dense mobile grids.', 'P05':'Two-ink treatment, halftone and visible age cues. Window shadow crosses shoulder rather than eyes. A small decorative bindi appears in this fictional preview; it is not a mandatory user identity feature. This is artwork, not a literal complexion change.', 'P06':'Two distinct faces and natural eye contact, one letter between separate hands, stationary carriage, warm lamps and clear faces. Bags are worn rather than a separate suitcase; final copy must follow the reviewed image.', 'P08':'One person at uniform miniature scale. Cloth weave, spool and winding seam establish the effect. Hands and proportions examined. Wide card recommended so the face is not reduced to a dot; this is personal art, not a sellable garment depiction.', 'P12':'Exactly three depictions of one model in the same front-three-quarter view. Indigo weave, copper border, blouse and front drape visually consistent with the saved fixture; no back view invented. Full garment visible. Visual inspection is not pixel-exact seller certification: real logos/labels should use source compositing if generation alters them.', 'P13':'Compared to the saved fictional portrait: eye spacing, face shape, smile asymmetry and age cues remain recognizable. Paper edge thickness and fibres are visible; palette is declared material translation rather than literal skin preservation.', 'P17':'Compared to saved bottle fixture: cap, label geometry, visible liquid level and bottle form remain visually consistent. Water stays behind the dry label; one bottle, no water through glass. Label deliberately blank: this does not validate exact seller lettering.'}
assets=root/'assets';assets.mkdir(exist_ok=True)
for r in rows:
 pid=r['id']; r['production_activated']=False
 if pid in source_map:
  src=root/'sources'/(source_map[pid]+'.png'); name=Path(r['output_candidate']).name
  im=Image.open(src).convert('RGB'); size=(1080,1440) if r['ratio']=='3:4' else (960,1200)
  # Only subpixel source-ratio correction; no semantic edits, no upscaling.
  out=ImageOps.fit(im,size,Image.Resampling.LANCZOS)
  out.save(assets/name,'WEBP',quality=86,method=6)
  thumb=name.replace('.webp','-thumb.webp'); thumbsize=(576,768) if r['ratio']=='3:4' else (480,600)
  out.resize(thumbsize,Image.Resampling.LANCZOS).save(assets/thumb,'WEBP',quality=82,method=6)
  r.update(status='generated-reviewed-staged',downloaded_source=str(src.relative_to(root)),source_dimensions=list(im.size),source_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),optimized_path='assets/'+name,thumbnail_path='assets/'+thumb,actual_dimensions=list(size),bytes=(assets/name).stat().st_size,thumbnail_bytes=(assets/thumb).stat().st_size,chat_url='https://chatgpt.com/c/'+chats[pid],source_reference=['sources/'+x for x in refs.get(pid,[])],image_alt=alt[pid],qa=qa[pid],reviewed_at='2026-09-11',display_hint='wide' if pid in ['P02','P04','P08','P12'] else 'standard')
  prompts=[s['prompt'] for s in submissions if s['tab_binding']==bindings[pid]]
  r['submitted_prompts']=prompts
  r['image_prompt']=prompts[-1]
  r['preview_provenance']='ChatGPT web image workflow, fictional subject/product explicitly requested; account displayed Pro. Provider model version not independently established. This is not Codex/Astra generation.'
 else:
  src=Path('public'+r['existing_path']); name=src.name;shutil.copy2(src,assets/name)
  im=Image.open(src)
  r.update(status='retained-reviewed',optimized_path='assets/'+name,actual_dimensions=list(im.size),bytes=src.stat().st_size,source_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),image_alt=r['title'],qa='Retained from the Phase A full-resolution review; no regeneration or semantic asset modification. See original shortlist evidence.',display_hint='standard')
(root/'manifest.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
# Portable visual review document, not a production page.
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',22)
small=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',16)
canvas=Image.new('RGB',(1440,2030),'#f7f5f1');draw=ImageDraw.Draw(canvas)
draw.text((36,25),'PicMagic — approved concept batch / generated preview review',fill='#22251f',font=font)
for i,r in enumerate(rows):
 x=36+(i%4)*351;y=88+(i//4)*640
 im=Image.open(root/r['optimized_path']).convert('RGB');im.thumbnail((321,510),Image.Resampling.LANCZOS)
 canvas.paste(im,(x+(321-im.width)//2,y))
 draw.text((x,y+522),str(r['rank']).zfill(2)+' / '+r['id']+' / '+('retained' if r['id'].startswith('E') else 'ChatGPT'),fill='#60645e',font=small)
 for j,line in enumerate(textwrap.wrap(r['title'],27)):draw.text((x,y+551+j*26),line,fill='#22251f',font=font)
canvas.save(root/'contact-sheet.jpg',quality=91,optimize=True)
print('Prepared',len(rows),'review assets; new web images:',sum(r['bytes'] for r in rows if r['id'].startswith('P')),'bytes')
