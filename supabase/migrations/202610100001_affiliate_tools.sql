-- Local-only until explicit production migration/release authorization.
create table public.affiliate_providers (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(id) <= 80),
  name text not null check (length(name) between 2 and 80),
  official_url text not null check (official_url like 'https://%' and length(official_url) <= 2000),
  affiliate_url text check (affiliate_url like 'https://%' and length(affiliate_url) <= 2000),
  affiliate_status text not null default 'Researching' check (affiliate_status in ('Researching','Application required','Applied','Approved','Rejected','Unavailable')),
  description text not null check (length(description) between 15 and 240),
  capabilities jsonb not null default '[]' check (jsonb_typeof(capabilities) = 'array' and jsonb_array_length(capabilities) <= 9),
  media text[] not null check (cardinality(media) between 1 and 2 and media <@ array['photo','video']::text[]),
  is_enabled boolean not null default false,
  priority integer not null default 50 check (priority between 0 and 100),
  program_url text check (program_url like 'https://%'),
  evidence_urls text[] not null check (cardinality(evidence_urls) between 1 and 12),
  last_verified_at timestamptz not null,
  approval_evidence text not null default '' check (length(approval_evidence) <= 1000),
  payout_confirmed boolean not null default false,
  placement_confirmed boolean not null default false,
  verified_affiliate_url text,
  affiliate_url_verified_at timestamptz,
  check (affiliate_status <> 'Approved' or (length(trim(approval_evidence)) > 0 and payout_confirmed and placement_confirmed)),
  constraint affiliate_program_required check (affiliate_status <> 'Approved' or program_url is not null),
  check (affiliate_url_verified_at is null or (affiliate_url is not null and verified_affiliate_url = affiliate_url))
);
alter table public.affiliate_providers enable row level security;
revoke all on public.affiliate_providers from anon, authenticated;
grant select, insert, update, delete on public.affiliate_providers to authenticated;
create policy "Only admins manage affiliate providers" on public.affiliate_providers for all to authenticated using (public.is_admin()) with check (public.is_admin());

create function public.affiliate_verification_guard() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.last_verified_at > now() or new.affiliate_url_verified_at > now() then
    raise exception 'Verification cannot be in the future';
  end if;
  if tg_op = 'INSERT' then
    new.verified_affiliate_url := null;
    new.affiliate_url_verified_at := null;
  elsif new.affiliate_url is distinct from old.affiliate_url
    or new.program_url is distinct from old.program_url
    or new.affiliate_status is distinct from old.affiliate_status then
    new.verified_affiliate_url := null;
    new.affiliate_url_verified_at := null;
  end if;
  if tg_op = 'UPDATE' and (new.official_url, new.description, new.capabilities, new.media, new.evidence_urls) is distinct from (old.official_url, old.description, old.capabilities, old.media, old.evidence_urls) and new.last_verified_at = old.last_verified_at then
    raise exception 'Recheck changed public claims and update verification date';
  end if;
  if new.affiliate_status <> 'Approved' then
    new.verified_affiliate_url := null;
    new.affiliate_url_verified_at := null;
  end if;
  return new;
end $$;
create trigger affiliate_verification_guard before insert or update on public.affiliate_providers for each row execute function public.affiliate_verification_guard();

-- Curated public RPC: RLS keeps all private rows/approval notes inaccessible.
-- This function exposes only enabled editorial fields and verified issued URLs.
create function public.affiliate_public_providers() returns setof jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'id', p.id, 'name', p.name, 'official_url', p.official_url,
    'affiliate_status', p.affiliate_status, 'description', p.description,
    'capabilities', p.capabilities, 'media', p.media, 'is_enabled', p.is_enabled,
    'priority', p.priority, 'program_url', p.program_url, 'evidence_urls', p.evidence_urls,
    'last_verified_at', p.last_verified_at, 'affiliate_url_verified_at', p.affiliate_url_verified_at,
    'monetization_ready', coalesce(ready, false),
    'affiliate_url', case when ready then p.affiliate_url else null end
  ) from public.affiliate_providers p cross join lateral (
    select p.affiliate_status = 'Approved' and p.program_url is not null and length(trim(p.approval_evidence)) > 0
      and p.payout_confirmed and p.placement_confirmed and p.affiliate_url is not null
      and p.verified_affiliate_url = p.affiliate_url
      and p.affiliate_url_verified_at <= now()
      and p.affiliate_url_verified_at >= now() - interval '30 days' as ready
  ) verification where p.is_enabled;
$$;
revoke all on function public.affiliate_public_providers() from public;
grant execute on function public.affiliate_public_providers() to anon, authenticated;
