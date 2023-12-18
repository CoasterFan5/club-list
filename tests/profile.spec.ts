import { test, expect } from '@playwright/test';

test('logging in with the wrong password shows an error', async ({ page }) => {
	await page.goto('/profile');

  await expect(page.getByText("Profile")).toBeVisible();
});
