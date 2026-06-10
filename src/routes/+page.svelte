<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<section class="hero">
  <h1>Coffee jobs, matched on what actually matters.</h1>
  <p class="sub">
    SF's local coffee shops hire on vibes and fit, not resumes. Set where you'll work and when,
    record a 30-second hello, and get matched with shops in your neighborhood.
  </p>
  <div class="ctas">
    <a class="btn" href="/login?role=seeker">I want to work at a coffee shop</a>
    <a class="btn secondary" href="/login?role=owner">I run a coffee shop</a>
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

<section class="how">
  <h2>How it works</h2>
  <div class="grid three">
    <div class="card">
      <h3>1. Say where &amp; when</h3>
      <p class="muted">Pick your neighborhood, a radius you'd travel, and the shifts you can work.</p>
    </div>
    <div class="card">
      <h3>2. Record a 30s hello</h3>
      <p class="muted">
        One quick video instead of a resume. It goes to every shop you apply to — owners hire on
        vibes, so show yours.
      </p>
    </div>
    <div class="card">
      <h3>3. Get matched</h3>
      <p class="muted">We rank shops by distance and shift fit. Apply in one tap.</p>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 3rem 0 2rem;
    max-width: 640px;
  }

  .hero h1 {
    font-size: 2.4rem;
    line-height: 1.15;
  }

  .sub {
    font-size: 1.1rem;
    color: var(--roast);
  }

  .ctas {
    display: flex;
    gap: 0.8rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.9rem;
    margin-top: 1rem;
  }

  .grid.three {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .shops, .how {
    margin-top: 3rem;
  }

  .shop p {
    margin: 0.4rem 0 0;
  }

  .shop .badge {
    margin-left: 0.4rem;
  }
</style>
