<script lang="ts">
  import { enhance } from '$app/forms';
  import LocationPicker from '$lib/components/LocationPicker.svelte';
  import { SF_CENTER } from '$lib/geo';
  import type { ActionData, PageData } from './$types';

  interface DirectoryEntry {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    website: string;
    phone: string;
  }

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let query = $state('');
  let results = $state<DirectoryEntry[]>([]);
  let searching = $state(false);
  let picked: DirectoryEntry | null = $state(null);
  let manual = $state(false);

  let name = $state('');
  let address = $state('');
  let website = $state('');
  let lat = $state(SF_CENTER.lat);
  let lng = $state(SF_CENTER.lng);

  let showForm = $derived(manual || picked !== null);
  let searchSeq = 0;

  async function search() {
    const term = query.trim();
    if (term.length < 2) {
      results = [];
      return;
    }
    const seq = ++searchSeq;
    searching = true;
    const { data: rows } = await data.supabase
      .from('shop_directory')
      .select('id, name, lat, lng, address, website, phone')
      .ilike('name', `%${term}%`)
      .order('name')
      .limit(8);
    if (seq === searchSeq) {
      results = rows ?? [];
      searching = false;
    }
  }

  function pick(entry: DirectoryEntry) {
    picked = entry;
    manual = false;
    name = entry.name;
    address = entry.address;
    website = entry.website;
    lat = entry.lat;
    lng = entry.lng;
    results = [];
    query = entry.name;
  }

  function startManual() {
    manual = true;
    picked = null;
    name = query.trim();
    results = [];
  }
</script>

<div class="wrap">
  <h1>Tell us about your shop</h1>

  <div class="card search-card">
    <label for="search">Find your shop</label>
    <p class="muted hint">
      We already know most SF coffee shops. Search yours and we'll fill everything in.
    </p>
    <input
      id="search"
      type="text"
      placeholder="Start typing your shop's name…"
      bind:value={query}
      oninput={search}
      autocomplete="off"
    />

    {#if results.length > 0}
      <ul class="results">
        {#each results as entry (entry.id)}
          <li>
            <button type="button" class="result" onclick={() => pick(entry)}>
              <strong>{entry.name}</strong>
              {#if entry.address}
                <span class="meta-mono">{entry.address}</span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    {:else if query.trim().length >= 2 && !searching}
      <p class="muted no-results">No matches for "{query.trim()}".</p>
    {/if}

    {#if !showForm}
      <button type="button" class="manual-link" onclick={startManual}>
        My shop isn't listed — enter it by hand
      </button>
    {/if}
  </div>

  {#if showForm}
    <form method="POST" use:enhance class="card details">
      {#if picked}
        <p class="meta-mono found">✓ Found in the SF cafe directory — check the details and go</p>
        <input type="hidden" name="directory_id" value={picked.id} />
      {/if}

      <label for="name">Shop name</label>
      <input id="name" type="text" name="name" required bind:value={name} placeholder="Ex: Pinhole Coffee" />

      <label for="map">Where's the shop?</label>
      <div id="map">
        <LocationPicker bind:lat bind:lng showRadius={false} />
      </div>

      <label for="address">Street address <span class="muted">(optional)</span></label>
      <input id="address" type="text" name="address" bind:value={address} placeholder="231 Cortland Ave" />

      <label for="website">Website <span class="muted">(optional)</span></label>
      <input id="website" type="text" name="website" bind:value={website} placeholder="pinholecoffee.com" />

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
  {/if}
</div>

<style>
  .wrap {
    max-width: 560px;
    margin: 1.5rem auto 0;
  }

  .search-card {
    margin-top: 1rem;
  }

  .search-card label {
    margin-top: 0;
  }

  .hint {
    margin: 0 0 0.6rem;
    font-size: 0.85rem;
  }

  .results {
    list-style: none;
    margin: 0.6rem 0 0;
    padding: 0;
    border: 1.5px solid var(--ink);
    border-radius: 6px;
    overflow: hidden;
  }

  .results li + li {
    border-top: 1.5px dashed var(--line);
  }

  .result {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    width: 100%;
    text-align: left;
    background: var(--surface);
    border: none;
    padding: 0.6rem 0.8rem;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--ink);
  }

  .result:hover {
    background: var(--paper);
  }

  .no-results {
    margin: 0.6rem 0 0;
  }

  .manual-link {
    background: none;
    border: none;
    color: var(--blue);
    text-decoration: underline;
    font-family: var(--font-body);
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0;
    margin-top: 0.8rem;
  }

  .details {
    margin-top: 1rem;
  }

  .found {
    color: var(--green);
    margin: 0 0 0.5rem;
  }

  .submit {
    margin-top: 1.4rem;
    width: 100%;
  }
</style>
