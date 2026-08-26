import React from 'react';
import { createRoot } from 'react-dom/client';
import LandingDocPage from './LandingDocPage';

const docKey = document.body.dataset.docKey || 'careers-1';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LandingDocPage docKey={docKey} />
  </React.StrictMode>,
);
