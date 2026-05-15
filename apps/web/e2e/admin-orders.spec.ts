import { test, expect } from './fixtures/auth';

test.describe('Admin order management', () => {
  test('admin can view orders list', async ({ adminPage: page }) => {
     await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /overview/i })).toBeVisible();
    //Click on Orders tab
    await page.locator('aside').getByRole('link', {name:'Orders', exact:true}).click();

    await page.waitForURL('/admin/orders');
    // At least the table headers should be present
    await expect(page.getByText(/status/i)).toBeVisible();
  });

  test('admin can update order status to shipped', async ({
    adminPage: page,
  }) => {
    await page.goto('/admin/orders');

    // Find a processing order and open it
    const firstOrder = page.locator('table').getByRole('link', {name:/view/i}).first();
    await firstOrder.click();
    await page.waitForURL(/.*\/admin\/orders\/\d+/)

    // Update status
    await page.getByLabel(/status/i).selectOption('shipped');
    await page.getByLabel(/tracking number/i).fill('1Z999AA10123456784');
    const [response] = await Promise.all([
      page.waitForResponse((res)=>
        res.url().includes('/api/admin/orders') && res.request().method() === 'PATCH'
      ),
      page.getByRole('button', {name: /save/i}).click()
    ])
    expect(response.status()).toBe(200);
  });

  test('admin can manage products', async ({ adminPage: page }) => {
    await page.goto('/admin/products');
    await expect(
      page.getByRole('heading', { name: /products/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /new product/i }),
    ).toBeVisible();
  });
});
