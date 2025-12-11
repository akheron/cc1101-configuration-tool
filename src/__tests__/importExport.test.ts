import { describe, expect, it } from 'vitest';

import { RegisterTransforms } from '../logic/transforms';
import { RegisterState } from '../state/registerState';
import {
  parseRegisterLines,
  serializeRegisters,
  buildStateHash,
  parseStateHash,
  exportText,
  importText,
} from '../ui/importExport';

describe('import/export serialization', () => {
  it('parses register lines and enforces FIFOTHR bit7 clear', () => {
    const text = `
      (0x03, 0xFF), // FIFOTHR
      (0x02, 0x2E) // IOCFG0
    `;
    const values = parseRegisterLines(text);
    expect(values[0x03]).toBe(0x7f); // bit7 cleared
    expect(values[0x02]).toBe(0x2e);
  });

  it('serializes registers and filters unchanged when requested', () => {
    const values = {
      0x03: RegisterTransforms.calculateResetValue(0x03),
      0x02: 0x2e,
    };
    const all = serializeRegisters(values, false);
    expect(all).toContain('(0x02, 0x2e)');
    const changed = serializeRegisters(values, true);
    expect(changed).not.toContain('(0x03');
    expect(changed).toContain('(0x02');
  });

  it('builds and parses state hash roundtrip with read-only enforcement', () => {
    const values = {
      0x00: 0xff, // has read-only bits
      0x03: 0xff,
    };
    const hash = buildStateHash(values);
    const parsed = parseStateHash(hash);
    expect(parsed[0x03]).toBe(0x7f);
    const enforced = RegisterTransforms.enforceReadOnlyFields(0x00, 0xff);
    expect(parsed[0x00]).toBe(enforced);
  });

  it('exports and imports via RegisterState helpers', () => {
    const state = new RegisterState();
    state.initialize();
    state.setValue(0x02, 0x2e);
    const text = exportText(state, true);
    expect(text).toContain('(0x02');

    const importedState = new RegisterState();
    importedState.initialize();
    const importedCount = importText(importedState, text);
    expect(importedCount).toBeGreaterThan(0);
    expect(importedState.getValue(0x02)).toBe(0x2e);
  });
});
