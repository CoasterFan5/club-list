import { expect, test } from './fixtures';

test('dashboard page has base greeting & no organizations', async ({ page }) => {
	await page.goto('/dashboard');

	await expect(page.getByText('Welcome back, Test!', { exact: true })).toBeVisible();
    await expect(page.getByText('You are not in any organizations.')).toBeVisible();
});
