import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

describe('POST /orders', () => {
  const TEST_CUSTOMER_ID = '550e8400-e29b-41d4-a716-446655440000';

  beforeAll(async () => {
    await prisma.customer.upsert({
      where: { id: TEST_CUSTOMER_ID },
      create: {
        id: TEST_CUSTOMER_ID,
        firstName: 'Test',
        lastName: 'User',
        email: 'test-order@example.com',
      },
      update: {},
    });
    await prisma.product.create({
      data: {
        name: 'Order Test Product',
        slug: 'order-test-product',
        price: 1500,
        quantity: 10,
      },
    });
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany({
      where: { order: { customerId: TEST_CUSTOMER_ID } },
    });
    await prisma.order.deleteMany({ where: { customerId: TEST_CUSTOMER_ID } });
    await prisma.product.deleteMany({ where: { slug: 'order-test-product' } });
    await prisma.customer.deleteMany({ where: { id: TEST_CUSTOMER_ID } });
  });

  it('successfully creates an order', async () => {
    const testProduct = await prisma.product.findUnique({
      where: { slug: 'order-test-product' },
    });
    const res = await request(app)
      .post('/orders')
      .send({
        customerId: TEST_CUSTOMER_ID,
        items: [{ productId: testProduct!.id, quantity: 1, price: 999 }],
      })
      .set('Accept', 'application/json');

    expect(res.status).toBe(201);
    const { id } = res.body.order;
    const order = await prisma.order.findUnique({ where: { id: id } });
    expect(id).toBe(order!.id);
  });

  it('rejects orders missing customerIds', async () => {
    const testProduct = await prisma.product.findUnique({
      where: { slug: 'order-test-product' },
    });
    await request(app)
      .post('/orders')
      .send({
        items: [{ productId: testProduct!.id, quantity: 1, price: 999 }],
      })
      .expect(400);
  });

  it('rejects orders with no items', async () => {
    await request(app)
      .post('/orders')
      .send({
        customerId: TEST_CUSTOMER_ID,
        items: [],
      })
      .expect(400);
  });

  it('rejects orders with insufficient stock', async () => {
  const testProduct = await prisma.product.findUnique({
    where: { slug: 'order-test-product' },
  });
  await request(app)
    .post('/orders')
    .send({
      customerId: TEST_CUSTOMER_ID,
      items: [{ productId: testProduct!.id, quantity: 999, price: 1500 }],
    })
    .expect(400);
});
});
