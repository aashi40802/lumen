import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../utils/constants.js";
import { readJSON, writeJSON } from "../services/storage.js";

const ThemeContext = createContext(null);

function initialTheme() {
  const stored = readJSON(STORAGE_KEYS.theme, null);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = typeof window !== "undefined" &&
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  // Reflect the theme on <html> and persist the explicit choice.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    writeJSON(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
