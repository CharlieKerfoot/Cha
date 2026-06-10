<script lang="ts">
  import { untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import AvailabilityGrid from '$lib/components/AvailabilityGrid.svelte';
  import LocationPicker from '$lib/components/LocationPicker.svelte';
  import VideoRecorder from '$lib/components/VideoRecorder.svelte';
  import { SF_CENTER } from '$lib/geo';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Seed the form once from the loaded profile; edits live in local state.
  const saved = untrack(() => data.seeker);
  let shifts = $state<string[]>(saved?.shifts ?? []);
  let radius = $state(Number(saved?.radius_miles ?? 3));
  let lat = $state(Number(saved?.lat ?? SF_CENTER.lat));
  let lng = $state(Number(saved?.lng ?? SF_CENTER.lng));
  let videoBlob: Blob | null = $state(null);
  let uploadError = $state('');
  let saving = $state(false);
</script>

<div class="wrap">
  {#if data.welcome}
    <h1>Set up your profile</h1>
    <p class="muted">
      This takes about two minutes. The video is your application. One recording goes to every
      shop you apply to.
    </p>
  {:else}
    <h1>My profile</h1>
  {/if}

  <form
    method="POST"
    use:enhance={async ({ formData, cancel }) => {
      saving = true;
      uploadError = '';
      if (videoBlob) {
        const userId = data.session?.user.id;
        const ext = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
        const path = `${userId}/intro-${Date.now()}.${ext}`;
        const { error } = await data.supabase.storage
          .from('videos')
          .upload(path, videoBlob, { contentType: videoBlob.type, upsert: true });
        if (error) {
          uploadError = `Video upload failed: ${error.message}`;
          saving = false;
          cancel();
          return;
        }
        const { data: pub } = data.supabase.storage.from('videos').getPublicUrl(path);
        formData.set('video_url', pub.publicUrl);
      }
      return async ({ update }) => {
        saving = false;
        await update();
      };
    }}
  >
    <div class="card section">
      <h3>Where</h3>
      <p class="muted">Drop the pin where you live (roughly). The circle is your travel range.</p>
      <LocationPicker bind:lat bind:lng radiusMiles={radius} />

      <label for="radius">How far you'd travel: <strong>{radius} mi</strong></label>
      <input
        id="radius"
        type="range"
        name="radius_miles"
        min="0.5"
        max="10"
        step="0.5"
        bind:value={radius}
      />
    </div>

    <div class="card section">
      <h3>When</h3>
      <p class="muted">Tap the shifts you can work.</p>
      <AvailabilityGrid bind:selected={shifts} />
    </div>

    <div class="card section">
      <h3>Your 30-second hello</h3>
      <VideoRecorder
        existingUrl={data.seeker?.video_url ?? null}
        onrecorded={(blob) => (videoBlob = blob)}
      />

      <label for="bio">A line or two about you</label>
      <textarea
        id="bio"
        name="bio"
        rows="2"
        placeholder="Ex: Two years of cafe experience, early riser, latte art enthusiast."
        >{data.seeker?.bio ?? ''}</textarea
      >
    </div>

    <div class="card section">
      <h3>The basics</h3>
      <label class="check">
        <input
          type="checkbox"
          name="basics_confirmed"
          checked={data.seeker?.basics_confirmed ?? false}
        />
        I'm legally able to work in the US and OK with a standard background check.
      </label>
    </div>

    {#if uploadError}
      <p class="error">{uploadError}</p>
    {/if}
    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}

    <button class="btn submit" type="submit" disabled={saving}>
      {saving ? 'Saving…' : 'Save and see my matches'}
    </button>
  </form>
</div>

<style>
  .wrap {
    max-width: 620px;
    margin: 0 auto;
  }

  .section {
    margin-top: 1rem;
  }

  .check {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    font-weight: 400;
    margin-top: 0.2rem;
  }

  .check input {
    margin-top: 0.25rem;
  }

  input[type='range'] {
    width: 100%;
  }

  .submit {
    margin-top: 1.4rem;
    width: 100%;
  }
</style>
