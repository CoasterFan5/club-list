import { expect, test } from './fixtures';

test.describe.configure({ mode: 'parallel' });

test('organizations page has nothing', async ({ page }) => {
	await page.goto('/org');

	await expect(page.getByText('No Joined Organizations', { exact: true })).toBeVisible();
    await expect(page.getByText('Join or Create one!', { exact: true })).toBeVisible();
});

test('organizations can be made', async ({ page }) => {
    await page.goto('/org');

    await page.getByText('Create', { exact: true }).click();
    await page.waitForSelector('text=Create Organization', { state: 'visible' });

    await page.locator('input[name="name"]').fill('Test Organization');
    await page.locator('text=Create').click();

    await expect(page.getByText('Test Organization', { exact: true })).toBeVisible();
    await page.locator('text=Test Organization').click();
    await page.waitForURL(/\/org\/[0-9]+/);
    await expect(page.getByText('Test Organization', { exact: true })).toBeVisible();
    await expect(page.getByText('No clubs here yet.', { exact: true })).toBeVisible();
});
