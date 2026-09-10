-- PicMagic: public read-only catalog and role-protected editorial writes.
create table public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
alter table public.admin_users enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$ select exists(select 1 from public.admin_users where user_id=(select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create policy "Admins can read their role" on public.admin_users for select to authenticated using(user_id=(select auth.uid()));
-- No public role-management policy: provisioning uses the service role only.
create table public.categories (
 id text primary key check(id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), name text not null, description text not null check(length(description)>=30), is_indexable boolean not null default false, seo_title text not null default '', check(id=slug)
);
create table public.prompts (
 id uuid primary key default gen_random_uuid(), slug text not null check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), title text not null check(length(title) between 5 and 160), description text not null check(length(description)>=20), prompt_text text not null check(length(prompt_text) between 60 and 15000), category_id text not null references public.categories(id), prompt_type text not null check(prompt_type in ('photo','photo_edit','reel','video')), subject text not null, style text[] not null default '{}', occasion text not null default 'Everyday', aspect_ratio text not null default '4:5' check(aspect_ratio in ('1:1','4:5','3:4','9:16','16:9')),
 preview_image_url text not null, thumbnail_url text not null, image_width integer not null check(image_width>0), image_height integer not null check(image_height>0), image_alt text not null, lighting text not null default '', framing text not null default '', camera text not null default '', suggested_tools text[] not null default '{}', tags text[] not null default '{}',
 is_featured boolean not null default false, is_trending boolean not null default false, trending_rank integer not null default 0 check(trending_rank>=0), is_published boolean not null default false, is_indexable boolean not null default false, seo_title text not null default '', seo_description text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), published_at timestamptz, faqs jsonb not null default '[]', reel jsonb, image_brief text,
 canonical_path text generated always as (case when prompt_type in ('reel','video') then '/reel-prompts/' || slug else '/ai-prompts/' || category_id || '/' || slug end) stored unique,
 check(not is_published or published_at is not null)
);
create index prompts_public_rank on public.prompts(trending_rank) where is_published;
create index prompts_category on public.prompts(category_id) where is_published;
create table public.tags(id uuid primary key default gen_random_uuid(),name text not null unique);
create table public.prompt_tags(prompt_id uuid references public.prompts(id) on delete cascade,tag_id uuid references public.tags(id) on delete cascade,primary key(prompt_id,tag_id));
create table public.collections (
 id text primary key, slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), name text not null, description text not null check(length(description)>=60), kind text not null check(kind in ('style','subcategory','occasion','seasonal')), is_indexable boolean not null default false, active boolean not null default false, start_date date, end_date date, priority integer not null default 0, featured_image text not null default '', check(start_date is null or end_date is null or end_date>=start_date)
);
create table public.collection_prompts(collection_id text references public.collections(id) on delete cascade,prompt_id uuid references public.prompts(id) on delete cascade,primary key(collection_id,prompt_id));
create table public.content_redirects(old_path text primary key check(old_path ~ '^/(ai-prompts|reel-prompts|collections)/[a-z0-9/-]+$'),new_path text not null check(new_path ~ '^/(ai-prompts|reel-prompts|collections)/[a-z0-9/-]+$'),prompt_id uuid references public.prompts(id) on delete cascade,collection_id text references public.collections(id) on delete cascade,created_at timestamptz not null default now(),check(old_path<>new_path));
-- Canonical moves retain permanent redirects. References track unpublishing/removal.
create function public.prompt_path_history() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if old.canonical_path<>new.canonical_path and old.published_at is not null then
  delete from public.content_redirects where old_path=new.canonical_path;
  update public.content_redirects set new_path=new.canonical_path where prompt_id=new.id;
  insert into public.content_redirects(old_path,new_path,prompt_id) values(old.canonical_path,new.canonical_path,new.id) on conflict(old_path) do update set new_path=excluded.new_path,prompt_id=excluded.prompt_id;
 end if;
 return new;
end; $$;
create trigger prompt_path_history after update on public.prompts for each row execute function public.prompt_path_history();
create function public.collection_path_history() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if old.slug<>new.slug then
  delete from public.content_redirects where old_path='/collections/'||new.slug;
  update public.content_redirects set new_path='/collections/'||new.slug where collection_id=new.id;
  insert into public.content_redirects(old_path,new_path,collection_id) values('/collections/'||old.slug,'/collections/'||new.slug,new.id) on conflict(old_path) do update set new_path=excluded.new_path,collection_id=excluded.collection_id;
 end if; return new;
