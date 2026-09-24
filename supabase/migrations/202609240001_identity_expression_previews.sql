-- Publish the reviewed identity-consistent preview batch only after the matching
-- static assets are available on picmagic.in. The assertions make the migration
-- atomic if the production catalog has drifted.
begin;

alter table public.prompts
  drop constraint if exists prompts_persona_version_check;
alter table public.prompts
  add constraint prompts_persona_version_check
  check (persona_version in ('reference-first-india-default-v1', 'identity-expression-age-v2'));

do $$
declare
  matched integer;
begin
  select count(*) into matched
  from public.prompts
  where slug in (
    'the-river-remembers',
    'the-heritage-railway-letter',
    'a-mountain-journey-within',
    'the-tailors-mountain-range',
    'one-day-four-possible-worlds',
    'portrait-cut-from-monsoon-paper',
    'one-saree-three-campaign-worlds',
    'last-train-two-ink-portrait',
    'a-little-rain-a-lot-of-romance',
    'somewhere-in-the-mediterranean',
    'old-school-charm-new-memories',
    'the-desert-in-your-rear-view',
    'a-modern-bridal-heirloom',
    'the-art-of-standing-still',
    'city-lights-main-character-energy'
  );
  if matched <> 15 then
    raise exception 'Expected 15 PicMagic prompt rows, found %', matched;
  end if;
end $$;

with replacements(slug, preview_image_url, thumbnail_url, image_alt) as (
  values
    ('the-river-remembers', '/previews/the-river-remembers-identity-v2-ce7d3f07d3.webp', '/previews/the-river-remembers-identity-v2-ce7d3f07d3-thumb.webp', 'A reflective Indian woman rests an open journal on ghat steps as indigo ink flows from the page into a real river.'),
    ('the-heritage-railway-letter', '/previews/the-heritage-railway-letter-identity-v2-6abc645a5b.webp', '/previews/the-heritage-railway-letter-identity-v2-6abc645a5b-thumb.webp', 'A middle-aged Indian couple exchange a letter beside a heritage train on a softly lit railway platform.'),
    ('a-mountain-journey-within', '/previews/a-mountain-journey-within-identity-v2-ce4a52bab9.webp', '/previews/a-mountain-journey-within-identity-v2-ce4a52bab9-thumb.webp', 'A reflective older Indian man appears above a mountain road woven through his outdoor jacket in a double-exposure portrait.'),
    ('the-tailors-mountain-range', '/previews/the-tailors-mountain-range-identity-v2-d18d512c87.webp', '/previews/the-tailors-mountain-range-identity-v2-d18d512c87-thumb.webp', 'A middle-aged Indian tailor walks through enormous indigo fabric folds shaped like a mountain range.'),
    ('one-day-four-possible-worlds', '/previews/one-day-four-possible-worlds-identity-v2-37337157b7.webp', '/previews/one-day-four-possible-worlds-identity-v2-37337157b7-thumb.webp', 'The same young Indian man appears in four possible worlds as a portrait subject, observer, potter and mountain traveller.'),
    ('portrait-cut-from-monsoon-paper', '/previews/portrait-cut-from-monsoon-paper-identity-v2-e8dbcce134.webp', '/previews/portrait-cut-from-monsoon-paper-identity-v2-e8dbcce134-thumb.webp', 'A mature Indian woman''s recognizable portrait is constructed from layered indigo, cream, umber and silver-grey monsoon paper.'),
    ('one-saree-three-campaign-worlds', '/previews/one-saree-three-campaign-worlds-identity-v2-452d11b29e.webp', '/previews/one-saree-three-campaign-worlds-identity-v2-452d11b29e-thumb.webp', 'The same young Indian woman models one indigo saree in three distinct campaign environments.'),
    ('last-train-two-ink-portrait', '/previews/last-train-two-ink-portrait-identity-v2-c01737bfdf.webp', '/previews/last-train-two-ink-portrait-identity-v2-c01737bfdf-thumb.webp', 'A thoughtful middle-aged Indian woman appears in a plum-and-saffron two-ink railway portrait.'),
    ('a-little-rain-a-lot-of-romance', '/previews/a-little-rain-a-lot-of-romance-identity-v2-3da22335be.webp', '/previews/a-little-rain-a-lot-of-romance-identity-v2-3da22335be-thumb.webp', 'A young Indian couple share a transparent umbrella and affectionate smiles on a rainy city street.'),
    ('somewhere-in-the-mediterranean', '/previews/somewhere-in-the-mediterranean-identity-v2-9ff83c9c48.webp', '/previews/somewhere-in-the-mediterranean-identity-v2-9ff83c9c48-thumb.webp', 'A cheerful young Indian woman in a rust dress stands on a sunlit Mediterranean street above the sea.'),
    ('old-school-charm-new-memories', '/previews/old-school-charm-new-memories-identity-v2-2fc532daae.webp', '/previews/old-school-charm-new-memories-identity-v2-2fc532daae-thumb.webp', 'An Indian couple in their fifties laugh together beside a vintage maroon car on a tree-lined avenue.'),
    ('the-desert-in-your-rear-view', '/previews/the-desert-in-your-rear-view-identity-v2-ae73ac7594.webp', '/previews/the-desert-in-your-rear-view-identity-v2-ae73ac7594-thumb.webp', 'A thoughtful Indian man in his thirties stands beside a dusty four-wheel-drive at sunset in the desert.'),
    ('a-modern-bridal-heirloom', '/previews/a-modern-bridal-heirloom-identity-v2-c26d8c5c40.webp', '/previews/a-modern-bridal-heirloom-identity-v2-c26d8c5c40-thumb.webp', 'A young South Indian bride wears an emerald Kanjeevaram saree, jasmine flowers and layered traditional gold jewellery.'),
    ('the-art-of-standing-still', '/previews/the-art-of-standing-still-identity-v2-e4dc1367ab.webp', '/previews/the-art-of-standing-still-identity-v2-e4dc1367ab-thumb.webp', 'A serious young Indian woman in a sculptural cobalt-blue suit holds an angular full-body pose beside a curved white wall.'),
    ('city-lights-main-character-energy', '/previews/city-lights-main-character-energy-identity-v2-bb1b8885af.webp', '/previews/city-lights-main-character-energy-identity-v2-bb1b8885af-thumb.webp', 'A thoughtful young Indian man stands still at a wet Mumbai crossing while commuters blur around him at dusk.')
)
update public.prompts as prompt
set preview_image_url = replacement.preview_image_url,
    thumbnail_url = replacement.thumbnail_url,
    image_alt = replacement.image_alt,
    preview_review_status = 'approved',
    updated_at = now()
