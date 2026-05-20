import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker } from './serviceWorker';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enables offline support and the "Add to Home Screen" prompt by registering
// the service worker. Runs only in production builds (see implementation).
registerServiceWorker();
