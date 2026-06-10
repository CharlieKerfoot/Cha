import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: shops } = await locals.supabase
    .from('shops')
    .select('id, name, neighborhood, vibe')
    .limit(12);
  return { shops: shops ?? [] };
};
