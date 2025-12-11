export type Option = {
  value: number;
  desc: string;
};

export type BitField = {
  bits: string;
  name: string;
  reset: number | null;
  rw: 'R' | 'R/W';
  desc?: string;
};

export type RegisterDef = {
  addr: number;
  name: string;
  description: string;
  bitFields: BitField[];
};

export type RegisterDefinitions = Record<number, RegisterDef>;

export type RegisterValues = Record<number, number>;

export type FieldConfig = {
  options?: Option[] | (() => Option[]);
  getOptions?: (registers: RegisterValues, crystalFreqMHz: number) => Option[];
  scrollKey?: string;
  valueFormatter?: (option: Option) => string;
};

export type FieldConfigMap = Record<string, FieldConfig>;
