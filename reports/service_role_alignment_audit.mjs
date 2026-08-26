import { PROFILE_COPY_LIBRARY } from '../src/profileCopyLibrary.js';
import { writeFileSync } from 'node:fs';

const locales = ['en', 'fr', 'es', 'it', 'pt', 'de'];

function detectTrack(roleName) {
  const value = String(roleName || '').toLowerCase();
  if (/(school director|école|escuela|scuola|schule|education|teaching|pedagog|curriculum|academic)/.test(value)) return 'education';
  if (/(photographer|videographer|editorial|post-production|camera|video|ugc|content creator|creator)/.test(value)) return 'content';
  if (/(model|casting|booker|talent|agent|scout)/.test(value)) return 'talent';
  if (/(production|sourcing|quality|logistics|pattern maker|sample maker|operations)/.test(value)) return 'operations';
  if (/(marketing|pr manager|social media|brand marketing|influencer)/.test(value)) return 'marketing';
  if (/(e-commerce|digital asset|chief digital officer|digital)/.test(value)) return 'digital';
  return 'creative';
}

const concernByTrackLocale = {
  en: {
    creative: 'cross-team creative direction under deadline pressure',
    content: 'fast production cycles with quality expectations',
    talent: 'talent readiness, casting quality, and career protection',
    operations: 'delivery reliability across sourcing and production handoffs',
    marketing: 'campaign consistency while proving measurable performance',
    digital: 'conversion growth without compromising premium customer experience',
    education: 'curriculum quality, student progression, and employability outcomes',
  },
  fr: {
    creative: 'la direction créative transverse sous contrainte de délai',
    content: 'des cycles de production rapides avec exigence de qualité',
    talent: 'la maturité des talents, la qualité casting et la protection de trajectoire',
    operations: 'la fiabilité de livraison entre sourcing et production',
    marketing: 'la cohérence campagne avec un pilotage de performance mesurable',
    digital: 'la croissance conversion sans dégrader l’expérience premium',
    education: 'la qualité de curriculum, la progression étudiante et l’employabilité',
  },
  es: {
    creative: 'la dirección creativa transversal bajo presión de plazos',
    content: 'ciclos de producción rápidos con estándar alto de calidad',
    talent: 'la preparación del talento, la calidad de casting y la protección de carrera',
    operations: 'la fiabilidad de entrega entre sourcing y producción',
    marketing: 'la coherencia de campaña con rendimiento medible',
    digital: 'el crecimiento de conversión sin romper la experiencia premium',
    education: 'la calidad curricular, el progreso estudiantil y la empleabilidad',
  },
  it: {
    creative: 'la direzione creativa trasversale sotto pressione di scadenza',
    content: 'cicli di produzione rapidi con standard qualitativi elevati',
    talent: 'la readiness dei talenti, la qualità casting e la protezione di percorso',
    operations: 'l’affidabilità di consegna tra sourcing e produzione',
    marketing: 'la coerenza campagna con performance misurabili',
    digital: 'la crescita conversion senza perdere esperienza premium',
    education: 'la qualità del curriculum, la progressione studenti e l’occupabilità',
  },
  pt: {
    creative: 'a direção criativa transversal sob pressão de prazo',
    content: 'ciclos rápidos de produção com alto padrão de qualidade',
    talent: 'a prontidão dos talentos, a qualidade de casting e a proteção de carreira',
    operations: 'a confiabilidade de entrega entre sourcing e produção',
    marketing: 'a coerência de campanha com performance mensurável',
    digital: 'crescimento de conversão sem comprometer experiência premium',
    education: 'qualidade curricular, progressão dos alunos e empregabilidade',
  },
  de: {
    creative: 'bereichsübergreifende kreative Führung unter Termindruck',
    content: 'schnelle Produktionszyklen bei hohem Qualitätsanspruch',
    talent: 'Talent-Readiness, Casting-Qualität und Karriereschutz',
    operations: 'Liefersicherheit zwischen Sourcing und Produktionsübergaben',
    marketing: 'Kampagnenkonsistenz bei messbarer Performance-Steuerung',
    digital: 'Conversion-Wachstum ohne Verlust der Premium-Customer-Experience',
    education: 'Curriculum-Qualität, Lernfortschritt und Beschäftigungsfähigkeit',
  },
};

