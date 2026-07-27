import React from "react";

// Suspense fallback for lazily-loaded routes. Text + spinner (no bare spinner).
export default function PageLoader({ label = "Loading" }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p className="muted">{label}…</p>
    </div>
  );
}
