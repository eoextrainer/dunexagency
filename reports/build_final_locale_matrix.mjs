import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('reports/final_locale_audit.json', 'utf8'));
const rows = [...data.rows].sort((a, b) => a.profileId - b.profileId || a.locale.localeCompare(b.locale));

let md = '# Strict Pass/Fail Matrix (62 x 6)\n\n';
md += '| Profile | Locale | Native Purity | Accent/Diacritics | Labels Relevance | Services Relevance | Masterclass Relevance | Overall |\n';
md += '|---|---|---|---|---|---|---|---|\n';

for (const r of rows) {
  const overall = r.nativeLanguagePurity && r.accentDiacritic && r.labelsRoleContext && r.servicesRoleContext && r.masterclassRoleContext;
  md += `| ${r.profile} | ${r.locale} | ${r.nativeLanguagePurity ? 'PASS' : 'FAIL'} | ${r.accentDiacritic ? 'PASS' : 'FAIL'} | ${r.labelsRoleContext ? 'PASS' : 'FAIL'} | ${r.servicesRoleContext ? 'PASS' : 'FAIL'} | ${r.masterclassRoleContext ? 'PASS' : 'FAIL'} | ${overall ? 'PASS' : 'FAIL'} |\n`;
}

fs.writeFileSync('reports/final_locale_matrix.md', md);
console.log(`wrote reports/final_locale_matrix.md with ${rows.length} rows`);
