import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App.jsx";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <Toaster position="top-right" />

    <App />
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() =>
        console.log("PWA Ready")
      )
      .catch((error) =>
        console.log(error)
      );
  });
}