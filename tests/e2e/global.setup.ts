/**
 * Playwright Global Setup — Admin Authentication
 *
 * Logs in via the /auth page using PLAYWRIGHT_ADMIN_EMAIL and
 * PLAYWRIGHT_ADMIN_PASSWORD env vars, then saves the browser
 * storage state so subsequent tests skip the login flow.
 *
 * Usage: set these in a .env.test or in your CI secrets.
 */
import { test as setup, expect } from "@playwright/test";
import path from "path";

const AUTH_FILE = path.join(__dirname, ".auth/admin.json");

setup("authenticate as admin", async ({ page }) => {
  const email = process.env.PLAYWRIGHT_ADMIN_EMAIL;
  const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set PLAYWRIGHT_ADMIN_EMAIL and PLAYWRIGHT_ADMIN_PASSWORD environment variables before running E2E tests."
    );
  }

  await page.goto("/auth");

  // Fill email and password
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in|log in/i }).click();

  // Wait for redirect away from /auth
  await expect(page).not.toHaveURL(/\/auth/, { timeout: 10000 });

  // Navigate to admin panel to verify access
  await page.goto("/admin/products");
  await expect(page.getByRole("heading", { name: /manage products/i })).toBeVisible({ timeout: 10000 });

  // Save authenticated state for all subsequent tests
  await page.context().storageState({ path: AUTH_FILE });
});
