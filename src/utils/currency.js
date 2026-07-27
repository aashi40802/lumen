import { CURRENCY } from "./constants.js";

// A single shared formatter (Intl.NumberFormat) for consistent en-US currency.
const formatter = new Intl.NumberFormat(CURRENCY.locale, {
  style: "currency",
  currency: CURRENCY.code,
});

export function formatCurrency(value) {
  const n = Number(value);
  return formatter.format(Number.isFinite(n) ? n : 0);
}

// Round to cents to avoid floating-point drift when summing money.
export function toCents(value) {
  return Math.round((Number(value) || 0) * 100);
}
export function fromCents(cents) {
  return cents / 100;
}
