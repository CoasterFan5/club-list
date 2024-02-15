import { test } from '../playwright/fixtures';

test.describe.configure({ mode: 'serial' });

test('logout works', async ({ page }) => {
	await page.goto('/profile');
	await page.locator('text=Log Out').click();

	await page.waitForURL('/login');
});

test("can't navigate back to profile", async ({ page }) => {
	await page.goto('/profile');
	await page.waitForURL('/login');
});
