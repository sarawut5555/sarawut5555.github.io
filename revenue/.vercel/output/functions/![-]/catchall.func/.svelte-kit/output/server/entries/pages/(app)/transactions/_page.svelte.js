import { y as escape_html, k as attr_class, j as attr, x as ensure_array_like, u as derived } from "../../../../chunks/renderer.js";
import { g as goto } from "../../../../chunks/client.js";
import "clsx";
import { E as EmptyState } from "../../../../chunks/EmptyState.js";
import { I as INCOME_CATEGORIES, E as EXPENSE_CATEGORIES, P as PAGE_SIZE } from "../../../../chunks/constants.js";
import { t as toISODateTimeLocal, f as formatDisplayDate } from "../../../../chunks/date.js";
import { f as formatCurrency } from "../../../../chunks/currency.js";
import "@supabase/ssr";
import "../../../../chunks/toast.js";
function Modal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open, title, children } = $$props;
    if (open) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" role="presentation"><div class="glass w-full max-w-lg animate-in p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="mb-5 flex items-center justify-between"><h2 id="modal-title" class="text-lg font-semibold">${escape_html(title)}</h2> <button class="rounded-lg p-1 text-slate-500 transition hover:bg-slate-200/60 dark:hover:bg-slate-700" aria-label="Close"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div> `);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function TransactionForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { transaction = null, loading = false } = $$props;
    let type = transaction?.type ?? "expense";
    let amount = transaction ? String(transaction.amount) : "";
    let category = transaction?.category ?? "Food";
    let note = transaction?.note ?? "";
    let created_at = transaction ? toISODateTimeLocal(new Date(transaction.created_at)) : toISODateTimeLocal(/* @__PURE__ */ new Date());
    let errors = {};
    const categoryList = derived(() => type === "income" ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES]);
    $$renderer2.push(`<form class="space-y-4"><div class="grid grid-cols-2 gap-2 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/80"><button type="button"${attr_class(`rounded-lg py-2 text-sm font-semibold transition ${type === "expense" ? "bg-white shadow dark:bg-slate-700" : "text-slate-500"}`)}>Expense</button> <button type="button"${attr_class(`rounded-lg py-2 text-sm font-semibold transition ${type === "income" ? "bg-white shadow dark:bg-slate-700" : "text-slate-500"}`)}>Income</button></div> <div><label class="mb-1 block text-xs font-medium text-slate-500" for="amount">Amount</label> <input id="amount" class="input-field" type="number" step="0.01" min="0"${attr("value", amount)}/> `);
    if (errors.amount) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-rose-500">${escape_html(errors.amount)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label class="mb-1 block text-xs font-medium text-slate-500" for="category">Category</label> `);
    $$renderer2.select({ id: "category", class: "input-field", value: category }, ($$renderer3) => {
      $$renderer3.push(`<!--[-->`);
      const each_array = ensure_array_like(categoryList());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cat = each_array[$$index];
        $$renderer3.option({ value: cat }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(cat)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</div> <div><label class="mb-1 block text-xs font-medium text-slate-500" for="note">Note</label> <textarea id="note" class="input-field min-h-[80px]" placeholder="Optional details">`);
    const $$body = escape_html(note);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div><label class="mb-1 block text-xs font-medium text-slate-500" for="created_at">Date &amp; time</label> <input id="created_at" class="input-field" type="datetime-local"${attr("value", created_at)}/> `);
    if (errors.created_at) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-xs text-rose-500">${escape_html(errors.created_at)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <button class="btn-primary w-full" type="submit"${attr("disabled", loading, true)}>${escape_html(loading ? "Saving…" : transaction ? "Update transaction" : "Add transaction")}</button></form>`);
  });
}
function TransactionTable($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { transactions } = $$props;
    $$renderer2.push(`<div class="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800"><table class="w-full min-w-[640px] text-left text-sm"><thead class="border-b border-slate-200/60 bg-slate-50/80 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/50"><tr><th class="px-4 py-3">Date</th><th class="px-4 py-3">Type</th><th class="px-4 py-3">Category</th><th class="px-4 py-3">Note</th><th class="px-4 py-3 text-right">Amount</th><th class="px-4 py-3 text-right">Actions</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(transactions);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let t = each_array[$$index];
      $$renderer2.push(`<tr class="border-b border-slate-100/80 transition hover:bg-white/50 dark:border-slate-800/80 dark:hover:bg-slate-800/30"><td class="px-4 py-3 whitespace-nowrap">${escape_html(formatDisplayDate(t.created_at))}</td><td class="px-4 py-3 capitalize"><span${attr_class(`rounded-full px-2 py-0.5 text-xs font-medium ${t.type === "income" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`)}>${escape_html(t.type)}</span></td><td class="px-4 py-3">${escape_html(t.category)}</td><td class="max-w-[200px] truncate px-4 py-3 text-slate-500">${escape_html(t.note ?? "—")}</td><td class="px-4 py-3 text-right font-semibold">${escape_html(t.type === "income" ? "+" : "-")}${escape_html(formatCurrency(Number(t.amount)))}</td><td class="px-4 py-3 text-right"><button class="mr-2 text-indigo-600 hover:underline">Edit</button> <button class="text-rose-600 hover:underline">Delete</button></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let modalOpen = false;
    let editing = null;
    let saving = false;
    let exporting = false;
    let search = data.filters.search;
    let category = data.filters.category;
    let type = data.filters.type;
    let year = data.filters.year;
    let month = data.filters.month;
    let sort = data.filters.sort;
    const totalPages = derived(() => Math.max(1, Math.ceil(data.total / PAGE_SIZE)));
    function buildUrl(overrides = {}) {
      const params = new URLSearchParams();
      const f = {
        ...data.filters,
        search,
        category,
        type,
        year,
        month,
        sort,
        ...overrides
      };
      if (f.search) params.set("search", f.search);
      if (f.category) params.set("category", f.category);
      if (f.type) params.set("type", f.type);
      params.set("year", String(f.year));
      params.set("month", String(f.month));
      params.set("sort", f.sort);
      if (f.page && f.page > 1) params.set("page", String(f.page));
      return `/transactions?${params}`;
    }
    function applyFilters(pageNum = 1) {
      goto(buildUrl({ page: pageNum }));
    }
    function openCreate() {
      editing = null;
      modalOpen = true;
    }
    $$renderer2.push(`<div class="space-y-6"><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold">Transactions</h1> <p class="text-sm text-slate-500">Manage income and expenses</p></div> <div class="flex flex-wrap gap-2"><button class="btn-secondary"${attr("disabled", exporting, true)}>${escape_html("Export CSV")}</button> <button class="btn-primary">+ Add transaction</button></div></div> <div class="glass-card grid gap-3 sm:grid-cols-2 lg:grid-cols-6"><input class="input-field lg:col-span-2" placeholder="Search notes or categories…"${attr("value", search)}/> `);
    $$renderer2.select({ class: "input-field", value: category }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`All categories`);
      });
      $$renderer3.push(`<!--[-->`);
      const each_array = ensure_array_like(data.categories);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let cat = each_array[$$index];
        $$renderer3.option({ value: cat }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(cat)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(` `);
    $$renderer2.select({ class: "input-field", value: type }, ($$renderer3) => {
      $$renderer3.option({ value: "" }, ($$renderer4) => {
        $$renderer4.push(`All types`);
      });
      $$renderer3.option({ value: "income" }, ($$renderer4) => {
        $$renderer4.push(`Income`);
      });
      $$renderer3.option({ value: "expense" }, ($$renderer4) => {
        $$renderer4.push(`Expense`);
      });
    });
    $$renderer2.push(` <input class="input-field" type="number"${attr("value", year)} min="2020" max="2100"/> <input class="input-field" type="number"${attr("value", month)} min="1" max="12"/> <button class="btn-primary">Apply</button></div> <div class="flex items-center justify-between text-sm"><label class="flex items-center gap-2">Sort `);
    $$renderer2.select(
      {
        class: "input-field !w-auto py-1",
        value: sort,
        onchange: () => applyFilters(data.filters.page)
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "desc" }, ($$renderer4) => {
          $$renderer4.push(`Newest first`);
        });
        $$renderer3.option({ value: "asc" }, ($$renderer4) => {
          $$renderer4.push(`Oldest first`);
        });
      }
    );
    $$renderer2.push(`</label> <p class="text-slate-500">${escape_html(data.total)} total</p></div> `);
    if (data.transactions.length) {
      $$renderer2.push("<!--[0-->");
      TransactionTable($$renderer2, {
        transactions: data.transactions
      });
      $$renderer2.push(`<!----> <div class="flex justify-center gap-2">`);
      if (data.filters.page > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a class="btn-secondary"${attr("href", buildUrl({ page: data.filters.page - 1 }))}>Previous</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span class="flex items-center px-3 text-sm text-slate-500">Page ${escape_html(data.filters.page)} of ${escape_html(totalPages())}</span> `);
      if (data.filters.page < totalPages()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a class="btn-secondary"${attr("href", buildUrl({ page: data.filters.page + 1 }))}>Next</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      EmptyState($$renderer2, {
        title: "No transactions found",
        description: "Try adjusting filters or add your first transaction.",
        actionLabel: "Add transaction",
        onaction: openCreate
      });
    }
    $$renderer2.push(`<!--]--></div> `);
    Modal($$renderer2, {
      open: modalOpen,
      title: editing ? "Edit transaction" : "Add transaction",
      children: ($$renderer3) => {
        TransactionForm($$renderer3, {
          transaction: editing,
          loading: saving
        });
      }
    });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
