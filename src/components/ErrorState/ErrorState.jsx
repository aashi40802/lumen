import React from "react";
import Icon from "../Icon/Icon.jsx";

// Reusable error panel with a friendly message and a retry action.
export default function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="state-panel state-panel--error glass" role="alert">
      <span className="state-panel__icon is-danger" aria-hidden="true"><Icon name="alert" size={26} /></span>
      <h2 className="state-panel__title">{title}</h2>
      {message && <p className="state-panel__msg muted">{message}</p>}
      {onRetry && (
        <div className="state-panel__action">
          <button type="button" className="btn btn--primary" onClick={onRetry}>Try again</button>
        </div>
      )}
    </div>
  );
}
