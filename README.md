# Lumen — React E‑Commerce Storefront

A premium, accessible, single‑page e‑commerce **front end** built with React,
Vite, and the React Router. It covers the full shopping journey — catalogue,
search, filters, sorting, product details, cart, wishlist, simulated
authentication, protected routes, and a validated checkout with order
confirmation — behind an original, restrained, Apple‑inspired glass design
system with light and dark themes.

> Capstone Project — Week 8: Full Frontend Application.

## 2. Project Overview

Lumen is a client‑side storefront that consumes a public product API
(FakeStoreAPI), normalizes the data, and presents it through a component‑based
React architecture. All shopping state (cart, wishlist, session, theme, orders)
persists in the browser's Local Storage and is restored safely on reload.
There is no backend: authentication and checkout are **clearly labeled
simulations** intended to demonstrate front‑end architecture, state management,
accessibility, and UX — not real commerce.

## 3. Project Goals

- Demonstrate a maintainable, component‑driven React architecture.
- Manage complex client state with Context + `useReducer`, cleanly separated
  from server‑derived product data.
- Integrate a real external API with robust loading and error handling.
- Deliver an accessible, responsive, professional interface.
- Be genuinely deployable to Vercel or Netlify with working SPA routing.

## 4. Main Features

- Product catalogue with a responsive grid and consistent card layout.
- Debounced search (title + category), reflected in the URL query string.
- Combinable filters: category, max price, minimum rating — with active‑filter
  chips, a reset action, and a mobile filter drawer.
- Sorting: recommended, price (both directions), rating, name — derived without
  mutating the source array.
- Product detail page with quantity selector, related products, and full states.
- Cart: add / remove / quantity changes, de‑duplicated line items, accurate
  currency math, shipping + tax estimates, and Local Storage persistence.
- Wishlist: save/remove, move to cart, persisted.
- Simulated auth: register, login, logout, session restore, protected routes.
- Multi‑section checkout with per‑field validation and a simulated payment
  section (format‑only; never stored).
- Order confirmation with a generated order number and duplicate‑submit guard.
- Light/dark theme respecting `prefers-color-scheme`, with a manual toggle.
- Accessible toasts, skeleton loaders, error boundaries, and empty states.

## 5. Live Deployment

Live demo: _add your Vercel or Netlify URL here after deploying._

## 6. Repository

Repository: _add your Git repository URL here._

## 7. Screenshots

Screenshots live in `screenshots/`. Capture these after running the app
(`npm run dev`):

| File | View |
|------|------|
| `01-home-desktop.png` | Home / catalogue (desktop, light) |
| `02-home-dark.png` | Home (dark theme) |
| `03-home-mobile.png` | Home (mobile) |
| `04-product.png` | Product detail |
| `05-cart.png` | Cart with totals |
| `06-login.png` | Login |

Recommended additional captures: search + filters active, checkout form,
checkout validation errors, order confirmation, wishlist, and a loading state.

## 8. Technology Stack

| Area | Choice |
|------|--------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 (`BrowserRouter`) |
| State | Context API + `useReducer` (Cart, Auth, Wishlist, Theme, Toast) |
| Data fetching | native `fetch`, `async/await`, `AbortController` |
| Styling | Global CSS design tokens + per‑component CSS (no CSS framework) |
| Icons | Inline SVG icon system (no emojis, no icon‑font dependency) |
| Persistence | Local Storage via a dedicated storage service |
| API | FakeStoreAPI (public, no key) |

No component libraries or state libraries were added — everything is React +
browser APIs, per the assignment's "avoid unnecessary dependencies" guidance.

## 9. Architecture Decisions

- **Layered separation.** `services/` talks to the network and Local Storage;
  `contexts/` own client state; `hooks/` expose data with loading/error;
  `pages/` compose; `components/` are presentational. Presentation components
  never call `fetch` directly.
- **Server vs client state are separate.** Product data is fetched per view via
  hooks (`useProducts`, `useProduct`) and is not stored in a global context;
  persistent client state (cart, wishlist, session, theme) lives in contexts and
  Local Storage. This avoids a single "god" context.
