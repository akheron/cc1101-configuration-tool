import { applyFieldValue } from './components';
import { DOMUpdater } from './domUpdater';
import { exportText, importText, loadFromURL, saveToURL } from './importExport';
import { RegisterTransforms } from '../logic/transforms';
import { RegisterState } from '../state/registerState';

const parseHexInput = (value: string): number | null => {
  const trimmed = value.trim();
  const hex = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;
  const parsed = parseInt(hex, 16);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 0xff) return null;
  return parsed & 0xff;
};

export class EventManager {
  private isLoadingFromHash = false;

  constructor(private root: HTMLElement, private state: RegisterState, private domUpdater: DOMUpdater) {}

  bind(): void {
    this.root.addEventListener('input', this.handleInputChange);
    this.root.addEventListener('change', this.handleChange);
    this.root.addEventListener('click', this.handleClick);
    window.addEventListener('hashchange', this.handleHashChange);
    if (window.location.hash) {
      this.isLoadingFromHash = true;
      loadFromURL(this.state, window.location.hash);
      this.isLoadingFromHash = false;
    }
    this.refreshExportTextarea();
  }

  handleStateChange = (): void => {
    if (this.isLoadingFromHash) return;
    saveToURL(this.state.getAllValues());
    this.refreshExportTextarea();
  };

  private handleInputChange = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.matches('[data-type="register-hex"]')) {
      const input = target as HTMLInputElement;
      const addr = Number(input.dataset.addr);
      const parsed = parseHexInput(input.value);
      if (parsed === null) return;
      let value = RegisterTransforms.ensureFIFOTHRBit7Cleared(addr, parsed);
      value = RegisterTransforms.enforceReadOnlyFields(addr, value);
      this.state.setValue(addr, value);
      // update binary display next sibling
      const binary = input.parentElement?.parentElement?.querySelector('.register-card__binary');
      if (binary) binary.textContent = value.toString(2).padStart(8, '0') + 'b';
    }

    if (target.matches('[data-type="register-search"]')) {
      const input = target as HTMLInputElement;
      this.domUpdater.setFilterTerm(input.value);
      this.domUpdater.refreshAll();
    }
  };

  private handleChange = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.matches('[data-type="field-radio"], [data-type="field-number"], [data-type="field-checkbox"]')) {
      const input = target as HTMLInputElement;
      const addr = Number(input.dataset.addr);
      const bits = input.dataset.bits;
      if (!bits) return;
      const currentValue = this.state.getValue(addr);
      const newFieldValue =
        input.dataset.type === 'field-checkbox' ? (input as HTMLInputElement).checked ? 1 : 0 : Number(input.value);
      const updated = applyFieldValue(currentValue, bits, newFieldValue);
      let enforced = RegisterTransforms.ensureFIFOTHRBit7Cleared(addr, updated);
      enforced = RegisterTransforms.enforceReadOnlyFields(addr, enforced);
      this.state.setValue(addr, enforced);
    }

    if (target.matches('[data-type="crystal-select"]')) {
      const select = target as HTMLSelectElement;
      const value = Number(select.value);
      this.state.setCrystalFreq(value);
    }
  };

  private handleClick = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.matches('[data-action="copy-export"]')) {
      const textarea = this.root.querySelector<HTMLTextAreaElement>('#exportText');
      if (textarea) {
        navigator.clipboard?.writeText(textarea.value);
      }
    }

    if (target.matches('[data-action="refresh-export"]')) {
      this.refreshExportTextarea();
    }

    if (target.matches('[data-action="apply-import"]')) {
      const textarea = this.root.querySelector<HTMLTextAreaElement>('#importText');
      if (textarea) {
        importText(this.state, textarea.value);
      }
    }

    if (target.matches('[data-action="reset-register"]')) {
      const addr = Number(target.getAttribute('data-addr'));
      if (Number.isFinite(addr)) {
        const reset = RegisterTransforms.calculateResetValue(addr);
        this.state.setValue(addr, reset);
      }
    }

    const scrollTarget = target.closest('[data-scroll-to]') as HTMLElement | null;
    if (scrollTarget) {
      const addrHex = scrollTarget.dataset.scrollTo;
      let card = this.root.querySelector<HTMLElement>(`.register-card[data-addr="${addrHex}"]`);
      if (!card) {
        // ensure card exists if filtered out
        this.domUpdater.setFilterTerm('');
        this.domUpdater.refreshAll();
        card = this.root.querySelector<HTMLElement>(`.register-card[data-addr="${addrHex}"]`);
      }
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  private handleHashChange = () => {
    this.isLoadingFromHash = true;
    loadFromURL(this.state, window.location.hash);
    this.isLoadingFromHash = false;
  };

  private refreshExportTextarea() {
    const textarea = this.root.querySelector<HTMLTextAreaElement>('#exportText');
    const onlyChanged = this.root.querySelector<HTMLInputElement>('#exportOnlyChanged')?.checked ?? false;
    if (textarea) {
      textarea.value = exportText(this.state, onlyChanged);
    }
  }
}
