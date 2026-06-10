import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    redirect(303, locals.profile ? (locals.profile.role === 'owner' ? '/owner' : '/seeker') : '/onboarding');
  }
  return {
    role: url.searchParams.get('role') ?? '',
    next: url.searchParams.get('next') ?? '',
    linkError: url.searchParams.get('error') === 'link'
  };
};

export const actions: Actions = {
  magic: async ({ request, locals, url }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '').trim();
    const next = String(form.get('next') ?? '');
    if (!email.includes('@')) {
      return fail(400, { error: 'Enter a valid email address.', email });
    }
    const { error } = await locals.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${url.origin}/auth/confirm?next=${encodeURIComponent(next || '/onboarding')}`
      }
    });
    if (error) {
      return fail(400, { error: error.message, email });
    }
    return { sent: true, email };
  },

  password: async ({ request, locals }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    if (!email.includes('@')) {
      return fail(400, { error: 'Enter a valid email address.', email });
    }
    if (password.length < 6) {
      return fail(400, { error: 'Password needs at least 6 characters.', email });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      redirect(303, '/onboarding');
    }

    // No account yet (or wrong password) — try creating one on the spot.
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      const { data, error: signUpError } = await locals.supabase.auth.signUp({ email, password });
      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('already registered')) {
          return fail(400, {
            error:
              'This email has an account, but that password doesn’t match it. (If you previously signed in with an email link, the account has no password — use a different email, or ask us to reset it.)',
            email
          });
        }
        return fail(400, { error: signUpError.message, email });
      }
      if (!data.session) {
        return fail(400, {
          error:
            'Account created, but email confirmation is still required. In Supabase: Authentication → Sign In / Providers → Email → turn off "Confirm email".',
          email
        });
      }
      redirect(303, '/onboarding');
    }

    return fail(400, { error: error.message, email });
  }
};
