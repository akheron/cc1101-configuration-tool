export function extractBitField(regValue: number, bits: string): number {
  const parts = bits.split(':');
  const high = parseInt(parts[0], 10);
  const low = parts.length > 1 ? parseInt(parts[1], 10) : high;
  const width = high - low + 1;
  const mask = ((1 << width) - 1) << low;
  return (regValue & mask) >> low;
}

export function setBitField(regValue: number, bits: string, fieldValue: number): number {
  const parts = bits.split(':');
  const high = parseInt(parts[0], 10);
  const low = parts.length > 1 ? parseInt(parts[1], 10) : high;
  const width = high - low + 1;
  const mask = ((1 << width) - 1) << low;
  const maxValue = (1 << width) - 1;

  const cleared = regValue & ~mask;
  const nextValue = cleared | ((fieldValue & maxValue) << low);
  return nextValue & 0xff;
}
