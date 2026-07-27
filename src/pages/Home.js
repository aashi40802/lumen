import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero/Hero.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import ProductFilters from "../components/ProductFilters/ProductFilters.jsx";
import ProductSort from "../components/ProductSort/ProductSort.jsx";
import ProductList from "../components/ProductList/ProductList.jsx";
import { ProductSkeletonGrid } from "../components/Loading/ProductSkeleton.jsx";
import EmptyState from "../components/EmptyState/EmptyState.jsx";
import ErrorState from "../components/ErrorState/ErrorState.jsx";
import Drawer from "../components/Drawer/Drawer.jsx";
import Icon from "../components/Icon/Icon.jsx";
import useProducts from "../hooks/useProducts.js";
import { useDebounce } from "../hooks/useDebounce.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

const DEFAULT_FILTERS = { category: "all", maxPrice: 1000, minRating: 0 };

export default function Home() {
  useDocumentTitle("Shop");
  const { products, categories, loading, error, reload } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 300);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const didInit = useRef(false);

  // Price ceiling for the range control, derived from the loaded catalogue.
  const priceCeil = useMemo(() => {
    if (!products.length) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)) / 10) * 10;
  }, [products]);

  // On first load, open the price filter fully so nothing is hidden.
  useEffect(() => {
    if (!didInit.current && products.length) {
      setFilters((f) => ({ ...f, maxPrice: priceCeil }));
      didInit.current = true;
    }
  }, [products.length, priceCeil]);

  // Keep the URL query string in sync with the debounced search term.
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) params.set("q", debouncedQuery);
    else params.delete("q");
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const isFiltering =
    debouncedQuery.trim() !== "" ||
    filters.category !== "all" ||
    filters.minRating !== 0 ||
    filters.maxPrice < priceCeil;

  // Featured: top-rated products, shown only on the un-filtered view.
  const featured = useMemo(
    () => [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4),
    [products]
  );

  // Derived filtered + sorted list (never mutates the source array).
  const visible = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (p.price > filters.maxPrice) return false;
      if (p.rating.rate < filters.minRating) return false;
      if (q && !(p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))) return false;
      return true;
    });
    const sorted = [...filtered];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "rating-desc": sorted.sort((a, b) => b.rating.rate - a.rating.rate); break;
      case "name-asc": sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break; // "featured" keeps API order
    }
    return sorted;
  }, [products, filters, sort, debouncedQuery]);

  const resetAll = () => {
    setFilters({ ...DEFAULT_FILTERS, maxPrice: priceCeil });
    setQuery("");
    setSort("featured");
  };

  const filtersNode = (
    <ProductFilters categories={categories} filters={filters} onChange={setFilters} maxPrice={priceCeil} />
  );

  return (
    <>
      <div className="container">
        <Hero />
      </div>

      {/* Featured */}
      {!isFiltering && !loading && !error && featured.length > 0 && (
        <section className="container section" aria-labelledby="featured-title">
          <div className="page-head">
            <h2 id="featured-title" className="h2">Featured</h2>
            <p className="muted">Highly rated picks from across the catalogue.</p>
          </div>
          <ProductList products={featured} />
        </section>
      )}

      {/* Catalogue */}
      <section id="catalog" className="container section" aria-labelledby="catalog-title">
        <div className="page-head">
          <h2 id="catalog-title" className="h2">All products</h2>
          <p className="muted">{loading ? "Loading catalogue…" : `${visible.length} products`}</p>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-toolbar__search"><SearchBar value={query} onChange={setQuery} resultCount={visible.length} /></div>
          <div className="catalog-toolbar__controls">
            <button type="button" className="btn btn--ghost catalog-toolbar__filter-btn" onClick={() => setDrawerOpen(true)}>
              <Icon name="sliders" size={16} /> Filters
            </button>
            <ProductSort value={sort} onChange={setSort} />
          </div>
        </div>

        {isFiltering && (
          <div className="active-filters">
            <span className="muted">Active:</span>
            {filters.category !== "all" && <span className="chip is-active">{filters.category}</span>}
            {filters.minRating !== 0 && <span className="chip is-active">{filters.minRating}+ rating</span>}
            {filters.maxPrice < priceCeil && <span className="chip is-active">Under ${filters.maxPrice}</span>}
            {debouncedQuery && <span className="chip is-active">“{debouncedQuery}”</span>}
            <button type="button" className="btn btn--quiet btn--sm" onClick={resetAll}>Reset all</button>
          </div>
        )}

        <div className="catalog-body">
          <aside className="catalog-sidebar glass" aria-label="Filters">{filtersNode}</aside>

          <div className="catalog-main">
            {loading && <ProductSkeletonGrid count={8} />}
            {!loading && error && (
              <ErrorState title="We couldn't load products" message={error.message} onRetry={reload} />
            )}
            {!loading && !error && visible.length === 0 && (
              <EmptyState
                icon="search"
                title="No products match your search"
                message="Try a different keyword or clear your filters."
                action={<button type="button" className="btn btn--primary" onClick={resetAll}>Clear filters</button>}
              />
            )}
            {!loading && !error && visible.length > 0 && <ProductList products={visible} />}
          </div>
        </div>
      </section>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters" side="left">
        {filtersNode}
        <div className="mt-6 stack gap-2">
          <button type="button" className="btn btn--primary btn--block" onClick={() => setDrawerOpen(false)}>Show {visible.length} results</button>
          <button type="button" className="btn btn--quiet btn--block" onClick={resetAll}>Reset all</button>
        </div>
      </Drawer>
    </>
  );
}
