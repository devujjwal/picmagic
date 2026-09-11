-- Local/test migration first. Fields remain nullable for rolling upgrades.
alter table public.prompts add column if not exists persona_policy text check (persona_policy in ('person','product','person-and-product','animal'));
alter table public.prompts add column if not exists persona_version text check (persona_version = 'reference-first-india-default-v1');
alter table public.prompts add column if not exists preview_video jsonb;
alter table public.collections add column if not exists seo_title text;
alter table public.collections add column if not exists seo_description text;

create or replace function public.save_collection(record jsonb, members uuid[]) returns void language plpgsql security invoker set search_path='' as $$
begin
 if not public.is_admin() then raise exception 'Forbidden'; end if;
 insert into public.collections(id,slug,name,description,kind,is_indexable,active,start_date,end_date,priority,featured_image,seo_title,seo_description)
 values(record->>'id',record->>'slug',record->>'name',record->>'description',record->>'kind',(record->>'is_indexable')::boolean,(record->>'active')::boolean,nullif(record->>'start_date','')::date,nullif(record->>'end_date','')::date,(record->>'priority')::integer,record->>'featured_image',record->>'seo_title',record->>'seo_description')
 on conflict(id) do update set slug=excluded.slug,name=excluded.name,description=excluded.description,kind=excluded.kind,is_indexable=excluded.is_indexable,active=excluded.active,start_date=excluded.start_date,end_date=excluded.end_date,priority=excluded.priority,featured_image=excluded.featured_image,seo_title=excluded.seo_title,seo_description=excluded.seo_description;
 delete from public.collection_prompts where collection_id=record->>'id';
 insert into public.collection_prompts(collection_id,prompt_id) select record->>'id',unnest(members) on conflict do nothing;
end; $$;
revoke all on function public.save_collection(jsonb,uuid[]) from public;
grant execute on function public.save_collection(jsonb,uuid[]) to authenticated;
