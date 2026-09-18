import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    outDir: "../backend/public",
    // backend/public contiene imágenes del catálogo que no forman parte del
    // publicDir de Vite. No vaciarlo durante el build.
    emptyOutDir: false,
    assetsDir: "assets"
  },
  preview: {
    allowedHosts: ["topotours.com", "www.topotours.com", "topotours.ar", "www.topotours.ar"]
  }
});
