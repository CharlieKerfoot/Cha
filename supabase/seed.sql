-- Demo data: 10 SF coffee shops with open roles + 6 candidate profiles.
-- Run after schema.sql. Safe to re-run (it deletes seeded rows first).

delete from public.applications where seeker_id in (select id from public.profiles where display_name like 'Demo %' or id::text like '00000000-%');
delete from public.jobs where shop_id in (select id from public.shops where owner_id is null);
delete from public.shops where owner_id is null;
delete from public.seekers where profile_id::text like '00000000-%';
delete from public.profiles where id::text like '00000000-%';

-- Seeded candidates (no auth user behind them; ids are reserved demo uuids)
insert into public.profiles (id, role, display_name) values
  ('00000000-0000-0000-0000-000000000001', 'seeker', 'Maya Torres'),
  ('00000000-0000-0000-0000-000000000002', 'seeker', 'Jordan Lee'),
  ('00000000-0000-0000-0000-000000000003', 'seeker', 'Sam Okafor'),
  ('00000000-0000-0000-0000-000000000004', 'seeker', 'Riley Chen'),
  ('00000000-0000-0000-0000-000000000005', 'seeker', 'Alex Nguyen'),
  ('00000000-0000-0000-0000-000000000006', 'seeker', 'Dani Flores');

insert into public.seekers (profile_id, neighborhood, lat, lng, radius_miles, shifts, bio, basics_confirmed) values
  ('00000000-0000-0000-0000-000000000001', 'Mission', 37.7599, -122.4148, 3, '{mon-open,tue-open,wed-open,thu-open,fri-open}', 'Two years pulling shots at a busy cafe in Portland. Latte art is my love language.', true),
  ('00000000-0000-0000-0000-000000000002', 'Hayes Valley', 37.7759, -122.4245, 2, '{sat-open,sat-mid,sun-open,sun-mid}', 'Weekend warrior. SFSU student, reliable, fast learner.', true),
  ('00000000-0000-0000-0000-000000000003', 'Richmond', 37.7775, -122.4744, 5, '{mon-mid,tue-mid,wed-mid,thu-mid,fri-mid}', 'Former line cook switching to coffee. I keep calm when the line is out the door.', true),
  ('00000000-0000-0000-0000-000000000004', 'Castro', 37.7609, -122.4350, 2, '{mon-close,tue-close,wed-close,thu-close,fri-close}', 'Evenings only — I write in the mornings. Great with regulars.', true),
  ('00000000-0000-0000-0000-000000000005', 'SoMa', 37.7785, -122.4056, 4, '{mon-open,wed-open,fri-open,sat-open,sun-open}', 'Early riser, ex-barista at a third-wave spot in Oakland. V60 nerd.', true),
  ('00000000-0000-0000-0000-000000000006', 'Bernal Heights', 37.7411, -122.4156, 3, '{tue-mid,thu-mid,sat-open,sat-mid,sun-open,sun-mid}', 'Friendly face, three years retail. Want to learn coffee for real.', true);

-- Seeded shops (owner_id null = demo shop, claimable later)
with s as (
  insert into public.shops (name, neighborhood, address, lat, lng, vibe) values
    ('Sightglass on 20th', 'Mission', '3014 20th St', 37.7585, -122.4118, 'Industrial-airy roastery, serious about single origin, friendly crew.'),
    ('Ritual Roasters', 'Mission', '1026 Valencia St', 37.7564, -122.4214, 'OG third-wave spot. Busy mornings, chatty regulars.'),
    ('Blue Danube Coffee', 'Richmond', '306 Clement St', 37.7830, -122.4625, 'Neighborhood living room. Students, laptops, zero pretension.'),
    ('Castro Coffee Company', 'Castro', '427 Castro St', 37.7619, -122.4348, 'Tiny, beloved, every customer is a regular.'),
    ('Arsicault Bakery', 'Richmond', '397 Arguello Blvd', 37.7833, -122.4587, 'Croissant line around the block. Fast-paced espresso bar.'),
    ('Mazarine Coffee', 'SoMa', '720 Market St', 37.7873, -122.4040, 'Downtown commuter rush, efficient and warm.'),
    ('Flywheel Coffee', 'Haight-Ashbury', '672 Stanyan St', 37.7682, -122.4532, 'Across from Golden Gate Park. Surfers, runners, dogs.'),
    ('Linea Caffe', 'Mission', '3417 18th St', 37.7621, -122.4203, 'Tiny counter, world-class espresso, waffles.'),
    ('Pinhole Coffee', 'Bernal Heights', '231 Cortland Ave', 37.7392, -122.4166, 'Sunny corner shop, community bulletin board energy.'),
    ('Hollow', 'Inner Sunset', '1435 Irving St', 37.7637, -122.4719, 'Coffee + tiny gift shop. Quiet, curated, calm.')
  returning id, name
)
insert into public.jobs (shop_id, title, pay_min, pay_max, shifts, description)
select id, 'Barista',
  case when name in ('Sightglass on 20th', 'Linea Caffe') then 22 else 19 end,
  case when name in ('Sightglass on 20th', 'Linea Caffe') then 26 else 24 end,
  case
    when name = 'Castro Coffee Company' then '{mon-close,tue-close,wed-close,thu-close,fri-close}'::text[]
    when name = 'Blue Danube Coffee' then '{mon-mid,tue-mid,wed-mid,thu-mid,fri-mid}'::text[]
    when name = 'Pinhole Coffee' then '{sat-open,sat-mid,sun-open,sun-mid}'::text[]
    else '{mon-open,tue-open,wed-open,thu-open,fri-open,sat-open}'::text[]
  end,
  'Looking for someone reliable and warm. Coffee experience is a plus, good vibes are required. Tips on top of hourly.'
from s;
