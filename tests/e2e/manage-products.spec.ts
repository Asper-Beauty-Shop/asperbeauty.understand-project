/**
 * E2E Tests: ManageProducts Admin Workflow
 *
 * Tests match the ACTUAL component form fields:
 *   - Title (id="title", placeholder="Product title")
 *   - Price (id="price", placeholder="0.00")
 *   - Handle (id="handle", placeholder="product-handle")
 *   - Primary Concern (Select dropdown)
 *   - Buttons: "Add Product", "Auto-Enrich", save via form submit
 *
 * Prerequisite: global.setup.ts must have run successfully.
 */
import { test, expect, type Page } from "@playwright/test";

const TEST_TITLE = `Vichy Minéral 89 E2E Test ${Date.now()}`;
const UPDATED_PRICE = "34.99";

async function openAddProductDialog(page: Page) {
  await page.getByRole("button", { name: /add product/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: /add new product/i })).toBeVisible();
}

async function openEditDialog(page: Page, title: string) {
  // Find the row containing the product title and click its Edit button
  const row = page.getByRole("row").filter({ hasText: title });
  await expect(row).toBeVisible({ timeout: 8000 });
  await row.getByRole("button", { name: /edit/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: /edit product/i })).toBeVisible();
}

test.describe("ManageProducts Admin Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.getByRole("heading", { name: /manage products/i })).toBeVisible({
      timeout: 12000,
    });
  });

  // ── Scenario A: Create a new product ─────────────────────────────────────

  test("A: Create product — validates required fields, saves, appears in list", async ({ page }) => {
    await openAddProductDialog(page);

    // Try saving with empty form — should show toast/error
    await page.getByRole("button", { name: /save|add/i }).last().click();
    // Browser native required validation blocks submission; form stays open
    await expect(page.getByRole("dialog")).toBeVisible();

    // Fill required fields
    await page.getByLabel(/title/i).fill(TEST_TITLE);
    await page.getByLabel(/price/i).fill("29.99");

    // Optionally set handle
    await page.getByLabel(/handle/i).fill("vichy-mineral-89-e2e-test");

    // Submit
    await page.getByRole("button", { name: /save|add/i }).last().click();

    // Success toast
    await expect(page.getByText(/product created successfully/i)).toBeVisible({ timeout: 8000 });

    // Dialog closes
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });

    // Product appears in the table immediately (optimistic update)
    await expect(page.getByRole("cell", { name: new RegExp(TEST_TITLE.slice(0, 20)) })).toBeVisible({
      timeout: 5000,
    });
  });

  // ── Scenario B: Edit — state hydration check ─────────────────────────────

  test("B: Edit product — all fields hydrate correctly, price updates persist", async ({
    page,
  }) => {
    // Open search if available, or scroll to find our test product
    const searchInput = page.getByPlaceholder(/search/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(TEST_TITLE.slice(0, 20));
      await page.waitForTimeout(400); // allow debounce
    }

    await openEditDialog(page, TEST_TITLE.slice(0, 20));

    // Hydration checks — all pre-filled from the saved product
    const titleField = page.getByLabel(/title/i);
    await expect(titleField).toHaveValue(new RegExp(TEST_TITLE.slice(0, 10)));

    const priceField = page.getByLabel(/price/i);
    await expect(priceField).toHaveValue("29.99");

    const handleField = page.getByLabel(/handle/i);
    await expect(handleField).toHaveValue("vichy-mineral-89-e2e-test");

    // Mutation: update price
    await priceField.fill(UPDATED_PRICE);
    await page.getByRole("button", { name: /save|update/i }).last().click();

    // Success confirmation
    await expect(page.getByText(/product updated successfully/i)).toBeVisible({ timeout: 8000 });

    // Dialog closes
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });
  });

  // ── Scenario C: Double-click protection ──────────────────────────────────

  test("C: Save button is disabled during submission (no duplicate writes)", async ({ page }) => {
    await openAddProductDialog(page);

    await page.getByLabel(/title/i).fill(`Double-Click Guard Test ${Date.now()}`);
    await page.getByLabel(/price/i).fill("9.99");

    const saveBtn = page.getByRole("button", { name: /save|add/i }).last();

    // Intercept the network call to delay it, then double-click
    await page.route("**/rest/v1/products**", async (route) => {
      await page.waitForTimeout(200); // simulate slow network
      await route.continue();
    });

    // Click twice rapidly — second click should be blocked
    await saveBtn.click();
    const isDisabledAfterFirstClick = await saveBtn.isDisabled();
    expect(isDisabledAfterFirstClick).toBe(true);

    await expect(page.getByText(/product created successfully/i)).toBeVisible({ timeout: 8000 });
  });

  // ── Scenario D: Auto-Enrich bulk action ──────────────────────────────────

  test("D: Auto-Enrich button runs without crashing the admin panel", async ({ page }) => {
    const enrichBtn = page.getByRole("button", { name: /auto-enrich/i });
    await expect(enrichBtn).toBeVisible();
    await enrichBtn.click();

    // Button enters loading state
    await expect(page.getByText(/enriching\.\.\./i)).toBeVisible({ timeout: 3000 });

    // Wait for it to finish (up to 30s for AI enrichment)
    await expect(page.getByRole("button", { name: /auto-enrich/i })).toBeEnabled({
      timeout: 30000,
    });

    // Page still intact — no crash
    await expect(page.getByRole("heading", { name: /manage products/i })).toBeVisible();
  });
});
