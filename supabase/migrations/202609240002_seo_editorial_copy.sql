-- Keep hosted editorial copy aligned with the reviewed repository catalogue.
-- Assertions make this batch atomic if the hosted catalogue has drifted.
begin;

do $$
declare
  category_rows integer;
  prompt_rows integer;
  collection_rows integer;
begin
  select count(*) into category_rows
  from public.categories
  where id in ('men','women','couple','kids','travel','festival');

  select count(*) into prompt_rows
  from public.prompts
  where slug in ('double-exposure-fashion-men','double-exposure-fashion-women');

  select count(*) into collection_rows
  from public.collections
  where slug in (
    'romantic','cinematic','studio','dating-profile',
    'dating-profile-reels','instagram-profile-picture','indian-festivals'
  );

  if category_rows <> 6 or prompt_rows <> 2 or collection_rows <> 7 then
    raise exception
      'SEO editorial migration expected 6 categories, 2 prompts and 7 collections; found %, % and %',
      category_rows, prompt_rows, collection_rows;
  end if;
end $$;

update public.categories
set description = case id
  when 'men' then $$Explore AI photo prompts for men that range from relaxed everyday portraits to cinematic fashion and polished profile pictures. Each idea includes practical direction for pose, framing, light and identity preservation, so you can adapt the look to your own reference photo.$$
  when 'women' then $$Discover AI photo prompts for women across modern portraits, Indian fashion, soft editorial light and imaginative transformations. Choose a visual direction, then adapt the complete prompt to your outfit, setting and reference photo without losing the person’s identity.$$
  when 'couple' then $$Find couple photo prompts designed around believable connection rather than stiff matching poses. Explore romantic, pre-wedding and everyday scenes with clear guidance for body language, composition, lighting and preserving both people from their reference photos.$$
  when 'kids' then $$Browse child-friendly AI portrait ideas built around play, curiosity, celebrations and gentle storytelling. The prompts favour natural expressions, age-appropriate styling and careful reference fidelity while giving the image tool specific lighting and composition direction.$$
  when 'travel' then $$Turn travel memories into stronger portraits and story-led scenes without replacing what made the place recognisable. These AI prompts cover street moments, landscapes and group trips with concrete direction for atmosphere, scale, light and reference identity.$$
  when 'festival' then $$Explore Indian festival photo prompts shaped around the colour, light and rituals of the celebration rather than a generic festive backdrop. Use the complete directions to preserve faces and clothing while refining composition, lamps, décor and the mood of the occasion.$$
  else description
end
where id in ('men','women','couple','kids','travel','festival');

update public.prompts
set
  description = $$Build a men’s editorial portrait around two coordinated views of the same identity: a translucent side profile and a grounded full-body pose. The prompt directs understated corduroy, denim, aviators and sepia studio light while keeping the uploaded man’s age, build and facial details recognisable.$$, 
  why_ai = $$AI coordinates a close profile and full-length menswear pose from the same personal reference, retaining the man’s build, facial hair and hairline while creating a layered studio composite that would otherwise require two photographs and manual masking.$$
where slug = 'double-exposure-fashion-men';

update public.prompts
set
  description = $$Create a women’s double-exposure fashion portrait where a soft profile layer frames a confident full-length figure. The directions preserve the uploaded woman’s age, complexion, body shape and hairstyle while adapting the corduroy-and-denim styling to a warm editorial studio scene.$$, 
  why_ai = $$AI can align two views of one woman in a single editorial composition while keeping her facial identity, proportions and hair consistent across both layers, avoiding a second shoot and the manual cut-outs normally needed for this effect.$$
where slug = 'double-exposure-fashion-women';

update public.collections
set description = $$Plan a natural dating-profile reel around four everyday stories: coffee, a bookshop detour, a park conversation and cooking together. Each concept adds a short hook, movement and payoff while keeping the uploaded person recognisable and avoiding exaggerated influencer-style acting.$$
where slug = 'dating-profile-reels';

update public.collections
set
  seo_title = case slug
    when 'romantic' then 'Romantic Couple AI Photo Prompts'
    when 'cinematic' then 'Cinematic AI Photo Prompts and Portrait Ideas'
    when 'studio' then 'Studio Portrait and Product AI Photo Prompts'
    when 'dating-profile' then 'Dating Profile Photo Ideas with Personality'
    when 'dating-profile-reels' then 'Dating Profile Reel Ideas and Video Prompts'
    when 'instagram-profile-picture' then 'AI Profile Picture and DP Prompts for Instagram'
    when 'indian-festivals' then 'Indian Festival AI Photo Prompts and Portrait Ideas'
    else seo_title
  end,
  seo_description = case slug
    when 'romantic' then 'Explore romantic AI photo prompts for couples, from rainy city walks to quiet beach evenings, with natural poses and identity-first reference guidance.'
    when 'cinematic' then 'Create film-like AI portraits with practical direction for atmosphere, lighting and composition while keeping the uploaded person recognisable.'
    when 'studio' then 'Browse studio AI prompts for portraits and products with clean backdrops, controlled lighting and precise composition guidance.'
    when 'dating-profile' then 'Create natural dating-profile photos around coffee, books, parks and cooking, with relaxed expressions and faithful reference identity.'
    when 'dating-profile-reels' then 'Plan short dating-profile reels with everyday stories, natural movement and clear hooks while keeping the uploaded person recognisable.'
    when 'instagram-profile-picture' then 'Explore distinctive AI profile-picture and DP prompts with clear facial framing, controlled light and identity-first reference guidance.'
    when 'indian-festivals' then 'Explore AI photo prompts for Diwali, Holi, Navratri and Krishna-inspired portraits with celebration-specific light, colour and reference fidelity.'
    else seo_description
  end
where slug in ('romantic','cinematic','studio','dating-profile','dating-profile-reels','instagram-profile-picture','indian-festivals');

commit;
