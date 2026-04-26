import { formatMoney } from '../formatMoney';

describe('formatMoney', () => {
  it('formats cents to dollar string', () => {
    expect(formatMoney(1999)).toBe('$19.99');
  });

  it('handles zero', () => {
    expect(formatMoney(0)).toBe('$0.00');
  });

  it('handles small amounts', () => {
    expect(formatMoney(5)).toBe('$0.05');
  });

  it('handles large amounts', () => {
    expect(formatMoney(100000)).toBe('$1000.00');
  });
});