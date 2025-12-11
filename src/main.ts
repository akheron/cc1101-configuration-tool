import './styles/main.css';

import { RegisterState } from './state/registerState';
import { renderShell } from './ui/components';
import { DOMUpdater } from './ui/domUpdater';
import { EventManager } from './ui/eventManager';
import { updateSummary } from './ui/summary';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Root container #app not found');
}

const state = new RegisterState();
state.initialize();

app.innerHTML = renderShell(state);

const domUpdater = new DOMUpdater(app, state);
const eventManager = new EventManager(app, state, domUpdater);

// Wire listeners
state.subscribe(change => {
  if (change.type === 'register-update') {
    domUpdater.refreshRegister(change.addr);
    domUpdater.refreshSummary();
  }
  if (change.type === 'bulk-update') {
    domUpdater.refreshAll();
  }
  if (change.type === 'crystal-freq-update') {
    domUpdater.refreshSummary();
  }
  eventManager.handleStateChange();
});

eventManager.bind();

// Initial summary render
const summaryEl = app.querySelector<HTMLElement>('#summary');
if (summaryEl) {
  updateSummary(summaryEl, state);
}
