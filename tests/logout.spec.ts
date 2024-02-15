import { type Page, test } from '../playwright/fixtures';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('logout works', async () => {
	await page.goto('/profile');
	await page.locator('text=Log Out').click();

	await page.waitForURL('/login');
});

test("can't navigate back to profile", async () => {
	await page.goto('/profile');
	await page.waitForURL('/login');
});
