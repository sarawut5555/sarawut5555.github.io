import { p as public_env } from "./shared-server.js";
const currency = public_env.PUBLIC_CURRENCY ?? "USD";
function formatCurrency(amount) {
  return new Intl.NumberFormat(void 0, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
export {
  formatCurrency as f
};
