<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let usePassword = $state(false);
  let submitting = $state(false);
</script>

<div class="wrap">
  <div class="card">
    {#if data.role === 'owner'}
      <h1>Welcome, shop owner</h1>
      <p class="muted">
        Sign in with just your email — no password to remember. You'll be posting a job in under
        two minutes.
      </p>
    {:else if data.role === 'seeker'}
      <h1>Find your coffee shop</h1>
      <p class="muted">Sign in with your email and set up your profile in a couple of minutes.</p>
    {:else}
      <h1>Sign in</h1>
      <p class="muted">We'll email you a sign-in link. No password needed.</p>
    {/if}

    {#if data.linkError && !form}
      <p class="error">
        That sign-in link didn't work — it may have expired, already been used, or been opened in
        a different browser than the one that requested it. Enter your email below for a fresh one.
      </p>
    {/if}

    {#if form?.sent}
      <p class="success">
        ✉️ Check your inbox — we sent a sign-in link to <strong>{form.email}</strong>.
      </p>
    {:else}
      <form
        method="POST"
        action={usePassword ? '?/password' : '?/magic'}
        use:enhance={() => {
          submitting = true;
          return async ({ update }) => {
            submitting = false;
            await update();
          };
        }}
      >
        <input type="hidden" name="next" value={data.next} />
        <label for="email">Email</label>
        <input id="email" type="email" name="email" required value={form?.email ?? ''} placeholder="you@example.com" />

        {#if usePassword}
          <label for="password">Password</label>
          <input id="password" type="password" name="password" required />
        {/if}

        {#if form?.error}
          <p class="error">{form.error}</p>
        {/if}

        <button class="btn submit" type="submit" disabled={submitting}>
          {submitting ? 'One sec…' : usePassword ? 'Sign in' : 'Email me a sign-in link'}
        </button>
      </form>

      <button class="toggle" type="button" onclick={() => (usePassword = !usePassword)}>
        {usePassword ? 'Use a magic link instead' : 'Have a password? Sign in with it'}
      </button>
    {/if}
  </div>
</div>

<style>
  .wrap {
    max-width: 440px;
    margin: 3rem auto 0;
  }

  .submit {
    margin-top: 1.2rem;
    width: 100%;
  }

  .toggle {
    background: none;
    border: none;
    color: var(--roast);
    font-size: 0.85rem;
    margin-top: 0.9rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }

  input[type='password'] {
    width: 100%;
    padding: 0.55rem 0.7rem;
    border: 1.5px solid var(--line);
    border-radius: 8px;
    font-size: 1rem;
  }
</style>
