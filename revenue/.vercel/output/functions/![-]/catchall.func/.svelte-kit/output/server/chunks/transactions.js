import { P as PAGE_SIZE } from "./constants.js";
import { s as startOfMonth, e as endOfMonth } from "./date.js";
function applyFilters(query, filters) {
  let q = query;
  if (filters.type) q = q.eq("type", filters.type);
  if (filters.category) q = q.eq("category", filters.category);
  if (filters.year && filters.month) {
    const start = startOfMonth(filters.year, filters.month).toISOString();
    const end = endOfMonth(filters.year, filters.month).toISOString();
    q = q.gte("created_at", start).lte("created_at", end);
  }
  if (filters.search?.trim()) {
    const term = filters.search.trim().replace(/[%_,]/g, "");
    if (term) {
      q = q.or(`note.ilike.%${term}%,category.ilike.%${term}%`);
    }
  }
  return q;
}
async function listTransactions(supabase, filters = {}, page = 1, sort = "desc") {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  let query = supabase.from("transactions").select("*", { count: "exact" }).order("created_at", { ascending: sort === "asc" }).range(from, to);
  query = applyFilters(query, filters);
  const { data, error, count } = await query;
  if (error) throw error;
  return {
    transactions: data ?? [],
    total: count ?? 0
  };
}
async function getRecentTransactions(supabase, limit = 5) {
  const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return data ?? [];
}
async function getTransactionsForPeriod(supabase, year, month) {
  const start = startOfMonth(year, month).toISOString();
  const end = endOfMonth(year, month).toISOString();
  const { data, error } = await supabase.from("transactions").select("*").gte("created_at", start).lte("created_at", end).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
function summarize(transactions) {
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  return { income, expenses, balance: income - expenses };
}
function categoryBreakdown(transactions) {
  const map = /* @__PURE__ */ new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount));
  }
  return [...map.entries()].map(([category, total]) => ({ category, total }));
}
function dailyExpenseSeries(transactions, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const totals = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: 0
  }));
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const d = new Date(t.created_at);
    if (d.getFullYear() !== year || d.getMonth() + 1 !== month) continue;
    totals[d.getDate() - 1].amount += Number(t.amount);
  }
  return totals;
}
export {
  getTransactionsForPeriod as a,
  categoryBreakdown as c,
  dailyExpenseSeries as d,
  getRecentTransactions as g,
  listTransactions as l,
  summarize as s
};
