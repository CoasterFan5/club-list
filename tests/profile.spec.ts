import { expect, test } from '../playwright/fixtures';

test.describe.configure({ mode: 'parallel' });

test('profile page is shown', async ({ page }) => {
	await page.goto('/profile');

	await expect(page.getByText('Profile', { exact: true })).toBeVisible();
});

test('logout works', async () => {
	// Log out
	await page.goto('/profile');
	await page.locator('text=Log Out').click();
	await page.waitForURL('/login');

	// Make sure the user is logged out
	await page.goto('/profile');
	// Since we are not logged in, we should be redirected to the login page
	await page.waitForURL('/login');
});

test('changing first name works', async ({ page }) => {
	await page.goto('/profile');

	// Change the name
	await page.locator('input[name="firstName"]').fill('New First Name');
	await page.locator('text=Save').click();
	await page.reload();

	// Make sure the name was changed
	await expect(page.locator('input[name="firstName"]').inputValue()).toBe('New First Name');
});

test('changing last name works', async ({ page }) => {
	await page.goto('/profile');

	// Change the name
	await page.locator('input[name="lastName"]').fill('New Last Name');
	await page.locator('text=Save').click();
	await page.reload();

	// Make sure the name was changed
	await expect(page.locator('input[name="lastName"]').inputValue()).toBe('New Last Name');
});

test('changing email works', async ({ page }) => {
	await page.goto('/profile');

	// Change the email
	await page.locator('input[name="email"]').fill('email@email.com');
	await page.locator('text=Save').click();
	await page.reload();

	// Make sure the email was changed
	await expect(page.locator('input[name="email"]').inputValue()).toBe('email@email.com')
});

test('invalid email is not accepted', async ({ page }) => {
	await page.goto('/profile');

	// Change the email
	const emailInput = await page.locator('input[name="email"]').inputValue();
	await page.locator('input[name="email"]').fill('invalidemail');
	await page.locator('text=Save').click();
	await page.reload();

	// Make sure the email was not changed
	await expect(page.locator('input[name="email"]').inputValue()).toBe(emailInput);
});
