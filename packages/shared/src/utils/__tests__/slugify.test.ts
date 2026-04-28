import {slugify} from '../slugify';

describe('slugify', () => {
  it('should convert text to lowercase and replaces spaces with dashes', () => {
    expect(slugify('Rustic Woodland Piece')).toBe('rustic-woodland-piece');
  });

  it('should remove special characters', () => {
    expect(slugify('Rustic!, Woodland@ Piece#')).toBe('rustic-woodland-piece');
  });

    it('should trim leading and trailing whitespace', () => {
    expect(slugify('  Rustic Woodland Piece  ')).toBe('rustic-woodland-piece');
  });

  it('should replace multiple spaces or underscores with a single dash', () => {
    expect(slugify('Rustic   Woodland__Piece')).toBe('rustic-woodland-piece');
  });

    it('should replace multiple dashes with a single dash', () => {
    expect(slugify('Rustic---Woodland--Piece')).toBe('rustic-woodland-piece');
  });
});