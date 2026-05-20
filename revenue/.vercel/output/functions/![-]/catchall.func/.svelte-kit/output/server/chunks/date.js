function startOfMonth(year, month) {
  return new Date(year, month - 1, 1, 0, 0, 0, 0);
}
function endOfMonth(year, month) {
  return new Date(year, month, 0, 23, 59, 59, 999);
}
function toISODateTimeLocal(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function formatDisplayDate(iso) {
  return new Intl.DateTimeFormat(void 0, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(iso));
}
function formatMonthYear(year, month) {
  return new Intl.DateTimeFormat(void 0, { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1)
  );
}
function currentMonthYear() {
  const now = /* @__PURE__ */ new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}
export {
  formatMonthYear as a,
  currentMonthYear as c,
  endOfMonth as e,
  formatDisplayDate as f,
  startOfMonth as s,
  toISODateTimeLocal as t
};
