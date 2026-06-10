import { fail, redirect } from '@sveltejs/kit';
import { scoreJobs } from '$lib/matching';
import type { Job, Seeker } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user!.id;

  const { data: seeker } = await locals.supabase
    .from('seekers')
    .select('*')
    .eq('profile_id', userId)
    .maybeSingle();
  if (!seeker) {
    redirect(303, '/seeker/profile?welcome=1');
  }

  const [{ data: jobs }, { data: applications }] = await Promise.all([
    locals.supabase.from('jobs').select('*, shops(*)').eq('is_open', true),
    locals.supabase.from('applications').select('id, job_id, status').eq('seeker_id', userId)
  ]);

  const matches = scoreJobs(seeker as Seeker, (jobs ?? []) as Job[]);
  const appliedByJob = new Map((applications ?? []).map((a) => [a.job_id, a.status]));

  return {
    seeker: seeker as Seeker,
    matches: matches.map((m) => ({
      ...m,
      appliedStatus: appliedByJob.get(m.job.id) ?? null
    }))
  };
};

export const actions: Actions = {
  apply: async ({ request, locals }) => {
    const userId = locals.user!.id;
    const form = await request.formData();
    const jobId = String(form.get('job_id') ?? '');
    if (!jobId) return fail(400, { error: 'Missing job.' });

    const { error } = await locals.supabase
      .from('applications')
      .insert({ job_id: jobId, seeker_id: userId });
    if (error && !error.message.includes('duplicate')) {
      return fail(500, { error: error.message });
    }
    return { applied: jobId };
  }
};
