import React from "react";
import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

export default function NotFoundPage() {
  useDocumentTitle("Page not found");
  return (
    <div className="container notfound">
      <div className="fade-up">
        <p className="notfound__code">404</p>
        <h1 className="h2">This page doesn't exist</h1>
        <p className="muted mt-2">The link may be broken, or the page may have moved.</p>
        <div className="mt-6">
          <Link to="/" className="btn btn--primary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
