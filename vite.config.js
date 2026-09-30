import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "/IncrementalMassRewritten2/",
  plugins: [vue()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    extensions: ['.js', '.vue', '.json']
  },

  server: {
    host: true,
    hmr: { overlay: false },
    watch: { ignored: ["**/node_modules/**", "**/.git/**"] },
  },

  build: {
    outDir: "docs",
    target: "es2020",
    sourcemap: false
  },

  optimizeDeps: {
    include: ["break_eternity.js", "pako", "tween.js", "eruda"],
  },
});