import careers1Raw from '../gallery/Landing-Pages/CAREERS-1.txt?raw';
import careers2Raw from '../gallery/Landing-Pages/CAREERS-2.txt?raw';
import careers3Raw from '../gallery/Landing-Pages/CAREERS-3.txt?raw';

const CAREERS_SOURCES = [
  { key: 'CAREERS-1.txt', raw: careers1Raw },
  { key: 'CAREERS-2.txt', raw: careers2Raw },
  { key: 'CAREERS-3.txt', raw: careers3Raw },
];

const DOCUMENT_HEADER_REGEX = /^\s*Document\s+(\d+)\s*(?:of\s*\d+\+?|\(Revised\))\s*:\s*(.+?)\s*$/i;

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getRoleLabelsFromTitle(title) {
  const englishBase = (title.split('(')[0] || '').trim();
  const english = englishBase ? toTitleCase(englishBase) : 'Creative Director';

  if (!title.includes('(') || !title.includes(')')) {
    return { en: english, fr: english };
  }

  const inside = title.split('(', 2)[1].split(')', 1)[0];
  const firstAlias = inside.split('/')[0].trim();
  return {
    en: english,
    fr: firstAlias || english,
  };
}

const ROLE_TOKEN_TRANSLATIONS = {
  es: {
    creative: 'creativo', director: 'director', fashion: 'moda', designer: 'diseñador', textile: 'textil',
    pattern: 'patronaje', maker: 'modelista', sample: 'muestras', sourcing: 'abastecimiento', manager: 'gerente',
    production: 'producción', quality: 'calidad', controller: 'controlador', logistics: 'logística', coordinator: 'coordinador',
    photographer: 'fotógrafo', videographer: 'videógrafo', stylist: 'estilista', makeup: 'maquillaje', artist: 'artista',
    hair: 'cabello', model: 'modelo', agent: 'agente', talent: 'talento', scout: 'cazatalentos', casting: 'casting',
    runway: 'pasarela', editorial: 'editorial', commercial: 'comercial', 'e-commerce': 'comercio electrónico',
    content: 'contenido', creator: 'creador', fit: 'ajuste', parts: 'partes', male: 'masculino',
    fitness: 'fitness', swimsuit: 'baño', lingerie: 'lencería', promotional: 'promocional', artistic: 'artístico',
    life: 'vida', showroom: 'showroom', atmosphere: 'ambiente', digital: 'digital', virtual: 'virtual',
    assistant: 'asistente', booking: 'reservas', influencer: 'influencers', social: 'social', media: 'medios',
    brand: 'marca', celebrity: 'celebridades', post: 'post', asset: 'activos', chief: 'director', officer: 'oficial',
  },
  it: {
    creative: 'creativo', director: 'direttore', fashion: 'moda', designer: 'designer', textile: 'tessile',
    pattern: 'modellistica', maker: 'modellista', sample: 'campionario', sourcing: 'approvvigionamento', manager: 'manager',
    production: 'produzione', quality: 'qualità', controller: 'controllore', logistics: 'logistica', coordinator: 'coordinatore',
    photographer: 'fotografo', videographer: 'videografo', stylist: 'stylist', makeup: 'trucco', artist: 'artista',
    hair: 'capelli', model: 'modello', agent: 'agente', talent: 'talenti', scout: 'scout', casting: 'casting',
    runway: 'passerella', editorial: 'editoriale', commercial: 'commerciale', 'e-commerce': 'e-commerce',
    content: 'contenuti', creator: 'creatore', fit: 'fit', parts: 'parti', male: 'maschile',
    fitness: 'fitness', swimsuit: 'costumi', lingerie: 'lingerie', promotional: 'promozionale', artistic: 'artistico',
    life: 'vita', showroom: 'showroom', atmosphere: 'atmosfera', digital: 'digitale', virtual: 'virtuale',
    assistant: 'assistente', booking: 'booking', influencer: 'influencer', social: 'social', media: 'media',
    brand: 'brand', celebrity: 'celebrità', post: 'post', asset: 'asset', chief: 'chief', officer: 'officer',
  },
  pt: {
    creative: 'criativo', director: 'diretor', fashion: 'moda', designer: 'designer', textile: 'textil',
    pattern: 'modelagem', maker: 'modelista', sample: 'amostras', sourcing: 'abastecimento', manager: 'gerente',
    production: 'produção', quality: 'qualidade', controller: 'controlador', logistics: 'logística', coordinator: 'coordenador',
    photographer: 'fotógrafo', videographer: 'videógrafo', stylist: 'estilista', makeup: 'maquiagem', artist: 'artista',
    hair: 'cabelo', model: 'modelo', agent: 'agente', talent: 'talentos', scout: 'olheiro', casting: 'casting',
    runway: 'passarela', editorial: 'editorial', commercial: 'comercial', 'e-commerce': 'e-commerce',
    content: 'conteúdo', creator: 'criador', fit: 'ajuste', parts: 'partes', male: 'masculino',
    fitness: 'fitness', swimsuit: 'banho', lingerie: 'lingerie', promotional: 'promocional', artistic: 'artístico',
    life: 'vida', showroom: 'showroom', atmosphere: 'atmosfera', digital: 'digital', virtual: 'virtual',
    assistant: 'assistente', booking: 'reservas', influencer: 'influenciador', social: 'social', media: 'midia',
    brand: 'marca', celebrity: 'celebridades', post: 'post', asset: 'ativos', chief: 'diretor', officer: 'oficial',
  },
  de: {
    creative: 'kreativ', director: 'direktor', fashion: 'mode', designer: 'designer', textile: 'textil',
    pattern: 'schnitt', maker: 'macher', sample: 'muster', sourcing: 'beschaffung', manager: 'manager',
    production: 'produktion', quality: 'qualität', controller: 'controller', logistics: 'logistik', coordinator: 'koordinator',
    photographer: 'fotograf', videographer: 'videograf', stylist: 'stylist', makeup: 'make-up', artist: 'artist',
    hair: 'haar', model: 'model', agent: 'agent', talent: 'talent', scout: 'scout', casting: 'casting',
    runway: 'laufsteg', editorial: 'editorial', commercial: 'kommerziell', 'e-commerce': 'e-commerce',
    content: 'inhalt', creator: 'creator', fit: 'passform', parts: 'teile', male: 'männlich',
    fitness: 'fitness', swimsuit: 'bademode', lingerie: 'dessous', promotional: 'promotion', artistic: 'kunst',
    life: 'leben', showroom: 'showroom', atmosphere: 'atmosphäre', digital: 'digital', virtual: 'virtuell',
    assistant: 'assistent', booking: 'booking', influencer: 'influencer', social: 'social', media: 'media',
    brand: 'marke', celebrity: 'promi', post: 'post', asset: 'assets', chief: 'chief', officer: 'officer',
  },
};

