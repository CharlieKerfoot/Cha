<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Local state only drives the radio picker shown when no role was preselected.
  let role = $state('');
</script>

<div class="wrap">
  {#if data.role === 'owner'}
    <h1>Welcome to cha</h1>
    <p class="muted">One quick thing, then you set up your shop.</p>
  {:else if data.role === 'seeker'}
    <h1>Welcome to cha</h1>
    <p class="muted">One quick thing, then you build your profile.</p>
  {:else}
    <h1>Welcome to cha</h1>
    <p class="muted">Two quick things and you're in.</p>
  {/if}

  <form method="POST" use:enhance>
    <label for="display_name">Your name</label>
    <input
      id="display_name"
      type="text"
      name="display_name"
      required
      value={form?.displayName ?? ''}
      placeholder="First and last name"
    />

    {#if data.role}
      <input type="hidden" name="role" value={data.role} />
    {:else}
      <label for="role-group">I'm here to…</label>
      <div id="role-group" class="roles">
        <label class="role" class:active={role === 'seeker'}>
          <input type="radio" name="role" value="seeker" bind:group={role} />
          <strong>Find a coffee job</strong>
          <span class="muted">Barista, counter, whatever fits</span>
        </label>
        <label class="role" class:active={role === 'owner'}>
          <input type="radio" name="role" value="owner" bind:group={role} />
          <strong>Hire for my shop</strong>
          <span class="muted">I run a coffee shop</span>
        </label>
      </div>
    {/if}

    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}

    <button class="btn submit" type="submit">Continue</button>
  </form>

  {#if data.role === 'owner'}
    <p class="muted switch">Looking for work instead? <a href="/onboarding?role=seeker">Switch</a></p>
  {:else if data.role === 'seeker'}
    <p class="muted switch">Hiring for a shop instead? <a href="/onboarding?role=owner">Switch</a></p>
  {/if}
</div>

<style>
  .wrap {
    max-width: 480px;
    margin: 2rem auto 0;
  }

  .roles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.7rem;
    margin-top: 0.2rem;
  }

  .role {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    border: 1.5px solid var(--line);
    border-radius: 10px;
    background: var(--paper);
    padding: 0.9rem;
    cursor: pointer;
    font-weight: 400;
    margin: 0;
  }

  .role.active {
    border-color: var(--red);
    box-shadow: 0 0 0 1px var(--red);
  }

  .role input {
    position: absolute;
    opacity: 0;
  }

  .submit {
    margin-top: 1.4rem;
    width: 100%;
  }

  .switch {
    margin-top: 0.9rem;
    text-align: center;
    font-size: 0.85rem;
  }
</style>
