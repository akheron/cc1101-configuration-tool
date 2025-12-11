import { describe, expect, it } from 'vitest';

import { REGISTERS } from '../data/registers';
import { RegisterCalculations } from '../logic/calculations';
import { RegisterTransforms } from '../logic/transforms';
import { RegisterValues } from '../types/register';

const buildDefaults = (): RegisterValues =>
  REGISTERS.reduce<RegisterValues>((acc, reg) => {
    acc[reg.addr] = RegisterTransforms.calculateResetValue(reg.addr);
    return acc;
  }, {});

describe('RegisterCalculations', () => {
  const crystalFreqMHz = 26;

  it('computes base frequency from reset values (~800 MHz)', () => {
    const defaults = buildDefaults();
    const baseFreq = RegisterCalculations.baseFrequency(
      defaults[0x0d],
      defaults[0x0e],
      defaults[0x0f],
      crystalFreqMHz
    );
    expect(Math.abs(baseFreq - 800_000_000)).toBeLessThan(200);
  });

  it('computes channel spacing (~200 kHz) and data rate (~115 kbaud)', () => {
    const defaults = buildDefaults();
    const spacing = RegisterCalculations.channelSpacing(defaults, crystalFreqMHz);
    expect(spacing).toBeCloseTo(199_951, 0);

    const dataRate = RegisterCalculations.dataRate(defaults, crystalFreqMHz);
    expect(dataRate).toBeCloseTo(115_051, 0);
  });

  it('computes carrier frequency from channel spacing', () => {
    const defaults = buildDefaults();
    defaults[0x0a] = 10; // channel number
    const base = RegisterCalculations.baseFrequency(
      defaults[0x0d],
      defaults[0x0e],
      defaults[0x0f],
      crystalFreqMHz
    );
    const spacing = RegisterCalculations.channelSpacing(defaults, crystalFreqMHz);
    const expected = base + spacing * 10;
    expect(RegisterCalculations.carrierFrequency(defaults, crystalFreqMHz)).toBeCloseTo(expected, 5);
  });

  it('maps PATABLE[0] to dBm for 868 vs 915 MHz tables', () => {
    expect(RegisterCalculations.txPowerDbm(0xc6, 868)).toBe(8.5);
    expect(RegisterCalculations.txPowerDbm(0xc6, 915)).toBe(8.9);
    expect(RegisterCalculations.txPowerDbm(0xff, 868)).toBeNull();
  });
});