function normalizeTokenCase(token) {
  if (!token) return token;
  if (token === token.toUpperCase() && token.length <= 4) return token;
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

function localizeRoleLabel(roleEn, locale) {
  if (!roleEn) return roleEn;
  if (locale === 'en') return roleEn;

  const dictionary = ROLE_TOKEN_TRANSLATIONS[locale];
  if (!dictionary) return roleEn;

  const tokens = roleEn.split(/([\s\-/]+)/);
  const localized = tokens.map((token) => {
    if (!token || /[\s\-/]+/.test(token)) return token;
    const key = token.toLowerCase();
    const translated = dictionary[key];
    if (!translated) return normalizeTokenCase(token);
    return normalizeTokenCase(translated);
  });

  const raw = localized.join('').replace(/\s{2,}/g, ' ').trim();

  const rewriteByLocale = {
    es: [
      [/\bCreativo Director\b/g, 'Director Creativo'],
      [/\bModa Diseñador\b/g, 'Diseñador de Moda'],
      [/\bModa Videógrafo\b/g, 'Videógrafo de Moda'],
      [/\bModa Fotógraf[oa]\b/g, 'Fotógrafo de Moda'],
      [/\bModa Estilista\b/g, 'Estilista de Moda'],
      [/\bModa Maquillaje Artista\b/g, 'Maquillador de Moda'],
      [/\bModa Cabello Estilista\b/g, 'Peluquero de Moda'],
      [/\bModa Editorial\b/g, 'Editor de Moda'],
      [/\bModa Casting Director\b/g, 'Director de Selección de Talento de Moda'],
      [/\bModa Modelo Booker\b/g, 'Responsable de Reservas de Modelos'],
      [/\bTalento Gerente\b/g, 'Gestor de Talento'],
      [/\bPost-Producción Manager\b/g, 'Manager de Post-Producción'],
      [/\bPost-Producción Gerente\b/g, 'Gerente de Post-Producción'],
      [/\bDigital Chief Oficial\b/g, 'Chief Digital Officer'],
    ],
    it: [
      [/\bCreativo Direttore\b/g, 'Direttore Creativo'],
      [/\bModa Designer\b/g, 'Designer Moda'],
      [/\bModa Stylist\b/g, 'Stilista di Moda'],
      [/\bModa Trucco Artista\b/g, 'Truccatore di Moda'],
      [/\bModa Capelli Stylist\b/g, 'Parrucchiere di Moda'],
      [/\bModa Editoriale\b/g, 'Redattore di Moda'],
      [/\bModa Casting Direttore\b/g, 'Direttore Selezione Talenti Moda'],
      [/\bModa Modello Booker\b/g, 'Responsabile Prenotazioni Modelli'],
      [/\bTalenti Manager\b/g, 'Responsabile Talenti'],
      [/\bPost-Produzione Manager\b/g, 'Manager Post-Produzione'],
      [/\bDigitale Chief Officer\b/g, 'Chief Digital Officer'],
    ],
    pt: [
      [/\bCriativo Diretor\b/g, 'Diretor Criativo'],
      [/\bModa Designer\b/g, 'Designer de Moda'],
      [/\bModa Estilista\b/g, 'Estilista de Moda'],
      [/\bModa Maquiagem Artista\b/g, 'Maquiador de Moda'],
      [/\bModa Cabelo Estilista\b/g, 'Cabeleireiro de Moda'],
      [/\bModa Editorial\b/g, 'Editor de Moda'],
      [/\bModa Casting Diretor\b/g, 'Diretor de Seleção de Talentos de Moda'],
      [/\bModa Modelo Reservas\b/g, 'Responsável por Reservas de Modelos'],
      [/\bTalentos Gerente\b/g, 'Gestor de Talentos'],
      [/\bPost-Producao Gerente\b/g, 'Gerente de Pos-Producao'],
      [/\bDigital Diretor Oficial\b/g, 'Chief Digital Officer'],
    ],
    de: [
      [/\bKreativ Direktor\b/g, 'Kreativdirektor'],
      [/\bMode Designer\b/g, 'Modedesigner'],
      [/\bMode Stylist\b/g, 'Mode-Stylist'],
      [/\bMode Make-Up Artist\b/g, 'Maskenbildner für Mode'],
      [/\bMode Haar Stylist\b/g, 'Friseur für Mode'],
      [/\bMode Editorial\b/g, 'Mode-Redakteur'],
      [/\bMode Casting Direktor\b/g, 'Leiter Talentauswahl Mode'],
      [/\bMode Model Booking\b/g, 'Model-Disponent'],
      [/\bTalent Manager\b/g, 'Leiter Talentmanagement'],
      [/\bPost-Produktion Manager\b/g, 'Post-Produktion-Manager'],
      [/\bDigital Chief Officer\b/g, 'Chief Digital Officer'],
    ],
  };

  const rules = rewriteByLocale[locale] || [];
  return rules.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), raw);
}

