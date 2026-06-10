import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (locals.profile?.role !== 'owner') {
    redirect(303, locals.profile ? '/seeker' : '/onboarding');
  }
  return {};
};
