import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

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
});
