-- Migration 4: claim-your-shop directory (sourced from OpenStreetMap).
-- Run in the Supabase SQL editor, then run directory-seed.sql.

create table if not exists public.shop_directory (
  id uuid primary key default gen_random_uuid(),
  osm_id text not null unique,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  address text not null default '',
  website text not null default '',
  phone text not null default ''
);

alter table public.shop_directory enable row level security;

drop policy if exists "directory readable" on public.shop_directory;
create policy "directory readable" on public.shop_directory
  for select to authenticated using (true);

-- A directory entry can be claimed by at most one shop
alter table public.shops add column if not exists directory_id uuid references public.shop_directory(id);
create unique index if not exists shops_directory_id_unique
  on public.shops (directory_id) where directory_id is not null;

-- Verification flag: a claim is step one; phone verification (later) flips this.
alter table public.shops add column if not exists verified boolean not null default false;
