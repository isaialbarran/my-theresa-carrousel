import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

declare global {
  interface Window {
    __INITIAL_ROUTE__?: string;
  }
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container element not found");
}

const initialRoute = window.__INITIAL_ROUTE__ ?? window.location.pathname;

hydrateRoot(
  container,
  <StrictMode>
    <BrowserRouter>
      <App initialRoute={initialRoute} />
    </BrowserRouter>
  </StrictMode>,
);

delete window.__INITIAL_ROUTE__;
