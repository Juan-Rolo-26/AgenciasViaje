import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./assets/styles.css";
import "./assets/enhancements.css";
import "./assets/card-enhancements.css";
import "./assets/card-fixes.css";
import "./assets/thumbnail-animation.css";
import "./assets/excursion-details-improvements.css";
import "./assets/packages-improvements.css";
import "./assets/entry-animations.css";
import "./assets/detail-premium.css";
import "./assets/filters-premium.css";
import "./assets/mobile-improvements.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
