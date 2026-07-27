import React from "react";

// Skeleton card used while the catalogue loads (reserves layout, no shift).
export function ProductSkeleton() {
  return (
    <div className="product-card glass" aria-hidden="true">
      <div className="product-card__media skeleton" />
      <div className="product-card__body">
        <div className="skeleton skeleton--line" style={{ width: "40%" }} />
        <div className="skeleton skeleton--line" style={{ width: "90%" }} />
        <div className="skeleton skeleton--line" style={{ width: "70%" }} />
        <div className="skeleton skeleton--line" style={{ width: "30%", height: 20, marginTop: 8 }} />
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductSkeleton;
