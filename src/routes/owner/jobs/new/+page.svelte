<script lang="ts">
  import { enhance } from '$app/forms';
  import AvailabilityGrid from '$lib/components/AvailabilityGrid.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let shifts = $state<string[]>([]);
</script>

<div class="wrap">
  {#if data.first}
    <h1>Post your first job</h1>
    <p class="muted">
      As soon as you post, you'll see every candidate near {data.shop.name} who can work these
      shifts — with their intro videos.
    </p>
  {:else}
    <h1>Post a job at {data.shop.name}</h1>
  {/if}

  <form method="POST" use:enhance class="card">
    <label for="title">Role</label>
    <input id="title" type="text" name="title" value="Barista" required />

    <div class="pay">
      <div>
        <label for="pay_min">Pay from ($/hr)</label>
        <input id="pay_min" type="number" name="pay_min" min="0" step="0.5" placeholder="19" />
      </div>
      <div>
        <label for="pay_max">to ($/hr)</label>
        <input id="pay_max" type="number" name="pay_max" min="0" step="0.5" placeholder="24" />
      </div>
    </div>

    <label for="shift-grid">Shifts you need covered</label>
    <div id="shift-grid">
      <AvailabilityGrid bind:selected={shifts} />
    </div>

    <label for="description">Anything else candidates should know? <span class="muted">(optional)</span></label>
    <textarea
      id="description"
      name="description"
      rows="2"
      placeholder="Tips on top of hourly. Experience is a plus, good vibes required."
    ></textarea>

    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}

    <button class="btn submit" type="submit">Post job</button>
  </form>
</div>

<style>
  .wrap {
    max-width: 560px;
    margin: 1.5rem auto 0;
  }

  form {
    margin-top: 1rem;
  }

  .pay {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }

  .submit {
    margin-top: 1.4rem;
    width: 100%;
  }
</style>
