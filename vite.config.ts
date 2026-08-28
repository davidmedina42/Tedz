//updated vite configuration package
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackStartVite } from "@tanstack/start-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackStartVite({
      server: { entry: "server" },
    }),
    react(),
  ],
  server: {
    port: 8080,
    host: true,
  },
});
