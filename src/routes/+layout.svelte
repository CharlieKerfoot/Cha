<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>cha — coffee jobs, good vibes</title>
</svelte:head>

<header>
  <nav>
    <a class="logo" href="/">cha ☕</a>
    <div class="links">
      {#if data.profile?.role === 'seeker'}
        <a href="/seeker">Matches</a>
        <a href="/seeker/profile">My profile</a>
      {:else if data.profile?.role === 'owner'}
        <a href="/owner">Dashboard</a>
      {/if}
      {#if data.session}
        <form method="POST" action="/logout">
          <button class="linkish" type="submit">Sign out</button>
        </form>
      {:else}
        <a href="/login">Sign in</a>
      {/if}
    </div>
  </nav>
</header>

<main>
  {@render children()}
</main>

<style>
  header {
    background: var(--paper);
    border-bottom: 1px solid var(--line);
  }

  nav {
    max-width: 920px;
    margin: 0 auto;
    padding: 0.8rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-family: Georgia, serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--espresso);
    text-decoration: none;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 1.1rem;
  }

  .links a {
    color: var(--roast);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .links a:hover {
    color: var(--accent);
  }

  .linkish {
    background: none;
    border: none;
    color: var(--roast);
    font: inherit;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    padding: 0;
  }

  .linkish:hover {
    color: var(--accent);
  }
</style>
