<script lang="ts">
  import { enhance } from '$app/forms';
  import { describeShifts } from '$lib/availability';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const STATUSES = [
    ['new', 'New'],
    ['seen', 'Seen'],
    ['interview', 'Interview'],
    ['hired', 'Hired'],
    ['passed', 'Passed']
  ] as const;
</script>

<div class="head">
  <div>
    <h1>{data.shop.name}</h1>
    <p class="muted">{data.shop.neighborhood} · {data.jobs.length} job{data.jobs.length === 1 ? '' : 's'} posted</p>
  </div>
  <a class="btn" href="/owner/jobs/new">+ Post a job</a>
</div>

{#if data.jobs.length === 0}
  <div class="card empty">
    <h3>No jobs yet</h3>
    <p class="muted">Post one and we'll show you every candidate nearby who fits.</p>
  </div>
{/if}

{#if data.applications.length > 0}
  <section>
    <h2>Applicants</h2>
    <div class="list">
      {#each data.applications as app (app.id)}
        {@const seeker = app.seekers}
        {@const name = seeker?.profiles?.display_name ?? 'Candidate'}
        <div class="card person">
          <div class="video">
            {#if seeker?.video_url}
              <!-- svelte-ignore a11y_media_has_caption -->
              <video src={seeker.video_url} controls preload="metadata"></video>
            {:else}
              <div class="no-video muted">No intro video yet</div>
            {/if}
          </div>
          <div class="body">
            <h3>{name}</h3>
            <p class="meta">
              <span class="badge">{seeker?.neighborhood}</span>
              {#if seeker?.basics_confirmed}
                <span class="badge ok">✓ Basics confirmed</span>
              {/if}
            </p>
            <p class="muted">{seeker?.bio}</p>
            <p class="muted shifts">Can work — {describeShifts(seeker?.shifts ?? [])}</p>
          </div>
          <div class="action">
            <form method="POST" action="?/status" use:enhance>
              <input type="hidden" name="id" value={app.id} />
              <label for="status-{app.id}" class="sr-only">Status</label>
              <select
                id="status-{app.id}"
                name="status"
                onchange={(e) => e.currentTarget.form?.requestSubmit()}
              >
                {#each STATUSES as [value, label] (value)}
                  <option {value} selected={app.status === value}>{label}</option>
                {/each}
              </select>
            </form>
          </div>
        </div>
      {/each}
    </div>
  </section>
{/if}

{#if data.pool.length > 0}
  <section>
    <h2>Candidates near you</h2>
    <p class="muted">
      People looking for coffee work whose range covers {data.shop.name}, ranked by distance and
      shift fit. They haven't applied (yet) — but this is your hiring pool.
    </p>
    <div class="list">
      {#each data.pool as p (p.seeker.profile_id)}
        <div class="card person">
          <div class="score">
            <span class="score-pill">{p.score}</span>
            <span class="muted fit">fit</span>
          </div>
          <div class="video">
            {#if p.seeker.video_url}
              <!-- svelte-ignore a11y_media_has_caption -->
              <video src={p.seeker.video_url} controls preload="metadata"></video>
            {:else}
              <div class="no-video muted">No intro video yet</div>
            {/if}
          </div>
          <div class="body">
            <h3>{p.seeker.profiles?.display_name ?? 'Candidate'}</h3>
            <p class="meta">
              <span class="badge">{p.seeker.neighborhood}</span>
              <span class="badge">{p.distance.toFixed(1)} mi away</span>
              <span class="badge">{Math.round(p.overlap * 100)}% shift match</span>
              {#if p.seeker.basics_confirmed}
                <span class="badge ok">✓ Basics confirmed</span>
              {/if}
            </p>
            <p class="muted">{p.seeker.bio}</p>
            <p class="muted shifts">Can work — {describeShifts(p.seeker.shifts)}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>
{/if}

<style>
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.4rem;
  }

  section {
    margin-top: 2rem;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 0.8rem;
  }

  .person {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .score {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 3.4rem;
  }

  .fit {
    font-size: 0.75rem;
  }

  .video {
    width: 220px;
    flex-shrink: 0;
  }

  .video video {
    width: 100%;
    border-radius: 8px;
    background: #000;
  }

  .no-video {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px dashed var(--line);
    border-radius: 8px;
    font-size: 0.85rem;
  }

  .body {
    flex: 1;
    min-width: 220px;
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

  .badge.ok {
    color: var(--good);
    border-color: var(--good);
  }

  .body p {
    margin: 0.15rem 0;
  }

  .action select {
    width: auto;
  }

  .empty {
    text-align: center;
    padding: 2.5rem 1rem;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
</style>
