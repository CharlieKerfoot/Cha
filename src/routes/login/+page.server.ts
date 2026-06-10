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
    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return fail(400, { error: error.message, email, mode: 'password' });
    }
    redirect(303, '/onboarding');
  }
};
