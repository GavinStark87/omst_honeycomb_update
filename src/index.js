import React from 'react';
import { createRoot } from 'react-dom/client';  // ← Note: from 'react-dom/client'
import App from './App/App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
