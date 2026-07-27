import React from "react";
import Icon from "../Icon/Icon.jsx";
import "./ProductFilters.css";

/* Filter controls: category, price range, and minimum rating. Filters are
   combinable and controlled by the parent. A reset clears everything. */
export default function ProductFilters({ categories, filters, onChange, maxPrice = 1000 }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="filters">
      <fieldset className="filters__group">
        <legend className="filters__legend">Category</legend>
        <div className="filters__chips">
          <button
            type="button"
            className={`chip ${filters.category === "all" ? "is-active" : ""}`}
            aria-pressed={filters.category === "all"}
            onClick={() => set({ category: "all" })}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${filters.category === c ? "is-active" : ""}`}
              aria-pressed={filters.category === c}
              onClick={() => set({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">
          Max price <span className="muted tabular">${filters.maxPrice}</span>
        </legend>
        <input
          className="filters__range"
          type="range"
          min="0"
          max={maxPrice}
          step="5"
          value={filters.maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          aria-label={`Maximum price, currently ${filters.maxPrice} dollars`}
        />
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">Minimum rating</legend>
        <div className="filters__chips">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              className={`chip ${filters.minRating === r ? "is-active" : ""}`}
              aria-pressed={filters.minRating === r}
              onClick={() => set({ minRating: r })}
            >
              {r === 0 ? "Any" : (
                <span className="row gap-1">
                  <Icon name="star-fill" size={13} /> {r}+
                </span>
              )}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