from replacements as replacement
where prompt.slug = replacement.slug;

with replacements(slug, featured_image) as (
  values
    ('romantic', '/previews/a-little-rain-a-lot-of-romance-identity-v2-3da22335be.webp'),
    ('cinematic', '/previews/city-lights-main-character-energy-identity-v2-bb1b8885af.webp'),
    ('pre-wedding', '/previews/the-heritage-railway-letter-identity-v2-6abc645a5b.webp'),
    ('creative-transformations', '/previews/the-river-remembers-identity-v2-ce7d3f07d3.webp')
)
update public.collections as collection
set featured_image = replacement.featured_image
from replacements as replacement
where collection.slug = replacement.slug;

do $$
declare
  prompt_matches integer;
  collection_matches integer;
begin
  select count(*) into prompt_matches
  from public.prompts
  where preview_image_url like '/previews/%-identity-v2-%.webp'
    and slug in (
      'the-river-remembers', 'the-heritage-railway-letter',
      'a-mountain-journey-within', 'the-tailors-mountain-range',
      'one-day-four-possible-worlds', 'portrait-cut-from-monsoon-paper',
      'one-saree-three-campaign-worlds', 'last-train-two-ink-portrait',
      'a-little-rain-a-lot-of-romance', 'somewhere-in-the-mediterranean',
      'old-school-charm-new-memories', 'the-desert-in-your-rear-view',
      'a-modern-bridal-heirloom', 'the-art-of-standing-still',
      'city-lights-main-character-energy'
    );
  select count(*) into collection_matches
  from public.collections
  where slug in ('romantic', 'cinematic', 'pre-wedding', 'creative-transformations')
    and featured_image like '/previews/%-identity-v2-%.webp';
  if prompt_matches <> 15 or collection_matches <> 4 then
    raise exception 'Identity preview verification failed: % prompts, % collections', prompt_matches, collection_matches;
  end if;
end $$;

commit;
