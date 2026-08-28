import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createTanStackStartPlugin } from "@tanstack/start-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    TanStackRouterVite({ autoCodeSplitting: true }),
    createTanStackStartPlugin({
      server: {
        entry: "src/server.ts",
      },
    }),
    react(),
  ],
  server: {
    port: 8080,
    host: true,
  },
  build: {
    target: "esnext",
  },
});
