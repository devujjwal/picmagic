// Authenticate as the configured administrator; no shared revalidation token or public cache endpoint.
import { createServerClient } from '@supabase/ssr';
const origin=process.env.RELEASE_ORIGIN || 'http://localhost:4313';
if(!['http://localhost:4313','https://picmagic.in'].includes(origin)) throw new Error('Unapproved release origin');
const jar=new Map();
const db=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll:()=>[...jar].map(([name,value])=>({name,value})),setAll:items=>items.forEach(({name,value})=>jar.set(name,value))}});
const {error}=await db.auth.signInWithPassword({email:process.env.PICMAGIC_ADMIN_EMAIL || process.env.E2E_ADMIN_EMAIL,password:process.env.PICMAGIC_ADMIN_PASSWORD || process.env.E2E_ADMIN_PASSWORD});
if(error)throw new Error('Administrator sign-in failed');
const response=await fetch(origin+'/api/admin/revalidate',{method:'POST',headers:{Origin:origin,Cookie:[...jar].map(([k,v])=>`${k}=${v}`).join('; ')}});
if(!response.ok)throw new Error(`Content refresh failed: ${response.status}`);
console.log('Authenticated published content, search and sitemap refresh completed.');
await db.auth.signOut({scope:'local'});
