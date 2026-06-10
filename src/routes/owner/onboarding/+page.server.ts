import { fail, redirect } from '@sveltejs/kit';
import { NEIGHBORHOODS } from '$lib/geo';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: shop } = await locals.supabase
    .from('shops')
    .select('id')
    .eq('owner_id', locals.user!.id)
    .maybeSingle();
  if (shop) redirect(303, '/owner');
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim();
    const neighborhood = String(form.get('neighborhood') ?? '');
    const address = String(form.get('address') ?? '').trim();
    const vibe = String(form.get('vibe') ?? '').trim();

    const coords = NEIGHBORHOODS[neighborhood];
    if (!name) return fail(400, { error: "What's your shop called?" });
    if (!coords) return fail(400, { error: 'Pick your neighborhood.' });

    const { error } = await locals.supabase.from('shops').insert({
      owner_id: locals.user!.id,
      name,
      neighborhood,
      address,
      lat: coords.lat,
      lng: coords.lng,
      vibe
    });
    if (error) return fail(500, { error: error.message });

    redirect(303, '/owner/jobs/new?first=1');
  }
};
