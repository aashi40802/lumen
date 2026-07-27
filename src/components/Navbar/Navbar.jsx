import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import Drawer from "../Drawer/Drawer.jsx";
import { useCart } from "../../contexts/CartContext.js";
import { useWishlist } from "../../contexts/WishlistContext.js";
import { useAuth } from "../../contexts/AuthContext.js";
import { useTheme } from "../../contexts/ThemeContext.js";
import "./Navbar.css";

export default function Navbar() {
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { isDark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/products", label: "Products" },
    { to: "/wishlist", label: "Wishlist" },
  ];

  const go = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <header className="navbar glass">
      <div className="navbar__inner container">
        <Link to="/" className="brand" aria-label="Lumen home">
          <span className="brand__mark" aria-hidden="true"><Icon name="logo" size={22} /></span>
          <span className="brand__name">Lumen</span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `navlink ${isActive ? "is-active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            <Icon name={isDark ? "sun" : "moon"} />
          </button>

          <Link to="/wishlist" className="icon-btn navbar__badgeable" aria-label={`Wishlist, ${wishCount} items`}>
            <Icon name="heart" />
            {wishCount > 0 && <span className="badge" aria-hidden="true">{wishCount}</span>}
          </Link>

          <Link to="/cart" className="icon-btn navbar__badgeable" aria-label={`Cart, ${cartCount} items`}>
            <Icon name="cart" />
            {cartCount > 0 && <span className="badge" aria-hidden="true">{cartCount}</span>}
          </Link>

          <Link to={isAuthenticated ? "/account" : "/login"} className="icon-btn navbar__account" aria-label={isAuthenticated ? "Account" : "Sign in"}>
            <Icon name="user" />
          </Link>

          <button
            type="button"
            className="icon-btn navbar__menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu" side="right">
        <nav className="drawer-nav" aria-label="Mobile">
          {links.map((l) => (
            <button key={l.to} type="button" className="drawer-nav__item" onClick={() => go(l.to)}>
              {l.label}
            </button>
          ))}
          <button type="button" className="drawer-nav__item" onClick={() => go("/cart")}>
            Cart {cartCount > 0 && <span className="muted">({cartCount})</span>}
          </button>
          <button type="button" className="drawer-nav__item" onClick={() => go(isAuthenticated ? "/account" : "/login")}>
            {isAuthenticated ? `Account — ${user?.name?.split(" ")[0] || ""}` : "Sign in"}
          </button>
        </nav>
      </Drawer>
    </header>
  );
}
