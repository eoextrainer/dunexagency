import { PROFILE_COPY_LIBRARY } from '../src/profileCopyLibrary.js';
import { writeFileSync } from 'node:fs';

const locales = ['en', 'fr', 'es', 'it', 'pt', 'de'];
const banned = /(talent discovery|découverte de talents|descubrimiento de talento|scoperta del talento|descoberta de talentos|talentsuche)/i;

const rows = [];
for (let id = 1; id <= 62; id += 1) {
  const key = `profile_${id}`;
  const entry = PROFILE_COPY_LIBRARY[key];
  for (const locale of locales) {
    const roleName = entry?.[locale]?.roleName || '';
    const title = entry?.[locale]?.labels?.challengesTitle || '';
    const passRoleSpecific = Boolean(roleName) && title.toLowerCase().includes(roleName.toLowerCase());
    const passNoGenericTalentDiscovery = !banned.test(title);
    const pass = passRoleSpecific && passNoGenericTalentDiscovery;
    const reasons = [];
    if (!passRoleSpecific) reasons.push('missing-role-name');
    if (!passNoGenericTalentDiscovery) reasons.push('generic-talent-discovery-phrase');
    rows.push({ id, locale, roleName, title, pass, reasons });
  }
}

const edgeIds = [];
for (let id = 1; id <= 62; id += 1) {
  const roleEn = PROFILE_COPY_LIBRARY[`profile_${id}`]?.en?.roleName || '';
  if (/(model|casting|scout|booker|talent)/i.test(roleEn)) edgeIds.push(id);
}

const totals = {
  checks: rows.length,
  pass: rows.filter((r) => r.pass).length,
  fail: rows.filter((r) => !r.pass).length,
};

const perLocale = Object.fromEntries(
  locales.map((locale) => {
    const subset = rows.filter((r) => r.locale === locale);
    return [
      locale,
      {
        pass: subset.filter((r) => r.pass).length,
        fail: subset.filter((r) => !r.pass).length,
      },
    ];
  }),
);

const focusedIds = [59, 60, 61, 62];
const focusedRows = rows.filter((r) => focusedIds.includes(r.id));
const focusedAllPass = focusedRows.every((r) => r.pass);
const edgeRows = rows.filter((r) => edgeIds.includes(r.id));
const failures = rows.filter((r) => !r.pass);

const lines = [];
lines.push('SUMMARY');
lines.push(`total_checks=${totals.checks}`);
lines.push(`total_pass=${totals.pass}`);
lines.push(`total_fail=${totals.fail}`);
lines.push('');

lines.push('FOCUSED_SPOTCHECK_59_62');
for (const id of focusedIds) {
  lines.push(`profile_${id}`);
  for (const locale of locales) {
    const r = focusedRows.find((x) => x.id === id && x.locale === locale);
    lines.push(
      `${locale}: ${r.pass ? 'PASS' : 'FAIL'} | roleName="${r.roleName}" | title="${r.title}"${
        r.pass ? '' : ` | reasons=${r.reasons.join(',')}`
      }`,
    );
  }
  lines.push('');
}

lines.push('FOCUSED_SCOUT_MODEL_EDGES');
lines.push(`edge_ids=${edgeIds.join(',')}`);
for (const id of edgeIds) {
  lines.push(`profile_${id}`);
  for (const locale of locales) {
    const r = edgeRows.find((x) => x.id === id && x.locale === locale);
    lines.push(
      `${locale}: ${r.pass ? 'PASS' : 'FAIL'} | roleName="${r.roleName}" | title="${r.title}"${
        r.pass ? '' : ` | reasons=${r.reasons.join(',')}`
      }`,
    );
  }
  lines.push('');
}

lines.push('ALL_PROFILES_LANGUAGE_SUMMARY');
for (const locale of locales) {
  lines.push(`${locale}: pass=${perLocale[locale].pass}, fail=${perLocale[locale].fail}`);
}
lines.push('');

lines.push('FAILURES');
if (failures.length === 0) {
  lines.push('none');
} else {
  for (const r of failures) {
    lines.push(
      `profile_${r.id} ${r.locale}: roleName="${r.roleName}" | title="${r.title}" | reasons=${r.reasons.join(',')}`,
    );
  }
}

const outPath = 'reports/challenges-title-audit-2026-08-25.txt';
writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');

console.log(`report=${outPath}`);
console.log(`total_checks=${totals.checks} total_pass=${totals.pass} total_fail=${totals.fail}`);
for (const locale of locales) {
  console.log(`${locale}: fail=${perLocale[locale].fail}`);
}
console.log(`focused_59_62_all_pass=${focusedAllPass}`);
