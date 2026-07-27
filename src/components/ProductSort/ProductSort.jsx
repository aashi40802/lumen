import React from "react";
import { SORT_OPTIONS } from "../../utils/constants.js";

// Sort control. Emits the chosen sort key; the parent derives a sorted copy
// of the products (the original array is never mutated).
export default function ProductSort({ value, onChange, id = "product-sort" }) {
  return (
    <div className="field product-sort">
      <label className="visually-hidden" htmlFor={id}>Sort products</label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>Sort: {o.label}</option>
        ))}
      </select>
    </div>
  );
}
