import React, { useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CheckoutForm from "../components/Checkout/CheckoutForm.jsx";
import OrderSummary from "../components/Checkout/OrderSummary.jsx";
import { useCart } from "../contexts/CartContext.js";
import { useAuth } from "../contexts/AuthContext.js";
import { useToast } from "../contexts/ToastContext.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { cartTotals } from "../utils/cartCalculations.js";
import { STORAGE_KEYS } from "../utils/constants.js";
import { readJSON, writeJSON } from "../services/storage.js";
import "../components/Checkout/Checkout.css";
import "../components/Cart/Cart.css";

export default function CheckoutPage() {
  useDocumentTitle("Checkout");
  const { items, clear } = useCart();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [method, setMethod] = useState("standard");
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false); // guards against duplicate submission

  const totals = useMemo(() => cartTotals(items, method), [items, method]);

  // Can't check out an empty cart.
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const handlePlaceOrder = async (contact) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700)); // simulate processing

    const order = {
      id: `LMN-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      email: user?.email || contact.email,
      items: items.map((i) => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
      totals,
      method,
      // Only safe shipping/contact fields are stored — never payment details.
      shipTo: {
        name: contact.fullName,
        address: contact.address,
        apt: contact.apt,
        city: contact.city,
        region: contact.region,
        postal: contact.postal,
        country: contact.country,
      },
    };

    const history = readJSON(STORAGE_KEYS.orders, []);
    writeJSON(STORAGE_KEYS.orders, [order, ...(Array.isArray(history) ? history : [])]);

    clear();
    notify("Order placed successfully", { type: "success" });
    navigate("/order-confirmation", { replace: true, state: { order } });
  };

  return (
    <div className="container section">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <CheckoutForm
          prefill={{ fullName: user?.name || "", email: user?.email || "" }}
          method={method}
          onMethodChange={setMethod}
          submitting={submitting}
          onSubmit={handlePlaceOrder}
        />
        <OrderSummary items={items} totals={totals} />
      </div>
    </div>
  );
}
