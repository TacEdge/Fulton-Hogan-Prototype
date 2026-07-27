import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* The site is served from a subdirectory on GitHub Pages and from the root
   locally, so the base path is an input rather than a constant. Everything that
   resolves an asset at runtime goes through import.meta.env.BASE_URL. */
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { port: 5180, open: false },
});
