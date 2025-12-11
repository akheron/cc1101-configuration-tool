import { renderRegisters } from './components';
import { updateSummary } from './summary';
import { RegisterState } from '../state/registerState';

export class DOMUpdater {
  private filterTerm = '';
  private scrollPositions = new Map<string, number>();
  private hasInitializedScrollPositions = false;

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
      this.captureScrollPositions();
      registersEl.innerHTML = renderRegisters(this.state, this.filterTerm);
      this.restoreScrollPositions();
      this.ensureInitialScrollPositionsCaptured();
    }
    this.refreshSummary();
  }

  private captureScrollPositions(): void {
    if (!this.hasInitializedScrollPositions) return;
    const containers = this.root.querySelectorAll<HTMLElement>('[data-scroll-key]');
    containers.forEach(container => {
      const key = container.dataset.scrollKey;
      if (key) {
        this.scrollPositions.set(key, container.scrollTop);
      }
    });
  }

  private restoreScrollPositions(): void {
    const containers = this.root.querySelectorAll<HTMLElement>('[data-scroll-key]');
    containers.forEach(container => {
      const key = container.dataset.scrollKey;
      if (!key) return;

      const saved = this.scrollPositions.get(key);
      if (saved !== undefined) {
        container.scrollTop = saved;
      }
      this.scrollSelectedIntoView(container);
    });
  }

  // Ensures the initially selected radios are visible even when there is no saved scroll state.
  // Should be called once after the initial render.
  public scrollInitialSelectionsIntoView(): void {
    if (this.hasInitializedScrollPositions) return;
    const containers = this.root.querySelectorAll<HTMLElement>('[data-scroll-key]');
    containers.forEach(container => {
      this.scrollSelectedIntoView(container);
      const key = container.dataset.scrollKey;
      if (key) {
        this.scrollPositions.set(key, container.scrollTop);
      }
    });
    this.hasInitializedScrollPositions = true;
  }

  private ensureInitialScrollPositionsCaptured(): void {
    if (this.hasInitializedScrollPositions) return;
    const containers = this.root.querySelectorAll<HTMLElement>('[data-scroll-key]');
    containers.forEach(container => {
      const key = container.dataset.scrollKey;
      if (key) {
        this.scrollPositions.set(key, container.scrollTop);
      }
    });
    this.hasInitializedScrollPositions = true;
  }

  private scrollSelectedIntoView(container: HTMLElement): void {
    const selected = container.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    if (!selected) return;

    const selectedTop = this.relativeOffsetTop(selected, container);
    const selectedBottom = selectedTop + selected.offsetHeight;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;

    if (selectedTop < visibleTop) {
      container.scrollTop = selectedTop;
    } else if (selectedBottom > visibleBottom) {
      container.scrollTop = selectedBottom - container.clientHeight;
    }
  }

  private relativeOffsetTop(el: HTMLElement, ancestor: HTMLElement): number {
    let offset = 0;
    let node: HTMLElement | null = el;
    while (node && node !== ancestor) {
      offset += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return offset;
  }
}
