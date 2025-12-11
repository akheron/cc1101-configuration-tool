import { describe, expect, it, vi } from 'vitest';

import { RegisterTransforms } from '../logic/transforms';
import { RegisterState } from '../state/registerState';

const newState = () => {
  const s = new RegisterState();
  s.initialize();
  return s;
};

describe('RegisterState', () => {
  it('initializes to reset values and notifies bulk-update', () => {
    const state = newState();
    const listener = vi.fn();
    state.subscribe(listener);
    state.initialize();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'bulk-update', reason: 'initialize' }),
      state
    );
    expect(state.getValue(0x00)).toBe(RegisterTransforms.calculateResetValue(0x00));
  });

  it('notifies register updates and stores values', () => {
    const state = newState();
    const listener = vi.fn();
    state.subscribe(listener);
    state.setValue(0x0a, 0x12);
    expect(state.getValue(0x0a)).toBe(0x12);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'register-update', addr: 0x0a, value: 0x12 }),
      state
    );
  });

  it('updates crystal frequency and notifies', () => {
    const state = newState();
    const listener = vi.fn();
    state.subscribe(listener);
    state.setCrystalFreq(27);
    expect(state.getCrystalFreq()).toBe(27);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'crystal-freq-update', freq: 27 }),
      state
    );
  });

  it('computes carrier frequency and tx power dBm', () => {
    const state = newState();
    const base = state.getBaseFrequency();
    expect(base).toBeGreaterThan(700_000_000);
    const spacing = state.getChannelSpacing();
    state.setValue(0x0a, 1);
    const carrier = state.getCarrierFrequency();
    expect(carrier).toBeCloseTo(base + spacing, 5);

    // PATABLE default 0xC6 => lookup should return number
    const txPower = state.getTxPowerDbm();
    expect(txPower).not.toBeNull();
  });
});
