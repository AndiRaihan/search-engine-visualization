import { test, expect } from '@playwright/test';

test.describe('Search Engine Simulation Smoke Tests', () => {
  test('primary classroom flow: load, edit, navigate, reset, and compare', async ({ page }) => {
    // 1. Load the app
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Search Engine Lab', level: 1 })).toBeVisible();

    // 2. Select a scenario
    // Click the scenario trigger select dropdown
    await page.click('#scenario-select');
    // Select the "Common Words Are Noisy" scenario from the options list
    await page.click('text="Common Words Are Noisy"');
    
    // Verify the goal is shown
    await expect(page.locator('text="Goal: “The” appears everywhere and should not dominate the results."')).toBeVisible();

    // 3. Edit query and verify edit status
    await expect(page.locator('text="Using scenario defaults"')).toBeVisible();
    await page.fill('#query-input', 'apple phone');
    await expect(page.locator('text="Changes made to defaults"')).toBeVisible();

    // 4. Click Reset and cancel/confirm reset
    await page.click('button:has-text("Reset scenario")');
    // Confirm dialog is open
    await expect(page.getByRole('heading', { name: 'Reset edited scenario?', exact: true })).toBeVisible();
    
    // Click "Keep edits" to cancel reset
    await page.click('text="Keep edits"');
    // Check that edits are still there
    await expect(page.locator('#query-input')).toHaveValue('apple phone');
    
    // Now actually reset
    await page.click('button:has-text("Reset scenario")');
    await page.getByRole('alertdialog').getByRole('button', { name: 'Reset scenario' }).click();
    // Verify query is restored to original default
    await expect(page.locator('#query-input')).toHaveValue('the iphone');

    // 5. Navigate through steps by buttons
    await page.click('text="Start Search"');
    await expect(page.getByRole('heading', { name: 'Tokenization', exact: true })).toBeVisible();

    await page.click('text="Next step"');
    await expect(page.getByRole('heading', { name: 'Word Matching', exact: true })).toBeVisible();

    await page.click('text="Previous step"');
    await expect(page.getByRole('heading', { name: 'Tokenization', exact: true })).toBeVisible();

    // 6. Navigation via keyboard shortcuts (Alt+ArrowRight / Alt+ArrowLeft)
    // Click heading to ensure focus is outside editable input fields
    await page.getByRole('heading', { name: 'Tokenization', exact: true }).click();
    await page.keyboard.press('Alt+ArrowRight');
    await expect(page.getByRole('heading', { name: 'Word Matching', exact: true })).toBeVisible();

    await page.keyboard.press('Alt+ArrowLeft');
    await expect(page.getByRole('heading', { name: 'Tokenization', exact: true })).toBeVisible();

    // 7. Autoplay (Run All) cancellation
    // Go to Word Matching step to start
    await page.click('text="Next step"');
    await expect(page.getByRole('heading', { name: 'Word Matching', exact: true })).toBeVisible();

    // Start Run All via Alt+Shift+ArrowRight
    await page.keyboard.press('Alt+Shift+ArrowRight');
    // It should start playing. Verify it automatically advances to Term Frequency (step 3)
    await expect(page.getByRole('heading', { name: 'Term Frequency', exact: true })).toBeVisible({ timeout: 3000 });

    // Cancel by manual navigation (click Previous step)
    await page.click('text="Previous step"');
    await expect(page.getByRole('heading', { name: 'Word Matching', exact: true })).toBeVisible();
    
    // Wait past one scheduled interval (~800ms) to ensure it stays cancelled
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'Word Matching', exact: true })).toBeVisible();

    // Let's test cancellation by editing the query
    await page.click('text="Run All"'); // Start autoplay again
    await expect(page.getByRole('heading', { name: 'Term Frequency', exact: true })).toBeVisible({ timeout: 3000 });
    
    // Now edit the query text area
    await page.fill('#query-input', 'apple phone');
    // Autoplay should be cancelled immediately. Wait to verify it does not advance further
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'Term Frequency', exact: true })).toBeVisible();

    // 8. Go to Final Comparison step and check elements
    // Reset scenario to defaults
    await page.click('button:has-text("Reset scenario")');
    await page.getByRole('alertdialog').getByRole('button', { name: 'Reset scenario' }).click();
    await page.click('text="Start Search"');

    // Run autoplay to the end
    await page.click('button:has-text("Run All")');
    await expect(page.getByRole('heading', { name: 'Final Comparison', exact: true })).toBeVisible({ timeout: 15000 });

    // Verify side-by-side rankings headings
    await expect(page.getByRole('heading', { name: 'Keyword ranking', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Semantic ranking', exact: true })).toBeVisible();

    // Check rank movement symbols/labels are visible
    await expect(page.locator('text="▲"').first()).toBeVisible();

    // Toggle semantic metric
    await expect(page.getByRole('button', { name: 'Euclidean distance' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cosine similarity' })).toBeVisible();

    // Switch to Cosine similarity
    await page.click('button:has-text("Cosine similarity")');
    
    // Click a document row in Semantic ranking to inspect evidence
    // In "Semantic ranking", there is a rank entry we can click (e.g. containing Rank 1 · D1 or similar)
    await page.click('role=option >> text=D1');
    await expect(page.getByRole('heading', { name: 'Detailed Comparison: D1', exact: true })).toBeVisible();
    
    // Verify detailed coordinates and math substitution
    await expect(page.getByText('Query coords:')).toBeVisible();
    await expect(page.getByText('Cosine Similarity =')).toBeVisible();
  });

  test('reduced motion autoplay bypass', async ({ browser }) => {
    // Create a context with prefers-reduced-motion enabled
    const context = await browser.newContext({
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto('/');

    await page.click('text="Start Search"');
    await expect(page.getByRole('heading', { name: 'Tokenization', exact: true })).toBeVisible();

    // Click Run All
    await page.click('button:has-text("Run All")');
    
    // Should instantly jump to Final Comparison step
    await expect(page.getByRole('heading', { name: 'Final Comparison', exact: true })).toBeVisible();

    await context.close();
  });
});
