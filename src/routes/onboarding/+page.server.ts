import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.profile) {
    redirect(303, locals.profile.role === 'owner' ? '/owner' : '/seeker');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user } = locals;
    if (!user) redirect(303, '/login');

    const form = await request.formData();
    const role = String(form.get('role') ?? '');
    const displayName = String(form.get('display_name') ?? '').trim();

    if (role !== 'seeker' && role !== 'owner') {
      return fail(400, { error: 'Pick a role to continue.', displayName });
    }
    if (!displayName) {
      return fail(400, { error: 'Tell us your name.', displayName });
    }

    const { error } = await locals.supabase
      .from('profiles')
      .insert({ id: user.id, role, display_name: displayName });
    if (error) {
      return fail(500, { error: error.message, displayName });
    }

    redirect(303, role === 'owner' ? '/owner/onboarding' : '/seeker/onboarding');
  }
};
