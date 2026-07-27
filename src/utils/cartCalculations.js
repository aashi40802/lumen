import { TAX_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING, MIN_QTY, MAX_QTY } from "./constants.js";
import { toCents, fromCents } from "./currency.js";

// Clamp any quantity input to the allowed integer range.
export function clampQuantity(qty) {
  const n = Math.floor(Number(qty));
  if (!Number.isFinite(n)) return MIN_QTY;
  return Math.min(MAX_QTY, Math.max(MIN_QTY, n));
}

// Total number of items (sum of quantities), used for the cart badge.
export function totalItems(items) {
  return items.reduce((sum, it) => sum + it.quantity, 0);
}

// Subtotal computed in integer cents, then converted back to dollars.
export function subtotal(items) {
  const cents = items.reduce((sum, it) => sum + toCents(it.price) * it.quantity, 0);
  return fromCents(cents);
}

// Shipping: free above a threshold, otherwise the chosen method's price.
export function shippingCost(sub, methodId = "standard") {
  if (sub === 0) return 0;
  if (sub >= FREE_SHIPPING_THRESHOLD && methodId === "standard") return 0;
  return (SHIPPING[methodId] || SHIPPING.standard).price;
}

export function taxAmount(sub) {
  return fromCents(Math.round(toCents(sub) * TAX_RATE));
}

// Full breakdown used by the cart + checkout summaries.
export function cartTotals(items, methodId = "standard") {
  const sub = subtotal(items);
  const ship = shippingCost(sub, methodId);
  const tax = taxAmount(sub);
  const total = fromCents(toCents(sub) + toCents(ship) + toCents(tax));
  return { subtotal: sub, shipping: ship, tax, total, count: totalItems(items) };
}
