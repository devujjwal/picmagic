-- Apply to local/test first. Nullable columns permit old unpublished rows during rollout.
alter table public.prompts add column if not exists distinctiveness_score integer check (distinctiveness_score between 1 and 5);
alter table public.prompts add column if not exists why_ai text;
alter table public.prompts add column if not exists content_intent text check (content_intent in ('creative','utility'));
alter table public.prompts add column if not exists editorial_review_version text;
alter table public.prompts add column if not exists preview_review_status text check (preview_review_status in ('approved','replacement-required','generation-required'));

create or replace function public.require_editorial_review() returns trigger language plpgsql set search_path='' as $$
begin
 if new.is_published then
  if new.editorial_review_version is distinct from 'why-ai-2026-09-v1'
   or new.distinctiveness_score is null or new.distinctiveness_score < 3
   or length(trim(coalesce(new.why_ai,''))) < 40
   or new.content_intent is null
   or new.preview_review_status is distinct from 'approved' then
   raise exception 'Published prompts require editorial and preview review';
  end if;
  if (new.content_intent='creative' and new.distinctiveness_score < 4)
   or ((new.is_featured or new.is_trending) and (new.content_intent <> 'creative' or new.distinctiveness_score < 4)) then
   raise exception 'Featured creative discovery requires scores 4–5; utility is separate';
  end if;
  if new.prompt_type in ('reel','video') and (length(trim(coalesce(new.reel->>'hook','')))=0 or length(trim(coalesce(new.reel->>'progression','')))=0 or length(trim(coalesce(new.reel->>'payoff','')))=0) then
   raise exception 'Published reels require hook, progression and payoff';
  end if;
 end if;
 return new;
end; $$;
drop trigger if exists prompts_editorial_review on public.prompts;
create trigger prompts_editorial_review before insert or update on public.prompts for each row execute function public.require_editorial_review();
