import React from "react";
import Icon from "../Icon/Icon.jsx";

// Reusable empty state with an icon, message, and optional action.
export default function EmptyState({ icon = "package", title, message, action }) {
  return (
    <div className="state-panel glass fade-up" role="status">
      <span className="state-panel__icon" aria-hidden="true"><Icon name={icon} size={26} /></span>
      <h2 className="state-panel__title">{title}</h2>
      {message && <p className="state-panel__msg muted">{message}</p>}
      {action && <div className="state-panel__action">{action}</div>}
    </div>
  );
}
