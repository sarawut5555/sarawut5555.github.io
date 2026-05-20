import { redirect } from "@sveltejs/kit";
const load = async ({ locals: { safeGetSession } }) => {
  const { session, user } = await safeGetSession();
  if (!session) throw redirect(303, "/login");
  return { session, user };
};
export {
  load
};
