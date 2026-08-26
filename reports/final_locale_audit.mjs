import fs from 'node:fs';
import { PROFILE_COPY_LIBRARY } from '../src/profileCopyLibrary.js';
import { getProfileRoleLabel } from '../src/careersDocumentIndex.js';

const locales = ['en', 'fr', 'es', 'it', 'pt', 'de'];
const nonEnglish = new Set(['fr', 'es', 'it', 'pt', 'de']);
const profileKeys = Object.keys(PROFILE_COPY_LIBRARY)
  .filter((k) => /^profile_\d+$/.test(k))
  .sort((a, b) => Number(a.split('_')[1]) - Number(b.split('_')[1]));

const englishTokens = [
  'the', 'and', 'with', 'for', 'from', 'when', 'becomes', 'we', 'you', 'your', 'more',
  'responsibility', 'client', 'development', 'deal', 'making', 'high', 'level', 'management',
  'strategic', 'business', 'direction', 'many', 'agencies', 'offer', 'first', 'year',
  'commission', 'performers', 'earning', 'without', 'moving', 'negotiate', 'competitive',
  'rates', 'deliverables', 'signals', 'routine'
];

const hardEnglishLeak = [
  /\bnegotiate competitive rates and deliverables\b/i,
  /\bmore responsibility for client development and deal-making\b/i,
  /\bhigh-level client management, strategic business development, and direction responsibilities\b/i,
  /\bmany agencies offer\b/i,
  /\bfirst-year ote\b/i,
  /\buncapped commission\b/i,
  /\btop performers earning\b/i,
  /\bwithout moving into direction\b/i,
];

const roleSignals = {
  makeup: ['makeup', 'maquill', 'maquilleur', 'trucc', 'maquiad', 'teint', 'skin', 'beaut', 'look'],
  hair: ['hair', 'coiff', 'peluqu', 'parruc', 'cabeleir', 'friseur', 'capill', 'look'],
  casting: ['casting', 'talent', 'audition', 'shortlist', 'portfolio', 'selection', 'sélection', 'selezione'],
  booker: ['booker', 'booking', 'reserv', 'prenot', 'disponent', 'placement', 'schedule', 'agenda'],
  talentManager: ['talent', 'career', 'carrière', 'carriera', 'carreira', 'contract', 'contrat', 'negoci', 'negozi', 'negocia'],
  editor: ['editor', 'édit', 'edición', 'redattor', 'editorial', 'story', 'narrative', 'content', 'contenu', 'contenido']
};

const genericProfessionalSignals = [
  'creative', 'créative', 'creativa', 'creativo', 'kreativ', 'strateg', 'stratég', 'estrateg',
  'operat', 'operativ', 'production', 'produtt', 'produção', 'talent', 'portfolio', 'marca', 'brand', 'marque'
];

function flattenText(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.map((item) => flattenText(item)).join(' | ');
  if (typeof value === 'object') {
    const parts = [];
    for (const v of Object.values(value)) {
      const t = flattenText(v);
      if (t) parts.push(t);
    }
    return parts.join(' | ');
  }
  return String(value);
}

function detectPersona(role) {
  const r = (role || '').toLowerCase();
  if (/makeup|maquill|maquilleur|trucc|maquiad|maskenbild/.test(r)) return 'makeup';
  if (/hair|coiffeur|coiff|peluqu|parruc|cabeleir|friseur/.test(r)) return 'hair';
  if (/casting/.test(r)) return 'casting';
  if (/booker|reserv|prenot|disponent/.test(r)) return 'booker';
  if (/talent\s*manager|responsable\s*des\s*talents|gestor\s*de\s*talento|responsabile\s*talenti|gestor\s*de\s*talentos|talentmanagement/.test(r)) return 'talentManager';
  if (/fashion\s*editor|editeur\s*de\s*mode|éditeur\s*de\s*mode|editor\s*de\s*moda|redattore\s*di\s*moda/.test(r)) return 'editor';
  return null;
}

