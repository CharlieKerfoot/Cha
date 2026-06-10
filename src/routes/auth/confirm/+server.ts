import { redirect } from '@sveltejs/kit';
import type { EmailOtpType } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  const next = url.searchParams.get('next') ?? '/onboarding';

  // PKCE flow: Supabase's default email template verifies on their server,
  // then redirects here with ?code= (requires the same browser that asked).
  const code = url.searchParams.get('code');
  if (code) {
    const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(303, next);
  }

  // token_hash flow: customized email template linking straight here.
  // Works in any browser — the recommended setup (see README).
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType | null;
  if (token_hash && type) {
    const { error } = await locals.supabase.auth.verifyOtp({ token_hash, type });
    if (!error) redirect(303, next);
  }

  redirect(303, '/login?error=link');
};
