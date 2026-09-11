// Synchronize only the current editorial-approved queue. Never revive archived generic jobs.
import fs from 'node:fs';
const directory='docs/audits/library-2026-09';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const prompts=[...read('content/prompts.json'),...read('content/expansion/prompts.json')];
const queue=read(`${directory}/approved-image-manifest.json`);
for(const job of queue){
 const records=job.used_by.map(slug=>prompts.find(p=>p.slug===slug));
 if(records.some(p=>!p||p.editorial_review_version!==job.editorial_review_version))throw new Error(`Stale editorial job: ${job.id}`);
 const ready=records.every(p=>p.preview_review_status==='approved'&&fs.existsSync(`public${p.preview_image_url}`));
 job.status=ready?'integrated':'approved-awaiting-generation';
 if(ready)job.integrated_paths=records.map(p=>p.preview_image_url);
}
fs.writeFileSync(`${directory}/approved-image-manifest.json`,JSON.stringify(queue,null,2)+'\n');
fs.writeFileSync(`${directory}/generation-queue.json`,JSON.stringify(queue,null,2)+'\n');
console.log(`${queue.filter(j=>j.status==='integrated').length}/${queue.length} editorial-approved image jobs integrated. No generation or publication.`);
