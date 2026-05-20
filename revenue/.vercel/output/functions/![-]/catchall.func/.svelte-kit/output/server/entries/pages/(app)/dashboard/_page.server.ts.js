import { a as getTransactionsForPeriod, g as getRecentTransactions, s as summarize } from "../../../../chunks/transactions.js";
import { c as currentMonthYear, a as formatMonthYear } from "../../../../chunks/date.js";
const load = async ({ locals: { supabase } }) => {
  const { year, month } = currentMonthYear();
  const [monthly, recent] = await Promise.all([
    getTransactionsForPeriod(supabase, year, month),
    getRecentTransactions(supabase, 6)
  ]);
  const summary = summarize(monthly);
  return {
    summary,
    recent,
    monthly,
    periodLabel: formatMonthYear(year, month),
    year,
    month
  };
};
export {
  load
};
