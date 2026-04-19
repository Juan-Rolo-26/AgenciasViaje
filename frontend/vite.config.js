import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    outDir: "../backend/public",
    emptyOutDir: false,
    assetsDir: "assets"
  },
  preview: {
    allowedHosts: ["topotours.com", "www.topotours.com", "topotours.ar", "www.topotours.ar"]
  }
});
