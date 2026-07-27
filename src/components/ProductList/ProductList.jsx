import React from "react";
import ProductCard from "../ProductCard/ProductCard.jsx";
import "./ProductList.css";

// Presentational grid of product cards. Stable keys; no data fetching here.
export default function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
