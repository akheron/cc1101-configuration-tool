import { FIELD_CONFIGS } from '../config/fieldConfigs';
import { REGISTER_DEFINITIONS, REGISTERS } from '../data/registers';
import { extractBitField, setBitField } from '../logic/bitFields';
import { RegisterTransforms } from '../logic/transforms';
import { RegisterState } from '../state/registerState';
import { BitField, FieldConfig, Option, RegisterDef } from '../types/register';

const formatHex = (value: number, width = 2) => `0x${value.toString(16).padStart(width, '0').toUpperCase()}`;

const getFieldWidth = (bits: string): number => {
  const range = bits.split(':').map(Number);
  if (range.length === 1) return 1;
  return Math.abs(range[0] - range[1]) + 1;
};

const resolveOptions = (
  fieldConfig: FieldConfig | undefined,
  state: RegisterState
): Option[] | undefined => {
  if (!fieldConfig) return undefined;
  if (fieldConfig.getOptions) {
    return fieldConfig.getOptions(state.getAllValues(), state.getCrystalFreq());
  }
  if (typeof fieldConfig.options === 'function') {
    return fieldConfig.options();
  }
  return fieldConfig.options;
};

const renderBitFieldControl = (
  state: RegisterState,
  register: RegisterDef,
  field: BitField,
  currentValue: number,
  fieldConfig?: FieldConfig
) => {
  const bits = field.bits;
  const width = getFieldWidth(bits);
  const maxValue = (1 << width) - 1;
  const options = resolveOptions(fieldConfig, state);
  const isReadOnly = field.rw === 'R';
  const selectedRaw = extractBitField(currentValue, bits);
  const selected = isReadOnly && field.reset !== null ? field.reset : selectedRaw;
  const disabledAttr = isReadOnly ? 'disabled' : '';
  const groupName = `${register.addr}-${bits.replace(':', '_')}`;
  const scrollKey = fieldConfig?.scrollKey
    ? `${fieldConfig.scrollKey}-${register.addr}-${bits.replace(':', '_')}`
    : undefined;

  if (options && options.length) {
    const optionsHtml = options
      .map(opt => {
        const inputId = `opt-${groupName}-${opt.value}`;
        const valueText = fieldConfig?.valueFormatter
          ? fieldConfig.valueFormatter(opt)
          : `${opt.value} (${opt.value.toString(2).padStart(width, '0')})`;
        const descText = opt.desc
          ? `<span class="bitfield-option__desc">${opt.desc}</span>`
          : `<span class="bitfield-option__desc bitfield-option__desc--empty">—</span>`;
        return `
          <tr class="bitfield-row ${opt.value === selected ? 'is-selected' : ''}">
            <td class="bitfield-row__value">
              <label class="bitfield-row__label" for="${inputId}">
                <input
                  id="${inputId}"
                  type="radio"
                  data-type="field-radio"
                  name="${groupName}"
                  data-addr="${register.addr}"
                  data-bits="${bits}"
                  value="${opt.value}"
                  ${opt.value === selected ? 'checked' : ''}
                  ${disabledAttr}
                />
                <span class="bitfield-option__value">${valueText}</span>
              </label>
            </td>
            <td class="bitfield-row__desc">
              ${descText}
            </td>
          </tr>
        `;
      })
      .join('');

    return `
      <div class="bitfield-options bitfield-options--table" ${scrollKey ? `data-scroll-key="${scrollKey}"` : ''}>
        <table class="bitfield-table" role="presentation">
          <tbody>
            ${optionsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  if (width === 1) {
    const checked = selected === 1 ? 'checked' : '';
    return `
      <label class="bitfield-control">
        <input
          type="checkbox"
          data-type="field-checkbox"
          data-addr="${register.addr}"
          data-bits="${bits}"
          ${checked}
          ${disabledAttr}
        />
        <span class="bitfield-control__text">${field.name || 'Bit'}${isReadOnly ? ' (read-only)' : ''}</span>
      </label>
    `;
  }

  return `
    <label class="bitfield-control">
      <input
        data-type="field-number"
        data-addr="${register.addr}"
        data-bits="${bits}"
        type="number"
        min="0"
        max="${maxValue}"
        value="${selected}"
        ${disabledAttr}
      />
    </label>
  `;
};

export const RegisterCard = (state: RegisterState, register: RegisterDef = REGISTER_DEFINITIONS[0]): string => {
  const value = state.getValue(register.addr);
  const resetValue = RegisterTransforms.calculateResetValue(register.addr);
  const isRegisterReset = value === resetValue;

  const bitFieldsHtml = register.bitFields
    .map(field => {
      const config = FIELD_CONFIGS[field.name];
      const readonlyClass = field.rw === 'R' ? ' bitfield--readonly' : '';
      const control = renderBitFieldControl(state, register, field, value, config);
      const isReset = field.reset !== null && extractBitField(value, field.bits) === field.reset;
      const resetInfo =
        field.reset !== null
          ? `reset: ${field.reset}${isReset ? ' <span class="bitfield__reset-match">✓</span>' : ''}`
          : 'reset: —';
      const readonlyBadge = field.rw === 'R' ? '<span class="bitfield__readonly">read-only</span>' : '';
      const desc = field.desc ? `<div class="bitfield__desc">${field.desc}</div>` : '';

      return `
        <div class="bitfield${readonlyClass}" data-bits="${field.bits}">
          <div class="bitfield__header">
            <div class="bitfield__title">
              <span class="bitfield__name">${field.name || 'Reserved'}</span>
              ${readonlyBadge}
            </div>
            <div class="bitfield__meta">
              <span class="bitfield__bits">[${field.bits}]</span>
              <span class="bitfield__reset" aria-label="Reset value">${resetInfo}</span>
            </div>
          </div>
          <div class="bitfield__control">${control}</div>
          ${desc}
        </div>
      `;
    })
    .join('');

  return `
    <section class="register-card" data-addr="${formatHex(register.addr)}">
      <header class="register-card__header">
        <div>
          <div class="register-card__title">${formatHex(register.addr)} ${register.name}</div>
          <div class="register-card__subtitle">${register.description}</div>
        </div>
        <div class="register-card__value">
          <label>
            <span>Value</span>
            <input data-type="register-hex" data-addr="${register.addr}" value="${formatHex(value)}" />
          </label>
          <div class="register-card__binary">${value.toString(2).padStart(8, '0')}b</div>
          <div class="register-card__reset">
            <span>Reset: ${formatHex(resetValue)} ${isRegisterReset ? '<span class="register-card__reset-match">✓</span>' : ''}</span>
            <button class="btn btn-ghost" data-action="reset-register" data-addr="${register.addr}">Reset to default</button>
          </div>
        </div>
      </header>
      <div class="register-card__fields">
        ${bitFieldsHtml}
      </div>
    </section>
  `;
};

export const renderRegisters = (state: RegisterState, filter = ''): string => {
  const term = filter.trim().toLowerCase();
  const matches = (reg: RegisterDef) => {
    if (!term) return true;
    const addrHex = reg.addr.toString(16).padStart(2, '0');
    return (
      reg.name.toLowerCase().includes(term) ||
      reg.description.toLowerCase().includes(term) ||
      addrHex.includes(term)
    );
  };

  return REGISTERS.filter(matches)
    .map(reg => RegisterCard(state, reg))
    .join('');
};

export const renderShell = (state: RegisterState): string => `
  <main class="app-shell">
    <header class="app-header">
      <div>
        <h1>CC1101 Configuration Tool</h1>
      </div>
      <div class="control-group">
        <label>
          Search registers
          <input type="text" id="registerSearch" data-type="register-search" placeholder="Name, addr, description" />
        </label>
      </div>
      <div class="control-group">
        <label>
          Crystal Frequency (MHz)
          <select id="crystalFreq" data-type="crystal-select">
            <option value="26" ${state.getCrystalFreq() === 26 ? 'selected' : ''}>26</option>
            <option value="27" ${state.getCrystalFreq() === 27 ? 'selected' : ''}>27</option>
          </select>
        </label>
      </div>
    </header>
    <section class="import-export">
      <div class="panel">
        <div class="panel-header">
          <h3>Export</h3>
          <label class="checkbox-inline">
            <input type="checkbox" id="exportOnlyChanged" data-type="export-changed" checked />
            Only changed
          </label>
        </div>
        <textarea id="exportText" readonly></textarea>
        <div class="panel-actions">
          <button class="btn" data-action="copy-export">Copy</button>
          <button class="btn" data-action="refresh-export">Refresh</button>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h3>Import</h3>
        </div>
        <textarea id="importText" placeholder="(0x00, 0x29), // IOCFG2"></textarea>
        <div class="panel-actions">
          <button class="btn btn-primary" data-action="apply-import">Import</button>
        </div>
      </div>
    </section>
    <section class="summary" id="summary"></section>
    <section class="registers" id="registersContainer">
      ${renderRegisters(state)}
    </section>
  </main>
`;

export const applyFieldValue = (
  currentValue: number,
  bits: string,
  newFieldValue: number
): number => setBitField(currentValue, bits, newFieldValue) & 0xff;
