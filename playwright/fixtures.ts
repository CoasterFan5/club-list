import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const sessionId = crypto.randomUUID();

export * from '@playwright/test';
export const test = baseTest.extend<object, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [async ({ browser }, use) => {
    // Use parallelIndex as a unique identifier for each worker.
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${sessionId}-${id}.json`);

    if (fs.existsSync(fileName)) {
      // Reuse existing authentication state if any.
      await use(fileName);
      return;
    }

    // Important: make sure we authenticate in a clean environment by unsetting storage state.
    const page = await browser.newPage({ storageState: undefined });

    // Perform authentication steps. Replace these actions with your own.
    await page.goto('/get-started');
    await page.waitForSelector('body.started', { timeout: 5000 });

    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="email"]').fill(`test${crypto.randomUUID()}@card.board`);
    await page.locator('input[name="password"]').fill('password');
    await page.locator('input[name="confirmPassword"]').fill('password');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('text=Error')).not.toBeVisible();

    await page.waitForURL('/dashboard');

    // End of authentication steps.

    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});