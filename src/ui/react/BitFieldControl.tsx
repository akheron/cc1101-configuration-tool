import { useEffect, useRef } from 'react';

import { FIELD_CONFIGS } from '../../config/fieldConfigs';
import { extractBitField, setBitField } from '../../logic/bitFields';
import { RegisterState } from '../../state/registerState';
import { BitField, FieldConfig, Option, RegisterDef } from '../../types/register';

const formatHex = (value: number, width = 2) => `0x${value.toString(16).padStart(width, '0').toUpperCase()}`;

const getFieldWidth = (bits: string): number => {
  const range = bits.split(':').map(Number);
  if (range.length === 1) return 1;
  return Math.abs(range[0] - range[1]) + 1;
};

const resolveOptions = (fieldConfig: FieldConfig | undefined, state: RegisterState): Option[] | undefined => {
  if (!fieldConfig) return undefined;
  if (fieldConfig.getOptions) {
    return fieldConfig.getOptions(state.getAllValues(), state.getCrystalFreq());
  }
  if (typeof fieldConfig.options === 'function') {
    return fieldConfig.options();
  }
  return fieldConfig.options;
};

export const applyFieldValue = (currentValue: number, bits: string, newFieldValue: number): number =>
  setBitField(currentValue, bits, newFieldValue) & 0xff;

type Props = {
  state: RegisterState;
  register: RegisterDef;
  field: BitField;
  currentValue: number;
  onFieldChange: (addr: number, bits: string, value: number) => void;
};

export const BitFieldControl = ({ state, register, field, currentValue, onFieldChange }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = getFieldWidth(field.bits);
  const options = resolveOptions(FIELD_CONFIGS[field.name], state);
  const isReadOnly = field.rw === 'R';
  const selectedRaw = extractBitField(currentValue, field.bits);
  const selected = isReadOnly && field.reset !== null ? field.reset : selectedRaw;
  const disabled = isReadOnly;
  const groupName = `${register.addr}-${field.bits.replace(':', '_')}`;
  const scrollKey = FIELD_CONFIGS[field.name]?.scrollKey
    ? `${FIELD_CONFIGS[field.name]?.scrollKey}-${register.addr}-${field.bits.replace(':', '_')}`
    : undefined;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const selectedRadio = container.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    if (!selectedRadio) return;

    const selectedTop = selectedRadio.offsetTop;
    const selectedBottom = selectedTop + selectedRadio.offsetHeight;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;

    if (selectedTop < visibleTop) {
      container.scrollTop = selectedTop;
    } else if (selectedBottom > visibleBottom) {
      container.scrollTop = selectedBottom - container.clientHeight;
    }
  }, [selected]);

  if (options && options.length) {
    return (
      <div
        ref={containerRef}
        className="bitfield-options bitfield-options--table"
        data-scroll-key={scrollKey}
      >
        <table className="bitfield-table" role="presentation">
          <tbody>
            {options.map(opt => {
              const inputId = `opt-${groupName}-${opt.value}`;
              const valueText = FIELD_CONFIGS[field.name]?.valueFormatter
                ? FIELD_CONFIGS[field.name]?.valueFormatter?.(opt)
                : `${opt.value} (${opt.value.toString(2).padStart(width, '0')})`;
              const descText = opt.desc ?? '—';
              return (
                <tr
                  key={inputId}
                  className={`bitfield-row ${opt.value === selected ? 'is-selected' : ''}`}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('label') || (e.target as HTMLElement).closest('input')) return;
                    if (!disabled) onFieldChange(register.addr, field.bits, opt.value);
                  }}
                >
                  <td className="bitfield-row__value">
                    <label className="bitfield-row__label" htmlFor={inputId}>
                      <input
                        id={inputId}
                        type="radio"
                        data-type="field-radio"
                        name={groupName}
                        data-addr={register.addr}
                        data-bits={field.bits}
                        value={opt.value}
                        checked={opt.value === selected}
                        disabled={disabled}
                        onChange={() => onFieldChange(register.addr, field.bits, opt.value)}
                      />
                      <span className="bitfield-option__value">{valueText}</span>
                    </label>
                  </td>
                  <td className="bitfield-row__desc">
                    <span className={`bitfield-option__desc ${opt.desc ? '' : 'bitfield-option__desc--empty'}`}>
                      {descText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (width === 1) {
    return (
      <label className="bitfield-control">
        <input
          type="checkbox"
          data-type="field-checkbox"
          data-addr={register.addr}
          data-bits={field.bits}
          checked={selected === 1}
          disabled={disabled}
          onChange={event =>
            onFieldChange(register.addr, field.bits, (event.target as HTMLInputElement).checked ? 1 : 0)
          }
        />
        <span className="bitfield-control__text">
          {field.name || 'Bit'}
          {isReadOnly ? ' (read-only)' : ''}
        </span>
      </label>
    );
  }

  const maxValue = (1 << width) - 1;

  return (
    <label className="bitfield-control">
      <input
        data-type="field-number"
        data-addr={register.addr}
        data-bits={field.bits}
        type="number"
        min={0}
        max={maxValue}
        value={selected}
        disabled={disabled}
        onChange={event => onFieldChange(register.addr, field.bits, Number(event.target.value))}
      />
      <span className="bitfield-control__text">{formatHex(selected)}</span>
    </label>
  );
};
