import { getProfileDocument, getProfileRoleLabel, getProfileRoleSummary } from './careersDocumentIndex';

export const ACTIVE_PROFILE_IDS = Array.from({ length: 62 }, (_, index) => index + 1);

const PROFILE_SOURCE_MAP = ACTIVE_PROFILE_IDS.map((id) => {
  const document = getProfileDocument(id);
  return {
    id,
    slug: `profile-${id}`,
    title: getProfileRoleLabel(id, 'en'),
    roleLabel: getProfileRoleLabel(id, 'en'),
    summary: getProfileRoleSummary(id, 'en'),
    sourceKey: document?.sourceKey || 'CAREERS-1.txt',
    lines: (document?.content || '').replace(/\r\n/g, '\n').split('\n'),
  };
});

export const ALL_PROFILES = PROFILE_SOURCE_MAP;