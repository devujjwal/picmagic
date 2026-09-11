-- Disposable local QA only. Every mutation rolls back.
begin;
do $$
declare p public.prompts; denied boolean;
begin
 select * into p from public.prompts where is_published and prompt_type='photo' and content_intent='creative' limit 1;
 if p.id is null then raise exception 'Missing positive fixture'; end if;
 update public.prompts set distinctiveness_score=4 where id=p.id;
 denied:=false;
 begin update public.prompts set distinctiveness_score=2 where id=p.id;
 exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'Low score was allowed'; end if;
 denied:=false;
 begin update public.prompts set content_intent='utility',is_featured=true where id=p.id;
 exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'Featured utility was allowed'; end if;
 denied:=false;
 begin update public.prompts set preview_review_status='replacement-required' where id=p.id;
 exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'Unreviewed preview was allowed'; end if;
 denied:=false;
 begin update public.prompts set why_ai='premium cinematic' where id=p.id;
 exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'Empty rationale was allowed'; end if;
 select * into p from public.prompts where is_published and prompt_type='reel' limit 1;
 if p.id is null then raise exception 'Missing reel fixture'; end if;
 denied:=false;
 begin update public.prompts set reel=reel-'hook' where id=p.id;
 exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'Hookless reel was allowed'; end if;
 raise notice 'PASS: valid publication plus five editorial rejection assertions';
end $$;
rollback;