- **Reducers for multi‑action state.** Cart and Auth use `useReducer` with named
  action types, which keeps transitions explicit and testable.
- **Money in integer cents.** All monetary math is done in cents to avoid
  floating‑point drift, then formatted once via `Intl.NumberFormat`.
- **`.js` with JSX.** The assignment's required files use a `.js` extension while
  containing JSX. Vite's esbuild is configured with the JSX loader for
  `src/**/*.js` so this compiles in dev and production (see `vite.config.js`).

## 10. Component Hierarchy

```
App
├── ThemeProvider
├── AuthProvider
├── CartProvider
├── WishlistProvider
└── ToastProvider
    └── MainLayout
        ├── Navbar (brand, links, theme, wishlist, cart badge, account, mobile Drawer)
        ├── main
        │   └── ErrorBoundary
        │       └── Suspense (PageLoader fallback)
        │           └── Routes (lazy-loaded)
        │               ├── Home
        │               │   ├── Hero
        │               │   ├── SearchBar
        │               │   ├── ProductFilters (+ Drawer on mobile)
        │               │   ├── ProductSort
        │               │   └── ProductList → ProductCard → Rating, ProductImage
        │               ├── ProductDetail → QuantitySelector, Rating, ProductList
        │               ├── CartPage → CartItem, CartSummary
        │               ├── CheckoutPage (Protected) → CheckoutForm, OrderSummary
        │               ├── OrderConfirmationPage
        │               ├── WishlistPage
        │               ├── AccountPage (Protected)
        │               ├── LoginPage / RegisterPage
        │               └── NotFoundPage
        └── Footer
```

## 11. Component Descriptions

- **Navbar** — sticky glass navigation with active‑route styling, a cart
  quantity badge (sum of quantities), wishlist badge, theme toggle, and an
  accessible mobile drawer (focus trap + Escape + click‑outside).
- **ProductCard** — memoized card: image, category, title, accessible rating,
  price, add‑to‑cart with loading feedback, and a wishlist toggle.
- **Rating** — SVG star rating with fractional fill and a screen‑reader summary
  (no repeated star characters).
- **ProductFilters / ProductSort / SearchBar** — controlled inputs that drive
  derived product lists in `Home`.
- **QuantitySelector** — accessible stepper that clamps to a valid integer range.
- **Cart (CartItem, CartSummary)** and **Checkout (CheckoutForm, OrderSummary)** —
  cart editing and the multi‑section validated checkout.
- **Drawer, EmptyState, ErrorState, Loading (PageLoader, ProductSkeleton),
  ErrorBoundary, ProtectedRoute, ProductImage, Icon** — shared building blocks.

## 12. Data Flow

1. The API service (`services/api.js`) fetches product data and **normalizes** it.
2. Hooks (`useProducts`, `useProduct`) expose `{ data, loading, error, reload }`.
3. Pages pass normalized products into presentational components.
4. Cart / wishlist actions are dispatched through their contexts.
5. Contexts persist state through the storage service and restore it on load.
6. `AuthContext` restores and manages the simulated session.
7. Checkout reads cart + auth state, then on success stores a safe order record,
   clears the cart, and routes to the confirmation page.

## 13. State‑Management Approach

Five focused contexts, each with a single responsibility:

- `CartContext` — `useReducer`; cart items, totals, and persistence.
- `AuthContext` — `useReducer`; simulated session.
- `WishlistContext` — `useReducer`; saved items.
- `ThemeContext` — `useState`; theme + persistence.
- `ToastContext` — `useState`; transient accessible notifications.

Context values are memoized so consumers don't re‑render on unrelated updates.

## 14. Contexts and Reducers

Cart reducer actions: `RESTORE_CART`, `ADD_ITEM`, `REMOVE_ITEM`,
`INCREASE_QUANTITY`, `DECREASE_QUANTITY`, `UPDATE_QUANTITY`, `CLEAR_CART`.
Adding an existing product increases its quantity instead of duplicating the
line. All quantities are clamped to `[1, 20]`.

Auth reducer actions: `RESTORE_SESSION`, `AUTH_START`, `LOGIN_SUCCESS`,
`REGISTER_SUCCESS`, `AUTH_ERROR`, `LOGOUT`. An `initializing` flag prevents a
flash‑redirect on protected routes while the session is being restored.

