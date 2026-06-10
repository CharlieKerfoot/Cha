<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<section class="hero">
  <div class="pitch">
    <p class="meta-mono kicker">HIRING FOR SF COFFEE SHOPS</p>
    <h1>Hiring a barista shouldn't take <span class="highlight">a month of group texts</span>.</h1>
    <p class="sub">
      We talked to coffee shop owners around San Francisco and heard the same two things
      everywhere: hiring is hard, and there's no system for it. The owner is behind the counter
      pulling shots, and the next hire comes from a group chat or a friend of a friend.
    </p>
    <div class="ctas">
      <a class="btn" href="/login?role=owner">I run a coffee shop</a>
      <a class="btn secondary" href="/login?role=seeker">I'm looking for cafe work</a>
    </div>
  </div>
  <aside class="sign" aria-hidden="true">
    <p class="sign-head">Help wanted</p>
    <p class="meta-mono">BARISTA · WEEKDAY MORNINGS</p>
    <p class="meta-mono">TUE–SAT · 6A–2P · MISSION</p>
    <p class="sign-note">Ask for the owner. She's the one at the machine.</p>
  </aside>
</section>

<section class="why">
  <h2>What owners told us</h2>
  <p>
    These are small, owner-operated shops. The owner is also the barista, the bookkeeper, and
    the person unlocking the door before sunrise. When someone quits there's no recruiter and no
    software. Hiring runs on group chats and personal networks, and it eats weeks they don't have.
  </p>
  <p>
    And the bar for a good hire isn't a resume. Once someone can show up on time and pass the
    basics, what matters is whether the regulars will like them. Every owner said some version
    of the same thing: they hire on vibes and fit.
  </p>
</section>

<section class="how">
  <h2>So that's what we built</h2>
  <div class="cols">
    <div class="card">
      <p class="meta-mono kicker">FOR OWNERS</p>
      <h3>Your hiring pool, already assembled</h3>
      <p class="muted">
        Set up your shop in four fields and post a job in one form. You immediately see who
        applied and every candidate nearby who can work your shifts, each with a 30-second
        intro video. Status tracking is one dropdown: new, seen, interview, hired.
      </p>
    </div>
    <div class="card">
      <p class="meta-mono kicker">FOR BARISTAS</p>
      <h3>One video instead of a resume</h3>
      <p class="muted">
        Pick your neighborhood, how far you'll travel, and the shifts you can work. Record one
        30-second hello and it goes to every shop you apply to. Shops near you see you first,
        ranked by distance and shift fit.
      </p>
    </div>
  </div>
</section>

{#if data.shops.length > 0}
  <section class="shops">
    <h2>Shops hiring on cha</h2>
    <div class="grid">
      {#each data.shops as shop (shop.id)}
        <div class="card shop">
          <strong>{shop.name}</strong>
          <span class="badge">{shop.neighborhood}</span>
          <p class="muted">{shop.vibe}</p>
        </div>
      {/each}
    </div>
  </section>
{/if}

<style>
  .hero {
    display: flex;
    gap: 3rem;
    align-items: center;
    padding: 3.5rem 0 2rem;
  }

  .pitch {
    max-width: 640px;
  }

  .kicker {
    letter-spacing: 0.12em;
    margin: 0 0 0.8rem;
  }

  .hero h1 {
    font-size: clamp(2.6rem, 6vw, 4rem);
    line-height: 1.06;
  }

  .sub {
    font-size: 1.1rem;
    color: var(--muted);
    margin-top: 1rem;
  }

  .ctas {
    display: flex;
    gap: 0.8rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  /* The sign in the window. Decorative, hidden on small screens. */
  .sign {
    background: var(--surface);
    border: 1.5px solid var(--ink);
    border-radius: 6px;
    padding: 1.5rem 1.75rem;
    transform: rotate(2deg);
    flex-shrink: 0;
    max-width: 270px;
  }

  .sign-head {
    font-family: var(--font-display);
    font-variation-settings: 'SOFT' 60, 'WONK' 1;
    font-weight: 650;
    font-size: 2rem;
    line-height: 1;
    text-transform: uppercase;
    color: var(--red);
    margin: 0 0 0.8rem;
  }

  .sign p {
    margin: 0.3rem 0;
  }

  .sign-note {
    margin-top: 0.9rem;
    font-style: italic;
    color: var(--muted);
    font-size: 0.92rem;
  }

  @media (max-width: 760px) {
    .sign {
      display: none;
    }
  }

  .why {
    margin-top: 3.5rem;
    max-width: 640px;
  }

  .why p {
    margin: 0.8rem 0;
  }

  .cols {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .cols h3 {
    margin: 0.4rem 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.9rem;
    margin-top: 1rem;
  }

  .shops, .how {
    margin-top: 3.5rem;
  }

  .shop p {
    margin: 0.4rem 0 0;
  }

  .shop .badge {
    margin-left: 0.4rem;
  }
</style>
