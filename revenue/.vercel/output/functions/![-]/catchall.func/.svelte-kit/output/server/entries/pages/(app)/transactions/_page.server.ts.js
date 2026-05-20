import { l as listTransactions } from "../../../../chunks/transactions.js";
import { D as DEFAULT_CATEGORIES } from "../../../../chunks/constants.js";
import { c as currentMonthYear } from "../../../../chunks/date.js";
const load = async ({ locals: { supabase }, url }) => {
  const { year: defaultYear, month: defaultMonth } = currentMonthYear();
  const search = url.searchParams.get("search") ?? "";
  const category = url.searchParams.get("category") ?? "";
  const type = url.searchParams.get("type") ?? "";
  const year = Number(url.searchParams.get("year")) || defaultYear;
  const month = Number(url.searchParams.get("month")) || defaultMonth;
  const page = Number(url.searchParams.get("page")) || 1;
  const sort = url.searchParams.get("sort") === "asc" ? "asc" : "desc";
  const { transactions, total } = await listTransactions(
    supabase,
    { search, category, type, year, month },
    page,
    sort
  );
  return {
    transactions,
    total,
    filters: { search, category, type, year, month, page, sort },
    categories: DEFAULT_CATEGORIES
  };
};
export {
  load
};