function buildDocumentIndex() {
  const byId = {};

  CAREERS_SOURCES.forEach((source) => {
    const lines = source.raw.replace(/\r\n/g, '\n').split('\n');
    const headers = [];

    lines.forEach((line, index) => {
      const match = line.match(DOCUMENT_HEADER_REGEX);
      if (!match) return;
      headers.push({
        id: Number(match[1]),
        title: match[2].trim(),
        lineIndex: index,
      });
    });

    headers.forEach((header, idx) => {
      const nextStart = idx + 1 < headers.length ? headers[idx + 1].lineIndex : lines.length;
      const blockLines = lines.slice(header.lineIndex, nextStart);
      byId[header.id] = {
        id: header.id,
        sourceKey: source.key,
        title: header.title,
        roleLabels: getRoleLabelsFromTitle(header.title),
        content: blockLines.join('\n').trim(),
      };
    });
  });

  return byId;
}

const DOCUMENT_INDEX_BY_ID = buildDocumentIndex();

const MANUAL_PROFILE_LABELS = {
  3: {
    en: 'Textile Designer',
    fr: 'Designer textile',
    es: 'Diseñador Textil',
    it: 'Designer Tessile',
    pt: 'Designer Têxtil',
    de: 'Textildesigner',
  },
  4: {
    en: 'Pattern Maker',
    fr: 'Modéliste',
    es: 'Patronista',
    it: 'Modellista',
    pt: 'Modelista de Moldes',
    de: 'Schnittkonstrukteur',
  },
  5: {
    en: 'Sample Maker',
    fr: 'Prototypiste',
    es: 'Prototipista',
    it: 'Prototipista',
    pt: 'Prototipista',
    de: 'Prototypenmacher',
  },
  6: {
    en: 'Sourcing Manager',
    fr: 'Responsable des achats',
    es: 'Responsable de Abastecimiento',
    it: 'Responsabile Approvvigionamento',
    pt: 'Gerente de Abastecimento',
    de: 'Beschaffungsleiter',
  },
  7: {
    en: 'Production Manager',
    fr: 'Responsable de production',
    es: 'Gerente de Producción',
    it: 'Responsabile Produzione',
    pt: 'Gerente de Produção',
    de: 'Produktionsleiter',
  },
  8: {
    en: 'Quality Controller',
    fr: 'Responsable qualité',
    es: 'Controlador de Calidad',
    it: 'Controllore Qualità',
    pt: 'Controlador de Qualidade',
    de: 'Qualitätsprüfer',
  },
  9: {
    en: 'Logistics Coordinator',
    fr: 'Coordinateur logistique',
    es: 'Coordinador de Logística',
    it: 'Coordinatore Logistico',
    pt: 'Coordenador de Logística',
    de: 'Logistikkoordinator',
  },
  10: {
    en: 'Fashion Photographer',
    fr: 'Photographe de mode',
    es: 'Fotógrafo de Moda',
    it: 'Fotografo di Moda',
    pt: 'Fotógrafo de Moda',
    de: 'Modefotograf',
  },
  11: {
    en: 'Fashion Videographer',
    fr: 'Vidéaste de mode',
    es: 'Videógrafo de Moda',
    it: 'Videomaker di Moda',
    pt: 'Videógrafo de Moda',
    de: 'Modevideograf',
  },
  13: {
    en: 'Makeup Artist',
    fr: 'Maquilleur de mode',
    es: 'Maquillador de Moda',
    it: 'Truccatore di Moda',
    pt: 'Maquiador de Moda',
    de: 'Maskenbildner für Mode',
  },
  14: {
    en: 'Hair Stylist',
    fr: 'Coiffeur de mode',
    es: 'Peluquero de Moda',
    it: 'Parrucchiere di Moda',
    pt: 'Cabeleireiro de Moda',
    de: 'Friseur für Mode',
  },
  15: {
    en: 'Model Agent',
    fr: 'Agent de mannequins',
    es: 'Agente de Modelos',
    it: 'Agente di Modelli',
    pt: 'Agente de Modelos',
    de: 'Modelagent',
  },
  16: {
    en: 'Talent Scout',
    fr: 'Chasseur de talents',
    es: 'Cazatalentos',
    it: 'Scout di Talenti',
    pt: 'Olheiro de Talentos',
    de: 'Talentscout',
  },
  17: {
    en: 'Casting Director',
    fr: 'Directeur de sélection des talents',
    es: 'Director de Selección de Talento',
    it: 'Direttore Selezione Talenti',
    pt: 'Diretor de Seleção de Talentos',
    de: 'Leiter Talentauswahl',
  },
  18: {
    en: 'Runway Model',
    fr: 'Mannequin de défilé',
    es: 'Modelo de Pasarela',
    it: 'Modello da Passerella',
    pt: 'Modelo de Passarela',
    de: 'Laufstegmodel',
  },
  19: {
    en: 'Editorial Model',
    fr: 'Mannequin éditorial',
    es: 'Modelo Editorial',
    it: 'Modello Editoriale',
    pt: 'Modelo Editorial',
    de: 'Editorial-Model',
  },
  20: {
    en: 'Commercial Model',
    fr: 'Mannequin commercial',
    es: 'Modelo Comercial',
    it: 'Modello Commerciale',
    pt: 'Modelo Comercial',
    de: 'Werbemodel',
  },
  22: {
    en: 'UGC Content Creator',
    fr: 'Créateur de contenu UGC',
    es: 'Creador de Contenido UGC',
    it: 'Creatore di Contenuti UGC',
    pt: 'Criador de Conteúdo UGC',
    de: 'UGC-Inhaltsersteller',
  },
  35: {
    en: 'Photography Assistant',
    fr: 'Assistant photographe',
    es: 'Asistente de Fotografía',
    it: 'Assistente Fotografo',
    pt: 'Assistente de Fotografia',
    de: 'Fotoassistenz',
  },
  39: {
    en: 'Talent Manager',
    fr: 'Responsable des talents',
    es: 'Gestor de Talento',
    it: 'Responsabile Talenti',
    pt: 'Gestor de Talentos',
    de: 'Leiter Talentmanagement',
  },
  38: {
    en: 'Talent Agent',
    fr: 'Agent de talents',
    es: 'Agente de Talento',
    it: 'Agente di Talenti',
    pt: 'Agente de Talentos',
    de: 'Talentagent',
  },
  40: {
    en: 'Influencer Marketing Manager',
    fr: 'Responsable marketing d\'influence',
    es: 'Gerente de Marketing de Influencers',
    it: 'Responsabile Marketing Influencer',
    pt: 'Gerente de Marketing de Influenciadores',
    de: 'Influencer-Marketing-Manager',
  },
  41: {
    en: 'Social Media Manager',
    fr: 'Responsable des médias sociaux',
    es: 'Gerente de Redes Sociales',
    it: 'Responsabile Social Media',
    pt: 'Gerente de Mídias Sociais',
    de: 'Social-Media-Manager',
  },
  42: {
    en: 'Brand Marketing Manager',
    fr: 'Responsable marketing de marque',
    es: 'Gerente de Marketing de Marca',
    it: 'Responsabile Marketing di Marca',
    pt: 'Gerente de Marketing de Marca',
    de: 'Brand-Marketing-Manager',
  },
  43: {
    en: 'PR Manager',
    fr: 'Responsable des relations publiques',
    es: 'Gerente de Relaciones Públicas',
    it: 'Responsabile Relazioni Pubbliche',
    pt: 'Gerente de Relações Públicas',
    de: 'PR-Manager',
  },
  44: {
    en: 'Celebrity Booker',
    fr: 'Booker de célébrités',
    es: 'Booker de Celebridades',
    it: 'Booker Celebrità',
    pt: 'Booker de Celebridades',
    de: 'Promi-Booker',
  },
  45: {
    en: 'Talent Scout - Fashion',
    fr: 'Chasseur de talents mode',
    es: 'Cazatalentos de Moda',
    it: 'Scout di Talenti Moda',
    pt: 'Olheiro de Talentos de Moda',
    de: 'Talentscout Mode',
  },
  37: {
    en: 'Casting Assistant',
    fr: 'Assistant de sélection des talents',
    es: 'Asistente de Selección de Talento',
    it: 'Assistente Selezione Talenti',
    pt: 'Assistente de Seleção de Talentos',
    de: 'Assistenz Talentauswahl',
  },
  46: {
    en: 'Model Booker',
    fr: 'Chargé de réservation de mannequins',
    es: 'Responsable de Reservas de Modelos',
    it: 'Responsabile Prenotazioni Modelli',
    pt: 'Responsável por Reservas de Modelos',
    de: 'Model-Disponent',
  },
  47: {
    en: 'Casting Director',
    fr: 'Directeur de sélection des talents',
    es: 'Director de Selección de Talento',
    it: 'Direttore Selezione Talenti',
    pt: 'Diretor de Seleção de Talentos',
    de: 'Leiter Talentauswahl',
  },
  48: {
    en: 'Fashion Editor',
    fr: 'Éditeur de mode',
    es: 'Editor de Moda',
    it: 'Redattore di Moda',
    pt: 'Editor de Moda',
    de: 'Mode-Redakteur',
  },
  49: {
    en: 'Fashion Stylist - Editorial',
    fr: 'Styliste de mode éditorial',
    es: 'Estilista de Moda Editorial',
    it: 'Stilista Moda Editoriale',
    pt: 'Estilista de Moda Editorial',
    de: 'Mode-Stylist Editorial',
  },
  50: {
    en: 'Fashion Photographer - Editorial',
    fr: 'Photographe de mode éditorial',
    es: 'Fotógrafo de Moda Editorial',
    it: 'Fotografo di Moda Editoriale',
    pt: 'Fotógrafo de Moda Editorial',
    de: 'Modefotograf Editorial',
  },
  51: {
    en: 'Fashion Photographer - Commercial',
    fr: 'Photographe de mode commercial',
    es: 'Fotógrafo de Moda Comercial',
    it: 'Fotografo di Moda Commerciale',
    pt: 'Fotógrafo de Moda Comercial',
    de: 'Modefotograf Werbung',
  },
  52: {
    en: 'Fashion Videographer - Commercial',
    fr: 'Vidéaste de mode commercial',
    es: 'Videógrafo de Moda Comercial',
    it: 'Videomaker di Moda Commerciale',
    pt: 'Videógrafo de Moda Comercial',
    de: 'Modevideograf Werbung',
  },
  53: {
    en: 'Fashion Stylist - Commercial',
    fr: 'Styliste de mode commercial',
    es: 'Estilista de Moda Comercial',
    it: 'Stilista Moda Commerciale',
    pt: 'Estilista de Moda Comercial',
    de: 'Mode-Stylist Werbung',
  },
  54: {
    en: 'Makeup Artist - Commercial',
    fr: 'Maquilleur commercial',
    es: 'Maquillador Comercial',
    it: 'Truccatore Commerciale',
    pt: 'Maquiador Comercial',
    de: 'Visagist Werbung',
  },
  55: {
    en: 'Hair Stylist - Commercial',
    fr: 'Coiffeur commercial',
    es: 'Peluquero Comercial',
    it: 'Parrucchiere Commerciale',
    pt: 'Cabeleireiro Comercial',
    de: 'Friseur Werbung',
  },
  56: {
    en: 'Production Manager - Commercial',
    fr: 'Responsable de production commerciale',
    es: 'Gerente de Producción Comercial',
    it: 'Responsabile Produzione Commerciale',
    pt: 'Gerente de Produção Comercial',
    de: 'Produktionsleiter Werbung',
  },
  58: {
    en: 'Digital Asset Manager',
    fr: 'Responsable des actifs numériques',
    es: 'Gestor de Activos Digitales',
    it: 'Responsabile Asset Digitali',
    pt: 'Gestor de Ativos Digitais',
    de: 'Digital-Asset-Manager',
  },
  59: {
    en: 'E-commerce Manager',
    fr: 'Responsable e-commerce',
    es: 'Gerente de E-commerce',
    it: 'Responsabile E-commerce',
    pt: 'Gerente de E-commerce',
    de: 'E-Commerce-Manager',
  },
  60: {
    en: 'Chief Digital Officer',
    fr: 'Directeur numérique',
    es: 'Director Digital',
    it: 'Direttore Digitale',
    pt: 'Diretor Digital',
    de: 'Digitalvorstand',
  },
  61: {
    en: 'Fashion Modelling School Director',
    fr: 'Directeur d\'école de mannequinat',
    es: 'Director de escuela de modelaje de moda',
    it: 'Direttore di scuola di modellazione moda',
    pt: 'Diretor de escola de modelagem de moda',
    de: 'Leiter einer Fashion-Modelschule',
  },
  62: {
    en: 'Fashion Design School Director',
    fr: 'Directeur d\'école de design de mode',
    es: 'Director de escuela de diseño de moda',
    it: 'Direttore di scuola di design della moda',
    pt: 'Diretor de escola de design de moda',
    de: 'Leiter einer Modeschule für Design',
  },
};

