import { createServerClient } from "@supabase/ssr";
import { p as public_env } from "../chunks/shared-server.js";
import { redirect } from "@sveltejs/kit";
function createSupabaseServerClient(cookies) {
  const url = public_env.PUBLIC_SUPABASE_URL ?? "";
  const key = public_env.PUBLIC_SUPABASE_ANON_KEY ?? "";
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, { ...options, path: "/" });
        });
      }
    }
  });
}
const PROTECTED_PREFIXES = ["/dashboard", "/transactions", "/analytics"];
const handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient(event.cookies);
  event.locals.safeGetSession = async () => {
    const {
      data: { session: session2 }
    } = await event.locals.supabase.auth.getSession();
    if (!session2) return { session: null, user: null };
    const {
      data: { user: user2 },
      error
    } = await event.locals.supabase.auth.getUser();
    if (error) return { session: null, user: null };
    return { session: session2, user: user2 };
  };
  const { session, user } = await event.locals.safeGetSession();
  const path = event.url.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  if (isProtected && !session) {
    throw redirect(303, "/login");
  }
  if ((path === "/login" || path === "/signup") && session) {
    throw redirect(303, "/dashboard");
  }
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    }
  });
};
export {
  handle
};
