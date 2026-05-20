import { redirect } from "@sveltejs/kit";
const load = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  throw redirect(303, session ? "/dashboard" : "/login");
};
export {
  load
};
