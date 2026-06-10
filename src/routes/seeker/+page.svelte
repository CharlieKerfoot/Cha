<script lang="ts">
  import { enhance } from '$app/forms';
  import ShopsMap from '$lib/components/ShopsMap.svelte';
  import { describeShifts } from '$lib/availability';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const STATUS_LABELS: Record<string, string> = {
    new: 'Applied',
    seen: 'Seen by the shop',
    interview: 'They want to meet!',
    hired: 'Hired 🎉',
    passed: 'Not this time'
  };

  let shopPins = $derived(
    data.matches.map((m) => ({
      id: m.shop.id,
      name: m.shop.name,
      lat: m.shop.lat,
      lng: m.shop.lng,
      website: m.shop.website || undefined,
      label: `${m.distance.toFixed(1)} mi · ${m.score} fit`
    }))
  );
</script>

<div class="head">
  <h1>Your matches</h1>
  <p class="muted">
    Shops inside your {data.seeker.radius_miles} mi range, ranked by distance and shift fit.
    {#if !data.seeker.video_url}
      <a href="/seeker/profile">Record your intro video</a> to stand out.
    {/if}
  </p>
</div>

{#if data.matches.length > 0}
  <ShopsMap
    center={{ lat: data.seeker.lat, lng: data.seeker.lng }}
    radiusMiles={Number(data.seeker.radius_miles)}
    shops={shopPins}
  />
{:else}
  <div class="card empty">
    <h3>No shops in range yet</h3>
    <p class="muted">
      Shops are joining cha now, so check back soon. Meanwhile, try widening your radius or
      adding more shifts on <a href="/seeker/profile">your profile</a>.
    </p>
  </div>
{/if}

<div class="list">
  {#each data.matches as m (m.job.id)}
    <div class="card match">
      <div class="score">
        <span class="score-pill">{m.score}</span>
        <span class="meta-mono">fit</span>
      </div>
      <div class="body">
        <h3>{m.shop.name}</h3>
        <p class="meta-mono line">
          {m.shop.neighborhood} · {m.distance.toFixed(1)} mi
          {#if m.job.pay_min}
            · ${m.job.pay_min}–{m.job.pay_max}/hr
          {/if}
          · {Math.round(m.overlap * 100)}% shift match
        </p>
        <p class="muted">{m.shop.vibe}</p>
        <p class="meta-mono line">Needs · {describeShifts(m.job.shifts)}</p>
        {#if m.shop.website}
          <a href={m.shop.website} target="_blank" rel="noopener noreferrer">Visit their website ↗</a>
        {/if}
      </div>
      <div class="action">
        {#if m.appliedStatus}
          <span class="applied">{STATUS_LABELS[m.appliedStatus] ?? m.appliedStatus}</span>
        {:else}
          <form method="POST" action="?/apply" use:enhance>
            <input type="hidden" name="job_id" value={m.job.id} />
            <button class="btn" type="submit">Apply</button>
          </form>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .head {
    margin-bottom: 1.2rem;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1rem;
  }

  .match {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    min-width: 3.4rem;
  }

  .body {
    flex: 1;
  }

  .body h3 {
    margin-bottom: 0.25rem;
  }

  .body p {
    margin: 0.15rem 0;
  }

  .line {
    margin: 0.2rem 0;
  }

  .action {
    align-self: center;
  }

  .applied {
    color: var(--green);
    font-weight: 600;
    font-size: 0.92rem;
    white-space: nowrap;
  }

  .empty {
    text-align: center;
    padding: 2.5rem 1rem;
  }
</style>
