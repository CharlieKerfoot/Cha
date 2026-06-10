<script lang="ts">
  import { enhance } from '$app/forms';
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
</script>

<div class="head">
  <div>
    <h1>Your matches</h1>
    <p class="muted">
      Shops within {data.seeker.radius_miles} mi of {data.seeker.neighborhood}, ranked by distance
      and shift fit.
      {#if !data.seeker.video_url}
        <a href="/seeker/profile">Record your intro video</a> to stand out.
      {/if}
    </p>
  </div>
</div>

{#if data.matches.length === 0}
  <div class="card empty">
    <h3>No shops in range yet</h3>
    <p class="muted">
      Try widening your radius or adding more shifts on
      <a href="/seeker/profile">your profile</a>.
    </p>
  </div>
{/if}

<div class="list">
  {#each data.matches as m (m.job.id)}
    <div class="card match">
      <div class="score">
        <span class="score-pill">{m.score}</span>
        <span class="muted fit">fit</span>
      </div>
      <div class="body">
        <h3>{m.shop.name}</h3>
        <p class="meta">
          <span class="badge">{m.shop.neighborhood}</span>
          <span class="badge">{m.distance.toFixed(1)} mi away</span>
          {#if m.job.pay_min}
            <span class="badge">${m.job.pay_min}–{m.job.pay_max}/hr + tips</span>
          {/if}
          <span class="badge">{Math.round(m.overlap * 100)}% shift match</span>
        </p>
        <p class="muted">{m.shop.vibe}</p>
        <p class="shifts muted">Needs: {describeShifts(m.job.shifts)}</p>
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

  .fit {
    font-size: 0.75rem;
  }

  .body {
    flex: 1;
  }

  .body h3 {
    margin-bottom: 0.25rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0 0 0.4rem;
  }

  .body p {
    margin: 0.15rem 0;
  }

  .action {
    align-self: center;
  }

  .applied {
    color: var(--good);
    font-weight: 600;
    font-size: 0.92rem;
    white-space: nowrap;
  }

  .empty {
    text-align: center;
    padding: 2.5rem 1rem;
  }
</style>