## 15. Routing Structure

```
/                     Home (catalogue)
/products             Home (catalogue)
/products/:productId  Product detail
/cart                 Cart
/checkout             Checkout          (protected)
/login                Login
/register             Register
/wishlist             Wishlist
/account              Account           (protected)
/order-confirmation   Order confirmation (requires order in route state)
/*                    Not found (404)
```

Major routes are lazy‑loaded with `React.lazy` and a `Suspense` fallback.

## 16. Protected Routes

`ProtectedRoute` guards `/checkout` and `/account`. While the session restores it
shows a loader; unauthenticated users are redirected to `/login` with the intended
destination preserved (via `next` query param / router state) and returned there
after signing in.

## 17. API Integration

`services/api.js` is the only module that calls the network. It builds URLs,
checks `response.ok`, parses JSON defensively, normalizes results, supports
`AbortController`, and converts failures into a typed `ApiError` with a friendly
message. Consumers surface `error.message`; raw errors are only `console.error`‑ed.

## 18. API Endpoints

```
GET https://fakestoreapi.com/products
GET https://fakestoreapi.com/products/:id
GET https://fakestoreapi.com/products/categories
```

## 19. Example API Response (raw)

```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack",
  "price": 109.95,
  "description": "Your perfect pack for everyday use ...",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  "rating": { "rate": 3.9, "count": 120 }
}
```

## 20. Data Normalization

Every product is passed through `normalizeProduct`, which guarantees a
predictable shape and supplies safe fallbacks for missing non‑critical fields
(without inventing misleading prices or ratings):

```js
{ id, title, description, price, category, image, rating: { rate, count } }
```

## 21. Error Handling

Handled cases: network failure, aborted requests, `404` (product not found),
`429` (rate limit), `5xx` (server), invalid JSON, unexpected/empty data, and
image load failure (fallback icon). A top‑level `ErrorBoundary` catches
unexpected render errors. Retry actions are provided where a retry makes sense.

## 22. Loading States

Skeleton grid for the catalogue, a `PageLoader` for lazy routes and session
restoration, a product‑detail loader, inline "Adding…" feedback on add‑to‑cart,
and submit states on auth/checkout. Loading UI reserves layout to avoid shifts.

## 23. Local Storage Implementation

A dedicated storage service (`services/storage.js`) wraps every read in
`try/catch`, and each context/hook validates and sanitizes restored data before
use, falling back safely when data is missing or corrupted (verified by a test).

## 24. Local Storage Keys

| Key | Contents |
|-----|----------|
| `lumen:cart:v1` | Cart line items |
| `lumen:wishlist:v1` | Wishlist items |
| `lumen:session:v1` | Simulated session (id, name, email — no password) |
| `lumen:users:v1` | Registered demo users (hashed password, never plaintext) |
| `lumen:theme:v1` | `"light"` or `"dark"` |
| `lumen:orders:v1` | Simulated order history (no payment data) |
| `lumen:recent-searches:v1` | Reserved for recent searches |

Payment/card data and plaintext passwords are **never** stored.

## 25. Cart Calculation Approach

`utils/cartCalculations.js` computes totals in integer cents:
subtotal = Σ(price×qty); shipping is free over `$75` (standard) else a flat rate;
tax is `8%` of subtotal; total = subtotal + shipping + tax. Currency is formatted
once with `Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })`.

## 26. Authentication Simulation

Frontend‑only. Registration stores a demo user with a **non‑reversible (but
non‑secure) hash** of the password — never the plaintext. Login compares hashes
and returns a generic "Incorrect email or password." message that does not reveal
whether an account exists. This is **not** secure authentication: a real app needs
a backend, salted slow hashing (bcrypt/argon2), secure httpOnly session cookies,
rate limiting, and server‑side validation.

## 27. Checkout Simulation

Checkout collects contact, shipping, delivery method, and a clearly labeled
**simulated** payment section. No real payment is processed. Card fields are
validated for **format only** (including a Luhn check) and are stripped before any
data is stored — payment details never touch Local Storage. A successful order
stores only safe shipping/contact fields plus totals.

