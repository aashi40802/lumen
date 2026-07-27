import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";
import PageLoader from "../Loading/PageLoader.jsx";

/* Guards routes that require a simulated session. While the session is being
   restored we show a loader (avoids a flash-redirect). Unauthenticated users
   are sent to /login with the intended destination preserved in state. */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <PageLoader label="Checking your session" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}
