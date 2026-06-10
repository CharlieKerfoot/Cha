import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  if (!env.PUBLIC_SUPABASE_URL || !env.PUBLIC_SUPABASE_ANON_KEY) {
    return new Response(
      'cha is almost live — set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY, then redeploy.',
      { status: 503, headers: { 'content-type': 'text/plain' } }
    );
  }

  event.locals.supabase = createServerClient(
    env.PUBLIC_SUPABASE_URL ?? '',
    env.PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' });
          });
        }
      }
    }
  );

  event.locals.safeGetSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    if (!session) return { session: null, user: null };
    // getUser() validates the JWT against the auth server
    const {
      data: { user },
      error
    } = await event.locals.supabase.auth.getUser();
    if (error || !user) return { session: null, user: null };
    return { session, user };
  };

  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;
  event.locals.profile = null;

  if (user) {
    const { data: profile } = await event.locals.supabase
      .from('profiles')
      .select('id, role, display_name')
      .eq('id', user.id)
      .maybeSingle();
    event.locals.profile = profile;
  }

  // Route guards
  const path = event.url.pathname;
  const needsAuth = path.startsWith('/seeker') || path.startsWith('/owner') || path === '/onboarding';
  if (needsAuth && !user) {
    redirect(303, `/login?next=${encodeURIComponent(path)}`);
  }
  if (user && !event.locals.profile && needsAuth && path !== '/onboarding') {
    redirect(303, '/onboarding');
  }

  return resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-range' || name === 'x-supabase-api-version'
  });
};