const serviceBodiesByLocale = {
  en: (roleName, concern) => [
    `Keeping up with the market should not silence your voice. Cartésiennes offers an immersive reading path shaped for your ${roleName} reality, helping you stay clear and grounded when pressure builds around ${concern}.`,
    `Some weeks demand quality discipline and budget control at the same time. EOEX Studio supports your team with an end-to-end production flow that protects identity, timing, and financial control, especially when ${concern} takes center stage.`,
    `Growth feels lighter when the right partners are around you. MEZENE connects your profile with agency capacity that matches your sector and level, especially when ${concern} begins to narrow your options.`,
    `Bridging training and real industry practice can be intense. Ariella gives you practical workshops and mentoring so you can move through ${concern} with confidence and steadier judgment.`,
  ],
  fr: (roleName, concern) => [
    `Rester à jour ne doit pas vous faire perdre votre voix. Cartésiennes vous propose une lecture immersive alignée sur votre réalité de ${roleName} et le rythme de votre marché, pour traverser plus clairement la pression autour de ${concern}.`,
    `Vous portez souvent en même temps l'exigence qualité et la contrainte budget. EOEX Studio soutient votre équipe avec un flux de production complet qui protège identité, délais et maîtrise des coûts, notamment quand ${concern} devient central.`,
    `Vous n'avez pas à gérer votre croissance seule. MEZENE relie votre profil à une capacité d'agence cohérente avec votre secteur et votre niveau, surtout quand ${concern} commence à freiner votre portée.`,
    `Vous êtes encore en train de réduire l'écart entre formation et réalité terrain. Ariella vous apporte ateliers pratiques et mentorat pour avancer sur ${concern} avec plus d'assurance et de recul.`,
  ],
  es: (roleName, concern) => [
    `Mantenerte al día no debería hacerte perder tu voz. Cartésiennes te ofrece una lectura inmersiva adaptada a tu realidad como ${roleName} y al ritmo de tu mercado, para manejar con más claridad la presión alrededor de ${concern}.`,
    `A menudo llevas calidad y presupuesto al mismo tiempo. EOEX Studio acompaña a tu equipo con un flujo end-to-end que protege identidad, tiempos y control de costes, especialmente cuando ${concern} se vuelve dominante.`,
    `No tienes que empujar tu crecimiento sola. MEZENE conecta tu perfil con capacidad de agencia adecuada a tu sector y nivel, sobre todo cuando ${concern} empieza a limitar tu alcance.`,
    `Todavía estás cerrando la distancia entre formación e industria real. Ariella te aporta talleres prácticos y mentoría para atravesar ${concern} con más seguridad y criterio.`,
  ],
  it: (roleName, concern) => [
    `Restare aggiornata non dovrebbe farti perdere la tua voce. Cartésiennes ti offre una lettura immersiva pensata per la tua realtà di ${roleName} e per il ritmo del tuo mercato, così puoi gestire con più lucidità la pressione legata a ${concern}.`,
    `Spesso sostieni qualità e budget nello stesso momento. EOEX Studio supporta il team con un flusso end-to-end che protegge identità, tempi e controllo costi, soprattutto quando ${concern} diventa il nodo principale.`,
    `Non devi affrontare la crescita da sola. MEZENE collega il tuo profilo a una capacità agenzia coerente con settore e livello, specialmente quando ${concern} inizia a ridurre la tua portata.`,
    `Stai ancora colmando il divario tra formazione e realtà professionale. Ariella ti offre workshop pratici e mentoring per affrontare ${concern} con più sicurezza e metodo.`,
  ],
  pt: (roleName, concern) => [
    `Manter-se atualizada não deve custar a sua própria voz. Cartésiennes entrega uma leitura imersiva alinhada à sua realidade de ${roleName} e ao ritmo do seu mercado, para tornar mais clara a pressão em torno de ${concern}.`,
    `Você costuma carregar qualidade e orçamento ao mesmo tempo. EOEX Studio apoia seu time com um fluxo end-to-end que protege identidade, prazo e controle financeiro, principalmente quando ${concern} ganha peso.`,
    `Você não precisa conduzir seu crescimento sozinha. MEZENE conecta seu perfil à capacidade de agência adequada ao seu setor e nível, especialmente quando ${concern} começa a reduzir seu alcance.`,
    `Você ainda está fechando a distância entre formação e chão de indústria. Ariella oferece workshops práticos e mentoria para atravessar ${concern} com mais confiança e clareza.`,
  ],
  de: (roleName, concern) => [
    `Aktuell zu bleiben sollte Sie nicht die eigene Handschrift kosten. Cartésiennes bietet Ihnen einen immersiven Lesepfad, abgestimmt auf Ihre ${roleName}-Realität und den Rhythmus Ihres Marktes, damit Druck rund um ${concern} klarer einzuordnen ist.`,
    `Sie tragen oft gleichzeitig Qualitäts- und Budgetdruck. EOEX Studio unterstützt Ihr Team mit einem End-to-End-Produktionsfluss, der Identität, Timing und finanzielle Kontrolle schützt, besonders wenn ${concern} den Alltag dominiert.`,
    `Sie müssen Wachstum nicht allein tragen. MEZENE verbindet Ihr Profil mit Agenturkapazität, die zu Sektor und Level passt, vor allem wenn ${concern} Ihre Reichweite zu begrenzen beginnt.`,
    `Sie schließen noch die Lücke zwischen Ausbildung und echter Branchenpraxis. Ariella bietet praxisnahe Workshops und Mentoring, damit Sie ${concern} mit mehr Sicherheit und klarerem Urteil bewältigen.`,
  ],
};

