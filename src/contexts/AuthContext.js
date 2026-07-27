import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { STORAGE_KEYS } from "../utils/constants.js";
import { readJSON, writeJSON, removeKey } from "../services/storage.js";

/* =============================================================
   SIMULATED authentication — FRONTEND ONLY. This is NOT secure
   production auth: there is no backend, no real session tokens,
   and the lightweight hash below is not a substitute for a real
   password-hashing algorithm. It exists only to demonstrate the
   UX and to avoid storing plaintext passwords in Local Storage.
   A real app needs a server, salted+slow hashing (bcrypt/argon2),
   secure httpOnly session cookies, rate limiting, and server-side
   validation.
   ============================================================= */
const AuthContext = createContext(null);

// Non-reversible (but NON-secure) hash so we never persist plaintext.
function weakHash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return `h${h.toString(16)}`;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function reducer(state, action) {
  switch (action.type) {
    case "RESTORE_SESSION":
      return { ...state, user: action.payload || null, initializing: false };
    case "AUTH_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return { ...state, user: action.payload, loading: false, error: null };
    case "AUTH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, loading: false, error: null };
    default:
      return state;
  }
}

function getUsers() {
  const users = readJSON(STORAGE_KEYS.users, []);
  return Array.isArray(users) ? users : [];
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    loading: false,
    error: null,
    initializing: true,
  });

  // Restore session on mount (validated shape).
  useEffect(() => {
    const session = readJSON(STORAGE_KEYS.session, null);
    const valid =
      session && typeof session === "object" && session.email && session.id ? session : null;
    dispatch({ type: "RESTORE_SESSION", payload: valid });
  }, []);

  async function register({ name, email, password }) {
    dispatch({ type: "AUTH_START" });
    await delay(500); // simulate a network round-trip
    const users = getUsers();
    const normalizedEmail = String(email).trim().toLowerCase();
    if (users.some((u) => u.email === normalizedEmail)) {
      const error = "An account with this email already exists.";
      dispatch({ type: "AUTH_ERROR", payload: error });
      return { ok: false, error };
    }
    const record = {
      id: `u_${Date.now().toString(36)}`,
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash: weakHash(password), // never store the plaintext password
      createdAt: new Date().toISOString(),
    };
    writeJSON(STORAGE_KEYS.users, [...users, record]);

    const session = { id: record.id, name: record.name, email: record.email, createdAt: record.createdAt };
    writeJSON(STORAGE_KEYS.session, session);
    dispatch({ type: "REGISTER_SUCCESS", payload: session });
    return { ok: true };
  }

  async function login({ email, password }) {
    dispatch({ type: "AUTH_START" });
    await delay(500);
    const users = getUsers();
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = users.find((u) => u.email === normalizedEmail);
    // Generic message — do not reveal whether the account exists.
    if (!user || user.passwordHash !== weakHash(password)) {
      const error = "Incorrect email or password.";
      dispatch({ type: "AUTH_ERROR", payload: error });
      return { ok: false, error };
    }
    const session = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
    writeJSON(STORAGE_KEYS.session, session);
    dispatch({ type: "LOGIN_SUCCESS", payload: session });
    return { ok: true };
  }

  function logout() {
    removeKey(STORAGE_KEYS.session);
    dispatch({ type: "LOGOUT" });
  }

  const value = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: Boolean(state.user),
      loading: state.loading,
      initializing: state.initializing,
      error: state.error,
      register,
      login,
      logout,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
