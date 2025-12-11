import { describe, expect, it } from 'vitest';

import { extractBitField, setBitField } from '../logic/bitFields';

describe('bitFields helpers', () => {
  it('extracts single bits and ranges', () => {
    expect(extractBitField(0b1010_1101, '0')).toBe(1);
    expect(extractBitField(0b1010_1101, '3:1')).toBe(0b110);
    expect(extractBitField(0xff, '7')).toBe(1);
  });

  it('sets bit ranges and preserves others', () => {
    const value = setBitField(0b0000_0000, '5:3', 0b101);
    expect(value).toBe(0b0010_1000);

    const mixed = setBitField(0b1111_0000, '3:0', 0b0101);
    expect(mixed).toBe(0b1111_0101);
  });
});
