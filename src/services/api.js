import { API_BASE } from "../utils/constants.js";

/* =============================================================
   API service — the only place that talks to FakeStoreAPI.
   Presentation components never fetch directly; they consume the
   normalized objects returned here. All requests use async/await,
   check response.ok, parse defensively, and support aborting.
   ============================================================= */

export class ApiError extends Error {
  constructor(message, { code = "unknown", status = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

function messageForStatus(status) {
  if (status === 404) return { code: "not_found", msg: "We couldn't find what you were looking for." };
  if (status === 429) return { code: "rate_limit", msg: "Too many requests. Please wait a moment and try again." };
  if (status >= 500) return { code: "server", msg: "The store is having trouble right now. Please try again shortly." };
  return { code: "http", msg: "Something went wrong while loading data." };
}

async function request(path, { signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { signal, headers: { Accept: "application/json" } });
  } catch (err) {
    if (err.name === "AbortError") throw err; // let callers ignore aborts
    throw new ApiError("You appear to be offline. Check your connection and try again.", { code: "network" });
  }
  if (!res.ok) {
    const { code, msg } = messageForStatus(res.status);
    throw new ApiError(msg, { code, status: res.status });
  }
  try {
    return await res.json();
  } catch {
    throw new ApiError("The store returned an unreadable response.", { code: "bad_json" });
  }
}

// ---- Normalization: guarantee a predictable product shape ----
export function normalizeProduct(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = raw.id;
  if (id === undefined || id === null) return null;
  return {
    id,
    title: typeof raw.title === "string" ? raw.title : "Untitled product",
    description: typeof raw.description === "string" ? raw.description : "",
    price: Number.isFinite(Number(raw.price)) ? Number(raw.price) : 0,
    category: typeof raw.category === "string" ? raw.category : "uncategorized",
    image: typeof raw.image === "string" ? raw.image : "",
    rating: {
      rate: Number.isFinite(Number(raw.rating?.rate)) ? Number(raw.rating.rate) : 0,
      count: Number.isFinite(Number(raw.rating?.count)) ? Number(raw.rating.count) : 0,
    },
  };
}

export async function getProducts({ signal } = {}) {
  const data = await request("/products", { signal });
  if (!Array.isArray(data)) throw new ApiError("Unexpected product data.", { code: "bad_data" });
  return data.map(normalizeProduct).filter(Boolean);
}

export async function getProduct(id, { signal } = {}) {
  const data = await request(`/products/${encodeURIComponent(id)}`, { signal });
  // FakeStoreAPI returns null (200) for an unknown id.
  const product = normalizeProduct(data);
  if (!product) throw new ApiError("This product could not be found.", { code: "not_found", status: 404 });
  return product;
}

export async function getCategories({ signal } = {}) {
  const data = await request("/products/categories", { signal });
  return Array.isArray(data) ? data.filter((c) => typeof c === "string") : [];
}
