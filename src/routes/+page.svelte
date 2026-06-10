<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let hoodCount = $derived(new Set(data.shops.map((s) => s.neighborhood)).size);
</script>

<section class="hero">
  <div class="pitch">
    <p class="meta-mono kicker">HIRING FOR SF COFFEE SHOPS</p>
    <h1>Hiring a barista shouldn't take a month of group texts.</h1>
    <p class="sub">
      We talked to coffee shop owners around San Francisco and heard the same thing everywhere:
      hiring is hard and there's no system for it, just group chats and friends of friends.
      cha is the system.
    </p>
    <div class="ctas">
      <a class="btn" href="/login?role=owner">I run a coffee shop</a>
      <a class="btn secondary" href="/login?role=seeker">I'm looking for cafe work</a>
    </div>
    {#if data.shops.length > 0}
      <p class="meta-mono proof">
        {data.shops.length} SHOPS HIRING · {hoodCount} NEIGHBORHOODS · NO RESUMES
      </p>
    {/if}
  </div>

  <!-- The shop window: the product, told in its own ephemera. -->
  <aside class="window" aria-hidden="true">
    <div class="item sign">
      <span class="tape"></span>
      <p class="sign-head">Help wanted</p>
      <p class="meta-mono">BARISTA · WEEKDAY MORNINGS</p>
      <p class="meta-mono">TUE–SAT · 6A–2P · MISSION</p>
      <p class="sign-note">Ask for the owner. She's the one at the machine.</p>
    </div>

    <div class="item booth">
      <span class="tape"></span>
      <div class="frame play">▶</div>
      <div class="frame"></div>
      <div class="frame"></div>
      <p class="meta-mono booth-label">30-SECOND HELLO</p>
    </div>

    <div class="item ticket">
      <span class="tape"></span>
      <p class="ticket-name">Maya R.</p>
      <p class="meta-mono">MISSION · 0.4 MI · 92% FIT</p>
      <p class="meta-mono">CAN WORK · TUE–SAT · 6A–2P</p>
      <span class="stamp">Hired</span>
    </div>
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

<section class="closer">
  <h2>Put the sign up</h2>
  <p class="muted">Posting takes one form. The candidates are already here.</p>
  <div class="ctas">
    <a class="btn" href="/login?role=owner">Post a job</a>
    <a class="btn secondary" href="/login?role=seeker">Find cafe work</a>
  </div>
</section>

<style>
  .hero {
    display: flex;
    gap: 3rem;
    align-items: center;
    padding: 2.5rem 0 2rem;
  }

  .pitch {
    max-width: 600px;
  }

  .kicker {
    letter-spacing: 0.12em;
    margin: 0 0 0.8rem;
  }

  .hero h1 {
    font-size: clamp(2.5rem, 5.5vw, 3.7rem);
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

  .proof {
    margin-top: 1.4rem;
    letter-spacing: 0.08em;
  }

  /* ---- The shop window cluster ---- */

  .window {
    position: relative;
    flex-shrink: 0;
    width: 380px;
    height: 460px;
  }

  .item {
    position: absolute;
    background: var(--surface);
    border: 1.5px solid var(--ink);
    border-radius: 6px;
  }

  /* Riso-pink washi tape holding each piece up */
  .tape {
    position: absolute;
    top: -10px;
    left: 50%;
    width: 56px;
    height: 18px;
    margin-left: -28px;
    background: var(--pink);
    opacity: 0.85;
    transform: rotate(-3deg);
  }

  .sign {
    top: 0;
    left: 0;
    width: 250px;
    padding: 1.25rem 1.5rem;
    transform: rotate(-2deg);
    z-index: 2;
  }

  .sign-head {
    font-family: var(--font-display);
    font-variation-settings: 'SOFT' 60, 'WONK' 1;
    font-weight: 650;
    font-size: 1.8rem;
    line-height: 1;
    text-transform: uppercase;
    color: var(--red);
    margin: 0 0 0.7rem;
  }

  .sign p {
    margin: 0.3rem 0;
  }

  .sign-note {
    margin-top: 0.8rem;
    font-style: italic;
    color: var(--muted);
    font-size: 0.88rem;
  }

  .booth {
    top: 30px;
    right: 0;
    width: 96px;
    padding: 0.6rem 0.6rem 0.5rem;
    transform: rotate(3deg);
    z-index: 1;
  }

  .frame {
    height: 64px;
    background: var(--ink);
    border-radius: 3px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--paper);
    font-size: 1rem;
  }

  .booth-label {
    font-size: 0.58rem;
    text-align: center;
    margin: 0.3rem 0 0;
  }

  .ticket {
    bottom: 0;
    left: 56px;
    width: 270px;
    padding: 1.1rem 1.3rem;
    border-top-style: dashed;
    transform: rotate(1.5deg);
    z-index: 3;
  }

  .ticket-name {
    font-weight: 700;
    font-size: 1.15rem;
    margin: 0 0 0.4rem;
  }

  .ticket p {
    margin: 0.25rem 0;
  }

  .ticket .stamp {
    position: absolute;
    top: 0.8rem;
    right: 1rem;
  }

  @media (max-width: 880px) {
    .window {
      display: none;
    }
  }

  /* ---- Below the fold ---- */

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

  .closer {
    margin-top: 4rem;
    border-top: 1.5px dashed var(--line);
    padding-top: 2.5rem;
    text-align: center;
  }

  .closer .ctas {
    justify-content: center;
  }
</style>
