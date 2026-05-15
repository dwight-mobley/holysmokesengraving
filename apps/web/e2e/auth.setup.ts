import { test as setup } from '@playwright/test';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '../.env') });

export const ADMIN_AUTH_FILE = path.join(__dirname, '.auth/admin.json');

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(process.env.E2E_USER_EMAIL!);
  await page.getByLabel(/password/i).fill(process.env.E2E_USER_PASSWORD!);
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL('/dashboard');

  // Save cookies (including httpOnly auth-token) to file
  await page.context().storageState({ path: ADMIN_AUTH_FILE });
});