end; $$;
create trigger collection_path_history after update on public.collections for each row execute function public.collection_path_history();
create function public.sync_prompt_tags() returns trigger language plpgsql security definer set search_path='' as $$
declare tag_name text; tag_uuid uuid;
begin
 delete from public.prompt_tags where prompt_id=new.id;
 foreach tag_name in array new.tags loop
  tag_name=trim(tag_name); if tag_name='' then continue; end if;
  insert into public.tags(name) values(tag_name) on conflict(name) do update set name=excluded.name returning id into tag_uuid;
  insert into public.prompt_tags(prompt_id,tag_id) values(new.id,tag_uuid) on conflict do nothing;
 end loop; return new;
end; $$;
create trigger sync_prompt_tags after insert or update of tags on public.prompts for each row execute function public.sync_prompt_tags();
-- Atomic collection writes prevent a metadata/membership mismatch on partial failure.
create function public.save_collection(record jsonb, members uuid[]) returns void language plpgsql security invoker set search_path='' as $$
begin
 if not public.is_admin() then raise exception 'Forbidden'; end if;
 insert into public.collections(id,slug,name,description,kind,is_indexable,active,start_date,end_date,priority,featured_image)
 values(record->>'id',record->>'slug',record->>'name',record->>'description',record->>'kind',(record->>'is_indexable')::boolean,(record->>'active')::boolean,nullif(record->>'start_date','')::date,nullif(record->>'end_date','')::date,(record->>'priority')::integer,record->>'featured_image')
 on conflict(id) do update set slug=excluded.slug,name=excluded.name,description=excluded.description,kind=excluded.kind,is_indexable=excluded.is_indexable,active=excluded.active,start_date=excluded.start_date,end_date=excluded.end_date,priority=excluded.priority,featured_image=excluded.featured_image;
 delete from public.collection_prompts where collection_id=record->>'id';
 insert into public.collection_prompts(collection_id,prompt_id) select record->>'id',unnest(members) on conflict do nothing;
end; $$;
revoke all on function public.save_collection(jsonb,uuid[]) from public;
grant execute on function public.save_collection(jsonb,uuid[]) to authenticated;
-- Catalog permissions are independent from client-side controls.
alter table public.categories enable row level security;
alter table public.prompts enable row level security;
alter table public.tags enable row level security;
alter table public.prompt_tags enable row level security;
alter table public.collections enable row level security;
alter table public.collection_prompts enable row level security;
alter table public.content_redirects enable row level security;
create policy "Read categories" on public.categories for select to anon,authenticated using(true);
create policy "Read published prompts" on public.prompts for select to anon,authenticated using(is_published or public.is_admin());
create policy "Read tags" on public.tags for select to anon,authenticated using(true);
create policy "Read published prompt tags" on public.prompt_tags for select to anon,authenticated using(exists(select 1 from public.prompts p where p.id=prompt_id and (p.is_published or public.is_admin())));
create policy "Read active collections" on public.collections for select to anon,authenticated using(active or public.is_admin());
create policy "Read published memberships" on public.collection_prompts for select to anon,authenticated using(exists(select 1 from public.collections c where c.id=collection_id and(c.active or public.is_admin())) and exists(select 1 from public.prompts p where p.id=prompt_id and(p.is_published or public.is_admin())));
create policy "Read public redirects" on public.content_redirects for select to anon,authenticated using(exists(select 1 from public.prompts p where p.id=prompt_id and p.is_published) or exists(select 1 from public.collections c where c.id=collection_id and c.active) or public.is_admin());
create policy "Admins manage categories" on public.categories for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage prompts" on public.prompts for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage tags" on public.tags for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage prompt tags" on public.prompt_tags for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage collections" on public.collections for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage memberships" on public.collection_prompts for all to authenticated using(public.is_admin()) with check(public.is_admin());
-- Redirect history is trigger-controlled; clients cannot manufacture open redirects.
grant select on public.categories,public.prompts,public.tags,public.prompt_tags,public.collections,public.collection_prompts,public.content_redirects to anon,authenticated;
grant insert,update,delete on public.categories,public.prompts,public.tags,public.prompt_tags,public.collections,public.collection_prompts to authenticated;
grant select on public.admin_users to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('previews','previews',true,10485760,array['image/webp','image/jpeg','image/png','image/avif']) on conflict(id) do nothing;
create policy "Admins upload previews" on storage.objects for insert to authenticated with check(bucket_id='previews' and public.is_admin());
create policy "Admins update previews" on storage.objects for update to authenticated using(bucket_id='previews' and public.is_admin()) with check(bucket_id='previews' and public.is_admin());
create policy "Admins delete previews" on storage.objects for delete to authenticated using(bucket_id='previews' and public.is_admin());
create policy "Read preview assets" on storage.objects for select to anon,authenticated using(bucket_id='previews');
