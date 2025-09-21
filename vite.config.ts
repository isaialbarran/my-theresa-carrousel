/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// Development configuration
export default defineConfig({
  plugins: [react()],
  server: {
    middlewareMode: true,
  },
  appType: "custom",
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "zustand"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
