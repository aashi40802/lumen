// Central constants — no magic strings scattered across the app.

export const API_BASE = "https://fakestoreapi.com";

export const CURRENCY = { locale: "en-US", code: "USD" };

// Cart / quantity rules
export const MIN_QTY = 1;
export const MAX_QTY = 20;

// Money model (demo values; a real store would derive these server-side).
export const TAX_RATE = 0.08; // 8% simulated tax
export const FREE_SHIPPING_THRESHOLD = 75;
export const SHIPPING = {
  standard: { id: "standard", label: "Standard", price: 5.99, eta: "3–5 business days" },
  express: { id: "express", label: "Express", price: 14.99, eta: "1–2 business days" },
};

// Sorting options
export const SORT_OPTIONS = [
  { value: "featured", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating" },
  { value: "name-asc", label: "Name: A–Z" },
];

// Namespaced Local Storage keys (documented in the README).
export const STORAGE_KEYS = {
  cart: "lumen:cart:v1",
  wishlist: "lumen:wishlist:v1",
  session: "lumen:session:v1",
  users: "lumen:users:v1",
  theme: "lumen:theme:v1",
  orders: "lumen:orders:v1",
  recentSearches: "lumen:recent-searches:v1",
};
