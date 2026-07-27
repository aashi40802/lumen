import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon/Icon.jsx";
import { useAuth } from "../contexts/AuthContext.js";
import { useWishlist } from "../contexts/WishlistContext.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { readJSON } from "../services/storage.js";
import { STORAGE_KEYS } from "../utils/constants.js";
import { formatCurrency } from "../utils/currency.js";

export default function AccountPage() {
  useDocumentTitle("Account");
  const { user, logout } = useAuth();
  const wishlist = useWishlist();
  const orders = readJSON(STORAGE_KEYS.orders, []);
  const orderList = Array.isArray(orders) ? orders : [];

  return (
    <div className="container section">
      <div className="between mb-4">
        <h1 className="page-title" style={{ margin: 0 }}>Your account</h1>
        <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>
          <Icon name="logout" size={15} /> Sign out
        </button>
      </div>

      <div className="account-grid">
        <section className="panel glass">
          <h2 className="panel__title">Profile</h2>
          <dl>
            <div className="profile-row"><dt>Name</dt><dd>{user?.name}</dd></div>
            <div className="profile-row"><dt>Email</dt><dd>{user?.email}</dd></div>
            <div className="profile-row"><dt>Member since</dt><dd>{formatDate(user?.createdAt)}</dd></div>
            <div className="profile-row"><dt>Saved items</dt><dd>{wishlist.count}</dd></div>
          </dl>
          <p className="auth__demo" style={{ marginTop: "1rem" }}>
            Simulated account. Profile and order data are demonstration records stored in your
            browser's Local Storage — not a real account.
          </p>
          <Link to="/wishlist" className="btn btn--ghost mt-4">View wishlist</Link>
        </section>

        <section className="panel glass">
          <h2 className="panel__title">Order history <span className="muted">(demo)</span></h2>
          {orderList.length === 0 ? (
            <p className="muted">No orders yet. Placed orders will appear here as demonstration records.</p>
          ) : (
            <div className="order-history">
              {orderList.map((o) => (
                <div key={o.id} className="order-row">
                  <div>
                    <p className="order-row__id">{o.id}</p>
                    <p className="muted" style={{ fontSize: "0.85rem" }}>{formatDate(o.createdAt)} · {o.items.length} items</p>
                  </div>
                  <span className="price">{formatCurrency(o.totals.total)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
