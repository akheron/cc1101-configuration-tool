import { FIELD_CONFIGS } from '../config/fieldConfigs';
import { REGISTER_DEFINITIONS } from '../data/registers';
import { extractBitField } from '../logic/bitFields';
import { RegisterCalculations } from '../logic/calculations';
import { RegisterTransforms } from '../logic/transforms';
import { Option, RegisterDefinitions, RegisterValues } from '../types/register';

export type StateChange =
  | { type: 'bulk-update'; reason?: string }
  | { type: 'register-update'; addr: number; value: number; oldValue: number | undefined }
  | { type: 'crystal-freq-update'; freq: number };

export type StateListener = (change: StateChange, state: RegisterState) => void;

export class RegisterState {
  private definitions: RegisterDefinitions;
  private values: RegisterValues = {};
  private listeners = new Set<StateListener>();
  private crystalFreq = 26; // MHz

  constructor(definitions: RegisterDefinitions = REGISTER_DEFINITIONS) {
    this.definitions = definitions;
  }

  initialize(): void {
    const defaults: RegisterValues = {};
    for (const addr in this.definitions) {
      const addrNum = Number(addr);
      defaults[addrNum] = RegisterTransforms.calculateResetValue(addrNum);
    }
    this.values = defaults;
    this.notify({ type: 'bulk-update', reason: 'initialize' });
  }

  setValue(addr: number, value: number): void {
    const oldValue = this.values[addr];
    if (oldValue === value) return;
    this.values[addr] = value;
    this.notify({ type: 'register-update', addr, value, oldValue });
  }

  setValues(values: RegisterValues): void {
    this.values = { ...values };
    this.notify({ type: 'bulk-update', reason: 'setValues' });
  }

  getValue(addr: number): number {
    return this.values[addr] ?? 0;
  }

  getAllValues(): RegisterValues {
    return { ...this.values };
  }

  setCrystalFreq(freq: number): void {
    if (this.crystalFreq === freq) return;
    this.crystalFreq = freq;
    this.notify({ type: 'crystal-freq-update', freq });
  }

  getCrystalFreq(): number {
    return this.crystalFreq;
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(change: StateChange): void {
    this.listeners.forEach((listener) => {
      try {
        listener(change, this);
      } catch (error) {
        console.error('RegisterState listener error', error);
      }
    });
  }

  // Computed helpers
  getBaseFrequency(): number {
    return RegisterCalculations.baseFrequency(
      this.getValue(0x0d),
      this.getValue(0x0e),
      this.getValue(0x0f),
      this.crystalFreq,
    );
  }

  getCarrierFrequency(): number {
    return RegisterCalculations.carrierFrequency(this.values, this.crystalFreq);
  }

  getChannelSpacing(): number {
    return RegisterCalculations.channelSpacing(this.values, this.crystalFreq);
  }

  getDataRate(): number {
    return RegisterCalculations.dataRate(this.values, this.crystalFreq);
  }

  getChannelNumber(): number {
    return this.getValue(0x0a);
  }

  getTxPowerDbm(): number | null {
    const patable0 = this.getValue(0x3e);
    const carrierFreqMHz = this.getCarrierFrequency() / 1e6;
    return RegisterCalculations.txPowerDbm(patable0, carrierFreqMHz);
  }

  getGDO0Behavior(): string {
    const iocfg0 = this.getValue(0x02) || RegisterTransforms.calculateResetValue(0x02);
    const gdo0_cfg = extractBitField(iocfg0, '5:0');
    const gdo0_inv = extractBitField(iocfg0, '6');
    const option = this.findOption('GDO0_CFG[5:0]', gdo0_cfg);
    const desc = option ?? `Unknown (${gdo0_cfg})`;
    const invText = gdo0_inv ? ' (inverted)' : '';
    return `${desc}${invText}`;
  }

  getGDO2Behavior(): string {
    const iocfg2 = this.getValue(0x00) || RegisterTransforms.calculateResetValue(0x00);
    const gdo2_cfg = extractBitField(iocfg2, '5:0');
    const gdo2_inv = extractBitField(iocfg2, '6');
    const option = this.findOption('GDO2_CFG[5:0]', gdo2_cfg);
    const desc = option ?? `Unknown (${gdo2_cfg})`;
    const invText = gdo2_inv ? ' (inverted)' : '';
    return `${desc}${invText}`;
  }

  getStateAfterRX(): string {
    const mcsm1 = this.getValue(0x17) || RegisterTransforms.calculateResetValue(0x17);
    const rxoff_mode = extractBitField(mcsm1, '3:2');
    return this.findOption('RXOFF_MODE[1:0]', rxoff_mode) ?? `Unknown (${rxoff_mode})`;
  }

  getStateAfterTX(): string {
    const mcsm1 = this.getValue(0x17) || RegisterTransforms.calculateResetValue(0x17);
    const txoff_mode = extractBitField(mcsm1, '1:0');
    return this.findOption('TXOFF_MODE[1:0]', txoff_mode) ?? `Unknown (${txoff_mode})`;
  }

  private findOption(bitsName: string, value: number): string | undefined {
    const config = FIELD_CONFIGS[bitsName];
    if (!config) return undefined;
    const options = this.resolveOptions(config);
    const match = options?.find((opt) => opt.value === value);
    return match?.desc;
  }

  private resolveOptions(config: {
    options?: Option[] | (() => Option[]);
    getOptions?: (registers: RegisterValues, crystalFreqMHz: number) => Option[];
  }): Option[] | undefined {
    if (config.getOptions) {
      return config.getOptions(this.getAllValues(), this.getCrystalFreq());
    }
    if (typeof config.options === 'function') {
      return config.options();
    }
    return config.options;
  }
}
