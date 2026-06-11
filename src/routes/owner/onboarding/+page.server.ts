import { fail, redirect } from '@sveltejs/kit';
import { nearestNeighborhood } from '$lib/geo';
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
    const address = String(form.get('address') ?? '').trim();
    const vibe = String(form.get('vibe') ?? '').trim();
    const contact = String(form.get('contact') ?? '').trim();
    const websiteRaw = String(form.get('website') ?? '').trim();
    const directoryId = String(form.get('directory_id') ?? '').trim() || null;
    const lat = Number(form.get('lat'));
    const lng = Number(form.get('lng'));

    if (!name) return fail(400, { error: "What's your shop called?" });
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 36.5 || lat > 39 || lng < -123.5 || lng > -121) {
      return fail(400, { error: 'Drop the pin on your shop.' });
    }

    let website = websiteRaw;
    if (website && !/^https?:\/\//i.test(website)) {
      website = `https://${website}`;
    }

    const row: Record<string, unknown> = {
      owner_id: locals.user!.id,
      name,
      neighborhood: nearestNeighborhood(lat, lng),
      address,
      lat,
      lng,
      vibe,
      website,
      contact
    };
    if (directoryId) row.directory_id = directoryId;

    let { error } = await locals.supabase.from('shops').insert(row);
    // Tolerate a database that hasn't run migration-4 yet (no directory_id column).
    if (error && error.code === 'PGRST204' && row.directory_id) {
      delete row.directory_id;
      ({ error } = await locals.supabase.from('shops').insert(row));
    }
    if (error) {
      if (error.message.includes('shops_directory_id_unique') || error.code === '23505') {
        return fail(409, {
          error:
            'That shop has already been claimed on cha. If it’s yours, email hello@cha.coffee and we’ll sort it out.'
        });
      }
      return fail(500, { error: error.message });
    }

    redirect(303, '/owner/jobs/new?first=1');
  }
};
