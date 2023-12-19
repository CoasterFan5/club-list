import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: 'The modern clublist that helps you connect' })
	).toBeVisible();
});

test('index page icon redirects to index page', async ({ page }) => {
	await page.goto('/login');
	await page.getByRole('link').filter({ hasText: 'Clubsaur.us' }).click();
});

test('get started button redirects to get started page', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Get Started' }).nth(0).click();
	await page.waitForURL('/get-started/');
});

test('404 page has a home link', async ({ page }) => {
	await page.goto(`/${Math.random()}`);

	await expect(page.getByRole('heading', { name: '404 | Not Found' })).toBeVisible();

	await page.getByRole('link', { name: 'Go Home' }).click();

	await page.waitForURL('/');
});
