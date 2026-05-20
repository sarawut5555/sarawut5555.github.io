import { u as derived } from "../../../../chunks/renderer.js";
import { A as ApexChart } from "../../../../chunks/ApexChart.js";
import { c as categoryBreakdown } from "../../../../chunks/transactions.js";
import { f as formatCurrency } from "../../../../chunks/currency.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const breakdown = derived(() => categoryBreakdown(data.transactions));
    const trendOptions = derived(() => ({
      chart: {
        type: "bar",
        stacked: false,
        toolbar: { show: false },
        fontFamily: "inherit"
      },
      plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
      colors: ["#10b981", "#f43f5e"],
      xaxis: { categories: data.trends.map((t) => t.label) },
      yaxis: { labels: { formatter: (v) => formatCurrency(Number(v)) } },
      legend: { position: "top" },
      grid: { borderColor: "rgba(148,163,184,0.2)" },
      series: [
        { name: "Income", data: data.trends.map((t) => t.income) },
        { name: "Expenses", data: data.trends.map((t) => t.expense) }
      ]
    }));
    const compareOptions = derived(() => ({
      chart: {
        type: "line",
        toolbar: { show: false },
        fontFamily: "inherit"
      },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#10b981", "#f43f5e"],
      xaxis: { categories: data.trends.map((t) => t.label) },
      yaxis: { labels: { formatter: (v) => formatCurrency(Number(v)) } },
      legend: { position: "top" },
      series: [
        { name: "Income", data: data.trends.map((t) => t.income) },
        { name: "Expenses", data: data.trends.map((t) => t.expense) }
      ]
    }));
    const categoryOptions = derived(() => ({
      chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
      plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
      colors: ["#6366f1"],
      xaxis: { categories: breakdown().map((b) => b.category) },
      series: [{ name: "Spent", data: breakdown().map((b) => b.total) }]
    }));
    $$renderer2.push(`<div class="space-y-8"><div><h1 class="text-2xl font-bold">Analytics</h1> <p class="text-sm text-slate-500">Income, expenses, and trends over the last 6 months</p></div> <div class="glass-card"><h2 class="mb-4 font-semibold">Income vs expenses</h2> `);
    ApexChart($$renderer2, { options: compareOptions(), height: 320 });
    $$renderer2.push(`<!----></div> <div class="grid gap-6 lg:grid-cols-2"><div class="glass-card"><h2 class="mb-4 font-semibold">Monthly comparison</h2> `);
    ApexChart($$renderer2, { options: trendOptions() });
    $$renderer2.push(`<!----></div> <div class="glass-card"><h2 class="mb-4 font-semibold">Category breakdown (all loaded data)</h2> `);
    if (breakdown().length) {
      $$renderer2.push("<!--[0-->");
      ApexChart($$renderer2, { options: categoryOptions() });
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="text-sm text-slate-500">No expense data to display.</p>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  _page as default
};
