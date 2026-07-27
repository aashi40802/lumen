import React from "react";
import Icon from "../Icon/Icon.jsx";
import "./Rating.css";

/* Accessible star rating. Renders SVG stars (full / half via clip) rather
   than repeated star characters, plus a screen-reader-only text summary. */
export default function Rating({ rate = 0, count, size = 15, showCount = true }) {
  const value = Math.max(0, Math.min(5, Number(rate) || 0));
  const label = `Rated ${value.toFixed(1)} out of 5${count != null ? ` from ${count} reviews` : ""}`;

  return (
    <span className="rating" title={label}>
      <span className="rating__stars" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i)); // 0..1 for this star
          return (
            <span key={i} className="rating__star" style={{ width: size, height: size }}>
              <span className="rating__star-bg"><Icon name="star-fill" size={size} /></span>
              <span className="rating__star-fg" style={{ width: `${fill * 100}%` }}>
                <Icon name="star-fill" size={size} />
              </span>
            </span>
          );
        })}
      </span>
      {showCount && count != null && (
        <span className="rating__count muted tabular" aria-hidden="true">({count})</span>
      )}
      <span className="visually-hidden">{label}</span>
    </span>
  );
}
