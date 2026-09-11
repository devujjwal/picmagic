import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[2]; d=root/'docs/audits/library-2026-09'
ps=json.loads((root/'content/prompts.json').read_text()); provenance=json.loads((root/'content/image-provenance.json').read_text())
replace={2,3,4,9,10,16,18,25,33,43,46,49}; records=[]; queue=[]
by_slug={r['slug']:r for r in provenance}
manifest={r['slug']:r for r in json.loads((d/'reel-preview-manifest.json').read_text())}
for n,p in enumerate(ps,1):
 r=by_slug[p['slug']]
 old=r.get('previous_asset',r);human=p['subject']!='Product'; intended=bool(re.search(r'Indian|South Asian|Bengali|Gujarati|Sikh',old['brief'])) if human else None
 replaced=r['tool']=='ChatGPT web image generation'
 record={'slug':p['slug'],'human_focused':human,'source_intended_south_asian_before':intended,'source_intended_south_asian_after':True if replaced else intended,'review_method':'Full-library contact sheet visual inspection, generation brief comparison; replacement assets additionally inspected at full resolution','decision':'replaced' if replaced else 'replace' if n in replace else 'retain','reason':'Strengthen Indian/South Asian representation in prominent discovery/category imagery using a newly generated fictional persona.' if n in replace else 'Scene, count, clothing, major accessories, lighting and composition represent the concept; retained for relevant Indian styling or international visual diversity.','original_asset':old['preview']['path'],'asset':p['preview_image_url']}
 records.append(record)
 if n in replace:
  default={'Kid':'a fictional Indian child about seven years old, ordinary child proportions','Couple':'a fictional Indian/South Asian adult couple with distinct natural faces, individual brown complexions, ordinary proportions','Family':'a fictional Indian/South Asian family with distinct faces and age-appropriate proportions, count and roles as in the specified scene','Man':'a fictional Indian man with natural medium-brown complexion, ordinary proportions and a distinct face','Woman':'a fictional Indian woman with natural brown complexion, ordinary proportions and a distinct face'}[p['subject']]
  body=p['prompt_text'].split('CREATIVE DIRECTION:')[-1].strip()
  # Source-specific edits need a fictional standalone example, not an unseen reference.
  if n==43:body='A fictional Indian man in his late twenties with short wavy dark hair, light stubble, a black everyday overshirt and an ordinary build. Calm serious expression, direct eye contact, medium three-quarter portrait against a clean stone-grey studio wall. Soft side window light. Preserve natural pores, fine hair edges and the entire head in frame.'
  if n==25:body='Two fictional Indian parents in their early thirties, distinct faces and different natural brown complexions, wearing cream cotton clothing. One cradles their fully wrapped newborn with head and neck supported; the other stands close with one hand resting near the supporting forearm. Three distinct visible faces. Tender gazes down at the newborn, softly lit bedroom window, 50mm f/4 intimate medium portrait. Secure supporting hands, no unsupported infant head.'
  brief=f'Generate one original photographic preview for PicMagic: {p["title"]}. Use {default}. This is a new fictional preview persona, not an identity edit. {body} Use Indian/South Asian appearance explicitly, retaining diversity of faces and skin tones rather than copying previous generated people. Single 4:5 portrait, ideally 1200x1500; for reel concepts create only one still first-frame poster. No text, watermark or collage.'
  queue.append({'id':p['slug'],'type':'replacement_image','status':'integrated' if replaced else 'awaiting_generation','workflow':'ChatGPT UI only; never Codex image generation','dimensions':[p['image_width'],p['image_height']] if replaced else [1200,1500],'prompt':r['brief'] if replaced else brief,'target':'public'+p['preview_image_url'] if replaced else f'public/previews/{p["slug"]}-20260910.webp'})
 if p.get('reel'):
  if p.get('preview_video'):
   m=manifest[p['slug']]
   queue.append({'id':p['slug'],'type':'video','status':'integrated','duration':m['duration_seconds'],'dimensions':[m['width'],m['height']],'format':'H.264 MP4, no audio, faststart','prompt':m['prompt'],'target':m['optimized_path'],'provider':m['provider'],'poster':m['source_poster']})
   continue
  queue.append({'id':p['slug'],'type':'video','status':'external_generation_required','duration':8,'dimensions':[720,1280],'format':'H.264 MP4, no audio, faststart, target under 1.5 MB','prompt':f'Create an 8-second 9:16 motion preview from the approved {p["slug"]} poster. Use 0–2 seconds for the established scene, 2–6 seconds for this specific small action: {p["reel"]["scenes"][0]["action"]} Settle during 6–8 seconds into a gentle loop-compatible hold. Keep the same identities, hairstyle, wardrobe, props and product labels. Natural motion only, no morphing or zoom-only still animation. No audio or text overlay.','target':f'public/videos/{p["slug"]}.mp4'})
(d/'preview-audit.json').write_text(json.dumps({'measurement':'Intended persona from explicit AI generation briefs, not inferred ethnicity from face appearance. Unspecified briefs are not counted as South Asian.','human_previews':sum(x['human_focused'] for x in records),'south_asian_before':sum(x['source_intended_south_asian_before'] is True for x in records),'south_asian_current':sum(x['source_intended_south_asian_after'] is True for x in records),'records':records},ensure_ascii=False,indent=2)+'\n')
(d/'existing-asset-queue.json').write_text(json.dumps(queue,ensure_ascii=False,indent=2)+'\n')
print('Human previews',sum(x['human_focused'] for x in records),'South Asian before',sum(x['source_intended_south_asian_before'] is True for x in records),'current',sum(x['source_intended_south_asian_after'] is True for x in records))
