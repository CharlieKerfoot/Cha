<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();

  const seekerTabs = [
    ['/seeker', 'Matches'],
    ['/seeker/applications', 'Applied'],
    ['/seeker/profile', 'Profile']
  ] as const;

  const ownerTabs = [
    ['/owner', 'Dashboard'],
    ['/owner/jobs/new', 'Post a job']
  ] as const;

  let tabs = $derived(
    data.profile?.role === 'seeker' ? seekerTabs : data.profile?.role === 'owner' ? ownerTabs : []
  );

  function isActive(href: string): boolean {
    return page.url.pathname === href;
  }
</script>

<svelte:head>
  <title>cha · hiring for SF coffee shops</title>
</svelte:head>

<header>
  <nav>
    <a class="logo" href="/" aria-label="cha home">
      <span class="stamp-mark">cha</span>
    </a>

    {#if tabs.length > 0}
      <div class="tabs" role="navigation" aria-label="Main">
        {#each tabs as [href, label] (href)}
          <a {href} class="tab" class:active={isActive(href)} aria-current={isActive(href) ? 'page' : undefined}>
            {label}
          </a>
        {/each}
      </div>
    {/if}

    <div class="session">
      {#if data.session}
        <form method="POST" action="/logout">
          <button class="linkish" type="submit">Sign out</button>
        </form>
      {:else}
        <a class="tab" href="/login">Sign in</a>
      {/if}
    </div>
  </nav>
</header>

<main>
  {@render children()}
</main>

<style>
  header {
    background: var(--surface);
    border-bottom: 1.5px solid var(--ink);
  }

  nav {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0.7rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .logo {
    text-decoration: none;
    line-height: 0;
  }

  .stamp-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--red);
    color: #fff;
    font-family: var(--font-display);
    font-variation-settings: 'SOFT' 60, 'WONK' 1;
    font-weight: 650;
    font-size: 1rem;
    transform: rotate(-6deg);
    line-height: 1;
  }

  .tabs {
    display: flex;
    gap: 0.4rem;
    flex: 1;
  }

  .tab {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
    text-decoration: none;
    padding: 0.35rem 0.7rem;
    border: 1.5px solid transparent;
    border-radius: 4px;
  }

  .tab:hover {
    color: var(--ink);
    border-color: var(--line);
  }

  .tab.active {
    color: var(--ink);
    border-color: var(--ink);
    background: var(--paper);
  }

  .session {
    margin-left: auto;
  }

  .linkish {
    background: none;
    border: none;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
    cursor: pointer;
    padding: 0.35rem 0;
  }

  .linkish:hover {
    color: var(--ink);
  }

  @media (max-width: 560px) {
    nav {
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .tabs {
      order: 3;
      width: 100%;
    }
  }
</style>
