import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: "src/entry-server.tsx",
    outDir: "dist/server",
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom", "zustand"],
      output: {
        format: "es",
        entryFileNames: "[name].js",
      },
    },
    minify: false,
    sourcemap: true,
    target: "node18",
  },
  ssr: {
    noExternal: [],
  },
});