import React from 'react';
import { createRoot } from 'react-dom/client';
import ReviewHub from './ReviewHub';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReviewHub />
  </React.StrictMode>,
);
