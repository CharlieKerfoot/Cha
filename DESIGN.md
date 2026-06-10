# Design System — cha

## Product Context
- **What this is:** A two-sided hiring marketplace connecting small, owner-operated SF coffee shops with baristas nearby, built around 30-second intro videos and neighborhood/shift matching.
- **Who it's for:** Mom-and-pop cafe owners (busy, behind the counter, hire on vibes and fit) and job seekers looking for barista work close to home.
- **Space/industry:** Local hiring / marketplace; peers are job boards (Indeed, Greenhouse) and coffee-adjacent brands — we deliberately look like neither.
- **Project type:** Web app (editorial landing page + owner and seeker dashboards + onboarding flows).

## The Memorable Thing
**"This feels like your favorite neighborhood cafe."** Every design decision serves this — but warmth comes from paper, ink, and hand-made print artifacts, **never from brown**. No coffee imagery anywhere: no beans, cups, steam, latte art, or script logos.

## Aesthetic Direction
- **Direction:** The Neighborhood Noticeboard — cafe ephemera, digitized. The hand-printed HELP WANTED sign in the window, the flyer on the corkboard, the order-ticket rail.
- **Decoration level:** Intentional — hard 1.5px ink borders instead of drop shadows (flyers don't have shadows), marker-highlight swipes in riso pink behind key phrases, a rubber-stamp motif, dashed "perforation" edges on ticket-style cards.
- **Mood:** Warm, local, handmade, a little loud. First-3-seconds reaction: a grin, then "wait — a person made this."
- **Copy voice:** Like a neighbor's note: "we're two blocks from you", "saved your spot". Never corporate HR language.

## Typography
- **Display/Hero:** Fraunces (variable; `SOFT` ~60, `WONK` 1, weight 600–650) — reads as hand-lettered cafe signage without being a novelty font. Set big on the landing page; section headings in app.
- **Body:** Author (Fontshare) — warm humanist sans, 15–16px in dashboards, real italics, zero Inter-ness.
- **UI/Labels:** Author, weight 600 for buttons and labels.
- **Data/Tables/Metadata:** Fragment Mono — the receipt-printer voice. ALL metadata lives here, uppercase with `·` separators: `TUE–SAT · 6A–2P · MISSION · 0.4 MI · 92% FIT`. Supports tabular figures for distance/percentage columns.
- **Code:** Fragment Mono.
- **Loading:** Google Fonts for Fraunces + Fragment Mono (`fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@...&family=Fragment+Mono`); Fontshare CDN for Author (`api.fontshare.com/v2/css?f[]=author@400,500,600,700`). Self-host later if perf demands.
- **Scale:** body 16px (1rem) · small 14px · metadata mono 12.8px (0.8rem) · h3 24px · h2 32px · h1 app 40px · h1 landing clamp(3rem, 8vw, 5.5rem).

## Color
- **Approach:** Balanced — paper-and-ink neutrals with one loud accent and three supporting spot colors used semantically.
- **Paper (background):** `#FBFAF4` — bright paper white, barely warm, not beige.
- **Surface:** `#FFFFFF` cards with hard `1.5px solid #1C1B17` borders. No drop shadows, ever.
- **Ink (primary text):** `#1C1B17`
- **Muted text:** `#6E675C`
- **Soft line (dividers, perforations):** `#D9D4C8`
- **Accent — sign-paint red:** `#E8442E` (hover/dark: `#C9351F`) — the color of every HELP WANTED sign. Primary CTAs, the logomark, the HIRED stamp.
- **Semantic:** success/hired `#1E6B4F` (pool-hall green) · warning `#B97B0B` · error `#E8442E` · info/links `#2B49C3` (ballpoint blue — links are always underlined, like hand annotation).
- **Highlight:** riso pink `#FFB3C7` — marker-swipe behind key phrases (gradient underline technique), light mode only at full saturation.
- **Dark mode:** redesign surfaces, don't invert: paper `#191814`, surface `#221F1A`, ink `#F2EFE6`, muted `#A39C8D`, red `#F05A44`, green `#4DA383`, blue `#8FA1F0`, pink desaturated to `#D98CA0`, soft line `#3B372F`.
- **Forbidden:** anything brown (`--espresso`, `--roast`, `--latte`, terracotta are all retired), purple/violet gradients, gradient buttons.

## Logomark & Favicon
- **Concept:** A round rubber stamp — sign-red `#E8442E` circle, lowercase "cha" knocked out in paper-white Fraunces, rotated ~-6° with slightly uneven ink coverage. At 16px it reads as a red dot with a white "c".
- **Usage:** Header logomark (32px), favicon (SVG + 16/32px ICO fallback), and the stamp is the system's core verb — applied = stamped, hired = stamped.
- **Files:** `static/favicon.svg` (+ `static/favicon.ico`); reference from `src/app.html`.

## Signature Components
- **Receipt ticket (applicant card):** white surface, ink border, dashed perforation along the top edge, candidate name in Author 700, Fragment Mono metadata line, video thumbnail styled as a photobooth strip (vertical/horizontal frames, not a 16:9 player chrome).
- **HIRED stamp:** Fragment Mono uppercase, 2px sign-red border, rotated 4°, faint red ink-wash fill. Appears when status changes to hired.
- **Status labels:** Fragment Mono uppercase chips with 1.5px semantic-color borders (NEW/SEEN blue, INTERVIEW warning, HIRED green, PASSED muted).

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** Hybrid — creative-editorial landing (big wonky Fraunces, highlight swipes, asymmetry allowed); grid-disciplined dashboards (owners are busy — no editorial tricks where they work).
- **Grid:** single column < 760px; 2-col ticket rail and content grids above.
- **Max content width:** 1080px.
- **Border radius:** 6px standard (cards, buttons, inputs) · 4px small chips · 50%/999px only for the stamp logomark and pill toggles. Never uniform bubbly radius on everything.

## Motion
- **Approach:** Intentional — one expressive moment, everything else functional.
- **The moment:** the rubber stamp slamming in on hire — scale-down + 4° rotation settle, ~250ms ease-out.
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50–100ms) short(150–250ms) medium(250–400ms); nothing longer except the stamp.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-10 | Initial design system created | /design-consultation: user chose "feels like your favorite cafe" as the memorable thing; system delivers warmth via print ephemera (Neighborhood Noticeboard) instead of the cream/terracotta cliché. Synthesized with an independent Claude design subagent ("The Window Sign"). |
| 2026-06-10 | Zero coffee imagery, zero brown | Differentiation: every coffee-adjacent product does beans-and-beige; warmth carried by paper/ink/type instead. |
| 2026-06-10 | Fraunces over Gooper for display | Subagent proposed Gooper (paid); Fraunces is free, variable, and its WONK axis gives the same hand-lettered-sign quality. |
