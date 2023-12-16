import { expect, test } from '@playwright/test';

test('login page works as expected', async ({ page }) => {
	await page.goto('/login');
	await page.waitForSelector('body.started', { timeout: 5000 });

	await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

	await page.locator('input[name="email"]').fill('bstone@card.board');
	await page.locator('input[name="password"]').fill('password');
	await page.locator('button[type="submit"]').click();

	await expect(page.locator('text=Error')).not.toBeVisible();

	await page.waitForURL('/dashboard');
});

test('logging in with the wrong password shows an error', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('body.started', { timeout: 5000 });

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    await page.locator('input[name="email"]').fill('bstone@card.board');
    await page.locator('input[name="password"]').fill('wrongPassword');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('text=Error')).toBeVisible();
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

	await expect(page.locator('text=Error')).not.toBeVisible();

	await page.waitForURL('/dashboard');
});
