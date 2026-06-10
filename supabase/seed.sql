-- Demo candidates only (shops are real accounts now — see migration-2.sql).
-- Safe to re-run.

delete from public.seekers where profile_id::text like '00000000-%';
delete from public.profiles where id::text like '00000000-%';

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
