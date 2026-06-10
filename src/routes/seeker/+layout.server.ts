import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.profile?.role !== 'seeker') {
    redirect(303, locals.profile ? '/owner' : '/onboarding');
  }
  return {};
};
