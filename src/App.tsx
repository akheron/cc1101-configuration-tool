import React, { useEffect, useMemo, useRef, useState } from 'react';

import { REGISTERS } from './data/registers';
import { RegisterTransforms } from './logic/transforms';
import { RegisterState } from './state/registerState';
import { useRegisterState } from './state/useRegisterState';
import { RegisterDef } from './types/register';
import { exportText, importText, loadFromURL, saveToURL } from './ui/importExport';
import { BitFieldControl, applyFieldValue } from './ui/react/BitFieldControl';

const formatHex = (value: number, width = 2) =>
  `0x${value.toString(16).padStart(width, '0').toUpperCase()}`;

const formatHz = (hz: number): string => {
  if (hz >= 1e9) return `${(hz / 1e9).toFixed(3)} GHz`;
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(3)} MHz`;
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(3)} kHz`;
  return `${hz.toFixed(0)} Hz`;
};

const parseHexInput = (value: string): number | null => {
  const trimmed = value.trim();
  const hex = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
  const parsed = parseInt(hex, 16);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 0xff) return null;
  return parsed & 0xff;
};

const extractField = (value: number, bits: string): number => {
  const [high, low] = bits.split(':').map(Number);
  if (low === undefined) {
    const bit = Number(bits);
    return (value >> bit) & 1;
  }
  const min = Math.min(high, low);
  const width = Math.abs(high - low) + 1;
  return (value >> min) & ((1 << width) - 1);
};

