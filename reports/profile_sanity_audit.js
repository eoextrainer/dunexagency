import fs from 'node:fs';

const files = [
  'gallery/Landing-Pages/CAREERS-1.txt',
  'gallery/Landing-Pages/CAREERS-2.txt',
  'gallery/Landing-Pages/CAREERS-3.txt',
];

const docRegex = /^\s*Document\s+(\d+)\s*(?:of\s*\d+\+?|\(Revised\))\s*:\s*(.+?)\s*$/i;
const byId = new Map();

for (const rel of files) {
  const raw = fs.readFileSync(rel, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(docRegex);
    if (!match) continue;
    byId.set(Number(match[1]), match[2].trim());
  }
}

byId.set(61, 'Fashion Modelling School Director');
byId.set(62, 'Fashion Design School Director');

function roleLabel(title) {
  return String(title || '').split('(')[0].trim();
}

function containsAny(value, tokens) {
  return tokens.some((token) => value.includes(token));
}

function trackOf(role) {
  const value = String(role || '').toLowerCase();

  if (containsAny(value, ['school director', 'école', 'escuela', 'scuola', 'schule', 'education', 'teaching', 'pedagog', 'curriculum', 'academic', 'mannequinat', 'modelaje', 'modellazione', 'modelagem', 'didactic', 'didattica', 'didática'])) return 'education';
  if (containsAny(value, ['photographer', 'videographer', 'editorial', 'post-production', 'post production', 'camera', 'video'])) return 'content';
  if (containsAny(value, ['model', 'casting', 'booker', 'talent', 'agent', 'scout'])) return 'talent';
  if (containsAny(value, ['production', 'sourcing', 'quality', 'logistics', 'pattern maker', 'sample maker', 'operations'])) return 'operations';
  if (containsAny(value, ['marketing', 'pr manager', 'social media', 'brand marketing', 'influencer'])) return 'marketing';
  if (containsAny(value, ['e-commerce', 'digital asset', 'chief digital officer', 'digital'])) return 'digital';
  return 'creative';
}

const ids = Array.from({ length: 62 }, (_, index) => index + 1);
const counts = { education: 0, content: 0, talent: 0, operations: 0, marketing: 0, digital: 0, creative: 0 };
const flagged = [];
const rows = [];

for (const id of ids) {
  const title = byId.get(id) || 'Creative Director';
  const role = roleLabel(title);
  const track = trackOf(role);

  counts[track] = (counts[track] || 0) + 1;

  const lower = role.toLowerCase();
  const schoolLike = containsAny(lower, ['school director', 'école', 'escuela', 'scuola', 'schule']);
  const videoLike = containsAny(lower, ['videographer', 'video', 'camera']);
  const reasons = [];

  if (schoolLike && track !== 'education') reasons.push('school-director role not classified as education');
  if (videoLike && track !== 'content') reasons.push('videographer/video role not classified as content');
  if (schoolLike && videoLike) reasons.push('school-director title contains video/videographer terms');
  if (/(\bdisenador\b|\bvideografo\b|\bproducao\b|\bqualitat\b)/i.test(role)) reasons.push('possible broken token artifact in role label');

  rows.push({ id, role, track });
  if (reasons.length > 0) flagged.push({ id, role, reasons });
}

let output = '';
output += 'ID | ROLE | TRACK\n';
output += '---|---|---\n';
for (const row of rows) {
  output += `${String(row.id).padStart(2, '0')} | ${row.role} | ${row.track}\n`;
}

output += '\nFLAGGED\n';
if (flagged.length === 0) {
  output += 'none\n';
} else {
  for (const entry of flagged) {
    output += `${String(entry.id).padStart(2, '0')} | ${entry.role} | ${entry.reasons.join('; ')}\n`;
  }
}

output += '\nSUMMARY\n';
output += `education=${counts.education}, content=${counts.content}, talent=${counts.talent}, operations=${counts.operations}, marketing=${counts.marketing}, digital=${counts.digital}, creative=${counts.creative}\n`;
output += `total_flagged=${flagged.length}\n`;

fs.writeFileSync('reports/profile-sanity-2026-08-25.txt', output, 'utf8');
console.log('Wrote reports/profile-sanity-2026-08-25.txt');
