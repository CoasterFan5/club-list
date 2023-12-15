import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: 'The modern clublist that helps you connect' })
	).toBeVisible();
});

test('login page works as expected', async ({ page }) => {
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

	await page.fill('input[name="email"]', 'bstone@card.board');
	await page.fill('input[name="password"]', 'password');
	await page.click('button[type="submit"]');

	await page.waitForURL('/dashboard');
});
