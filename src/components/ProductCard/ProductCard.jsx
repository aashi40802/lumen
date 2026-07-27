import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import Rating from "../Rating/Rating.jsx";
import ProductImage from "../ProductImage/ProductImage.jsx";
import { useCart } from "../../contexts/CartContext.js";
import { useWishlist } from "../../contexts/WishlistContext.js";
import { useToast } from "../../contexts/ToastContext.js";
import { formatCurrency } from "../../utils/currency.js";
import "./ProductCard.css";

// Reusable product card. Memoized because a product's props are stable and
// the catalogue re-renders on unrelated filter/sort changes.
function ProductCard({ product }) {
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const { notify } = useToast();
  const [adding, setAdding] = useState(false);

  const inWishlist = wishlist.has(product.id);

  const handleAdd = async () => {
    setAdding(true);
    // Brief async touch so the button can show clear feedback.
    await new Promise((r) => setTimeout(r, 350));
    addItem(product, 1);
    notify(`${shorten(product.title)} added to cart`, { type: "success" });
    setAdding(false);
  };

  const handleWishlist = () => {
    wishlist.toggle(product);
    notify(inWishlist ? "Removed from wishlist" : "Saved to wishlist", { type: "info" });
  };

  return (
    <article className="product-card glass">
      <button
        type="button"
        className={`product-card__wish ${inWishlist ? "is-active" : ""}`}
        onClick={handleWishlist}
        aria-pressed={inWishlist}
        aria-label={inWishlist ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
      >
        <Icon name={inWishlist ? "heart-fill" : "heart"} size={18} />
      </button>

      <Link to={`/products/${product.id}`} className="product-card__link">
        <ProductImage src={product.image} alt={product.title} />
        <div className="product-card__body">
          <p className="product-card__category eyebrow">{product.category}</p>
          <h3 className="product-card__title">{product.title}</h3>
          <Rating rate={product.rating.rate} count={product.rating.count} />
        </div>
      </Link>

      <div className="product-card__footer">
        <span className="price product-card__price">{formatCurrency(product.price)}</span>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={handleAdd}
          disabled={adding}
          aria-label={`Add ${product.title} to cart`}
        >
          {adding ? "Adding…" : <><Icon name="cart" size={16} /> Add</>}
        </button>
      </div>
    </article>
  );
}

function shorten(text, max = 32) {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export default React.memo(ProductCard);
