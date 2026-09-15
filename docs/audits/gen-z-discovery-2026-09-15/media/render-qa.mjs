import sharp from 'sharp';
import fs from 'node:fs';
const root='docs/audits/gen-z-discovery-2026-09-15';
const a=JSON.parse(fs.readFileSync(`${root}/candidates.json`));
const files=['GZ01-corrected.png','GZ02.png','GZ03-corrected.png','GZ04.png','GZ05-corrected.png'];
const sources=['content/prompts.json','content/expansion/prompts.json','content/additions/creative-prompts.json','content/additions/social-prompts.json'];
const old=sources.flatMap(p=>JSON.parse(fs.readFileSync(p)));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const label=(text,w=300)=>Buffer.from(`<svg width="${w}" height="50"><rect width="100%" height="100%" fill="white"/><text x="8" y="20" font-family="Arial" font-size="13">${esc(text.slice(0,43))}</text></svg>`);
async function sheet(entries,cols,file){const w=300,h=425,comps=[];for(let i=0;i<entries.length;i++){const e=entries[i],x=i%cols*w,y=Math.floor(i/cols)*h; if(e.file&&fs.existsSync(e.file)) comps.push({input:await sharp(e.file).resize(w,375,{fit:'contain',background:'#ededed'}).png().toBuffer(),left:x,top:y});comps.push({input:label(e.title),left:x,top:y+375});}await sharp({create:{width:w*cols,height:h*Math.ceil(entries.length/cols),channels:3,background:'#ededed'}}).composite(comps).png().toFile(`${root}/media/${file}`);}
const newer=a.slice(0,5).map((c,i)=>({file:`${root}/media/sources/${files[i]}`,title:`${c.id} ${c.title}${i===4?' REJECTED':''}`}));
await sheet(newer,5,'contact-sheet.png');
await sheet(newer.slice(0,4),4,'accepted-contact-sheet.png');
const comp=[];for(let i=0;i<5;i++){comp.push(newer[i]);const p=old.find(p=>p.slug===a[i].nearest_existing_picmagic_prompt);comp.push({file:`public${p.preview_image_url}`,title:fs.existsSync(`public${p.preview_image_url}`)?`Existing: ${p.title}`:'Nearest draft: no image available'});}
const frame=old.find(p=>p.slug==='a-fold-around-you-profile');comp.push(newer[3],{file:`public${frame.preview_image_url}`,title:'Alternative: A Fold Around You'});
await sheet(comp,2,'new-vs-existing.png');
await sheet(fs.readdirSync(`${root}/media/sources`).map(file=>({file:`${root}/media/sources/${file}`,title:file})),4,'all-attempts.png');
const crops=[];for(const [j,size] of [40,64,128].entries()){const raw=await sharp(newer[4].file).resize(size,size).png().toBuffer();crops.push({input:raw,left:20,top:30+j*165});const mask=Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`);crops.push({input:await sharp(raw).composite([{input:mask,blend:'dest-in'}]).png().toBuffer(),left:180,top:30+j*165});}await sharp({create:{width:340,height:500,channels:4,background:'#eeeeee'}}).composite(crops).png().toFile(`${root}/media/profile-crop-review.png`);
