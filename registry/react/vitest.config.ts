import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // Activates the browser simulation, and setupFiles loads our configuration before the tests.
    setupFiles: ["./test/setup.ts"],
  },
});
