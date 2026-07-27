import React from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="brand__mark" aria-hidden="true"><Icon name="logo" size={20} /></span>
          <div>
            <p className="footer__name">Lumen</p>
            <p className="muted footer__tag">A demo storefront for a considered, everyday catalogue.</p>
          </div>
        </div>

        <nav className="footer__col" aria-label="Shop">
          <p className="footer__heading">Shop</p>
          <Link to="/products">All products</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </nav>

        <nav className="footer__col" aria-label="Account">
          <p className="footer__heading">Account</p>
          <Link to="/login">Sign in</Link>
          <Link to="/register">Create account</Link>
          <Link to="/account">Your account</Link>
        </nav>

        <div className="footer__col">
          <p className="footer__heading">About</p>
          <p className="muted footer__note">
            This is an educational portfolio project. It is not a real store: no orders are
            fulfilled, no payments are processed, and authentication is simulated in the browser.
          </p>
        </div>
      </div>

      <div className="container footer__bar">
        <p className="muted">© {year} Lumen — demo project.</p>
        <p className="muted">
          Product data from{" "}
          <a href="https://fakestoreapi.com" target="_blank" rel="noopener noreferrer">FakeStoreAPI</a>.
        </p>
      </div>
    </footer>
  );
}
