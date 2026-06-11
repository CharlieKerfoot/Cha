import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Signed-in users skip the marketing page and land on their dashboard.
  if (locals.user) {
    redirect(
      303,
      locals.profile ? (locals.profile.role === 'owner' ? '/owner' : '/seeker') : '/onboarding'
    );
  }
  // Demo/seed shops have no owner; never show them.
  const { data: shops } = await locals.supabase
    .from('shops')
    .select('id, name, neighborhood, vibe')
    .not('owner_id', 'is', null)
    .limit(12);
  return { shops: shops ?? [] };
};
