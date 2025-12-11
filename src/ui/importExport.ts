import { RegisterTransforms } from '../logic/transforms';
import { RegisterState } from '../state/registerState';
import { RegisterValues } from '../types/register';

const ADDRESS_REGEX = /^\s*\(?0x([0-9a-fA-F]{2})\s*,\s*0x([0-9a-fA-F]{2})\)?/;

export function parseRegisterLines(text: string): RegisterValues {
  const lines = text.split(/\r?\n/);
  const values: RegisterValues = {};

  lines.forEach((line) => {
    const match = line.match(ADDRESS_REGEX);
    if (!match) return;
    const addr = parseInt(match[1], 16);
    const value = parseInt(match[2], 16) & 0xff;
    values[addr] = RegisterTransforms.ensureFIFOTHRBit7Cleared(addr, value);
  });

  return values;
}

export function serializeRegisters(values: RegisterValues, onlyChanged = false): string {
  const entries = Object.entries(values).sort((a, b) => Number(a[0]) - Number(b[0]));
  return entries
    .filter(([addr]) => !onlyChanged || hasChanged(Number(addr), values))
    .map(
      ([addr, value]) =>
        `(0x${Number(addr).toString(16).padStart(2, '0')}, 0x${value
          .toString(16)
          .padStart(2, '0')})`,
    )
    .join(',\n');
}

const hasChanged = (addr: number, values: RegisterValues) => {
  const reset = RegisterTransforms.calculateResetValue(addr);
  return values[addr] !== reset;
};

export function buildStateHash(values: RegisterValues): string {
  const parts = Object.entries(values)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(
      ([addr, value]) =>
        `${Number(addr).toString(16).padStart(2, '0')}:${value.toString(16).padStart(2, '0')}`,
    );
  return `#${parts.join(';')}`;
}

export function parseStateHash(hash: string): RegisterValues {
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
  const values: RegisterValues = {};
  if (!trimmed) return values;

  trimmed.split(';').forEach((part) => {
    const [addrHex, valueHex] = part.split(':');
    if (!addrHex || !valueHex) return;
    const addr = parseInt(addrHex, 16);
    const value = parseInt(valueHex, 16) & 0xff;
    values[addr] = RegisterTransforms.enforceReadOnlyFields(
      addr,
      RegisterTransforms.ensureFIFOTHRBit7Cleared(addr, value),
    );
  });

  return values;
}

export function applyHashToState(state: RegisterState, hash: string): void {
  const parsed = parseStateHash(hash);
  if (Object.keys(parsed).length) {
    state.setValues({ ...state.getAllValues(), ...parsed });
  }
}

export function loadFromURL(state: RegisterState, hash: string): void {
  applyHashToState(state, hash);
}

export function saveToURL(values: RegisterValues): void {
  const hash = buildStateHash(values);
  history.replaceState(null, '', hash);
}

export function exportText(state: RegisterState, onlyChanged: boolean): string {
  return serializeRegisters(state.getAllValues(), onlyChanged);
}

export function importText(state: RegisterState, text: string): number {
  const parsed = parseRegisterLines(text);
  const next = { ...state.getAllValues() };
  Object.entries(parsed).forEach(([addrStr, value]) => {
    const addr = Number(addrStr);
    let enforced = RegisterTransforms.ensureFIFOTHRBit7Cleared(addr, value);
    enforced = RegisterTransforms.enforceReadOnlyFields(addr, enforced);
    next[addr] = enforced;
  });
  state.setValues(next);
  return Object.keys(parsed).length;
}