function roleKeywords(role) {
  const stop = new Set([
    'de', 'des', 'di', 'da', 'del', 'der', 'für', 'for', 'of', 'and', 'y', 'e', 'la', 'le', 'el', 'die', 'das', 'du', 'do', 'dos', 'da', 'in'
  ]);
  return (role || '')
    .toLowerCase()
    .split(/[^a-zA-ZÀ-ÿ]+/)
    .filter((w) => w && w.length >= 4 && !stop.has(w));
}

function englishLeakScore(text) {
  if (!text) return 0;
  let score = 0;
  for (const rx of hardEnglishLeak) {
    if (rx.test(text)) score += 4;
  }
  const words = (text.toLowerCase().match(/[a-zA-Z][a-zA-Z\-]+/g) || []);
  const count = words.filter((w) => englishTokens.includes(w)).length;
  if (count >= 10) score += 3;
  else if (count >= 5) score += 2;
  else if (count >= 3) score += 1;

  if (/"[^"]{20,}"/.test(text) && /\b(the|and|with|for|more|high|level|client|business|commission)\b/i.test(text)) {
    score += 3;
  }
  return score;
}

function roleContextPass(role, text) {
  const persona = detectPersona(role);
  const signals = persona ? roleSignals[persona] : [];
  const rk = roleKeywords(role);
  const lower = (text || '').toLowerCase();
  const personaHits = signals.filter((s) => lower.includes(s)).length;
  const roleHits = rk.filter((k) => lower.includes(k)).length;
  const genericHits = genericProfessionalSignals.filter((s) => lower.includes(s)).length;
  const pass = personaHits >= 1 || roleHits >= 1 || genericHits >= 2;
  return {
    pass,
    reason: pass ? '' : (persona ? `No ${persona} signal` : 'No role-context signal'),
    persona,
    hits: personaHits + roleHits + genericHits
  };
}

const accentRegexByLocale = {
  fr: /[àâçéèêëîïôùûüÿœæ]/i,
  es: /[áéíóúüñ¿¡]/i,
  it: /[àèéìíîòóù]/i,
  pt: /[áàâãéêíóôõúç]/i,
  de: /[äöüß]/i,
};

