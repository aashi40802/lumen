import React from "react";
import { formatCurrency } from "../../utils/currency.js";
import { FREE_SHIPPING_THRESHOLD } from "../../utils/constants.js";

/* Order totals panel, reused by the cart and (read-only) by checkout.
   `children` renders the primary action(s) for the given context. */
export default function CartSummary({ totals, note, children }) {
  return (
    <aside className="summary glass" aria-label="Order summary">
      <h2 className="summary__title">Order summary</h2>
      <dl className="summary__rows tabular">
        <div className="summary__row">
          <dt>Subtotal</dt>
          <dd>{formatCurrency(totals.subtotal)}</dd>
        </div>
        <div className="summary__row">
          <dt>Shipping</dt>
          <dd>{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</dd>
        </div>
        <div className="summary__row">
          <dt>Estimated tax</dt>
          <dd>{formatCurrency(totals.tax)}</dd>
        </div>
        <hr className="divider" />
        <div className="summary__row summary__row--total">
          <dt>Total</dt>
          <dd>{formatCurrency(totals.total)}</dd>
        </div>
      </dl>

      {totals.subtotal > 0 && totals.subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="summary__hint muted">
          Add {formatCurrency(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for free standard shipping.
        </p>
      )}

      {note && <p className="summary__note muted">{note}</p>}
      {children && <div className="summary__actions">{children}</div>}
    </aside>
  );
}
