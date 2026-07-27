import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import PageLoader from "./components/Loading/PageLoader.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";

import { ThemeProvider } from "./contexts/ThemeContext.js";
import { AuthProvider } from "./contexts/AuthContext.js";
import { CartProvider } from "./contexts/CartContext.js";
import { WishlistProvider } from "./contexts/WishlistContext.js";
import { ToastProvider } from "./contexts/ToastContext.js";

// Route-level code splitting: each page is a separate lazily-loaded chunk.
const Home = lazy(() => import("./pages/Home.js"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.js"));
const CartPage = lazy(() => import("./pages/CartPage.js"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.js"));
const LoginPage = lazy(() => import("./pages/LoginPage.js"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.js"));
const WishlistPage = lazy(() => import("./pages/WishlistPage.js"));
const AccountPage = lazy(() => import("./pages/AccountPage.js"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage.js"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.js"));

// Scroll to top on navigation (skips hash links so in-page anchors still work).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname, hash]);
  return null;
}

function MainLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader label="Loading page" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Home />} />
              <Route path="/products/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route
                path="/checkout"
                element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
              />
              <Route
                path="/account"
                element={<ProtectedRoute><AccountPage /></ProtectedRoute>}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <ScrollToTop />
              <MainLayout />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