export function getProfileDocument(profileId) {
  return DOCUMENT_INDEX_BY_ID[profileId] || null;
}

export function getProfileRoleLabel(profileId, locale = 'en') {
  const manual = MANUAL_PROFILE_LABELS[profileId];
  if (manual) {
    return manual[locale] || manual.en;
  }

  const document = getProfileDocument(profileId);
  const labels = document?.roleLabels || { en: 'Creative Director', fr: 'Directeur artistique' };
  if (locale === 'fr') return labels.fr || labels.en;
  if (locale === 'en') return labels.en;
  return localizeRoleLabel(labels.en, locale);
}

export function getProfileRoleSummary(profileId, locale = 'en') {
  const trackFromRole = (roleLabel) => {
    const value = String(roleLabel || '').toLowerCase();
    if (/(school director|école|escuela|scuola|schule|education|teaching|pedagog)/.test(value)) return 'education';
    if (/(photographer|videographer|editorial|post-production)/.test(value)) return 'content';
    if (/(model|casting|booker|talent|agent|scout)/.test(value)) return 'talent';
    if (/(production|sourcing|quality|logistics|pattern maker|sample maker)/.test(value)) return 'operations';
    if (/(marketing|pr manager|social media|brand marketing|influencer)/.test(value)) return 'marketing';
    if (/(e-commerce|digital asset|chief digital officer|digital)/.test(value)) return 'digital';
    return 'creative';
  };

  const role = getProfileRoleLabel(profileId, locale);
  const track = trackFromRole(role);
  const localeCode = String(locale || 'en').slice(0, 2).toLowerCase();

  const palette = {
    en: {
      openers: ['helps you steer', 'lets you stabilize', 'gives you leverage over', 'clarifies your approach to', 'keeps you sharp across'],
      pivots: ['daily execution pressure', 'cross-team handoffs', 'time-sensitive priorities', 'quality-risk moments'],
      closers: ['with a calmer decision rhythm', 'while protecting brand standards', 'without losing delivery pace'],
      tracks: {
        creative: ['creative direction, brand clarity, and signature consistency', 'collection intent, visual language, and leadership alignment', 'aesthetic authority, critique discipline, and execution coherence', 'brand DNA protection, trend discernment, and creative governance'],
        content: ['editorial storytelling, production flow, and post-production quality', 'shoot orchestration, narrative pacing, and visual continuity', 'camera direction, editing cadence, and platform adaptation', 'content planning, set reliability, and publication readiness'],
        talent: ['casting precision, talent readiness, and career protection', 'model development, agency alignment, and rights awareness', 'placement strategy, ethical scouting, and long-term progression', 'profile positioning, booking quality, and trust-based growth'],
        operations: ['production control, quality discipline, and margin resilience', 'supplier coordination, technical handoffs, and delivery reliability', 'planning rigor, risk containment, and throughput stability', 'execution timing, process visibility, and cost protection'],
        marketing: ['campaign coherence, audience traction, and conversion intent', 'PR-social alignment, messaging precision, and launch momentum', 'brand narrative timing, channel orchestration, and signal clarity', 'acquisition efficiency, retention quality, and market relevance'],
        digital: ['commerce flow, catalog clarity, and conversion durability', 'asset systems, funnel optimization, and CX consistency', 'data-informed decisions, merchandising logic, and lifecycle growth', 'platform performance, governance quality, and experimentation speed'],
        education: ['curriculum clarity, student progression, and pedagogical quality', 'faculty alignment, learning outcomes, and accreditation readiness', 'industry-linked training, employability pathways, and school reputation', 'classroom standards, mentoring systems, and portfolio-readiness discipline'],
      },
    },
    fr: {
      openers: ['vous aide à piloter', 'vous permet de stabiliser', 'vous donne un vrai levier sur', 'clarifie votre manière d’aborder', 'vous rend plus solide face à'],
      pivots: ['la pression d’exécution', 'les interfaces entre équipes', 'les priorités à délai court', 'les moments à risque qualité'],
      closers: ['avec des décisions plus nettes', 'sans sacrifier l’exigence de marque', 'tout en gardant une cadence crédible'],
      tracks: {
        creative: ['direction créative, cohérence de marque et signature visuelle', 'intention de collection, langage visuel et alignement leadership', 'autorité esthétique, discipline de critique et cohérence d’exécution', 'protection de l’ADN de marque, lecture des tendances et gouvernance créative'],
        content: ['narration éditoriale, flux de production et qualité post-production', 'orchestration de shooting, rythme narratif et continuité visuelle', 'direction caméra, cadence de montage et adaptation plateforme', 'planification contenu, fiabilité plateau et préparation publication'],
        talent: ['précision de casting, maturité talent et protection de trajectoire', 'développement modèle, alignement agence et vigilance sur les droits', 'stratégie de placement, scouting éthique et progression durable', 'positionnement profil, qualité de booking et croissance fondée sur la confiance'],
        operations: ['maîtrise de production, discipline qualité et résilience de marge', 'coordination fournisseurs, handoffs techniques et fiabilité de livraison', 'rigueur de planification, contrôle du risque et stabilité du flux', 'timing d’exécution, visibilité process et protection des coûts'],
        marketing: ['cohérence de campagne, traction audience et intention de conversion', 'alignement PR-social, précision du message et dynamique de lancement', 'timing narratif de marque, orchestration des canaux et clarté des signaux', 'efficience d’acquisition, qualité de rétention et pertinence marché'],
        digital: ['parcours e-commerce, clarté catalogue et solidité conversion', 'système d’actifs, optimisation du funnel et cohérence CX', 'décisions data, logique merchandising et croissance lifecycle', 'performance plateforme, qualité de gouvernance et vitesse d’expérimentation'],
        education: ['clarté pédagogique, progression des étudiants et qualité d\'enseignement', 'alignement des formateurs, résultats d\'apprentissage et préparation accréditation', 'formation liée à l\'industrie, employabilité et réputation de l\'école', 'standards de classe, mentorat et discipline de portfolio professionnel'],
      },
    },
    es: {
      openers: ['te ayuda a conducir', 'te permite estabilizar', 'te da más margen sobre', 'aclara cómo abordar', 'te hace más fuerte frente a'],
      pivots: ['la presión de ejecución', 'los traspasos entre equipos', 'las prioridades con poco tiempo', 'los momentos de riesgo de calidad'],
      closers: ['con decisiones más claras', 'sin perder el estándar de marca', 'manteniendo ritmo de entrega'],
      tracks: {
        creative: ['dirección creativa, coherencia de marca y firma visual', 'intención de colección, lenguaje visual y alineación de liderazgo', 'autoridad estética, disciplina de revisión y coherencia de ejecución', 'protección del ADN de marca, lectura de tendencias y gobernanza creativa'],
        content: ['narrativa editorial, flujo de producción y calidad de postproducción', 'orquestación de shootings, ritmo narrativo y continuidad visual', 'dirección de cámara, cadencia de edición y adaptación por plataforma', 'planificación de contenidos, fiabilidad de set y preparación de publicación'],
        talent: ['precisión de casting, preparación del talento y protección de carrera', 'desarrollo de modelos, alineación con agencias y claridad en derechos', 'estrategia de colocación, scouting ético y progresión sostenible', 'posicionamiento de perfil, calidad de booking y crecimiento con confianza'],
        operations: ['control de producción, disciplina de calidad y resiliencia de margen', 'coordinación de proveedores, handoffs técnicos y fiabilidad de entrega', 'rigor de planificación, contención de riesgo y estabilidad operativa', 'timing de ejecución, visibilidad de proceso y protección de costos'],
        marketing: ['coherencia de campaña, tracción de audiencia e intención de conversión', 'alineación PR-social, precisión de mensaje y fuerza de lanzamiento', 'timing narrativo de marca, orquestación de canales y lectura de señales', 'eficiencia de adquisición, calidad de retención y relevancia de mercado'],
        digital: ['flujo de e-commerce, claridad de catálogo y conversión sostenible', 'sistema de activos, optimización de embudo y consistencia de experiencia', 'decisiones con datos, lógica de merchandising y crecimiento de ciclo de vida', 'rendimiento de plataforma, calidad de gobernanza y velocidad de experimentación'],
        education: ['claridad curricular, progreso estudiantil y calidad pedagógica', 'alineación docente, resultados de aprendizaje y preparación para acreditación', 'formación conectada con la industria, empleabilidad y reputación académica', 'estándares de clase, mentoría y disciplina de portafolio profesional'],
      },
    },
    it: {
      openers: ['ti aiuta a guidare', 'ti permette di stabilizzare', 'ti dà più margine su', 'chiarisce come affrontare', 'ti rende più solida davanti a'],
      pivots: ['la pressione di esecuzione', 'i passaggi tra team', 'le priorità a tempo ridotto', 'i momenti a rischio qualità'],
      closers: ['con decisioni più nitide', 'senza perdere standard di brand', 'mantenendo ritmo di delivery'],
      tracks: {
        creative: ['direzione creativa, coerenza di brand e firma visiva', 'intenzione di collezione, linguaggio visivo e allineamento di leadership', 'autorevolezza estetica, disciplina di revisione e coerenza esecutiva', 'protezione del DNA di brand, lettura trend e governance creativa'],
        content: ['narrazione editoriale, flusso di produzione e qualità post-produzione', 'orchestrazione shooting, ritmo narrativo e continuità visiva', 'direzione camera, cadenza di montaggio e adattamento piattaforma', 'pianificazione contenuti, affidabilità set e prontezza pubblicazione'],
        talent: ['precisione casting, maturità talento e tutela della carriera', 'sviluppo model, allineamento agenzia e consapevolezza dei diritti', 'strategia di placement, scouting etico e progressione sostenibile', 'posizionamento profilo, qualità booking e crescita basata sulla fiducia'],
        operations: ['controllo produzione, disciplina qualità e resilienza del margine', 'coordinamento fornitori, handoff tecnici e affidabilità di consegna', 'rigore di pianificazione, contenimento rischio e stabilità operativa', 'timing esecutivo, visibilità processo e protezione dei costi'],
        marketing: ['coerenza campagna, trazione audience e intenzione di conversione', 'allineamento PR-social, precisione messaggio e slancio di lancio', 'timing narrativo di marca, orchestrazione canali e lettura segnali', 'efficienza acquisizione, qualità retention e rilevanza di mercato'],
        digital: ['flusso e-commerce, chiarezza catalogo e conversione solida', 'sistema asset, ottimizzazione funnel e coerenza esperienza', 'decisioni data-driven, logica merchandising e crescita lifecycle', 'performance piattaforma, qualità governance e velocità sperimentazione'],
        education: ['chiarezza curricolare, progressione studenti e qualità didattica', 'allineamento docenti, risultati formativi e preparazione accreditamento', 'formazione legata all\'industria, occupabilità e reputazione della scuola', 'standard d\'aula, mentoring e disciplina portfolio professionale'],
      },
    },
    pt: {
      openers: ['ajuda você a conduzir', 'permite que você estabilize', 'dá mais margem sobre', 'deixa mais claro como enfrentar', 'torna você mais forte diante de'],
      pivots: ['a pressão de execução', 'as passagens entre equipes', 'as prioridades com pouco prazo', 'os momentos de risco de qualidade'],
      closers: ['com decisões mais firmes', 'sem perder o padrão da marca', 'mantendo ritmo de entrega'],
      tracks: {
        creative: ['direção criativa, coerência de marca e assinatura visual', 'intenção de coleção, linguagem visual e alinhamento de liderança', 'autoridade estética, disciplina de revisão e coerência de execução', 'proteção do DNA da marca, leitura de tendências e governança criativa'],
        content: ['narrativa editorial, fluxo de produção e qualidade de pós-produção', 'orquestração de shooting, ritmo narrativo e continuidade visual', 'direção de câmera, cadência de edição e adaptação por plataforma', 'planejamento de conteúdo, confiabilidade de set e prontidão para publicação'],
        talent: ['precisão de casting, preparo do talento e proteção de carreira', 'desenvolvimento de modelos, alinhamento com agência e clareza de direitos', 'estratégia de colocação, scouting ético e progressão sustentável', 'posicionamento de perfil, qualidade de booking e crescimento com confiança'],
        operations: ['controle de produção, disciplina de qualidade e resiliência de margem', 'coordenação de fornecedores, handoffs técnicos e confiabilidade de entrega', 'rigor de planejamento, contenção de risco e estabilidade operacional', 'timing de execução, visibilidade de processo e proteção de custos'],
        marketing: ['coerência de campanha, tração de audiência e intenção de conversão', 'alinhamento PR-social, precisão de mensagem e força de lançamento', 'timing narrativo de marca, orquestração de canais e leitura de sinais', 'eficiência de aquisição, qualidade de retenção e relevância de mercado'],
        digital: ['fluxo de e-commerce, clareza de catálogo e conversão sustentável', 'sistema de ativos, otimização de funil e consistência de experiência', 'decisões com dados, lógica de merchandising e crescimento de ciclo de vida', 'performance de plataforma, qualidade de governança e velocidade de experimentação'],
        education: ['clareza curricular, progressão de estudantes e qualidade pedagógica', 'alinhamento docente, resultados de aprendizagem e preparação para acreditação', 'formação conectada à indústria, empregabilidade e reputação da escola', 'padrões de sala, mentoria e disciplina de portfólio profissional'],
      },
    },
    de: {
      openers: ['hilft Ihnen, besser zu steuern', 'ermöglicht Ihnen mehr Stabilität bei', 'gibt Ihnen mehr Hebel auf', 'schärft Ihren Umgang mit', 'macht Sie robuster gegenüber'],
      pivots: ['dem Ausführungsdruck', 'bereichsübergreifenden Übergaben', 'zeitkritischen Prioritäten', 'Qualitätsrisiken in kritischen Phasen'],
      closers: ['mit klareren Entscheidungen', 'ohne den Markenstandard zu verlieren', 'bei verlässlichem Umsetzungstempo'],
      tracks: {
        creative: ['kreativer Führung, Markenkohärenz und visueller Handschrift', 'Kollektion-Intention, visueller Sprache und Leadership-Ausrichtung', 'ästhetischer Autorität, Review-Disziplin und Ausführungskohärenz', 'Schutz der Marken-DNA, Trendlesung und kreativer Governance'],
        content: ['editorialem Storytelling, Produktionsfluss und Postproduktionsqualität', 'Shooting-Orchestrierung, Erzählrhythmus und visueller Kontinuität', 'Kameraführung, Schnittkadenz und Plattformadaption', 'Content-Planung, Set-Zuverlässigkeit und Veröffentlichungsreife'],
        talent: ['Casting-Präzision, Talent-Reife und Karriereabsicherung', 'Model-Entwicklung, Agenturabstimmung und Rechtebewusstsein', 'Placement-Strategie, ethischem Scouting und nachhaltiger Entwicklung', 'Profilpositionierung, Booking-Qualität und vertrauensbasierter Entwicklung'],
        operations: ['Produktionskontrolle, Qualitätsdisziplin und Margenresilienz', 'Lieferantenkoordination, technische Handoffs und Liefersicherheit', 'Planungsrigor, Risikoeindämmung und operativer Stabilität', 'Ausführungstiming, Prozesssichtbarkeit und Kostenschutz'],
        marketing: ['Kampagnenkohärenz, Audience-Traktion und Conversion-Absicht', 'PR-Social-Ausrichtung, Nachrichtenpräzision und Launch-Dynamik', 'Marken-Narrativ-Timing, Kanalorchestrierung und Signal-Klarheit', 'Akquisitions-Effizienz, Retentionsqualität und Marktrelevanz'],
        digital: ['E-Commerce-Fluss, Katalogklarheit und stabiler Conversion', 'Asset-Systemen, Funnel-Optimierung und CX-Konsistenz', 'dateninformierten Entscheidungen, Merchandising-Logik und Lifecycle-Wachstum', 'Plattformleistung, Governance-Qualität und Experimentiergeschwindigkeit'],
        education: ['curriculare Klarheit, Lernfortschritt und pädagogische Qualität', 'Dozierenden-Ausrichtung, Lernergebnisse und Akkreditierungsbereitschaft', 'branchennahe Ausbildung, Beschäftigungsfähigkeit und Schulreputation', 'Klassenstandards, Mentoring-Systeme und professionelle Portfolio-Disziplin'],
      },
    },
  };

  const localePack = palette[localeCode] || palette.en;
  const profileOffset = Math.max(0, Number(profileId || 1) - 1);
  const opener = localePack.openers[profileOffset % localePack.openers.length];
  const pivot = localePack.pivots[profileOffset % localePack.pivots.length];
  const closer = localePack.closers[profileOffset % localePack.closers.length];
  const trackPool = localePack.tracks[track] || localePack.tracks.creative;
  const trackFocus = trackPool[profileOffset % trackPool.length];

  const formatterByLocale = {
    en: `${role} ${opener} ${trackFocus}, even under ${pivot}, ${closer}.`,
    fr: `${role} ${opener} ${trackFocus}, même sous ${pivot}, ${closer}.`,
    es: `${role} ${opener} ${trackFocus}, incluso con ${pivot}, ${closer}.`,
    it: `${role} ${opener} ${trackFocus}, anche con ${pivot}, ${closer}.`,
    pt: `${role} ${opener} ${trackFocus}, mesmo com ${pivot}, ${closer}.`,
    de: `${role} ${opener} ${trackFocus}, selbst bei ${pivot}, ${closer}.`,
  };

  return formatterByLocale[localeCode] || formatterByLocale.en;
}

export function getProfileSourceKey(profileId) {
  return getProfileDocument(profileId)?.sourceKey || 'CAREERS-1.txt';
}
