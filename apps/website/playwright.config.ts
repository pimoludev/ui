import { defineConfig, devices } from "@playwright/test";

const port = process.env.PIMOLU_TEST_PORT ?? "3001";
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: !process.env.CI,
  workers: process.env.CI ? 1 : 3,
  retries: 0,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL, viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
    { name: "webkit", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: { command: `pnpm exec next start -p ${port}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 120000 },
});
