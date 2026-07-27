import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import Icon from "../components/Icon/Icon.jsx";

/* Accessible toast/feedback system. Messages are announced through an
   aria-live region; each toast auto-dismisses and can be dismissed manually.
   No emojis — status is conveyed with an icon plus text and colour. */
const ToastContext = createContext(null);

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message, { type = "info", duration = 3200 } = {}) => {
      const id = ++counter;
      setToasts((list) => {
        // Avoid flooding: drop an identical message already on screen.
        if (list.some((t) => t.message === message)) return list;
        return [...list, { id, message, type }];
      });
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
      return id;
    },
    [dismiss]
  );

  const iconFor = { success: "check", error: "alert", info: "info" };

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="toast-region" role="region" aria-label="Notifications">
        <ul className="toast-list" aria-live="polite">
          {toasts.map((t) => (
            <li key={t.id} className={`toast toast--${t.type} glass`}>
              <span className="toast__icon" aria-hidden="true">
                <Icon name={iconFor[t.type] || "info"} />
              </span>
              <span className="toast__msg">{t.message}</span>
              <button className="toast__close" type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
                <Icon name="close" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
