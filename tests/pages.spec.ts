import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: 'The modern clublist that helps you connect' })
	).toBeVisible();
});

test('404 page has a home link', async ({ page }) => {
	await page.goto(`/${Math.random()}`);

	await expect(page.getByRole('heading', { name: '404 | Not Found' })).toBeVisible();

	await page.getByRole('link', { name: 'Go Home' }).click();

	await page.waitForURL('/');
});
