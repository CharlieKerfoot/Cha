<script lang="ts">
  import { untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Landing CTAs carry a role param and bring new users, so they land on sign up.
  // Only the initial value matters; the toggle below owns the state afterwards.
  let mode: 'signin' | 'signup' = $state(untrack(() => data.role) ? 'signup' : 'signin');
  let submitting = $state(false);
</script>

<div class="wrap">
  <div class="card">
    {#if mode === 'signup'}
      {#if data.role === 'owner'}
        <h1>Welcome, shop owner</h1>
        <p class="muted">Create an account and you'll be posting a job in under two minutes.</p>
      {:else if data.role === 'seeker'}
        <h1>Find your coffee shop</h1>
        <p class="muted">
          Create an account, set up your profile, and see every shop hiring near you.
        </p>
      {:else}
        <h1>Create an account</h1>
        <p class="muted">Takes under a minute. Just an email and a password.</p>
      {/if}
    {:else}
      <h1>Sign in</h1>
      <p class="muted">Welcome back.</p>
    {/if}

    <form
      method="POST"
      action={mode === 'signup' ? '?/signup' : '?/signin'}
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          submitting = false;
          await update();
        };
      }}
    >
      <input type="hidden" name="next" value={data.next} />
      <input type="hidden" name="role" value={data.role} />
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        name="email"
        required
        value={form?.email ?? ''}
        placeholder="you@example.com"
      />

      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        required
        minlength="6"
        autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
      />

      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}

      <button class="btn submit" type="submit" disabled={submitting}>
        {submitting ? 'One sec…' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </button>
    </form>

    <button
      class="toggle"
      type="button"
      onclick={() => (mode = mode === 'signup' ? 'signin' : 'signup')}
    >
      {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}
    </button>
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
    color: var(--muted);
    font-size: 0.85rem;
    margin-top: 0.9rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }
</style>
