import { j as attr, y as escape_html } from "../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import "@supabase/ssr";
import "../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    let loading = false;
    $$renderer2.push(`<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950"><div class="glass w-full max-w-md p-8"><div class="mb-8 text-center"><h1 class="text-2xl font-bold">Create account</h1> <p class="mt-2 text-sm text-slate-500">Start tracking your personal finances</p></div> <form class="space-y-4"><div><label class="mb-1 block text-xs font-medium text-slate-500" for="email">Email</label> <input id="email" class="input-field" type="email" required=""${attr("value", email)}/></div> <div><label class="mb-1 block text-xs font-medium text-slate-500" for="password">Password</label> <input id="password" class="input-field" type="password" required="" minlength="6"${attr("value", password)}/></div> <button class="btn-primary w-full" type="submit"${attr("disabled", loading, true)}>${escape_html("Sign up")}</button></form> <p class="mt-6 text-center text-sm text-slate-500">Already have an account? <a href="/login" class="font-semibold text-indigo-600 hover:underline">Sign in</a></p></div></div>`);
  });
}
export {
  _page as default
};
