import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

describe('GET /products', () => {
  //Create Test Products
  beforeAll(async () => {
    await prisma.product.upsert({
      where: { slug: 'slug-test-product' },
      create: {
        name: 'Slug Test Product',
        slug: 'slug-test-product',
        price: 1500,
        quantity: 10,
      },
      update: {},
    });
  });

  //Remove Test Products
  afterAll(async () => {
    await prisma.product.deleteMany({ where: { slug: 'slug-test-product' } });
  });

  it('returns a paginated list of products', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('respects limit query param', async()=>{
    const res = await request(app).get('/products?limit=1');
    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.total).toBe(await prisma.product.count());
  })
});

describe('GET /products/:slug', ()=>{
     beforeAll(async () => {
    await prisma.product.upsert({
      where: { slug: 'slug-test-product' },
      create: { name: 'Slug Test Product', slug: 'slug-test-product', price: 1500, quantity: 10 },
      update: {},
    });
  });

  afterAll(async () => {
    await prisma.product.deleteMany({ where: { slug: 'slug-test-product' } });
  });

  it('returns the product by slug', async () => {
    const res = await request(app).get('/products/slug-test-product');
    expect(res.status).toBe(200);
    expect(res.body.product.slug).toBe('slug-test-product');
  });

  it('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/products/does-not-exist');
    expect(res.status).toBe(404);
  });
});
