import { a as getTransactionsForPeriod } from "../../../../chunks/transactions.js";
function monthlyTrends(transactions, months = 6) {
  const now = /* @__PURE__ */ new Date();
  const results = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const label = d.toLocaleString(void 0, { month: "short", year: "2-digit" });
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      const td = new Date(t.created_at);
      if (td.getFullYear() !== year || td.getMonth() !== month) continue;
      const amt = Number(t.amount);
      if (t.type === "income") income += amt;
      else expense += amt;
    }
    results.push({ label, income, expense });
  }
  return results;
}
const load = async ({ locals: { supabase } }) => {
  const now = /* @__PURE__ */ new Date();
  const loads = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    loads.push(getTransactionsForPeriod(supabase, d.getFullYear(), d.getMonth() + 1));
  }
  const months = await Promise.all(loads);
  const all = months.flat();
  const trends = monthlyTrends(all, 6);
  return { trends, transactions: all };
};
export {
  load
};
