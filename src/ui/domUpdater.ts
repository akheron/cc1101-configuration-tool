import { renderRegisters } from './components';
import { updateSummary } from './summary';
import { RegisterState } from '../state/registerState';

export class DOMUpdater {
  private filterTerm = '';

  constructor(private root: HTMLElement, private state: RegisterState) {}

  setFilterTerm(term: string): void {
    this.filterTerm = term;
  }

  refreshSummary(): void {
    const summaryEl = this.root.querySelector<HTMLElement>('#summary');
    if (summaryEl) {
      updateSummary(summaryEl, this.state);
    }
  }

  refreshRegister(_addr: number): void {
    // Re-render all to respect current filters
    this.refreshAll();
  }

  refreshAll(): void {
    const registersEl = this.root.querySelector<HTMLElement>('#registersContainer');
    if (registersEl) {
      registersEl.innerHTML = renderRegisters(this.state, this.filterTerm);
    }
    this.refreshSummary();
  }
}
