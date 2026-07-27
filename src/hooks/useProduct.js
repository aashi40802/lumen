import { useCallback, useEffect, useState } from "react";
import { getProduct } from "../services/api.js";

// Fetches a single product by id with loading / error / retry support.
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (id === undefined || id === null) return;
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const p = await getProduct(id, { signal: controller.signal });
        if (active) setProduct(p);
      } catch (err) {
        if (err.name === "AbortError" || !active) return;
        setError(err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, nonce]);

  return { product, loading, error, reload };
}

export default useProduct;
