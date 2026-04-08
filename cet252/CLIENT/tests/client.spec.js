const { test, expect } = require('@playwright/test');

test('loads albums from API', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#status')).toContainText('Loaded');
  await expect(page.locator('[data-testid="album-card"]').first()).toBeVisible();
});

test('shows API error handling message', async ({ page }) => {
  await page.goto('/');
  await page.click('#simulateErrorBtn');
  await expect(page.locator('#status')).toContainText('Error:');
});
