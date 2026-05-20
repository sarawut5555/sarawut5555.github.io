import "clsx";
import { D as getContext, x as ensure_array_like, j as attr, k as attr_class, a7 as store_get, y as escape_html, ab as unsubscribe_stores } from "../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { N as NAV_ITEMS } from "../../../chunks/constants.js";
import "@supabase/ssr";
import { w as writable } from "../../../chunks/index.js";
import "../../../chunks/toast.js";
function getInitialTheme() {
  return false;
}
const darkMode = writable(getInitialTheme());
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const icons = {
      layout: "M3 12h7V3H3v9zm11 9h7v-9h-7v9zM3 21h7v-7H3v7zm11-9h7V3h-7v9z",
      list: "M4 6h16M4 12h16M4 18h16",
      chart: "M4 19h4v-8H4v8zm6 0h4V5h-4v14zm6 0h4v-5h-4v5z"
    };
    $$renderer2.push(`<nav class="flex flex-col gap-1 p-4"><p class="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</p> <!--[-->`);
    const each_array = ensure_array_like(NAV_ITEMS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<a${attr("href", item.href)}${attr_class(`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith(item.href) ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/60"}`)}><svg class="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path${attr("d", icons[item.icon])}></path></svg> ${escape_html(item.label)}</a>`);
    }
    $$renderer2.push(`<!--]--></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function AppShell($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { userEmail, children } = $$props;
    $$renderer2.push(`<div class="flex min-h-screen"><aside class="glass hidden w-64 shrink-0 border-r lg:flex lg:flex-col"><div class="border-b border-white/10 p-6"><h1 class="text-xl font-bold tracking-tight"><span class="text-indigo-600 dark:text-indigo-400">Flow</span>Finance</h1> <p class="mt-1 text-xs text-slate-500">Personal expense tracker</p></div> `);
    Sidebar($$renderer2);
    $$renderer2.push(`<!----> <div class="mt-auto border-t border-white/10 p-4"><p class="truncate px-3 text-xs text-slate-500">${escape_html(userEmail)}</p></div></aside> <div class="flex min-w-0 flex-1 flex-col"><header class="glass sticky top-0 z-40 flex items-center justify-between gap-4 border-b px-4 py-3 lg:px-8"><button class="rounded-lg p-2 lg:hidden" aria-label="Toggle menu"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button> <div class="flex flex-1 items-center justify-end gap-2"><button class="btn-secondary !px-3" aria-label="Toggle dark mode">`);
    if (store_get($$store_subs ??= {}, "$darkMode", darkMode)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`☀️`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`🌙`);
    }
    $$renderer2.push(`<!--]--></button> <button class="btn-secondary">Logout</button></div></header> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <main class="flex-1 p-4 lg:p-8">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></main></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, children } = $$props;
    AppShell($$renderer2, {
      userEmail: data.user?.email,
      children: ($$renderer3) => {
        children($$renderer3);
        $$renderer3.push(`<!---->`);
      }
    });
  });
}
export {
  _layout as default
};
