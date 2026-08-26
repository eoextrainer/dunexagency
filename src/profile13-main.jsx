import React from 'react';
import { createRoot } from 'react-dom/client';
import ProfileOnePage from './ProfileOnePage';
import profileRaw from '../gallery/Landing-Pages/CAREERS-1.txt?raw';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileOnePage profileId={13} profileRaw={profileRaw} />
  </React.StrictMode>,
);
