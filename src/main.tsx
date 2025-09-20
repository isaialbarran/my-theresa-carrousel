import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { resolveRoute, type Route } from "./application/store/appStore";

declare global {
  interface Window {
    __INITIAL_ROUTE__?: Route;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container element not found");
}

const initialRoute = window.__INITIAL_ROUTE__ ?? resolveRoute(window.location.pathname);

hydrateRoot(
  container,
  <StrictMode>
    <App initialRoute={initialRoute} />
  </StrictMode>
);

delete window.__INITIAL_ROUTE__;
