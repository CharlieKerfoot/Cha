import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: applications } = await locals.supabase
    .from('applications')
    .select(
      'id, status, note, created_at, jobs(id, title, pay_min, pay_max, shifts, shops(id, name, neighborhood, vibe, website, contact))'
    )
    .eq('seeker_id', locals.user!.id)
    .order('created_at', { ascending: false });

  // Contact info is earned at the interview stage; never send it down before then.
  const sanitized = (applications ?? []).map((app) => {
    if (app.status === 'interview' || app.status === 'hired') return app;
    const job = app.jobs as any;
    if (job?.shops) job.shops.contact = '';
    if (app.status !== 'interview') app.note = '';
    return app;
  });

  return { applications: sanitized };
};
