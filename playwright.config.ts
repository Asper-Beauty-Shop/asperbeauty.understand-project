import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // admin tests are sequential to avoid DB race conditions
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Auth state is stored globally and reused
    storageState: "tests/e2e/.auth/admin.json",
  },
  projects: [
    // Setup project — runs first, logs in and saves auth state
    {
      name: "setup",
      testMatch: "**/global.setup.ts",
      use: { storageState: undefined }, // no auth yet for setup
    },
    // Actual tests — depend on setup
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
  // Start the Vite dev server automatically before tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
