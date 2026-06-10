import { fail, redirect } from '@sveltejs/kit';
import { scoreSeekers } from '$lib/matching';
import type { Application, Job, Seeker, Shop } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: shop } = await locals.supabase
    .from('shops')
    .select('*')
    .eq('owner_id', locals.user!.id)
    .maybeSingle();
  if (!shop) redirect(303, '/owner/onboarding');

  const { data: jobs } = await locals.supabase
    .from('jobs')
    .select('*')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false });

  const jobIds = (jobs ?? []).map((j) => j.id);

  const [{ data: applications }, { data: seekers }] = await Promise.all([
    jobIds.length
      ? locals.supabase
          .from('applications')
          .select('*, seekers(*, profiles(id, display_name))')
          .in('job_id', jobIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [] as Application[] }),
    locals.supabase.from('seekers').select('*, profiles(id, display_name)')
  ]);

  // Nearby pool: every candidate whose radius reaches this shop, ranked
  // against the union of shifts across the shop's open jobs.
  const neededShifts = [...new Set((jobs ?? []).filter((j) => j.is_open).flatMap((j) => j.shifts))];
  const appliedIds = new Set((applications ?? []).map((a: any) => a.seeker_id));
  const pool = scoreSeekers(
    shop as Shop,
    neededShifts,
    ((seekers ?? []) as Seeker[]).filter((s) => !appliedIds.has(s.profile_id))
  );

  return {
    shop: shop as Shop,
    jobs: (jobs ?? []) as Job[],
    applications: (applications ?? []) as (Application & { seekers: Seeker })[],
    pool
  };
};

export const actions: Actions = {
  status: async ({ request, locals }) => {
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    const status = String(form.get('status') ?? '');
    if (!['new', 'seen', 'interview', 'hired', 'passed'].includes(status)) {
      return fail(400, { error: 'Bad status.' });
    }
    const { error } = await locals.supabase.from('applications').update({ status }).eq('id', id);
    if (error) return fail(500, { error: error.message });
    return { ok: true };
  }
};
