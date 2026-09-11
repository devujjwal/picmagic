"""Capture our exact browser-submitted creative briefs, never user account data."""
import json,re
from pathlib import Path
root=Path(__file__).parent
roll=Path('/Users/Ujjwal.Paul/.codex/sessions/2026/09/10/rollout-2026-09-10T12-34-21-01a08a21-bbed-7f00-92d9-95323fb0ea20.jsonl')
rows=[]
for line in roll.open():
 x=json.loads(line);d=x.get('payload',{})
 if x.get('type')!='response_item' or d.get('type')!='function_call' or 'cua_repl' not in d.get('namespace',''):continue
 try:code=json.loads(d['arguments']).get('code','')
 except (ValueError,KeyError):continue
 for m in re.finditer(r'\b(gpt|river|mountain|bottle|family|railway|saree|tailor|paper|printArt)\.paste\(("(?:[^"\\]|\\.)*")\)',code):
  prompt=json.loads(m.group(2))
  if 'PicMagic' not in prompt and 'fictional' not in prompt:continue
  if any(r['prompt']==prompt for r in rows):continue
  rows.append({'tab_binding':m.group(1),'prompt':prompt,'prepared_at':x.get('timestamp'),'note':'Exact text entered through the ChatGPT browser. Completion and observed quality are tracked separately in manifest.json; an initial stale-layout attempt may have needed re-entry.'})
(root/'submitted-prompts.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
print(len(rows),'distinct exact creative briefs captured')
