<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  let role = $state('');
</script>

<div class="wrap">
  <h1>Welcome to cha</h1>
  <p class="muted">Two quick things and you're in.</p>

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

    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}

    <button class="btn submit" type="submit">Continue</button>
  </form>
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
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .role input {
    position: absolute;
    opacity: 0;
  }

  .submit {
    margin-top: 1.4rem;
    width: 100%;
  }
</style>
