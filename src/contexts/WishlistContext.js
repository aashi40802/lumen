import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { STORAGE_KEYS } from "../utils/constants.js";
import { readJSON, writeJSON } from "../services/storage.js";

const WishlistContext = createContext(null);

function sanitize(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const out = [];
  for (const it of value) {
    if (!it || it.id === undefined || it.id === null || seen.has(it.id)) continue;
    if (!Number.isFinite(Number(it.price))) continue;
    seen.add(it.id);
    out.push({
      id: it.id,
      title: String(it.title ?? "Product"),
      price: Number(it.price),
      image: typeof it.image === "string" ? it.image : "",
      category: typeof it.category === "string" ? it.category : "",
      rating: it.rating && typeof it.rating === "object" ? it.rating : { rate: 0, count: 0 },
    });
  }
  return out;
}

function reducer(state, action) {
  switch (action.type) {
    case "RESTORE":
      return { items: sanitize(action.payload) };
    case "TOGGLE": {
      const p = action.payload;
      const exists = state.items.some((i) => i.id === p.id);
      return {
        items: exists
          ? state.items.filter((i) => i.id !== p.id)
          : [...state.items, {
              id: p.id, title: p.title, price: p.price, image: p.image,
              category: p.category, rating: p.rating || { rate: 0, count: 0 },
            }],
      };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    dispatch({ type: "RESTORE", payload: readJSON(STORAGE_KEYS.wishlist, []) });
  }, []);
  useEffect(() => {
    writeJSON(STORAGE_KEYS.wishlist, state.items);
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      count: state.items.length,
      toggle: (product) => dispatch({ type: "TOGGLE", payload: product }),
      remove: (id) => dispatch({ type: "REMOVE", payload: { id } }),
      clear: () => dispatch({ type: "CLEAR" }),
      has: (id) => state.items.some((i) => i.id === id),
    }),
    [state.items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
