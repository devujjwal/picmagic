// Local content preparation only. Never contacts a database or deployment service.
import fs from 'node:fs';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const existing=read('content/prompts.json');
const prompts=read('content/expansion/prompts.json');
const provenance=read('content/image-provenance.json');
const collections=read('content/expansion/collections.json');
let activated=0;
for(const p of prompts){
 const proof=provenance.find(r=>r.preview.path===p.preview_image_url);
 const ready=p.preview_review_status==='approved'&&p.editorial_review_version==='why-ai-2026-09-v1'&&proof&&fs.existsSync(`public${p.preview_image_url}`)&&fs.existsSync(`public${p.thumbnail_url}`);
 if(ready&&!p.is_published){
  p.is_published=true; p.is_indexable=true;
  p.published_at=new Date().toISOString(); p.updated_at=p.published_at; activated++;
 }
}
const byId=new Map([...existing,...prompts].map(p=>[p.id,p]));
for(const c of collections){
 const ready=new Set(c.prompt_ids).size>=4&&c.prompt_ids.every(id=>byId.get(id)?.is_published)&&c.description.length>=120;
 c.active=ready; c.is_indexable=ready;
 c.featured_image=byId.get(c.prompt_ids[0]).preview_image_url;
}
fs.writeFileSync('content/expansion/prompts.json',JSON.stringify(prompts,null,2)+'\n');
fs.writeFileSync('content/expansion/collections.json',JSON.stringify(collections,null,2)+'\n');
console.log(`${activated} reviewed local records activated; ${collections.filter(c=>c.active).length}/31 collections ready. No production changes.`);
