import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    redirect(303, locals.profile ? (locals.profile.role === 'owner' ? '/owner' : '/seeker') : '/onboarding');
  }
  return {
    role: url.searchParams.get('role') ?? '',
    next: url.searchParams.get('next') ?? ''
  };
};

function safeNext(next: string): string {
  return next.startsWith('/') && !next.startsWith('//') ? next : '/onboarding';
}

function validate(email: string, password: string) {
  if (!email.includes('@')) {
    return 'Enter a valid email address.';
  }
  if (password.length < 6) {
    return 'Password needs at least 6 characters.';
  }
  return null;
}

export const actions: Actions = {
  signin: async ({ request, locals }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const next = String(form.get('next') ?? '');

    const invalid = validate(email, password);
    if (invalid) {
      return fail(400, { error: invalid, email });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        return fail(400, {
          error: "That email and password don't match. New here? Create an account instead.",
          email
        });
      }
      return fail(400, { error: error.message, email });
    }

    redirect(303, safeNext(next));
  },

  signup: async ({ request, locals }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const role = String(form.get('role') ?? '');
    let next = String(form.get('next') ?? '');
    // Landing CTAs already told us who this is; onboarding shouldn't re-ask.
    if (!next && (role === 'owner' || role === 'seeker')) {
      next = `/onboarding?role=${role}`;
    }

    const invalid = validate(email, password);
    if (invalid) {
      return fail(400, { error: invalid, email });
    }

    const { data, error } = await locals.supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        return fail(400, {
          error: 'This email already has an account. Sign in instead.',
          email
        });
      }
      return fail(400, { error: error.message, email });
    }
    if (!data.session) {
      return fail(400, {
        error:
          'Account created, but email confirmation is still required. In Supabase: Authentication → Sign In / Providers → Email → turn off "Confirm email".',
        email
      });
    }

    redirect(303, safeNext(next));
  }
};
