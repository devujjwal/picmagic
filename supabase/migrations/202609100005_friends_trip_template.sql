-- Local QA first. No paid services or production migration from this file.
alter table public.prompts add column if not exists generation_mode text check (generation_mode in ('reference-optional','reference-required'));
alter table public.prompts add column if not exists reel_template jsonb;
alter table public.prompts add column if not exists place_name text;
alter table public.prompts add column if not exists people_count integer check (people_count between 1 and 20);
alter table public.prompts add column if not exists poster_role text check (poster_role in ('concept-preview','source-reference'));
-- Integration-friendly names derived from the existing centralized media fields.
-- Zod strips these read-only aliases before admin/seed writes and duplication.
alter table public.prompts add column if not exists preview_video_url text generated always as (preview_video->>'url') stored;
alter table public.prompts add column if not exists poster_image_url text generated always as (preview_image_url) stored;
alter table public.prompts add column if not exists video_width integer generated always as ((preview_video->>'width')::integer) stored;
alter table public.prompts add column if not exists video_height integer generated always as ((preview_video->>'height')::integer) stored;
alter table public.prompts add column if not exists video_duration numeric generated always as ((preview_video->>'duration')::numeric) stored;
alter table public.prompts add column if not exists video_format text generated always as (case when preview_video is not null and preview_video <> 'null'::jsonb then 'mp4' end) stored;
create or replace function public.validate_friends_trip() returns trigger language plpgsql set search_path='' as $$
begin
 if new.poster_role = 'source-reference' and (new.is_published or (new.preview_video is not null and new.preview_video <> 'null'::jsonb)) then raise exception 'Source references are not approved public concept previews'; end if;
 if new.reel_template is not null and new.reel_template <> 'null'::jsonb then
  if (new.reel_template->>'key') is distinct from 'cinematic-friends-trip-v1' or new.prompt_type <> 'reel' or new.aspect_ratio <> '9:16' or new.generation_mode is distinct from 'reference-required' then raise exception 'Invalid friends trip template'; end if;
  if new.people_count is distinct from (new.reel_template->'variables'->>'friends_count')::integer or new.people_count not between 2 and 8 or new.place_name is distinct from (new.reel_template->'variables'->>'place_name') or (new.reel->>'duration')::integer is distinct from (new.reel_template->'variables'->>'duration')::integer or (new.reel->>'duration')::integer not between 10 and 15 then raise exception 'Template variable mismatch'; end if;
  if new.preview_video is not null and new.preview_video <> 'null'::jsonb and (abs((new.preview_video->>'width')::numeric / nullif((new.preview_video->>'height')::numeric,0) - 9.0/16) > .005 or (new.preview_video->>'duration')::numeric not between 6 and 8) then raise exception 'Friends preview must be vertical and 6-8 seconds'; end if;
 end if;
 return new;
end; $$;
drop trigger if exists validate_friends_trip on public.prompts;
create trigger validate_friends_trip before insert or update on public.prompts for each row execute function public.validate_friends_trip();
