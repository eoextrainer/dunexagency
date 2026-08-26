import React from 'react';
import { createRoot } from 'react-dom/client';
import ProfileOnePage from './ProfileOnePage';
import { getProfileDocument } from './careersDocumentIndex';

function getProfileIdFromLocation() {
  if (typeof window === 'undefined') return 1;

  const byQuery = Number(new URLSearchParams(window.location.search).get('profileId'));
  if (Number.isInteger(byQuery) && byQuery >= 1 && byQuery <= 62) {
    return byQuery;
  }

  const match = window.location.pathname.match(/profile-(\d+)/);
  const byPath = Number(match?.[1]);
  if (Number.isInteger(byPath) && byPath >= 1 && byPath <= 62) {
    return byPath;
  }

  return 1;
}

const profileId = getProfileIdFromLocation();
const profileRaw = getProfileDocument(profileId)?.content || '';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileOnePage profileId={profileId} profileRaw={profileRaw} />
  </React.StrictMode>,
);
