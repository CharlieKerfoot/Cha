# Design System: cha

## Product Context
- **What this is:** A two-sided hiring marketplace connecting small, owner-operated SF coffee shops with baristas, built around 30-second intro videos and neighborhood/shift matching.
- **Who it's for:** Mom-and-pop cafe owners (busy, behind the counter, hiring on vibes and fit) and people looking for barista work close to home.
- **Space/industry:** Local hiring marketplaces. Peers are job boards (Indeed, Greenhouse) and coffee-adjacent brands. We deliberately look like neither.
- **Project type:** Web app (editorial landing page, owner and seeker dashboards, onboarding flows).

## The Memorable Thing
**"This feels like your favorite neighborhood cafe."** Every design decision serves this. Warmth comes from paper, ink, and hand-made print artifacts, never from brown. No coffee imagery anywhere: no beans, cups, steam, latte art, or script logos.

## The Problem (anchor for all copy)
We talked to coffee shop owners around San Francisco. Two things came up over and over: hiring is hard, and marketing is hard. These are small shops where the owner is also the barista. There is no hiring software, just group chats and personal networks. Once a candidate passes the basics, owners hire on vibes and fit. All product copy should trace back to this. Lead with the problem, not the feature.

## Copy Voice
- Write like a neighbor's note, not a SaaS landing page. "We're two blocks from you." "Saved your spot."
- Lead with the real problem owners described. Plain statements beat slogans.
- No em dashes. Use a period, a comma, or a colon instead.
- No AI marketing patterns: no "Built for X", no "Designed to Y", no rhetorical question headers, no "seamless", "effortless", "supercharge", or "delightful".
- Numbers and logistics go in mono metadata style, not prose: `TUE–SAT · 6A–2P · MISSION · 0.4 MI`.
- Short sentences. Concrete nouns. If a line could appear on any startup's site, rewrite it.

## Aesthetic Direction
- **Direction:** The Neighborhood Noticeboard. Cafe ephemera, digitized: the hand-printed HELP WANTED sign in the window, the flyer on the corkboard, the order-ticket rail.
- **Decoration level:** Intentional. Hard 1.5px ink borders instead of drop shadows (flyers don't have shadows), marker-highlight swipes in riso pink behind key phrases, a rubber-stamp motif, dashed perforation edges on ticket-style cards.
- **Mood:** Warm, local, handmade, a little loud. First-3-seconds reaction: a grin, then "wait, a person made this."

## Typography
- **Display/Hero:** Fraunces (variable; `font-variation-settings: 'SOFT' 60, 'WONK' 1`, weight 600 to 650). Reads as hand-lettered cafe signage without being a novelty font. Big on the landing page, section headings in the app.
- **Body:** Author (Fontshare). Warm humanist sans, 15 to 16px in dashboards, real italics.
- **UI/Labels:** Author, weight 600 for buttons and labels.
- **Data/Tables/Metadata:** Fragment Mono, the receipt-printer voice. All metadata lives here, uppercase with `·` separators: `TUE–SAT · 6A–2P · MISSION · 0.4 MI`. Tabular numerals for distance and percentage columns.
- **Loading:** Google Fonts for Fraunces and Fragment Mono; Fontshare CDN for Author. Self-host later if performance demands it.
- **CSS variables:** `--font-display`, `--font-body`, `--font-mono` (defined in `src/app.css`).
- **Scale:** body 16px (1rem) · small 14px · metadata mono 12.8px (0.8rem) · h3 24px · h2 32px · h1 app 40px · h1 landing clamp(2.6rem, 6vw, 4rem).

## Color
- **Approach:** Balanced. Paper-and-ink neutrals with one loud accent and three supporting spot colors used semantically.
- **Tokens (light):** paper `#FBFAF4` (background) · surface `#FFFFFF` · ink `#1C1B17` (text, card borders) · muted `#6E675C` · line `#D9D4C8` (soft dividers, perforations) · red `#E8442E` (accent; hover `#C9351F`) · green `#1E6B4F` (hired/success) · blue `#2B49C3` (links, always underlined) · pink `#FFB3C7` (highlight swipes) · warning `#B97B0B`.
- **Sign-paint red** is the color of every HELP WANTED sign. It carries primary CTAs, the logomark, and the HIRED stamp.
- **Cards:** white surface with hard `1.5px solid var(--ink)` borders. No drop shadows, ever.
- **Dark mode:** redesign surfaces, don't invert. paper `#191814`, surface `#221F1A`, ink `#F2EFE6`, muted `#A39C8D`, line `#3B372F`, red `#F05A44`, green `#4DA383`, blue `#8FA1F0`, pink `#D98CA0`. Implemented via `prefers-color-scheme` in `src/app.css`.
- **Forbidden:** anything brown (espresso, roast, latte, terracotta are retired), purple or violet gradients, gradient buttons.

## Logomark & Favicon
- **Concept:** A round rubber stamp. Sign-red circle, "cha" knocked out in paper-white Fraunces, rotated about -6 degrees with slightly uneven ink coverage. At 16px it reads as a red dot with a white "c".
- **Files:** `static/favicon.svg` (the "c" is drawn as an arc path so no font is needed at favicon size); header logomark rendered in `src/routes/+layout.svelte` as a styled span.
- **The stamp is the system's core verb:** applied = stamped, hired = stamped.

## Signature Components (classes in `src/app.css`)
- **`.ticket`** (applicant card): white surface, ink border, dashed perforation along the top edge, name in Author 700, `.meta-mono` metadata line.
- **`.stamp`** (HIRED): Fragment Mono uppercase, 2px sign-red border, rotated 4 degrees, faint red ink-wash fill. Appears when status is hired.
- **`.chip`** (status): Fragment Mono uppercase with 1.5px semantic borders. new/seen blue, interview warning, hired green, passed muted.
- **`.meta-mono`**: the metadata voice. Uppercase mono, dot-separated, tabular numerals.
- **`.highlight`**: riso-pink marker swipe behind a key phrase (gradient underline technique).
- **`.badge`**, **`.score-pill`**: mono chips for neighborhood and fit score.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** Hybrid. Creative-editorial landing (big wonky Fraunces, highlight swipes, the rotated window-sign card); grid-disciplined dashboards (owners are busy, no editorial tricks where they work).
- **Grid:** single column under 760px; two-column content grids above.
- **Max content width:** 1080px.
- **Border radius:** 6px standard (cards, buttons, inputs) · 4px small chips · 50% only for the stamp logomark. Never uniform bubbly radius on everything.

## Motion
- **Approach:** Intentional. One expressive moment, everything else functional.
- **The moment:** the rubber stamp landing on hire. Scale-down with a 4 degree rotation settle, about 250ms ease-out.
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50 to 100ms) short(150 to 250ms) medium(250 to 400ms). Nothing longer except the stamp.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-10 | Initial design system created | /design-consultation: the memorable thing is "feels like your favorite cafe"; warmth delivered via print ephemera (Neighborhood Noticeboard) instead of the cream/terracotta cliche. Synthesized with an independent design subagent proposal ("The Window Sign"). |
| 2026-06-10 | Zero coffee imagery, zero brown | Every coffee-adjacent product does beans and beige. Warmth carried by paper, ink, and type instead. |
| 2026-06-10 | Fraunces over Gooper for display | Gooper is paid; Fraunces is free and variable, and its WONK axis gives the same hand-lettered-sign quality. |
| 2026-06-10 | Copy voice codified, problem-first | User direction: no em dashes, no AI marketing patterns, all messaging anchored in what real SF owners said (hiring is hard, no system, vibes and fit). |
