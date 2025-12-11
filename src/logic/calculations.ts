import { extractBitField } from './bitFields';
import { RegisterValues } from '../types/register';

export const RegisterCalculations = {
  baseFrequency(freq2: number, freq1: number, freq0: number, crystalFreqMHz: number): number {
    const freq21_16 = extractBitField(freq2, '5:0');
    const freq15_8 = freq1;
    const freq7_0 = freq0;
    const freq = (freq21_16 << 16) | (freq15_8 << 8) | freq7_0;
    const crystalFreqHz = crystalFreqMHz * 1e6;
    return (crystalFreqHz / 2 ** 16) * freq;
  },

  channelSpacing(registers: RegisterValues, crystalFreqMHz: number): number {
    const mdmcfg1 = registers[0x13] ?? 0;
    const mdmcfg0 = registers[0x14] ?? 0;
    const chanspc_e = extractBitField(mdmcfg1, '1:0');
    const chanspc_m = mdmcfg0;
    const crystalFreqHz = crystalFreqMHz * 1e6;
    return (crystalFreqHz / 2 ** 18) * (256 + chanspc_m) * 2 ** chanspc_e;
  },

  carrierFrequency(registers: RegisterValues, crystalFreqMHz: number): number {
    const baseFreq = this.baseFrequency(
      registers[0x0d] ?? 0,
      registers[0x0e] ?? 0,
      registers[0x0f] ?? 0,
      crystalFreqMHz
    );
    const channelSpacing = this.channelSpacing(registers, crystalFreqMHz);
    const channel = registers[0x0a] ?? 0;
    return baseFreq + channelSpacing * channel;
  },

  dataRate(registers: RegisterValues, crystalFreqMHz: number): number {
    const mdmcfg4 = registers[0x10] ?? 0;
    const mdmcfg3 = registers[0x11] ?? 0;
    const drate_e = extractBitField(mdmcfg4, '3:0');
    const drate_m = mdmcfg3;
    const crystalFreqHz = crystalFreqMHz * 1e6;
    return ((256 + drate_m) * 2 ** drate_e * crystalFreqHz) / 2 ** 28;
  },

  txPowerDbm(patable0: number, carrierFreqMHz: number): number | null {
    const is868MHz = carrierFreqMHz < 890;
    const lookup868: Record<number, number> = {
      0xc0: 10.7,
      0xc1: 10.3,
      0xc2: 10.0,
      0xc3: 9.6,
      0xc4: 9.2,
      0xc5: 8.9,
      0xc6: 8.5,
      0xc7: 8.2,
      0xc8: 7.8,
      0xc9: 7.5,
      0xca: 7.2,
      0xcb: 6.8,
      0xcc: 6.5,
      0xcd: 6.2,
      0xce: 5.5,
      0x80: 5.2,
      0x81: 5.0,
      0x82: 4.8,
      0x83: 4.6,
      0x84: 4.4,
      0x85: 4.1,
      0x86: 3.7,
      0x87: 3.4,
      0x88: 3.0,
      0x89: 2.6,
      0xcf: 2.4,
      0x8a: 2.1,
      0x8b: 1.7,
      0x8c: 1.1,
      0x8d: 0.6,
      0x50: -0.3,
      0x60: -0.5,
      0x8e: -0.5,
      0x51: -0.9,
      0x61: -1.1,
      0x40: -1.5,
      0x52: -1.6,
      0x62: -1.8,
      0x53: -2.3,
      0x63: -2.4,
      0x3f: -2.6,
      0x3e: -2.8,
      0x54: -2.9,
      0x64: -3.1,
      0x3d: -3.2,
      0x3c: -3.5,
      0x55: -3.6,
      0x65: -3.7,
      0x3b: -4.0,
      0x56: -4.2,
      0x66: -4.4,
      0x2f: -4.5,
      0x3a: -4.5,
      0x57: -4.8,
      0x2e: -4.9,
      0x67: -5.0,
      0x39: -5.2,
      0x2d: -5.5,
      0x68: -5.7,
      0x8f: -6.0,
      0x2c: -6.0,
      0x38: -6.1,
      0x69: -6.3,
      0x2b: -6.7,
      0x6a: -6.9,
      0x37: -6.9,
      0x2a: -7.4,
      0x6b: -7.5,
      0x36: -8.1,
      0x29: -8.2,
      0x6c: -8.7,
      0x28: -9.0,
      0x35: -9.4,
      0x27: -9.8,
      0x26: -11.0,
      0x34: -11.1,
      0x25: -12.5,
      0x33: -13.3,
      0x24: -14.3,
      0x6d: -14.5,
      0x1f: -14.6,
      0x1e: -15.1,
      0x1d: -15.7,
      0x1c: -16.4,
      0x23: -16.5,
      0x32: -16.5,
      0x1b: -17.0,
      0x1a: -17.8,
      0x19: -18.6,
      0x18: -19.5,
      0x22: -19.6,
      0x0f: -20.0,
      0x0e: -20.5,
      0x17: -20.5,
      0x0d: -21.1,
      0x0c: -21.7,
      0x16: -21.7,
      0x31: -21.9,
      0x0b: -22.3,
      0x0a: -23.0,
      0x15: -23.0,
      0x09: -23.8,
      0x08: -24.6,
      0x14: -24.7,
      0x21: -24.8,
      0x07: -25.5,
      0x13: -26.5,
      0x06: -26.5,
      0x05: -27.7,
      0x12: -28.9,
      0x04: -28.9,
      0x03: -30.2,
      0x02: -31.7,
      0x11: -31.7,
      0x01: -33.1,
      0x10: -34.1,
      0x20: -34.1,
      0x30: -34.2,
      0x6e: -45.8,
      0x00: -59.3,
      0x6f: -69.2
    };

    const lookup915: Record<number, number> = {
      0x03: -30,
      0x0e: -20,
      0x1e: -15,
      0x27: -10,
      0x38: -6,
      0x8e: 0,
      0x84: 5,
      0xcc: 7,
      0xc3: 10,
      0xc6: 8.9,
      0xc0: 11
    };

    const lookup = is868MHz ? lookup868 : lookup915;
    return lookup[patable0] ?? null;
  }
};
