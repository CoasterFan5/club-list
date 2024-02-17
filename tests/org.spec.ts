import { expect, test } from './fixtures/auth';

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
    await page.locator('form >> text=Create').click();

    await expect(page.getByText('Test Organization', { exact: true })).toBeVisible();
    await page.locator('text=Test Organization').click();
    await page.waitForURL(/\/org\/[0-9]+/);
    await expect(page.getByText('Test Organization', { exact: true })).toBeVisible();
    await expect(page.getByText('No clubs here yet.', { exact: true })).toBeVisible();
});

test('organizations can be joined', async ({ page }) => {
    await page.goto('/org');

    await page.getByText('Join', { exact: true }).click();
    await page.waitForSelector('text=Join an Organization', { state: 'visible' });

    await page.locator('input[name="joinCode"]').fill('123456');
    await page.locator('text=Join').click();

    await expect(page.getByText('Cardboard', { exact: true })).toBeVisible();
    await page.locator('text=Cardboard').click();
    await page.waitForURL(/\/org\/[0-9]+/);
    await expect(page.getByText('Cardboard', { exact: true })).toBeVisible();
    await expect(page.getByText('Cardboard Club', { exact: true })).toBeVisible();
});
