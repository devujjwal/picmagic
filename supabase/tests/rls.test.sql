begin;
create extension if not exists pgtap with schema extensions;
select plan(11);
insert into auth.users(id,email) values('11111111-1111-4111-8111-111111111111','admin-rls@example.test'),('22222222-2222-4222-8222-222222222222','reader-rls@example.test');
insert into public.admin_users(user_id) values('11111111-1111-4111-8111-111111111111');
insert into public.categories(id,slug,name,description) values('test-category','test-category','Test category','A useful category introduction for testing access policies.');
insert into public.prompts(id,slug,title,description,prompt_text,category_id,prompt_type,subject,preview_image_url,thumbnail_url,image_width,image_height,image_alt,is_published,published_at,distinctiveness_score,why_ai,content_intent,editorial_review_version,preview_review_status) values
('33333333-3333-4333-8333-333333333333','published-look','Published test look','A useful description of the published testing look.','Create a natural photograph with soft lighting, realistic texture and carefully composed framing.','test-category','photo','Woman','/previews/test.webp','/previews/test-thumb.webp',960,1200,'Test preview',true,now(),4,'A useful isolated fixture to verify RLS with the current editorial publication contract.','creative','why-ai-2026-09-v1','approved'),
('44444444-4444-4444-8444-444444444444','draft-look','Unpublished test look','A useful description of the unpublished testing look.','Create a natural photograph with soft lighting, realistic texture and carefully composed framing.','test-category','photo','Man','/previews/test.webp','/previews/test-thumb.webp',960,1200,'Test preview',false,null,null,null,null,null,null);
set local role anon;
select is((select count(*)::integer from public.prompts where category_id='test-category'),1,'Anonymous sees only published content');
select is(public.is_admin(),false,'Anonymous is not an admin');
select throws_ok($$insert into public.categories(id,slug,name,description) values('forbidden','forbidden','Forbidden','This mutation should be denied by database privileges.')$$,'42501',null,'Anonymous cannot write categories');
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
select is(public.is_admin(),false,'Regular user is not an admin');
select is((select count(*)::integer from public.prompts where category_id='test-category'),1,'Regular user cannot read drafts');
select throws_ok($$insert into public.categories(id,slug,name,description) values('forbidden','forbidden','Forbidden','This mutation should be denied by row level security.')$$,'42501',null,'Regular user cannot write categories');
select throws_ok($$insert into storage.objects(bucket_id,name) values('previews','unauthorized.webp')$$,'42501',null,'Regular user cannot upload previews');
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
select is(public.is_admin(),true,'Provisioned administrator is authorized');
select is((select count(*)::integer from public.prompts where category_id='test-category'),2,'Administrator can read drafts');
select lives_ok($$update public.prompts set slug='published-look-renamed' where id='33333333-3333-4333-8333-333333333333'$$,'Administrator can change a canonical path');
select is((select new_path from public.content_redirects where old_path='/ai-prompts/test-category/published-look'),'/ai-prompts/test-category/published-look-renamed','Canonical move persists redirect');
select * from finish();
rollback;
