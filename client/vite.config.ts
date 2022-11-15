import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "src", replacement: resolve(__dirname, "./src") },
      { find: "style", replacement: resolve(__dirname, "./src/styles") },
    ],
  },
});
