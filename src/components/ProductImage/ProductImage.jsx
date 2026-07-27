import React, { useState } from "react";
import Icon from "../Icon/Icon.jsx";

/* Product image inside a fixed aspect-ratio container. Uses object-fit:
   contain (product photos shouldn't be stretched), lazy loading, and a
   graceful fallback when the image fails to load. */
export default function ProductImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`product-image ${className}`}>
      {failed || !src ? (
        <div className="product-image__fallback" role="img" aria-label={alt || "Image unavailable"}>
          <Icon name="image" size={30} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
