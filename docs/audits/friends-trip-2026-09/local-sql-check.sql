-- Disposable QA only; every mutation is rolled back.
begin;
do $$
declare r public.prompts%rowtype; blocked boolean;
begin
 select * into strict r from public.prompts where slug='cinematic-ladakh-friends-trip';
 if r.people_count <> 4 or r.place_name <> 'LADAKH' or r.preview_video_url is not null or r.video_duration is not null or r.poster_image_url <> r.preview_image_url then raise exception 'Media contract mismatch'; end if;
 blocked := false;
 begin update public.prompts set people_count=5 where id=r.id; exception when others then blocked:=true; end;
 if not blocked then raise exception 'Mismatched group count accepted'; end if;
 blocked := false;
 begin update public.prompts set is_published=true, preview_review_status='approved' where id=r.id; exception when others then blocked:=true; end;
 if not blocked then raise exception 'Unreviewed source photograph published'; end if;
 blocked := false;
 begin update public.prompts set poster_role='concept-preview',preview_video='{"url":"/videos/test.mp4","width":1280,"height":720,"duration":7.5}' where id=r.id; exception when others then blocked:=true; end;
 if not blocked then raise exception 'Landscape friends preview accepted'; end if;
 blocked := false;
 begin update public.prompts set generation_mode='reference-optional' where id=r.id; exception when others then blocked:=true; end;
 if not blocked then raise exception 'Identity reference requirement lost'; end if;
 raise notice 'PASS: media aliases and four rejection checks';
end $$;
rollback;