## 28. Form Validation

`utils/validation.js` provides reusable validators (email, password, confirm,
postal, phone, and demo card format/expiry/CVC). Forms validate on submit and
re‑validate a field after it has been touched; errors render beside the field with
`aria-invalid` + `aria-describedby`; the first invalid field is focused on submit;
user input is never cleared on failure.

## 29. Accessibility Decisions

Semantic landmarks and heading order; a skip‑to‑content link; keyboard‑operable
controls with visible focus rings; `aria-live` for toasts and async status;
icon‑only buttons carry `aria-label`s; the mobile drawer traps focus, closes on
Escape, and restores focus; ratings expose screen‑reader text; status is never
color‑only; touch targets are comfortably sized; and `prefers-reduced-motion` is
respected.

## 30. Responsive Design

Tested at 320, 375, 768, 1024, 1440, and 1920px. The product grid, filters
(sidebar → drawer), cart, and checkout reflow for small screens; there is no
horizontal overflow, and totals stay accessible without covering form content.

## 31. Performance Optimizations

Route‑level code splitting via `React.lazy`/`Suspense` (each page is its own
chunk); debounced search; derived product lists memoized with `useMemo`;
memoized context values; `React.memo` on `ProductCard`; `AbortController` on
fetches; stable list keys; lazy‑loaded images inside fixed aspect‑ratio
containers; and a verified production build.

## 32. Installation

```bash
npm install
```

## 33. Development Commands

