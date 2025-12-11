import { describe, expect, it } from 'vitest';

import { RegisterTransforms } from '../logic/transforms';

describe('RegisterTransforms', () => {
  it('calculates reset values from bitfields', () => {
    expect(RegisterTransforms.calculateResetValue(0x03)).toBe(0x07);
    expect(RegisterTransforms.calculateResetValue(0x10)).toBe(0x8c);
    expect(RegisterTransforms.calculateResetValue(0x00)).toBe(0x29);
  });

  it('enforces read-only fields', () => {
    const enforced = RegisterTransforms.enforceReadOnlyFields(0x00, 0xe9);
    expect(enforced).toBe(0x69); // bit 7 cleared, others unchanged
  });

  it('clears FIFOTHR bit7 but leaves other registers untouched', () => {
    expect(RegisterTransforms.ensureFIFOTHRBit7Cleared(0x03, 0xff)).toBe(0x7f);
    expect(RegisterTransforms.ensureFIFOTHRBit7Cleared(0x04, 0xff)).toBe(0xff);
  });
});
