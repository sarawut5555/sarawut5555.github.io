import { k as attr_class, y as escape_html, a8 as stringify, x as ensure_array_like, u as derived } from "../../../../chunks/renderer.js";
import { f as formatCurrency } from "../../../../chunks/currency.js";
import { f as formatDisplayDate } from "../../../../chunks/date.js";
import { A as ApexChart } from "../../../../chunks/ApexChart.js";
import { E as EmptyState } from "../../../../chunks/EmptyState.js";
import { c as categoryBreakdown, d as dailyExpenseSeries } from "../../../../chunks/transactions.js";
function StatCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { label, value, trend, variant = "default" } = $$props;
    const accents = {
      default: "from-indigo-500/20 to-transparent text-indigo-600 dark:text-indigo-400",
      income: "from-emerald-500/20 to-transparent text-emerald-600 dark:text-emerald-400",
      expense: "from-rose-500/20 to-transparent text-rose-600 dark:text-rose-400",
      balance: "from-violet-500/20 to-transparent text-violet-600 dark:text-violet-400"
    };
    $$renderer2.push(`<div class="glass-card group"><div${attr_class(`mb-3 h-1 w-12 rounded-full bg-gradient-to-r ${stringify(accents[variant])}`)}></div> <p class="text-sm font-medium text-slate-500 dark:text-slate-400">${escape_html(label)}</p> <p class="mt-1 text-2xl font-bold tracking-tight">${escape_html(formatCurrency(value))}</p> `);
    if (trend) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-2 text-xs text-slate-500">${escape_html(trend)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function TransactionRow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { transaction } = $$props;
    const isIncome = transaction.type === "income";
    $$renderer2.push(`<div class="flex items-center justify-between gap-4 rounded-xl border border-slate-100/80 bg-white/40 px-4 py-3 transition hover:bg-white/70 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-800/50"><div class="min-w-0 flex-1"><p class="truncate font-medium">${escape_html(transaction.category)}</p> <p class="truncate text-xs text-slate-500">${escape_html(formatDisplayDate(transaction.created_at))} `);
    if (transaction.note) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`· ${escape_html(transaction.note)}`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></p></div> <span${attr_class(`shrink-0 text-sm font-semibold ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`)}>${escape_html(isIncome ? "+" : "-")}${escape_html(formatCurrency(Number(transaction.amount)))}</span></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const breakdown = derived(() => categoryBreakdown(data.monthly));
    const daily = derived(() => dailyExpenseSeries(data.monthly, data.year, data.month));
    const expenseChartOptions = derived(() => ({
      chart: {
        type: "area",
        toolbar: { show: false },
        fontFamily: "inherit"
      },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 }
      },
      colors: ["#f43f5e"],
      dataLabels: { enabled: false },
      xaxis: { categories: daily().map((d) => String(d.day)) },
      yaxis: { labels: { formatter: (v) => formatCurrency(Number(v)) } },
      grid: { borderColor: "rgba(148,163,184,0.2)" },
      series: [{ name: "Expenses", data: daily().map((d) => d.amount) }]
    }));
    const categoryChartOptions = derived(() => ({
      chart: { type: "donut", fontFamily: "inherit" },
      labels: breakdown().map((b) => b.category),
      series: breakdown().map((b) => b.total),
      legend: { position: "bottom" },
      colors: [
        "#6366f1",
        "#8b5cf6",
        "#ec4899",
        "#f43f5e",
        "#f59e0b",
        "#10b981",
        "#06b6d4",
        "#94a3b8"
      ]
    }));
    $$renderer2.push(`<div class="space-y-8"><div><h1 class="text-2xl font-bold tracking-tight">Dashboard</h1> <p class="text-sm text-slate-500">${escape_html(data.periodLabel)} overview</p></div> <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">`);
    StatCard($$renderer2, {
      label: "Total income",
      value: data.summary.income,
      variant: "income"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Total expenses",
      value: data.summary.expenses,
      variant: "expense"
    });
    $$renderer2.push(`<!----> `);
    StatCard($$renderer2, {
      label: "Remaining balance",
      value: data.summary.balance,
      variant: "balance",
      trend: data.summary.balance >= 0 ? "On track this month" : "Spending exceeds income"
    });
    $$renderer2.push(`<!----></div> <div class="grid gap-6 lg:grid-cols-2"><div class="glass-card"><h2 class="mb-4 font-semibold">Daily expenses</h2> `);
    if (data.summary.expenses > 0) {
      $$renderer2.push("<!--[0-->");
      ApexChart($$renderer2, { options: expenseChartOptions() });
    } else {
      $$renderer2.push("<!--[-1-->");
      EmptyState($$renderer2, {
        title: "No expenses yet",
        description: "Add an expense to see your daily chart."
      });
    }
    $$renderer2.push(`<!--]--></div> <div class="glass-card"><h2 class="mb-4 font-semibold">Spending by category</h2> `);
    if (breakdown().length) {
      $$renderer2.push("<!--[0-->");
      ApexChart($$renderer2, { options: categoryChartOptions(), height: 300 });
    } else {
      $$renderer2.push("<!--[-1-->");
      EmptyState($$renderer2, {
        title: "No category data",
        description: "Expenses will appear grouped by category."
      });
    }
    $$renderer2.push(`<!--]--></div></div> <div class="glass-card"><div class="mb-4 flex items-center justify-between"><h2 class="font-semibold">Recent transactions</h2> <a href="/transactions" class="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">View all</a></div> `);
    if (data.recent.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="space-y-2"><!--[-->`);
      const each_array = ensure_array_like(data.recent);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let t = each_array[$$index];
        TransactionRow($$renderer2, { transaction: t });
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      EmptyState($$renderer2, {
        title: "No transactions",
        description: "Your latest income and expenses will show up here.",
        actionLabel: "Add transaction",
        onaction: () => window.location.href = "/transactions"
      });
    }
    $$renderer2.push(`<!--]--></div> <div class="glass-card"><h2 class="mb-2 font-semibold">Monthly summary</h2> <p class="text-sm text-slate-500">Net flow: <span class="font-semibold text-slate-800 dark:text-slate-200">${escape_html(formatCurrency(data.summary.balance))}</span> (${escape_html(formatCurrency(data.summary.income))} in · ${escape_html(formatCurrency(data.summary.expenses))} out)</p></div></div>`);
  });
}
export {
  _page as default
};
