import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(Date.now()),
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
    watch: {
      usePolling: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
      "/_": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
    },
  },
  base: "/",
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    reporters: ["verbose"],
    include: ["src/tests/*"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*"],
      exclude: [],
    },
  },
  css: {
    transformer: "postcss",
  },
  build: {
    cssMinify: "esbuild",
    sourcemap: true,
    outDir: "../pb_public",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router)[\\/]/.test(
                id,
              )
            ) {
              return "vendor-react";
            }
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("react-icons")) return "vendor-icons";
            if (id.includes("imagekitio-react") || id.includes("imghash"))
              return "vendor-media";
            if (
              id.includes("lodash") ||
              id.includes("idb") ||
              id.includes("web-vitals")
            )
              return "vendor-utils";
            return "vendor-other"; // tout le reste de node_modules
          }
        },
      },
    },
  },
});