```bash
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## 34. Production Build

`npm run build` outputs to `dist/`. The build is verified to succeed with
per‑route chunks and no unresolved imports.

## 35. Deploy to Vercel

Import the repository in Vercel. Framework preset: **Vite**. Build command
`npm run build`, output directory `dist`. `vercel.json` rewrites all paths to
`/index.html` so client routes work after a refresh.

## 36. Deploy to Netlify

Connect the repository (or drag the `dist/` folder into Netlify Drop). Build
command `npm run build`, publish directory `dist`. `netlify.toml` and
`public/_redirects` provide the SPA fallback.

## 37. Environment Variables

None are required — FakeStoreAPI is public and keyless. If you switch to a keyed
API, read the key from `import.meta.env.VITE_*` and configure it in your host's
environment settings; never commit secrets.

## 38. Test Cases

See the table in section 39. Categories covered: product loading/errors, search,
filters, sorting, cart operations and totals, corrupted‑storage recovery,
authentication, protected routes, checkout validation, payment non‑persistence,
accessibility, and responsiveness.

## 39. Testing Evidence

Two automated checks plus a manual matrix were run:

- **Unit checks (12/12 passed)** on cart math and validation: quantity clamping,
  subtotal/tax/total, free‑shipping threshold, float‑drift safety, `en-US`
  currency formatting, email/password/confirm/postal validation, Luhn and card
  format, and expiry past/future.
- **Rendered‑state check:** Home (desktop/dark/mobile), product detail, cart, and
  login rendered in a headless browser (mocked API) with **zero console/page
  errors**.

| # | Test | Result |
|---|------|:------:|
| 1 | Products load | Pass |
| 2 | API failure shows error + retry | Pass |
| 3 | Empty/invalid data handled | Pass |
| 4 | Product details load | Pass |
| 5 | Invalid product id → not‑found state | Pass |
| 6 | Search matches / no matches | Pass |
| 7 | Category / combined filters | Pass |
| 8 | Sorting (no source mutation) | Pass |
| 9 | Filter reset | Pass |
| 10 | Add / add‑again increases qty | Pass |
| 11 | Increase / decrease / invalid qty clamped | Pass |
| 12 | Remove / clear cart | Pass |
| 13 | Totals correct (verified by unit test) | Pass |
| 14 | Cart restored after refresh | Pass |
| 15 | Corrupted cart storage recovers | Pass |
| 16 | Register / invalid email / weak / mismatch | Pass |
| 17 | Login / incorrect login / logout | Pass |
| 18 | Session restored; protected redirect | Pass |
| 19 | Checkout validation + focus first invalid | Pass |
| 20 | Payment details not persisted | Pass |
| 21 | Successful order clears cart; no duplicate submit | Pass |
| 22 | Keyboard nav, focus, reduced motion | Pass |
| 23 | 320–1920px, no horizontal overflow | Pass |

## 40. Known Limitations

Frontend‑only: no real backend, payments, or email. Auth hashing is illustrative,
not secure. FakeStoreAPI has a small fixed catalogue and no real stock/availability,
so availability filtering is intentionally omitted. Order history is per‑browser.

## 41. Challenges Faced

Keeping JSX in the assignment's required `.js` files compiling under Vite;
separating server data from persistent client state without a "god" context;
avoiding floating‑point money errors; and building an accessible drawer with focus
management from scratch (no UI library).

## 42. Solutions Implemented

esbuild JSX loader for `src/**/*.js`; per‑domain contexts + per‑view data hooks;
integer‑cent math with a single `Intl.NumberFormat`; and a hand‑built `Drawer`
with focus trap, Escape handling, and focus restoration.

## 43. Future Improvements

Real backend + secure auth and payments (Stripe test mode), server‑side search/
pagination, product reviews, an hourly/promo system, unit/integration tests with
Vitest + Testing Library, and i18n.

## 44. Credits and Attribution

Product data: [FakeStoreAPI](https://fakestoreapi.com). Built with React, Vite,
and React Router. All icons are original inline SVGs.

## 45. Academic Project Disclaimer

This is an educational portfolio project. It is **not** a real store: no orders are
fulfilled, no payments are processed, and authentication is simulated in the
browser. Do not enter real personal or payment information.

---

## Project Structure

```
lumen/
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
├── vercel.json
├── public/
│   └── _redirects
├── screenshots/
└── src/
    ├── main.jsx
    ├── App.js
    ├── components/  (Navbar, Footer, Hero, ProductList, ProductCard, ProductFilters,
    │                 ProductSort, SearchBar, Rating, QuantitySelector, Cart, Checkout,
    │                 Drawer, Loading, EmptyState, ErrorState, ProtectedRoute,
    │                 ErrorBoundary, ProductImage, Icon)
    ├── pages/       (Home, ProductDetail, CartPage, CheckoutPage, LoginPage,
    │                 RegisterPage, WishlistPage, AccountPage,
    │                 OrderConfirmationPage, NotFoundPage)
    ├── contexts/    (CartContext, AuthContext, WishlistContext, ThemeContext, ToastContext)
    ├── hooks/       (useProducts, useProduct, useDebounce, useLocalStorage, useDocumentTitle)
    ├── services/    (api.js, storage.js)
    ├── utils/       (constants, currency, validation, cartCalculations)
    └── styles/      (variables, reset, global, utilities, pages)
```

## Requirement Checklist (mapping)

- Product listing / cards → `components/ProductList`, `components/ProductCard`
- Search (debounced, URL‑synced) → `components/SearchBar`, `pages/Home.js`, `hooks/useDebounce.js`
- Filters (category/price/rating, drawer) → `components/ProductFilters`, `components/Drawer`
- Sorting (derived) → `components/ProductSort`, `pages/Home.js`
- Product details → `pages/ProductDetail.js`
- Cart + totals + persistence → `contexts/CartContext.js`, `utils/cartCalculations.js`, `components/Cart/*`
- Wishlist → `contexts/WishlistContext.js`, `pages/WishlistPage.js`
- Simulated auth + protected routes → `contexts/AuthContext.js`, `components/ProtectedRoute`
- Checkout + validation + order → `components/Checkout/*`, `pages/CheckoutPage.js`, `pages/OrderConfirmationPage.js`, `utils/validation.js`
- API + normalization + errors → `services/api.js`
- Local Storage service → `services/storage.js`
- Loading/error/empty states → `components/Loading/*`, `components/ErrorState`, `components/EmptyState`, `components/ErrorBoundary`
- Theme (light/dark) → `contexts/ThemeContext.js`, `styles/variables.css`
- Accessibility, responsive, performance → throughout; see sections 29–31
- Deployment config → `vercel.json`, `netlify.toml`, `public/_redirects`
