const { test, expect } = require('@playwright/test');

test('loads albums from API', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#status')).toContainText('Showing');
  await expect(page.locator('[data-testid="album-card"]').first()).toBeVisible();
});

test('creates and deletes album from UI', async ({ page }) => {
  const title = `PW Album ${Date.now()}`;
  await page.goto('/');

  await page.click('#addNewBtn');
  await page.fill('#titleInput', title);
  await page.fill('#artistInput', 'Playwright Bot');
  await page.fill('#genreInput', 'Test');
  await page.fill('#yearInput', '2025');
  await page.fill('#tracksInput', '9');
  await page.click('#albumForm button[type="submit"]');

  await page.fill('#searchInput', title);
  await page.click('#searchBtn');
  await expect(page.locator('[data-testid="album-card"]').first()).toContainText(title);

  await page.click('[data-testid="album-card"] button[data-action="delete"]');
  await page.click('#searchBtn');
  await expect(page.locator('.empty')).toHaveText('No albums found.');
});
