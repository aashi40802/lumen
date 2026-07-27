import React from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon/Icon.jsx";
import ProductImage from "../components/ProductImage/ProductImage.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import { useWishlist } from "../contexts/WishlistContext.js";
import { useCart } from "../contexts/CartContext.js";
import { useToast } from "../contexts/ToastContext.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { formatCurrency } from "../utils/currency.js";

export default function WishlistPage() {
  useDocumentTitle("Wishlist");
  const wishlist = useWishlist();
  const { addItem } = useCart();
  const { notify } = useToast();

  if (wishlist.items.length === 0) {
    return (
      <div className="container section">
        <h1 className="page-title">Wishlist</h1>
        <div className="cart-empty">
          <EmptyState
            icon="heart"
            title="Your wishlist is empty"
            message="Tap the heart on any product to save it for later."
            action={<Link to="/products" className="btn btn--primary">Browse products</Link>}
          />
        </div>
      </div>
    );
  }

  const moveToCart = (item) => {
    addItem(item, 1);
    wishlist.remove(item.id);
    notify("Moved to cart", { type: "success" });
  };

  return (
    <div className="container section">
      <div className="between mb-4">
        <h1 className="page-title" style={{ margin: 0 }}>Wishlist <span className="muted">({wishlist.count})</span></h1>
        <button type="button" className="btn btn--quiet btn--sm" onClick={wishlist.clear}>Clear all</button>
      </div>

      <ul className="cart-list" aria-label="Wishlist items">
        {wishlist.items.map((item) => (
          <li key={item.id} className="cart-item">
            <Link to={`/products/${item.id}`} className="cart-item__media">
              <ProductImage src={item.image} alt={item.title} />
            </Link>
            <div className="cart-item__info">
              <Link to={`/products/${item.id}`} className="cart-item__title">{item.title}</Link>
              <p className="eyebrow cart-item__cat">{item.category}</p>
              <p className="price cart-item__unit">{formatCurrency(item.price)}</p>
            </div>
            <div className="cart-item__controls">
              <button type="button" className="btn btn--primary btn--sm" onClick={() => moveToCart(item)}>
                <Icon name="cart" size={15} /> Move to cart
              </button>
              <button type="button" className="btn btn--danger btn--sm" onClick={() => wishlist.remove(item.id)} aria-label={`Remove ${item.title} from wishlist`}>
                <Icon name="trash" size={15} /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
