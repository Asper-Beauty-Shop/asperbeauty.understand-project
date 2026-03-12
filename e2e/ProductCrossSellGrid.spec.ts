import { test, expect } from '@playwright/test';

test.describe('Product Cross-Sell Grid - AI-Proof QA', () => {
  test.beforeEach(async ({ page }) => {
    // 4. Mock network request to simulate Supabase delay and verify loading states
    await page.route('**/rest/v1/products*', async (route) => {
      // Simulate a 1-second network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Clinical Retinol 1.0 High-Potency', price: '45.00 JOD', imageUrl: '/placeholder.svg', category: 'Targeted Serums' },
          { id: '2', title: 'Hyaluronic Barrier Repair Complex', price: '32.50 JOD', imageUrl: '/placeholder.svg', category: 'Daily Hydration' },
        ])
      });
    });

    // Navigate to the page containing the component (adjust URL as needed)
    await page.goto('/product/example');
  });

  test('mathematically proves grid elements do not overlap on mobile (375px)', async ({ page }) => {
    // Set viewport to exact 375px mobile dimension
    await page.setViewportSize({ width: 375, height: 812 });

    // 1. Target elements strictly via data-testid
    const gridSection = page.getByTestId('cross-sell-section');
    await expect(gridSection).toBeVisible();

    const cards = await page.getByTestId(/product-card-.+/).all();
    expect(cards.length).toBeGreaterThan(0);

    // 2. Extract bounding boxes to mathematically prove elements do not overlap
    const boundingBoxes = [];
    for (const card of cards) {
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      boundingBoxes.push(box!);
    }

    // Check for overlap mathematically across all extracted bounding boxes
    for (let i = 0; i < boundingBoxes.length; i++) {
      for (let j = i + 1; j < boundingBoxes.length; j++) {
        const box1 = boundingBoxes[i];
        const box2 = boundingBoxes[j];
        
        const isOverlapping = !(
          box1.x + box1.width <= box2.x ||
          box2.x + box2.width <= box1.x ||
          box1.y + box1.height <= box2.y ||
          box2.y + box2.height <= box1.y
        );

        // Fail the test if any two bounding boxes mathematically overlap
        expect(isOverlapping).toBe(false);
      }
    }
  });

  test('verifies RGB values match brand hex codes exactly', async ({ page }) => {
    const gridSection = page.getByTestId('cross-sell-section');
    
    // 3. Extract window.getComputedStyle to verify RGB values
    // Deep Maroon: #800020 -> rgb(128, 0, 32)
    // Soft Ivory: #F8F8FF -> rgb(248, 248, 255)

    const sectionBgColor = await gridSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // Verifying Soft Ivory background
    expect(sectionBgColor).toBe('rgb(248, 248, 255)'); 

    // Assuming the first button is rendered
    const ctaButton = page.getByTestId('cta-add-regimen-1');
    const buttonTextColor = await ctaButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    // Verifying Deep Maroon text color
    expect(buttonTextColor).toBe('rgb(128, 0, 32)');
  });
});
