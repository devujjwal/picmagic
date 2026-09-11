-- Nullable additions preserve existing rows during the coordinated release.
alter table public.prompts add column if not exists transformation_type text;
alter table public.prompts add column if not exists display_hint text check (display_hint in ('standard','wide'));
alter table public.prompts add column if not exists reference_contract jsonb check (reference_contract is null or jsonb_typeof(reference_contract)='object');
