const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Salary",
  "Investment",
  "Entertainment",
  "Other"
];
const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other"
];
const INCOME_CATEGORIES = ["Salary", "Investment", "Other"];
const PAGE_SIZE = 10;
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "layout" },
  { href: "/transactions", label: "Transactions", icon: "list" },
  { href: "/analytics", label: "Analytics", icon: "chart" }
];
export {
  DEFAULT_CATEGORIES as D,
  EXPENSE_CATEGORIES as E,
  INCOME_CATEGORIES as I,
  NAV_ITEMS as N,
  PAGE_SIZE as P
};