const Summary = ({
  state,
  onScrollTo,
}: {
  state: RegisterState;
  onScrollTo: (addr: number) => void;
}) => {
  const summaryItems = [
    { label: 'Base Frequency', value: formatHz(state.getBaseFrequency()), addr: 0x0d },
    { label: 'Channel Spacing', value: formatHz(state.getChannelSpacing()), addr: 0x10 },
    { label: 'Channel', value: state.getChannelNumber().toString(), addr: 0x09 },
    { label: 'Carrier Frequency', value: formatHz(state.getCarrierFrequency()), addr: 0x10 },
    { label: 'Data Rate', value: formatHz(state.getDataRate()), addr: 0x10 },
    {
      label: 'TX Power',
      value: state.getTxPowerDbm() !== null ? `${state.getTxPowerDbm()} dBm` : '—',
      addr: 0x3e,
    },
    { label: 'After RX', value: state.getStateAfterRX(), addr: 0x17 },
    { label: 'After TX', value: state.getStateAfterTX(), addr: 0x17 },
    { label: 'GDO0', value: state.getGDO0Behavior(), addr: 0x02 },
    { label: 'GDO2', value: state.getGDO2Behavior(), addr: 0x00 },
  ];

  return (
    <div className="summary-grid">
      {summaryItems.map((item) => (
        <div
          key={item.label}
          className="summary-item"
          data-scroll-to={formatHex(item.addr)}
          onClick={() => onScrollTo(item.addr)}
        >
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
};

type RegisterCardProps = {
  register: RegisterDef;
  state: RegisterState;
  onFieldChange: (addr: number, bits: string, value: number) => void;
  onResetRegister: (addr: number) => void;
};

const RegisterCard = ({ register, state, onFieldChange, onResetRegister }: RegisterCardProps) => {
  const value = state.getValue(register.addr);
  const resetValue = RegisterTransforms.calculateResetValue(register.addr);
  const isRegisterReset = value === resetValue;

  return (
    <section className="register-card" data-addr={formatHex(register.addr)}>
      <header className="register-card__header">
        <div>
          <div className="register-card__title">
            {formatHex(register.addr)} {register.name}
          </div>
          <div className="register-card__subtitle">{register.description}</div>
        </div>
        <div className="register-card__value">
          <label>
            <span>Value</span>
            <input
              data-type="register-hex"
              data-addr={register.addr}
              value={formatHex(value)}
              onChange={(event) => {
                const parsed = parseHexInput(event.target.value);
                if (parsed === null) return;
                let next = RegisterTransforms.ensureFIFOTHRBit7Cleared(register.addr, parsed);
                next = RegisterTransforms.enforceReadOnlyFields(register.addr, next);
                state.setValue(register.addr, next);
              }}
            />
          </label>
          <div className="register-card__binary">{`${value.toString(2).padStart(8, '0')}b`}</div>
          <div className="register-card__reset">
            <span>
              Reset: {formatHex(resetValue)}{' '}
              {isRegisterReset ? <span className="register-card__reset-match">✓</span> : null}
            </span>
            <button
              className="btn btn-ghost"
              data-action="reset-register"
              data-addr={register.addr}
              onClick={() => onResetRegister(register.addr)}
            >
              Reset to default
            </button>
          </div>
        </div>
      </header>
      <div className="register-card__fields">
        {register.bitFields.map((field) => {
          const isReset =
            field.reset !== null &&
            extractField(state.getValue(register.addr), field.bits) === field.reset;
          const resetInfo =
            field.reset !== null ? (
              <>
                reset: {field.reset}{' '}
                {isReset ? <span className="bitfield__reset-match">✓</span> : null}
              </>
            ) : (
              'reset: —'
            );
          return (
            <div
              className={`bitfield ${field.rw === 'R' ? ' bitfield--readonly' : ''}`}
              data-bits={field.bits}
              key={field.bits}
            >
              <div className="bitfield__header">
                <div className="bitfield__title">
                  <span className="bitfield__name">{field.name || 'Reserved'}</span>
                  {field.rw === 'R' ? <span className="bitfield__readonly">read-only</span> : null}
                </div>
                <div className="bitfield__meta">
                  <span className="bitfield__bits">[{field.bits}]</span>
                  <span className="bitfield__reset" aria-label="Reset value">
                    {resetInfo}
                  </span>
                </div>
              </div>
              <div className="bitfield__control">
                <BitFieldControl
                  state={state}
                  register={register}
                  field={field}
                  currentValue={value}
                  onFieldChange={onFieldChange}
                />
              </div>
              {field.desc ? <div className="bitfield__desc">{field.desc}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

type RegisterListProps = {
  state: RegisterState;
  filterTerm: string;
  onFieldChange: (addr: number, bits: string, value: number) => void;
  onResetRegister: (addr: number) => void;
  onRegisterRef: (addr: number, el: HTMLDivElement | null) => void;
};

const RegisterList = ({
  state,
  filterTerm,
  onFieldChange,
  onResetRegister,
  onRegisterRef,
}: RegisterListProps) => {
  const term = filterTerm.trim().toLowerCase();
  const matches = (reg: RegisterDef) => {
    if (!term) return true;
    const addrHex = reg.addr.toString(16).padStart(2, '0');
    return (
      reg.name.toLowerCase().includes(term) ||
      reg.description.toLowerCase().includes(term) ||
      addrHex.includes(term)
    );
  };

  return (
    <>
      {REGISTERS.filter(matches).map((reg) => (
        <div key={reg.addr} ref={(el) => onRegisterRef(reg.addr, el)}>
          <RegisterCard
            register={reg}
            state={state}
            onFieldChange={onFieldChange}
            onResetRegister={onResetRegister}
          />
        </div>
      ))}
    </>
  );
};

export const App = () => {
  const { state, version, ready } = useRegisterState();
  const [filterTerm, setFilterTerm] = useState('');
  const [onlyChanged, setOnlyChanged] = useState(true);
  const [exportValue, setExportValue] = useState('');
  const [importValue, setImportValue] = useState('');

  const registerRefs = useRef(new Map<number, HTMLDivElement>());

  useEffect(() => {
    if (!ready) return;
    if (window.location.hash) {
      loadFromURL(state, window.location.hash);
    }
  }, [state, ready]);

  useEffect(() => {
    if (!ready) return;
    saveToURL(state.getAllValues(), true);
    setExportValue(exportText(state, onlyChanged));
  }, [state, version, onlyChanged, ready]);

  useEffect(() => {
    if (!ready) return;
    const handler = () => loadFromURL(state, window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [state, ready]);

  const handleFieldChange = (addr: number, bits: string, newFieldValue: number) => {
    const currentValue = state.getValue(addr);
    const updated = applyFieldValue(currentValue, bits, newFieldValue);
    let enforced = RegisterTransforms.ensureFIFOTHRBit7Cleared(addr, updated);
    enforced = RegisterTransforms.enforceReadOnlyFields(addr, enforced);
    state.setValue(addr, enforced);
  };

  const handleResetRegister = (addr: number) => {
    const reset = RegisterTransforms.calculateResetValue(addr);
    state.setValue(addr, reset);
  };

  const handleScrollTo = (addr: number) => {
    const ref = registerRefs.current.get(addr);
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // If filtered out, clear filter and retry after next render.
      setFilterTerm('');
      setTimeout(() => {
        const refAfter = registerRefs.current.get(addr);
        refAfter?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  const exportValueMemo = useMemo(() => exportValue, [exportValue]);

  if (!ready) {
    return (
      <main className="app-shell">
        <header className="app-header">
          <div>
            <h1>CC1101 Configuration Tool</h1>
          </div>
        </header>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>CC1101 Configuration Tool</h1>
        </div>
        <div className="control-group">
          <label>
            Search registers
            <input
              type="text"
              id="registerSearch"
              data-type="register-search"
              placeholder="Name, addr, description"
              value={filterTerm}
              onChange={(event) => setFilterTerm(event.target.value)}
            />
          </label>
        </div>
        <div className="control-group">
          <label>
            Crystal Frequency (MHz)
            <select
              id="crystalFreq"
              data-type="crystal-select"
              value={state.getCrystalFreq()}
              onChange={(event) => state.setCrystalFreq(Number(event.target.value))}
            >
              <option value="26">26</option>
              <option value="27">27</option>
            </select>
          </label>
        </div>
      </header>

      <section className="import-export">
        <div className="panel">
          <div className="panel-header">
            <h3>Export</h3>
            <label className="checkbox-inline">
              <input
                type="checkbox"
                id="exportOnlyChanged"
                data-type="export-changed"
                checked={onlyChanged}
                onChange={(event) => setOnlyChanged(event.target.checked)}
              />
              Only changed
            </label>
          </div>
          <textarea id="exportText" readOnly value={exportValueMemo} />
          <div className="panel-actions">
            <button
              className="btn"
              data-action="copy-export"
              onClick={() => navigator.clipboard?.writeText(exportValueMemo)}
            >
              Copy
            </button>
            <button
              className="btn"
              data-action="refresh-export"
              onClick={() => setExportValue(exportText(state, onlyChanged))}
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h3>Import</h3>
          </div>
          <textarea
            id="importText"
            placeholder="(0x00, 0x29), // IOCFG2"
            value={importValue}
            onChange={(event) => setImportValue(event.target.value)}
          />
          <div className="panel-actions">
            <button
              className="btn btn-primary"
              data-action="apply-import"
              onClick={() => {
                importText(state, importValue);
                setImportValue(importValue);
              }}
            >
              Import
            </button>
          </div>
        </div>
      </section>

      <section className="summary" id="summary">
        <Summary state={state} onScrollTo={handleScrollTo} />
      </section>

      <section className="registers" id="registersContainer">
        <RegisterList
          state={state}
          filterTerm={filterTerm}
          onFieldChange={handleFieldChange}
          onResetRegister={handleResetRegister}
          onRegisterRef={(addr, el) => {
            if (el) {
              registerRefs.current.set(addr, el);
            } else {
              registerRefs.current.delete(addr);
            }
          }}
        />
      </section>
    </main>
  );
};
