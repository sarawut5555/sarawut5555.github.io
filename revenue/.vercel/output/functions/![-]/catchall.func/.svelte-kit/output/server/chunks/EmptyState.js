import { y as escape_html } from "./renderer.js";
import "clsx";
function EmptyState($$renderer, $$props) {
  let { title, description, actionLabel, onaction } = $$props;
  $$renderer.push(`<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 px-6 py-16 text-center dark:border-slate-700"><div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"><svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 14l6-6m-5.5 8.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <h3 class="text-lg font-semibold">${escape_html(title)}</h3> <p class="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">${escape_html(description)}</p> `);
  if (actionLabel && onaction) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<button class="btn-primary mt-6">${escape_html(actionLabel)}</button>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
export {
  EmptyState as E
};