function accentPass(locale, text) {
  if (locale === 'en') return true;
  const rx = accentRegexByLocale[locale];
  if (!rx) return true;
  const t = (text || '').trim();
  if (!t) return true;
  const alphaLen = (t.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  if (alphaLen < 40) return true;
  return rx.test(t);
}

const rows = [];

for (const profile of profileKeys) {
  const id = Number(profile.split('_')[1]);
  for (const locale of locales) {
    const entry = PROFILE_COPY_LIBRARY[profile]?.[locale] || {};
    const role = getProfileRoleLabel(id, locale);

    const labelsText = [
      role,
      entry?.labels?.masterclassTitle,
      entry?.labels?.servicesTitle,
      entry?.labels?.challengesTitle,
    ].filter(Boolean).join(' | ');

    const servicesText = flattenText(entry?.services);
    const masterclassText = [
      entry?.masterclass?.name,
      flattenText(entry?.masterclass?.benefits),
      flattenText(entry?.masterclass?.usp),
    ].filter(Boolean).join(' | ');

    const purityFailSections = [];
    if (nonEnglish.has(locale)) {
      if (englishLeakScore(labelsText) > 0) purityFailSections.push('labels');
      if (englishLeakScore(servicesText) > 0) purityFailSections.push('services');
      if (englishLeakScore(masterclassText) > 0) purityFailSections.push('masterclass');
    }

    const roleLabels = roleContextPass(role, labelsText);
    const roleServices = roleContextPass(role, servicesText);
    const roleMaster = roleContextPass(role, masterclassText);

    const accentOverall = accentPass(locale, labelsText + ' ' + servicesText + ' ' + masterclassText);

    rows.push({
      profile,
      profileId: id,
      locale,
      role,
      nativeLanguagePurity: purityFailSections.length === 0,
      accentDiacritic: accentOverall,
      labelsRoleContext: roleLabels.pass,
      servicesRoleContext: roleServices.pass,
      masterclassRoleContext: roleMaster.pass,
      roleContextOverall: roleLabels.pass && roleServices.pass && roleMaster.pass,
      failures: {
        purityFailSections,
        roleSignals: [
          roleLabels.pass ? null : `labels: ${roleLabels.reason}`,
          roleServices.pass ? null : `services: ${roleServices.reason}`,
          roleMaster.pass ? null : `masterclass: ${roleMaster.reason}`,
        ].filter(Boolean)
      },
      snippets: {
        labels: labelsText.slice(0, 320),
        services: servicesText.slice(0, 320),
        masterclass: masterclassText.slice(0, 420)
      }
    });
  }
}

const totals = {
  profilesFound: new Set(rows.map((r) => r.profile)).size,
  rows: rows.length,
  nativeLanguagePurityPass: rows.filter((r) => r.nativeLanguagePurity).length,
  accentDiacriticPass: rows.filter((r) => r.accentDiacritic).length,
  roleContextOverallPass: rows.filter((r) => r.roleContextOverall).length,
  labelsRoleContextPass: rows.filter((r) => r.labelsRoleContext).length,
  servicesRoleContextPass: rows.filter((r) => r.servicesRoleContext).length,
  masterclassRoleContextPass: rows.filter((r) => r.masterclassRoleContext).length,
};

const strictFail = rows.filter((r) => !r.nativeLanguagePurity || !r.accentDiacritic || !r.roleContextOverall);

const payload = { totals, strictFailCount: strictFail.length, rows };
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/final_locale_audit.json', JSON.stringify(payload, null, 2));

let md = '# Final Exhaustive Locale Audit\n\n';
md += `Profiles found: ${totals.profilesFound}\\n`;
md += `Rows: ${totals.rows}\\n\\n`;
md += '| Gate | Pass | Fail |\\n';
md += '|---|---:|---:|\\n';
md += `| Native-language purity | ${totals.nativeLanguagePurityPass} | ${totals.rows - totals.nativeLanguagePurityPass} |\\n`;
md += `| Accent/diacritic correctness | ${totals.accentDiacriticPass} | ${totals.rows - totals.accentDiacriticPass} |\\n`;
md += `| Role-context overall | ${totals.roleContextOverallPass} | ${totals.rows - totals.roleContextOverallPass} |\\n`;
md += `| Labels relevance | ${totals.labelsRoleContextPass} | ${totals.rows - totals.labelsRoleContextPass} |\\n`;
md += `| Services relevance | ${totals.servicesRoleContextPass} | ${totals.rows - totals.servicesRoleContextPass} |\\n`;
md += `| Masterclass relevance | ${totals.masterclassRoleContextPass} | ${totals.rows - totals.masterclassRoleContextPass} |\\n\\n`;

md += '## Strict Failing Rows\n\n';
md += '| Profile | Locale | Purity | Accents | Labels | Services | Masterclass |\\n';
md += '|---|---|---|---|---|---|---|\\n';
for (const r of strictFail) {
  md += `| ${r.profile} | ${r.locale} | ${r.nativeLanguagePurity ? 'PASS' : 'FAIL'} | ${r.accentDiacritic ? 'PASS' : 'FAIL'} | ${r.labelsRoleContext ? 'PASS' : 'FAIL'} | ${r.servicesRoleContext ? 'PASS' : 'FAIL'} | ${r.masterclassRoleContext ? 'PASS' : 'FAIL'} |\\n`;
}

fs.writeFileSync('reports/final_locale_audit.md', md);

console.log(JSON.stringify({ totals, strictFailCount: strictFail.length }, null, 2));
