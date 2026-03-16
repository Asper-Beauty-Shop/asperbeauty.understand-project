import { test, expect } from '@playwright/test';

test.describe('Science Meets Style - Mobile Viewport Layout Validation', () => {

  // 1. Force a strict mobile viewport (e.g., standard 375px width)
  test.use({ viewport: { width: 375, height: 667 } });

  test('Brand logos must maintain strict spatial separation without overlapping', async ({ page }) => {
    
    // Navigate to the page containing the section
    await page.goto('/');

    // 2. Isolate the target elements
    // We target the section by text, then grab all images within it
    const logos = page.locator('section:has-text("Science Meets Style") img');
    
    // Wait for the elements to be attached to the DOM
    await expect(logos.first()).toBeVisible();
    const logoCount = await logos.count();
    
    // Ensure we have logos to test
    expect(logoCount).toBeGreaterThan(1);

    // 3. Extract exact bounding boxes for every logo
    const boundingBoxes = [];
    for (let i = 0; i < logoCount; i++) {
      const box = await logos.nth(i).boundingBox();
      
      // Ensure the image has actually rendered and has dimensions
      if (box && box.width > 0 && box.height > 0) {
        boundingBoxes.push({ ...box, index: i });
      }
    }

    // 4. Execute the Collision Detection Matrix
    // Compare every box against every other box to guarantee absolute separation
    for (let i = 0; i < boundingBoxes.length; i++) {
      for (let j = i + 1; j < boundingBoxes.length; j++) {
        const boxA = boundingBoxes[i];
        const boxB = boundingBoxes[j];

        // AABB (Axis-Aligned Bounding Box) collision logic
        const isOverlapping = !(
          boxA.x + boxA.width <= boxB.x ||  // A is entirely left of B
          boxA.x >= boxB.x + boxB.width ||  // A is entirely right of B
          boxA.y + boxA.height <= boxB.y || // A is entirely above B
          boxA.y >= boxB.y + boxB.height    // A is entirely below B
        );

        // If this fails, Playwright will pinpoint exactly which layout broke
        expect(isOverlapping).toBe(false, `Overlap detected between logo ${boxA.index} and logo ${boxB.index}`);
      }
    }
  });
});
