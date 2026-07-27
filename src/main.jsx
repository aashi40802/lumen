import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.js";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/utilities.css";
import "./styles/pages.css";

// Match the router basename to Vite's base (e.g. "/lumen/" on GitHub Pages,
// "" locally) so links and routes resolve correctly wherever it's hosted.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
