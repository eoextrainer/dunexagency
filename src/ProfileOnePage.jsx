import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './LandingPage-base.css';
import './LandingPage.css';
import './ProfileOnePage.css';
import profileOneRaw from '../gallery/Landing-Pages/CAREERS-1.txt?raw';
import { PROFILE_COPY_LIBRARY, PROFILE_ROLE_BY_ID, getCanonicalRoleLabel } from './profileCopyLibrary';

const HERO_VIDEO_MAP = import.meta.glob('../gallery/models/*.{mp4,mov,webm,m4v}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const MASTERCLASS_VIDEO_MAP = import.meta.glob('../gallery/masterclass/*.{mp4,mov,webm,m4v}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const FASHION_IMAGE_MAPS = [
  import.meta.glob('../gallery/fashion/1/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }),
  import.meta.glob('../gallery/fashion/2/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }),
  import.meta.glob('../gallery/fashion/3/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }),
  import.meta.glob('../gallery/fashion/4/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }),
];

const LANGUAGES = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'fr', short: 'FR', name: 'Français' },
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'it', short: 'IT', name: 'Italiano' },
  { code: 'pt', short: 'PT', name: 'Português' },
  { code: 'de', short: 'DE', name: 'Deutsch' },
];

// EOEX value proposition shown as the services section heading — the ethical bridge
// between creators, talents and consumers in fashion and retail.
const EOEX_VALUE_PROPOSITIONS = {
  en: 'EOEX: the ethical bridge between creators, talents and consumers',
  fr: 'EOEX : le pont éthique entre créateurs, talents et consommateurs',
  es: 'EOEX: el puente ético entre creadores, talentos y consumidores',
  it: 'EOEX: il ponte etico tra creativi, talenti e consumatori',
  pt: 'EOEX: a ponte ética entre criadores, talentos e consumidores',
  de: 'EOEX: die ethische Brücke zwischen Creators, Talenten und Konsumenten',
};

// Replaces the generic "Become a better, {role}" masterclass heading with a warmer,
// more compelling invitation that stays concise.
const MASTERCLASS_SECTION_INVITATION = {
  en: 'Shape the next chapter of your craft — with the right partner by your side',
  fr: 'Écrivez la suite de votre parcours — avec le bon partenaire à vos côtés',
  es: 'Traza el siguiente capítulo de tu oficio — con el compañero adecuado a tu lado',
  it: 'Scrivi il prossimo capitolo del tuo mestiere — con il partner giusto al tuo fianco',
  pt: 'Escreva o próximo capítulo do seu ofício — com o parceiro certo ao seu lado',
  de: 'Schreiben Sie das nächste Kapitel Ihres Handwerks — mit dem richtigen Partner an Ihrer Seite',
};

// Extra narrative sentences appended to every carousel slide so the copy fills the
// profile text container without losing the authentic, human tone of the role.
const IMMERSIVE_SLIDE_TAILS = {
  en: [
    'And on the days when the pressure of this career rises, that clarity becomes your anchor.',
    'Every decision counts — with the right support, structure and people around you, you can hold your standards without losing your rhythm.',
  ],
  fr: [
    'Et les jours où la pression de ce métier monte, cette clarté devient votre socle.',
    'Chaque décision compte : avec la bonne structure, le bon réseau et les bonnes personnes, vous tenez votre exigence sans perdre votre rythme.',
  ],
  es: [
    'Y en los días en que la presión de esta carrera sube, esa claridad se convierte en tu ancla.',
    'Cada decisión cuenta: con estructura, red y personas adecuadas, mantienes tu nivel sin sacrificar tu ritmo.',
  ],
  it: [
    'E nei giorni in cui la pressione di questa carriera sale, quella chiarezza diventa la tua àncora.',
    'Ogni decisione conta: con la struttura, la rete e le persone giuste, mantieni il tuo standard senza perdere il ritmo.',
  ],
  pt: [
    'E nos dias em que a pressão dessa carreira aumenta, essa clareza se torna a sua âncora.',
    'Cada decisão importa: com estrutura, rede e as pessoas certas, você mantém o padrão sem perder o ritmo.',
  ],
  de: [
    'Und an den Tagen, an denen der Druck dieser Karriere steigt, wird diese Klarheit zu Ihrem Anker.',
    'Jede Entscheidung zählt: mit der richtigen Struktur, dem Netzwerk und den Menschen an Ihrer Seite halten Sie Ihren Standard, ohne Ihren Rhythmus zu verlieren.',
  ],
};

function AidaCarouselSlide(slide, language) {
  const tails = IMMERSIVE_SLIDE_TAILS[language] || IMMERSIVE_SLIDE_TAILS.en;
  const cleanBase = String(slide.text || '').replace(/[.!?…\s]+$/, '');
  const expanded = `${cleanBase}. ${tails[0]} ${tails[1]}`;
  return { ...slide, text: expanded };
}

function enrichCarouselSlides(slides, language) {
  return (slides || []).map((slide) => AidaCarouselSlide(slide, language));
}

// Returns a localized challenge opener for a given card index (used to pad to 8 cards).
function challengeOpenersForIndex(index, language) {
  const openers = {
    en: [
      'You are probably feeling this in real life:',
      'You are not imagining it, this pressure is real:',
      'You are usually making hard calls around this point:',
      'You are most exposed to friction when this happens:',
      'You are likely losing momentum when this repeats:',
      'You are seeing this pattern come back again:',
      'You are right to treat this as an early warning:',
      'You are carrying more than people see when this keeps happening:',
    ],
    fr: [
      'Dans votre quotidien, cela apparaît souvent ainsi :',
      'Une pression récurrente du rôle ressemble à ceci :',
      'Vos arbitrages les plus délicats tournent souvent autour de :',
      'Dans les moments sensibles, la friction démarre souvent ici :',
      'Vous sentez le rythme ralentir quand ceci revient :',
      'Un schéma difficile qui se répète prend souvent cette forme :',
      'Un signal d’alerte à traiter tôt est le suivant :',
      'Votre solidité est la plus testée quand cela devient fréquent :',
    ],
    es: [
      'En tu día a día, esto suele aparecer así:',
      'Una presión recurrente del rol se parece a esto:',
      'Tus decisiones más delicadas suelen girar alrededor de esto:',
      'En momentos de alta exigencia, la fricción suele empezar aquí:',
      'Sientes que el ritmo cae cuando vuelve esto:',
      'Un patrón difícil que se repite para ti toma esta forma:',
      'Una señal de alerta que conviene atender pronto es esta:',
      'Tu resiliencia se pone a prueba cuando esto se vuelve frecuente:',
    ],
    it: [
      'Nel tuo quotidiano, questa realtà appare spesso così:',
      'Una pressione ricorrente del ruolo prende questa forma:',
      'Le decisioni più delicate ruotano spesso attorno a questo:',
      'Nei momenti ad alta intensità, l’attrito inizia spesso qui:',
      'Senti il ritmo rallentare quando ritorna questo scenario:',
      'Un pattern difficile che si ripete è il seguente:',
      'Un campanello d’allarme da intercettare presto è questo:',
      'La tua tenuta viene testata quando questo diventa frequente:',
    ],
    pt: [
      'No seu dia a dia, isso costuma aparecer assim:',
      'Uma pressão recorrente do papel se apresenta assim:',
      'Suas decisões mais delicadas geralmente giram em torno disto:',
      'Nos momentos de alta exigência, o atrito costuma começar aqui:',
      'Você sente o ritmo cair quando isso volta a acontecer:',
      'Um padrão difícil que se repete para você é este:',
      'Um sinal de alerta para tratar cedo é o seguinte:',
      'Sua resiliência é mais testada quando isso vira recorrente:',
    ],
    de: [
      'In Ihrem Alltag zeigt sich das oft so:',
      'Ein wiederkehrender Druckpunkt in dieser Rolle sieht so aus:',
      'Ihre schwierigsten Entscheidungen drehen sich häufig um Folgendes:',
      'In besonders kritischen Phasen beginnt Reibung oft hier:',
      'Sie spüren Tempoverlust, wenn dieses Muster wieder auftaucht:',
      'Ein schwieriges Muster, das sich wiederholt, hat oft diese Form:',
      'Ein Frühwarnsignal, das Sie früh adressieren sollten, ist dieses:',
      'Ihre Belastbarkeit wird getestet, wenn das regelmäßig passiert:',
    ],
  };
  const pool = openers[language] || openers.en;
  return pool[Math.max(0, Number(index) || 0) % pool.length];
}

// Extra challenge cards so every profile always shows exactly 8 (4 per row on desktop).
const CHALLENGE_FILLERS = {
  en: [
    'You are being asked to sustain a high standard of excellence at a moment when resources are being reduced.',
    'Your decisions happen under time pressure, but their effect is measured over seasons.',
    'Between creative ambition and commercial reality, you constantly negotiate a line that must not break.',
    'The visibility of your work is rising, and with it the weight of every detail that misses your standard.',
  ],
  fr: [
    'On vous demande de tenir un niveau d’excellence élevé alors que les ressources se font plus réduites.',
    'Vous décidez sous pression du calendrier, alors que l’effet de vos choix se mesure sur plusieurs saisons.',
    'Entre ambition créative et réalité commerciale, vous négociez en permanence une ligne qui ne doit pas céder.',
    'La visibilité de votre travail augmente, et avec elle le poids de chaque détail qui échappe à votre œil.',
  ],
  es: [
    'Se espera que sostengas un estándar muy alto en un contexto de recursos cada vez más limitados.',
    'Tus decisiones ocurren bajo presión de calendario, cuando su efecto se mide por temporadas.',
    'Entre ambición creativa y realidad comercial, negocias una línea que no debe romperse.',
    'La visibilidad de tu trabajo crece, y con ella el peso de cada detalle que se escapa a tu mirada.',
  ],
  it: [
    'Ti viene chiesta un’eccellenza continua in un contesto di risorse sempre più ridotte.',
    'Le tue decisioni avvengono sotto pressione di calendario, ma l’effetto si misura su più stagioni.',
    'Tra ambizione creativa e realtà commerciale negozi una linea che non deve cedere.',
    'La visibilità del tuo lavoro cresce, e con essa il peso di ogni dettaglio che sfugge alla tua vista.',
  ],
  pt: [
    'Espera-se que você sustente um nível de excelência alto em um momento de recursos mais limitados.',
    'Suas decisões acontecem sob pressão de prazos, mas o efeito é medido por temporadas.',
    'Entre ambição criativa e realidade comercial, você negocia uma linha que não pode quebrar.',
    'A visibilidade do seu trabalho cresce, e com ela o peso de cada detalhe que escapa aos seus olhos.',
  ],
  de: [
    'Von Ihnen wird hohe Exzellenz erwartet, obwohl die Ressourcen spürbar knapper werden.',
    'Ihre Entscheidungen fallen unter Zeitdruck, ihre Wirkung aber zeigt sich über mehrere Saisons.',
    'Zwischen kreativem Anspruch und kommerzieller Realität balancieren Sie eine Linie, die nicht reißen darf.',
    'Die Sichtbarkeit Ihrer Arbeit wächst, und mit ihr das Gewicht jedes Details, das Ihrer Aufmerksamkeit entgeht.',
  ],
};

const PROFILE_VOICE = {
  en: {
    eyebrow: (role) => `Inside the ${role} role`,
    insights: ['Strategic Scope', 'Creative Authority', 'Market Pressure', 'Leadership Impact'],
    insight: (role, index) => `${role}: ${(PROFILE_VOICE.en.insights[index] || PROFILE_VOICE.en.insights[PROFILE_VOICE.en.insights.length - 1])}`,
  },
  fr: {
    eyebrow: (role) => `Au cœur du rôle ${role}`,
    insights: ['Portée stratégique', 'Autorité créative', 'Pression du marché', 'Impact du leadership'],
    insight: (role, index) => `${role}: ${(PROFILE_VOICE.fr.insights[index] || PROFILE_VOICE.fr.insights[PROFILE_VOICE.fr.insights.length - 1])}`,
  },
  es: {
    eyebrow: (role) => `Dentro del rol de ${role}`,
    insights: ['Alcance estratégico', 'Autoridad creativa', 'Presión del mercado', 'Impacto de liderazgo'],
    insight: (role, index) => `${role}: ${(PROFILE_VOICE.es.insights[index] || PROFILE_VOICE.es.insights[PROFILE_VOICE.es.insights.length - 1])}`,
  },
  it: {
    eyebrow: (role) => `Dentro il ruolo di ${role}`,
    insights: ['Portata strategica', 'Autorevolezza creativa', 'Pressione del mercato', 'Impatto della leadership'],
    insight: (role, index) => `${role}: ${(PROFILE_VOICE.it.insights[index] || PROFILE_VOICE.it.insights[PROFILE_VOICE.it.insights.length - 1])}`,
  },
  pt: {
    eyebrow: (role) => `Por dentro do papel de ${role}`,
    insights: ['Escopo estratégico', 'Autoridade criativa', 'Pressão do mercado', 'Impacto da liderança'],
    insight: (role, index) => `${role}: ${(PROFILE_VOICE.pt.insights[index] || PROFILE_VOICE.pt.insights[PROFILE_VOICE.pt.insights.length - 1])}`,
  },
  de: {
    eyebrow: (role) => `Im Zentrum der Rolle ${role}`,
    insights: ['Strategische Reichweite', 'Kreative Autorität', 'Marktdruck', 'Führungswirkung'],
    insight: (role, index) => `${role}: ${(PROFILE_VOICE.de.insights[index] || PROFILE_VOICE.de.insights[PROFILE_VOICE.de.insights.length - 1])}`,
  },
};

const ROLE_VOICE_LAYERS = {
  en: {
    navProfile: (role) => role,
    heroSubtitle: (role) => `A focused brief for ${role}.`,
    profileEyebrow: (role) => `How the ${role} role really works`,
    challengesTitle: (role) => `Key tensions in the ${role} role today`,
    servicesTitle: (role) => `Practical support designed for ${role}`,
    masterclassTitle: () => 'Your chance to discover the EOEX universe first hand',
    masterclassName: (role) => `${role} Masterclass`,
    cta: () => 'View Program Details',
  },
  fr: {
    navProfile: (role) => role,
    heroSubtitle: (role) => `Un briefing clair pour votre rôle de ${role}.`,
    profileEyebrow: (role) => `Comment le rôle de ${role} fonctionne vraiment`,
    challengesTitle: (role) => `Les tensions majeures du rôle de ${role} aujourd'hui`,
    servicesTitle: (role) => `Un accompagnement concret pensé pour ${role}`,
    masterclassTitle: () => 'Votre chance de découvrir l\'univers EOEX de première main',
    masterclassName: (role) => `Masterclass ${role}`,
    cta: () => 'Voir le programme',
  },
  es: {
    navProfile: (role) => role,
    heroSubtitle: (role) => `Un briefing claro para tu rol de ${role}.`,
    profileEyebrow: (role) => `Cómo funciona de verdad el rol de ${role}`,
    challengesTitle: (role) => `Tensiones clave del rol de ${role} hoy`,
    servicesTitle: (role) => `Apoyo práctico pensado para ${role}`,
    masterclassTitle: () => 'Tu oportunidad de descubrir el universo EOEX de primera mano',
    masterclassName: (role) => `Masterclass de ${role}`,
    cta: () => 'Ver programa',
  },
  it: {
    navProfile: (role) => role,
    heroSubtitle: (role) => `Un briefing chiaro per il tuo ruolo di ${role}.`,
    profileEyebrow: (role) => `Come funziona davvero il ruolo di ${role}`,
    challengesTitle: (role) => `Le tensioni chiave del ruolo di ${role} oggi`,
    servicesTitle: (role) => `Supporto pratico progettato per ${role}`,
    masterclassTitle: () => 'La tua occasione per scoprire l\'universo EOEX in prima persona',
    masterclassName: (role) => `Masterclass per ${role}`,
    cta: () => 'Scopri il programma',
  },
  pt: {
    navProfile: (role) => role,
    heroSubtitle: (role) => `Um briefing claro para seu papel de ${role}.`,
    profileEyebrow: (role) => `Como o papel de ${role} funciona de fato`,
    challengesTitle: (role) => `Tensões centrais do papel de ${role} hoje`,
    servicesTitle: (role) => `Apoio prático desenhado para ${role}`,
    masterclassTitle: () => 'A sua chance de descobrir o universo EOEX em primeira mão',
    masterclassName: (role) => `Masterclass para ${role}`,
    cta: () => 'Ver programa',
  },
  de: {
    navProfile: (role) => role,
    heroSubtitle: (role) => `Ein klarer Brief für Ihre Rolle als ${role}.`,
    profileEyebrow: (role) => `Wie die Rolle ${role} wirklich funktioniert`,
    challengesTitle: (role) => `Zentrale Spannungsfelder der Rolle ${role} heute`,
    servicesTitle: (role) => `Praxisnahe Unterstützung für ${role}`,
    masterclassTitle: () => 'Ihre Chance, das EOEX-Universum aus erster Hand zu entdecken',
    masterclassName: (role) => `Masterclass für ${role}`,
    cta: () => 'Programm ansehen',
  },
};

const PROFILE_COPY = {
  en: {
    languageBanner: 'Language',
    toggleMenu: 'Toggle menu',
    brandTagline: 'The Elegance of Excellence',
    nav: { profile: 'YOUR PROFILE', challenges: 'Challenges', services: 'Services', masterclass: 'Masterclass' },
    hero: { eyebrow: 'If you are a', title: 'CREATIVE DIRECTOR', subtitle: 'This message is for you.' },
    labels: {
      profileEyebrow: 'Inside The Creative Director Role',
      challengesEyebrow: 'Challenges',
      challengesTitle: 'What makes the role harder today',
      servicesEyebrow: 'Services',
      servicesTitle: 'How EOEX sharpens your edge',
      masterclassEyebrow: 'Masterclass',
      masterclassTitle: 'Train your creative leadership with EOEX',
    },
    profileSlides: [
      {
        title: 'Strategic Authority',
        text: 'You do not just approve looks, you set the brand direction. Every season, your vision must create cultural pull and commercial value.',
      },
      {
        title: 'Leadership In Motion',
        text: 'You align concept, teams, and execution at pace. You keep collections, campaigns, and content coherent across every channel.',
      },
      {
        title: 'Credibility Threshold',
        text: 'This seat requires proof, not promise: deep fashion literacy, a clear point of view, and leadership maturity.',
      },
      {
        title: 'Pressure And Proof',
        text: 'You are measured on approval quality, collection performance, innovation rhythm, and your ability to retain top creative talent.',
      },
    ],
    challengesFallback: [
      'Consumer behavior shifts faster than campaign calendars, so you often decide with incomplete signals.',
      'Trends rise and fade quickly, and your timing directly impacts relevance and revenue.',
      'Commercial targets and creative ambition often collide, making alignment a leadership discipline.',
      'Costs tighten across production and media while premium visual standards remain non-negotiable.',
      'Stakeholder demands span brand, product, digital, and runway, with shorter decision windows every season.',
      'Creative teams need inspiration and operating clarity at the same time, and your leadership must provide both.',
      'Brand consistency gets harder as output scales across markets, platforms, and partners.',
      'Top-talent retention depends on how well you combine vision, structure, and trust in real time.',
    ],
    services: [
      {
        title: 'Masterclass For Creative Directors',
        body: 'EOEX translates the Creative Director remit into decision frameworks you can apply immediately: sharpen your aesthetic authority, steer collection strategy, and lead brand storytelling with executive clarity.',
      },
      {
        title: 'Executive Portfolio Structuring',
        body: 'Built for senior review, this service repositions your portfolio around the evidence that matters: campaign impact, decision logic, and measurable leadership contribution.',
      },
      {
        title: 'Creative Team Leadership Clinic',
        body: 'Designed for real pressure cycles, this clinic strengthens your leadership operating model: clearer feedback, higher standards, less friction, and stronger momentum.',
      },
      {
        title: 'Brand Consistency Systems',
        body: 'This EOEX system protects your aesthetic DNA at scale, keeping campaign, runway, editorial, and digital output unmistakably aligned as complexity rises.',
      },
      {
        title: 'Innovation And Trend Intelligence Lab',
        body: 'Creative leadership needs disciplined innovation, not noise. EOEX helps you read early signals, govern experimentation, and convert insight into brand advantage.',
      },
    ],
    masterclass: {
      name: 'Masterclass For Creative Directors',
      benefits: [
        'Make faster creative decisions with executive clarity across high-pressure fashion calendars',
        'Protect and scale your brand DNA across campaign, runway, and editorial output',
        'Lead stronger design teams with clear standards, sharper feedback, and accountability',
        'Position your portfolio as strategic proof tied to KPIs and business outcomes',
        'Build an innovation rhythm that turns early trend signals into collection-ready advantage',
      ],
      price: 'Price: €150 / person',
      cta: 'Register Now',
    },
    footer: { about: 'About', masterclasses: 'Masterclasses', contact: 'Contact', privacy: 'Privacy Policy', terms: 'Terms of Service' },
  },
  fr: {
    languageBanner: 'Langue',
    toggleMenu: 'Basculer le menu',
    brandTagline: "L'élégance de l'excellence",
    nav: { profile: 'Directeur Artistique', challenges: 'Défis', services: 'Services', masterclass: 'Masterclass' },
    hero: { eyebrow: 'Si vous êtes', title: 'DIRECTEUR ARTISTIQUE', subtitle: 'Ce message est pour vous.' },
    labels: {
      profileEyebrow: 'Réalité du Directeur Artistique',
      challengesEyebrow: 'Défis',
      challengesTitle: 'Ce qui complique votre rôle aujourd’hui',
      servicesEyebrow: 'Services',
      servicesTitle: 'Comment EOEX renforce votre empreinte créative',
      masterclassEyebrow: 'Masterclass',
      masterclassTitle: 'Affirmez votre posture de Directeur Artistique avec EOEX',
    },
    profileSlides: [
      { title: 'Portée exécutive', text: 'Vous ne validez pas seulement des silhouettes: vous donnez la direction de la marque. Votre vision doit créer du désir et soutenir la performance.' },
      { title: 'Leadership en action', text: 'Vous alignez concept, équipes et exécution à cadence soutenue. Vous garantissez la cohérence entre collection, campagne, défilé et numérique.' },
      { title: 'Seuil de crédibilité', text: 'Ce poste exige des preuves concrètes: impact mesurable, culture mode solide, œil exigeant et maturité managériale.' },
      { title: 'Pression et résultat', text: 'Votre réussite se lit dans la qualité des arbitrages, la performance des collections, le rythme d’innovation et la fidélisation des talents clés.' },
    ],
    challengesFallback: [
      'Les attentes des clients évoluent plus vite que les cycles de campagne, et vous tranchez souvent avec des signaux incomplets.',
      'Les tendances s’accélèrent, et votre sens du timing influe directement sur la désirabilité et les résultats.',
      'Les impératifs commerciaux et l’ambition créative se heurtent régulièrement; leur alignement relève du pilotage.',
      'La pression budgétaire augmente en production comme en média, tandis que l’exigence visuelle premium reste intacte.',
      'Les attentes couvrent la marque, le produit, le numérique et le défilé, avec des fenêtres de décision toujours plus courtes.',
      'Les équipes créatives attendent à la fois inspiration et clarté opérationnelle, surtout dans les moments de tension.',
      'La cohérence de marque se fragilise lorsque le volume de livrables explose sur tous les canaux.',
      'La fidélisation des meilleurs profils créatifs dépend de votre capacité à unir vision, structure et confiance en temps réel.',
    ],
    services: [
      { title: 'Masterclass Directeur Artistique', body: 'EOEX traduit votre rôle en méthodes d’arbitrage immédiatement activables: autorité esthétique affirmée, stratégie de collection claire et récit de marque à hauteur des enjeux de direction.' },
      { title: 'Structuration de Portfolio Exécutif', body: 'Pensé pour une revue de niveau comité, ce service recentre votre portfolio sur les preuves qui comptent: impact des campagnes, logique de décision et empreinte de leadership mesurable.' },
      { title: "Clinique Leadership d'Équipe Créative", body: 'Conçue pour les pics de pression, cette clinique renforce votre pilotage: retours plus précis, standards élevés, moins de frictions et davantage de cohésion.' },
      { title: 'Systèmes de Cohérence de Marque', body: 'Un module EOEX pour protéger l’ADN esthétique à grande échelle et maintenir campagne, défilé, éditorial et numérique parfaitement alignés.' },
      { title: 'Lab Innovation et Intelligence Tendances', body: 'Innover, oui, mais avec méthode. EOEX vous aide à lire les signaux faibles, cadrer l’expérimentation et transformer les enseignements en avantage créatif durable.' },
    ],
    masterclass: {
      name: 'Masterclass Directeur Artistique',
      benefits: [
        'Décider plus vite et plus juste sur des calendriers mode sous tension',
        'Protéger l’ADN de marque sur campagne, défilé et éditorial',
        'Élever la performance des équipes créatives avec des standards clairs',
        'Positionner votre portfolio sur les indicateurs clés, l’impact et les résultats',
        'Transformer les signaux de tendance en avantage créatif exploitable en collection',
      ],
      price: 'Prix: €150 / personne',
      cta: "S'inscrire",
    },
    footer: { about: 'À propos', masterclasses: 'Masterclasses', contact: 'Contact', privacy: 'Confidentialité', terms: 'Conditions' },
  },
  es: {
    languageBanner: 'Idioma',
    toggleMenu: 'Abrir menú',
    brandTagline: 'La elegancia de la excelencia',
    nav: { profile: 'Director Creativo', challenges: 'Retos', services: 'Servicios', masterclass: 'Masterclass' },
    hero: { eyebrow: 'Si eres', title: 'DIRECTOR CREATIVO', subtitle: 'Este mensaje es para ti.' },
    labels: {
      profileEyebrow: 'Realidad del Director Creativo',
      challengesEyebrow: 'Retos',
      challengesTitle: 'Qué vuelve hoy más complejo el rol',
      servicesEyebrow: 'Servicios',
      servicesTitle: 'Cómo EOEX refuerza tu firma creativa',
      masterclassEyebrow: 'Masterclass',
      masterclassTitle: 'Consolida tu criterio como Director Creativo con EOEX',
    },
    profileSlides: [
      { title: 'Alcance ejecutivo', text: 'No solo apruebas estética: defines el rumbo de la marca. Tu visión debe convertir relevancia cultural en resultado comercial.' },
      { title: 'Liderazgo en movimiento', text: 'Alineas concepto, equipos y ejecución con rapidez. Mantienes coherencia entre colección, campaña, pasarela y entorno digital.' },
      { title: 'Umbral de credibilidad', text: 'Este rol exige pruebas: impacto tangible, criterio de moda sólido y madurez de liderazgo.' },
      { title: 'Presión y resultados', text: 'Se evalúan tus decisiones, el rendimiento de las colecciones, el ritmo de innovación y la retención de talento clave.' },
    ],
    challengesFallback: [
      'El consumidor cambia más rápido que los ciclos de campaña y te obliga a decidir con señales incompletas.',
      'Las tendencias se aceleran, y tu sentido del timing impacta directamente en relevancia y ventas.',
      'La ambición creativa y las metas comerciales chocan con frecuencia; alinearlas es tarea de dirección.',
      'Aumenta la presión de costes en producción y medios, mientras el estándar visual premium no se negocia.',
      'Las expectativas abarcan marca, producto, digital y pasarela, con ventanas de decisión cada vez más cortas.',
      'Los equipos creativos piden inspiración y claridad operativa al mismo tiempo, sobre todo en momentos de presión.',
      'La consistencia de marca se vuelve frágil cuando escala el volumen de entregas en todos los canales.',
      'La retención del mejor talento creativo depende de cómo combines visión, estructura y confianza en tiempo real.',
    ],
    services: [
      { title: 'Masterclass para Director Creativo', body: 'EOEX traduce el rol en marcos de decisión aplicables desde el primer día: autoridad estética más clara, estrategia de colección más precisa y narrativa de marca a nivel directivo.' },
      { title: 'Estructuración de Portafolio Ejecutivo', body: 'Diseñado para revisión de alta dirección, este servicio centra tu portafolio en pruebas reales: impacto de campaña, lógica de decisión e influencia de liderazgo medible.' },
      { title: 'Clínica de Liderazgo de Equipos Creativos', body: 'Creada para picos de presión reales, esta clínica fortalece tu liderazgo con retroalimentación más fina, estándares altos y menos fricción entre equipos.' },
      { title: 'Sistemas de Coherencia de Marca', body: 'Módulo EOEX para proteger y escalar el ADN estético y mantener campaña, pasarela, editorial y digital totalmente alineados.' },
      { title: 'Laboratorio de Innovación y Tendencias', body: 'Innovar con criterio, no por ruido. EOEX te ayuda a leer señales tempranas, gobernar la experimentación y convertir aprendizajes en ventaja creativa de marca.' },
    ],
    masterclass: {
      name: 'Masterclass para Director Creativo',
      benefits: [
        'Decidir mejor y más rápido en calendarios de moda de alta presión',
        'Proteger el ADN de marca en campaña, pasarela y editorial',
        'Elevar equipos creativos con estándares claros y responsabilidad compartida',
        'Alinear tu portafolio con indicadores clave, impacto estratégico y resultados de negocio',
        'Traducir señales de tendencia en ventaja creativa aplicable a colección',
      ],
      price: 'Precio: €150 / persona',
      cta: 'Registrarme',
    },
    footer: { about: 'Acerca de', masterclasses: 'Masterclasses', contact: 'Contacto', privacy: 'Privacidad', terms: 'Términos' },
  },
  it: {
    languageBanner: 'Lingua',
    toggleMenu: 'Apri menu',
    brandTagline: "L'eleganza dell'eccellenza",
    nav: { profile: 'Direttore Creativo', challenges: 'Sfide', services: 'Servizi', masterclass: 'Masterclass' },
    hero: { eyebrow: 'Se sei', title: 'DIRETTORE CREATIVO', subtitle: 'Questo messaggio è per te.' },
    labels: {
      profileEyebrow: 'Realtà del Direttore Creativo',
      challengesEyebrow: 'Sfide',
      challengesTitle: 'Cosa rende il ruolo più complesso oggi',
      servicesEyebrow: 'Servizi',
      servicesTitle: 'Come EOEX rafforza la tua firma creativa',
      masterclassEyebrow: 'Masterclass',
      masterclassTitle: 'Consolida il tuo ruolo di Direttore Creativo con EOEX',
    },
    profileSlides: [
      { title: 'Ambito esecutivo', text: 'Non approvi solo look: definisci la direzione del brand. La tua visione deve trasformare rilevanza culturale in risultato commerciale.' },
      { title: 'Leadership in movimento', text: 'Allinei concept, team ed esecuzione ad alta velocità. Mantieni coerenza tra collezione, campagna, sfilata e canali digitali.' },
      { title: 'Soglia di credibilità', text: 'Questo ruolo richiede prove concrete: impatto reale, cultura moda solida e maturità manageriale.' },
      { title: 'Pressione e risultati', text: 'Sei valutato sulla qualità delle scelte, sulla performance delle collezioni, sul ritmo di innovazione e sulla capacità di trattenere i talenti chiave.' },
    ],
    challengesFallback: [
      'I consumatori cambiano più in fretta dei cicli di campagna e ti costringono a decidere con segnali incompleti.',
      'Le tendenze accelerano e il tuo senso del timing incide direttamente su rilevanza e ricavi.',
      'Ambizione creativa e obiettivi commerciali spesso si scontrano; allinearli è una responsabilità di direzione.',
      'La pressione sui costi cresce tra produzione e media, mentre lo standard visivo premium resta invariato.',
      'Le aspettative coprono brand, prodotto, digitale e sfilata, con finestre decisionali sempre più corte.',
      'I team creativi chiedono insieme ispirazione e chiarezza operativa, soprattutto nei momenti di maggiore pressione.',
      'La coerenza di brand si fragilizza quando il volume delle uscite cresce su canali e mercati diversi.',
      'La capacità di trattenere i talenti creativi migliori dipende da come unisci visione, struttura e fiducia in tempo reale.',
    ],
    services: [
      { title: 'Masterclass per Direttore Creativo', body: 'EOEX traduce il ruolo in metodi decisionali subito attivabili: autorevolezza estetica più chiara, strategia di collezione più solida e narrazione di brand a livello direzionale.' },
      { title: 'Strutturazione Portfolio Esecutivo', body: 'Pensato per revisioni di alto livello, questo servizio riposiziona il portfolio su prove concrete: impatto delle campagne, logica decisionale e leadership misurabile.' },
      { title: 'Clinica Leadership Team Creativo', body: 'Progettata per fasi di alta pressione, questa clinica rafforza la tua guida con feedback più preciso, standard elevati e minore attrito tra team.' },
      { title: 'Sistemi di Coerenza di Marca', body: 'Modulo EOEX per proteggere e scalare il DNA estetico, mantenendo campagna, sfilata, editoriale e digitale perfettamente allineati.' },
      { title: 'Laboratorio Innovazione e Trend Intelligence', body: 'Innovare con metodo, non per rumore. EOEX ti aiuta a leggere segnali precoci, governare la sperimentazione e trasformare gli insight in vantaggio creativo durevole.' },
    ],
    masterclass: {
      name: 'Masterclass per Direttore Creativo',
      benefits: [
        'Decidere meglio e più rapidamente nei calendari moda ad alta pressione',
        'Proteggere il DNA del brand su campagna, sfilata ed editoriale',
        'Rafforzare i team creativi con standard chiari e responsabilità condivisa',
        'Allineare il portfolio a indicatori chiave, impatto strategico e risultati di business',
        'Tradurre i segnali di tendenza in vantaggio creativo pronto per la collezione',
      ],
      price: 'Prezzo: €150 / persona',
      cta: 'Registrati',
    },
    footer: { about: 'Chi siamo', masterclasses: 'Masterclasses', contact: 'Contatti', privacy: 'Privacy', terms: 'Termini' },
  },
  pt: {
    languageBanner: 'Idioma',
    toggleMenu: 'Abrir menu',
    brandTagline: 'A elegância da excelência',
    nav: { profile: 'Diretor Criativo', challenges: 'Desafios', services: 'Serviços', masterclass: 'Masterclass' },
    hero: { eyebrow: 'Se você é', title: 'DIRETOR CRIATIVO', subtitle: 'Esta mensagem é para você.' },
    labels: {
      profileEyebrow: 'Realidade do Diretor Criativo',
      challengesEyebrow: 'Desafios',
      challengesTitle: 'O que torna o papel mais complexo hoje',
      servicesEyebrow: 'Serviços',
      servicesTitle: 'Como a EOEX fortalece sua assinatura criativa',
      masterclassEyebrow: 'Masterclass',
      masterclassTitle: 'Consolide seu papel de Diretor Criativo com a EOEX',
    },
    profileSlides: [
      { title: 'Escopo executivo', text: 'Você não aprova só estética: define a direção da marca. Sua visão precisa transformar relevância cultural em resultado comercial.' },
      { title: 'Liderança em movimento', text: 'Você alinha conceito, equipes e execução em alta velocidade. Sustenta coerência entre coleção, campanha, passarela e digital.' },
      { title: 'Nível de credibilidade', text: 'Esse papel exige prova concreta: impacto real, repertório de moda sólido e maturidade de liderança.' },
      { title: 'Pressão e resultado', text: 'Você é avaliado pela qualidade das decisões, desempenho das coleções, ritmo de inovação e retenção dos talentos-chave.' },
    ],
    challengesFallback: [
      'O consumidor muda mais rápido que os ciclos de campanha e força decisões com sinais incompletos.',
      'As tendências aceleram, e seu senso de timing impacta diretamente relevância e receita.',
      'Ambição criativa e metas comerciais colidem com frequência; alinhar isso é função de liderança.',
      'A pressão de custos aumenta em produção e mídia, enquanto o padrão visual premium segue inegociável.',
      'As expectativas já abrangem marca, produto, digital e passarela, com janelas de decisão cada vez menores.',
      'Equipes criativas pedem inspiração e clareza operacional ao mesmo tempo, sobretudo nos momentos de maior pressão.',
      'A consistência da marca fica mais frágil quando o volume de entregas escala em canais e mercados.',
      'Reter os melhores talentos criativos depende de como você combina visão, estrutura e confiança em tempo real.',
    ],
    services: [
      { title: 'Masterclass para Diretor Criativo', body: 'A EOEX traduz o papel em métodos de decisão aplicáveis desde o início: autoridade estética mais clara, estratégia de coleção mais forte e narrativa de marca em nível executivo.' },
      { title: 'Estruturação de Portfólio Executivo', body: 'Pensado para revisão de alta liderança, este serviço reposiciona seu portfólio com prova real: impacto de campanha, lógica de decisão e liderança mensurável.' },
      { title: 'Clínica de Liderança de Equipes Criativas', body: 'Criada para picos reais de pressão, esta clínica fortalece sua liderança com retorno mais preciso, padrão elevado e menos fricção entre equipes.' },
      { title: 'Sistemas de Consistência de Marca', body: 'Módulo EOEX para proteger e escalar o DNA estético, mantendo campanha, passarela, editorial e digital totalmente alinhados.' },
      { title: 'Laboratório de Inovação e Inteligência de Tendências', body: 'Inovar com método, não por ruído. A EOEX ajuda a ler sinais precoces, governar a experimentação e transformar aprendizados em vantagem criativa duradoura.' },
    ],
    masterclass: {
      name: 'Masterclass para Diretor Criativo',
      benefits: [
        'Decidir melhor e mais rápido em calendários de moda sob alta pressão',
        'Proteger o DNA da marca em campanha, passarela e editorial',
        'Elevar equipes criativas com padrões claros e responsabilidade compartilhada',
        'Alinhar seu portfólio a indicadores-chave, impacto estratégico e resultado de negócio',
        'Transformar sinais de tendência em vantagem criativa aplicável à coleção',
      ],
      price: 'Preço: €150 / pessoa',
      cta: 'Registrar',
    },
    footer: { about: 'Sobre', masterclasses: 'Masterclasses', contact: 'Contato', privacy: 'Privacidade', terms: 'Termos' },
  },
  de: {
    languageBanner: 'Sprache',
    toggleMenu: 'Menu umschalten',
    brandTagline: 'Die Eleganz der Exzellenz',
    nav: { profile: 'Kreativdirektor', challenges: 'Herausforderungen', services: 'Leistungen', masterclass: 'Masterclass' },
    hero: { eyebrow: 'Wenn Sie', title: 'KREATIVDIREKTOR', subtitle: 'Dann ist diese Botschaft für Sie.' },
    labels: {
      profileEyebrow: 'Realität des Kreativdirektors',
      challengesEyebrow: 'Herausforderungen',
      challengesTitle: 'Was die Rolle heute anspruchsvoller macht',
      servicesEyebrow: 'Leistungen',
      servicesTitle: 'Wie EOEX Ihre kreative Handschrift stärkt',
      masterclassEyebrow: 'Masterclass',
      masterclassTitle: 'Schärfen Sie Ihre Rolle als Kreativdirektor mit EOEX',
    },
    profileSlides: [
      { title: 'Strategische Verantwortung', text: 'Sie geben nicht nur Looks frei, Sie bestimmen die Richtung der Marke. Ihre Vision muss kulturelle Relevanz in messbare Geschäftswirkung übersetzen.' },
      { title: 'Führung in Bewegung', text: 'Sie synchronisieren Konzept, Teams und Umsetzung im hohen Tempo und sichern Konsistenz über Kollektion, Kampagne, Laufsteg und digitale Kanäle.' },
      { title: 'Glaubwürdigkeitsniveau', text: 'Diese Rolle verlangt Belege: echte Wirkung, tiefe Modeexpertise und Führungsreife.' },
      { title: 'Druck und Ergebnis', text: 'Gemessen werden Qualität Ihrer Freigaben, Kollektionsleistung, Innovationstempo und die Bindung starker Kreativtalente.' },
    ],
    challengesFallback: [
      'Das Konsumentenverhalten verändert sich schneller als Kampagnenzyklen, deshalb entscheiden Sie oft mit unvollständigen Signalen.',
      'Trends beschleunigen sich, und Ihr kreatives Timing wirkt unmittelbar auf Relevanz und Umsatz.',
      'Kreativer Anspruch und kommerzielle Ziele kollidieren regelmäßig; Ausrichtung ist Führungsaufgabe.',
      'Der Kostendruck steigt in Produktion und Medien, während der visuelle Premiumanspruch unverändert bleibt.',
      'Die Erwartungen reichen über Marke, Produkt, Digital und Laufsteg hinweg, bei immer kürzeren Entscheidungsfenstern.',
      'Kreativteams brauchen zugleich Inspiration und operative Klarheit, gerade in Phasen hoher Belastung.',
      'Markenkonsistenz wird fragiler, wenn das Ausgabevolumen über Kanäle und Märkte hinweg skaliert.',
      'Die Bindung der besten Kreativtalente hängt davon ab, wie Sie Vision, Struktur und Vertrauen in Echtzeit verbinden.',
    ],
    services: [
      { title: 'Masterclass für Kreativdirektoren', body: 'EOEX übersetzt die Rolle in sofort nutzbare Entscheidungsmodelle: ästhetische Autorität schärfen, Kollektionsstrategie steuern und Markenerzählung auf Leitungsebene führen.' },
      { title: 'Executive-Portfolio-Strategie', body: 'Für Senior-Reviews konzipiert, richtet dieser Service Ihr Portfolio auf das Wesentliche aus: Kampagnenwirkung, Entscheidungslogik und messbarer Führungsbeitrag.' },
      { title: 'Führungsklinik für Kreativteams', body: 'Für reale Druckphasen entwickelt, stärkt diese Klinik Ihr Führungssystem: präziseres Feedback, höhere Standards, weniger Reibung und stabilere Teamleistung.' },
      { title: 'Systeme für Markenkonsistenz', body: 'Dieses EOEX-Modul schützt und skaliert Ihre ästhetische DNA, damit Kampagne, Laufsteg, Editorial und Digital dauerhaft konsistent bleiben.' },
      { title: 'Labor für Innovation und Trendintelligenz', body: 'Innovation braucht Disziplin statt Rauschen. EOEX hilft Ihnen, frühe Signale zu lesen, Experimente zu steuern und Erkenntnisse in kreativen Markenvorsprung zu übersetzen.' },
    ],
    masterclass: {
      name: 'Masterclass für Kreativdirektoren',
      benefits: [
        'Bessere Entscheidungen in hochdynamischen Modekalendern treffen',
        'Die Marken-DNA über Kampagne, Laufsteg und Editorial konsistent schützen',
        'Kreativteams mit klaren Standards und gemeinsamer Verantwortung auf Top-Niveau führen',
        'Ihr Portfolio auf Schlüsselkennzahlen, strategische Wirkung und Geschäftsergebnisse ausrichten',
        'Frühe Trends in kollektionstauglichen kreativen Vorsprung übersetzen',
      ],
      price: 'Preis: €150 / Person',
      cta: 'Jetzt registrieren',
    },
    footer: { about: 'Über uns', masterclasses: 'Masterclasses', contact: 'Kontakt', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen' },
  },
};

const sortedAssets = (assetMap) =>
  Object.entries(assetMap)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url);

const seededShuffle = (list, seed) => {
  const source = [...list];
  let state = seed >>> 0;

  const nextRandom = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let index = source.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1));
    const current = source[index];
    source[index] = source[swapIndex];
    source[swapIndex] = current;
  }

  return source;
};

const withCacheTag = (url, tag) => `${url}${url.includes('?') ? '&' : '?'}v=${tag}`;

const normalizeLines = (raw) => raw.replace(/\r\n/g, '\n').split('\n');

const cleanLine = (line) =>
  String(line || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[>#*_`]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isLikelyArtifactLine = (text) =>
  /(\(#?attachment:|#attachment|pasted text|^attachment\b|^pasted\b|\bchatgpt\b|\bprompt\b)/i.test(String(text || '').trim());

const isCrossRoleLeakLine = (text) =>
  /(eoex'?s wellbeing programs|pressure sounds like|content creation pressure|key drops|references multiply|budget constraints.*experimentation)/i.test(String(text || '').trim());

const toTitleCase = (value) =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

function normalizeRoleName(roleTitle, fallback = 'Creative Director') {
  const cleaned = cleanLine(roleTitle || '');
  if (!cleaned) return fallback;
  return toTitleCase(cleaned.replace(/\s+/g, ' '));
}

function extractRoleTitle(lines, fallback = 'Creative Director') {
  const roleLine = lines.find((line) => /Document\s+\d+.*:/i.test(line) && /\(.*\)/.test(line));
  if (!roleLine) return fallback;

  const cleaned = cleanLine(roleLine);
  const titlePart = cleaned.split(':').slice(1).join(':').trim();
  if (!titlePart) return fallback;

  const normalized = titlePart.split('(')[0].trim().replace(/\s{2,}/g, ' ');
  return normalized || fallback;
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 24);
}

function polishShortLine(text, language) {
  const cleaned = cleanLine(text);
  if (!cleaned) return cleaned;

  if (/[.!?]$/.test(cleaned)) return cleaned;
  return `${cleaned}.`;
}

function normalizeClause(text) {
  return cleanLine(text)
    .replace(/^[-*•]+\s*/, '')
    .replace(/^[a-z]\s*[.)-]\s*/i, '')
    .replace(/^[a-z]\s*\.\s*\d+\s*/i, '')
    .replace(/^\d+(?:\.\d+)?\s*[:.-]?\s*/, '')
    .replace(/^[A-Za-z\s]+:\s*/g, '')
    .replace(/\b\d+(?:\.\d+)?\s*(?:pain points?|challenges?)\b/ig, '')
    .replace(/[.!?]+$/g, '');
}

