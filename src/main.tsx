import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/main.css';

import { App } from './App';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Root container #app not found');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
