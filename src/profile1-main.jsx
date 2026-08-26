import React from 'react';
import { createRoot } from 'react-dom/client';
import ProfileOnePage from './ProfileOnePage';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileOnePage profileId={1} />
  </React.StrictMode>,
);
