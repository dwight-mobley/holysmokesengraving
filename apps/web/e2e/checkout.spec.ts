import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

test.describe('Checkout happy path', () => {
  test('guest can browse shop, add to cart, and reach Stripe', async ({
    page,
  }) => {
    // 1. Browse shop
    await page.goto('/shop');
    await expect(page.getByRole('heading', { name: /shop/i })).toBeVisible();

    // 2. Click the first product
    const firstCard = page.getByLabel(/view test product /i).first();
    await firstCard.click();
    await page.waitForURL(/\/shop\/.+/);

    // 3. Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click();
    await expect(page.getByText(/in your cart/i)).toBeVisible();

    // 4. Go to checkout
    await page.goto('/checkout');
    await expect(
      page.getByRole('heading', { name: /order summary/i }),
    ).toBeVisible();

    // 5. Fill the form
    await page.getByLabel(/email/i).fill('jane@example.com');

    //Mock Stripe Session from global
    const { sessionId } = JSON.parse(
      fs.readFileSync(path.join(__dirname, '.test-session.json'), 'utf-8'),
    );

    // 6. Mock the checkout API — return a local success URL instead of real Stripe
    await page.route('/api/checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: `http://localhost:3000/checkout/success?session_id=${sessionId}`,
        }),
      });
    });

    // 7. Click and wait for the redirect to the success page
    await Promise.all([
      page.waitForURL(/\/checkout\/success/),
      page.getByRole('button', { name: /pay with stripe/i }).click(),
    ]);

    // 8. Verify success page
    await expect(page.getByText(/order confirmed/i)).toBeVisible();
  });
});
