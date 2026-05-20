import { x as ensure_array_like, a7 as store_get, k as attr_class, a8 as stringify, y as escape_html, ab as unsubscribe_stores, J as head } from "../../chunks/renderer.js";
import { t as toasts } from "../../chunks/toast.js";
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const typeStyles = {
      success: "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      error: "border-rose-400/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
      info: "border-indigo-400/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
    };
    $$renderer2.push(`<div class="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`pointer-events-auto glass flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium ${stringify(typeStyles[toast.type])}`)} role="status"><span>${escape_html(toast.message)}</span> <button class="opacity-60 hover:opacity-100" aria-label="Dismiss">×</button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    head("12qhfyh", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/> <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>`);
    });
    children($$renderer2);
    $$renderer2.push(`<!----> `);
    Toast($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
