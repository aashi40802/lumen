import React from "react";
import Icon from "../Icon/Icon.jsx";
import "./SearchBar.css";

/* Controlled search input. Debouncing is handled by the parent (Home) so the
   value can also drive the URL query string. Fully keyboard accessible with a
   clear-search action and a live result count announced elsewhere. */
export default function SearchBar({ value, onChange, resultCount, id = "product-search" }) {
  return (
    <div className="searchbar glass">
      <span className="searchbar__icon" aria-hidden="true"><Icon name="search" size={18} /></span>
      <label className="visually-hidden" htmlFor={id}>Search products</label>
      <input
        id={id}
        className="searchbar__input"
        type="search"
        placeholder="Search products"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      {value && (
        <button type="button" className="searchbar__clear icon-btn" onClick={() => onChange("")} aria-label="Clear search">
          <Icon name="close" size={16} />
        </button>
      )}
      {typeof resultCount === "number" && (
        <span className="visually-hidden" aria-live="polite">{resultCount} products found</span>
      )}
    </div>
  );
}
