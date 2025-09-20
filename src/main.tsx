import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { resolveRoutePath, type AppRoute } from "./presentation/routing/routes";

declare global {
  interface Window {
    __INITIAL_ROUTE__?: AppRoute;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container element not found");
}

const initialRoute: AppRoute =
  window.__INITIAL_ROUTE__ ?? resolveRoutePath(window.location.pathname);

hydrateRoot(
  container,
  <StrictMode>
    <BrowserRouter>
      <App initialRoute={initialRoute} />
    </BrowserRouter>
  </StrictMode>,
);

delete window.__INITIAL_ROUTE__;
