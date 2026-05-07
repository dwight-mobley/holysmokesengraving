import 'dotenv/config';
import { vi } from 'vitest';
import { prisma } from '../lib/prisma';

vi.mock('../lib/email', () => ({
  sendEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
  FROM_ADDRESS: 'test@test.com',
}));

afterAll(async () => {
  await prisma.$disconnect();
});