-- cha schema. Run this in the Supabase SQL editor (or `supabase db push`).

create table public.profiles (
  id uuid primary key,
  role text not null check (role in ('seeker', 'owner')),
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create table public.seekers (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  neighborhood text not null,
  lat double precision not null,
  lng double precision not null,
  radius_miles numeric not null default 3,
  shifts text[] not null default '{}',
  bio text not null default '',
  video_url text,
  basics_confirmed boolean not null default false
);

create table public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  neighborhood text not null,
  address text not null default '',
  lat double precision not null,
  lng double precision not null,
  vibe text not null default '',
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  title text not null default 'Barista',
  pay_min numeric,
  pay_max numeric,
  shifts text[] not null default '{}',
  description text not null default '',
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  seeker_id uuid not null references public.seekers(profile_id) on delete cascade,
  status text not null default 'new' check (status in ('new', 'seen', 'interview', 'hired', 'passed')),
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (job_id, seeker_id)
);

-- Row level security
alter table public.profiles enable row level security;
alter table public.seekers enable row level security;
alter table public.shops enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- profiles: anyone signed in can read; you can only write your own row
create policy "profiles readable" on public.profiles
  for select to authenticated using (true);
create policy "profiles insert own" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "profiles update own" on public.profiles
  for update to authenticated using (id = auth.uid());

-- seekers: readable when signed in (owners browse the pool); write your own
create policy "seekers readable" on public.seekers
  for select to authenticated using (true);
create policy "seekers insert own" on public.seekers
  for insert to authenticated with check (profile_id = auth.uid());
create policy "seekers update own" on public.seekers
  for update to authenticated using (profile_id = auth.uid());

-- shops + jobs: public read (landing page), owners write their own
create policy "shops readable" on public.shops
  for select using (true);
create policy "shops insert own" on public.shops
  for insert to authenticated with check (owner_id = auth.uid());
create policy "shops update own" on public.shops
  for update to authenticated using (owner_id = auth.uid());

create policy "jobs readable" on public.jobs
  for select using (true);
create policy "jobs insert own shop" on public.jobs
  for insert to authenticated with check (
    exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid())
  );
create policy "jobs update own shop" on public.jobs
  for update to authenticated using (
    exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid())
  );

-- applications: seeker creates/sees their own; the shop owner sees and updates
create policy "applications insert own" on public.applications
  for insert to authenticated with check (seeker_id = auth.uid());
create policy "applications readable by parties" on public.applications
  for select to authenticated using (
    seeker_id = auth.uid()
    or exists (
      select 1 from public.jobs j join public.shops s on s.id = j.shop_id
      where j.id = job_id and s.owner_id = auth.uid()
    )
  );
create policy "applications updatable by owner" on public.applications
  for update to authenticated using (
    exists (
      select 1 from public.jobs j join public.shops s on s.id = j.shop_id
      where j.id = job_id and s.owner_id = auth.uid()
    )
  );

-- Storage bucket for intro videos (public read, signed-in upload to own folder)
insert into storage.buckets (id, name, public) values ('videos', 'videos', true);

create policy "videos public read" on storage.objects
  for select using (bucket_id = 'videos');
create policy "videos upload own folder" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "videos update own folder" on storage.objects
  for update to authenticated using (
    bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text
  );
