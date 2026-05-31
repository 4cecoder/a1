import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: [
      "tests/unit/hero-image.test.tsx",
      "tests/unit/server-actions.test.ts",
      "tests/unit/booking-flow.test.tsx",
      "tests/unit/admin-dashboard.test.tsx",
      "tests/unit/admin-schedule.test.tsx",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
