import React from "react";

/* Single inline-SVG icon system. No emojis, no icon-font dependency.
   Every icon shares a 24x24 viewBox and inherits currentColor. Icons are
   decorative by default (aria-hidden); pass a `title` to label one. */

const P = {
  search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" /></>,
  heart: <path d="M12 20s-7-4.35-9.3-8.5C1.1 8.7 2.2 5.5 5.2 5.5c1.9 0 3.1 1.1 3.8 2.2.7-1.1 1.9-2.2 3.8-2.2 3 0 4.1 3.2 2.5 6C19 15.65 12 20 12 20z" />,
  "heart-fill": <path d="M12 20s-7-4.35-9.3-8.5C1.1 8.7 2.2 5.5 5.2 5.5c1.9 0 3.1 1.1 3.8 2.2.7-1.1 1.9-2.2 3.8-2.2 3 0 4.1 3.2 2.5 6C19 15.65 12 20 12 20z" fill="currentColor" stroke="none" />,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  menu: <><line x1="3.5" y1="7" x2="20.5" y2="7" /><line x1="3.5" y1="12" x2="20.5" y2="12" /><line x1="3.5" y1="17" x2="20.5" y2="17" /></>,
  close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><line x1="12" y1="2.5" x2="12" y2="4.5" /><line x1="12" y1="19.5" x2="12" y2="21.5" /><line x1="2.5" y1="12" x2="4.5" y2="12" /><line x1="19.5" y1="12" x2="21.5" y2="12" /><line x1="5.2" y1="5.2" x2="6.6" y2="6.6" /><line x1="17.4" y1="17.4" x2="18.8" y2="18.8" /><line x1="5.2" y1="18.8" x2="6.6" y2="17.4" /><line x1="17.4" y1="6.6" x2="18.8" y2="5.2" /></>,
  moon: <path d="M20.5 14.2A8 8 0 0 1 9.8 3.5a8 8 0 1 0 10.7 10.7z" />,
  star: <polygon points="12 3 14.6 8.3 20.4 9.1 16.2 13.2 17.2 19 12 16.3 6.8 19 7.8 13.2 3.6 9.1 9.4 8.3 12 3" />,
  "star-fill": <polygon points="12 3 14.6 8.3 20.4 9.1 16.2 13.2 17.2 19 12 16.3 6.8 19 7.8 13.2 3.6 9.1 9.4 8.3 12 3" fill="currentColor" stroke="none" />,
  check: <polyline points="4 12.5 9 17.5 20 6.5" />,
  "check-circle": <><circle cx="12" cy="12" r="9" /><polyline points="8 12.5 11 15.5 16.5 9" /></>,
  alert: <><path d="M12 4 2.7 20a1.4 1.4 0 0 0 1.2 2.1h16.2a1.4 1.4 0 0 0 1.2-2.1z" /><line x1="12" y1="10" x2="12" y2="14" /><line x1="12" y1="17.5" x2="12.01" y2="17.5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16.5" /><line x1="12" y1="7.7" x2="12.01" y2="7.7" /></>,
  "chevron-left": <polyline points="15 5 8 12 15 19" />,
  "chevron-right": <polyline points="9 5 16 12 9 19" />,
  "chevron-down": <polyline points="5 9 12 16 19 9" />,
  "arrow-right": <><line x1="4" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></>,
  "arrow-left": <><line x1="20" y1="12" x2="5" y2="12" /><polyline points="11 6 5 12 11 18" /></>,
  trash: <><polyline points="4 7 20 7" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" /><path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  sliders: <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="17" x2="20" y2="17" /><circle cx="9" cy="7" r="2.2" /><circle cx="15" cy="17" r="2.2" /></>,
  package: <><path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" /><polyline points="3 7 12 11.5 21 7" /><line x1="12" y1="11.5" x2="12" y2="21.5" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.6" /><polyline points="4 18 9 13 13 16 16 13 20 17" /></>,
  logout: <><path d="M14 7V5.5A1.5 1.5 0 0 0 12.5 4h-6A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20h6a1.5 1.5 0 0 0 1.5-1.5V17" /><line x1="10" y1="12" x2="21" y2="12" /><polyline points="17 8 21 12 17 16" /></>,
  logo: <><circle cx="12" cy="12" r="8.2" /><path d="M12 3.8v16.4M3.8 12h16.4" opacity="0.5" /></>,
};

export default function Icon({ name, size = 20, title, className = "", strokeWidth = 1.7 }) {
  const path = P[name] || P.info;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
}
