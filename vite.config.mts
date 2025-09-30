import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,  // Changed from 3002 to 5173 - same as working HTML tests
    open: true,
    strictPort: false,
    hmr: {
      port: 5174,  // Changed from 3003 to 5174
    },
    fs: {
      strict: false,
    }
  },
  optimizeDeps: {
    include: ["vue-demi"],
  },
});
