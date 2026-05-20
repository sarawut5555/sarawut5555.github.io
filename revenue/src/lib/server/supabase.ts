import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

/** Server-side Supabase client with cookie-based session (SSR). */
export function createSupabaseServerClient(cookies: Cookies) {
	const url = env.PUBLIC_SUPABASE_URL ?? '';
	const key = env.PUBLIC_SUPABASE_ANON_KEY ?? '';

	return createServerClient(url, key, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}
