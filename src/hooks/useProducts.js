import { useCallback, useEffect, useState } from "react";
import { getProducts, getCategories } from "../services/api.js";

/* Fetches the product catalogue and category list once, exposing
   loading / data / error state. Requests are aborted on unmount and
   can be re-run via reload() for retry buttons. */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [prods, cats] = await Promise.all([
          getProducts({ signal: controller.signal }),
          getCategories({ signal: controller.signal }),
        ]);
        if (!active) return;
        setProducts(prods);
        setCategories(cats);
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
  }, [nonce]);

  return { products, categories, loading, error, reload };
}

export default useProducts;
