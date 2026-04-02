import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React — always first load
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor";
          }
          // Routing
          if (id.includes("node_modules/react-router-dom/") || id.includes("node_modules/@remix-run/")) {
            return "router";
          }
          // Supabase client
          if (id.includes("node_modules/@supabase/")) {
            return "supabase";
          }
          // Data fetching
          if (id.includes("node_modules/@tanstack/")) {
            return "query";
          }
          // Animation — large, deferred
          if (id.includes("node_modules/framer-motion/")) {
            return "animations";
          }
          // Charts — large, deferred
          if (id.includes("node_modules/recharts/") || id.includes("node_modules/d3-") || id.includes("node_modules/victory-vendor/")) {
            return "charts";
          }
          // Excel export — large, rarely used
          if (id.includes("node_modules/exceljs/")) {
            return "excel";
          }
          // Icons
          if (id.includes("node_modules/lucide-react/")) {
            return "icons";
          }
          // Radix UI primitives
          if (id.includes("node_modules/@radix-ui/")) {
            return "ui-primitives";
          }
          // Form / validation
          if (id.includes("node_modules/react-hook-form/") || id.includes("node_modules/@hookform/") || id.includes("node_modules/zod/")) {
            return "forms";
          }
          // Markdown renderer
          if (id.includes("node_modules/react-markdown/") || id.includes("node_modules/remark") || id.includes("node_modules/rehype") || id.includes("node_modules/unified") || id.includes("node_modules/hast") || id.includes("node_modules/mdast") || id.includes("node_modules/micromark")) {
            return "markdown";
          }
        },
      },
    },
  },
}));
