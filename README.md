# cha ☕

A hiring marketplace for local San Francisco coffee shops — connecting small, owner-operated cafes with baristas looking for work nearby.

## The problem

We talked to local coffee shop owners around San Francisco, and two things came up over and over: **hiring is hard, and marketing is hard.**

These are small mom-and-pop shops. The owners aren't just managing — they're behind the counter pulling shots. Hiring eats up a huge amount of their time, and they have no system for it: no software, just group chats and personal networks. And they hire differently from traditional jobs — once a candidate passes the basics, what matters is **vibes and fit**.

## The product

- **Job seekers** set a neighborhood, a travel radius, and the shifts they can work, then record a **30-second intro video** — one recording goes to every shop they apply to. They see shops ranked by distance + shift fit.
- **Owners** onboard in four fields, post a job in one form, and immediately see applicants *and* the full pool of nearby candidates with their videos. Status tracking is one dropdown: new → seen → interview → hired/passed.

## Stack

SvelteKit (Svelte 5) · Supabase (Postgres, magic-link auth, video storage) · Vercel

## Setup

1. **Create a Supabase project** at [database.new](https://database.new).
2. In the Supabase **SQL editor**, run `supabase/schema.sql`, then `supabase/seed.sql` (demo shops + candidates).
3. Copy `.env.example` to `.env` and fill in your project URL and anon key (Supabase dashboard → Settings → API).
4. ```sh
   npm install
   npm run dev
   ```

### Auth setup (Supabase dashboard)

Auth is email + password, no email round-trips.

1. **URL Configuration** (Authentication → URL Configuration): set the Site URL to your production URL, and add `http://localhost:5173/**` plus `https://YOUR-DOMAIN/**` to Redirect URLs.
2. **Disable email confirmation** (Authentication → Sign In / Providers → Email): turn off "Confirm email" so new accounts get a session immediately on sign-up.

## Deploy (Vercel)

```sh
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

## Project layout

- `supabase/schema.sql` — tables, row-level security, storage bucket + policies
- `supabase/seed.sql` — 10 SF shops with open roles, 6 demo candidates
- `src/lib/matching.ts` — the match score (50% proximity, 50% shift overlap)
- `src/lib/components/VideoRecorder.svelte` — in-browser 30s recording via MediaRecorder
- `src/routes/seeker/*` — candidate flow · `src/routes/owner/*` — shop flow

## Scope notes

- **Initial market:** San Francisco local coffee shops.
- **Initial focus:** hiring. (Owners also flagged marketing as a major pain — a potential follow-on.)
- **Platform:** web first, mobile-friendly; native app later.