function isNoisyResponsibilitySignal(text) {
  const line = String(text || '').trim();
  if (!line) return true;
  if (/^\s*[A-Z]\d{3,5}\b/.test(line)) return true;
  if (/\b[A-Z]\d{3,5}\b[^\n]{0,80};[^\n]{0,80}\b[A-Z]\d{3,5}\b/.test(line)) return true;
  if (/\b(key responsibilities?|responsabilités clés|responsabilidades clave|responsabilità chiave|responsabilidades-chave|hauptaufgaben)\b/i.test(line)) return true;
  if (/\brome code\b|\bidcc\b|\bconvention collective\b/i.test(line)) return true;
  if (/stylisme\s*-\s*modélisme|costume\s+et\s+habillage\s+spectacle/i.test(line)) return true;
  if (/\bonboarding\s+schedule\b|\bstudio\s+employment\b/i.test(line)) return true;
  if (/\bhigh\s+cost\s+of\s+professional\s+camera\s+gear\b|\blenses\b|\baudio\b/i.test(line)) return true;
  if (/\bkey\s+responsibilities\b|\bretail\/?luxury\s+stylist\b|\beditorial\/?creative\s+stylist\b/i.test(line)) return true;
  return false;
}

function normalizeForSimilarity(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-zà-ÿ0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => token.length > 3)
    .filter((token) => !['with', 'that', 'this', 'from', 'into', 'your', 'vous', 'para', 'pour', 'della', 'delle', 'des', 'der', 'die', 'das'].includes(token))
    .join(' ');
}

function dedupeSimilarLines(lines) {
  const kept = [];
  const signatures = [];

  lines.forEach((line) => {
    const signature = normalizeForSimilarity(line);
    if (!signature) return;
    const duplicate = signatures.some((prev) => {
      if (prev === signature) return true;
      const prevSet = new Set(prev.split(' '));
      const nextSet = new Set(signature.split(' '));
      const overlap = [...nextSet].filter((token) => prevSet.has(token)).length;
      const minSize = Math.max(1, Math.min(prevSet.size, nextSet.size));
      return overlap / minSize >= 0.7;
    });
    if (duplicate) return;
    signatures.push(signature);
    kept.push(line);
  });

  return kept;
}

function localizeNativeSpeakText(value, language) {
  if (typeof value !== 'string' || language === 'en') return value;

  const restoreLocaleDiacritics = (text, lang) => {
    const accentRules = {
      fr: [
        [/\bViabilite\b/g, 'Viabilité'],
        [/\breunion\b/g, 'réunion'],
        [/\bReunion\b/g, 'Réunion'],
        [/\bmise a jour\b/g, 'mise à jour'],
        [/\bequipe\b/g, 'équipe'],
        [/\bnumerique\b/g, 'numérique'],
        [/\bcarriere\b/g, 'carrière'],
        [/\boperatoire\b/g, 'opératoire'],
        [/\badequation\b/g, 'adéquation'],
        [/\bdefile\b/g, 'défilé'],
        [/\bdemonstration\b/g, 'démonstration'],
        [/\breservations\b/g, 'réservations'],
        [/\bpriorites\b/g, 'priorités'],
        [/\benseignements tires\b/g, 'enseignements tirés'],
        [/\bdestine\b/g, 'destiné'],
        [/\bcoherence\b/g, 'cohérence'],
      ],
      es: [
        [/\bcoordinacion\b/g, 'coordinación'],
        [/\bactualizacion\b/g, 'actualización'],
        [/\bedicion\b/g, 'edición'],
        [/\brevision\b/g, 'revisión'],
        [/\balineacion\b/g, 'alineación'],
        [/\bvision\b/g, 'visión'],
        [/\btecnicos\b/g, 'técnicos'],
      ],
      it: [
        [/\bSostenibilita\b/g, 'Sostenibilità'],
        [/\bsostenibilita\b/g, 'sostenibilità'],
        [/\bpriorita\b/g, 'priorità'],
      ],
      pt: [
        [/\bcoordenacao\b/g, 'coordenação'],
        [/\bReuniao\b/g, 'Reunião'],
        [/\breuniao\b/g, 'reunião'],
        [/\batualizacao\b/g, 'atualização'],
        [/\blideranca\b/g, 'liderança'],
        [/\bedicao\b/g, 'edição'],
        [/\brevisao\b/g, 'revisão'],
        [/\bPos-Producao\b/g, 'Pós-Produção'],
        [/\bpos-producao\b/g, 'pós-produção'],
        [/\bResponsavel\b/g, 'Responsável'],
        [/\bportfolio\b/g, 'portfólio'],
        [/\breconvocacoes\b/g, 'reconvocações'],
        [/\brenovacoes\b/g, 'renovações'],
        [/\bcadencia\b/g, 'cadência'],
        [/\blicoes aprendidas\b/g, 'lições aprendidas'],
        [/\bpublicacao\b/g, 'publicação'],
      ],
      de: [
        [/\bTragfahigkeit\b/g, 'Tragfähigkeit'],
        [/\btragfahigkeit\b/g, 'tragfähigkeit'],
        [/\bRuckmeldung\b/g, 'Rückmeldung'],
        [/\bRuckmeldungen\b/g, 'Rückmeldungen'],
        [/\bUberprufung\b/g, 'Überprüfung'],
        [/\bPrufpunkte\b/g, 'Prüfpunkte'],
        [/\bUbergabe\b/g, 'Übergabe'],
        [/\bAusfuhrung\b/g, 'Ausführung'],
      ],
    };

    const rules = accentRules[lang] || [];
    return rules.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
  };

  const replacementRules = {
    fr: [
      [/Commercial viability, brand coordination/gi, 'Viabilite commerciale, coordination de marque'],
      [/Store meeting, coordination on targets, product knowledge update/gi, 'Reunion en magasin, coordination sur les objectifs, mise a jour des connaissances produit'],
      [/Review daily priorities, check emails, team alignment/gi, 'Revoir les priorites quotidiennes, traiter les courriels et coordonner l equipe'],
      [/Marketing alignment, production review, sales collaboration, external partner calls/gi, 'Coordination marketing, revue de production, coordination commerciale et appels partenaires externes'],
      [/Department alignment, project updates/gi, 'Coordination interservices et suivi des projets'],
      [/Performance analysis, lessons learned/gi, 'Analyse des performances et enseignements tires'],
      [/\bcommercial viability\b/gi, 'viabilite commerciale'],
      [/\bbrand coordination\b/gi, 'coordination de marque'],
      [/\bstore meeting\b/gi, 'reunion en magasin'],
      [/\bcoordination on targets\b/gi, 'coordination sur les objectifs'],
      [/\bproduct knowledge update\b/gi, 'mise a jour des connaissances produit'],
      [/\btargets\b/gi, 'objectifs'],
      [/\bproduct knowledge\b/gi, 'connaissance produit'],
      [/\bpipelines?\b/gi, 'parcours'],
      [/\bbrand\b/gi, 'marque'],
      [/\bteam\b/gi, 'equipe'],
      [/\bleadership\b/gi, 'direction'],
      [/\bdigital\b/gi, 'numerique'],
      [/\bedits?\b/gi, 'montage'],
      [/\bshot\b/gi, 'prise'],
      [/\bset\b/gi, 'plateau'],
      [/\bcareer\b/gi, 'carriere'],
      [/\bperformance\b/gi, 'performance operationnelle'],
      [/\bworkflows?\b/gi, 'flux de travail'],
        [/\breel\b/gi, 'bande de demonstration'],
      [/\bcheckpoints?\b/gi, 'jalons'],
      [/\bfeedback\b/gi, 'retours'],
      [/\breview\b/gi, 'revue'],
      [/\bteam\b/gi, 'equipe'],
      [/\bsales\b/gi, 'commercial'],
      [/\bpriorities\b/gi, 'priorites'],
      [/\bemails?\b/gi, 'courriels'],
      [/\bdepartment\b/gi, 'service'],
      [/\bproject updates\b/gi, 'suivi de projet'],
      [/\blessons learned\b/gi, 'enseignements tires'],
      [/\balignment\b/gi, 'coordination'],
      [/\bplayback\b/gi, 'relecture video'],
      [/\bbrief\b/gi, 'cadrage'],
      [/\btiming\b/gi, 'calendrier'],
      [/\bhand-?off\b/gi, 'passage de relais'],
      [/\bclient-facing\b/gi, 'destine au client'],
    ],
    es: [
      [/Commercial viability, brand coordination/gi, 'Viabilidad comercial, coordinacion de marca'],
      [/Store meeting, coordination on targets, product knowledge update/gi, 'Reunion de tienda, coordinacion sobre objetivos, actualizacion de conocimiento de producto'],
      [/\bcommercial viability\b/gi, 'viabilidad comercial'],
      [/\bbrand coordination\b/gi, 'coordinacion de marca'],
      [/\bstore meeting\b/gi, 'reunion de tienda'],
      [/\bcoordination on targets\b/gi, 'coordinacion sobre objetivos'],
      [/\bproduct knowledge update\b/gi, 'actualizacion de conocimiento de producto'],
      [/\btargets\b/gi, 'objetivos'],
      [/\bproduct knowledge\b/gi, 'conocimiento de producto'],
      [/\bpipelines?\b/gi, 'proceso'],
      [/\bbrand\b/gi, 'marca'],
      [/\bteam\b/gi, 'equipo'],
      [/\bleadership\b/gi, 'liderazgo'],
      [/\bdigital\b/gi, 'digital'],
      [/\bedits?\b/gi, 'edicion'],
      [/\bshot\b/gi, 'toma'],
      [/\bset\b/gi, 'set de rodaje'],
      [/\bcareer\b/gi, 'carrera profesional'],
      [/\bperformance\b/gi, 'rendimiento'],
      [/\bworkflows?\b/gi, 'flujo de trabajo'],
        [/\breel\b/gi, 'portafolio audiovisual'],
      [/\bcheckpoints?\b/gi, 'hitos'],
      [/\bfeedback\b/gi, 'retroalimentacion'],
      [/\breview\b/gi, 'revision'],
      [/\bteam\b/gi, 'equipo'],
      [/\balignment\b/gi, 'alineacion'],
      [/\bsales\b/gi, 'ventas'],
      [/\bpriorities\b/gi, 'prioridades'],
      [/\bemails?\b/gi, 'correos'],
      [/\bdepartment\b/gi, 'departamento'],
      [/\bproject updates\b/gi, 'actualizacion de proyectos'],
      [/\blessons learned\b/gi, 'aprendizajes'],
      [/\bbrief\b/gi, 'resumen de encargo'],
      [/\btiming\b/gi, 'ritmo de ejecucion'],
      [/\bplayback\b/gi, 'revision de video'],
      [/\bhand-?off\b/gi, 'traspaso'],
      [/\bclient-facing\b/gi, 'de cara al cliente'],
    ],
    it: [
      [/Commercial viability, brand coordination/gi, 'Sostenibilita commerciale, coordinamento del marchio'],
      [/Store meeting, coordination on targets, product knowledge update/gi, 'Riunione in negozio, coordinamento sugli obiettivi, aggiornamento della conoscenza prodotto'],
      [/\bcommercial viability\b/gi, 'sostenibilita commerciale'],
      [/\bbrand coordination\b/gi, 'coordinamento del marchio'],
      [/\bstore meeting\b/gi, 'riunione in negozio'],
      [/\bcoordination on targets\b/gi, 'coordinamento sugli obiettivi'],
      [/\bproduct knowledge update\b/gi, 'aggiornamento della conoscenza prodotto'],
      [/\btargets\b/gi, 'obiettivi'],
      [/\bproduct knowledge\b/gi, 'conoscenza prodotto'],
      [/\bpipelines?\b/gi, 'percorso'],
      [/\bbrand\b/gi, 'marchio'],
      [/\bteam\b/gi, 'squadra'],
      [/\bleadership\b/gi, 'guida'],
      [/\bdigital\b/gi, 'digitale'],
      [/\bedits?\b/gi, 'montaggio'],
      [/\bshot\b/gi, 'inquadratura'],
      [/\bset\b/gi, 'set di ripresa'],
      [/\bcareer\b/gi, 'carriera professionale'],
      [/\bperformance\b/gi, 'prestazione'],
      [/\bworkflows?\b/gi, 'flusso di lavoro'],
        [/\breel\b/gi, 'portfolio video'],
      [/\bcheckpoints?\b/gi, 'tappe di controllo'],
      [/\bfeedback\b/gi, 'riscontri'],
      [/\breview\b/gi, 'revisione'],
      [/\bteam\b/gi, 'squadra'],
      [/\balignment\b/gi, 'allineamento'],
      [/\bsales\b/gi, 'vendite'],
      [/\bpriorities\b/gi, 'priorita'],
      [/\bemails?\b/gi, 'email'],
      [/\bdepartment\b/gi, 'reparto'],
      [/\bproject updates\b/gi, 'aggiornamento progetti'],
      [/\blessons learned\b/gi, 'lezioni apprese'],
      [/\bbrief\b/gi, 'inquadramento iniziale'],
      [/\btiming\b/gi, 'cadenza operativa'],
      [/\bplayback\b/gi, 'rilettura video'],
      [/\bhand-?off\b/gi, 'passaggio operativo'],
      [/\bclient-facing\b/gi, 'rivolto al cliente'],
    ],
    pt: [
      [/\bset\s+de\s+gravacao\s+de\s+gravacao\b/gi, 'set de gravacao'],
      [/Commercial viability, brand coordination/gi, 'Viabilidade comercial, coordenacao de marca'],
      [/Store meeting, coordination on targets, product knowledge update/gi, 'Reuniao de loja, coordenacao sobre metas, atualizacao de conhecimento de produto'],
      [/\bcommercial viability\b/gi, 'viabilidade comercial'],
      [/\bbrand coordination\b/gi, 'coordenacao de marca'],
      [/\bstore meeting\b/gi, 'reuniao de loja'],
      [/\bcoordination on targets\b/gi, 'coordenacao sobre metas'],
      [/\bproduct knowledge update\b/gi, 'atualizacao de conhecimento de produto'],
      [/\btargets\b/gi, 'metas'],
      [/\bproduct knowledge\b/gi, 'conhecimento de produto'],
      [/\bpipelines?\b/gi, 'processo'],
      [/\bbrand\b/gi, 'marca'],
      [/\bteam\b/gi, 'equipe'],
      [/\bleadership\b/gi, 'lideranca'],
      [/\bdigital\b/gi, 'digital'],
      [/\bedits?\b/gi, 'edicao'],
      [/\bshot\b/gi, 'tomada'],
      [/\bset\b(?!\s+de\b)/gi, 'set de gravacao'],
      [/\bcareer\b/gi, 'carreira profissional'],
      [/\bperformance\b/gi, 'desempenho'],
      [/\bworkflows?\b/gi, 'fluxo de trabalho'],
        [/\breel\b/gi, 'portfolio audiovisual'],
      [/\bcheckpoints?\b/gi, 'marcos de controle'],
      [/\bfeedback\b/gi, 'retorno'],
      [/\breview\b/gi, 'revisao'],
      [/\bteam\b/gi, 'equipe'],
      [/\balignment\b/gi, 'alinhamento'],
      [/\bsales\b/gi, 'vendas'],
      [/\bpriorities\b/gi, 'prioridades'],
      [/\bemails?\b/gi, 'emails'],
      [/\bdepartment\b/gi, 'departamento'],
      [/\bproject updates\b/gi, 'atualizacao de projetos'],
      [/\blessons learned\b/gi, 'licoes aprendidas'],
      [/\bbrief\b/gi, 'direcionamento inicial'],
      [/\btiming\b/gi, 'cadencia de execucao'],
      [/\bplayback\b/gi, 'revisao de video'],
      [/\bhand-?off\b/gi, 'passagem de tarefa'],
      [/\bclient-facing\b/gi, 'voltado ao cliente'],
    ],
    de: [
      [/Commercial viability, brand coordination/gi, 'Wirtschaftliche Tragfahigkeit, Markenabstimmung'],
      [/Store meeting, coordination on targets, product knowledge update/gi, 'Filialbesprechung, Zielabstimmung, Aktualisierung des Produktwissens'],
      [/\bcommercial viability\b/gi, 'wirtschaftliche Tragfahigkeit'],
      [/\bbrand coordination\b/gi, 'Markenabstimmung'],
      [/\bstore meeting\b/gi, 'Filialbesprechung'],
      [/\bcoordination on targets\b/gi, 'Zielabstimmung'],
      [/\bproduct knowledge update\b/gi, 'Aktualisierung des Produktwissens'],
      [/\btargets\b/gi, 'Ziele'],
      [/\bproduct knowledge\b/gi, 'Produktwissen'],
      [/\bpipelines?\b/gi, 'Ablaufkette'],
      [/\bbrand\b/gi, 'Marke'],
      [/\bteam\b/gi, 'Team'],
      [/\bleadership\b/gi, 'Führung'],
      [/\bdigital\b/gi, 'digital'],
      [/\bedits?\b/gi, 'Schnitt'],
      [/\bshot\b/gi, 'Einstellung'],
      [/\bset\b/gi, 'Drehumfeld'],
      [/\bcareer\b/gi, 'Berufslaufbahn'],
      [/\bperformance\b/gi, 'Leistung'],
      [/\bworkflows?\b/gi, 'Arbeitsablauf'],
        [/\breel\b/gi, 'Arbeitsportfolio'],
      [/\bcheckpoints?\b/gi, 'Prufpunkte'],
      [/\bfeedback\b/gi, 'Ruckmeldung'],
      [/\breview\b/gi, 'Uberprufung'],
      [/\bteam\b/gi, 'Team'],
      [/\balignment\b/gi, 'Abstimmung'],
      [/\bsales\b/gi, 'Vertrieb'],
      [/\bpriorities\b/gi, 'Prioritaten'],
      [/\bemails?\b/gi, 'E-Mails'],
      [/\bdepartment\b/gi, 'Abteilung'],
      [/\bproject updates\b/gi, 'Projektaktualisierung'],
      [/\blessons learned\b/gi, 'Erkenntnisse'],
      [/\bbrief\b/gi, 'Arbeitsgrundlage'],
      [/\btiming\b/gi, 'Taktung'],
      [/\bplayback\b/gi, 'Videoanalyse'],
      [/\bhand-?off\b/gi, 'Ubergabe'],
      [/\bclient-facing\b/gi, 'kundenorientiert'],
    ],
  };

  const rules = replacementRules[language] || [];
  const normalized = rules.reduce((text, [pattern, next]) => text.replace(pattern, next), value).replace(/\s{2,}/g, ' ').trim();
  return restoreLocaleDiacritics(normalized, language);
}

