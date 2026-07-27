import React from "react";
import Icon from "../Icon/Icon.jsx";
import "./Hero.css";

// Restrained hero — a clear value proposition without pushing products far
// down the page. Links jump to the catalogue section below.
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <p className="eyebrow">Considered goods</p>
        <h1 id="hero-title" className="hero__title">
          A calmer way to shop the everyday essentials.
        </h1>
        <p className="hero__lede muted">
          A curated demo catalogue across tech, apparel, and accessories — with a fast,
          accessible storefront built to feel like a real product.
        </p>
        <div className="hero__actions">
          <a href="#catalog" className="btn btn--primary btn--lg">
            Browse the catalogue <Icon name="arrow-right" size={18} />
          </a>
          <a href="#catalog" className="btn btn--ghost btn--lg">View featured</a>
        </div>
      </div>
    </section>
  );
}
