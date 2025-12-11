import { RegisterState } from '../state/registerState';

const formatHz = (hz: number): string => {
  if (hz >= 1e9) return `${(hz / 1e9).toFixed(3)} GHz`;
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(3)} MHz`;
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(3)} kHz`;
  return `${hz.toFixed(0)} Hz`;
};

export const renderSummary = (state: RegisterState): string => {
  const base = state.getBaseFrequency();
  const spacing = state.getChannelSpacing();
  const channel = state.getChannelNumber();
  const carrier = state.getCarrierFrequency();
  const dataRate = state.getDataRate();
  const txPower = state.getTxPowerDbm();
  const afterRx = state.getStateAfterRX();
  const afterTx = state.getStateAfterTX();
  const gdo0 = state.getGDO0Behavior();
  const gdo2 = state.getGDO2Behavior();

  return `
    <div class="summary-grid">
      <div class="summary-item" data-scroll-to="0x0D"><span>Base Frequency</span><strong>${formatHz(base)}</strong></div>
      <div class="summary-item" data-scroll-to="0x10"><span>Channel Spacing</span><strong>${formatHz(spacing)}</strong></div>
      <div class="summary-item" data-scroll-to="0x09"><span>Channel</span><strong>${channel}</strong></div>
      <div class="summary-item" data-scroll-to="0x10"><span>Carrier Frequency</span><strong>${formatHz(carrier)}</strong></div>
      <div class="summary-item" data-scroll-to="0x10"><span>Data Rate</span><strong>${formatHz(dataRate)}</strong></div>
      <div class="summary-item" data-scroll-to="0x3E"><span>TX Power</span><strong>${txPower !== null ? `${txPower} dBm` : '—'}</strong></div>
      <div class="summary-item" data-scroll-to="0x17"><span>After RX</span><strong>${afterRx}</strong></div>
      <div class="summary-item" data-scroll-to="0x17"><span>After TX</span><strong>${afterTx}</strong></div>
      <div class="summary-item" data-scroll-to="0x02"><span>GDO0</span><strong>${gdo0}</strong></div>
      <div class="summary-item" data-scroll-to="0x00"><span>GDO2</span><strong>${gdo2}</strong></div>
    </div>
  `;
};

export const updateSummary = (container: HTMLElement, state: RegisterState) => {
  container.innerHTML = renderSummary(state);
};
