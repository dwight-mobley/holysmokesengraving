import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

const TEST_EMAIL = 'auth-test@example.com';
const TEST_PASSWORD = 'password123';

describe('POST /auth/register', () => {
  afterAll(async () => {
    await prisma.customer.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  });

  it('creates a new user and returns a token', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(TEST_EMAIL);
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('returns 409 on duplicate email', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /auth/login', () => {
  beforeAll(async () => {
    await request(app).post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
  });

  afterAll(async () => {
    await prisma.customer.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  });

  it('returns a token on valid credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe(TEST_EMAIL);
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: TEST_EMAIL,
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  it('returns 401 on unknown email', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'nobody@example.com',
      password: TEST_PASSWORD,
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /auth/me', () => {
  let token: string;

  beforeAll(async () => {
    await request(app).post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const res = await request(app).post('/auth/login').send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.customer.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  });

  it('returns user and orders with valid token', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(TEST_EMAIL);
    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
});