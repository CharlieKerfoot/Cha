import { fail, redirect } from '@sveltejs/kit';
import { nearestNeighborhood } from '$lib/geo';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const { data: seeker } = await locals.supabase
    .from('seekers')
    .select('*')
    .eq('profile_id', locals.user!.id)
    .maybeSingle();
  return {
    seeker,
    welcome: url.searchParams.has('welcome')
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const user = locals.user!;
    const form = await request.formData();

    const lat = Number(form.get('lat'));
    const lng = Number(form.get('lng'));
    const radius = Number(form.get('radius_miles') ?? 3);
    const shifts = form.getAll('shifts').map(String);
    const bio = String(form.get('bio') ?? '').trim();
    const videoUrl = String(form.get('video_url') ?? '').trim();
    const basics = form.get('basics_confirmed') === 'on';

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 36.5 || lat > 39 || lng < -123.5 || lng > -121) {
      return fail(400, { error: 'Drop your pin somewhere in the Bay Area.' });
    }
    if (shifts.length === 0) {
      return fail(400, { error: 'Select at least one shift you can work.' });
    }
    if (!basics) {
      return fail(400, { error: 'Please confirm the basics to continue.' });
    }

    const { error } = await locals.supabase.from('seekers').upsert({
      profile_id: user.id,
      neighborhood: nearestNeighborhood(lat, lng),
      lat,
      lng,
      radius_miles: Math.min(Math.max(radius, 0.5), 15),
      shifts,
      bio,
      ...(videoUrl ? { video_url: videoUrl } : {}),
      basics_confirmed: basics
    });
    if (error) {
      return fail(500, { error: error.message });
    }

    redirect(303, '/seeker');
  }
};
