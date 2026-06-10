<script lang="ts">
  import { untrack } from 'svelte';

  let {
    existingUrl = null,
    onrecorded
  }: {
    existingUrl?: string | null;
    onrecorded: (blob: Blob) => void;
  } = $props();

  const MAX_SECONDS = 30;
  // The prop only seeds the initial state; recording flow owns it afterwards.
  const initialUrl = untrack(() => existingUrl);

  let videoEl: HTMLVideoElement | undefined = $state();
  let stream: MediaStream | null = null;
  let recorder: MediaRecorder | null = null;
  let chunks: Blob[] = [];

  let phase: 'idle' | 'live' | 'recording' | 'preview' = $state(initialUrl ? 'preview' : 'idle');
  let previewUrl: string | null = $state(initialUrl);
  let secondsLeft = $state(MAX_SECONDS);
  let cameraError = $state('');
  let timer: ReturnType<typeof setInterval> | undefined;

  async function startCamera() {
    cameraError = '';
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      phase = 'live';
      queueMicrotask(() => {
        if (videoEl && stream) {
          videoEl.srcObject = stream;
          videoEl.muted = true;
          videoEl.play();
        }
      });
    } catch {
      cameraError = 'Could not access your camera/mic. Check browser permissions and try again.';
    }
  }

  function startRecording() {
    if (!stream) return;
    chunks = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';
    recorder = new MediaRecorder(stream, { mimeType });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder?.mimeType ?? 'video/webm' });
      previewUrl = URL.createObjectURL(blob);
      phase = 'preview';
      stopCamera();
      onrecorded(blob);
    };
    recorder.start();
    phase = 'recording';
    secondsLeft = MAX_SECONDS;
    timer = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) stopRecording();
    }, 1000);
  }

  function stopRecording() {
    clearInterval(timer);
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  }

  function stopCamera() {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  function retake() {
    previewUrl = null;
    phase = 'idle';
    startCamera();
  }

  $effect(() => {
    return () => {
      clearInterval(timer);
      stopCamera();
    };
  });
</script>

<div class="recorder">
  {#if phase === 'idle'}
    <div class="placeholder">
      <p>Record a 30-second hello. Who are you, why coffee, what's your vibe?</p>
      <button class="btn" type="button" onclick={startCamera}>Open camera</button>
      {#if cameraError}
        <p class="error">{cameraError}</p>
      {/if}
    </div>
  {:else if phase === 'live' || phase === 'recording'}
    <video bind:this={videoEl} playsinline></video>
    <div class="controls">
      {#if phase === 'live'}
        <button class="btn" type="button" onclick={startRecording}>● Start recording</button>
      {:else}
        <span class="countdown">{secondsLeft}s</span>
        <button class="btn" type="button" onclick={stopRecording}>■ Stop</button>
      {/if}
    </div>
  {:else if phase === 'preview' && previewUrl}
    <!-- svelte-ignore a11y_media_has_caption -->
    <video src={previewUrl} controls></video>
    <div class="controls">
      <button class="btn secondary" type="button" onclick={retake}>Retake</button>
    </div>
  {/if}
</div>

<style>
  .recorder {
    border: 1.5px dashed var(--line);
    border-radius: 12px;
    padding: 1rem;
    background: var(--paper);
  }

  video {
    width: 100%;
    max-height: 320px;
    border-radius: 8px;
    background: #000;
  }

  .placeholder {
    text-align: center;
    padding: 1.5rem 1rem;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    margin-top: 0.7rem;
  }

  .countdown {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--red);
    min-width: 3rem;
  }
</style>