function localizeNativeSpeak(value, language) {
  if (typeof value === 'string') return localizeNativeSpeakText(value, language);
  if (Array.isArray(value)) return value.map((item) => localizeNativeSpeak(item, language));
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [key, localizeNativeSpeak(entryValue, language)]),
  );
}

function lowerFirst(text) {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function applyRoleVoice(copy, roleName, language) {
  const layer = ROLE_VOICE_LAYERS[language] || ROLE_VOICE_LAYERS.en;

  return {
    ...copy,
    nav: {
      ...copy.nav,
      profile: layer.navProfile(roleName),
    },
    hero: {
      ...copy.hero,
      subtitle: layer.heroSubtitle(roleName),
    },
    labels: {
      ...copy.labels,
      profileEyebrow: layer.profileEyebrow(roleName),
      challengesTitle: layer.challengesTitle(roleName),
      servicesTitle: layer.servicesTitle(roleName),
      masterclassTitle: layer.masterclassTitle(roleName),
    },
    masterclass: {
      ...copy.masterclass,
      name: layer.masterclassName(roleName),
      cta: layer.cta(roleName),
    },
  };
}

function extractProfileSlides(lines, fallbackSlides, roleName, language) {
  const cleanedLines = lines.map(cleanLine);
  const summaryStart = cleanedLines.findIndex((line) => /^EXECUTIVE SUMMARY$/i.test(line));
  const summaryEnd = cleanedLines.findIndex((line, index) => index > summaryStart && /^SECTION\s+1:/i.test(line));

  if (summaryStart === -1 || summaryEnd === -1) return fallbackSlides;

  const summary = cleanedLines
    .slice(summaryStart + 1, summaryEnd)
    .filter((line) => line
      && !/^_+$/.test(line)
      && !/^The Elegance of Excellence/i.test(line)
      && !/^EOEX FASHION INDUSTRY/i.test(line)
      && !/^This document provides\b/i.test(line)
      && !/^Career profile for\b/i.test(line)
      && !/^Talent scouting\b/i.test(line)
      && !/^#+\s/.test(line))
    .join(' ');

  const sentences = splitSentences(summary).slice(0, 4);
  if (sentences.length < 2) return fallbackSlides;

  const voice = PROFILE_VOICE[language] || PROFILE_VOICE.en;

  return sentences.map((sentence, index) => ({
    title: voice.insight(roleName, index),
    text: sentence,
  }));
}

function sectionRange(lines, startRegex, endRegex) {
  const cleaned = lines.map(cleanLine);
  const start = cleaned.findIndex((line) => startRegex.test(line));
  if (start === -1) return [];
  const end = cleaned.findIndex((line, idx) => idx > start && endRegex.test(line));
  const chunk = end === -1 ? cleaned.slice(start + 1) : cleaned.slice(start + 1, end);
  return chunk.filter((line) => line && !/^_+$/.test(line) && !/^\*\s*Lines\s+\d+/i.test(line));
}

function isHrMetadataLikeLine(line) {
  if (!line) return true;
  if (/\b(position title|department|reports to|location|employment type|purpose of the role|category|kpi|minimum|preferred|experience|qualification|salary|rome code|convention collective|idcc)\b/i.test(line)) return true;
  if ((line.match(/:/g) || []).length >= 2) return true;
  if (/\b(full-?time|part-?time|freelance|agency-?represented)\b/i.test(line)) return true;
  if (line.length > 230) return true;
  return false;
}

function isHumanNarrativeSentence(line) {
  if (!line || line.length < 60 || line.length > 240) return false;
  if (isHrMetadataLikeLine(line)) return false;
  if (/\b(paris|london|milan|new york)\s*\/\s*(paris|london|milan|new york)\b/i.test(line)) return false;
  if (/^\w+\s*:\s*\w+/i.test(line)) return false;
  return true;
}

function extractHrNarratives(lines) {
  const hrLines = sectionRange(lines, /^SECTION\s+4:/i, /^SECTION\s+5:/i)
    .filter((line) => line.length > 40 && line.length < 280)
    .filter((line) => !/^(Category|KPI|Position Title|Department|Reports To|Location|Employment Type|Purpose of the Role)$/i.test(line))
    .filter((line) => !isHrMetadataLikeLine(line));

  const sentences = splitSentences(hrLines.join(' ')).filter((line) => isHumanNarrativeSentence(line));
  const unique = [];
  const seen = new Set();
  sentences.forEach((line) => {
    const key = line.toLowerCase().slice(0, 180);
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(line);
  });

  return unique.slice(0, 4);
}

function extractChallengeCards(lines) {
  const candidates = [];
  const seen = new Set();
  const regex = /(burnout|instability|pressure|competition|risk|retention|budget|trend|alignment|fatigue|overload|challenge|cost|difficult|secure)/i;

  lines.forEach((line) => {
    const cleaned = cleanLine(line);
    if (!cleaned || cleaned.length < 28) return;
    if (cleaned.length > 220) return;
    if (/^%/.test(cleaned)) return;
    if (/^[a-z]\s*\.\s*\d+/i.test(cleaned)) return;
    if (/\b\d+(?:\.\d+)?\s*(?:pain points?|challenges?)\b/i.test(cleaned)) return;
    if (!regex.test(cleaned)) return;
    if (/^SECTION\s+\d+/i.test(cleaned) || /^KPI\b/i.test(cleaned) || /^Attribute$/i.test(cleaned)) return;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push(cleaned);
  });

  return candidates.slice(0, 8);
}

function extractServiceCards(lines) {
  const cleanedLines = lines.map(cleanLine);
  const cards = [];
  const seen = new Set();
  const blockedTitle = /(document\s+\d+|french\s+job\s+title|english\s+job\s+title|rome\s+code|convention\s+collective|executive\s+summary|section\s+\d+|attribute|detail|reports\s+to|supervises|location|minimum|preferred|language|certification|kpi|price)/i;
  const blockedBody = /(document\s+\d+|^\w+\s*:\s*\w+\s*$|rome\s+code|convention\s+collective|idcc\s+\d+)/i;
  const actionBody = /(lead|build|develop|manage|design|ensure|coordinate|support|translate|create|deliver|analyz|monitor|strengthen|position|protect|innov|guide|oversee|align|improv|execute|foster|mentor|present|drive)/i;

  for (let index = 0; index < cleanedLines.length - 1; index += 1) {
    const title = cleanedLines[index];
    const body = cleanedLines[index + 1];

    const isTitle =
      title.length >= 6
      && title.length <= 56
      && /^[A-Za-zÀ-ÿ0-9\s\-\/&']+$/.test(title)
      && !blockedTitle.test(title)
      && !/^SECTION\b/i.test(title)
      && !/^(Attribute|Detail|Description|Frequency|Target|Requirement|Level|Purpose)$/i.test(title)
      && !/^\d+(\.\d+)?$/.test(title);

    const isBody =
      body.length >= 48
      && body.length <= 260
      && !/^[_\-]+$/.test(body)
      && !blockedBody.test(body)
      && actionBody.test(body);
    if (!isTitle || !isBody) continue;

    const key = `${title}::${body}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    cards.push({
      title: toTitleCase(title),
      body,
    });
  }

  return cards.slice(0, 5);
}

function detectRoleTrack(roleName) {
  const value = String(roleName || '').toLowerCase();

  if (/(school director|école|escuela|scuola|schule|education|teaching|pedagog|curriculum|academic)/.test(value)) return 'education';
  if (/(model|modèle|mannequin|modelo|modello|modelagem|modelaje|modell|casting|booker|talent|talento|talenti|agent|agente|scout|olheiro|chasseur)/.test(value)) return 'talent';
  if (/(photographer|videographer|editorial|post-production|camera|video|ugc|content creator|creator)/.test(value)) return 'content';
  if (/(production|sourcing|quality|logistics|pattern maker|sample maker)/.test(value)) return 'operations';
  if (/(marketing|pr manager|social media|brand marketing|influencer)/.test(value)) return 'marketing';
  if (/(e-commerce|digital asset|chief digital officer|digital)/.test(value)) return 'digital';
  return 'creative';
}

const TRACK_CONTEXT = {
  en: {
    creative: {
      mission: 'brand authorship and creative leadership',
      pressure: 'balancing artistic ambition with commercial accountability',
      operating: 'cross-functional decision-making across design, campaign, and product timelines',
      impact: 'stronger collection clarity, team alignment, and market relevance',
    },
    content: {
      mission: 'visual storytelling and production excellence',
      pressure: 'delivering platform-ready assets while protecting quality standards',
      operating: 'end-to-end content planning, shoot execution, and post-production governance',
      impact: 'higher audience retention, campaign conversion, and brand consistency',
    },
    talent: {
      mission: 'talent discovery, development, and placement strategy',
      pressure: 'matching creative fit, readiness, and commercial opportunity',
      operating: 'pipeline management, casting quality control, and long-term career stewardship',
      impact: 'better talent performance, lower churn risk, and stronger client trust',
    },
    operations: {
      mission: 'delivery reliability, quality assurance, and cost discipline',
      pressure: 'meeting deadlines under shifting demand and supplier constraints',
      operating: 'technical coordination from sourcing through final handoff',
      impact: 'fewer production failures, healthier margins, and predictable output quality',
    },
    marketing: {
      mission: 'brand demand generation and measurable audience growth',
      pressure: 'maintaining relevance while proving campaign efficiency',
      operating: 'message orchestration across PR, social, influencer, and brand channels',
      impact: 'improved engagement quality, acquisition efficiency, and brand equity',
    },
    digital: {
      mission: 'digital growth strategy and commerce performance',
      pressure: 'scaling experiences while maintaining governance and speed',
      operating: 'asset systems, platform optimization, and data-informed CX decisions',
      impact: 'stronger conversion resilience, operational clarity, and lifetime value',
    },
    education: {
      mission: 'pedagogical leadership, curriculum quality, and school reputation',
      pressure: 'balancing educational standards, student employability, and operational constraints',
      operating: 'faculty coordination, program design, industry partnerships, and learner progression reviews',
      impact: 'stronger graduate readiness, teaching consistency, and long-term institutional credibility',
    },
  },
  fr: {
    creative: {
      mission: 'la direction créative et l\'auteur de marque',
      pressure: 'l\'équilibre entre ambition artistique et exigence commerciale',
      operating: 'l\'arbitrage transverse entre design, campagne et produit',
      impact: 'une collection plus lisible, des équipes alignées et une marque plus pertinente',
    },
    content: {
      mission: 'la narration visuelle et l\'excellence de production',
      pressure: 'la livraison de contenus performants sans dégrader la qualité',
      operating: 'la coordination de la planification au tournage puis à la post-production',
      impact: 'une audience plus engagée, de meilleures conversions et une image cohérente',
    },
    talent: {
      mission: 'la détection, le développement et le placement des talents',
      pressure: 'l\'alignement entre potentiel créatif, maturité et opportunité business',
      operating: 'le pilotage du pipeline, du casting et de l\'accompagnement de carrière',
      impact: 'des talents plus performants, moins de churn et une confiance client accrue',
    },
    operations: {
      mission: 'la fiabilité de livraison, la qualité et la discipline des coûts',
      pressure: 'le respect des délais dans un contexte de contraintes fournisseurs',
      operating: 'la coordination technique du sourcing à la remise finale',
      impact: 'moins de ruptures de production, de meilleures marges et une qualité stable',
    },
    marketing: {
      mission: 'la croissance de demande et la performance de marque',
      pressure: 'la pertinence éditoriale avec une efficacité de campagne mesurable',
      operating: 'l\'orchestration des messages entre PR, social, influence et brand',
      impact: 'un engagement utile, une acquisition plus efficiente et une marque renforcée',
    },
    digital: {
      mission: 'la stratégie numérique et la performance e-commerce',
      pressure: 'la mise à l\'échelle avec gouvernance et vitesse d\'exécution',
      operating: 'les actifs digitaux, l\'optimisation plateforme et l\'expérience client data-driven',
      impact: 'une conversion plus robuste, une opération clarifiée et plus de valeur long terme',
    },
    education: {
      mission: 'le pilotage pédagogique, la qualité des parcours et la réputation de l\'école',
      pressure: 'l\'équilibre entre standards de formation, employabilité et contraintes opérationnelles',
      operating: 'la coordination des formateurs, la construction des programmes, les partenariats industrie et le suivi de progression',
      impact: 'des diplômés mieux préparés, une exécution pédagogique plus stable et une crédibilité institutionnelle durable',
    },
  },
};

function localizedTrackContext(language, track) {
  const locale = TRACK_CONTEXT[language] || TRACK_CONTEXT.en;
  return locale[track] || locale.creative;
}

function extractRoleSignals(lines) {
  const cleaned = lines.map(cleanLine).filter(Boolean);
  const relevant = cleaned.filter((line) =>
    /(responsibilit|pain point|challenge|red flag|revenue|cost|risk|efficiency|alignment|solution|masterclass|kpi|deliverable|onboarding|performance)/i.test(line)
    && line.length > 36
    && line.length < 260
    && !isLikelyArtifactLine(line)
    && !/^SECTION\s+\d+/i.test(line)
    && !/^\*\s*Lines\s+\d+/i.test(line),
  );

  const deduped = [];
  const seen = new Set();
  relevant.forEach((line) => {
    const key = line.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(line);
  });

  return deduped;
}

function extractEoexSolutions(lines) {
  const solutions = [];
  let currentSolution = null;
  let currentMessage = null;

  lines.forEach((line) => {
    const cleaned = cleanLine(line);
    if (!cleaned) return;

    const solutionMatch = cleaned.match(/^EOEX Solution:\s*(.+)$/i);
    if (solutionMatch) {
      currentSolution = cleanLine(solutionMatch[1]);
      return;
    }

    const messageMatch = cleaned.match(/^Key Message:\s*(.+)$/i);
    if (messageMatch) {
      currentMessage = cleanLine(messageMatch[1]);
      if (currentSolution) {
        solutions.push({ title: currentSolution, body: currentMessage });
        currentSolution = null;
        currentMessage = null;
      }
    }
  });

  return solutions.slice(0, 5);
}

function buildNarrativePack({ roleName, roleReferenceEn, roleTrack, language, profileLines, sourceSlides, profileId }) {
  const context = localizedTrackContext(language, roleTrack);
  const sourceChallenges = extractChallengeCards(profileLines);
  const hrNarratives = extractHrNarratives(profileLines);
  const roleModelProbe = `${roleName} ${roleReferenceEn || ''}`;
  const isScoutOrAgentProfile = /(agent|scout|casting|booker)/i.test(roleModelProbe);
  const isModelProfile = roleTrack === 'talent'
    && /(runway|editorial|commercial|ugc|fit|parts|showroom|lingerie|swimsuit|male model|atmosphere|promotional|life model|\bmodel\b)/i.test(roleModelProbe)
    && !isScoutOrAgentProfile;
  const modelSubtype = (() => {
    if (!isModelProfile) return 'general';
    if (/(e-?commerce|ecommerce|catalog|catalogue|marketplace|product page|pdp|lookbook)/i.test(roleModelProbe)) return 'ecommerce';
    if (/(fit|fitting|sample size|garment fit|showroom)/i.test(roleModelProbe)) return 'fit';
    if (/(runway|catwalk|fashion week|défilé|passarela|sfilata|laufsteg)/i.test(roleModelProbe)) return 'runway';
    if (/(editorial|magazine|campaign|lookbook|story shoot|print)/i.test(roleModelProbe)) return 'editorial';
    if (/(commercial|advertis|ugc|promotional|brand|retail)/i.test(roleModelProbe)) return 'commercial';
    return 'general';
  })();

  const slideTemplate = {
    en: [
      { title: `How you shape this role`, text: `You are not here to simply execute. You shape ${context.mission}, set the tone for decisions, and help everyone around you move in one clear direction.` },
      { title: `What you juggle every week`, text: `You constantly balance ${context.pressure}. Your best work appears when pressure rises and you still keep your choices sharp and calm.` },
      { title: `How your day really works`, text: `Your daily rhythm includes ${context.operating}. You keep quality high by creating structure where others feel only urgency.` },
      { title: `What your leadership unlocks`, text: `When you are well supported, you create ${context.impact}. The shift is visible in output quality, team confidence, and business momentum.` },
    ],
    fr: [
      { title: `Comment vous donnez le cap`, text: `Vous ne faites pas qu'exécuter. Vous portez ${context.mission}, vous clarifiez les choix et vous alignez les énergies autour d'une direction lisible.` },
      { title: `Ce que vous tenez chaque semaine`, text: `Vous arbitrez en permanence ${context.pressure}. Votre force se voit quand vous gardez de la clarté même sous tension.` },
      { title: `La réalité de votre quotidien`, text: `Votre rythme inclut ${context.operating}. Vous protégez la qualité en installant de la structure là où tout s'accélère.` },
      { title: `L'impact que vous créez`, text: `Avec le bon soutien, vous obtenez ${context.impact}. Cela se ressent dans les résultats, mais aussi dans la confiance du collectif.` },
    ],
    es: [
      { title: `Cómo marcas la dirección`, text: `No estás para ejecutar en automático. Tu trabajo impulsa ${context.mission}, ordena prioridades y da coherencia al equipo.` },
      { title: `Lo que sostienes cada semana`, text: `Te toca equilibrar ${context.pressure}. Tu valor aparece cuando conviertes presion en decisiones claras.` },
      { title: `Cómo se vive el rol en la práctica`, text: `Tu día a día incluye ${context.operating}. Mantienes el nivel creando estructura en medio de la velocidad.` },
      { title: `El impacto que dejas`, text: `Con el apoyo correcto, logras ${context.impact}. Se nota en la calidad del trabajo y en la confianza de quienes te rodean.` },
    ],
    it: [
      { title: `Come dai direzione`, text: `Non sei qui per eseguire in modo passivo. Tu orienti ${context.mission}, metti ordine nelle priorita e tieni il team allineato.` },
      { title: `Cosa reggi ogni settimana`, text: `Ti ritrovi a bilanciare ${context.pressure}. Il tuo valore emerge quando trasformi complessità in scelte nitide.` },
      { title: `Come funziona davvero il tuo lavoro`, text: `La tua quotidianità include ${context.operating}. Difendi qualità e ritmo dando struttura nei momenti più densi.` },
      { title: `L'impatto che costruisci`, text: `Con il supporto giusto, sblocchi ${context.impact}. Lo senti nei risultati e nella fiducia del team.` },
    ],
    pt: [
      { title: `Como você define o rumo`, text: `Você não está aqui para apenas executar. Seu trabalho impulsiona ${context.mission}, organiza prioridades e conecta as pessoas.` },
      { title: `O que você sustenta toda semana`, text: `Você equilibra ${context.pressure}. Seu diferencial aparece quando transforma pressão em clareza.` },
      { title: `Como seu dia funciona de verdade`, text: `Sua rotina inclui ${context.operating}. Você protege qualidade e ritmo colocando estrutura onde há urgência.` },
      { title: `O impacto que você cria`, text: `Com o suporte certo, você conquista ${context.impact}. Isso aparece no resultado e na confiança da equipe.` },
    ],
    de: [
      { title: `Wie Sie Richtung geben`, text: `Sie setzen nicht nur um. Sie prägen ${context.mission}, ordnen Prioritäten und geben dem Team Sicherheit.` },
      { title: `Was Sie Woche für Woche tragen`, text: `Sie balancieren ${context.pressure}. Ihre Stärke zeigt sich, wenn Sie unter Druck klar entscheiden.` },
      { title: `Wie Ihr Alltag wirklich läuft`, text: `Zu Ihrer Realität gehört ${context.operating}. Sie halten Qualität und Tempo stabil, indem Sie Struktur schaffen.` },
      { title: `Welche Wirkung Sie auslösen`, text: `Mit passender Unterstützung erreichen Sie ${context.impact}. Das wird in Ergebnissen und Teamvertrauen sichtbar.` },
    ],
  };

  let profileSlides = [...(slideTemplate[language] || slideTemplate.en)];

  const modelFocusByLocale = {
    en: {
      runway: {
        cycle: 'go-sees, walk rehearsals, fittings, and same-day lineup changes',
        execution: 'timing, quick changes, and a stable walk cadence under live audience pressure',
        economics: 'clear booking terms, usage windows, and reliable agency communication',
        progression: 'each show season compounds into stronger castings, cleaner callbacks, and higher-value bookings',
      },
      editorial: {
        cycle: 'mood-board interpretation, test shoots, call sheets, and style-driven set briefs',
        execution: 'pose transitions, camera awareness, and micro-expression control over long shooting blocks',
        economics: 'image-right clarity, publication usage, and contract scope before delivery',
        progression: 'portfolio continuity across stories helps you move from one-off edits to recurring editorial demand',
      },
      commercial: {
        cycle: 'brand casting rounds, campaign callbacks, and product-centered briefing sessions',
        execution: 'repeatable delivery across multiple takes, product focus, and client-directed adjustments',
        economics: 'buyout limits, renewal clauses, and usage territories that match your long-term goals',
        progression: 'consistent client delivery builds retention, referrals, and better negotiating position',
      },
      fit: {
        cycle: 'sample fittings, measurement checks, and iterative garment-adjustment sessions',
        execution: 'precise posture, technical feedback, and repeatable body-position consistency for design teams',
        economics: 'session terms, confidentiality, and documented scope of technical collaboration',
        progression: 'trusted fit consistency turns into long-term designer relationships and stable repeat work',
      },
      ecommerce: {
        cycle: 'high-volume SKU planning, look sequencing, and rapid product-page capture days',
        execution: 'pose repeatability, garment visibility, and pace control across large catalog batches',
        economics: 'usage coverage for product channels, rollout regions, and update cycles',
        progression: 'high-accuracy output at scale improves rebooking frequency and platform credibility',
      },
      general: {
        cycle: 'castings, prep, booking confirmations, and fast schedule changes',
        execution: 'body control, communication, and reliable delivery under changing set conditions',
        economics: 'rights awareness, contract clarity, and professional boundary management',
        progression: 'consistent preparation turns short opportunities into a durable career track',
      },
    },
    fr: {
      runway: {
        cycle: 'go-sees, répétitions de marche, fittings et changements de lineup le jour J',
        execution: 'timing, quick changes et cadence stable de marche sous pression live',
        economics: 'conditions de booking claires, fenêtres d’usage et communication agence fiable',
        progression: 'chaque saison de défilés renforce les castings, les callbacks et la valeur des bookings',
      },
      editorial: {
        cycle: 'lecture de moodboard, tests photo, call sheets et briefs éditoriaux de plateau',
        execution: 'transitions de poses, conscience caméra et contrôle des micro-expressions sur des sessions longues',
        economics: 'clarté des droits à l’image, usages publication et périmètre contractuel avant livraison',
        progression: 'la cohérence de portfolio vous fait passer des one-shots à une demande éditoriale récurrente',
      },
      commercial: {
        cycle: 'castings marque, callbacks de campagne et briefs centrés produit',
        execution: 'exécution répétable sur plusieurs prises, focus produit et ajustements client en direct',
        economics: 'limites de buyout, clauses de renouvellement et territoires d’usage alignés à vos objectifs',
        progression: 'une livraison client régulière augmente la fidélisation, les recommandations et votre levier de négociation',
      },
      fit: {
        cycle: 'fittings échantillons, contrôles de mesures et itérations d’ajustement vêtement',
        execution: 'posture précise, feedback technique et constance des positions pour les équipes design',
        economics: 'conditions de session, confidentialité et périmètre de collaboration technique documenté',
        progression: 'une constance fit reconnue crée des relations longues avec les designers et du travail récurrent',
      },
      ecommerce: {
        cycle: 'planification de SKU à grand volume, séquençage des looks et journées capture PDP rapides',
        execution: 'répétabilité des poses, lisibilité vêtement et contrôle du rythme sur de gros catalogues',
        economics: 'couverture d’usage pour canaux produit, zones de diffusion et cycles de mise à jour',
        progression: 'une production fiable à l’échelle améliore le taux de rebooking et la crédibilité plateforme',
      },
      general: {
        cycle: 'castings, préparation, confirmations de booking et changements de planning rapides',
        execution: 'maîtrise corporelle, communication et fiabilité malgré les variations de set',
        economics: 'maîtrise des droits, clarté contractuelle et gestion des limites professionnelles',
        progression: 'une préparation régulière transforme des opportunités courtes en trajectoire durable',
      },
    },
    es: {
      runway: {
        cycle: 'go-sees, ensayos de pasarela, fittings y cambios de lineup el mismo día',
        execution: 'timing, cambios rápidos de look y cadencia de caminata estable bajo presión en vivo',
        economics: 'términos de booking claros, ventanas de uso y comunicación de agencia confiable',
        progression: 'cada temporada de desfiles fortalece castings, callbacks y el valor de tus bookings',
      },
      editorial: {
        cycle: 'lectura de moodboard, test shoots, call sheets y briefs de set editoriales',
        execution: 'transiciones de pose, conciencia de cámara y control de microexpresiones en sesiones largas',
        economics: 'claridad de derechos de imagen, uso editorial y alcance contractual antes de entrega',
        progression: 'la continuidad de portafolio te mueve de editoriales puntuales a demanda recurrente',
      },
      commercial: {
        cycle: 'rondas de casting de marca, callbacks de campaña y briefings centrados en producto',
        execution: 'entrega repetible en múltiples tomas, foco en producto y ajustes guiados por cliente',
        economics: 'límites de buyout, cláusulas de renovación y territorios de uso alineados a tu rumbo',
        progression: 'la consistencia con clientes mejora retención, referencias y poder de negociación',
      },
      fit: {
        cycle: 'fittings de muestra, control de medidas y sesiones iterativas de ajuste de prenda',
        execution: 'postura precisa, feedback técnico y consistencia corporal para equipos de diseño',
        economics: 'términos de sesión, confidencialidad y alcance técnico documentado',
        progression: 'la consistencia en fit crea relaciones largas con diseñadores y trabajo recurrente',
      },
      ecommerce: {
        cycle: 'planificación masiva de SKU, secuenciación de looks y jornadas rápidas de captura para PDP',
        execution: 'repetibilidad de poses, visibilidad de prenda y control de ritmo en catálogos grandes',
        economics: 'cobertura de uso para canales de producto, regiones y ciclos de actualización',
        progression: 'la precisión a escala mejora frecuencia de rebooking y credibilidad de plataforma',
      },
      general: {
        cycle: 'castings, preparación, confirmaciones de booking y cambios rápidos de agenda',
        execution: 'control corporal, comunicación y entrega fiable con condiciones de set cambiantes',
        economics: 'claridad sobre derechos, contratos y límites profesionales',
        progression: 'la preparación consistente convierte oportunidades cortas en carrera sostenible',
      },
    },
    it: {
      runway: {
        cycle: 'go-sees, prove passerella, fitting e cambi lineup nel giorno dello show',
        execution: 'timing, quick changes e cadenza di camminata stabile sotto pressione live',
        economics: 'termini di booking chiari, finestre d’uso e comunicazione agenzia affidabile',
        progression: 'ogni stagione sfilate rafforza casting, callback e valore dei booking',
      },
      editorial: {
        cycle: 'lettura moodboard, test shoot, call sheet e brief editoriali di set',
        execution: 'transizioni posing, consapevolezza camera e controllo micro-espressivo su sessioni lunghe',
        economics: 'chiarezza su diritti d’immagine, usi editoriali e perimetro contrattuale prima della consegna',
        progression: 'continuità portfolio: da uscite isolate a domanda editoriale ricorrente',
      },
      commercial: {
        cycle: 'casting brand, callback campagna e briefing orientati al prodotto',
        execution: 'resa ripetibile su più take, focus prodotto e aggiustamenti richiesti dal cliente',
        economics: 'limiti di buyout, clausole di rinnovo e territori d’uso coerenti con i tuoi obiettivi',
        progression: 'affidabilità verso i clienti aumenta retention, referenze e leva negoziale',
      },
      fit: {
        cycle: 'fitting campioni, verifica misure e sessioni iterative di aggiustamento capo',
        execution: 'postura precisa, feedback tecnico e coerenza di posizione per i team design',
        economics: 'termini sessione, riservatezza e perimetro tecnico documentato',
        progression: 'costanza fit riconosciuta genera relazioni lunghe e lavoro ripetuto',
      },
      ecommerce: {
        cycle: 'pianificazione SKU ad alto volume, sequenza look e giornate rapide di capture PDP',
        execution: 'ripetibilità posing, leggibilità del capo e controllo ritmo su grandi cataloghi',
        economics: 'copertura d’uso per canali prodotto, regioni e cicli di aggiornamento',
        progression: 'accuratezza ad alta scala migliora rebooking e credibilità piattaforma',
      },
      general: {
        cycle: 'casting, preparazione, conferme booking e cambi rapidi di agenda',
        execution: 'controllo corporeo, comunicazione e consegna affidabile con condizioni set variabili',
        economics: 'chiarezza su diritti, contratti e confini professionali',
        progression: 'preparazione costante trasforma opportunità brevi in una traiettoria solida',
      },
    },
    pt: {
      runway: {
        cycle: 'go-sees, ensaios de passarela, fittings e mudanças de lineup no mesmo dia',
        execution: 'timing, trocas rápidas de look e cadência de caminhada estável sob pressão ao vivo',
        economics: 'termos de booking claros, janelas de uso e comunicação de agência confiável',
        progression: 'cada temporada de desfiles aumenta a força dos castings, callbacks e valor dos bookings',
      },
      editorial: {
        cycle: 'leitura de moodboard, test shoots, call sheets e briefs editoriais de set',
        execution: 'transições de pose, consciência de câmera e controle de microexpressões em sessões longas',
        economics: 'clareza de direitos de imagem, uso editorial e escopo contratual antes da entrega',
        progression: 'continuidade de portfólio leva de trabalhos pontuais para demanda editorial recorrente',
      },
      commercial: {
        cycle: 'rodadas de casting de marca, callbacks de campanha e briefings focados em produto',
        execution: 'entrega repetível em múltiplas tomadas, foco no produto e ajustes guiados por cliente',
        economics: 'limites de buyout, cláusulas de renovação e territórios de uso alinhados ao seu plano',
        progression: 'consistência com clientes gera retenção, indicação e melhor poder de negociação',
      },
      fit: {
        cycle: 'fittings de amostra, checagem de medidas e sessões iterativas de ajuste de peça',
        execution: 'postura precisa, feedback técnico e consistência corporal para times de design',
        economics: 'termos de sessão, confidencialidade e escopo técnico documentado',
        progression: 'consistência de fit constrói relações longas e recorrência de trabalho',
      },
      ecommerce: {
        cycle: 'planejamento de SKU em alto volume, sequência de looks e dias rápidos de captura para PDP',
        execution: 'repetibilidade de poses, visibilidade da peça e controle de ritmo em grandes catálogos',
        economics: 'cobertura de uso para canais de produto, regiões e ciclos de atualização',
        progression: 'precisão em escala aumenta rebooking e credibilidade de plataforma',
      },
      general: {
        cycle: 'castings, preparação, confirmações de booking e mudanças rápidas de agenda',
        execution: 'controle corporal, comunicação e entrega confiável com set em mudança',
        economics: 'clareza sobre direitos, contratos e limites profissionais',
        progression: 'preparação consistente transforma oportunidades curtas em carreira durável',
      },
    },
    de: {
      runway: {
        cycle: 'Go-Sees, Laufstegproben, Fittings und kurzfristige Line-up-Änderungen am Show-Tag',
        execution: 'Timing, schnelle Outfitwechsel und stabiler Walk-Rhythmus unter Live-Druck',
        economics: 'klare Booking-Bedingungen, Nutzungsfenster und verlässliche Agenturkommunikation',
        progression: 'jede Show-Saison stärkt Castings, Callbacks und den Wert Ihrer Bookings',
      },
      editorial: {
        cycle: 'Moodboard-Interpretation, Testshoots, Call Sheets und redaktionelle Set-Briefings',
        execution: 'Pose-Transitions, Kamerabewusstsein und Mikro-Expressionskontrolle über lange Sessions',
        economics: 'klare Bildrechte, Publikationsnutzung und Vertragsumfang vor Auslieferung',
        progression: 'Portfolio-Kontinuität führt von Einzeljobs zu wiederkehrender Editorial-Nachfrage',
      },
      commercial: {
        cycle: 'Brand-Castingrunden, Kampagnen-Callbacks und produktzentrierte Briefings',
        execution: 'wiederholbare Leistung über mehrere Takes, Produktfokus und klientengesteuerte Anpassungen',
        economics: 'Buyout-Grenzen, Verlängerungsklauseln und Nutzungsgebiete passend zu Ihren Zielen',
        progression: 'konstante Kundenergebnisse verbessern Retention, Empfehlungen und Verhandlungsspielraum',
      },
      fit: {
        cycle: 'Sample-Fittings, Maßkontrollen und iterative Sitzungsrunden zur Passformkorrektur',
        execution: 'präzise Haltung, technisches Feedback und reproduzierbare Körperpositionen für Designteams',
        economics: 'Session-Bedingungen, Vertraulichkeit und dokumentierter technischer Arbeitsumfang',
        progression: 'verlässliche Fit-Konstanz schafft langfristige Designerbeziehungen und wiederkehrende Arbeit',
      },
      ecommerce: {
        cycle: 'hohe SKU-Planung, Look-Sequenzierung und schnelle PDP-Capture-Tage',
        execution: 'Pose-Reproduzierbarkeit, Produktsichtbarkeit und Tempokontrolle in großen Katalogchargen',
        economics: 'Nutzungsabdeckung für Produktkanäle, Regionen und Update-Zyklen',
        progression: 'skalierbar präzise Ergebnisse erhöhen Rebooking-Quote und Plattformvertrauen',
      },
      general: {
        cycle: 'Castings, Vorbereitung, Booking-Bestätigungen und schnelle Terminverschiebungen',
        execution: 'Körperkontrolle, Kommunikation und verlässliche Lieferung trotz wechselnder Set-Bedingungen',
        economics: 'Rechteklarheit, Vertragsklarheit und professionelle Grenzen',
        progression: 'konsequente Vorbereitung macht aus kurzfristigen Chancen eine tragfähige Laufbahn',
      },
    },
  };

  const localeModelFocus = modelFocusByLocale[language] || modelFocusByLocale.en;
  const activeModelFocus = localeModelFocus[modelSubtype] || localeModelFocus.general;
  const modelSlidesByLocale = {
    en: [
      { title: 'How your booking cycle actually works', text: `As ${roleName}, your weekly reality revolves around ${activeModelFocus.cycle}.` },
      { title: 'What execution quality means on set', text: `Your reliability is judged through ${activeModelFocus.execution}.` },
      { title: 'How you protect career value', text: `Your long-term leverage depends on ${activeModelFocus.economics}.` },
      { title: 'How progression compounds over seasons', text: `In practice, ${activeModelFocus.progression}.` },
    ],
    fr: [
      { title: 'Comment fonctionne vraiment votre cycle de booking', text: `En tant que ${roleName}, votre réalité hebdomadaire tourne autour de ${activeModelFocus.cycle}.` },
      { title: 'Ce que signifie une exécution fiable sur le plateau', text: `Votre fiabilité est évaluée via ${activeModelFocus.execution}.` },
      { title: 'Comment protéger votre valeur professionnelle', text: `Votre levier à long terme dépend de ${activeModelFocus.economics}.` },
      { title: 'Comment la progression s’accumule dans le temps', text: `Concrètement, ${activeModelFocus.progression}.` },
    ],
    es: [
      { title: 'Cómo funciona de verdad tu ciclo de booking', text: `Como ${roleName}, tu realidad semanal gira alrededor de ${activeModelFocus.cycle}.` },
      { title: 'Qué significa ejecutar bien en set', text: `Tu fiabilidad se evalúa por ${activeModelFocus.execution}.` },
      { title: 'Cómo proteges tu valor profesional', text: `Tu margen a largo plazo depende de ${activeModelFocus.economics}.` },
      { title: 'Cómo se acumula tu progreso por temporadas', text: `En la práctica, ${activeModelFocus.progression}.` },
    ],
    it: [
      { title: 'Come funziona davvero il tuo ciclo di booking', text: `Come ${roleName}, la tua realtà settimanale ruota intorno a ${activeModelFocus.cycle}.` },
      { title: 'Cosa significa eseguire bene sul set', text: `La tua affidabilità viene valutata attraverso ${activeModelFocus.execution}.` },
      { title: 'Come proteggi il tuo valore professionale', text: `La tua leva nel lungo periodo dipende da ${activeModelFocus.economics}.` },
      { title: 'Come la progressione si accumula nel tempo', text: `Nella pratica, ${activeModelFocus.progression}.` },
    ],
    pt: [
      { title: 'Como seu ciclo de booking realmente funciona', text: `Como ${roleName}, sua realidade semanal gira em torno de ${activeModelFocus.cycle}.` },
      { title: 'O que significa executar com qualidade no set', text: `Sua confiabilidade é avaliada por ${activeModelFocus.execution}.` },
      { title: 'Como você protege seu valor profissional', text: `Sua alavancagem de longo prazo depende de ${activeModelFocus.economics}.` },
      { title: 'Como a progressão se acumula por temporadas', text: `Na prática, ${activeModelFocus.progression}.` },
    ],
    de: [
      { title: 'Wie Ihr Booking-Zyklus wirklich funktioniert', text: `Als ${roleName} dreht sich Ihr Wochenalltag um ${activeModelFocus.cycle}.` },
      { title: 'Was verlässliche Ausführung am Set bedeutet', text: `Ihre Verlässlichkeit wird an ${activeModelFocus.execution} gemessen.` },
      { title: 'Wie Sie Ihren professionellen Wert schützen', text: `Ihr langfristiger Hebel hängt von ${activeModelFocus.economics} ab.` },
      { title: 'Wie sich Entwicklung über Saisons aufbaut', text: `In der Praxis gilt: ${activeModelFocus.progression}.` },
    ],
  };

  if (hrNarratives.length >= 3) {
    profileSlides[0] = { title: profileSlides[0].title, text: polishShortLine(hrNarratives[0], language) };
    profileSlides[1] = { title: profileSlides[1].title, text: polishShortLine(hrNarratives[1], language) };
    profileSlides[2] = { title: profileSlides[2].title, text: polishShortLine(hrNarratives[2], language) };
  } else if (sourceSlides?.length >= 2) {
    profileSlides[1] = sourceSlides[0];
    profileSlides[2] = sourceSlides[1];
  }
  if (isModelProfile) {
    const localizedModelSlides = modelSlidesByLocale[language] || modelSlidesByLocale.en;
    profileSlides.splice(0, profileSlides.length, ...localizedModelSlides);
  }

  const carouselRoleDetailByLocale = {
    en: {
      generic: [
        `In this role, your day is judged by how well you stabilize ${context.mission} under real constraints.`,
        `Most pressure points show up around ${context.pressure}, so your judgment has to stay calm and consistent.`,
        `Execution improves when ${context.operating} is run through clear handoffs, clear ownership, and repeatable standards.`,
        `When that structure holds, you unlock ${context.impact} in a way people can actually feel on the ground.`,
      ],
      model: [
        `As ${roleName}, your weekly rhythm is shaped by ${activeModelFocus.cycle}.`,
        `On set, your professional credibility is read through ${activeModelFocus.execution}.`,
        `Your long-term protection depends on how clearly you manage ${activeModelFocus.economics}.`,
        `Your growth compounds when ${activeModelFocus.progression}.`,
      ],
    },
    fr: {
      generic: [
        `Dans ce rôle, votre quotidien est évalué sur votre capacité à tenir ${context.mission} malgré les contraintes réelles.`,
        `Les tensions apparaissent souvent autour de ${context.pressure}, donc votre discernement doit rester stable.`,
        `La qualité monte quand ${context.operating} s’appuie sur des handoffs clairs, des rôles clairs et des standards répétés.`,
        `Quand cette structure tient, vous créez ${context.impact} de manière concrète et visible.`,
      ],
      model: [
        `Comme ${roleName}, votre rythme hebdomadaire s’organise autour de ${activeModelFocus.cycle}.`,
        `Sur le plateau, votre crédibilité professionnelle se lit dans ${activeModelFocus.execution}.`,
        `Votre protection long terme dépend de la clarté avec laquelle vous gérez ${activeModelFocus.economics}.`,
        `Votre progression se cumule quand ${activeModelFocus.progression}.`,
      ],
    },
    es: {
      generic: [
        `En este rol, tu trabajo se evalúa por cómo sostienes ${context.mission} bajo condiciones reales.`,
        `La presión suele concentrarse en ${context.pressure}, por eso tu criterio debe mantenerse firme.`,
        `La ejecución mejora cuando ${context.operating} se organiza con handoffs claros, responsables definidos y estándares repetibles.`,
        `Cuando esa estructura se mantiene, aparece ${context.impact} de forma visible para todo el equipo.`,
      ],
      model: [
        `Como ${roleName}, tu semana se organiza alrededor de ${activeModelFocus.cycle}.`,
        `En set, tu credibilidad profesional se mide por ${activeModelFocus.execution}.`,
        `Tu protección a largo plazo depende de cómo gestionas ${activeModelFocus.economics}.`,
        `Tu progreso se acumula cuando ${activeModelFocus.progression}.`,
      ],
    },
    it: {
      generic: [
        `In questo ruolo sei valutata per come riesci a tenere ${context.mission} dentro condizioni reali di lavoro.`,
        `La pressione tende a concentrarsi su ${context.pressure}, quindi il tuo giudizio deve restare lucido.`,
        `L’esecuzione migliora quando ${context.operating} passa da handoff chiari, ownership chiara e standard ripetibili.`,
        `Quando questa struttura regge, si vede ${context.impact} in modo concreto per il team.`,
      ],
      model: [
        `Come ${roleName}, la tua settimana ruota attorno a ${activeModelFocus.cycle}.`,
        `Sul set, la tua credibilità professionale si misura su ${activeModelFocus.execution}.`,
        `La protezione del tuo valore nel lungo periodo dipende da come gestisci ${activeModelFocus.economics}.`,
        `La tua progressione si accumula quando ${activeModelFocus.progression}.`,
      ],
    },
    pt: {
      generic: [
        `Neste papel, seu trabalho é julgado por como você sustenta ${context.mission} em condições reais.`,
        `A pressão normalmente se concentra em ${context.pressure}, então seu critério precisa continuar estável.`,
        `A execução melhora quando ${context.operating} roda com handoffs claros, responsáveis definidos e padrões repetíveis.`,
        `Quando essa estrutura se mantém, ${context.impact} aparece de forma concreta no time e no resultado.`,
      ],
      model: [
        `Como ${roleName}, sua semana gira em torno de ${activeModelFocus.cycle}.`,
        `No set, sua credibilidade profissional é medida por ${activeModelFocus.execution}.`,
        `A proteção do seu valor de longo prazo depende de como você conduz ${activeModelFocus.economics}.`,
        `Sua progressão se acumula quando ${activeModelFocus.progression}.`,
      ],
    },
    de: {
      generic: [
        `In dieser Rolle werden Sie daran gemessen, wie stabil Sie ${context.mission} unter realen Bedingungen tragen.`,
        `Druck entsteht meist rund um ${context.pressure}, deshalb muss Ihr Urteil klar und belastbar bleiben.`,
        `Die Ausführung wird besser, wenn ${context.operating} über klare Handoffs, klare Verantwortung und wiederholbare Standards läuft.`,
        `Wenn diese Struktur hält, wird ${context.impact} für Team und Ergebnis sichtbar.`,
      ],
      model: [
        `Als ${roleName} ist Ihr Wochenrhythmus durch ${activeModelFocus.cycle} geprägt.`,
        `Am Set zeigt sich Ihre professionelle Glaubwürdigkeit über ${activeModelFocus.execution}.`,
        `Der Schutz Ihres langfristigen Werts hängt davon ab, wie sauber Sie ${activeModelFocus.economics} steuern.`,
        `Ihr Fortschritt kumuliert, wenn ${activeModelFocus.progression}.`,
      ],
    },
  };

  const localeCarouselDetail = carouselRoleDetailByLocale[language] || carouselRoleDetailByLocale.en;
  const roleDetailLines = isModelProfile ? localeCarouselDetail.model : localeCarouselDetail.generic;
  profileSlides = profileSlides.map((slide, index) => {
    const extraLine = roleDetailLines[index % roleDetailLines.length];
    return {
      ...slide,
      text: `${polishShortLine(slide.text, language)} ${polishShortLine(extraLine, language)}`,
    };
  });

  const challengePoolByLocale = {
    en: {
      creative: [
        'You are asked to protect a clear brand signature while trend pressure keeps shifting the brief, and every revision quietly eats into your margin.',
        'Creative reviews can get politicized, and that noise can blur your best strategic decisions and delay revenue-critical launches.',
        'Campaign speed often cuts into concept maturation, forcing you to defend quality in real time while budgets shrink.',
        'At key drops, you are often balancing product, marketing, and leadership priorities at the same time, and one misstep costs you a season.',
        'When visual references pile up too quickly, teams can lose alignment, and rework becomes a silent revenue drain.',
        'Tighter budgets reduce room for innovation right when the market asks for bold ideas, so you must do more with less.',
      ],
      content: [
        'You are expected to deliver premium visuals across channels without stretching crew capacity too far, and overtime quietly erodes your profit.',
        'Late changes from stakeholders can break shot logic and create costly post-production loops that burn your budget.',
        'Maintaining narrative continuity becomes harder when assets are repurposed at high speed, and inconsistency costs you repeat clients.',
        'You need to balance cinematic quality with platform deadlines that keep getting tighter, and missed deadlines mean lost revenue.',
        'Quality drops quickly when handoff between set, edit, and delivery is loose, and every reshoot is money out of your pocket.',
        'Rights, usage windows, and approvals can delay releases, and every delay is a missed commercial opportunity.',
      ],
      talent: [
        'You often evaluate potential under uncertainty, and one rushed call can affect a long-term career path and your reputation.',
        'Model readiness is uneven, so development decisions must happen before high-visibility bookings, and a bad fit costs you a client.',
        'You navigate agency pressure while protecting dignity and fair terms, and a broken trust can end a relationship overnight.',
        'Competition for opportunities is intense, and confidence and mental resilience are an ongoing challenge that affects your income.',
        'Contract and image-right misunderstandings can expose talent to avoidable risk, and legal fees are a real revenue drain.',
        'Scouting quality drops when speed replaces observation, and a poor placement can cost you a valuable referral.',
      ],
      operations: [
        'You absorb schedule shocks from suppliers while being measured on delivery reliability, and every delay hits your bottom line.',
        'Small quality drifts upstream can become expensive failures at final handoff, and rework is a direct revenue drain.',
        'Coordination gaps between sourcing, production, and logistics create costly rework cycles that eat your margin.',
        'You must defend process discipline even when commercial pressure pushes for shortcuts, and shortcuts often cost more later.',
        'Forecast changes can destabilize planning and leave you reacting, and reactive work is rarely profitable.',
        'Margin pressure rises quickly when technical decisions are made without complete cross-team context, and you pay for it.',
      ],
      marketing: [
        'You are expected to keep campaigns culturally relevant while proving measurable return, and wasted spend is a constant pain.',
        'Creative dilution appears fast when brand, PR, social, and marketing streams are not aligned, and misalignment burns budget.',
        'Performance pressure can push short-term tactics that weaken long-term brand equity, and you lose future revenue.',
        'Creative volume is high, but audience trust drops when storytelling lacks consistency, and trust is hard to buy back.',
        'Attribution noise makes budget decisions harder, and a wrong bet can drain a quarter of your spend.',
        'Launch timing risk rises when partner calendars and channel realities are misaligned, and a bad launch is a real loss.',
      ],
      digital: [
        'You need to improve conversion without compromising the premium feel of the journey, and friction is a silent revenue leak.',
        'Catalog complexity can frustrate checkout if taxonomy and merchandising are unclear, and abandoned carts cost you money.',
        'Teams request rapid experimentation, but weak governance can spread inconsistent decisions that hurt your conversion.',
        'Data is abundant, but prioritization becomes fragile when signals conflict, and wrong priorities waste your budget.',
        'Retention suffers when lifecycle journeys are built without clear ownership, and losing a customer is losing revenue.',
        'Technical debt can quietly erode performance during high-traffic windows, and downtime is a direct revenue drain.',
      ],
      education: [
        'You are expected to raise graduate employability while keeping pedagogical standards, and a weak cohort hurts your reputation.',
        'Faculty alignment can drift when curriculum updates move faster than coordination, and inconsistency costs you students.',
        'Student progression becomes uneven when assessment criteria are not consistent, and poor outcomes reduce enrollment.',
        'Employers expect job-ready talent, but your program can lag behind market shifts, and that gap costs you placements.',
        'Academic planning must absorb budget pressure without reducing mentoring, and underfunded mentoring hurts your brand.',
        'School reputation is fragile when enrollment and classroom reality stop matching, and reputation is your real revenue.',
      ],
    },
    fr: {
      creative: [
        'On vous demande de protéger une signature de marque lisible alors que la pression tendance change sans cesse le brief, et chaque retouche grignote discrètement votre marge.',
        'Les comités créatifs se politisent vite, et ce bruit peut brouiller vos meilleurs arbitrages et retarder des lancements critiques pour le chiffre.',
        'La vitesse des campagnes réduit le temps de maturation conceptuelle, au risque d’affaiblir la qualité pendant que les budgets se resserrent.',
        'Vous portez simultanément les attentes produit, marketing et direction, et un seul faux pas peut coûter toute une saison.',
        'Quand les références se multiplient trop vite, la cohérence d’équipe vacille, et le rework devient une fuite de revenus silencieuse.',
        'La contrainte budgétaire limite l’expérimentation au moment même où le marché attend du courage, vous obligeant à faire plus avec moins.',
      ],
      content: [
        'Vous devez livrer des visuels premium sur plusieurs canaux sans épuiser la production, et les heures supplémentaires rongent votre rentabilité.',
        'Les changements tardifs cassent la logique de tournage et créent des boucles de post-production coûteuses qui brûlent votre budget.',
        'La continuité narrative devient fragile quand les assets sont réutilisés trop vite, et l’incohérence vous fait perdre des clients récurrents.',
        'Vous équilibrez ambition cinématographique et délais plateforme de plus en plus serrés, et chaque retard signifie une perte de revenus.',
        'La qualité chute vite quand les handoffs entre plateau, montage et brand ne sont pas cadrés, et chaque reshoot est de l’argent perdu.',
        'Droits, fenêtres d’usage et validations peuvent retarder la sortie, et chaque report est une opportunité commerciale manquée.',
      ],
      talent: [
        'Vous évaluez souvent le potentiel avec peu de certitudes, et un choix précipité peut marquer une trajectoire et votre réputation.',
        'La maturité des profils est inégale, donc le développement doit précéder les bookings visibles, et une mauvaise adéquation vous coûte un client.',
        'Vous gérez la pression des agences tout en protégeant dignité et conditions justes, et une confiance brisée peut rompre une relation du jour au lendemain.',
        'La concurrence est forte, et la confiance psychologique des talents devient un enjeu qui pèse directement sur vos revenus.',
        'Les zones floues sur contrat et droit à l’image exposent à des risques évitables, et des frais juridiques représentent une vraie perte.',
        'Le scouting perd en qualité dès que la vitesse remplace l’observation, et un mauvais placement peut coûter une recommandation précieuse.',
      ],
      operations: [
        'Vous absorbez les chocs planning fournisseurs tout en restant évaluée sur la fiabilité de livraison, et chaque retard touche votre résultat.',
        'De petites dérives qualité en amont deviennent des échecs coûteux en fin de chaîne, et le rework est une perte directe.',
        'Les écarts de coordination entre sourcing, production et logistique génèrent du travail refait qui ronge votre marge.',
        'Vous devez tenir la discipline process même quand l’urgence pousse aux raccourcis, et les raccourcis coûtent souvent plus cher plus tard.',
        'Les variations de prévision déstabilisent la planification et forcent des réactions subies, rarement rentables.',
        'La pression marge augmente vite quand des décisions techniques sont prises sans vision transverse, et c’est vous qui en payez le prix.',
      ],
      marketing: [
        'On attend de vous des campagnes pertinentes avec un retour mesurable, et toute dépense inutile devient une douleur quotidienne.',
        'Le message se dilue vite si brand, PR, social et influence ne sont pas synchronisés, et le désalignement brûle du budget.',
        'La pression performance peut encourager des tactiques court terme qui fragilisent le capital de marque et vous font perdre des revenus futurs.',
        'Le volume créatif est élevé, mais la confiance audience baisse si le récit manque de cohérence, et la confiance se rachète difficilement.',
        'Le bruit d’attribution complique les arbitrages budget, et un mauvais pari peut vider un quart de vos dépenses.',
        'Le risque de timing augmente quand calendriers partenaires et réalité canal sont désalignés, et un lancement raté est une vraie perte.',
      ],
      digital: [
        'Vous devez faire progresser la conversion sans dégrader le premium du parcours, et la friction est une fuite de revenus silencieuse.',
        'La complexité catalogue peut créer de la friction au checkout si taxonomie et merchandising sont flous, et les paniers abandonnés coûtent cher.',
        'Les équipes demandent des tests rapides, mais une gouvernance faible multiplie les décisions IA incohérentes qui nuisent à la conversion.',
        'Les données abondent, mais la priorisation devient instable quand les signaux se contredisent, et de mauvaises priorités gaspillent le budget.',
        'La rétention souffre quand les parcours lifecycle sont lancés sans ownership, et perdre un client, c’est perdre un revenu.',
        'La dette technique érode la performance pendant les pics, et une panne est une perte de revenus directe.',
      ],
      education: [
        'Vous devez faire monter l’employabilité des diplômés sans relâcher l’exigence, et une promotion fragile abîme votre réputation.',
        'L’alignement des formateurs se fragilise quand les mises à jour accélèrent, et l’incohérence vous coûte des étudiants.',
        'La progression étudiante devient inégale lorsque les critères ne sont pas harmonisés, et de mauvais résultats réduisent les inscriptions.',
        'Les employeurs attendent des profils opérationnels, mais vos parcours peuvent accuser du retard, et cet écart coûte des placements.',
        'La planification académique absorbe la pression budget sans sacrifier le mentorat, et un mentorat sous-financé abîme votre image.',
        'La réputation se joue quand les promesses de placement et la réalité divergent, et cette réputation est votre vrai capital.',
      ],
    },
    es: {
      creative: [
        'Te piden proteger una firma visual clara mientras la presión de tendencias cambia el brief cada semana, y cada retoque recorta silenciosamente tu margen.',
        'Las revisiones creativas se politizan con facilidad, y ese ruido puede nublar tus mejores decisiones y retrasar lanzamientos críticos para el negocio.',
        'La velocidad de campaña reduce tiempo de maduración conceptual justo cuando más se necesita criterio, mientras los presupuestos se aprietan.',
        'Cargas expectativas de producto, marketing y dirección a la vez, y un solo tropiezo puede costarte una temporada entera.',
        'Cuando se multiplican referencias sin filtro, la cohesión del equipo depende de ti, y el retrabajo se vuelve una fuga de ingresos silenciosa.',
        'La restricción presupuestaria limita experimentación justo cuando el mercado exige valentía, obligándote a hacer más con menos.',
      ],
      content: [
        'Se espera que entregues visuales premium en varios canales sin sobrecargar producción, y las horas extra erosionan tu rentabilidad.',
        'Los cambios tardíos rompen la lógica del rodaje y abren ciclos costosos de postproducción que queman tu presupuesto.',
        'La continuidad narrativa se debilita cuando los assets se reutilizan con prisa, y la inconsistencia te cuesta clientes recurrentes.',
        'Debes equilibrar ambición cinematográfica con plazos cada vez más cortos, y cada retraso significa ingresos perdidos.',
        'La calidad cae rápido cuando los handoffs entre set, edición y marca quedan flojos, y cada re-rodaje es dinero de tu bolsillo.',
        'Derechos, ventanas de uso y aprobaciones pueden frenar salidas, y cada pausa es una oportunidad comercial perdida.',
      ],
      talent: [
        'Sueles evaluar potencial con información parcial, y una decisión apresurada puede marcar una carrera y tu reputación.',
        'La preparación de modelos es desigual, así que el desarrollo debe adelantarse a los bookings, y un mal encaje te cuesta un cliente.',
        'Navegas presión de agencias cuidando dignidad y condiciones justas, y una confianza rota puede terminar una relación de la noche a la mañana.',
        'La competencia constante golpea la confianza, y esa resiliencia emocional pesa directamente en tus ingresos.',
        'Los vacíos sobre contrato y derechos de imagen exponen a riesgos evitables, y los honorarios legales son una pérdida real.',
        'La calidad del scouting baja cuando la velocidad reemplaza la observación, y un mal placement puede costarte una recomendación valiosa.',
      ],
      operations: [
        'Absorbes cambios de calendario de proveedores y aun así se espera entrega fiable, y cada retraso golpea tu resultado.',
        'Pequeñas desviaciones de calidad al inicio terminan en fallos costosos al final, y el retrabajo es una pérdida directa.',
        'Los huecos de coordinación entre sourcing, producción y logística generan trabajo rehecho que devora tu margen.',
        'Te toca sostener disciplina de proceso incluso cuando la urgencia empuja atajos, y los atajos suelen costar más después.',
        'Los cambios de previsión desestabilizan la planificación y fuerzan reacción, y el trabajo reactivo rara vez es rentable.',
        'La presión de margen sube rápido cuando decisiones técnicas se toman sin contexto, y tú pagas el precio.',
      ],
      marketing: [
        'Debes mantener campañas relevantes con retorno medible, y el gasto inútil es un dolor constante.',
        'El mensaje se diluye cuando marca, PR, social e influencers no avanzan alineados, y el desajuste quema presupuesto.',
        'La presión por performance puede forzar tácticas de corto plazo que dañan el valor de marca y los ingresos futuros.',
        'El volumen creativo crece, pero la confianza cae si falta coherencia, y la confianza es difícil de recomprar.',
        'El ruido de atribución complica las decisiones de presupuesto, y una apuesta equivocada puede vaciar un trimestre.',
        'El riesgo de timing sube cuando calendarios y realidad de canal no encajan, y un mal lanzamiento es una pérdida real.',
      ],
      digital: [
        'Necesitas mejorar conversión sin sacrificar el premium del recorrido, y la fricción es una fuga de ingresos silenciosa.',
        'La complejidad de catálogo crea fricción en checkout si taxonomía y merchandising no están claros, y los carritos abandonados cuestan dinero.',
        'Los equipos piden pruebas rápidas, pero sin gobernanza se multiplican decisiones IA incoherentes que dañan la conversión.',
        'Hay muchos datos, pero priorizar se vuelve frágil cuando las señales se contradicen, y malas prioridades desperdician presupuesto.',
        'La retención cae cuando journeys de ciclo de vida salen sin ownership, y perder un cliente es perder ingresos.',
        'La deuda técnica erosiona rendimiento en los picos, y una caída es una pérdida de ingresos directa.',
      ],
      education: [
        'Se espera que eleves la empleabilidad sin bajar el estándar, y una cohorte débil daña tu reputación.',
        'La alineación docente se debilita cuando el currículo cambia más rápido, y la inconsistencia te cuesta estudiantes.',
        'El progreso estudiantil se vuelve irregular si los criterios no están unificados, y malos resultados reducen inscripciones.',
        'Los empleadores exigen perfiles job-ready, pero tu programa puede rezagarse, y esa brecha cuesta placements.',
        'La planificación académica absorbe presión presupuestaria sin perder mentoría, y un mentoring mal financiado daña tu imagen.',
        'La reputación se resiente cuando promesa y realidad no coinciden, y esa reputación es tu verdadero capital.',
      ],
    },
    it: {
      creative: [
        'Ti viene chiesto di proteggere una firma visiva chiara mentre la pressione trend cambia il brief di continuo, e ogni ritocco erode silenziosamente il tuo margine.',
        'Le review creative si politicizzano in fretta, e quel rumore può confondere gli arbitraggi migliori e ritardare lanci critici per il fatturato.',
        'La velocità di campagna riduce il tempo di maturazione concettuale proprio quando serve, mentre i budget si stringono.',
        'Gestisci aspettative di prodotto, marketing e direzione insieme, e un solo passo falso può costare un’intera stagione.',
        'Quando i riferimenti si moltiplicano senza filtro, la coesione del team dipende da te, e il rework diventa una perdita di ricavi silenziosa.',
        'I vincoli di budget limitano la sperimentazione quando il mercato chiede coraggio, costringendoti a fare di più con meno.',
      ],
      content: [
        'Devi consegnare visual premium su più canali senza sovraccaricare la produzione, e gli straordinari erodono la redditività.',
        'Le modifiche tardive spezzano la logica di shooting e aprono loop costosi in post-produzione che bruciano il budget.',
        'La continuità narrativa diventa fragile quando gli asset vengono riadattati in fretta, e l’incoerenza ti costa clienti ricorrenti.',
        'Bilanci ambizione cinematografica e deadline sempre più strette, e ogni ritardo significa ricavi persi.',
        'La qualità scende quando gli handoff tra set, montaggio e brand non sono chiari, e ogni reshoot è denaro perso.',
        'Diritti, finestre d’uso e approvazioni possono ritardare il rilascio, e ogni rinvio è un’opportunità commerciale mancata.',
      ],
      talent: [
        'Valuti spesso il potenziale con informazioni incomplete, e una scelta affrettata può segnare una carriera e la tua reputazione.',
        'La readiness dei model è disomogenea, quindi lo sviluppo va anticipato, e una cattiva aderenza ti costa un cliente.',
        'Gestisci pressione da agenzie proteggendo dignità e condizioni, e una fiducia rotta può chiudere una relazione da un giorno all’altro.',
        'La competizione costante colpisce la fiducia, e quella resilienza mentale pesa direttamente sui tuoi ricavi.',
        'Ambiguità su contratti e diritti d’immagine espongono a rischi evitabili, e le spese legali sono una perdita reale.',
        'La qualità dello scouting cala quando la velocità sostituisce l’osservazione, e un cattivo piazzamento costa una raccomandazione preziosa.',
      ],
      operations: [
        'Assorbi shock di calendario dai fornitori restando misurata sulla consegna, e ogni ritardo colpisce il risultato.',
        'Piccole derive qualità a monte diventano rotture costose al handoff, e il rework è una perdita diretta.',
        'Gaps di coordinamento tra sourcing, produzione e logistica generano lavoro rifatto che consuma il margine.',
        'Difendi la disciplina di processo anche quando l’urgenza spinge scorciatoie, e le scorciatoie costano di più dopo.',
        'Le variazioni di forecast destabilizzano la pianificazione e impongono reazioni, raramente redditizie.',
        'La pressione sul margine cresce quando decisioni tecniche mancano di visione trasversale, e ne paghi il prezzo.',
      ],
      marketing: [
        'Devi mantenere campagne rilevanti con ritorno misurabile, e la spesa inutile è un dolore costante.',
        'Il messaggio si diluisce quando brand, PR, social e influencer non sono allineati, e il disallineamento brucia budget.',
        'La pressione performance può favorire tattiche di breve periodo che indeboliscono il marchio e i ricavi futuri.',
        'Il volume creativo aumenta, ma la fiducia audience cala se manca coerenza, e la fiducia è difficile da ricomprare.',
        'Il rumore di attribuzione rende fragili le scelte budget, e una scommessa sbagliata può svuotare un trimestre.',
        'Il rischio timing cresce quando calendari partner e realtà canale sono disallineati, e un lancio sbagliato è una perdita reale.',
      ],
      digital: [
        'Devi migliorare la conversione senza perdere il premium dell’esperienza, e la frizione è una perdita di ricavi silenziosa.',
        'La complessità catalogo crea attrito nel checkout se tassonomia e merchandising non sono chiari, e i carrelli abbandonati costano denaro.',
        'I team chiedono test rapidi, ma senza governance aumentano decisioni AI incoerenti che danneggiano la conversione.',
        'I dati sono tanti, ma la priorità vacilla quando i segnali si contraddicono, e priorità sbagliate sprecano budget.',
        'La retention scende quando i journey lifecycle partono senza ownership, e perdere un cliente è perdere ricavi.',
        'Il debito tecnico erode performance nei picchi, e un down è una perdita di ricavi diretta.',
      ],
      education: [
        'Devi aumentare l’occupabilità senza abbassare il rigore, e una coorte debole danneggia la reputazione.',
        'L’allineamento dei docenti si indebolisce quando il curriculum evolve più veloce, e l’incoerenza ti costa studenti.',
        'La progressione degli studenti diventa disomogenea se i criteri non sono coerenti, e cattivi esiti riducono le iscrizioni.',
        'I partner chiedono profili job-ready, ma il percorso può restare indietro, e quel divario costa placement.',
        'La pianificazione accademica assorbe pressione di budget senza ridurre il mentoring, e un mentoring sottofinanziato danneggia l’immagine.',
        'La reputazione è a rischio quando promessa e realtà divergono, e quella reputazione è il tuo vero capitale.',
      ],
    },
    pt: {
      creative: [
        'Você é cobrada para proteger uma assinatura visual clara enquanto a pressão de tendências muda o briefing sem parar, e cada retoque corrói silenciosamente sua margem.',
        'As revisões criativas podem ficar políticas, e esse ruído embaralha suas melhores decisões e atrasa lançamentos críticos para a receita.',
        'A velocidade de campanha reduz o tempo de maturação conceitual justo quando mais se precisa de critério, enquanto os orçamentos encolhem.',
        'Você carrega expectativas de produto, marketing e direção ao mesmo tempo, e um único tropeço pode custar uma temporada inteira.',
        'Quando referências se multiplicam sem filtro, a coesão do time depende de você, e o retrabalho vira uma perda de receita silenciosa.',
        'A restrição de orçamento limita experimentação justo quando o mercado espera ousadia, obrigando você a fazer mais com menos.',
      ],
      content: [
        'Espera-se entrega visual premium em vários canais sem estourar a produção, e as horas extras corroem sua lucratividade.',
        'Mudanças tardias quebram a lógica da captação e abrem ciclos caros de pós-produção que queimam seu orçamento.',
        'A continuidade narrativa enfraquece quando ativos são reaproveitados com pressa, e a inconsistência custa clientes recorrentes.',
        'Você equilibra ambição cinematográfica com prazos cada vez mais curtos, e cada atraso significa receita perdida.',
        'A qualidade cai quando handoffs entre set, edição e marca ficam frouxos, e cada regravação é dinheiro do seu bolso.',
        'Direitos, janelas de uso e aprovações podem atrasar publicações, e cada pausa é uma oportunidade comercial perdida.',
      ],
      talent: [
        'Você avalia potencial com incerteza, e uma decisão apressada pode marcar uma carreira e a sua reputação.',
        'A prontidão dos modelos é desigual, então o desenvolvimento deve anteceder os bookings, e um mau encaixe custa um cliente.',
        'Você lida com pressão de agências protegendo dignidade e condições justas, e uma confiança quebrada pode encerrar uma relação da noite para o dia.',
        'A concorrência intensa golpeia a confiança, e essa resiliência emocional pesa diretamente na sua receita.',
        'Dúvidas sobre contrato e direitos de imagem expõem a riscos evitáveis, e honorários jurídicos são uma perda real.',
        'A qualidade do scouting cai quando a velocidade substitui a observação, e uma má colocação custa uma recomendação valiosa.',
      ],
      operations: [
        'Você absorve choques de cronograma dos fornecedores e ainda é cobrada por entrega confiável, e cada atraso atinge seu resultado.',
        'Pequenos desvios de qualidade no início viram falhas caras na etapa final, e o retrabalho é uma perda direta.',
        'Falhas de coordenação entre sourcing, produção e logística geram trabalho refeito que devora sua margem.',
        'Seu papel exige disciplina de processo mesmo quando a urgência empurra atalhos, e os atalhos custam mais depois.',
        'Mudanças de previsão desestabilizam o planejamento e forçam reação, e o trabalho reativo raramente é rentável.',
        'A pressão de margem sobe quando decisões técnicas são tomadas sem visão transversal, e você paga o preço.',
      ],
      marketing: [
        'Você precisa manter campanhas relevantes com retorno mensurável, e o gasto inútil é uma dor constante.',
        'A mensagem se dilui quando marca, PR, social e influenciadores não atuam alinhados, e o desalinhamento queima orçamento.',
        'A pressão por performance pode empurrar táticas de curto prazo que enfraquecem a marca e a receita futura.',
        'O volume criativo cresce, mas a confiança cai quando falta consistência, e confiança é difícil de recomprar.',
        'Ruído de atribuição dificulta escolhas de orçamento, e uma aposta errada pode esvaziar um trimestre.',
        'Risco de timing aumenta quando calendário de parceiros e realidade de canal não conversam, e um lançamento ruim é uma perda real.',
      ],
      digital: [
        'Você precisa elevar conversão sem comprometer o premium da jornada, e a fricção é uma perda de receita silenciosa.',
        'Complexidade de catálogo cria atrito no checkout se taxonomia e merchandising ficam confusos, e carrinhos abandonados custam dinheiro.',
        'As equipes pedem testes rápidos, mas sem governança surgem decisões de IA incoerentes que prejudicam a conversão.',
        'Há muitos dados, porém priorizar fica frágil quando sinais se contradizem, e prioridades erradas desperdiçam orçamento.',
        'A retenção cai quando jornadas de ciclo de vida saem sem ownership, e perder um cliente é perder receita.',
        'Dívida técnica corrói desempenho nos picos, e uma queda é uma perda de receita direta.',
      ],
      education: [
        'Espera-se que você aumente a empregabilidade sem reduzir o padrão, e uma turma fraca prejudica sua reputação.',
        'O alinhamento docente enfraquece quando o currículo muda mais rápido, e a inconsistência custa alunos.',
        'A progressão dos alunos fica irregular quando critérios não são consistentes, e maus resultados reduzem matrículas.',
        'O mercado pede talentos prontos, mas seu programa pode ficar para trás, e essa lacuna custa colocações.',
        'O planejamento acadêmico absorve pressão de orçamento sem perder mentoria, e uma mentoria subfinanciada prejudica sua imagem.',
        'A reputação sofre quando promessa e realidade divergem, e essa reputação é o seu verdadeiro capital.',
      ],
    },
    de: {
      creative: [
        'Sie sollen eine klare visuelle Handschrift schützen, während Trenddruck das Briefing ständig verschiebt, und jede Überarbeitung frisst still Ihre Marge.',
        'Kreativ-Reviews werden schnell politisch, und genau dieser Lärm verwässert Ihre besten Entscheidungen und verzögert umsatzkritische Starts.',
        'Kampagnentempo nimmt Raum für konzeptionelle Reife, obwohl gerade dort Qualität entsteht, während Budgets schrumpfen.',
        'Sie tragen Erwartungen aus Produkt, Marketing und Führung gleichzeitig, und ein einziger Fehltritt kostet eine ganze Saison.',
        'Wenn Referenzen ungefiltert wachsen, hängt die Teamkohärenz von Ihnen ab, und Rework wird zum stillen Umsatzverlust.',
        'Budgetdruck begrenzt Experimente genau dann, wenn der Markt Mut erwartet, und zwingt Sie, mehr mit weniger zu leisten.',
      ],
      content: [
        'Von Ihnen werden Premium-Visuals über mehrere Kanäle erwartet, ohne die Produktion zu überlasten, und Überstunden fressen Ihre Rentabilität.',
        'Späte Änderungen zerstören Shot-Logik und verursachen teure Schleifen in der Postproduktion, die Ihr Budget verbrennen.',
        'Narrative Kontinuität wird fragil, sobald Assets unter Tempo mehrfach umgebaut werden, und Inkonsistenz kostet Stammkunden.',
        'Sie balancieren filmischen Anspruch mit immer engeren Deadlines, und jede Verspätung bedeutet entgangenen Umsatz.',
        'Qualität sinkt schnell, wenn Handoffs zwischen Set, Schnitt und Brand unklar bleiben, und jeder Reshoot ist Geld aus Ihrer Tasche.',
        'Rechte, Nutzungsfenster und Freigaben verzögern Releases, und jeder Aufschub ist eine verpasste Geschäftschance.',
      ],
      talent: [
        'Sie bewerten Potenzial oft unter Unsicherheit, und ein vorschneller Call kann eine Laufbahn und Ihren Ruf prägen.',
        'Die Model-Readiness ist uneinheitlich, daher muss Entwicklung vor Buchungen starten, und eine schlechte Passung kostet einen Kunden.',
        'Sie navigieren Agenturdruck und schützen Würde und Bedingungen, und gebrochenes Vertrauen kann eine Beziehung über Nacht beenden.',
        'Der Wettbewerbsdruck trifft das Selbstvertrauen, und diese mentale Stabilität wirkt direkt auf Ihr Einkommen.',
        'Unklare Verträge und Bildrechte setzen Talente unnötigen Risiken aus, und Anwaltskosten sind ein echter Verlust.',
        'Scouting-Qualität fällt, wenn Tempo Beobachtung verdrängt, und eine schlechte Platzierung kostet eine wertvolle Empfehlung.',
      ],
      operations: [
        'Sie absorbieren Lieferantenschocks im Zeitplan und werden dennoch an Liefersicherheit gemessen, und jede Verspätung trifft Ihr Ergebnis.',
        'Kleine Qualitätsdrifts am Anfang werden am Ende zu teuren Ausfällen, und Rework ist ein direkter Verlust.',
        'Koordinationslücken zwischen Sourcing, Produktion und Logistik erzeugen Nacharbeit, die Ihre Marge auffrisst.',
        'Sie müssen Prozessdisziplin halten, auch wenn Dringlichkeit Abkürzungen fordert, und Abkürzungen kosten später mehr.',
        'Forecast-Wechsel destabilisieren Planung und erzwingen Reaktion, und reaktive Arbeit ist selten profitabel.',
        'Margendruck steigt, wenn technische Entscheidungen ohne Querschnittskontext fallen, und Sie zahlen den Preis.',
      ],
      marketing: [
        'Sie sollen Kampagnen relevant halten und messbaren Return liefern, und verschwendete Ausgaben sind ein ständiger Schmerz.',
        'Botschaften verwässern, wenn Brand, PR, Social und Influencer nicht in einer Logik laufen, und der Fehlabgleich verbrennt Budget.',
        'Performance-Druck fördert kurzfristige Taktiken, die den Markenwert und künftige Erlöse schwächen.',
        'Kreativvolumen wächst, aber Audience-Vertrauen sinkt bei Inkonsistenz, und Vertrauen ist schwer zurückzukaufen.',
        'Attributionsrauschen erschwert Budgetentscheidungen, und eine falsche Wette kann ein Quartal leeren.',
        'Timing-Risiken steigen, wenn Partnerkalender nicht zur Kanalrealität passen, und ein schlechter Launch ist ein echter Verlust.',
      ],
      digital: [
        'Sie müssen Conversion steigern, ohne das Premium-Gefühl der Journey zu verlieren, und Reibung ist ein stiller Umsatzverlust.',
        'Katalogkomplexität erzeugt Checkout-Reibung, wenn Taxonomie und Merchandising unklar bleiben, und abgebrochene Warenkörbe kosten Geld.',
        'Teams verlangen schnelle Tests, doch ohne Governance entstehen inkonsistente AI-Entscheidungen, die der Conversion schaden.',
        'Daten sind reichlich vorhanden, aber Priorisierung wird fragil, wenn Signale widersprüchlich sind, und falsche Prioritäten verschwenden Budget.',
        'Retention leidet, wenn Lifecycle-Journeys ohne Ownership starten, und ein verlorener Kunde ist verlorener Umsatz.',
        'Technische Schulden erodieren Performance in Peaks, und ein Ausfall ist ein direkter Umsatzverlust.',
      ],
      education: [
        'Von Ihnen wird erwartet, die Beschäftigungsfähigkeit zu erhöhen, ohne Standards zu senken, und ein schwacher Jahrgang schadet Ihrem Ruf.',
        'Dozierenden-Ausrichtung wird fragil, wenn Curriculum-Updates schneller laufen, und Inkonsistenz kostet Studierende.',
        'Lernfortschritte werden uneinheitlich, wenn Bewertungsmaßstäbe nicht konsistent sind, und schwache Ergebnisse senken Einschreibungen.',
        'Branchenpartner erwarten job-ready Talente, aber Ihr Programm kann zurückfallen, und diese Lücke kostet Platzierungen.',
        'Akademische Planung steht unter Budgetdruck, ohne Mentoring zu verlieren, und unterfinanziertes Mentoring schadet Ihrem Image.',
        'Die Schulreputation leidet, wenn Versprechen und Realität auseinanderlaufen, und dieser Ruf ist Ihr wahres Kapital.',
      ],
    },
  };

  const localePool = challengePoolByLocale[language] || challengePoolByLocale.en;
  const modelChallengePoolByLocale = {
    en: [
      'You are expected to look effortless, even when your body is exhausted by repeated takes and travel.',
      'You are often told to adapt instantly, while still keeping your identity visible in every frame.',
      'You are managing rejection cycles quietly, even when confidence has to stay visible on the outside.',
      'You are balancing body image pressure with the need to stay healthy, focused, and emotionally steady.',
      'You are navigating unclear usage rights, and one unchecked clause can cost you long-term control of your image.',
      'You are asked to be flexible with time, but last-minute shifts can disrupt your preparation and consistency.',
    ],
    fr: [
      'Vous devez paraître fluide, même quand votre corps est fatigué par les répétitions et les déplacements.',
      'Vous devez vous adapter immédiatement tout en gardant votre identité lisible dans chaque image.',
      'Vous traversez des cycles de refus en silence, alors que la confiance doit rester visible.',
      'Vous gérez la pression sur l\'image du corps tout en restant en bonne santé et concentrée.',
      'Vous faites face à des droits d\'usage parfois flous, et une clause mal lue peut coûter cher plus tard.',
      'On attend de vous une grande flexibilité horaire, mais les changements tardifs cassent votre préparation.',
    ],
    es: [
      'Se espera que te veas natural, incluso cuando tu cuerpo está cansado por repeticiones y viajes.',
      'Te piden adaptarte en segundos sin perder tu identidad en cada toma.',
      'Gestionas ciclos de rechazo en silencio, aunque por fuera debas mantener seguridad constante.',
      'Llevas presión sobre imagen corporal mientras intentas sostener salud física y estabilidad mental.',
      'Te enfrentas a derechos de uso poco claros, y una cláusula mal revisada puede afectar tu futuro.',
      'Se espera flexibilidad total de horarios, pero cambios de último minuto rompen tu preparación.',
    ],
    it: [
      'Ti viene chiesto di apparire naturale anche quando il corpo è stanco per prove e spostamenti continui.',
      'Devi adattarti in pochi secondi senza perdere la tua identità in ogni scatto.',
      'Gestisci cicli di rifiuto in silenzio, anche quando all\'esterno devi mantenere sicurezza.',
      'Sostieni pressione sull\'immagine corporea cercando allo stesso tempo salute e stabilità mentale.',
      'Affronti diritti d\'uso poco chiari, e una clausola non verificata può pesare sul tuo futuro.',
      'Ti viene chiesta piena flessibilità di orario, ma i cambi tardivi spezzano la preparazione.',
    ],
    pt: [
      'Esperam que você pareça leve, mesmo quando o corpo está cansado por repetição e deslocamento.',
      'Pedem adaptação imediata sem que você perca sua identidade em cada imagem.',
      'Você atravessa ciclos de rejeição em silêncio, mantendo segurança por fora o tempo todo.',
      'Você lida com pressão sobre imagem corporal enquanto tenta preservar saúde e equilíbrio emocional.',
      'Direitos de uso nem sempre vêm claros, e uma cláusula mal lida pode afetar seu futuro.',
      'Esperam flexibilidade total de horário, mas mudanças tardias quebram sua preparação.',
    ],
    de: [
      'Von Ihnen wird Leichtigkeit erwartet, auch wenn Ihr Körper durch Wiederholungen und Reisen erschöpft ist.',
      'Sie sollen sich sofort anpassen, ohne Ihre eigene Identität in jedem Bild zu verlieren.',
      'Sie tragen Ablehnungsphasen oft still, obwohl nach außen konstantes Selbstvertrauen erwartet wird.',
      'Sie stehen unter Druck beim Körperbild und müssen zugleich Gesundheit und innere Stabilität halten.',
      'Nutzungsrechte sind nicht immer klar, und eine übersehene Klausel kann langfristig teuer werden.',
      'Von Ihnen wird volle zeitliche Flexibilität erwartet, doch späte Änderungen stören Ihre Vorbereitung.',
    ],
  };

  const trackPool = isModelProfile
    ? (modelChallengePoolByLocale[language] || modelChallengePoolByLocale.en)
    : (localePool[roleTrack] || localePool.creative);
  const profileOffset = Math.max(0, Number(profileId || 1) - 1) % trackPool.length;
  const rotatedTrackPool = [...trackPool.slice(profileOffset), ...trackPool.slice(0, profileOffset)];

  const sourceNarrativePool = language === 'en'
    ? sourceChallenges.filter((line) => /[.!?]/.test(line) && line.split(' ').length >= 8).slice(0, 2)
    : [];

  const contextTailByLocale = {
    en: [
      `You are still expected to lead ${context.mission} without losing consistency under scrutiny.`,
      `Your decisions around ${context.operating} directly shape ${context.impact}.`,
    ],
    fr: [
      `On attend pourtant de vous que ${context.mission} reste solide, même sous forte exposition.`,
      `Vos choix sur ${context.operating} influencent directement ${context.impact}.`,
    ],
    es: [
      `Aun así, se espera que sostengas ${context.mission} con consistencia, incluso bajo presión.`,
      `Tus decisiones sobre ${context.operating} influyen directamente en ${context.impact}.`,
    ],
    it: [
      `Nonostante questo, ci si aspetta che tu mantenga ${context.mission} con continuità e lucidità.`,
      `Le tue scelte su ${context.operating} incidono direttamente su ${context.impact}.`,
    ],
    pt: [
      `Mesmo assim, espera-se que você sustente ${context.mission} com consistência e presença.`,
      `Suas decisões sobre ${context.operating} influenciam diretamente ${context.impact}.`,
    ],
    de: [
      `Gleichzeitig wird erwartet, dass Sie ${context.mission} auch unter Druck verlässlich tragen.`,
      `Ihre Entscheidungen zu ${context.operating} prägen direkt ${context.impact}.`,
    ],
  };

  const contextTail = contextTailByLocale[language] || contextTailByLocale.en;
  const modelTailByLocale = {
    en: [
      'You are still expected to stay grounded, prepared, and fully present, even on days that feel emotionally heavy.',
      'You are building consistency through routine, recovery, and clear boundaries so your performance can hold over time.',
    ],
    fr: [
      'Vous êtes quand même attendue sur une présence solide, même les jours où la charge émotionnelle est forte.',
      'Vous construisez votre régularité avec des routines, de la récupération et des limites claires pour durer.',
    ],
    es: [
      'Aun así, se espera de ti presencia, preparación y calma, incluso en días emocionalmente pesados.',
      'Vas construyendo constancia con rutina, recuperación y límites claros para sostener tu nivel en el tiempo.',
    ],
    it: [
      'Anche così, ci si aspetta da te presenza, preparazione e lucidità, anche nei giorni più carichi.',
      'Stai costruendo continuità con routine, recupero e confini chiari, così la tua performance resta stabile.',
    ],
    pt: [
      'Mesmo assim, esperam de você presença, preparo e calma, até nos dias emocionalmente mais pesados.',
      'Você está construindo constância com rotina, recuperação e limites claros para sustentar sua performance.',
    ],
    de: [
      'Trotzdem wird von Ihnen Präsenz, Vorbereitung und innere Ruhe erwartet, auch an belastenden Tagen.',
      'Sie bauen Konstanz über Routine, Erholung und klare Grenzen auf, damit Ihre Leistung langfristig stabil bleibt.',
    ],
  };
  const activeTail = isModelProfile ? (modelTailByLocale[language] || modelTailByLocale.en) : contextTail;
  const rawChallenges = [...sourceNarrativePool, ...rotatedTrackPool, ...activeTail]
    .filter(Boolean)
    .filter((line) => !isCrossRoleLeakLine(line))
    .filter((line, index, all) => all.findIndex((item) => item.toLowerCase() === line.toLowerCase()) === index)
    .slice(0, 8);
  const challengeOpeners = {
    en: [
      'You are probably feeling this in real life:',
      'You are not imagining it, this pressure is real:',
      'You are usually making hard calls around this point:',
      'You are most exposed to friction when this happens:',
      'You are likely losing momentum when this repeats:',
      'You are seeing this pattern come back again:',
      'You are right to treat this as an early warning:',
      'You are carrying more than people see when this keeps happening:',
    ],
    fr: [
      'Dans votre quotidien, cela apparaît souvent ainsi :',
      'Une pression récurrente du rôle ressemble à ceci :',
      'Vos arbitrages les plus délicats tournent souvent autour de :',
      'Dans les moments sensibles, la friction démarre souvent ici :',
      'Vous sentez le rythme ralentir quand ceci revient :',
      'Un schéma difficile qui se répète prend souvent cette forme :',
      'Un signal d’alerte à traiter tôt est le suivant :',
      'Votre solidité est la plus testée quand cela devient fréquent :',
    ],
    es: [
      'En tu día a día, esto suele aparecer así:',
      'Una presión recurrente del rol se parece a esto:',
      'Tus decisiones más delicadas suelen girar alrededor de esto:',
      'En momentos de alta exigencia, la fricción suele empezar aquí:',
      'Sientes que el ritmo cae cuando vuelve esto:',
      'Un patrón difícil que se repite para ti toma esta forma:',
      'Una señal de alerta que conviene atender pronto es esta:',
      'Tu resiliencia se pone a prueba cuando esto se vuelve frecuente:',
    ],
    it: [
      'Nel tuo quotidiano, questa realtà appare spesso così:',
      'Una pressione ricorrente del ruolo prende questa forma:',
      'Le decisioni più delicate ruotano spesso attorno a questo:',
      'Nei momenti ad alta intensità, l’attrito inizia spesso qui:',
      'Senti il ritmo rallentare quando ritorna questo scenario:',
      'Un pattern difficile che si ripete è il seguente:',
      'Un campanello d’allarme da intercettare presto è questo:',
      'La tua tenuta viene testata quando questo diventa frequente:',
    ],
    pt: [
      'No seu dia a dia, isso costuma aparecer assim:',
      'Uma pressão recorrente do papel se apresenta assim:',
      'Suas decisões mais delicadas geralmente giram em torno disto:',
      'Nos momentos de alta exigência, o atrito costuma começar aqui:',
      'Você sente o ritmo cair quando isso volta a acontecer:',
      'Um padrão difícil que se repete para você é este:',
      'Um sinal de alerta para tratar cedo é o seguinte:',
      'Sua resiliência é mais testada quando isso vira recorrente:',
    ],
    de: [
      'In Ihrem Alltag zeigt sich das oft so:',
      'Ein wiederkehrender Druckpunkt in dieser Rolle sieht so aus:',
      'Ihre schwierigsten Entscheidungen drehen sich häufig um Folgendes:',
      'In besonders kritischen Phasen beginnt Reibung oft hier:',
      'Sie spüren Tempoverlust, wenn dieses Muster wieder auftaucht:',
      'Ein schwieriges Muster, das sich wiederholt, hat oft diese Form:',
      'Ein Frühwarnsignal, das Sie früh adressieren sollten, ist dieses:',
      'Ihre Belastbarkeit wird getestet, wenn das regelmäßig passiert:',
    ],
  };
  const openers = challengeOpeners[language] || challengeOpeners.en;
  const mergedChallenges = rawChallenges.map((line, index) => `${openers[index % openers.length]} ${polishShortLine(cleanLine(line), language)}`);

  const concernPhrase = normalizeClause(context.pressure) || context.pressure;

  const servicesByLocale = {
    en: [
      { title: 'Cartésiennes', body: `Cartésiennes offers an immersive online reading experience shaped for your ${roleName} reality, helping you stay with the trends and insights that matter most to you.` },
      { title: 'EOEX Studio', body: `EOEX Studio supports your team with an end-to-end production flow that protects identity, timing, and financial control during high-pressure delivery cycles.` },
      { title: 'MEZENE', body: `MEZENE connects your profile with agency capacity that fits your sector and level, so growth does not stall when workload and expectations increase.` },
      { title: 'Ariella', body: `Ariella gives you practical workshops and mentoring to turn complex situations into confident decisions you can sustain over time.` },
    ],
    fr: [
      { title: 'Cartésiennes', body: `Cartésiennes propose une expérience de lecture en ligne immersive, pensée pour votre réalité de ${roleName}, afin de vous concentrer sur les tendances et insights qui comptent le plus pour vous.` },
      { title: 'EOEX Studio', body: `EOEX Studio accompagne votre équipe avec un flux de production complet qui protège identité, délais et maîtrise des coûts dans les cycles de livraison sous tension.` },
      { title: 'MEZENE', body: `MEZENE relie votre profil à une capacité d'agence alignée sur votre secteur et votre niveau, afin que la progression ne se bloque pas quand la charge augmente.` },
      { title: 'Ariella', body: `Ariella vous apporte ateliers pratiques et mentorat pour transformer des situations complexes en décisions solides et durables.` },
    ],
    es: [
      { title: 'Cartésiennes', body: `Cartésiennes ofrece una experiencia de lectura online inmersiva, diseñada para tu realidad como ${roleName}, para que sigas las tendencias e insights que más te importan.` },
      { title: 'EOEX Studio', body: `EOEX Studio acompaña a tu equipo con un flujo end-to-end que protege identidad, tiempos y control de costes durante ciclos de entrega exigentes.` },
      { title: 'MEZENE', body: `MEZENE conecta tu perfil con capacidad de agencia adecuada a tu sector y nivel, para que el crecimiento no se frene cuando aumenta la carga de trabajo.` },
      { title: 'Ariella', body: `Ariella te aporta talleres prácticos y mentoría para convertir situaciones complejas en decisiones firmes y sostenibles.` },
    ],
    it: [
      { title: 'Cartésiennes', body: `Cartésiennes offre un'esperienza di lettura online immersiva, costruita sulla tua realtà di ${roleName}, per aiutarti a seguire trend e insight davvero rilevanti per te.` },
      { title: 'EOEX Studio', body: `EOEX Studio supporta il team con un flusso end-to-end che protegge identità, tempi e controllo costi durante cicli di consegna ad alta intensità.` },
      { title: 'MEZENE', body: `MEZENE collega il tuo profilo a una capacità agenzia coerente con settore e livello, così la crescita non si blocca quando il carico aumenta.` },
      { title: 'Ariella', body: `Ariella ti offre workshop pratici e mentoring per trasformare situazioni complesse in decisioni solide e sostenibili.` },
    ],
    pt: [
      { title: 'Cartésiennes', body: `Cartésiennes oferece uma experiência de leitura online imersiva, pensada para a sua realidade de ${roleName}, ajudando você a acompanhar as tendências e insights que mais importam.` },
      { title: 'EOEX Studio', body: `EOEX Studio apoia seu time com um fluxo end-to-end que protege identidade, prazo e controle financeiro em ciclos de entrega mais exigentes.` },
      { title: 'MEZENE', body: `MEZENE conecta seu perfil à capacidade de agência adequada ao seu setor e nível, para que o crescimento não trave quando a carga aumenta.` },
      { title: 'Ariella', body: `Ariella oferece workshops práticos e mentoria para transformar situações complexas em decisões firmes e sustentáveis.` },
    ],
    de: [
      { title: 'Cartésiennes', body: `Cartésiennes bietet ein immersives Online-Leseerlebnis, das auf Ihre Realität als ${roleName} abgestimmt ist, damit Sie die Trends und Insights verfolgen, die für Sie am wichtigsten sind.` },
      { title: 'EOEX Studio', body: `EOEX Studio unterstützt Ihr Team mit einem End-to-End-Produktionsfluss, der Identität, Timing und finanzielle Kontrolle auch in intensiven Lieferzyklen schützt.` },
      { title: 'MEZENE', body: `MEZENE verbindet Ihr Profil mit Agenturkapazität, die zu Sektor und Level passt, damit Wachstum bei steigender Last nicht ins Stocken gerät.` },
      { title: 'Ariella', body: `Ariella bietet praxisnahe Workshops und Mentoring, um komplexe Situationen in tragfähige und belastbare Entscheidungen zu übersetzen.` },
    ],
  };
  const services = servicesByLocale[language] || servicesByLocale.en;

  const responsibilitySignals = extractRoleSignals(profileLines)
    .map((line) => normalizeClause(line))
    .filter((line) => line && !isLikelyArtifactLine(line) && !isNoisyResponsibilitySignal(line) && line.split(' ').length >= 4)
    .slice(0, 5);
  const roleLower = `${roleName} ${roleReferenceEn || ''}`.toLowerCase();
  const isModellingSchoolDirector = /modelling school director|modeling school director/.test(roleLower);
  const isDesignSchoolDirector = /fashion design school director|design school director/.test(roleLower);
  const roleReference = String(roleReferenceEn || roleName || '').toLowerCase();

  const rolePersona = (() => {
    if (/makeup artist/.test(roleReference)) return 'makeup';
    if (/hair stylist|hairdresser/.test(roleReference)) return 'hair';
    if (/fashion editor/.test(roleReference)) return 'editor';
    if (/casting director/.test(roleReference)) return 'casting';
    if (/model booker|booker|booking agent/.test(roleReference)) return 'booker';
    if (/talent manager/.test(roleReference)) return 'talentManager';
    return null;
  })();

  const fallbackResponsibilitiesByTrack = {
    en: {
      creative: ['brand signature governance across collections and campaigns', 'cross-functional creative decision alignment under deadline pressure', 'quality arbitration between concept ambition and execution feasibility', 'creative team direction with measurable standards', 'innovation sequencing without brand dilution'],
      content: ['end-to-end production continuity from brief to final cut', 'platform adaptation without narrative fragmentation', 'post-production quality gates and rework prevention', 'rights and usage governance before publication', 'crew coordination under compressed timelines'],
      talent: ['casting quality standards and readiness evaluation', 'career protection through rights and contract awareness', 'development sequencing before high-visibility exposure', 'agency and brand partner alignment', 'ethical scouting with long-term pathway logic'],
      operations: ['supplier and production handoff reliability', 'quality control checkpoints before final delivery', 'risk containment in planning and execution', 'cost discipline without quality collapse', 'cross-team process visibility and accountability'],
      marketing: ['campaign messaging coherence across channels', 'audience growth tied to measurable conversion outcomes', 'brand-PR-social synchronization under launch pressure', 'budget arbitration with attribution uncertainty', 'long-term brand equity protection'],
      digital: ['commerce-flow optimization with premium UX consistency', 'catalog governance and merchandising clarity', 'data prioritization across conflicting channel signals', 'retention lifecycle orchestration with clear ownership', 'AI usage governance in CX experimentation'],
      education: ['curriculum governance aligned with current industry standards', 'faculty coordination around shared evaluation criteria', 'student progression monitoring with intervention checkpoints', 'industry partnerships tied to employability outcomes', 'academic planning that protects mentoring quality and school reputation'],
    },
  };

  const roleSpecificResponsibilitiesByLocale = {
    makeup: {
      en: ['skin prep reliability under show-time pressure', 'look translation from moodboard to camera-ready finish', 'hygiene discipline and product performance across long set days', 'fast correction workflows between fittings, shooting, and runway', 'coordination with hair, styling, and photography for visual coherence'],
      fr: ['fiabilité de la préparation peau sous pression de timing', 'traduction des moodboards en finitions caméra impeccables', 'discipline d’hygiène et tenue des produits sur longues journées plateau', 'corrections rapides entre fitting, shooting et défilé', 'coordination avec coiffure, stylisme et photo pour une cohérence visuelle'],
      es: ['fiabilidad en preparación de piel bajo presión de tiempos', 'traducción de moodboards a acabados listos para cámara', 'disciplina de higiene y rendimiento de producto en jornadas largas', 'correcciones rápidas entre fitting, shooting y pasarela', 'coordinación con peluquería, estilismo y fotografía para coherencia visual'],
      it: ['affidabilità della preparazione pelle sotto pressione tempi', 'traduzione dei moodboard in finiture pronte per camera', 'disciplina igienica e resa prodotto su giornate set lunghe', 'correzioni rapide tra fitting, shooting e passerella', 'coordinamento con hair, styling e fotografia per coerenza visiva'],
      pt: ['confiabilidade na preparação de pele sob pressão de tempo', 'tradução de moodboards para acabamento pronto para câmera', 'disciplina de higiene e performance de produto em set prolongado', 'correções rápidas entre fitting, shooting e passarela', 'coordenação com cabelo, styling e fotografia para coerência visual'],
      de: ['verlässliche Hautvorbereitung unter hohem Zeitdruck', 'präzise Übersetzung von Moodboards in kamerataugliche Looks', 'Hygienedisziplin und Produktleistung über lange Set-Tage', 'schnelle Korrekturroutinen zwischen Fitting, Shooting und Laufsteg', 'Abstimmung mit Hair, Styling und Foto für visuelle Kohärenz'],
    },
    hair: {
      en: ['hair structure durability under lights, humidity, and long schedules', 'look consistency across runway, e-commerce, and editorial outputs', 'rapid restyle execution between scenes and model rotations', 'tool hygiene and heat-protection standards under production pressure', 'synchronization with makeup and styling to preserve brand image'],
      fr: ['tenue de la structure coiffure sous lumière, humidité et longues amplitudes', 'cohérence des looks entre défilé, e-commerce et éditorial', 'exécution rapide des retouches entre scènes et rotations modèles', 'hygiène des outils et protection thermique sous pression de production', 'synchronisation avec maquillage et stylisme pour protéger l’image de marque'],
      es: ['durabilidad de la estructura de peinado bajo focos, humedad y jornadas largas', 'consistencia de look entre pasarela, e-commerce y editorial', 'ejecución rápida de retoques entre escenas y rotación de modelos', 'higiene de herramientas y protección térmica bajo presión de producción', 'sincronización con maquillaje y estilismo para sostener la imagen de marca'],
      it: ['tenuta della struttura capelli sotto luci, umidità e turni lunghi', 'coerenza look tra passerella, e-commerce ed editoriale', 'ritocchi rapidi tra scene e rotazioni modelli', 'igiene strumenti e protezione termica sotto pressione produttiva', 'sincronizzazione con make-up e styling per proteggere l’immagine di marca'],
      pt: ['durabilidade da estrutura de cabelo sob luz, umidade e jornadas longas', 'consistência de look entre passarela, e-commerce e editorial', 'retoques rápidos entre cenas e rotação de modelos', 'higiene de ferramentas e proteção térmica sob pressão de produção', 'sincronia com maquiagem e styling para preservar imagem de marca'],
      de: ['Haltbarkeit der Frisurstruktur unter Licht, Feuchtigkeit und langen Schichten', 'Look-Konsistenz zwischen Laufsteg, E-Commerce und Editorial', 'schnelle Restyle-Abläufe zwischen Szenen und Modelwechseln', 'Werkzeughygiene und Hitzeschutzstandards unter Produktionsdruck', 'Abstimmung mit Make-up und Styling zur Sicherung des Markenbildes'],
    },
    editor: {
      en: ['editorial angle clarity tied to brand and audience intent', 'content sequencing across print, digital, and social deadlines', 'fact-check and style consistency under compressed publishing cycles', 'coordination between creative, commerce, and PR narratives', 'headline and visual framing decisions with measurable engagement outcomes'],
      fr: ['clarté de l’angle éditorial alignée marque et audience', 'séquencement des contenus entre print, digital et social sous délais', 'fact-checking et cohérence de style en cycle de publication tendu', 'coordination entre récits créatifs, business et PR', 'choix de titrage et cadrage visuel avec impact mesurable'],
      es: ['claridad del enfoque editorial alineado con marca y audiencia', 'secuenciación de contenidos entre print, digital y social con plazos cortos', 'verificación factual y coherencia de estilo en ciclos de publicación exigentes', 'coordinación entre narrativa creativa, comercial y PR', 'decisiones de titular y encuadre visual con impacto medible'],
      it: ['chiarezza dell’angolo editoriale allineato a marca e audience', 'sequenziamento contenuti tra print, digitale e social con scadenze strette', 'verifica dei fatti e coerenza stilistica in cicli editoriali compressi', 'coordinamento tra narrativa creativa, commerciale e PR', 'scelte di titolazione e inquadramento visivo con impatto misurabile'],
      pt: ['clareza do ângulo editorial alinhado à marca e à audiência', 'sequenciamento de conteúdo entre print, digital e social com prazos curtos', 'checagem factual e consistência de estilo em ciclos editoriais comprimidos', 'coordenação entre narrativa criativa, comercial e PR', 'decisões de manchete e enquadramento visual com impacto mensurável'],
      de: ['klare redaktionelle Perspektive im Einklang mit Marke und Zielgruppe', 'Content-Sequenzierung über Print, Digital und Social unter Termindruck', 'Faktenprüfung und Stilkonsistenz in verdichteten Publikationszyklen', 'Abstimmung zwischen kreativer, kommerzieller und PR-Erzählung', 'Headline- und Bildentscheidungen mit messbarer Engagement-Wirkung'],
    },
    casting: {
      en: ['casting shortlists that balance aesthetics, fit, and campaign intent', 'availability and option management under rapid client turnarounds', 'brief alignment between clients, agencies, and creative teams', 'callback quality control and communication rhythm', 'rights, usage, and contract clarity before final bookings'],
      fr: ['shortlists casting équilibrant esthétique, adéquation et intention campagne', 'gestion disponibilités et options sous délais client courts', 'alignement du brief entre clients, agences et équipes créatives', 'qualité des callbacks et rythme de communication', 'clarté droits, usages et contrats avant booking final'],
      es: ['shortlists de casting que equilibran estética, ajuste e intención de campaña', 'gestión de disponibilidad y opciones con plazos de cliente muy cortos', 'alineación de brief entre clientes, agencias y equipos creativos', 'control de calidad en callbacks y ritmo de comunicación', 'claridad de derechos, uso y contratos antes del booking final'],
      it: ['shortlist casting che bilanciano estetica, aderenza e intenzione campagna', 'gestione disponibilità e opzioni con tempi cliente stretti', 'allineamento brief tra clienti, agenzie e team creativi', 'qualità dei callback e ritmo comunicativo', 'chiarezza su diritti, utilizzi e contratti prima del booking finale'],
      pt: ['shortlists de casting que equilibram estética, ajuste e intenção de campanha', 'gestão de disponibilidade e opções sob prazo curto de cliente', 'alinhamento de brief entre cliente, agência e equipe criativa', 'controle de qualidade de callbacks e ritmo de comunicação', 'clareza de direitos, uso e contratos antes do booking final'],
      de: ['Casting-Shortlists mit Balance aus Ästhetik, Passung und Kampagnenziel', 'Verfügbarkeits- und Optionssteuerung bei schnellen Kundenzyklen', 'Brief-Abstimmung zwischen Kunden, Agenturen und Kreativteams', 'Qualitätssicherung bei Callbacks und Kommunikationsrhythmus', 'klare Rechte-, Nutzungs- und Vertragslage vor finalen Buchungen'],
    },
    booker: {
      en: ['booking calendar precision across castings, fittings, and show dates', 'rate and usage negotiation with margin protection', 'conflict resolution for overlapping client demands', 'travel and logistics reliability for talent placement', 'post-booking follow-through on invoicing and contractual obligations'],
      fr: ['précision du calendrier booking entre castings, fittings et défilés', 'négociation des tarifs et usages avec protection de marge', 'résolution des conflits de planning entre demandes clients', 'fiabilité travel et logistique pour la mise en place talent', 'suivi post-booking sur facturation et obligations contractuelles'],
      es: ['precisión del calendario de booking entre castings, fittings y desfiles', 'negociación de tarifas y usos con protección de margen', 'resolución de conflictos por demandas de clientes superpuestas', 'fiabilidad en viajes y logística para colocación del talento', 'seguimiento post-booking sobre facturación y obligaciones contractuales'],
      it: ['precisione del calendario booking tra casting, fitting e date sfilata', 'negoziazione tariffe e utilizzi con protezione margine', 'risoluzione conflitti tra richieste cliente sovrapposte', 'affidabilità travel e logistica per il placement talenti', 'follow-up post-booking su fatturazione e obblighi contrattuali'],
      pt: ['precisão do calendário de booking entre castings, fittings e desfiles', 'negociação de tarifas e uso com proteção de margem', 'resolução de conflitos entre demandas simultâneas de clientes', 'confiabilidade de viagem e logística para alocação de talentos', 'acompanhamento pós-booking de faturamento e obrigações contratuais'],
      de: ['präzise Buchungsplanung über Castings, Fittings und Show-Termine', 'Honorar- und Nutzungsverhandlung mit Margenschutz', 'Konfliktlösung bei überlappenden Kundenanforderungen', 'verlässliche Reise- und Logistiksteuerung für Talent-Einsätze', 'Nachverfolgung nach Buchung bei Abrechnung und Vertragspflichten'],
    },
    talentManager: {
      en: ['long-term talent development planning across market cycles', 'brand-fit deal selection versus short-term visibility pressure', 'well-being and workload balancing for sustainable performance', 'cross-market positioning with agency and client ecosystems', 'rights, reputation, and risk governance over multi-season growth'],
      fr: ['planification long terme du développement talent sur cycles de marché', 'sélection de deals alignés marque face à la pression de visibilité immédiate', 'équilibre charge et bien-être pour une performance durable', 'positionnement multi-marchés avec agences et clients', 'gouvernance droits, réputation et risques sur la progression de saison'],
      es: ['planificación de desarrollo de talento a largo plazo por ciclos de mercado', 'selección de acuerdos alineados con marca frente a presión de visibilidad inmediata', 'equilibrio entre carga y bienestar para rendimiento sostenible', 'posicionamiento en varios mercados con agencias y clientes', 'gobernanza de derechos, reputación y riesgo en crecimiento por temporadas'],
      it: ['pianificazione di sviluppo talenti nel lungo periodo sui cicli di mercato', 'selezione dei deal in coerenza marca contro pressione di visibilità immediata', 'equilibrio carico-benessere per una performance sostenibile', 'posizionamento multi-mercato con ecosistema agenzie e clienti', 'governance su diritti, reputazione e rischio nella crescita stagionale'],
      pt: ['planejamento de desenvolvimento de talentos no longo prazo por ciclos de mercado', 'seleção de acordos alinhados à marca frente à pressão de visibilidade imediata', 'equilíbrio entre carga e bem-estar para desempenho sustentável', 'posicionamento multi-mercado com ecossistema de agências e clientes', 'governança de direitos, reputação e risco em crescimento por temporadas'],
      de: ['langfristige Talententwicklung über unterschiedliche Marktzyklen', 'Deal-Auswahl nach Markenfit trotz kurzfristigem Sichtbarkeitsdruck', 'Balance von Auslastung und Wohlbefinden für nachhaltige Leistung', 'marktübergreifende Positionierung mit Agentur- und Kundenökosystem', 'Rechte-, Reputations- und Risikosteuerung über mehrsaisoniges Wachstum'],
    },
  };

  const roleSpecificPoolByLocale = rolePersona ? roleSpecificResponsibilitiesByLocale[rolePersona] : null;
  const roleSpecificPool = roleSpecificPoolByLocale
    ? (roleSpecificPoolByLocale[language] || roleSpecificPoolByLocale.en || [])
    : [];

  const baseResponsibilityPool = responsibilitySignals.length > 0
    ? responsibilitySignals
    : (fallbackResponsibilitiesByTrack.en[roleTrack] || fallbackResponsibilitiesByTrack.en.creative);

  const responsibilityPool = roleSpecificPool.length
    ? dedupeSimilarLines([...roleSpecificPool, ...baseResponsibilityPool])
    : baseResponsibilityPool;

  const responsibilityBenefitTemplates = {
    en: [
      (text) => `When "${text}" gets heavy, we help you turn it into a routine your team can execute without chaos.`,
      (text) => `You leave with a clearer operating playbook for "${text}", so decisions stop bouncing between teams.`,
      (text) => `We translate "${text}" into practical checkpoints you can apply week after week.`,
      (text) => `You will know exactly how to handle "${text}" with less friction and better decision quality.`,
    ],
    fr: [
      (text) => `Quand « ${text} » devient lourd, nous le transformons en routine que votre équipe peut vraiment tenir.`,
      (text) => `Vous repartez avec un cadre plus clair sur « ${text} », pour éviter les arbitrages qui tournent en boucle.`,
      (text) => `Nous traduisons « ${text} » en checkpoints concrets, applicables semaine après semaine.`,
      (text) => `Vous saurez traiter « ${text} » avec moins de friction et des décisions plus nettes.`,
    ],
    es: [
      (text) => `Cuando « ${text} » se vuelve pesado, lo convertimos en una rutina que tu equipo puede sostener.`,
      (text) => `Sales con una guía más clara para « ${text} », evitando decisiones que se reciclan sin avanzar.`,
      (text) => `Traducimos « ${text} » en checkpoints prácticos que puedes usar cada semana.`,
      (text) => `Vas a manejar « ${text} » con menos fricción y con decisiones más sólidas.`,
    ],
    it: [
      (text) => `Quando « ${text} » pesa davvero, lo trasformiamo in una routine che il team riesce a sostenere.`,
      (text) => `Esci con una guida più chiara su « ${text} », così le decisioni non rimbalzano tra funzioni.`,
      (text) => `Traduciamo « ${text} » in checkpoint pratici da usare ogni settimana.`,
      (text) => `Saprai gestire « ${text} » con meno attrito e decisioni più solide.`,
    ],
    pt: [
      (text) => `Quando « ${text} » pesa no dia a dia, transformamos isso em rotina que o time consegue sustentar.`,
      (text) => `Você sai com um guia mais claro para « ${text} », sem decisões que ficam indo e voltando.`,
      (text) => `Traduzimos « ${text} » em checkpoints práticos para usar toda semana.`,
      (text) => `Você passa a lidar com « ${text} » com menos atrito e decisões mais firmes.`,
    ],
    de: [
      (text) => `Wenn « ${text} » im Alltag schwer wird, übersetzen wir es in eine Routine, die Ihr Team wirklich tragen kann.`,
      (text) => `Sie erhalten ein klareres Vorgehen für « ${text} », damit Entscheidungen nicht zwischen Teams hängen bleiben.`,
      (text) => `Wir machen aus « ${text} » praktische Checkpoints, die sich Woche für Woche anwenden lassen.`,
      (text) => `So steuern Sie « ${text} » mit weniger Reibung und belastbareren Entscheidungen.`,
    ],
  };

  const aiBenefitsByLocale = {
    en: {
      creative: [
        `Use EOEX AI workflows to compare creative directions faster in your ${roleName} practice while keeping final authorship decisions human.`,
        'Convert critique notes into structured AI summaries so teams align earlier and revision loops shrink.',
        'Run AI pre-checks on rights, delivery risk, and handoffs before launch, then keep final sign-off human.',
      ],
      content: [
        `Use EOEX AI workflows to speed up shot planning and edit prep in your ${roleName} process without losing your visual language.`,
        'Use AI-assisted cut comparison to detect pacing, continuity, and framing issues before client review.',
        'Automate transcript, subtitle, and usage-rights pre-checks with AI while keeping final narrative decisions human.',
      ],
      talent: [
        `Use EOEX AI workflows to triage portfolios and casting signals in your ${roleName} pipeline while keeping potential-assessment human.`,
        'Transform feedback logs into AI-prioritized development plans so progression becomes measurable and fair.',
        'Use AI contract scans to flag rights risks early, then keep final career and agency decisions human-led.',
      ],
      operations: [
        `Use EOEX AI workflows to anticipate production bottlenecks in your ${roleName} operations before timing or quality drops.`,
        'Automate exception tracking across suppliers, samples, and delivery checkpoints to reduce firefighting cycles.',
        'Deploy AI alerts for cost drift and compliance exposure while keeping final trade-off decisions human.',
      ],
      marketing: [
        `Use EOEX AI workflows to test campaign-message variants in your ${roleName} roadmap while preserving brand-voice authority.`,
        'Use AI attribution snapshots to rebalance channel spend earlier, before momentum declines.',
        'Automate audience-signal clustering with AI and keep final positioning decisions human-led.',
      ],
      digital: [
        `Use EOEX AI workflows to prioritize CX and commerce fixes in your ${roleName} backlog from real user-friction data.`,
        'Apply AI merchandising recommendations to test assortment decisions faster across channels.',
        'Run AI governance checks for catalog integrity, privacy, and automation bias while keeping final governance human.',
      ],
      education: isModellingSchoolDirector
        ? [
          `Use EOEX AI workflows to build casting-readiness simulations in your ${roleName} program under realistic selection pressure.`,
          'Use AI-assisted runway analysis to coach posture, pace, and stage presence with student-level precision.',
          'Run AI-based image-rights case drills while keeping final ethics and assessment decisions human.',
        ]
        : (isDesignSchoolDirector
          ? [
            `Use EOEX AI workflows to structure concept-to-collection iteration in your ${roleName} curriculum with clearer milestones.`,
            'Use AI-supported pattern and fit review prompts to improve faculty feedback consistency.',
            'Deploy AI pre-critiques for material, costing, and sustainability trade-offs while keeping final jury decisions human.',
          ]
          : [
            `Use EOEX AI workflows to turn curriculum feedback into clearer progression plans in your ${roleName} practice.`,
            'Deploy AI-assisted evaluation rubrics to improve grading consistency without reducing pedagogical judgment.',
            'Use AI to monitor employability signals earlier while keeping student guidance and final evaluation human.',
          ]),
    },
    fr: {
      creative: [
        `Utilisez les parcours IA d’EOEX pour comparer plus vite des directions créatives dans votre pratique de ${roleName}, tout en gardant la décision d’auteur humaine.`,
        'Transformez vos notes de critique en synthèses IA structurées pour aligner plus tôt les équipes et raccourcir les cycles de révision.',
        'Lancez des pré-vérifications IA sur droits, risques de livraison et relais de production, puis gardez la validation finale humaine.',
      ],
      content: [
        `Utilisez les parcours IA d’EOEX pour accélérer préparation de tournage et pré-montage dans votre activité de ${roleName}, sans lisser votre signature visuelle.`,
        'Comparez vos versions de montage avec appui IA pour repérer rythme, continuité et cadrage avant la revue client.',
        'Automatisez les pré-contrôles de transcription, sous-titrage et droits d’usage avec l’IA, en gardant la décision narrative humaine.',
      ],
      talent: [
        `Utilisez les parcours IA d’EOEX pour trier portfolios et signaux de casting dans votre pipeline ${roleName}, sans remplacer le jugement humain du potentiel.`,
        'Transformez les historiques de retours en priorités de progression assistées par IA, plus lisibles et plus justes.',
        'Activez des analyses IA de contrats pour signaler tôt les risques de droits, puis conservez la décision carrière humaine.',
      ],
      operations: [
        `Utilisez les parcours IA d’EOEX pour anticiper les goulots de production dans votre rôle de ${roleName} avant impact sur délais et qualité.`,
        'Automatisez le suivi des exceptions entre fournisseurs, échantillons et étapes de livraison pour réduire le mode urgence.',
        'Déployez des alertes IA sur dérive des coûts et conformité, tout en gardant l’arbitrage final humain.',
      ],
      marketing: [
        `Utilisez les parcours IA d’EOEX pour tester des variantes de message de campagne dans votre trajectoire ${roleName}, sans déléguer la voix de marque.`,
        'Exploitez des vues d’attribution IA pour rééquilibrer plus tôt les investissements entre canaux.',
        'Automatisez le regroupement des signaux d’audience avec l’IA en gardant la décision finale de positionnement humaine.',
      ],
      digital: [
        `Utilisez les parcours IA d’EOEX pour prioriser les corrections CX et e-commerce dans votre backlog ${roleName} à partir de frictions utilisateurs réelles.`,
        'Appliquez des recommandations IA de merchandising pour tester plus vite la logique d’assortiment.',
        'Mettez en place des contrôles IA sur intégrité catalogue, confidentialité et biais d’automatisation, avec gouvernance finale humaine.',
      ],
      education: isModellingSchoolDirector
        ? [
          `Utilisez les parcours IA d’EOEX pour créer des simulations de casting dans votre programme ${roleName}, au plus près de la pression de sélection réelle.`,
          'Appuyez-vous sur l’analyse runway assistée par IA pour affiner posture, rythme et présence avec précision par étudiant.',
          'Déployez des cas pratiques IA sur les droits d’image, tout en gardant l’éthique et l’évaluation finale sous décision humaine.',
        ]
        : (isDesignSchoolDirector
          ? [
            `Utilisez les parcours IA d’EOEX pour structurer l’itération du concept à la collection dans votre cursus ${roleName} avec des jalons plus lisibles.`,
            'Utilisez des guides de revue patronage et fit assistés par IA pour harmoniser les retours de l’équipe pédagogique.',
            'Lancez des pré-critiques IA sur matières, coûts et arbitrages durabilité, en conservant le jury final humain.',
          ]
          : [
            `Utilisez les parcours IA d’EOEX pour transformer les retours pédagogiques en plans de progression plus clairs dans votre rôle de ${roleName}.`,
            'Déployez des grilles d’évaluation assistées par IA pour renforcer la cohérence sans réduire le discernement pédagogique.',
            'Suivez plus tôt les signaux d’employabilité avec l’IA, tout en gardant l’accompagnement étudiant et la validation finale humains.',
          ]),
    },
    es: {
      creative: [
        `Usa los recorridos de IA de EOEX para comparar direcciones creativas con más rapidez en tu práctica de ${roleName}, manteniendo humana la decisión de autoría final.`,
        'Convierte notas de crítica en síntesis estructuradas con IA para alinear antes a los equipos y reducir rondas de revisión.',
        'Activa precontroles con IA sobre derechos, riesgo de entrega y traspasos de producción, dejando humana la aprobación final.',
      ],
      content: [
        `Usa los recorridos de IA de EOEX para acelerar preparación de rodaje y preedición en tu trabajo de ${roleName}, sin perder tu lenguaje visual.`,
        'Compara cortes con apoyo de IA para detectar ritmo, continuidad y encuadre antes de la revisión con cliente.',
        'Automatiza prechequeos de transcripción, subtitulado y derechos de uso con IA, manteniendo humana la decisión narrativa.',
      ],
      talent: [
        `Usa los recorridos de IA de EOEX para filtrar portafolios y señales de casting en tu flujo ${roleName}, sin sustituir el juicio humano del potencial.`,
        'Convierte historiales de feedback en prioridades de desarrollo asistidas por IA, más medibles y equitativas.',
        'Ejecuta análisis de contratos con IA para detectar riesgos de derechos temprano y conserva humana la decisión de carrera.',
      ],
      operations: [
        `Usa los recorridos de IA de EOEX para anticipar cuellos de botella de producción en tu función de ${roleName} antes de afectar calidad y plazo.`,
        'Automatiza el seguimiento de excepciones entre proveedores, muestras y hitos de entrega para reducir trabajo de urgencia.',
        'Despliega alertas de IA sobre desvío de costes y cumplimiento, manteniendo humano el arbitraje final.',
      ],
      marketing: [
        `Usa los recorridos de IA de EOEX para probar variantes de mensaje de campaña en tu estrategia ${roleName}, sin ceder la voz de marca.`,
        'Aprovecha lecturas de atribución con IA para redistribuir inversión entre canales con mayor anticipación.',
        'Automatiza el agrupamiento de señales de audiencia con IA y deja en criterio humano el posicionamiento final.',
      ],
      digital: [
        `Usa los recorridos de IA de EOEX para priorizar mejoras de CX y e-commerce en tu lista ${roleName} desde fricciones reales de usuario.`,
        'Aplica recomendaciones de merchandising con IA para validar más rápido decisiones de surtido multicanal.',
        'Ejecuta controles de IA sobre integridad de catálogo, privacidad y sesgo automático, con gobernanza final humana.',
      ],
      education: isModellingSchoolDirector
        ? [
          `Usa los recorridos de IA de EOEX para crear simulaciones de casting en tu programa ${roleName} bajo presión de selección real.`,
          'Apóyate en análisis de pasarela asistido por IA para entrenar postura, ritmo y presencia con precisión por alumno.',
          'Implementa casos de derechos de imagen con IA y mantén humanas las decisiones finales de ética y evaluación.',
        ]
        : (isDesignSchoolDirector
          ? [
            `Usa los recorridos de IA de EOEX para estructurar la iteración de concepto a colección en tu plan ${roleName} con hitos más claros.`,
            'Utiliza guías de revisión de patronaje y fitting asistidas por IA para un feedback docente más consistente.',
            'Despliega precríticas con IA sobre material, coste y sostenibilidad, manteniendo humano el jurado final.',
          ]
          : [
            `Usa los recorridos de IA de EOEX para convertir retroalimentación académica en planes de progresión más claros en tu práctica de ${roleName}.`,
            'Aplica rúbricas de evaluación asistidas por IA para mejorar consistencia sin reducir criterio pedagógico.',
            'Monitorea señales de empleabilidad con IA de forma temprana y conserva humano el acompañamiento y la validación final.',
          ]),
    },
    it: {
      creative: [
        `Usa i percorsi IA di EOEX per confrontare più rapidamente le direzioni creative nel tuo lavoro di ${roleName}, mantenendo umana la decisione autoriale finale.`,
        'Trasforma le note di critica in sintesi strutturate con IA per allineare prima i team e ridurre i cicli di revisione.',
        'Attiva pre-verifiche IA su diritti, rischio consegna e passaggi di produzione, lasciando umana l’approvazione finale.',
      ],
      content: [
        `Usa i percorsi IA di EOEX per accelerare preparazione riprese e pre-montaggio nella tua attività di ${roleName}, senza perdere linguaggio visivo.`,
        'Confronta i montaggi con supporto IA per rilevare ritmo, continuità e inquadratura prima della revisione cliente.',
        'Automatizza pre-check di trascrizione, sottotitoli e diritti d’uso con IA, mantenendo umana la scelta narrativa.',
      ],
      talent: [
        `Usa i percorsi IA di EOEX per fare triage di portfolio e segnali casting nel tuo flusso ${roleName}, senza sostituire il giudizio umano sul potenziale.`,
        'Trasforma lo storico dei feedback in priorità di sviluppo assistite da IA, più misurabili ed eque.',
        'Esegui analisi IA dei contratti per individuare presto i rischi sui diritti e mantieni umana la decisione di carriera.',
      ],
      operations: [
        `Usa i percorsi IA di EOEX per anticipare i colli di bottiglia produttivi nel tuo ruolo ${roleName} prima di impattare su qualità e tempi.`,
        'Automatizza il monitoraggio delle eccezioni tra fornitori, campioni e tappe di consegna per ridurre il lavoro in emergenza.',
        'Attiva avvisi IA su deriva costi e conformità, mantenendo umano l’arbitraggio finale.',
      ],
      marketing: [
        `Usa i percorsi IA di EOEX per testare varianti di messaggio campagna nella tua strategia ${roleName}, senza cedere la voce del brand.`,
        'Sfrutta letture di attribuzione assistite da IA per riequilibrare prima gli investimenti tra canali.',
        'Automatizza il raggruppamento dei segnali audience con IA e mantieni umana la decisione finale di posizionamento.',
      ],
      digital: [
        `Usa i percorsi IA di EOEX per prioritizzare miglioramenti CX ed e-commerce nella tua lista ${roleName} da frizioni utente reali.`,
        'Applica raccomandazioni IA di merchandising per validare più rapidamente le scelte di assortimento multicanale.',
        'Esegui controlli IA su integrità catalogo, privacy e bias automatici, con governance finale umana.',
      ],
      education: isModellingSchoolDirector
        ? [
          `Usa i percorsi IA di EOEX per creare simulazioni casting nel tuo programma ${roleName} in condizioni di selezione realistiche.`,
          'Sfrutta analisi passerella assistite da IA per allenare postura, ritmo e presenza con precisione per studente.',
          'Attiva casi su diritti d’immagine con IA mantenendo umane le decisioni finali su etica e valutazione.',
        ]
        : (isDesignSchoolDirector
          ? [
            `Usa i percorsi IA di EOEX per strutturare l’iterazione da concept a collezione nel tuo percorso ${roleName} con tappe più chiare.`,
            'Usa guide di revisione cartamodello e fitting assistite da IA per feedback docenti più coerenti.',
            'Avvia pre-critiche IA su materiale, costo e sostenibilità, mantenendo umana la decisione finale di giuria.',
          ]
          : [
            `Usa i percorsi IA di EOEX per trasformare feedback didattico in piani di progressione più chiari nella tua pratica ${roleName}.`,
            'Applica rubriche di valutazione assistite da IA per aumentare coerenza senza ridurre il giudizio pedagogico.',
            'Monitora presto i segnali di occupabilità con IA e mantieni umani orientamento allo studente e valutazione finale.',
          ]),
    },
    pt: {
      creative: [
        `Use os percursos de IA da EOEX para comparar direções criativas com mais rapidez na sua prática de ${roleName}, mantendo humana a decisão autoral final.`,
        'Transforme notas de crítica em sínteses estruturadas com IA para alinhar equipes mais cedo e reduzir ciclos de revisão.',
        'Ative pré-verificações com IA sobre direitos, risco de entrega e passagens de produção, mantendo humana a aprovação final.',
      ],
      content: [
        `Use os percursos de IA da EOEX para acelerar preparação de captação e pré-edição no seu trabalho de ${roleName}, sem perder sua linguagem visual.`,
        'Compare cortes com apoio de IA para identificar ritmo, continuidade e enquadramento antes da revisão com cliente.',
        'Automatize pré-checagens de transcrição, legendagem e direitos de uso com IA, mantendo humana a decisão narrativa.',
      ],
      talent: [
        `Use os percursos de IA da EOEX para fazer triagem de portfólios e sinais de casting no seu fluxo ${roleName}, sem substituir o julgamento humano de potencial.`,
        'Converta histórico de retornos em prioridades de desenvolvimento assistidas por IA, mais mensuráveis e justas.',
        'Execute análises de contratos com IA para sinalizar cedo riscos de direitos e mantenha humana a decisão de carreira.',
      ],
      operations: [
        `Use os percursos de IA da EOEX para antecipar gargalos de produção no seu papel de ${roleName} antes de impactar qualidade e prazo.`,
        'Automatize o rastreio de exceções entre fornecedores, amostras e marcos de entrega para reduzir trabalho de urgência.',
        'Ative alertas de IA para desvio de custos e exposição de conformidade, mantendo humano o arbitramento final.',
      ],
      marketing: [
        `Use os percursos de IA da EOEX para testar variantes de mensagem de campanha na sua estratégia ${roleName}, sem terceirizar a voz da marca.`,
        'Aproveite leituras de atribuição com IA para redistribuir investimento entre canais com antecedência.',
        'Automatize agrupamento de sinais de audiência com IA e mantenha humana a decisão final de posicionamento.',
      ],
      digital: [
        `Use os percursos de IA da EOEX para priorizar melhorias de CX e e-commerce na sua lista ${roleName} com base em fricções reais de usuário.`,
        'Aplique recomendações de merchandising com IA para validar mais rápido decisões de sortimento multicanal.',
        'Execute controles de IA sobre integridade de catálogo, privacidade e vieses automáticos, com governança final humana.',
      ],
      education: isModellingSchoolDirector
        ? [
          `Use os percursos de IA da EOEX para criar simulações de casting no seu programa ${roleName} sob pressão real de seleção.`,
          'Apoie-se em análise de passarela assistida por IA para treinar postura, ritmo e presença com precisão por estudante.',
          'Implemente casos de direitos de imagem com IA mantendo humanas as decisões finais de ética e avaliação.',
        ]
        : (isDesignSchoolDirector
          ? [
            `Use os percursos de IA da EOEX para estruturar a iteração de conceito até coleção no seu percurso ${roleName} com marcos mais claros.`,
            'Use guias de revisão de modelagem e fitting assistidos por IA para maior consistência no retorno docente.',
            'Ative pré-críticas com IA sobre material, custo e sustentabilidade, mantendo humana a decisão final da banca.',
          ]
          : [
            `Use os percursos de IA da EOEX para transformar retorno pedagógico em planos de progressão mais claros na sua prática ${roleName}.`,
            'Aplique rubricas de avaliação assistidas por IA para elevar consistência sem reduzir o julgamento pedagógico.',
            'Monitore cedo sinais de empregabilidade com IA e mantenha humana a orientação ao estudante e a avaliação final.',
          ]),
    },
    de: {
      creative: [
        `Nutzen Sie die KI-Pfade von EOEX, um kreative Richtungen in Ihrer ${roleName}-Praxis schneller zu vergleichen, während die finale Autorenentscheidung menschlich bleibt.`,
        'Überführen Sie Kritiknotizen in strukturierte KI-Zusammenfassungen, damit Teams früher auf Linie kommen und Revisionsschleifen sinken.',
        'Führen Sie KI-Vorprüfungen zu Rechten, Lieferterminrisiken und Produktionsübergaben durch, bei finaler Freigabe bleibt der Mensch verantwortlich.',
      ],
      content: [
        `Nutzen Sie die KI-Pfade von EOEX, um Drehvorbereitung und Vorschnitt in Ihrer ${roleName}-Praxis zu beschleunigen, ohne Ihre visuelle Sprache zu verlieren.`,
        'Vergleichen Sie Schnittfassungen KI-gestützt, um Tempo-, Kontinuitäts- und Bildführungsprobleme vor der Kundenrunde zu erkennen.',
        'Automatisieren Sie Vorprüfungen für Transkript, Untertitel und Nutzungsrechte mit KI, während finale Erzählentscheidungen menschlich bleiben.',
      ],
      talent: [
        `Nutzen Sie die KI-Pfade von EOEX, um Portfolios und Casting-Signale in Ihrem ${roleName}-Ablauf zu priorisieren, ohne menschliche Potenzialbeurteilung zu ersetzen.`,
        'Wandeln Sie Feedback-Verläufe in KI-gestützte Entwicklungsprioritäten um, damit Fortschrittspläne messbarer und fairer werden.',
        'Setzen Sie KI-Vertragsanalysen ein, um Rechte-Risiken früh zu markieren, die finale Karriereentscheidung bleibt menschlich.',
      ],
      operations: [
        `Nutzen Sie die KI-Pfade von EOEX, um Produktionsengpässe in Ihrer Rolle als ${roleName} früh zu erkennen, bevor Qualität oder Timing leiden.`,
        'Automatisieren Sie Ausnahme-Tracking über Lieferanten, Muster und Liefermeilensteine, um Krisenmodus zu reduzieren.',
        'Aktivieren Sie KI-Warnungen bei Kostendrift und Compliance-Risiken, finale Abwägungen bleiben menschlich geführt.',
      ],
      marketing: [
        `Nutzen Sie die KI-Pfade von EOEX, um Kampagnenbotschaften in Ihrer ${roleName}-Strategie variantenreicher zu testen, ohne die Markenstimme aus der Hand zu geben.`,
        'Nutzen Sie KI-Attributionsbilder, um Investitionen zwischen Kanälen früher neu zu gewichten.',
        'Automatisieren Sie das Clustern von Audience-Signalen mit KI und behalten Sie die finale Positionierungsentscheidung menschlich.',
      ],
      digital: [
        `Nutzen Sie die KI-Pfade von EOEX, um CX- und E-Commerce-Verbesserungen in Ihrer ${roleName}-Liste anhand realer Nutzerreibung zu priorisieren.`,
        'Setzen Sie KI-Merchandising-Empfehlungen ein, um Sortimentsentscheidungen kanalübergreifend schneller zu validieren.',
        'Führen Sie KI-Kontrollen zu Katalogintegrität, Datenschutz und Automationsverzerrungen durch, bei finaler Governance entscheidet der Mensch.',
      ],
      education: isModellingSchoolDirector
        ? [
          `Nutzen Sie die KI-Pfade von EOEX, um Casting-Simulationen in Ihrem ${roleName}-Programm unter realem Selektionsdruck aufzubauen.`,
          'Arbeiten Sie mit KI-gestützter Runway-Analyse, um Haltung, Tempo und Präsenz je Studierenden präziser zu trainieren.',
          'Setzen Sie KI-Fallarbeit zu Bildrechten ein und halten Sie finale Ethik- und Bewertungsentscheidungen menschlich.',
        ]
        : (isDesignSchoolDirector
          ? [
            `Nutzen Sie die KI-Pfade von EOEX, um die Iteration von Konzept bis Kollektion in Ihrem ${roleName}-Programm mit klareren Meilensteinen zu strukturieren.`,
            'Nutzen Sie KI-gestützte Leitfäden für Schnitt- und Passform-Reviews, damit Lehrfeedback konsistenter wird.',
            'Starten Sie KI-Vorkritiken zu Material, Kosten und Nachhaltigkeit, finale Juryentscheidungen bleiben menschlich.',
          ]
          : [
            `Nutzen Sie die KI-Pfade von EOEX, um Lehrfeedback in Ihrer ${roleName}-Praxis in klarere Entwicklungspläne zu übersetzen.`,
            'Setzen Sie KI-gestützte Bewertungsraster ein, um Konsistenz zu erhöhen, ohne pädagogisches Urteil zu schwächen.',
            'Verfolgen Sie Employability-Signale mit KI früher und behalten Sie Beratung sowie Abschlussbewertung menschlich.',
          ]),
    },
  };

  const masterclassUspByLocale = {
    en: `This masterclass is built from your actual responsibilities as ${roleName}, so each module maps to decisions you make in real working conditions.`,
    fr: `Cette masterclass est construite à partir de vos responsabilités réelles comme ${roleName}, pour relier chaque module à vos décisions terrain.`,
    es: `Esta masterclass parte de tus responsabilidades reales como ${roleName}, para conectar cada módulo con decisiones de trabajo concretas.`,
    it: `Questa masterclass parte dalle tue responsabilità reali come ${roleName}, così ogni modulo è collegato a decisioni operative concrete.`,
    pt: `Esta masterclass parte das suas responsabilidades reais como ${roleName}, conectando cada módulo às decisões concretas do seu dia a dia.`,
    de: `Diese Masterclass basiert auf Ihren realen Verantwortungsbereichen als ${roleName}, damit jedes Modul direkt auf echte Arbeitsentscheidungen einzahlt.`,
  };

  const benefitTemplates = responsibilityBenefitTemplates[language] || responsibilityBenefitTemplates.en;
  const curatedResponsibilityPool = dedupeSimilarLines(responsibilityPool).slice(0, 6);
  const responsibilityBenefits = dedupeSimilarLines(
    curatedResponsibilityPool.slice(0, 4).map((item, index) => {
      const template = benefitTemplates[index % benefitTemplates.length];
      return template(item);
    }),
  );
  const localeMasterclass = {
    usp: masterclassUspByLocale[language] || masterclassUspByLocale.en,
    benefits: responsibilityBenefits,
  };
  const modelTrackLabelByLocale = {
    en: {
      runway: 'runway modelling',
      editorial: 'editorial modelling',
      commercial: 'commercial modelling',
      fit: 'fit modelling',
      ecommerce: 'e-commerce modelling',
      general: 'professional modelling',
    },
    fr: {
      runway: 'mannequinat runway',
      editorial: 'mannequinat éditorial',
      commercial: 'mannequinat commercial',
      fit: 'mannequinat fitting',
      ecommerce: 'mannequinat e-commerce',
      general: 'mannequinat professionnel',
    },
    es: {
      runway: 'modelaje de pasarela',
      editorial: 'modelaje editorial',
      commercial: 'modelaje comercial',
      fit: 'modelaje de fit',
      ecommerce: 'modelaje e-commerce',
      general: 'modelaje profesional',
    },
    it: {
      runway: 'modeling runway',
      editorial: 'modeling editoriale',
      commercial: 'modeling commerciale',
      fit: 'modeling fit',
      ecommerce: 'modeling e-commerce',
      general: 'modeling professionale',
    },
    pt: {
      runway: 'modelagem de passarela',
      editorial: 'modelagem editorial',
      commercial: 'modelagem comercial',
      fit: 'modelagem de fit',
      ecommerce: 'modelagem de e-commerce',
      general: 'modelagem profissional',
    },
    de: {
      runway: 'Runway-Modeling',
      editorial: 'Editorial-Modeling',
      commercial: 'Commercial-Modeling',
      fit: 'Fit-Modeling',
      ecommerce: 'E-Commerce-Modeling',
      general: 'professionelles Modeling',
    },
  };
  const modelTrackLabel = (modelTrackLabelByLocale[language] || modelTrackLabelByLocale.en)[modelSubtype] || (modelTrackLabelByLocale[language] || modelTrackLabelByLocale.en).general;
  const modelMasterclassByLocale = {
    en: {
      usp: `This masterclass is tailored to your ${modelTrackLabel} track, turning real booking workflow, set execution standards, and rights decisions into repeatable career leverage.`,
      benefits: [
        `Map your prep cycle to ${activeModelFocus.cycle} so your readiness matches the bookings you actually receive.`,
        `Train execution quality around ${activeModelFocus.execution} to raise callback reliability under pressure.`,
        `Lock in contract discipline around ${activeModelFocus.economics} before accepting campaigns or renewals.`,
        `Build long-season resilience so ${activeModelFocus.progression} stays consistent even through rejection cycles.`,
      ],
    },
    fr: {
      usp: `Cette masterclass est calibrée pour votre piste ${modelTrackLabel}: transformer la réalité booking, l’exécution plateau et les droits d’usage en levier de carrière durable.`,
      benefits: [
        `Aligner votre préparation sur ${activeModelFocus.cycle} pour coller aux bookings réellement obtenus.`,
        `Élever votre fiabilité d’exécution autour de ${activeModelFocus.execution} pour sécuriser callbacks et rebookings.`,
        `Verrouiller la discipline contractuelle sur ${activeModelFocus.economics} avant toute campagne ou renouvellement.`,
        `Installer une résilience de saison pour que ${activeModelFocus.progression} tienne malgré les cycles de rejet.`,
      ],
    },
    es: {
      usp: `Esta masterclass está diseñada para tu pista de ${modelTrackLabel}: convertir flujo de booking, estándares de set y decisiones de derechos en ventaja profesional sostenible.`,
      benefits: [
        `Alinear tu preparación con ${activeModelFocus.cycle} para responder al tipo de booking que realmente recibes.`,
        `Mejorar ejecución en torno a ${activeModelFocus.execution} para aumentar fiabilidad en callbacks y rebookings.`,
        `Controlar la disciplina contractual sobre ${activeModelFocus.economics} antes de aceptar campañas o renovaciones.`,
        `Construir resiliencia de temporada para que ${activeModelFocus.progression} se sostenga incluso con rechazo.`,
      ],
    },
    it: {
      usp: `Questa masterclass è costruita per il tuo percorso di ${modelTrackLabel}: tradurre workflow booking, standard di set e diritti d’uso in leva professionale stabile.`,
      benefits: [
        `Allineare la preparazione a ${activeModelFocus.cycle} per rispondere ai booking realmente disponibili.`,
        `Rafforzare l’esecuzione su ${activeModelFocus.execution} per aumentare affidabilità in callback e rebooking.`,
        `Impostare disciplina contrattuale su ${activeModelFocus.economics} prima di accettare campagne o rinnovi.`,
        `Costruire resilienza stagionale affinché ${activeModelFocus.progression} resti solida anche nei cicli di rifiuto.`,
      ],
    },
    pt: {
      usp: `Esta masterclass foi desenhada para sua trilha de ${modelTrackLabel}: transformar fluxo real de booking, padrões de set e decisões de direitos em alavanca de carreira duradoura.`,
      benefits: [
        `Alinhar sua preparação a ${activeModelFocus.cycle} para responder ao tipo de booking que você realmente recebe.`,
        `Elevar a execução em torno de ${activeModelFocus.execution} para aumentar confiabilidade em callbacks e rebookings.`,
        `Fechar disciplina contratual sobre ${activeModelFocus.economics} antes de aceitar campanhas ou renovações.`,
        `Construir resiliência de temporada para que ${activeModelFocus.progression} se mantenha mesmo em ciclos de rejeição.`,
      ],
    },
    de: {
      usp: `Diese Masterclass ist auf Ihre ${modelTrackLabel}-Ausrichtung abgestimmt und macht Booking-Realität, Set-Standards und Rechteentscheidungen in nachhaltigen Karrierenutzen übersetzbar.`,
      benefits: [
        `Ihre Vorbereitung an ${activeModelFocus.cycle} ausrichten, damit sie zu den tatsächlich gebuchten Jobs passt.`,
        `Ausführungsqualität rund um ${activeModelFocus.execution} trainieren, um Callback- und Rebooking-Sicherheit zu erhöhen.`,
        `Vertragsdisziplin zu ${activeModelFocus.economics} vor Kampagnenzusagen und Verlängerungen verbindlich klären.`,
        `Saisonale Resilienz aufbauen, damit ${activeModelFocus.progression} auch in Ablehnungsphasen stabil bleibt.`,
      ],
    },
  };

  const modelMasterclass = modelMasterclassByLocale[language] || modelMasterclassByLocale.en;
  const localeAiBenefits = aiBenefitsByLocale[language] || aiBenefitsByLocale.en;
  const genericTrackAiBenefits = localeAiBenefits[roleTrack] || localeAiBenefits.creative;
  const modelAiBenefitsByLocale = {
    en: [
      `Use EOEX AI preparation boards for ${modelTrackLabel} bookings so rehearsal quality matches ${activeModelFocus.cycle}.`,
      `Use AI playback analysis to tighten ${activeModelFocus.execution} before paid set days and reduce avoidable retakes.`,
      `Simulate rights and contract-use scenarios with AI around ${activeModelFocus.economics}, while keeping final approval human.`,
    ],
    fr: [
      `Utilisez les boards de préparation IA EOEX pour vos bookings en ${modelTrackLabel}, afin d’aligner les répétitions sur ${activeModelFocus.cycle}.`,
      `Exploitez l’analyse playback par IA pour renforcer ${activeModelFocus.execution} avant les journées de set payées et éviter les reprises.`,
      `Simulez avec l’IA des scénarios de droits et d’usage contractuel autour de ${activeModelFocus.economics}, avec validation finale humaine.`,
    ],
    es: [
      `Usa tableros de preparación con IA de EOEX para bookings de ${modelTrackLabel}, alineando tus ensayos con ${activeModelFocus.cycle}.`,
      `Aplica análisis de playback con IA para reforzar ${activeModelFocus.execution} antes de jornadas de set pagadas y reducir repeticiones evitables.`,
      `Simula con IA escenarios de derechos y uso contractual ligados a ${activeModelFocus.economics}, manteniendo humana la aprobación final.`,
    ],
    it: [
      `Usa board di preparazione IA EOEX per booking ${modelTrackLabel}, così la qualità delle prove resta allineata a ${activeModelFocus.cycle}.`,
      `Usa analisi playback con IA per rafforzare ${activeModelFocus.execution} prima dei set retribuiti e ridurre riprese evitabili.`,
      `Simula con l’IA scenari di diritti e uso contrattuale su ${activeModelFocus.economics}, mantenendo umana l’approvazione finale.`,
    ],
    pt: [
      `Use quadros de preparação com IA da EOEX para bookings de ${modelTrackLabel}, alinhando qualidade de ensaio a ${activeModelFocus.cycle}.`,
      `Aplique análise de playback com IA para fortalecer ${activeModelFocus.execution} antes de diárias pagas e reduzir refações evitáveis.`,
      `Simule com IA cenários de direitos e uso contratual ligados a ${activeModelFocus.economics}, mantendo humana a aprovação final.`,
    ],
    de: [
      `Nutzen Sie EOEX-KI-Vorbereitungsboards für ${modelTrackLabel}-Bookings, damit Ihre Probenqualität zu ${activeModelFocus.cycle} passt.`,
      `Setzen Sie KI-Playback-Analysen ein, um ${activeModelFocus.execution} vor bezahlten Set-Tagen zu schärfen und vermeidbare Wiederholungen zu senken.`,
      `Simulieren Sie mit KI Rechte- und Vertragsnutzungsszenarien rund um ${activeModelFocus.economics}, bei finaler Freigabe bleibt der Mensch entscheidend.`,
    ],
  };
  const aiBenefits = isModelProfile
    ? (modelAiBenefitsByLocale[language] || modelAiBenefitsByLocale.en)
    : genericTrackAiBenefits;

  return {
    profileSlides,
    challenges: mergedChallenges,
    services,
    masterclass: {
      usp: isModelProfile ? modelMasterclass.usp : localeMasterclass.usp,
      benefits: [
        ...(isModelProfile ? modelMasterclass.benefits : localeMasterclass.benefits),
        ...aiBenefits,
      ],
    },
  };
}

export default function ProfileOnePage({ profileRaw = profileOneRaw, profileId = 1 }) {
  const [shuffleSeed] = useState(() => {
    if (typeof window === 'undefined') return 173207;

    const storageKey = 'eoex-profile1-fashion-seed';
    const existing = window.sessionStorage.getItem(storageKey);
    if (existing) {
      const parsed = Number(existing);
      if (Number.isFinite(parsed)) return parsed;
    }

    const generated = Math.floor(Math.random() * 1000000000);
    window.sessionStorage.setItem(storageKey, String(generated));
    return generated;
  });

  const [language, setLanguage] = useState('fr');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [heroIndex, setHeroIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [masterclassImageIndex, setMasterclassImageIndex] = useState(0);
  const [masterclassVideoIndex, setMasterclassVideoIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isHeroVideoVisible, setIsHeroVideoVisible] = useState(true);
  const [isServicesVideoVisible, setIsServicesVideoVisible] = useState(true);
  const [isServicesVideoMuted, setIsServicesVideoMuted] = useState(true);
  const activeProfileImageRef = useRef('');
  const heroVideoRefs = useRef([]);
  const servicesVideoRefs = useRef([]);
  const lastHeroIndexRef = useRef(0);
  const lastServicesVideoIndexRef = useRef(0);
  const heroVideoShellRef = useRef(null);
  const servicesVideoShellRef = useRef(null);

  const eoexAgencyUrl = 'https://eoextrainer.github.io/eoexagency/';
  const homePageUrl = eoexAgencyUrl;
  const homeLogo = new URL('../gallery/logo/2.png', import.meta.url).href;

  const heroVideos = useMemo(() => sortedAssets(HERO_VIDEO_MAP), []);
  const masterclassVideos = useMemo(() => {
    const introVideo = `${import.meta.env.BASE_URL}res/videos/gallery/EOEX-INTRO.mp4#t=2`;
    const merged = [introVideo, ...sortedAssets(MASTERCLASS_VIDEO_MAP)].filter(Boolean);
    return Array.from(new Set(merged));
  }, []);
  const allFashionImages = useMemo(
    () => {
      const merged = [
        ...sortedAssets(FASHION_IMAGE_MAPS[0]),
        ...sortedAssets(FASHION_IMAGE_MAPS[1]),
        ...sortedAssets(FASHION_IMAGE_MAPS[2]),
        ...sortedAssets(FASHION_IMAGE_MAPS[3]),
      ];

      const allowedOnly = merged.filter((url) => /\/gallery\/fashion\/[1-4]\//.test(url));
      return seededShuffle(allowedOnly, shuffleSeed).map((url) => withCacheTag(url, shuffleSeed));
    },
    [shuffleSeed],
  );
  const profileImages = useMemo(
    () => (allFashionImages.length > 16 ? allFashionImages.slice(0, 16) : allFashionImages),
    [allFashionImages],
  );
  const masterclassImages = useMemo(() => {
    const profileSet = new Set(profileImages);
    const remaining = allFashionImages.filter((image) => !profileSet.has(image));
    return remaining.length ? remaining : allFashionImages;
  }, [allFashionImages, profileImages]);

  const profileLines = useMemo(() => normalizeLines(profileRaw), [profileRaw]);
  const roleKey = PROFILE_ROLE_BY_ID[profileId] || PROFILE_ROLE_BY_ID[1];
  const authoredByLanguage = PROFILE_COPY_LIBRARY[roleKey] || null;
  const rawAuthoredCopy = authoredByLanguage?.[language] || authoredByLanguage?.en || null;
  const canonicalRoleLabel = useMemo(() => getCanonicalRoleLabel(roleKey, language), [roleKey, language]);
  const authoredCopy = useMemo(() => {
    if (!rawAuthoredCopy) return null;

    if (rawAuthoredCopy.roleName !== canonicalRoleLabel || rawAuthoredCopy.navProfile !== canonicalRoleLabel) {
      console.error(
        `[role-lexicon-guard] Blocked non-canonical role labels for ${roleKey}/${language}. Expected "${canonicalRoleLabel}".`,
      );
    }

    return {
      ...rawAuthoredCopy,
      roleName: canonicalRoleLabel,
      navProfile: canonicalRoleLabel,
    };
  }, [rawAuthoredCopy, canonicalRoleLabel, roleKey, language]);
  const baseCopy = PROFILE_COPY[language] || PROFILE_COPY.en;
  const roleTitle = useMemo(() => extractRoleTitle(profileLines, baseCopy.hero.title), [profileLines, baseCopy.hero.title]);
  const roleReferenceEn = useMemo(() => getCanonicalRoleLabel(roleKey, 'en'), [roleKey]);
  const roleTrack = useMemo(() => detectRoleTrack(roleReferenceEn), [roleReferenceEn]);
  const roleDisplayName = useMemo(
    () => authoredCopy?.roleName || normalizeRoleName(roleTitle, baseCopy.hero.title),
    [authoredCopy, roleTitle, baseCopy.hero.title],
  );
  const copy = useMemo(() => applyRoleVoice(baseCopy, roleDisplayName, language), [baseCopy, roleDisplayName, language]);
  const navLabels = useMemo(
    () => localizeNativeSpeak({ ...copy.nav, profile: authoredCopy?.navProfile || copy.nav.profile }, language),
    [copy.nav, authoredCopy, language],
  );
  const heroEyebrow = localizeNativeSpeakText(authoredCopy?.heroEyebrow || copy.hero.eyebrow, language);
  const heroSubtitle = localizeNativeSpeakText(authoredCopy?.heroSubtitle || copy.hero.subtitle, language);
  const sectionLabels = useMemo(
    () => localizeNativeSpeak({
      ...copy.labels,
      ...(authoredCopy?.labels || {}),
    }, language),
    [copy.labels, authoredCopy, language],
  );
  const sourceSlides = useMemo(
    () => extractProfileSlides(profileLines, copy.profileSlides, roleDisplayName, language),
    [profileLines, copy.profileSlides, roleDisplayName, language],
  );
  const narrativePack = useMemo(
    () => buildNarrativePack({ roleName: roleDisplayName, roleReferenceEn, roleTrack, language, profileLines, sourceSlides, profileId }),
    [roleDisplayName, roleReferenceEn, roleTrack, language, profileLines, sourceSlides, profileId],
  );
  const profileSlides = useMemo(() => {
    if (authoredCopy?.profileSlides?.length) return enrichCarouselSlides(localizeNativeSpeak(authoredCopy.profileSlides, language), language);
    if (sourceSlides.length >= 3) return enrichCarouselSlides(localizeNativeSpeak(sourceSlides, language), language);
    if (narrativePack.profileSlides?.length >= 3) return enrichCarouselSlides(localizeNativeSpeak(narrativePack.profileSlides, language), language);
    return enrichCarouselSlides(localizeNativeSpeak(sourceSlides, language), language);
  }, [narrativePack, sourceSlides, authoredCopy, language]);
  const services = useMemo(() => {
    // EOEX business units are the universal services narrative for every profile.
    if (narrativePack.services?.length >= 4) return localizeNativeSpeak(narrativePack.services, language);

    if (authoredCopy?.services?.length) return localizeNativeSpeak(authoredCopy.services, language);

    const sourceServices = extractServiceCards(profileLines);
    if (sourceServices.length >= 3) {
      return localizeNativeSpeak(sourceServices.map((service) => ({
        title: cleanLine(service.title),
        body: polishShortLine(service.body, language),
      })), language);
    }

    const enServices = PROFILE_COPY.en.services || [];
    const localizedServices = copy.services || [];

    return localizeNativeSpeak(enServices.map((enService, index) => ({
      title: localizedServices[index]?.title || enService.title,
      body: polishShortLine(localizedServices[index]?.body || enService.body, language),
    })), language);
  }, [narrativePack, authoredCopy, copy, profileLines, language]);
  const challenges = useMemo(() => {
    const fillers = CHALLENGE_FILLERS[language] || CHALLENGE_FILLERS.en;
    const ensureEight = (items) => {
      const deduped = (items || []).filter(Boolean);
      const combined = [...deduped];
      let fillerIndex = 0;
      while (combined.length < 8 && fillerIndex < fillers.length) {
        const candidate = `${challengeOpenersForIndex(combined.length, language)} ${fillers[fillerIndex % fillers.length]}`;
        if (!combined.some((item) => item === candidate)) combined.push(candidate);
        fillerIndex += 1;
      }
      return combined.slice(0, 8);
    };

    if (authoredCopy?.challenges?.length) return localizeNativeSpeak(ensureEight(authoredCopy.challenges), language);

    const sourceChallenges = extractChallengeCards(profileLines);
    if (sourceChallenges.length >= 4) {
      return localizeNativeSpeak(ensureEight(sourceChallenges.map((item) => polishShortLine(item, language))), language);
    }

    if (narrativePack.challenges?.length >= 6) return localizeNativeSpeak(ensureEight(narrativePack.challenges), language);

    const enChallenges = PROFILE_COPY.en.challengesFallback || [];
    const localizedChallenges = copy.challengesFallback || [];

    return localizeNativeSpeak(ensureEight(enChallenges.map((enChallenge, index) => polishShortLine(localizedChallenges[index] || enChallenge, language))), language);
  }, [narrativePack, authoredCopy, copy, profileLines, language]);
  const masterclass = useMemo(() => {
    const baseline = authoredCopy?.masterclass || copy.masterclass;
    const narrativeMasterclass = authoredCopy?.masterclass ? {} : (narrativePack.masterclass || {});
    return localizeNativeSpeak({
      ...baseline,
      ...narrativeMasterclass,
      price: baseline.price || copy.masterclass.price,
      cta: baseline.cta || copy.masterclass.cta,
    }, language);
  }, [authoredCopy, copy.masterclass, narrativePack.masterclass, language]);
  const sectionIds = useMemo(() => ['profile', 'challenges', 'services', 'masterclass'], []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (profileImages.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setImageIndex((previous) => (previous + 1) % profileImages.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [profileImages.length]);

  useEffect(() => {
    activeProfileImageRef.current = profileImages[imageIndex] || '';
  }, [profileImages, imageIndex]);

  useEffect(() => {
    if (masterclassImages.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setMasterclassImageIndex((previous) => {
        const activeProfileImage = activeProfileImageRef.current;
        let next = previous;
        let attempts = 0;

        while (attempts < 24) {
          next = Math.floor(Math.random() * masterclassImages.length);
          const nextImage = masterclassImages[next] || '';
          if (next !== previous && nextImage !== activeProfileImage) break;
          attempts += 1;
        }

        return next;
      });
    }, 2900);

    return () => window.clearInterval(timer);
  }, [masterclassImages]);

  useEffect(() => {
    if (profileSlides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setTextIndex((previous) => (previous + 1) % profileSlides.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [profileSlides.length]);

  useEffect(() => {
    heroVideoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (isHeroVideoVisible && index === heroIndex) {
        if (lastHeroIndexRef.current !== heroIndex) {
          video.currentTime = 0;
        }
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
      } else {
        video.pause();
      }
    });
    lastHeroIndexRef.current = heroIndex;
  }, [isHeroVideoVisible, heroIndex, heroVideos.length]);

  useEffect(() => {
    servicesVideoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (isServicesVideoVisible && index === masterclassVideoIndex) {
        if (lastServicesVideoIndexRef.current !== masterclassVideoIndex) {
          video.currentTime = 0;
        }
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
      } else {
        video.pause();
      }
    });
    lastServicesVideoIndexRef.current = masterclassVideoIndex;
  }, [isServicesVideoVisible, masterclassVideoIndex, masterclassVideos.length]);

  useEffect(() => {
    const target = heroVideoShellRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVideoVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.3 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = servicesVideoShellRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsServicesVideoVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.35 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      const navHeight = 90;
      const midpoint = window.scrollY + navHeight + window.innerHeight * 0.25;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (midpoint >= top && midpoint < bottom) {
          setActiveSection(id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  const activeSlide = profileSlides[textIndex] || profileSlides[0];
  const activeMasterclassImage =
    masterclassImages[masterclassImageIndex]
    || masterclassImages[0]
    || profileImages[0]
    || '';
  const hasMasterclassVideos = masterclassVideos.length > 0;
  const nextHeroVideoIndex = heroVideos.length ? (heroIndex + 1) % heroVideos.length : 0;
  const nextServicesVideoIndex = masterclassVideos.length ? (masterclassVideoIndex + 1) % masterclassVideos.length : 0;

  return (
    <div className="dunex-site landing-page profile-one-page">
      <header className="site-header">
        <nav className="top-nav solid profile-one-nav">
          <a href={eoexAgencyUrl} className="brand brand-with-logo">
            <img className="brand-logo" src={homeLogo} alt="EOEX logo" />
            <span className="brand-tagline">{copy.brandTagline}</span>
          </a>

          <div className="language-banner" role="group" aria-label={copy.languageBanner}>
            <span>{copy.languageBanner}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={copy.languageBanner}>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.short} · {lang.name}</option>
              ))}
            </select>
          </div>

          <button
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
            type="button"
            aria-label={copy.toggleMenu}
            onClick={() => setMobileMenuOpen((previous) => !previous)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {sectionIds.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={activeSection === id ? 'active' : ''}
                  aria-current={activeSection === id ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(id);
                  }}
                >
                  {copy.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section id="profile" className="hero-section">
          <div className="hero-overlay" />
          <div className="hero-content landing-hero-shell">
            <div className="top-carousel hero-carousel reveal is-visible" aria-label={`${roleDisplayName} hero carousel`}>
              <div ref={heroVideoShellRef} className="top-carousel-frame">
                {heroVideos.map((videoSource, index) => (
                  <video
                    key={videoSource}
                    ref={(element) => {
                      heroVideoRefs.current[index] = element;
                    }}
                    className={`landing-carousel-video profile-hero-video-slide ${index === heroIndex ? 'is-active' : ''}`}
                    autoPlay={index === heroIndex}
                    muted
                    loop={heroVideos.length === 1}
                    playsInline
                    preload={index === heroIndex || index === nextHeroVideoIndex ? 'auto' : 'metadata'}
                    onEnded={() => {
                      if (heroVideos.length > 1) {
                        setHeroIndex((previous) => (previous + 1) % heroVideos.length);
                      }
                    }}
                    onError={() => {
                      if (heroVideos.length > 1) {
                        setHeroIndex((previous) => (previous + 1) % heroVideos.length);
                      }
                    }}
                    src={videoSource}
                  />
                ))}
                <div className="carousel-overlay">
                  <p className="kicker landing-eyebrow reveal is-visible">{heroEyebrow}</p>
                  <h1 className="reveal is-visible">{roleDisplayName.toUpperCase()}</h1>
                  <h2 className="reveal is-visible">{heroSubtitle}</h2>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-separator" aria-hidden="true">
          <span>{navLabels.profile}</span>
        </section>

        <section className="section profile-detail-section">
          <div className="profile-two-col">
            <article className="profile-image-carousel-card">
              <div className="profile-image-carousel">
                {profileImages.slice(0, 16).map((image, index) => (
                  <div key={image} className={`profile-image-slide ${index === imageIndex ? 'is-active' : ''}`}>
                    <img src={image} alt={`${roleDisplayName} visual ${index + 1}`} loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </article>

            <article className="profile-text-carousel-card">
              <p className="eyebrow">{sectionLabels.profileEyebrow}</p>
              <h3>{activeSlide.title}</h3>
              <p>{activeSlide.text}</p>
              <div className="slide-dots" aria-hidden="true">
                {profileSlides.map((_, idx) => (
                  <span key={`dot-${idx}`} className={idx === textIndex ? 'active' : ''} />
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="profile-separator" aria-hidden="true">
          <span>{navLabels.challenges}</span>
        </section>

        <section id="challenges" className="section">
          <div className="section-heading reveal is-visible">
            <p className="eyebrow">{copy.labels.challengesEyebrow}</p>
            <h2>{sectionLabels.challengesTitle}</h2>
          </div>

          <div className="challenge-grid-four">
            {challenges.map((item, index) => (
              <article key={`${item}-${index}`} className="challenge-card">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-separator" aria-hidden="true">
          <span>{navLabels.services}</span>
        </section>

        <section id="services" className="section">
          <div className="section-heading reveal is-visible">
            <p className="eyebrow">{copy.labels.servicesEyebrow}</p>
            <h2>{sectionLabels.servicesTitle}</h2>
          </div>

          <div className="services-layout">
            <div className="services-single-col">
              {services.map((service, index) => (
                <article key={`${service.title}-${index}`} className="service-card-row">
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </article>
              ))}
            </div>

            {hasMasterclassVideos ? (
              <aside className="services-video-column" aria-label={`${roleDisplayName} services media`}>
                <div ref={servicesVideoShellRef} className="services-video-hero">
                  {masterclassVideos.map((videoSource, index) => (
                    <video
                      key={videoSource}
                      ref={(element) => {
                        servicesVideoRefs.current[index] = element;
                      }}
                      className={`services-video-media ${index === masterclassVideoIndex ? 'is-active' : ''}`}
                      autoPlay={index === masterclassVideoIndex}
                      muted={isServicesVideoMuted}
                      loop={masterclassVideos.length === 1}
                      playsInline
                      preload={index === masterclassVideoIndex || index === nextServicesVideoIndex ? 'auto' : 'metadata'}
                      onEnded={() => {
                        if (masterclassVideos.length > 1) {
                          setMasterclassVideoIndex((previous) => (previous + 1) % masterclassVideos.length);
                        }
                      }}
                      onError={() => {
                        if (masterclassVideos.length > 1) {
                          setMasterclassVideoIndex((previous) => (previous + 1) % masterclassVideos.length);
                        }
                      }}
                      src={videoSource}
                    />
                  ))}
                  <button
                    type="button"
                    className="services-video-audio-toggle"
                    onClick={() => setIsServicesVideoMuted((current) => !current)}
                    aria-pressed={!isServicesVideoMuted}
                    aria-label={isServicesVideoMuted ? 'Unmute video carousel' : 'Mute video carousel'}
                  >
                    {isServicesVideoMuted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              </aside>
            ) : null}
          </div>
        </section>

        <section className="profile-separator" aria-hidden="true">
          <span>{navLabels.masterclass}</span>
        </section>

        <section id="masterclass" className="section">
          <div className="section-heading reveal is-visible">
            <p className="eyebrow">{copy.labels.masterclassEyebrow}</p>
            <h2>{sectionLabels.masterclassTitle}</h2>
          </div>

          <article className="masterclass-kiosk-shell">
            <div className="masterclass-cover-panel">
              {masterclassImages.length > 0 ? (
                <div className="masterclass-cover-carousel" aria-label={`${roleDisplayName} masterclass carousel`}>
                  {masterclassImages.map((image, index) => (
                    <div key={image} className={`masterclass-cover-slide ${index === masterclassImageIndex ? 'is-active' : ''}`}>
                      <img src={image} alt={`${roleDisplayName} masterclass visual ${index + 1}`} loading="lazy" decoding="async" />
                    </div>
                  ))}
                </div>
              ) : activeMasterclassImage ? (
                <img src={activeMasterclassImage} alt={`${roleDisplayName} masterclass visual`} loading="lazy" decoding="async" />
              ) : (
                <div aria-hidden="true" className="masterclass-cover-empty" />
              )}
            </div>

            <div className="masterclass-benefits-panel">
              <h3>{masterclass.name}</h3>
              {masterclass.usp ? <p className="masterclass-usp">{masterclass.usp}</p> : null}
              <ul>
                {masterclass.benefits.map((benefit, index) => (
                  <li key={`${benefit}-${index}`}>{benefit}</li>
                ))}
              </ul>
              <p className="price-tag">{masterclass.price || copy.masterclass.price}</p>
              <a className="register-cta" href={eoexAgencyUrl} target="_blank" rel="noreferrer">
                {masterclass.cta}
              </a>
            </div>
          </article>
        </section>

      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand-block">
            <a href={eoexAgencyUrl} className="brand brand-with-logo">
              <img className="brand-logo" src={homeLogo} alt="EOEX logo" />
              <span className="brand-tagline">{copy.brandTagline}</span>
            </a>
          </div>

          <ul className="footer-nav-list">
            <li>
              <a href={`${homePageUrl}#about`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#about`);
              }}>
                {copy.footer.about}
              </a>
            </li>
            <li>
              <a href={`${homePageUrl}#masterclasses`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#masterclasses`);
              }}>
                {copy.footer.masterclasses}
              </a>
            </li>
            <li>
              <a href={`${homePageUrl}#contact`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#contact`);
              }}>
                {copy.footer.contact}
              </a>
            </li>
          </ul>

          <div className="footer-socials-block">
            <ul className="footer-social-list">
              <li>
                <a href="https://www.instagram.com/eoex.studio/" target="_blank" rel="noreferrer">@EOEX.STUDIO</a>
              </li>
            </ul>
          </div>
        </div>
        <small>
          <span> © {new Date().getFullYear()} EOEX. {copy.footer.privacy} · {copy.footer.terms}</span>
        </small>
      </footer>
    </div>
  );
}
