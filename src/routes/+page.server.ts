import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Demo/seed shops have no owner; never show them.
  const { data: shops } = await locals.supabase
    .from('shops')
    .select('id, name, neighborhood, vibe')
    .not('owner_id', 'is', null)
    .limit(12);
  return { shops: shops ?? [] };
};
