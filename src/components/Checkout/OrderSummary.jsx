import React from "react";
import ProductImage from "../ProductImage/ProductImage.jsx";
import { formatCurrency } from "../../utils/currency.js";

// Read-only summary of items + totals shown alongside the checkout form.
export default function OrderSummary({ items, totals }) {
  return (
    <aside className="summary glass" aria-label="Order summary">
      <h2 className="summary__title">Your order</h2>
      <ul className="order-lines">
        {items.map((it) => (
          <li key={it.id} className="order-line">
            <div className="order-line__media">
              <ProductImage src={it.image} alt={it.title} />
              <span className="order-line__qty" aria-hidden="true">{it.quantity}</span>
            </div>
            <span className="order-line__title">{it.title}</span>
            <span className="price order-line__price tabular">{formatCurrency(it.price * it.quantity)}</span>
          </li>
        ))}
      </ul>
      <hr className="divider" />
      <dl className="summary__rows tabular">
        <div className="summary__row"><dt>Subtotal</dt><dd>{formatCurrency(totals.subtotal)}</dd></div>
        <div className="summary__row"><dt>Shipping</dt><dd>{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</dd></div>
        <div className="summary__row"><dt>Estimated tax</dt><dd>{formatCurrency(totals.tax)}</dd></div>
        <hr className="divider" />
        <div className="summary__row summary__row--total"><dt>Total</dt><dd>{formatCurrency(totals.total)}</dd></div>
      </dl>
    </aside>
  );
}
