import { randomBytes } from 'crypto';

export function generateId(length: number = 16): string {
  return randomBytes(length).toString('hex');
}
