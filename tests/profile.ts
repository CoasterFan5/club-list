import { expect, test } from '../playwright/fixtures';

test('profile page is shown', async ({ page }) => {
	await page.goto('/profile');

	await expect(page.getByText('Profile', { exact: true })).toBeVisible();
});
