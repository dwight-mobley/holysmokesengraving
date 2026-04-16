import { generateId } from '../generateId';

describe('generateId', () => {
  it('returns a hex string', () => {
    expect(generateId()).toMatch(/^[a-f0-9]+$/);
  });

  it('defaults to 32 characters (16 bytes as hex)', () => {
    expect(generateId()).toHaveLength(32);
  });

  it('respects custom length', () => {
    expect(generateId(8)).toHaveLength(16);
  });

  it('generates unique values', () => {
    const a = generateId();
    const b = generateId();
    expect(a).not.toBe(b);
  });
});