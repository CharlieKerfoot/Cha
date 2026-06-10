import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { data: shop } = await locals.supabase
    .from('shops')
    .select('id, name')
    .eq('owner_id', locals.user!.id)
    .maybeSingle();
  if (!shop) redirect(303, '/owner/onboarding');
  return { shop, first: url.searchParams.has('first') };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { data: shop } = await locals.supabase
      .from('shops')
      .select('id')
      .eq('owner_id', locals.user!.id)
      .maybeSingle();
    if (!shop) redirect(303, '/owner/onboarding');

    const form = await request.formData();
    const title = String(form.get('title') ?? 'Barista').trim() || 'Barista';
    const payMin = Number(form.get('pay_min')) || null;
    const payMax = Number(form.get('pay_max')) || null;
    const shifts = form.getAll('shifts').map(String);
    const description = String(form.get('description') ?? '').trim();

    if (shifts.length === 0) {
      return fail(400, { error: 'Pick the shifts you need covered.' });
    }

    const { error } = await locals.supabase.from('jobs').insert({
      shop_id: shop.id,
      title,
      pay_min: payMin,
      pay_max: payMax,
      shifts,
      description
    });
    if (error) return fail(500, { error: error.message });

    redirect(303, '/owner');
  }
};
