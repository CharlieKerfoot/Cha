<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const STATUS_COPY: Record<string, string> = {
    new: 'Application sent',
    seen: 'The shop has seen your video',
    interview: 'They want to meet you, expect a message',
    hired: 'You got it!',
    passed: 'They went another way this time'
  };

  function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<h1>Applied</h1>
<p class="muted">Every shop you've applied to, newest first.</p>

{#if data.applications.length === 0}
  <div class="card empty">
    <h3>Nothing yet</h3>
    <p class="muted">When you apply from <a href="/seeker">your matches</a>, it shows up here.</p>
  </div>
{:else}
  <div class="list">
    {#each data.applications as app (app.id)}
      {@const job = app.jobs as any}
      {@const shop = job?.shops}
      <div class="card row">
        <div class="body">
          <h3>{shop?.name}</h3>
          <p class="meta-mono">
            {shop?.neighborhood} · {job?.title}
            {#if job?.pay_min}
              · ${job.pay_min}–{job.pay_max}/hr
            {/if}
            · applied {fmtDate(app.created_at)}
          </p>
          {#if shop?.website}
            <a href={shop.website} target="_blank" rel="noopener noreferrer">Visit their website ↗</a>
          {/if}
        </div>
        <div class="status">
          {#if app.status === 'hired'}
            <span class="stamp">Hired</span>
          {:else}
            <span class="chip {app.status}">{app.status}</span>
          {/if}
          <p class="muted copy">{STATUS_COPY[app.status]}</p>
        </div>
      </div>

      {#if (app.status === 'interview' || app.status === 'hired') && (app.note || shop?.contact)}
        <div class="invite">
          {#if app.note}
            <p class="note">"{app.note}"</p>
          {/if}
          {#if shop?.contact}
            <p class="meta-mono reach">Reach them · {shop.contact}</p>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1rem;
  }

  .row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .body h3 {
    margin-bottom: 0.25rem;
  }

  .body p {
    margin: 0.15rem 0 0.3rem;
  }

  .status {
    text-align: right;
    max-width: 220px;
  }

  .copy {
    margin: 0.4rem 0 0;
    font-size: 0.82rem;
  }

  .empty {
    text-align: center;
    padding: 2.5rem 1rem;
    margin-top: 1rem;
  }

  .invite {
    width: 100%;
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    border-top: 1.5px dashed var(--line);
  }

  .note {
    font-style: italic;
    margin: 0 0 0.3rem;
  }

  .reach {
    margin: 0;
    color: var(--green);
  }
</style>
