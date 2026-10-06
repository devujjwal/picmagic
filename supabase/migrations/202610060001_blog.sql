-- Local-first editorial infrastructure. Do not apply to production without release approval.
create table public.blog_authors (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  bio text not null,
  profile_path text not null
);
create table public.blog_articles (
  id uuid primary key,
  version integer not null default 1 check (version = 1),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 120),
  title text not null,
  excerpt text not null,
  body jsonb not null check (jsonb_typeof(body) = 'array' and jsonb_array_length(body) > 0),
  author_id text not null references public.blog_authors(id),
  reviewed_by text,
  article_type text not null check (article_type in ('guide','ideas','lab')),
  primary_topic text not null,
  related_prompts uuid[] not null default '{}',
  related_collections text[] not null default '{}',
  related_articles text[] not null default '{}',
  seo_title text not null,
  meta_description text not null,
  featured_image jsonb not null,
  primary_conversion jsonb not null,
  status text not null default 'draft' check (status in ('draft','review','published')),
  is_indexable boolean not null default false,
  is_featured boolean not null default false,
  date_published timestamptz,
  date_modified timestamptz not null default now(),
  created_at timestamptz not null default now(),
  noindex_reason text,
  noindex_review_at timestamptz,
  sources jsonb not null default '[]',
  evidence_note text not null default '',
  check (status = 'published' or not is_indexable),
  check (status <> 'published' or date_published is not null),
  check (status <> 'published' or is_indexable or (coalesce(length(trim(noindex_reason)), 0) > 0 and noindex_review_at is not null)),
  check (status <> 'published' or article_type <> 'lab' or (length(trim(evidence_note)) > 0 and jsonb_array_length(sources) > 0))
);
create index blog_discovery on public.blog_articles(status, is_indexable, date_published desc);
create table public.blog_redirects (
  old_slug text primary key,
  article_id uuid not null references public.blog_articles(id) on delete cascade
);
alter table public.blog_authors enable row level security;
alter table public.blog_articles enable row level security;
alter table public.blog_redirects enable row level security;
create policy "Read editorial authors" on public.blog_authors for select to anon, authenticated using (true);
create policy "Admins manage editorial authors" on public.blog_authors for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Read public articles" on public.blog_articles for select to anon, authenticated using (
  (status = 'published' and date_published <= now() and (is_indexable or noindex_review_at > now())) or public.is_admin()
);
create policy "Admins manage articles" on public.blog_articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Read published article redirects" on public.blog_redirects for select to anon, authenticated using (
  exists(select 1 from public.blog_articles a where a.id = article_id and a.status = 'published' and a.date_published <= now() and (a.is_indexable or a.noindex_review_at > now())) or public.is_admin()
);
create policy "Admins manage article redirects" on public.blog_redirects for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.blog_authors, public.blog_articles, public.blog_redirects to anon;
grant select, insert, update, delete on public.blog_authors, public.blog_articles, public.blog_redirects to authenticated;

-- Preserve URL and first-publication history transactionally, including through direct admin writes.
create function public.blog_article_history() returns trigger language plpgsql set search_path = '' as $$
begin
  if exists(select 1 from public.blog_redirects r where r.old_slug = new.slug and r.article_id <> new.id) then
    raise exception 'This slug belongs to an existing article redirect';
  end if;
  if tg_op = 'UPDATE' then
    new.created_at := old.created_at;
    new.date_published := coalesce(old.date_published, new.date_published);
    if (to_jsonb(new) - 'date_modified') is distinct from (to_jsonb(old) - 'date_modified') then
      new.date_modified := now();
    else
      new.date_modified := old.date_modified;
    end if;
    if new.slug <> old.slug then
      update public.blog_articles set related_articles = array_replace(related_articles, old.slug, new.slug)
      where id <> new.id and old.slug = any(related_articles);
    end if;
    if new.slug <> old.slug and old.date_published is not null then
      insert into public.blog_redirects(old_slug, article_id) values(old.slug, new.id)
      on conflict(old_slug) do update set article_id = excluded.article_id;
    end if;
  else
    new.created_at := now();
    new.date_modified := now();
  end if;
  if new.status = 'published' then
    new.date_published := coalesce(new.date_published, now());
    if new.date_published > now() then raise exception 'Scheduled publication is not supported'; end if;
    if not new.is_indexable and (new.noindex_review_at <= now() or new.noindex_review_at > now() + interval '30 days') then
      raise exception 'Temporary noindex needs a future review deadline within 30 days';
    end if;
  end if;
  return new;
end $$;
create trigger blog_article_history before insert or update on public.blog_articles for each row execute function public.blog_article_history();

insert into public.blog_authors(id, name, bio, profile_path) values (
  'picmagic-editorial', 'PicMagic Editorial',
  'PicMagic explains how to choose and adapt its visual concepts. Guides distinguish prompt methodology, illustrative AI previews and documented tool tests. We do not claim guaranteed likeness or model compatibility.',
  '/about#picmagic-editorial'
);
