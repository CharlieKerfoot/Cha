<script lang="ts">
  import { enhance } from '$app/forms';
  import LocationPicker from '$lib/components/LocationPicker.svelte';
  import { SF_CENTER } from '$lib/geo';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  let lat = $state(SF_CENTER.lat);
  let lng = $state(SF_CENTER.lng);
</script>

<div class="wrap">
  <h1>Tell us about your shop</h1>
  <p class="muted">A name, a pin on the map, and you're posting your first job.</p>

  <form method="POST" use:enhance class="card">
    <label for="name">Shop name</label>
    <input id="name" type="text" name="name" required placeholder="Ex: Pinhole Coffee" />

    <label for="map">Where's the shop?</label>
    <div id="map">
      <LocationPicker bind:lat bind:lng showRadius={false} />
    </div>

    <label for="address">Street address <span class="muted">(optional)</span></label>
    <input id="address" type="text" name="address" placeholder="231 Cortland Ave" />

    <label for="website">Website <span class="muted">(optional)</span></label>
    <input id="website" type="text" name="website" placeholder="pinholecoffee.com" />

    <label for="contact">How candidates reach you <span class="muted">(optional)</span></label>
    <input id="contact" type="text" name="contact" placeholder="Text 415-555-0142" />
    <p class="muted hint">Shared only with people you mark Interested, for setting up interviews.</p>

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
    max-width: 560px;
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
