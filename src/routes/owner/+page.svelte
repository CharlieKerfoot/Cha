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

  // Which applicant's invite composer is open. Tapping "Interested" reveals a
  // short note box; sending it moves them to interview.
  let invitingId = $state<string | null>(null);

  function experienceLabel(seeker: { years_experience?: number | null } | undefined): string | null {
    const yrs = seeker?.years_experience;
    if (yrs == null || yrs <= 0) return null;
    const rounded = Number.isInteger(yrs) ? yrs : yrs.toFixed(1);
    return `${rounded} yr${yrs === 1 ? '' : 's'} experience`;
  }
</script>

<div class="head">
  <div>
    <h1>{data.shop.name}</h1>
    <p class="muted">{data.shop.neighborhood} · {data.jobs.length} job{data.jobs.length === 1 ? '' : 's'} posted</p>
  </div>
  <a class="btn" href="/owner/jobs/new">+ Post a job</a>
</div>

{#if !data.shop.contact}
  <div class="card contact-prompt">
    <div>
      <h3>How should candidates reach you?</h3>
      <p class="muted">
        We share this only with people you mark Interested, so they know how to set up the
        interview. A phone number, an email, or "just come by, ask for Sam."
      </p>
    </div>
    <form method="POST" action="?/contact" use:enhance class="contact-form">
      <label for="contact" class="sr-only">Contact</label>
      <input id="contact" name="contact" placeholder="Text 415-555-0142" required />
      <button class="btn" type="submit">Save</button>
    </form>
  </div>
{/if}

{#if data.jobs.length === 0}
  <div class="card empty">
    <h3>No jobs yet</h3>
    <p class="muted">Post one and we'll show you every candidate nearby who fits.</p>
  </div>
{:else if data.applications.length === 0 && data.pool.length === 0}
  <div class="card empty">
    <h3>Your sign is in the window</h3>
    <p class="muted">
      The job is live. As candidates join cha and set their range near you, they'll show up here
      with their intro videos — applicants first, then everyone nearby who fits your shifts.
    </p>
  </div>
{/if}

{#if data.applications.length > 0}
  <section>
    <h2>Applicants</h2>
    <div class="list">
      {#each data.applications as app (app.id)}
        {@const seeker = app.seekers}
        {@const name = seeker?.profiles?.display_name ?? 'Candidate'}
        <div class="card person ticket">
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
            <p class="meta-mono">
              {seeker?.neighborhood}
              {#if seeker?.basics_confirmed}
                · basics ✓
              {/if}
              {#if experienceLabel(seeker)}
                · {experienceLabel(seeker)}
              {/if}
            </p>
            <p class="muted">{seeker?.bio}</p>
            {#if seeker?.experience}
              <p class="muted exp">Worked: {seeker.experience}</p>
            {/if}
            <p class="meta-mono">Can work · {describeShifts(seeker?.shifts ?? [])}</p>
            {#if app.status === 'interview' && app.note}
              <p class="meta-mono sent">You said: "{app.note}"</p>
            {/if}
          </div>
          <div class="action">
            {#if app.status === 'hired'}
              <span class="stamp">Hired</span>
            {/if}

            {#if app.status === 'new' || app.status === 'seen'}
              {#if invitingId === app.id}
                <form method="POST" action="?/invite" use:enhance={() => {
                  return async ({ update }) => {
                    invitingId = null;
                    await update();
                  };
                }} class="invite-form">
                  <input type="hidden" name="id" value={app.id} />
                  <label for="note-{app.id}" class="sr-only">Note to candidate</label>
                  <textarea
                    id="note-{app.id}"
                    name="note"
                    rows="2"
                    placeholder="Loved your video. Can you come by Tuesday morning?"
                  ></textarea>
                  <div class="invite-actions">
                    <button class="btn small" type="submit">Send invite</button>
                    <button
                      type="button"
                      class="link-btn"
                      onclick={() => (invitingId = null)}>Cancel</button
                    >
                  </div>
                </form>
              {:else}
                <div class="triage">
                  <button class="btn" onclick={() => (invitingId = app.id)}>Interested</button>
                  <form method="POST" action="?/status" use:enhance>
                    <input type="hidden" name="id" value={app.id} />
                    <input type="hidden" name="status" value="passed" />
                    <button type="submit" class="link-btn">Pass</button>
                  </form>
                </div>
              {/if}
            {/if}

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
      shift fit. They haven't applied yet, but this is your hiring pool.
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
            <p class="meta-mono">
              {p.seeker.neighborhood} · {p.distance.toFixed(1)} mi · {Math.round(p.overlap * 100)}%
              fit
              {#if p.seeker.basics_confirmed}
                · basics ✓
              {/if}
              {#if experienceLabel(p.seeker)}
                · {experienceLabel(p.seeker)}
              {/if}
            </p>
            <p class="muted">{p.seeker.bio}</p>
            {#if p.seeker.experience}
              <p class="muted exp">Worked: {p.seeker.experience}</p>
            {/if}
            <p class="meta-mono">Can work · {describeShifts(p.seeker.shifts)}</p>
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

  /* Receipt ticket: dashed perforation along the top edge */
  .ticket {
    position: relative;
    padding-top: 1.5rem;
  }

  .ticket::before {
    content: '';
    position: absolute;
    top: 0.55rem;
    left: 1rem;
    right: 1rem;
    border-top: 1.5px dashed var(--line);
  }

  .action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
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

  .contact-prompt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.4rem;
    border-color: var(--red);
  }

  .contact-prompt h3 {
    margin-bottom: 0.25rem;
  }

  .contact-form {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .contact-form input {
    width: auto;
    min-width: 200px;
  }

  .exp {
    font-style: italic;
  }

  .sent {
    color: var(--green);
    margin-top: 0.3rem;
  }

  .triage {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
  }

  .invite-form {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 240px;
  }

  .invite-form textarea {
    width: 100%;
  }

  .invite-actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .btn.small {
    padding: 0.35rem 0.8rem;
    font-size: 0.9rem;
  }

  .link-btn {
    background: none;
    border: none;
    padding: 0;
    color: var(--muted);
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .link-btn:hover {
    color: var(--ink);
  }
</style>
