/** Text-only fictional fixtures. No provider uploads or media generation. */
import { writeFileSync } from "node:fs";
import { TemplatePromptProvider, type GeneratorInput } from "../../features/generator/provider";
import { generateFriendsTrip, friendsTripDefaults } from "../../features/generator/friends-trip";
const provider = new TemplatePromptProvider();
const input: GeneratorInput = {subject:"Woman",style:"Natural",background:"Garden",outfit:"Keep original outfit",lighting:"Golden Hour",framing:"Half Body",aspect_ratio:"4:5"};
const results={photo:provider.generatePhotoPrompt(input),lighting:provider.generatePhotoEditPrompt({...input,improvement:"Improve Lighting"}),reel:provider.generateReelPrompt(input),friends:generateFriendsTrip(friendsTripDefaults),creativeAdult:provider.generatePhotoPrompt({...input,age_group:"Adult"}),creativeOlder:provider.generateReelPrompt({...input,age_group:"Older adult"})};
writeFileSync("docs/audits/postrelease-fixes-2026-10-05/generated-after.json",JSON.stringify(Object.fromEntries(Object.entries(results).map(([key,result])=>[key,{...result,shortened:provider.improvePrompt({text:result.text},"shorten").text}])),null,2)+"\n");
console.log(Object.entries(results).map(([flow,result])=>({flow,characters:result.text.length,shortened:provider.improvePrompt({text:result.text},"shorten").text.length})));
