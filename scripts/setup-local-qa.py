import json, subprocess, secrets
from pathlib import Path
result=subprocess.run(['supabase','status','-o','json'],capture_output=True,text=True,check=True)
s=json.loads(result.stdout)
assert s['API_URL']=='http://127.0.0.1:54421','Refusing a non-PicMagic local endpoint'
values={'CONTENT_SOURCE':'supabase','NEXT_PUBLIC_SUPABASE_URL':s['API_URL'],'NEXT_PUBLIC_SUPABASE_ANON_KEY':s['ANON_KEY'],'SUPABASE_SERVICE_ROLE_KEY':s['SERVICE_ROLE_KEY'],'NEXT_PUBLIC_INDEXING_ENABLED':'false','E2E_BASE_URL':'http://localhost:4311','E2E_ADMIN_EMAIL':'picmagic-admin@example.test','E2E_ADMIN_PASSWORD':secrets.token_urlsafe(30)}
Path('.env.qa').write_text('\n'.join(k+'='+v for k,v in values.items())+'\n')
Path('.env.qa').chmod(0o600)
print('Local-only QA environment saved privately.')