const bannedLeak = /(masterclass for talent scouts|when pressure sounds like|build resilience with eoex'?s wellbeing programs|constant content creation)/i;

const rows = [];
for (let id = 1; id <= 62; id += 1) {
  const key = `profile_${id}`;
  for (const locale of locales) {
    const copy = PROFILE_COPY_LIBRARY[key]?.[locale];
    const roleName = copy?.roleName || '';
    const track = detectTrack(roleName);
    const concern = (concernByTrackLocale[locale] || concernByTrackLocale.en)[track] || concernByTrackLocale.en.creative;
    const bodyFactory = serviceBodiesByLocale[locale] || serviceBodiesByLocale.en;
    const bodies = bodyFactory(roleName, concern);
    const services = [
      { title: 'EOEX Cartésiennes', body: bodies[0] },
      { title: 'EOEX Studio', body: bodies[1] },
      { title: 'MEZENE', body: bodies[2] },
      { title: 'Ariella', body: bodies[3] },
    ];
    const joined = services.map((s) => `${s.title} ${s.body}`).join(' | ');

    const checks = {
      hasFourServices: services.length === 4,
      mentionsRole: joined.toLowerCase().includes(roleName.toLowerCase()),
      mentionsTrackConcern: joined.toLowerCase().includes(concern.toLowerCase()),
      noBannedLeak: !bannedLeak.test(joined),
    };

    const pass = Object.values(checks).every(Boolean);
    const failReasons = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
    rows.push({ id, locale, roleName, track, concern, services, pass, failReasons });
  }
}

const total = rows.length;
const passed = rows.filter((r) => r.pass).length;
const failed = rows.filter((r) => !r.pass);

const byLocale = Object.fromEntries(
  locales.map((locale) => {
    const subset = rows.filter((r) => r.locale === locale);
    return [locale, { pass: subset.filter((r) => r.pass).length, fail: subset.filter((r) => !r.pass).length }];
  }),
);

const lines = [];
lines.push('SERVICE_ROLE_ALIGNMENT_AUDIT_RENDER_LEVEL');
lines.push(`total_checks=${total}`);
lines.push(`total_pass=${passed}`);
lines.push(`total_fail=${failed.length}`);
lines.push('');

lines.push('LOCALE_SUMMARY');
for (const locale of locales) {
  lines.push(`${locale}: pass=${byLocale[locale].pass}, fail=${byLocale[locale].fail}`);
}
lines.push('');

lines.push('GENERATED_SERVICE_TEXT_62x6');
for (const row of rows) {
  lines.push(`profile_${row.id} | ${row.locale} | role=${row.roleName} | track=${row.track} | ${row.pass ? 'PASS' : 'FAIL'}${row.pass ? '' : ` | reasons=${row.failReasons.join(',')}`}`);
  lines.push(`  concern: ${row.concern}`);
  row.services.forEach((service, idx) => {
    lines.push(`  S${idx + 1} title: ${service.title}`);
    lines.push(`  S${idx + 1} body: ${service.body}`);
  });
  lines.push('');
}

lines.push('FAILURES');
if (failed.length === 0) {
  lines.push('none');
} else {
  failed.forEach((row) => {
    lines.push(`profile_${row.id} ${row.locale} role=${row.roleName} reasons=${row.failReasons.join(',')}`);
  });
}

const outPath = 'reports/service-role-alignment-2026-08-25.txt';
writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');

console.log(`report=${outPath}`);
console.log(`total_checks=${total} total_pass=${passed} total_fail=${failed.length}`);
for (const locale of locales) {
  console.log(`${locale}: pass=${byLocale[locale].pass} fail=${byLocale[locale].fail}`);
}
