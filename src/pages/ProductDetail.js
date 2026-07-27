import React, { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Icon from "../components/Icon/Icon.jsx";
import Rating from "../components/Rating/Rating.jsx";
import ProductImage from "../components/ProductImage/ProductImage.jsx";
import QuantitySelector from "../components/QuantitySelector/QuantitySelector.jsx";
import ProductList from "../components/ProductList/ProductList.jsx";
import ErrorState from "../components/ErrorState/ErrorState.jsx";
import PageLoader from "../components/Loading/PageLoader.jsx";
import useProduct from "../hooks/useProduct.js";
import useProducts from "../hooks/useProducts.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { useCart } from "../contexts/CartContext.js";
import { useWishlist } from "../contexts/WishlistContext.js";
import { useToast } from "../contexts/ToastContext.js";
import { formatCurrency } from "../utils/currency.js";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, reload } = useProduct(productId);
  const { products } = useProducts();
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const { notify } = useToast();
  const [qty, setQty] = useState(1);

  useDocumentTitle(product ? product.title : "Product");

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [products, product]);

  if (loading) return <PageLoader label="Loading product" />;

  if (error) {
    const notFound = error.code === "not_found";
    return (
      <div className="container section">
        <ErrorState
          title={notFound ? "Product not found" : "We couldn't load this product"}
          message={notFound ? "The item you're looking for doesn't exist or is no longer available." : error.message}
          onRetry={notFound ? undefined : reload}
        />
        <div className="text-center mt-6">
          <Link to="/products" className="btn btn--ghost">Back to products</Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const inWishlist = wishlist.has(product.id);

  const handleAdd = () => {
    addItem(product, qty);
    notify(`Added ${qty} × ${shorten(product.title)} to cart`, { type: "success" });
  };

  return (
    <div className="container section fade-up">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        <Icon name="chevron-left" size={16} /> Back
      </button>

      <div className="pdp">
        <div className="pdp__media">
          <ProductImage src={product.image} alt={product.title} />
        </div>

        <div className="pdp__info">
          <p className="eyebrow pdp__cat">{product.category}</p>
          <h1 className="pdp__title">{product.title}</h1>
          <div className="pdp__rating-row">
            <Rating rate={product.rating.rate} count={product.rating.count} size={17} />
            <span className="muted">{product.rating.count} reviews</span>
          </div>
          <p className="price pdp__price">{formatCurrency(product.price)}</p>
          <p className="pdp__desc">{product.description}</p>

          <div className="pdp__buy">
            <QuantitySelector value={qty} onChange={setQty} idLabel="Quantity" />
            <button type="button" className="btn btn--primary btn--lg" onClick={handleAdd}>
              <Icon name="cart" size={18} /> Add to cart
            </button>
            <button
              type="button"
              className={`icon-btn pdp__wish ${inWishlist ? "is-active" : ""}`}
              onClick={() => {
                wishlist.toggle(product);
                notify(inWishlist ? "Removed from wishlist" : "Saved to wishlist", { type: "info" });
              }}
              aria-pressed={inWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
              style={{ width: 48, height: 48, border: "1px solid var(--line)" }}
            >
              <Icon name={inWishlist ? "heart-fill" : "heart"} />
            </button>
          </div>

          <div className="pdp__meta">
            <span className="pdp__meta-item"><Icon name="package" size={16} /> Free returns within 30 days</span>
            <span className="pdp__meta-item"><Icon name="lock" size={16} /> Secure demo checkout</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-title">
          <div className="page-head"><h2 id="related-title" className="h2">Related products</h2></div>
          <ProductList products={related} />
        </section>
      )}
    </div>
  );
}

function shorten(text, max = 28) {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}
