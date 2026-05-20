import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

/** Browser Supabase client for client-side auth actions (login/logout). */
export function createSupabaseBrowserClient() {
	return createBrowserClient(env.PUBLIC_SUPABASE_URL ?? '', env.PUBLIC_SUPABASE_ANON_KEY ?? '');
}
