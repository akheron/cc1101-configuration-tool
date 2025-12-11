import { setBitField } from './bitFields';
import { REGISTER_DEFINITIONS } from '../data/registers';

export const RegisterTransforms = {
  ensureFIFOTHRBit7Cleared(addr: number, value: number): number {
    return addr === 0x03 ? value & 0x7f : value;
  },

  enforceReadOnlyFields(addr: number, value: number): number {
    const reg = REGISTER_DEFINITIONS[addr];
    if (!reg) return value;

    let result = value;
    for (const field of reg.bitFields) {
      if (field.rw === 'R' && field.reset !== null) {
        result = setBitField(result, field.bits, field.reset);
      }
    }
    return result;
  },

  calculateResetValue(addr: number): number {
    const reg = REGISTER_DEFINITIONS[addr];
    if (!reg) return 0;

    let value = 0;
    for (const field of reg.bitFields) {
      if (field.reset !== null) {
        value = setBitField(value, field.bits, field.reset);
      }
    }
    return value & 0xff;
  },
};
