-- Migration 2: shop websites + remove demo shops.
-- Run in the Supabase SQL editor.

alter table public.shops add column if not exists website text not null default '';

-- Remove the seeded demo shops (owner_id is null) and their jobs/applications.
delete from public.applications where job_id in (
  select j.id from public.jobs j join public.shops s on s.id = j.shop_id where s.owner_id is null
);
delete from public.jobs where shop_id in (select id from public.shops where owner_id is null);
delete from public.shops where owner_id is null;
