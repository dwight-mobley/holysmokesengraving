import { test, expect } from './fixtures/auth';

test.describe('POS system', () => {
  test('admin can build a cart and see order total', async ({ adminPage: page }) => {
    await page.goto('/admin/pos');

    //Charge Button Should Have 0.00
     await expect(page.getByRole('button', {name: /clear/i})).not.toBeVisible();

    // Add first result to cart
    await page.getByText(/test product/i).first().click()

    // Cart should show 1 item and a total
    await expect(page.getByRole('button', {name: /clear/i})).toBeVisible();
  });
});