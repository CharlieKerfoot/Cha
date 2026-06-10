<script lang="ts">
  import { enhance } from '$app/forms';
  import { NEIGHBORHOOD_NAMES } from '$lib/geo';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<div class="wrap">
  <h1>Tell us about your shop</h1>
  <p class="muted">Four fields. That's the whole onboarding — then you post your first job.</p>

  <form method="POST" use:enhance class="card">
    <label for="name">Shop name</label>
    <input id="name" type="text" name="name" required placeholder="Ex: Pinhole Coffee" />

    <label for="neighborhood">Neighborhood</label>
    <select id="neighborhood" name="neighborhood" required>
      <option value="" disabled selected>Pick one…</option>
      {#each NEIGHBORHOOD_NAMES as n (n)}
        <option value={n}>{n}</option>
      {/each}
    </select>

    <label for="address">Street address <span class="muted">(optional)</span></label>
    <input id="address" type="text" name="address" placeholder="231 Cortland Ave" />

    <label for="vibe">Describe your shop's vibe in a sentence</label>
    <input
      id="vibe"
      type="text"
      name="vibe"
      placeholder="Sunny corner shop, regulars by name, community bulletin board energy."
    />

    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}

    <button class="btn submit" type="submit">Next: post a job →</button>
  </form>
</div>

<style>
  .wrap {
    max-width: 520px;
    margin: 1.5rem auto 0;
  }

  form {
    margin-top: 1rem;
  }

  .submit {
    margin-top: 1.4rem;
    width: 100%;
  }
</style>
