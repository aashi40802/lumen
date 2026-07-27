import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/Cart/CartItem.jsx";
import CartSummary from "../components/Cart/CartSummary.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import Icon from "../components/Icon/Icon.jsx";
import { useCart } from "../contexts/CartContext.js";
import { useAuth } from "../contexts/AuthContext.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import "../components/Cart/Cart.css";

export default function CartPage() {
  useDocumentTitle("Cart");
  const { items, totals, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container section">
        <h1 className="page-title">Your cart</h1>
        <div className="cart-empty">
          <EmptyState
            icon="cart"
            title="Your cart is empty"
            message="Browse the catalogue and add a few things you like."
            action={<Link to="/products" className="btn btn--primary">Start shopping</Link>}
          />
        </div>
      </div>
    );
  }

  const goCheckout = () => navigate(isAuthenticated ? "/checkout" : "/login?next=/checkout");

  return (
    <div className="container section">
      <div className="between mb-4">
        <h1 className="page-title" style={{ margin: 0 }}>Your cart <span className="muted">({totals.count})</span></h1>
        <button type="button" className="btn btn--quiet btn--sm" onClick={clear}>
          <Icon name="trash" size={15} /> Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <ul className="cart-list" aria-label="Cart items">
          {items.map((item) => <CartItem key={item.id} item={item} />)}
        </ul>

        <CartSummary
          totals={totals}
          note="Taxes and shipping are simulated for this demo."
        >
          <button type="button" className="btn btn--primary btn--block btn--lg" onClick={goCheckout}>
            Checkout <Icon name="arrow-right" size={18} />
          </button>
          <Link to="/products" className="btn btn--ghost btn--block">Continue shopping</Link>
        </CartSummary>
      </div>
    </div>
  );
}
