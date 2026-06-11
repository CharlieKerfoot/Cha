-- Migration 3: optional seeker experience + shop contact for interview handoff.
-- Run in the Supabase SQL editor (or `supabase db push`).

-- Seekers can optionally add past experience. Owners said they like experience
-- when it's there, but it is never required.
alter table public.seekers add column if not exists years_experience numeric;
alter table public.seekers add column if not exists experience text not null default '';

-- Shops give one way to reach them. Revealed to a candidate only once the owner
-- moves that application to "interview", so it never becomes a public scrape target.
alter table public.shops add column if not exists contact text not null default '';
