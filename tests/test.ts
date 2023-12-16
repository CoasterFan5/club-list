import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByRole('heading', { name: 'The modern clublist that helps you connect' })
	).toBeVisible();
});

test('login page works as expected', async ({ page }) => {
	await page.goto('/login');
	await page.waitForSelector('body.started', { timeout: 5000 });

	await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

	await page.locator('input[name="email"]').fill('bstone@card.board');
	await page.locator('input[name="password"]').fill('password');
	await page.locator('button[type="submit"]').click();

	await page.waitForURL('/dashboard');
});

test('register page works as expected', async ({ page }) => {
	await page.goto('/get-started');
	await page.waitForSelector('body.started', { timeout: 5000 });

	await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

	await page.locator('input[name="firstName"]').fill('Test');
	await page.locator('input[name="lastName"]').fill('User');
	await page.locator('input[name="email"]').fill(`test${Math.random()}@card.board`);
	await page.locator('input[name="password"]').fill('password');
	await page.locator('input[name="confirmPassword"]').fill('password');
	await page.locator('button[type="submit"]').click();

	await page.waitForURL('/dashboard');
});

test('404 page has a home link', async ({ page }) => {
	await page.goto(`/${Math.random()}`);

	await expect(page.getByRole('heading', { name: '404 | Not Found' })).toBeVisible();

	await page.getByRole('link', { name: 'Go Home' }).click();

	await page.waitForURL('/');
});
