import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { STORAGE_KEYS } from "../utils/constants.js";
import { readJSON, writeJSON } from "../services/storage.js";
import { clampQuantity, cartTotals } from "../utils/cartCalculations.js";

const CartContext = createContext(null);

// ---- Validate + sanitize any restored cart so bad data can't crash us ----
function sanitizeItems(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const out = [];
  for (const it of value) {
    if (!it || typeof it !== "object") continue;
    if (it.id === undefined || it.id === null) continue;
    if (seen.has(it.id)) continue;
    if (!Number.isFinite(Number(it.price))) continue;
    seen.add(it.id);
    out.push({
      id: it.id,
      title: String(it.title ?? "Product"),
      price: Number(it.price),
      image: typeof it.image === "string" ? it.image : "",
      category: typeof it.category === "string" ? it.category : "",
      quantity: clampQuantity(it.quantity),
    });
  }
  return out;
}

function reducer(state, action) {
  switch (action.type) {
    case "RESTORE_CART":
      return { items: sanitizeItems(action.payload) };

    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        // Same product -> increase quantity instead of duplicating.
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: clampQuantity(i.quantity + quantity) } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: clampQuantity(quantity),
          },
        ],
      };
    }

    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload.id) };

    case "INCREASE_QUANTITY":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: clampQuantity(i.quantity + 1) } : i
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        items: state.items
          .map((i) => (i.id === action.payload.id ? { ...i, quantity: clampQuantity(i.quantity - 1) } : i))
          .filter((i) => i.quantity >= 1),
      };

    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: clampQuantity(action.payload.quantity) } : i
        ),
      };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Restore once on mount (validated).
  useEffect(() => {
    dispatch({ type: "RESTORE_CART", payload: readJSON(STORAGE_KEYS.cart, []) });
  }, []);

  // Persist on every change.
  useEffect(() => {
    writeJSON(STORAGE_KEYS.cart, state.items);
  }, [state.items]);

  const value = useMemo(() => {
    const totals = cartTotals(state.items);
    return {
      items: state.items,
      count: totals.count,
      totals,
      addItem: (product, quantity = 1) => dispatch({ type: "ADD_ITEM", payload: { product, quantity } }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      increase: (id) => dispatch({ type: "INCREASE_QUANTITY", payload: { id } }),
      decrease: (id) => dispatch({ type: "DECREASE_QUANTITY", payload: { id } }),
      updateQuantity: (id, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
      clear: () => dispatch({ type: "CLEAR_CART" }),
      isInCart: (id) => state.items.some((i) => i.id === id),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
