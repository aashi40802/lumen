import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Icon from "../components/Icon/Icon.jsx";
import { formatCurrency } from "../utils/currency.js";
import { SHIPPING } from "../utils/constants.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function OrderConfirmationPage() {
  useDocumentTitle("Order confirmed");
  const location = useLocation();
  const order = location.state?.order;

  // Reached directly without placing an order -> go home (prevents replay).
  if (!order) return <Navigate to="/" replace />;

  const eta = SHIPPING[order.method]?.eta || "3–5 business days";

  return (
    <div className="container section">
      <div className="confirm fade-up">
        <div className="confirm__badge" aria-hidden="true"><Icon name="check-circle" size={34} /></div>
        <h1 className="h1">Thank you for your order</h1>
        <p className="muted">
          This is a simulated order — no payment was processed and nothing will be shipped.
        </p>
        <p>Order number <span className="confirm__order">{order.id}</span></p>

        <div className="confirm__panel glass">
          <div className="between mb-4">
            <h2 className="panel__title" style={{ margin: 0 }}>Summary</h2>
            <span className="muted">{order.items.length} items</span>
          </div>
          <dl className="summary__rows tabular">
            <div className="summary__row"><dt>Subtotal</dt><dd>{formatCurrency(order.totals.subtotal)}</dd></div>
            <div className="summary__row"><dt>Shipping ({SHIPPING[order.method]?.label || "Standard"})</dt><dd>{order.totals.shipping === 0 ? "Free" : formatCurrency(order.totals.shipping)}</dd></div>
            <div className="summary__row"><dt>Tax</dt><dd>{formatCurrency(order.totals.tax)}</dd></div>
            <hr className="divider" />
            <div className="summary__row summary__row--total"><dt>Total</dt><dd>{formatCurrency(order.totals.total)}</dd></div>
          </dl>

          <hr className="divider" style={{ margin: "1.1rem 0" }} />
          <h3 className="panel__title">Shipping to</h3>
          <p className="confirm__ship">
            {order.shipTo.name}<br />
            {order.shipTo.address}{order.shipTo.apt ? `, ${order.shipTo.apt}` : ""}<br />
            {order.shipTo.city}, {order.shipTo.region} {order.shipTo.postal}<br />
            {order.shipTo.country}
          </p>
          <p className="muted mt-4">Estimated delivery: {eta}.</p>
        </div>

        <div className="mt-6">
          <Link to="/products" className="btn btn--primary btn--lg">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
