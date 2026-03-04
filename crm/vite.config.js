import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/admin/",
    plugins: [react()],
    server: {
        port: 5200,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true
            },
            "/assets": {
                target: "http://localhost:3000",
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: "../backend/public/admin",
        emptyOutDir: true
    }
});
