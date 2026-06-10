import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: applications } = await locals.supabase
    .from('applications')
    .select('id, status, created_at, jobs(id, title, pay_min, pay_max, shifts, shops(id, name, neighborhood, vibe, website))')
    .eq('seeker_id', locals.user!.id)
    .order('created_at', { ascending: false });

  return { applications: applications ?? [] };
};
