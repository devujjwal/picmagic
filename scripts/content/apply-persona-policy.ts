import fs from "node:fs";
import crypto from "node:crypto";
import { personaPreamble, PERSONA_POLICY_VERSION, type PersonaPolicy } from "../../lib/prompts/persona";
const path="content/prompts.json";
const prompts=JSON.parse(fs.readFileSync(path,"utf8"));
const provenance=JSON.parse(fs.readFileSync("content/image-provenance.json","utf8"));
const auditPath="docs/audits/library-2026-09/prompt-audit.json";
const audit=JSON.parse(fs.readFileSync(auditPath,"utf8"));
for(const p of prompts){
 const policy:PersonaPolicy=p.subject==="Product"?"product":"person";
 let body=p.prompt_text;
 if(body.includes("CREATIVE DIRECTION:")) body=body.split("CREATIVE DIRECTION:").at(-1)!.trim();
 body=body.replace(/Reference identity comes first:.*?replacement face\.\s*/s,"");
 const fallback=p.subject==="Kid"?"child":p.subject==="Family"?"family":p.subject==="Couple"?"adult couple":`adult ${p.subject.toLowerCase()}`;
 p.prompt_text=personaPreamble(policy,fallback,p.prompt_type==="photo_edit")+"\n\n"+body;
 p.persona_policy=policy;p.persona_version=PERSONA_POLICY_VERSION;
 p.image_brief=provenance.find((r:{slug:string})=>r.slug===p.slug)?.brief||p.image_brief;
 // Descriptions explain the usable concept; original demographic briefs stay in asset provenance.
 const scene=body.match(/(?:Create a photograph of |Scene: )(.*?)(?:\n\n|$)/s)?.[1];
 if(scene)p.description=`${p.title}: ${scene.charAt(0).toUpperCase()+scene.slice(1)} Reference photos determine identity; adapt the styling to make the idea your own.`;
 if(p.subject==="Product")p.description=`${p.title}. A ${p.style.join(", ").toLowerCase()} presentation with ${p.lighting}. Keep the supplied product's design, colour, materials and branding intact; the preview object is an example.`;
 p.seo_description=p.description.slice(0,157).replace(/\s+\S*$/,"")+"…";
 const r=audit.records.find((r:{id:string})=>r.id===p.id);
 if(r){if(r.classification[0]==="No change required"){r.classification=["Minor optimization required"];r.reason=["Kept the already-correct scoped-edit body; added the required explicit reference and no-reference persona modes."];r.creative_body_retained=true;}r.reviewed_sha256=crypto.createHash("sha256").update(p.prompt_text).digest("hex");}
}
fs.writeFileSync(path,JSON.stringify(prompts,null,2)+"\n");fs.writeFileSync(auditPath,JSON.stringify(audit,null,2)+"\n");
