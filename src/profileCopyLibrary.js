import { getProfileRoleLabel } from './careersDocumentIndex.js';

const GENERATED_PROFILE_IDS = Array.from({ length: 56 }, (_, index) => 7 + index);

export const PROFILE_ROLE_BY_ID = Object.fromEntries(
  Array.from({ length: 62 }, (_, index) => {
    const profileId = index + 1;
    return [profileId, `profile_${profileId}`];
  }),
);

function detectRoleTrackFromLabel(roleLabel) {
  const value = String(roleLabel || '').toLowerCase();

  if (/(school director|école|escuela|scuola|schule|education|teaching|pedagog|curriculum|academic|mannequinat|modelaje|modellazione|modelagem|didactic|didattica|didática)/.test(value)) return 'education';
  if (/(model|modèle|mannequin|modelo|modello|modelagem|modelaje|modell|casting|booker|talent|talento|talenti|agent|agente|scout|olheiro|chasseur)/.test(value)) return 'talent';
  if (/(photographer|videographer|editorial|post-production|post production|camera|video|ugc|content creator|creator)/.test(value)) return 'content';
  if (/(production|sourcing|quality|logistics|pattern maker|sample maker|operations)/.test(value)) return 'operations';
  if (/(marketing|pr manager|social media|brand marketing|influencer)/.test(value)) return 'marketing';
  if (/(e-commerce|digital asset|chief digital officer|digital)/.test(value)) return 'digital';
  return 'creative';
}

export function getCanonicalRoleLabel(profileKey, locale) {
  const profileId = Number(String(profileKey || '').replace('profile_', ''));
  if (!Number.isInteger(profileId) || profileId < 1 || profileId > 62) {
    return getProfileRoleLabel(1, locale);
  }
  return getProfileRoleLabel(profileId, locale);
}

function validateCanonicalRoleLexicon(library) {
  Object.entries(library).forEach(([profileKey, localeMap]) => {
    Object.entries(localeMap).forEach(([locale, copy]) => {
      const canonical = getCanonicalRoleLabel(profileKey, locale);
      if (copy.roleName !== canonical || copy.navProfile !== canonical) {
        throw new Error(
          `Non-approved role label blocked for ${profileKey}/${locale}. Expected "${canonical}" and received roleName="${copy.roleName}" navProfile="${copy.navProfile}".`,
        );
      }
    });
  });
}

function roleSpecificChallengesTitle(roleName, locale) {
  const templates = {
    en: `Where ${roleName} is most tested in real work`,
    fr: `Où le rôle de ${roleName} est le plus mis à l'épreuve sur le terrain`,
    es: `Dónde el rol de ${roleName} se pone más a prueba en la práctica`,
    it: `Dove il ruolo di ${roleName} viene più messo alla prova nella pratica`,
    pt: `Onde o papel de ${roleName} é mais testado na prática`,
    de: `Wo die Rolle ${roleName} in der Praxis am stärksten gefordert ist`,
  };

  return templates[locale] || templates.en;
}

function roleSpecificMasterclassName(roleName, locale) {
  const templates = {
    en: `Masterclass for ${roleName}`,
    fr: `Masterclass pour ${roleName}`,
    es: `Masterclass para ${roleName}`,
    it: `Masterclass per ${roleName}`,
    pt: `Masterclass para ${roleName}`,
    de: `Masterclass für ${roleName}`,
  };

  return templates[locale] || templates.en;
}

function roleSpecificMasterclassUsp(roleName, locale) {
  const templates = {
    en: `A role-specific masterclass for ${roleName}, built around real decisions, pressure cycles, and measurable outcomes.`,
    fr: `Une masterclass spécifique au rôle de ${roleName}, construite autour de décisions réelles, de cycles de pression et d’impacts mesurables.`,
    es: `Una masterclass específica para ${roleName}, diseñada en torno a decisiones reales, ciclos de presión y resultados medibles.`,
    it: `Una masterclass specifica per ${roleName}, costruita su decisioni reali, cicli di pressione e risultati misurabili.`,
    pt: `Uma masterclass específica para ${roleName}, construída em torno de decisões reais, ciclos de pressão e resultados mensuráveis.`,
    de: `Eine rollenspezifische masterclass für ${roleName}, aufgebaut auf realen Entscheidungen, Druckzyklen und messbaren Ergebnissen.`,
  };

  return templates[locale] || templates.en;
}

function roleSpecificMasterclassTitle(roleName, locale) {
  const templates = {
    en: `Become a better, ${roleName}`,
    fr: `Devenez meilleur en tant que ${roleName}`,
    es: `Conviértete en mejor ${roleName}`,
    it: `Diventa un ${roleName} migliore`,
    pt: `Torne-se um(a) ${roleName} melhor`,
    de: `Werden Sie besser als ${roleName}`,
  };

  return templates[locale] || templates.en;
}

function parseProfileId(profileKey) {
  const id = Number(String(profileKey || '').replace('profile_', ''));
  return Number.isInteger(id) ? id : 1;
}

function getMasterclassPriceByRole(roleReferenceEn) {
  const role = String(roleReferenceEn || '').toLowerCase();
  const isDirector = /\bdirector\b|chief\s*digital\s*officer/.test(role);
  const isModelException = /(ugc\s*content\s*creator|model\s*agent)/.test(role);
  const isModel = /\bmodel\b/.test(role) && !/(agent|booker|casting|manager|school)/.test(role);

  if (isDirector) return '€350';
  if (isModelException) return '€150';
  if (isModel) return '€150';
  return '€250';
}

function detectRolePersona(roleReferenceEn) {
  const value = String(roleReferenceEn || '').toLowerCase();
  if (/fashion\s*design\s*school\s*director/.test(value)) return 'schoolDirectorDesign';
  if (/fashion\s*modelling\s*school\s*director|fashion\s*modeling\s*school\s*director/.test(value)) return 'schoolDirectorModelling';
  if (/fashion\s*designer/.test(value)) return 'fashionDesigner';
  if (/fashion\s*photographer/.test(value)) return 'fashionPhotographer';
  if (/fashion\s*videographer/.test(value)) return 'fashionVideographer';
  if (/fashion\s*stylist/.test(value)) return 'fashionStylist';
  if (/model\s*agent/.test(value)) return 'modelAgent';
  if (/talent\s*agent/.test(value)) return 'talentAgent';
  if (/talent\s*scout/.test(value)) return 'talentScout';
  if (/ugc\s*content\s*creator/.test(value)) return 'ugcModel';
  if (/e-?commerce\s*model/.test(value)) return 'ecommerceModel';
  if (/casting\s*assistant/.test(value)) return 'castingAssistant';
  if (/\bmodel\b/.test(value)) return 'fashionModel';
  if (/(casting director|model booker|booker|talent manager|talent agent|talent scout|scout)/.test(value)) return 'talentOps';
  return null;
}

function getExtendedPersonaFocus(locale, persona) {
  const focusByLocale = {
    en: {
      fashionDesigner: {
        day: 'collection concept-to-sample decisions',
        coordination: 'pattern teams, sourcing, and atelier execution',
        quality: 'fit, material, cost, and identity trade-offs',
        rights: 'supplier terms and design-protection clauses',
        growth: 'seasonal calendar discipline and margin stability',
      },
      fashionPhotographer: {
        day: 'pre-production, lighting tests, and shot sequencing',
        coordination: 'stylists, makeup, retouching, and art direction',
        quality: 'image selection, color consistency, and visual hierarchy',
        rights: 'usage rights, exclusivity windows, and renewal scope',
        growth: 'editorial and commercial booking balance',
      },
      fashionVideographer: {
        day: 'storyboarding, camera movement, and edit rhythm',
        coordination: 'crew timing, set continuity, and post-production handoff',
        quality: 'narrative clarity across campaign and social versions',
        rights: 'usage rights for campaign, e-commerce, and social cuts',
        growth: 'repeatable production profitability over time',
      },
      fashionStylist: {
        day: 'look architecture and silhouette coherence under deadline',
        coordination: 'designer, photographer, makeup, and casting alignment',
        quality: 'fitting decisions and last-minute substitutions',
        rights: 'pull agreements, returns, and product-care compliance',
        growth: 'signature positioning that drives repeat bookings',
      },
      modelAgent: {
        day: 'portfolio strategy, submissions, and casting follow-up',
        coordination: 'clients, agencies, and model readiness planning',
        quality: 'role fit, reliability checks, and booking precision',
        rights: 'contracts, usage territories, and renewal negotiations',
        growth: 'pipeline stability and long-term career protection',
      },
      talentScout: {
        day: 'early talent detection in real field contexts',
        coordination: 'agencies, schools, and local creative communities',
        quality: 'potential evaluation beyond surface social metrics',
        rights: 'ethical onboarding, consent clarity, and trust safeguards',
        growth: 'development pathways after discovery',
      },
      talentAgent: {
        day: 'deal structuring and career sequencing decisions',
        coordination: 'brand, client, and agency negotiations',
        quality: 'offer quality, workload balance, and strategic timing',
        rights: 'rights renewals, conflicts, and exclusivity boundaries',
        growth: 'long-term earnings stability and reputation protection',
      },
      schoolDirectorModelling: {
        day: 'curriculum direction for runway, editorial, and e-commerce modeling',
        coordination: 'faculty alignment and shared assessment standards',
        quality: 'student coaching quality and employability readiness',
        rights: 'image-rights policy, safeguarding, and legal compliance',
        growth: 'placement outcomes and school reputation durability',
      },
      schoolDirectorDesign: {
        day: 'curriculum direction from concept to collection delivery',
        coordination: 'faculty teams, workshops, and production mentoring',
        quality: 'technical review of pattern, fit, and material decisions',
        rights: 'intellectual property and collaboration agreement clarity',
        growth: 'graduate placement quality and industry partnership depth',
      },
    },
    fr: {
      fashionDesigner: {
        day: 'les décisions quotidiennes du concept à l’échantillon',
        coordination: 'les équipes modélisme, achats et atelier',
        quality: 'les arbitrages fit, matière, coût et identité',
        rights: 'les conditions fournisseurs et la protection des créations',
        growth: 'la tenue du calendrier de saison et de la marge',
      },
      fashionPhotographer: {
        day: 'la préparation, les tests lumière et la séquence de prises',
        coordination: 'stylisme, maquillage, retouche et direction artistique',
        quality: 'la sélection d’images, la cohérence colorimétrique et la hiérarchie visuelle',
        rights: 'les droits d’usage, exclusivités et renouvellements',
        growth: 'l’équilibre entre commandes éditoriales et commerciales',
      },
      fashionVideographer: {
        day: 'le storyboard, le mouvement caméra et le rythme de montage',
        coordination: 'les équipes de tournage, la continuité plateau et la postproduction',
        quality: 'la clarté narrative entre versions campagne et social',
        rights: 'les droits d’usage pour campagne, e-commerce et déclinaisons social',
        growth: 'la rentabilité de production répétable dans le temps',
      },
      fashionStylist: {
        day: 'l’architecture des looks et la cohérence des silhouettes sous délai',
        coordination: 'design, photo, maquillage et casting',
        quality: 'les décisions de fitting et substitutions de dernière minute',
        rights: 'les accords de prêt, retours et conformité entretien produit',
        growth: 'un positionnement signature qui génère des rebookings',
      },
      modelAgent: {
        day: 'la stratégie de portfolio, les propositions et le suivi casting',
        coordination: 'clients, agences et préparation des mannequins',
        quality: 'l’adéquation profil, la fiabilité et la précision booking',
        rights: 'les contrats, territoires d’usage et renouvellements',
        growth: 'la stabilité du pipeline et la protection de trajectoire',
      },
      talentScout: {
        day: 'la détection précoce des talents sur le terrain',
        coordination: 'agences, écoles et scènes créatives locales',
        quality: 'l’évaluation du potentiel au-delà des métriques sociales visibles',
        rights: 'l’intégration éthique, le consentement et les garde-fous de confiance',
        growth: 'les parcours de développement après la découverte',
      },
      talentAgent: {
        day: 'la structuration des offres et le séquençage de carrière',
        coordination: 'les négociations marque, client et agence',
        quality: 'la qualité des offres, l’équilibre de charge et le bon timing',
        rights: 'les renouvellements de droits, conflits et limites d’exclusivité',
        growth: 'la stabilité des revenus et la protection de réputation',
      },
      schoolDirectorModelling: {
        day: 'le pilotage du programme pour défilé, éditorial et e-commerce',
        coordination: 'l’alignement des formateurs et des critères d’évaluation',
        quality: 'la qualité d’accompagnement et l’employabilité des étudiants',
        rights: 'la politique de droit à l’image, la protection des élèves et la conformité',
        growth: 'les résultats de placement et la réputation durable de l’école',
      },
      schoolDirectorDesign: {
        day: 'le pilotage curriculaire du concept à la collection',
        coordination: 'les équipes pédagogiques, ateliers et mentorat production',
        quality: 'l’évaluation technique du patronage, du fit et des matières',
        rights: 'la propriété intellectuelle et les accords de collaboration',
        growth: 'la qualité d’insertion des diplômés et la profondeur des partenariats',
      },
    },
    es: {
      fashionDesigner: {
        day: 'las decisiones diarias de concepto a muestra',
        coordination: 'los equipos de patronaje, abastecimiento y taller',
        quality: 'los ajustes entre fit, material, coste e identidad',
        rights: 'las condiciones con proveedores y la protección del diseño',
        growth: 'la disciplina de calendario de temporada y margen',
      },
      fashionPhotographer: {
        day: 'la preproducción, pruebas de luz y secuencia de tomas',
        coordination: 'estilismo, maquillaje, retoque y dirección de arte',
        quality: 'selección de imágenes, consistencia de color y jerarquía visual',
        rights: 'derechos de uso, exclusividad y renovaciones',
        growth: 'equilibrio entre encargos editoriales y comerciales',
      },
      fashionVideographer: {
        day: 'guion visual, movimiento de cámara y ritmo de montaje',
        coordination: 'tiempos de equipo, continuidad de set y traspaso a postproducción',
        quality: 'claridad narrativa entre versiones de campaña y social',
        rights: 'derechos de uso para campaña, e-commerce y piezas sociales',
        growth: 'rentabilidad de producción repetible en el tiempo',
      },
      fashionStylist: {
        day: 'arquitectura de looks y coherencia de siluetas bajo plazo',
        coordination: 'alineación con diseño, foto, maquillaje y casting',
        quality: 'decisiones de fitting y sustituciones de último minuto',
        rights: 'acuerdos de préstamo, devoluciones y cuidado de prendas',
        growth: 'posicionamiento de firma para generar rebookings',
      },
      modelAgent: {
        day: 'estrategia de portafolio, envíos y seguimiento de casting',
        coordination: 'clientes, agencias y preparación de modelos',
        quality: 'encaje de perfil, fiabilidad y precisión de booking',
        rights: 'contratos, territorios de uso y renovaciones',
        growth: 'estabilidad del flujo de reservas y protección de carrera',
      },
      talentScout: {
        day: 'detección temprana de talento en contexto real',
        coordination: 'agencias, escuelas y comunidades creativas locales',
        quality: 'evaluación de potencial más allá de métricas sociales superficiales',
        rights: 'incorporación ética, claridad de consentimiento y protección de confianza',
        growth: 'rutas de desarrollo después del descubrimiento',
      },
      talentAgent: {
        day: 'estructuración de acuerdos y secuencia de carrera',
        coordination: 'negociación entre marca, cliente y agencia',
        quality: 'calidad de oferta, equilibrio de carga y momento estratégico',
        rights: 'renovaciones de derechos, conflictos y límites de exclusividad',
        growth: 'estabilidad de ingresos y protección reputacional',
      },
      schoolDirectorModelling: {
        day: 'dirección curricular para pasarela, editorial y e-commerce',
        coordination: 'alineación docente y criterios comunes de evaluación',
        quality: 'calidad de acompañamiento y preparación para empleabilidad',
        rights: 'política de derechos de imagen, protección del alumnado y cumplimiento',
        growth: 'resultados de inserción y reputación sostenible de la escuela',
      },
      schoolDirectorDesign: {
        day: 'dirección curricular desde concepto hasta colección',
        coordination: 'equipo docente, talleres y mentoría de producción',
        quality: 'revisión técnica de patronaje, fit y decisiones de material',
        rights: 'propiedad intelectual y acuerdos de colaboración',
        growth: 'calidad de inserción de egresados y red de alianzas con industria',
      },
    },
    it: {
      fashionDesigner: {
        day: 'le decisioni quotidiane dal concept al campionario',
        coordination: 'i team di modellistica, approvvigionamento e atelier',
        quality: 'gli equilibri tra vestibilità, materia, costo e identità',
        rights: 'le condizioni fornitori e la tutela del design',
        growth: 'la disciplina del calendario stagionale e del margine',
      },
      fashionPhotographer: {
        day: 'preproduzione, test luce e sequenza degli scatti',
        coordination: 'styling, trucco, ritocco e direzione artistica',
        quality: 'selezione immagini, coerenza colore e gerarchia visiva',
        rights: 'diritti d’uso, esclusiva e rinnovi',
        growth: 'equilibrio tra lavori editoriali e commerciali',
      },
      fashionVideographer: {
        day: 'storyboard, movimento camera e ritmo di montaggio',
        coordination: 'tempi troupe, continuità set e passaggio alla postproduzione',
        quality: 'chiarezza narrativa tra versioni campagna e social',
        rights: 'diritti d’uso per campagna, e-commerce e tagli social',
        growth: 'redditività produttiva ripetibile nel tempo',
      },
      fashionStylist: {
        day: 'architettura dei look e coerenza delle silhouette sotto scadenza',
        coordination: 'allineamento con design, fotografia, trucco e casting',
        quality: 'decisioni fitting e sostituzioni dell’ultimo minuto',
        rights: 'accordi di prestito, resi e conformità nella cura dei capi',
        growth: 'posizionamento distintivo che genera rebooking',
      },
      modelAgent: {
        day: 'strategia portfolio, invii e follow-up casting',
        coordination: 'clienti, agenzie e preparazione dei modelli',
        quality: 'aderenza profilo, affidabilità e precisione booking',
        rights: 'contratti, territori d’uso e rinnovi',
        growth: 'stabilità pipeline e tutela della carriera',
      },
      talentScout: {
        day: 'individuazione precoce del talento in contesti reali',
        coordination: 'agenzie, scuole e comunità creative locali',
        quality: 'valutazione del potenziale oltre le metriche social superficiali',
        rights: 'ingresso etico, chiarezza sul consenso e tutela della fiducia',
        growth: 'percorsi di sviluppo dopo la scoperta',
      },
      talentAgent: {
        day: 'strutturazione offerte e sequenza di carriera',
        coordination: 'negoziazione tra brand, cliente e agenzia',
        quality: 'qualità delle offerte, equilibrio del carico e timing strategico',
        rights: 'rinnovi diritti, conflitti e limiti di esclusiva',
        growth: 'stabilità dei compensi e protezione reputazionale',
      },
      schoolDirectorModelling: {
        day: 'direzione curricolare per passerella, editoriale ed e-commerce',
        coordination: 'allineamento docenti e criteri comuni di valutazione',
        quality: 'qualità del coaching e prontezza all’occupabilità',
        rights: 'politiche su diritti d’immagine, tutela studenti e conformità',
        growth: 'risultati di placement e reputazione duratura della scuola',
      },
      schoolDirectorDesign: {
        day: 'direzione curricolare dal concept alla collezione',
        coordination: 'team docenti, laboratori e mentoring di produzione',
        quality: 'revisione tecnica di cartamodello, vestibilità e materiali',
        rights: 'proprietà intellettuale e accordi di collaborazione',
        growth: 'qualità di inserimento dei diplomati e rete di partnership industriali',
      },
    },
    pt: {
      fashionDesigner: {
        day: 'as decisões diárias do conceito à peça-piloto',
        coordination: 'as equipas de modelagem, abastecimento e ateliê',
        quality: 'os equilíbrios entre caimento, material, custo e identidade',
        rights: 'as condições com fornecedores e a proteção do desenho',
        growth: 'a disciplina de calendário sazonal e margem',
      },
      fashionPhotographer: {
        day: 'a pré-produção, os testes de luz e a sequência de captação',
        coordination: 'styling, maquiagem, retoque e direção de arte',
        quality: 'seleção de imagens, consistência de cor e hierarquia visual',
        rights: 'direitos de uso, exclusividade e renovações',
        growth: 'equilíbrio entre trabalhos editoriais e comerciais',
      },
      fashionVideographer: {
        day: 'storyboard, movimento de câmara e ritmo de edição',
        coordination: 'timing de equipa, continuidade de set e passagem para pós-produção',
        quality: 'clareza narrativa entre versões de campanha e social',
        rights: 'direitos de uso para campanha, e-commerce e cortes sociais',
        growth: 'rentabilidade de produção repetível ao longo do tempo',
      },
      fashionStylist: {
        day: 'a arquitetura de looks e a coerência de silhueta sob prazo curto',
        coordination: 'alinhamento com design, fotografia, maquiagem e casting',
        quality: 'decisões de fitting e substituições de última hora',
        rights: 'acordos de empréstimo, devoluções e cuidados com as peças',
        growth: 'posicionamento autoral que gera rebookings',
      },
      modelAgent: {
        day: 'estratégia de portfólio, submissões e acompanhamento de casting',
        coordination: 'clientes, agências e preparação de modelos',
        quality: 'encaixe de perfil, confiabilidade e precisão de booking',
        rights: 'contratos, territórios de uso e renovações',
        growth: 'estabilidade de carteira e proteção de carreira',
      },
      talentScout: {
        day: 'deteção precoce de talento em contexto real',
        coordination: 'agências, escolas e comunidades criativas locais',
        quality: 'avaliação de potencial além de métricas sociais superficiais',
        rights: 'integração ética, clareza de consentimento e proteção de confiança',
        growth: 'rotas de desenvolvimento após a descoberta',
      },
      talentAgent: {
        day: 'estruturação de acordos e sequência de carreira',
        coordination: 'negociação entre marca, cliente e agência',
        quality: 'qualidade de proposta, equilíbrio de carga e momento estratégico',
        rights: 'renovações de direitos, conflitos e limites de exclusividade',
        growth: 'estabilidade de receita e proteção de reputação',
      },
      schoolDirectorModelling: {
        day: 'direção curricular para passarela, editorial e e-commerce',
        coordination: 'alinhamento docente e padrões partilhados de avaliação',
        quality: 'qualidade de acompanhamento e prontidão para empregabilidade',
        rights: 'política de direitos de imagem, proteção estudantil e conformidade',
        growth: 'resultados de colocação e reputação sustentável da escola',
      },
      schoolDirectorDesign: {
        day: 'direção curricular do conceito até à coleção',
        coordination: 'equipa docente, oficinas e mentoria de produção',
        quality: 'revisão técnica de modelagem, caimento e materiais',
        rights: 'propriedade intelectual e contratos de colaboração',
        growth: 'qualidade de inserção dos formandos e rede de parcerias',
      },
    },
    de: {
      fashionDesigner: {
        day: 'die täglichen Entscheidungen von der Idee bis zum Musterteil',
        coordination: 'die Abstimmung mit Schnitt, Beschaffung und Atelier',
        quality: 'die Abwägung zwischen Passform, Material, Kosten und Identität',
        rights: 'Lieferantenbedingungen und Schutz der Entwurfsrechte',
        growth: 'verlässliche Saisonplanung und Margenstabilität',
      },
      fashionPhotographer: {
        day: 'Vorbereitung, Lichttests und Sequenz der Aufnahmen',
        coordination: 'Styling, Make-up, Retusche und Art Direction',
        quality: 'Bildauswahl, Farbkonstanz und visuelle Hierarchie',
        rights: 'Nutzungsrechte, Exklusivfenster und Verlängerungen',
        growth: 'Balance zwischen redaktionellen und kommerziellen Aufträgen',
      },
      fashionVideographer: {
        day: 'Storyboard, Kamerabewegung und Schnitt-Rhythmus',
        coordination: 'Team-Timing, Set-Kontinuität und Übergabe in die Postproduktion',
        quality: 'narrative Klarheit über Kampagnen- und Social-Versionen',
        rights: 'Nutzungsrechte für Kampagne, E-Commerce und Social-Cuts',
        growth: 'wiederholbare Produktionsrentabilität über die Saison',
      },
      fashionStylist: {
        day: 'Look-Architektur und Silhouetten-Kohärenz unter Zeitdruck',
        coordination: 'Abstimmung mit Design, Foto, Make-up und Casting',
        quality: 'Fitting-Entscheidungen und kurzfristige Ersatzlösungen',
        rights: 'Leihvereinbarungen, Rückgaben und Pflegekonformität',
        growth: 'ein klares Signaturprofil für wiederkehrende Buchungen',
      },
      modelAgent: {
        day: 'Portfolio-Strategie, Einreichungen und Casting-Nachverfolgung',
        coordination: 'Kunden, Agenturen und Vorbereitungsplanung mit Models',
        quality: 'Profilpassung, Zuverlässigkeit und Präzision bei Buchungen',
        rights: 'Verträge, Nutzungsgebiete und Verlängerungen',
        growth: 'stabile Pipeline und langfristiger Karriereschutz',
      },
      talentScout: {
        day: 'frühe Talententdeckung im realen Feldkontext',
        coordination: 'Agenturen, Schulen und lokale kreative Szenen',
        quality: 'Potenzialbewertung jenseits oberflächlicher Social-Metriken',
        rights: 'ethisches Onboarding, klare Zustimmung und Vertrauensschutz',
        growth: 'Entwicklungswege nach der Entdeckung',
      },
      talentAgent: {
        day: 'Deal-Strukturierung und Sequenzierung von Karriereschritten',
        coordination: 'Verhandlungen zwischen Marke, Kunde und Agentur',
        quality: 'Angebotsqualität, Belastungsbalance und strategisches Timing',
        rights: 'Rechteverlängerungen, Konfliktklauseln und Exklusivgrenzen',
        growth: 'langfristige Einkommensstabilität und Reputationsschutz',
      },
      schoolDirectorModelling: {
        day: 'Curriculum-Steuerung für Laufsteg, Editorial und E-Commerce',
        coordination: 'Dozierenden-Ausrichtung und gemeinsame Bewertungsstandards',
        quality: 'Coaching-Qualität und Beschäftigungsreife der Studierenden',
        rights: 'Bildrechte-Politik, Schutzstandards und Rechtskonformität',
        growth: 'Platzierungsergebnisse und dauerhafte Schulreputation',
      },
      schoolDirectorDesign: {
        day: 'Curriculum-Steuerung von der Idee bis zur Kollektion',
        coordination: 'Lehrteam, Werkstätten und Produktions-Mentoring',
        quality: 'technische Prüfung von Schnitt, Passform und Material',
        rights: 'geistiges Eigentum und Klarheit in Kooperationsverträgen',
        growth: 'Platzierungsqualität der Absolventen und Tiefe der Industriepartnerschaften',
      },
    },
  };

  const localeFocus = focusByLocale[locale] || focusByLocale.en;
  return localeFocus[persona] || null;
}

function buildExtendedPersonaServices(persona, roleName, locale) {
  const focus = getExtendedPersonaFocus(locale, persona);
  if (!focus) return null;

  const templates = {
    en: [
      { title: 'Cartésiennes', body: `Cartésiennes is the immersive online kiosk and reading experience that keeps you close to the trends, stories and insights shaping your ${roleName} reality.` },
      { title: 'EOEX Studio', body: `EOEX Studio is the AI-assisted photo and video storytelling workshop that helps you produce complete, high-craft media with clarity and control.` },
      { title: 'Ariella', body: `Ariella is the missing link in fashion design and modelling education, connecting formal institutions with the real working realities of the industry.` },
      { title: 'MEZENE', body: `MEZENE is the responsible and ethical fashion modelling mother agency representing models, designers, photographers and more with care and integrity.` },
    ],
    fr: [
      { title: 'Cartésiennes', body: `Cartésiennes est le kiosque immersif et l’expérience de lecture en ligne qui vous tient informé des tendances, récits et insights de votre réalité de ${roleName}.` },
      { title: 'EOEX Studio', body: `EOEX Studio est l’atelier de storytelling photo et vidéo assisté par IA qui vous permet de produire des médias complets et de haute facture avec clarté et maîtrise.` },
      { title: 'Ariella', body: `Ariella est le maillon manquant de l’éducation entre la mode et le mannequinat, reliant l’enseignement formel aux réalités concrètes du métier.` },
      { title: 'MEZENE', body: `MEZENE est l’agence mère responsable et éthique du mannequinat, représentant mannequins, créateurs, photographes et bien plus encore.` },
    ],
    es: [
      { title: 'Cartésiennes', body: `Cartésiennes es el kiosco inmersivo y la experiencia de lectura online que te mantiene al día de las tendencias, historias e insights de tu realidad como ${roleName}.` },
      { title: 'EOEX Studio', body: `EOEX Studio es el taller de storytelling fotográfico y de vídeo asistido por IA que te permite producir medios completos y de alta calidad con claridad y control.` },
      { title: 'Ariella', body: `Ariella es el eslabón que faltaba en la educación de moda y modelaje, conectando la formación formal con las realidades reales del sector.` },
      { title: 'MEZENE', body: `MEZENE es la agencia madre responsable y ética del modelaje, que representa a modelos, diseñadores, fotógrafos y mucho más.` },
    ],
    it: [
      { title: 'Cartésiennes', body: `Cartésiennes è il chiosco immersivo e l’esperienza di lettura online che ti tiene aggiornato su tendenze, storie e insight del tuo profilo di ${roleName}.` },
      { title: 'EOEX Studio', body: `EOEX Studio è il laboratorio di storytelling foto e video assistito da IA che ti permette di produrre media completi e di alta qualità con chiarezza e controllo.` },
      { title: 'Ariella', body: `Ariella è l’anello mancante nell’educazione tra moda e modellismo, collegando la formazione formale alle realtà concrete del settore.` },
      { title: 'MEZENE', body: `MEZENE è l’agenzia madre responsabile ed etica del modeling, che rappresenta modelle, modelli, designer, fotografi e molto altro.` },
    ],
    pt: [
      { title: 'Cartésiennes', body: `Cartésiennes é o quiosque imersivo e a experiência de leitura online que mantém você atualizado sobre tendências, histórias e insights do seu perfil de ${roleName}.` },
      { title: 'EOEX Studio', body: `EOEX Studio é a oficina de storytelling de foto e vídeo assistida por IA para produzir mídia completa e de alta qualidade com clareza e controle.` },
      { title: 'Ariella', body: `Ariella é o elo que faltava na educação de moda e modelagem, conectando a formação formal com as realidades reais do setor.` },
      { title: 'MEZENE', body: `MEZENE é a agência-mãe responsável e ética do modelismo, que representa modelos, designers, fotógrafos e muito mais.` },
    ],
    de: [
      { title: 'Cartésiennes', body: `Cartésiennes ist das immersive Online-Kiosk- und Leseerlebnis, das Sie über Trends, Geschichten und Insights Ihrer Rolle als ${roleName} auf dem Laufenden hält.` },
      { title: 'EOEX Studio', body: `EOEX Studio ist die KI-gestützte Foto- und Video-Storytelling-Werkstatt, mit der Sie vollständige, hochwertige Medien mit Klarheit und Kontrolle produzieren.` },
      { title: 'Ariella', body: `Ariella ist das fehlende Bindeglied in der Mode- und Modelausbildung, das formale Bildung mit den realen Gegebenheiten der Branche verbindet.` },
      { title: 'MEZENE', body: `MEZENE ist die verantwortungsvolle und ethische Model-Mutteragentur, die Models, Designer, Fotografen und mehr vertritt.` },
    ],
  };

  return templates[locale] || templates.en;
}

function buildExtendedPersonaMasterclass(persona, roleName, locale) {
  const focus = getExtendedPersonaFocus(locale, persona);
  if (!focus) return null;

  const byLocale = {
    en: {
      usp: `A field-grounded Masterclass for ${roleName}, built on ${focus.day}, ${focus.coordination}, and measurable outcomes.`,
      benefits: [
        `Turn ${focus.day} into a repeatable weekly operating routine.`,
        `Improve execution quality through clearer standards for ${focus.quality}.`,
        `Reduce risk with practical governance for ${focus.rights}.`,
        `Build durable momentum through a system focused on ${focus.growth}.`,
      ],
    },
    fr: {
      usp: `Une Masterclass ancrée terrain pour ${roleName}, construite sur ${focus.day}, ${focus.coordination} et des résultats mesurables.`,
      benefits: [
        `Transformer ${focus.day} en cadence hebdomadaire réellement tenable.`,
        `Élever l’exécution avec des standards plus clairs pour ${focus.quality}.`,
        `Réduire le risque grâce à une gouvernance pratique de ${focus.rights}.`,
        `Construire une progression durable centrée sur ${focus.growth}.`,
      ],
    },
    es: {
      usp: `Una Masterclass de terreno para ${roleName}, construida sobre ${focus.day}, ${focus.coordination} y resultados medibles.`,
      benefits: [
        `Convertir ${focus.day} en una rutina semanal repetible y sostenible.`,
        `Elevar la ejecución con estándares más claros para ${focus.quality}.`,
        `Reducir riesgo con una gobernanza práctica de ${focus.rights}.`,
        `Construir progreso estable con un sistema centrado en ${focus.growth}.`,
      ],
    },
    it: {
      usp: `Una Masterclass concreta per ${roleName}, costruita su ${focus.day}, ${focus.coordination} e risultati misurabili.`,
      benefits: [
        `Trasformare ${focus.day} in una routine settimanale ripetibile.`,
        `Migliorare l’esecuzione con standard più chiari su ${focus.quality}.`,
        `Ridurre il rischio con una governance pratica di ${focus.rights}.`,
        `Costruire progressione solida con un sistema centrato su ${focus.growth}.`,
      ],
    },
    pt: {
      usp: `Uma Masterclass de prática real para ${roleName}, construída sobre ${focus.day}, ${focus.coordination} e resultados mensuráveis.`,
      benefits: [
        `Transformar ${focus.day} em rotina semanal repetível e sustentável.`,
        `Elevar a execução com padrões mais claros para ${focus.quality}.`,
        `Reduzir risco com governança prática de ${focus.rights}.`,
        `Construir progressão consistente com sistema focado em ${focus.growth}.`,
      ],
    },
    de: {
      usp: `Eine praxisnahe Masterclass für ${roleName}, aufgebaut auf ${focus.day}, ${focus.coordination} und messbaren Ergebnissen.`,
      benefits: [
        `${focus.day} in eine wiederholbare Wochenroutine überführen.`,
        `Ausführungsqualität mit klareren Standards für ${focus.quality} erhöhen.`,
        `Risiko durch praktische Governance bei ${focus.rights} reduzieren.`,
        `Nachhaltige Entwicklung mit einem System für ${focus.growth} aufbauen.`,
      ],
    },
  };

  return byLocale[locale] || byLocale.en;
}

function roleSpecificServices(roleName, roleReferenceEn, locale) {
  const persona = detectRolePersona(roleReferenceEn);
  const roleTrack = detectRoleTrackFromLabel(roleReferenceEn);
  const extendedPersonaServices = buildExtendedPersonaServices(persona, roleName, locale);
  if (extendedPersonaServices) return extendedPersonaServices;

  const templatesByLocale = {
    en: {
      ugcModel: [
        { title: 'UGC Hook and Script Sprint', body: `We train your ${roleName} workflow to build stronger first-three-second hooks and short scripts that convert for fashion e-commerce.` },
        { title: 'Vertical Fashion Set Execution', body: `We sharpen shot lists, lighting, and delivery rhythm for daily UGC model production without losing brand consistency.` },
        { title: 'Product Try-on Conversion Method', body: `We optimize your try-on sequence for fit clarity, texture visibility, and checkout-driving proof points.` },
        { title: 'Usage-Rights and Deliverables Control', body: `We structure rights, cutdown versions, and reuse clauses so your UGC output remains profitable over time.` },
        { title: 'Performance Iteration Dashboard', body: `We install a practical loop from retention and CTR signals to next-shoot decisions in your model routine.` },
      ],
      ecommerceModel: [
        { title: 'High-Volume Studio Cadence', body: `We design repeatable routines for your ${roleName} days: SKU throughput, pose rotation, and quality stability across long sessions.` },
        { title: 'Fit and Size Consistency Protocol', body: 'We refine posture and garment transitions so fit communication stays precise for product pages and returns reduction.' },
        { title: 'On-Set Reliability System', body: 'We strengthen pacing with stylists, photographers, and studio coordinators to reduce retakes and missed product slots.' },
        { title: 'Commercial Rights and Rate Clarity', body: 'We support usage negotiation, renewal logic, and day-rate positioning with clean contract guardrails.' },
        { title: 'Career Mix for E-commerce Models', body: 'We map a weekly work mix between catalog, motion, and social outputs so income remains steady and scalable.' },
      ],
      castingAssistant: [
        { title: 'Model Pre-Selection Operations', body: `We structure your ${roleName} shortlist process for fashion, UGC, and e-commerce briefs with faster filtering and fewer mismatches.` },
        { title: 'Board Building for E-commerce and UGC', body: 'We standardize board logic so creative, fit, diversity, and conversion signals are visible before client review.' },
        { title: 'Callback and Fitting Coordination', body: 'We improve scheduling mechanics across agencies, models, and fitting rooms to protect production flow.' },
        { title: 'Talent Communication Discipline', body: 'We refine message cadence, rejection handling, and update protocols to keep trust high across large talent pools.' },
        { title: 'Casting Data to Better Decisions', body: 'We convert casting outcomes into reusable insights for stronger next-round model recommendations.' },
      ],
      fashionModel: [
        { title: 'Casting Readiness Routine', body: `We build a repeatable prep cycle for your ${roleName} schedule: digitals, walk, posing, and response speed before every casting week.` },
        { title: 'On-Set Execution Quality', body: 'We sharpen movement control, expression consistency, and pose transitions to improve callback and rebooking reliability.' },
        { title: 'Portfolio and Positioning Review', body: 'We align your book to the market segment you target so clients understand your value in seconds.' },
        { title: 'Contract and Rights Guardrails', body: 'We help you read usage terms, exclusivity boundaries, and renewal implications before accepting jobs.' },
        { title: 'Seasonal Resilience Planning', body: 'We structure routines for recovery, income pacing, and rejection cycles so performance stays stable over time.' },
      ],
      talentOps: [
        { title: 'Talent Pipeline Quality Control', body: `We improve your ${roleName} process for shortlist quality, turnaround speed, and alignment with real creative briefs.` },
        { title: 'Agency and Client Communication Flow', body: 'We streamline updates, availability checks, and decision notes across agency and client teams.' },
        { title: 'Casting and Booking Decision Standards', body: 'We build clearer criteria for fit, reliability, and long-term value under tight production pressure.' },
        { title: 'Rights and Risk Operations', body: 'We strengthen contract checks and usage-risk screening before final confirmations.' },
        { title: 'Weekly Performance Review Loop', body: 'We transform outcomes from castings and bookings into measurable improvements for the next cycle.' },
      ],
    },
    fr: {
      ugcModel: [
        { title: 'Sprint hooks UGC et scripts courts', body: `Nous structurons votre pratique ${roleName} pour créer des accroches fortes dans les trois premières secondes et des scripts courts orientés conversion mode e-commerce.` },
        { title: 'Exécution verticale mode sur set', body: 'Nous renforçons plans, lumière et cadence de livraison pour produire vite sans perdre la cohérence de marque.' },
        { title: 'Méthode try-on orientée conversion', body: 'Nous optimisons séquence essayage, lisibilité du fit et détails matière pour soutenir l’achat.' },
        { title: 'Cadre droits et livrables', body: 'Nous clarifions droits d’usage, déclinaisons et conditions de réemploi pour préserver la rentabilité de vos contenus.' },
        { title: 'Boucle de performance exploitable', body: 'Nous relions rétention et CTR aux décisions du prochain tournage dans votre routine UGC.' },
      ],
      ecommerceModel: [
        { title: 'Cadence studio grand volume', body: `Nous posons une routine concrète pour vos journées ${roleName}: débit SKU, rotation des poses et qualité stable sur de longues sessions.` },
        { title: 'Protocole fit et taille', body: 'Nous affinons posture et transitions vêtement pour une lecture précise du fit et moins de retours produits.' },
        { title: 'Fiabilité d’exécution plateau', body: 'Nous améliorons le rythme avec stylistes, photographes et coordination studio pour réduire reprises et pertes de temps.' },
        { title: 'Clarté tarifs et droits commerciaux', body: 'Nous encadrons négociation d’usage, renouvellements et positionnement tarifaire avec des garde-fous contractuels.' },
        { title: 'Mix carrière e-commerce', body: 'Nous organisons un équilibre entre catalogue, vidéo produit et social pour stabiliser vos revenus.' },
      ],
      castingAssistant: [
        { title: 'Pré-sélection opérationnelle des mannequins', body: `Nous structurons votre processus ${roleName} pour briefs mode, UGC et e-commerce avec filtrage plus rapide et moins d’écarts.` },
        { title: 'Boards casting UGC et e-commerce', body: 'Nous standardisons la logique de board pour rendre visibles fit, direction créative, diversité et potentiel de conversion.' },
        { title: 'Coordination callbacks et fittings', body: 'Nous fluidifions planning entre agences, mannequins et fittings pour protéger le flux de production.' },
        { title: 'Discipline de communication talent', body: 'Nous renforçons cadence de messages, gestion des refus et suivi pour maintenir la confiance des talents.' },
        { title: 'Décisions casting guidées par les données', body: 'Nous transformons les résultats de castings en repères concrets pour les recommandations suivantes.' },
      ],
      fashionModel: [
        { title: 'Routine de préparation casting', body: `Nous construisons un cycle répétable pour votre agenda ${roleName}: digitals, marche, posing et réactivité avant chaque semaine clé.` },
        { title: 'Qualité d’exécution sur plateau', body: 'Nous renforçons gestion du mouvement, précision d’expression et transitions de pose pour sécuriser callbacks et rebookings.' },
        { title: 'Relecture portfolio et positionnement', body: 'Nous alignons votre book sur le segment ciblé pour rendre votre valeur lisible immédiatement.' },
        { title: 'Garde-fous contrats et droits', body: 'Nous clarifions usages, exclusivités et renouvellements avant validation des missions.' },
        { title: 'Résilience de saison', body: 'Nous structurons récupération, rythme de revenus et gestion du rejet pour une performance durable.' },
      ],
      talentOps: [
        { title: 'Contrôle qualité du pipeline talent', body: `Nous améliorons votre processus ${roleName} sur la qualité shortlist, la vitesse de réponse et l’alignement brief.` },
        { title: 'Flux agence-client plus fluide', body: 'Nous simplifions mises à jour, vérifications de disponibilité et notes de décision entre équipes.' },
        { title: 'Standards de décision casting-booking', body: 'Nous installons des critères plus nets de fit, fiabilité et valeur long terme sous pression.' },
        { title: 'Opérations droits et risques', body: 'Nous renforçons contrôle contractuel et détection des risques d’usage avant confirmation finale.' },
        { title: 'Boucle d’amélioration hebdomadaire', body: 'Nous transformons les résultats de casting et booking en améliorations mesurables pour le cycle suivant.' },
      ],
    },
    es: {
      ugcModel: [
        { title: 'Sprint de hooks UGC y guiones cortos', body: `Estructuramos tu práctica de ${roleName} para abrir fuerte en los primeros tres segundos y producir guiones cortos con foco en conversión de moda e-commerce.` },
        { title: 'Ejecución vertical de moda en set', body: 'Mejoramos planos, luz y ritmo de entrega para producir volumen sin perder coherencia de marca.' },
        { title: 'Método de try-on para conversión', body: 'Optimizamos secuencia de prueba, lectura de ajuste y detalle de tejido para sostener decisión de compra.' },
        { title: 'Marco de derechos y entregables', body: 'Alineamos derechos de uso, versiones y reutilización para mantener rentabilidad del contenido.' },
        { title: 'Bucle de rendimiento accionable', body: 'Conectamos retención y CTR con decisiones del siguiente rodaje en tu rutina UGC.' },
      ],
      ecommerceModel: [
        { title: 'Cadencia de estudio de alto volumen', body: `Diseñamos una rutina concreta para tus jornadas de ${roleName}: flujo SKU, rotación de poses y calidad estable en sesiones largas.` },
        { title: 'Protocolo de ajuste y talla', body: 'Refinamos postura y transición de prendas para comunicar mejor el fit y reducir devoluciones.' },
        { title: 'Fiabilidad de ejecución en set', body: 'Mejoramos coordinación con estilismo, fotografía y estudio para reducir repeticiones y cuellos de botella.' },
        { title: 'Claridad de tarifas y derechos', body: 'Fortalecemos negociación de uso, renovaciones y posicionamiento de tarifa con límites contractuales claros.' },
        { title: 'Mezcla de carrera para e-commerce', body: 'Ordenamos equilibrio entre catálogo, vídeo producto y contenido social para sostener ingresos.' },
      ],
      castingAssistant: [
        { title: 'Preselección operativa de modelos', body: `Estructuramos tu proceso de ${roleName} para briefs de moda, UGC y e-commerce con filtro más rápido y menos desajustes.` },
        { title: 'Boards de casting para UGC y e-commerce', body: 'Estandarizamos la lógica de board para mostrar fit, dirección creativa, diversidad y señal de conversión antes del cliente.' },
        { title: 'Coordinación de callbacks y fittings', body: 'Mejoramos agenda entre agencias, modelos y fittings para proteger el flujo de producción.' },
        { title: 'Disciplina de comunicación con talento', body: 'Refinamos cadencia de mensajes, gestión de rechazo y seguimiento para mantener confianza del pool.' },
        { title: 'Decisiones de casting basadas en datos', body: 'Convertimos resultados de casting en criterios reutilizables para la siguiente recomendación.' },
      ],
      fashionModel: [
        { title: 'Rutina de preparación para castings', body: `Construimos un ciclo repetible para tu agenda de ${roleName}: digitals, pasarela, posing y velocidad de respuesta.` },
        { title: 'Calidad de ejecución en set', body: 'Mejoramos control de movimiento, consistencia de expresión y transición de poses para elevar callbacks y rebookings.' },
        { title: 'Revisión de portafolio y posicionamiento', body: 'Alineamos tu book con el segmento de mercado que quieres ocupar para mostrar valor en segundos.' },
        { title: 'Límites de contrato y derechos', body: 'Clarificamos uso, exclusividad y renovación antes de aceptar campañas.' },
        { title: 'Resiliencia de temporada', body: 'Estructuramos recuperación, ritmo de ingresos y gestión de rechazo para sostener rendimiento.' },
      ],
      talentOps: [
        { title: 'Control de calidad del pipeline de talento', body: `Mejoramos tu proceso de ${roleName} en calidad de shortlist, velocidad de respuesta y ajuste al brief real.` },
        { title: 'Flujo agencia-cliente más claro', body: 'Ordenamos actualizaciones, disponibilidad y notas de decisión entre equipos.' },
        { title: 'Criterios de decisión para casting y booking', body: 'Instalamos criterios más claros de ajuste, fiabilidad y valor a medio plazo bajo presión.' },
        { title: 'Operativa de derechos y riesgo', body: 'Fortalecemos revisión contractual y detección temprana de riesgos de uso antes de confirmar.' },
        { title: 'Bucle semanal de mejora', body: 'Convertimos resultados de casting y booking en mejoras medibles para el ciclo siguiente.' },
      ],
    },
    it: {
      ugcModel: [
        { title: 'Sprint hook UGC e script brevi', body: `Strutturiamo la tua pratica ${roleName} per aperture forti nei primi tre secondi e script brevi orientati alla conversione moda e-commerce.` },
        { title: 'Esecuzione verticale moda sul set', body: 'Rafforziamo piani, luce e ritmo di consegna per produrre volume senza perdere coerenza di marca.' },
        { title: 'Metodo try-on orientato conversione', body: 'Ottimizziamo sequenza prova, lettura vestibilità e dettaglio tessuto per sostenere la scelta d’acquisto.' },
        { title: 'Cornice diritti e consegne', body: 'Allineiamo diritti d’uso, versioni e riutilizzo per proteggere la redditività dei contenuti.' },
        { title: 'Ciclo performance utilizzabile', body: 'Colleghiamo retention e CTR alle decisioni del prossimo shooting nella tua routine UGC.' },
      ],
      ecommerceModel: [
        { title: 'Cadenza studio ad alto volume', body: `Disegniamo una routine concreta per le tue giornate da ${roleName}: flusso SKU, rotazione pose e qualità stabile su sessioni lunghe.` },
        { title: 'Protocollo vestibilità e taglia', body: 'Affiniamo postura e transizioni capo per comunicare meglio la vestibilità e ridurre resi.' },
        { title: 'Affidabilità esecutiva sul set', body: 'Miglioriamo coordinamento con styling, fotografia e studio per ridurre ripetizioni e ritardi.' },
        { title: 'Chiarezza su tariffe e diritti', body: 'Rendiamo più solida la negoziazione su utilizzi, rinnovi e tariffa con guardrail contrattuali chiari.' },
        { title: 'Mix carriera e-commerce', body: 'Impostiamo equilibrio tra catalogo, video prodotto e contenuti social per stabilizzare i ricavi.' },
      ],
      castingAssistant: [
        { title: 'Preselezione operativa modelli', body: `Strutturiamo il tuo processo ${roleName} per brief moda, UGC ed e-commerce con filtro più rapido e meno mismatch.` },
        { title: 'Board casting per UGC ed e-commerce', body: 'Standardizziamo la logica board per rendere visibili fit, direzione creativa, diversità e segnali di conversione.' },
        { title: 'Coordinamento callback e fitting', body: 'Miglioriamo agenda tra agenzie, modelli e fitting per proteggere il flusso produttivo.' },
        { title: 'Disciplina comunicazione talenti', body: 'Affiniamo cadenza messaggi, gestione dei rifiuti e follow-up per mantenere fiducia nel bacino talenti.' },
        { title: 'Decisioni casting guidate da dati', body: 'Trasformiamo esiti casting in criteri riutilizzabili per raccomandazioni più forti.' },
      ],
      fashionModel: [
        { title: 'Routine di preparazione ai casting', body: `Costruiamo un ciclo ripetibile per il tuo calendario ${roleName}: digitals, camminata, posing e velocità di risposta.` },
        { title: 'Qualità di esecuzione sul set', body: 'Rafforziamo controllo del movimento, continuità espressiva e transizioni pose per aumentare callback e rebooking.' },
        { title: 'Revisione portfolio e posizionamento', body: 'Allineiamo il tuo book al segmento che vuoi presidiare per rendere il valore leggibile subito.' },
        { title: 'Guardrail su contratti e diritti', body: 'Chiarifichiamo utilizzi, esclusiva e rinnovi prima di accettare campagne.' },
        { title: 'Resilienza stagionale', body: 'Strutturiamo recupero, ritmo ricavi e gestione rifiuti per mantenere performance costante.' },
      ],
      talentOps: [
        { title: 'Controllo qualità pipeline talenti', body: `Miglioriamo il tuo processo ${roleName} su qualità shortlist, velocità risposta e allineamento al brief reale.` },
        { title: 'Flusso agenzia-cliente più chiaro', body: 'Semplifichiamo aggiornamenti, disponibilità e note decisionali tra team.' },
        { title: 'Standard decisionali casting e booking', body: 'Impostiamo criteri più netti di aderenza, affidabilità e valore sotto pressione.' },
        { title: 'Operatività su diritti e rischio', body: 'Rafforziamo revisione contrattuale e rilevazione precoce dei rischi d’uso prima della conferma.' },
        { title: 'Ciclo settimanale di miglioramento', body: 'Convertiamo risultati di casting e booking in miglioramenti misurabili per il ciclo successivo.' },
      ],
    },
    pt: {
      ugcModel: [
        { title: 'Sprint de gancho UGC e roteiro curto', body: `Estruturamos sua prática de ${roleName} para abrir forte nos três primeiros segundos e criar roteiros curtos com foco em conversão de moda e-commerce.` },
        { title: 'Execução vertical de moda no set', body: 'Fortalecemos plano, luz e ritmo de entrega para produzir volume sem perder coerência de marca.' },
        { title: 'Método de prova orientado à conversão', body: 'Otimizamos sequência de prova, leitura de caimento e detalhe de tecido para sustentar decisão de compra.' },
        { title: 'Estrutura de direitos e entregáveis', body: 'Alinhamos direitos de uso, versões e reaproveitamento para proteger a rentabilidade do conteúdo.' },
        { title: 'Ciclo de performance acionável', body: 'Conectamos retenção e CTR às decisões da próxima gravação na sua rotina UGC.' },
      ],
      ecommerceModel: [
        { title: 'Cadência de estúdio em alto volume', body: `Desenhamos rotina concreta para seus dias como ${roleName}: fluxo SKU, rotação de poses e qualidade estável em sessões longas.` },
        { title: 'Protocolo de caimento e tamanho', body: 'Refinamos postura e transição de peças para comunicar caimento com precisão e reduzir devoluções.' },
        { title: 'Confiabilidade de execução no set', body: 'Melhoramos coordenação com styling, fotografia e estúdio para reduzir refações e gargalos.' },
        { title: 'Clareza de tarifas e direitos', body: 'Fortalecemos negociação de uso, renovação e posicionamento de diária com limites contratuais claros.' },
        { title: 'Mix de carreira para e-commerce', body: 'Organizamos equilíbrio entre catálogo, vídeo de produto e social para sustentar receita recorrente.' },
      ],
      castingAssistant: [
        { title: 'Pré-seleção operacional de modelos', body: `Estruturamos seu processo de ${roleName} para briefs de moda, UGC e e-commerce com filtro mais rápido e menos ruído.` },
        { title: 'Boards de casting para UGC e e-commerce', body: 'Padronizamos lógica de board para deixar visíveis fit, direção criativa, diversidade e sinal de conversão.' },
        { title: 'Coordenação de callback e fitting', body: 'Melhoramos agenda entre agências, modelos e fitting para proteger o fluxo de produção.' },
        { title: 'Disciplina de comunicação com talentos', body: 'Refinamos cadência de mensagens, gestão de recusa e follow-up para manter confiança do pool.' },
        { title: 'Decisões de casting guiadas por dados', body: 'Transformamos resultados de casting em critérios reutilizáveis para recomendações mais fortes.' },
      ],
      fashionModel: [
        { title: 'Rotina de preparação para casting', body: `Construímos um ciclo repetível para sua agenda ${roleName}: digitals, passarela, posing e velocidade de resposta.` },
        { title: 'Qualidade de execução no set', body: 'Fortalecemos controle de movimento, consistência de expressão e transição de poses para elevar callbacks e rebookings.' },
        { title: 'Revisão de portfólio e posicionamento', body: 'Alinhamos seu book ao segmento que você quer ocupar para tornar valor legível em segundos.' },
        { title: 'Limites de contrato e direitos', body: 'Clarificamos uso, exclusividade e renovação antes de aceitar campanhas.' },
        { title: 'Resiliência de temporada', body: 'Estruturamos recuperação, ritmo de receita e gestão de rejeição para manter performance estável.' },
      ],
      talentOps: [
        { title: 'Controle de qualidade do pipeline de talentos', body: `Melhoramos seu processo ${roleName} em qualidade de shortlist, velocidade de resposta e alinhamento ao brief real.` },
        { title: 'Fluxo agência-cliente mais claro', body: 'Organizamos atualizações, disponibilidade e notas de decisão entre equipes.' },
        { title: 'Padrões de decisão para casting e booking', body: 'Definimos critérios mais nítidos de ajuste, confiabilidade e valor sob pressão.' },
        { title: 'Operação de direitos e risco', body: 'Reforçamos revisão contratual e detecção antecipada de riscos de uso antes de confirmar.' },
        { title: 'Ciclo semanal de melhoria', body: 'Convertemos resultados de casting e booking em melhorias mensuráveis para o ciclo seguinte.' },
      ],
    },
    de: {
      ugcModel: [
        { title: 'UGC-Hook- und Kurzscript-Sprint', body: `Wir strukturieren Ihre ${roleName}-Praxis für starke Einstiege in den ersten drei Sekunden und kurze Scripts mit Fokus auf Fashion-E-Commerce-Konversion.` },
        { title: 'Vertikale Fashion-Set-Umsetzung', body: 'Wir schärfen Bildplan, Licht und Liefer-Taktung, damit Sie Volumen produzieren, ohne Markenkohärenz zu verlieren.' },
        { title: 'Try-on-Methode für Konversion', body: 'Wir optimieren Anprobe-Sequenz, Passform-Lesbarkeit und Materialdetails, damit Kaufentscheidungen leichter fallen.' },
        { title: 'Nutzungsrechte und Deliverables', body: 'Wir klären Rechte, Versionen und Wiederverwendung, damit Ihr Content wirtschaftlich tragfähig bleibt.' },
        { title: 'Umsetzbare Performance-Schleife', body: 'Wir verbinden Retention- und CTR-Signale mit Entscheidungen für den nächsten Dreh in Ihrer UGC-Routine.' },
      ],
      ecommerceModel: [
        { title: 'Studio-Kadenz für hohes Volumen', body: `Wir entwickeln eine belastbare Routine für Ihre ${roleName}-Tage: SKU-Durchsatz, Pose-Rotation und stabile Qualität über lange Sessions.` },
        { title: 'Passform- und Größenprotokoll', body: 'Wir verfeinern Haltung und Outfit-Wechsel, damit Passform klarer kommuniziert und Retouren reduziert werden.' },
        { title: 'Zuverlässige Set-Execution', body: 'Wir verbessern die Abstimmung mit Styling, Foto und Studioleitung, um Wiederholungen und Engpässe zu senken.' },
        { title: 'Klare Sätze und Rechte', body: 'Wir stärken Verhandlung zu Nutzungsrechten, Verlängerungen und Tagessätzen mit klaren Vertragsgrenzen.' },
        { title: 'Karriere-Mix für E-Commerce', body: 'Wir strukturieren den Mix aus Katalog, Produktvideo und Social-Output für stabilere Einnahmen.' },
      ],
      castingAssistant: [
        { title: 'Operative Model-Vorauswahl', body: `Wir strukturieren Ihren ${roleName}-Prozess für Mode-, UGC- und E-Commerce-Briefs mit schnellerem Filter und weniger Fehlpassungen.` },
        { title: 'Casting-Boards für UGC und E-Commerce', body: 'Wir standardisieren Board-Logik, damit Fit, Creative Direction, Diversität und Konversionssignal früh sichtbar sind.' },
        { title: 'Callback- und Fitting-Koordination', body: 'Wir verbessern Terminsteuerung zwischen Agenturen, Models und Fittings, um Produktionsfluss zu sichern.' },
        { title: 'Disziplin in der Talentkommunikation', body: 'Wir schärfen Nachrichtentakt, Absage-Handling und Follow-up, damit Vertrauen im Talentpool hoch bleibt.' },
        { title: 'Datenbasierte Casting-Entscheidungen', body: 'Wir übersetzen Casting-Ergebnisse in wiederverwendbare Kriterien für stärkere nächste Empfehlungen.' },
      ],
      fashionModel: [
        { title: 'Casting-Readiness-Routine', body: `Wir bauen einen wiederholbaren Zyklus für Ihren ${roleName}-Alltag auf: Digitals, Lauftechnik, Posing und Reaktionsgeschwindigkeit.` },
        { title: 'Ausführungsqualität am Set', body: 'Wir verbessern Bewegungssteuerung, Ausdruckskonstanz und Pose-Übergänge für höhere Callback- und Rebooking-Quote.' },
        { title: 'Portfolio- und Positionierungsreview', body: 'Wir richten Ihr Book auf das Zielsegment aus, damit Ihr Wert in Sekunden verständlich wird.' },
        { title: 'Leitplanken für Vertrag und Rechte', body: 'Wir klären Nutzung, Exklusivität und Verlängerung, bevor Sie Kampagnen zusagen.' },
        { title: 'Saisonale Resilienzplanung', body: 'Wir strukturieren Regeneration, Einkommensrhythmus und Umgang mit Absagen für stabile Leistung.' },
      ],
      talentOps: [
        { title: 'Qualitätskontrolle der Talent-Pipeline', body: `Wir verbessern Ihren ${roleName}-Prozess bei Shortlist-Qualität, Reaktionszeit und Brief-Genauigkeit.` },
        { title: 'Klarerer Agentur-Kunden-Flow', body: 'Wir ordnen Updates, Verfügbarkeiten und Entscheidungsnotizen über Teams hinweg.' },
        { title: 'Standards für Casting- und Booking-Entscheidungen', body: 'Wir setzen klarere Kriterien für Fit, Zuverlässigkeit und Wertbeitrag unter Produktionsdruck.' },
        { title: 'Rechte- und Risiko-Operation', body: 'Wir stärken Vertragsprüfung und frühe Risikoerkennung bei Nutzung vor finaler Zusage.' },
        { title: 'Wöchentliche Verbesserungs-Schleife', body: 'Wir machen aus Casting- und Booking-Ergebnissen messbare Verbesserungen für den nächsten Zyklus.' },
      ],
    },
  };

  const trackFallbackByLocale = {
    en: {
      creative: [
        { title: 'Creative Decision Architecture', body: `We turn your ${roleName} responsibilities into a clear decision system for concept quality, timing, and brand consistency.` },
        { title: 'Visual Direction Calibration', body: 'We strengthen critique routines so teams align faster around references, edits, and final selections.' },
        { title: 'Cross-Team Execution Rhythm', body: 'We improve handoff between creative, product, and production to reduce friction in delivery cycles.' },
        { title: 'Portfolio and Leadership Proof', body: 'We position your outputs as evidence of strategic judgment, not only aesthetics.' },
        { title: 'Pressure-Cycle Planning', body: 'We design practical routines for peak weeks so quality remains stable under deadline pressure.' },
      ],
      operations: [
        { title: 'Supplier and Sample Flow Control', body: `We structure your ${roleName} workflow for cleaner vendor updates, sample status, and escalation timing.` },
        { title: 'Quality-Risk Prevention', body: 'We install checkpoints that catch defects and compliance risks earlier in the cycle.' },
        { title: 'Cost and Lead-Time Governance', body: 'We improve cost visibility and lead-time decisions before delays spread across teams.' },
        { title: 'Cross-Functional Handoff Reliability', body: 'We strengthen transitions between sourcing, development, and production to avoid rework.' },
        { title: 'Operational Review Cadence', body: 'We turn weekly operational data into concrete next actions for throughput and reliability.' },
      ],
      education: [
        { title: 'Curriculum-to-Market Alignment', body: `We align your ${roleName} curriculum with current market expectations for modeling, portfolio quality, and employability.` },
        { title: 'Practical Casting Simulation Blocks', body: 'We structure realistic casting and feedback simulations that build student readiness under pressure.' },
        { title: 'Faculty Evaluation Consistency', body: 'We standardize evaluation rubrics so students receive clearer, fairer progression signals.' },
        { title: 'Industry Partnership Pipeline', body: 'We strengthen agency and brand touchpoints to improve placement outcomes for graduating cohorts.' },
        { title: 'Programme Performance Dashboard', body: 'We convert student outcomes into measurable programme improvements every term.' },
      ],
    },
    fr: {
      creative: [
        { title: 'Architecture des décisions créatives', body: `Nous transformons vos responsabilités ${roleName} en système clair d’arbitrage pour qualité conceptuelle, timing et cohérence de marque.` },
        { title: 'Calibration de la direction visuelle', body: 'Nous renforçons les rituels de critique pour aligner plus vite les équipes sur références, choix et validations.' },
        { title: 'Rythme d’exécution inter-équipes', body: 'Nous fluidifions le passage créatif-produit-production pour réduire les frictions de livraison.' },
        { title: 'Preuve de portfolio et de leadership', body: 'Nous positionnons vos livrables comme preuve de jugement stratégique, pas seulement esthétique.' },
        { title: 'Planification des pics de pression', body: 'Nous construisons des routines de semaines critiques pour garder un niveau de qualité stable.' },
      ],
      operations: [
        { title: 'Pilotage fournisseurs et échantillons', body: `Nous structurons votre flux ${roleName} pour clarifier suivi fournisseurs, statut échantillons et escalades.` },
        { title: 'Prévention qualité et risques', body: 'Nous installons des jalons qui détectent plus tôt défauts et risques de conformité.' },
        { title: 'Gouvernance coûts et délais', body: 'Nous améliorons la visibilité coûts et les décisions de lead-time avant propagation des retards.' },
        { title: 'Fiabilité des transitions inter-fonctions', body: 'Nous renforçons les passages achats-développement-production pour limiter les reprises.' },
        { title: 'Cadence de revue opérationnelle', body: 'Nous transformons les données hebdomadaires en actions concrètes sur débit et fiabilité.' },
      ],
      education: [
        { title: 'Alignement programme-marché', body: `Nous alignons votre programme ${roleName} avec les attentes du marché sur mannequinat, portfolio et employabilité.` },
        { title: 'Blocs de simulation de casting', body: 'Nous structurons des simulations réalistes de casting et feedback pour préparer les étudiants à la pression terrain.' },
        { title: 'Cohérence d’évaluation pédagogique', body: 'Nous harmonisons les rubriques d’évaluation pour des signaux de progression plus justes.' },
        { title: 'Pipeline de partenariats industrie', body: 'Nous renforçons les liens agences-marques pour améliorer les sorties vers l’emploi.' },
        { title: 'Tableau de bord de performance', body: 'Nous convertissons les résultats étudiants en améliorations mesurables à chaque session.' },
      ],
    },
    es: {
      creative: [
        { title: 'Arquitectura de decisiones creativas', body: `Convertimos tus responsabilidades de ${roleName} en un sistema claro para calidad conceptual, ritmo y coherencia de marca.` },
        { title: 'Calibración de dirección visual', body: 'Fortalecemos rutinas de crítica para alinear equipos con más rapidez en referencias, edición y selección final.' },
        { title: 'Ritmo de ejecución entre áreas', body: 'Mejoramos el traspaso entre creativo, producto y producción para reducir fricción en entregas.' },
        { title: 'Prueba de portafolio y liderazgo', body: 'Posicionamos tus entregables como evidencia de criterio estratégico, no solo estética.' },
        { title: 'Planificación de semanas de presión', body: 'Diseñamos rutinas prácticas para semanas pico y mantener estabilidad de calidad bajo plazos cortos.' },
      ],
      operations: [
        { title: 'Control de proveedores y muestras', body: `Estructuramos tu flujo de ${roleName} para ordenar actualizaciones de proveedores, estado de muestras y escalados.` },
        { title: 'Prevención de calidad y riesgo', body: 'Instalamos hitos que detectan antes defectos y riesgos de conformidad.' },
        { title: 'Gobernanza de coste y plazo', body: 'Mejoramos visibilidad de costes y decisiones de lead-time antes de que los retrasos se propaguen.' },
        { title: 'Fiabilidad en traspasos entre funciones', body: 'Fortalecemos transición entre abastecimiento, desarrollo y producción para reducir retrabajo.' },
        { title: 'Cadencia de revisión operativa', body: 'Convertimos datos semanales en acciones concretas para elevar rendimiento y fiabilidad.' },
      ],
      education: [
        { title: 'Alineación de programa con mercado', body: `Alineamos tu programa de ${roleName} con exigencias actuales del mercado en modelaje, portafolio y empleabilidad.` },
        { title: 'Bloques de simulación de casting', body: 'Estructuramos simulaciones reales de casting y feedback para preparar al alumnado en escenarios de presión.' },
        { title: 'Consistencia de evaluación docente', body: 'Unificamos rúbricas para que las señales de progreso sean más claras y justas.' },
        { title: 'Pipeline de alianzas con industria', body: 'Reforzamos vínculos con agencias y marcas para mejorar inserción profesional de los egresados.' },
        { title: 'Panel de rendimiento del programa', body: 'Transformamos resultados del alumnado en mejoras medibles del programa cada ciclo.' },
      ],
    },
    it: {
      creative: [
        { title: 'Architettura delle decisioni creative', body: `Trasformiamo le tue responsabilità ${roleName} in un sistema chiaro per qualità concettuale, ritmo e coerenza di marca.` },
        { title: 'Calibrazione della direzione visiva', body: 'Rafforziamo le routine di critica per allineare più velocemente team, riferimenti, editing e selezione finale.' },
        { title: 'Ritmo esecutivo tra funzioni', body: 'Miglioriamo i passaggi tra creativo, prodotto e produzione per ridurre attrito nelle consegne.' },
        { title: 'Prova di portfolio e leadership', body: 'Posizioniamo i tuoi output come prova di giudizio strategico, non solo estetico.' },
        { title: 'Pianificazione dei picchi di pressione', body: 'Disegniamo routine pratiche per le settimane critiche e una qualità stabile sotto scadenza.' },
      ],
      operations: [
        { title: 'Controllo fornitori e campioni', body: `Strutturiamo il tuo flusso ${roleName} per aggiornamenti più chiari su fornitori, stato campioni ed escalation.` },
        { title: 'Prevenzione qualità e rischio', body: 'Inseriamo checkpoint che intercettano prima difetti e rischi di conformità.' },
        { title: 'Governance di costi e tempi', body: 'Miglioriamo visibilità costi e decisioni di lead-time prima che i ritardi si estendano.' },
        { title: 'Affidabilità nei passaggi interfunzione', body: 'Rafforziamo transizioni tra approvvigionamento, sviluppo e produzione per ridurre rilavorazioni.' },
        { title: 'Cadenza di revisione operativa', body: 'Convertiamo dati settimanali in azioni concrete per throughput e affidabilità.' },
      ],
      education: [
        { title: 'Allineamento programma-mercato', body: `Allineiamo il tuo programma ${roleName} alle richieste attuali del mercato su modeling, portfolio e occupabilità.` },
        { title: 'Blocchi di simulazione casting', body: 'Strutturiamo simulazioni realistiche di casting e feedback per preparare gli studenti alla pressione reale.' },
        { title: 'Coerenza della valutazione docente', body: 'Uniformiamo rubriche di valutazione per segnali di progressione più chiari ed equi.' },
        { title: 'Pipeline di partnership con l’industria', body: 'Rafforziamo relazioni con agenzie e brand per migliorare gli esiti di placement dei diplomati.' },
        { title: 'Cruscotto prestazioni del programma', body: 'Trasformiamo i risultati degli studenti in miglioramenti misurabili del programma a ogni ciclo.' },
      ],
    },
    pt: {
      creative: [
        { title: 'Arquitetura de decisões criativas', body: `Transformamos suas responsabilidades de ${roleName} em um sistema claro para qualidade conceitual, ritmo e coerência de marca.` },
        { title: 'Calibragem de direção visual', body: 'Fortalecemos rotinas de crítica para alinhar equipes com mais rapidez em referências, edição e seleção final.' },
        { title: 'Ritmo de execução entre áreas', body: 'Melhoramos a passagem entre criativo, produto e produção para reduzir fricção de entrega.' },
        { title: 'Prova de portfólio e liderança', body: 'Posicionamos suas entregas como evidência de julgamento estratégico, não apenas estética.' },
        { title: 'Planejamento para semanas de pressão', body: 'Desenhamos rotinas práticas para semanas de pico e manutenção da qualidade sob prazos curtos.' },
      ],
      operations: [
        { title: 'Controle de fornecedores e amostras', body: `Estruturamos seu fluxo de ${roleName} para organizar atualização de fornecedores, status de amostras e escalonamento.` },
        { title: 'Prevenção de qualidade e risco', body: 'Instalamos checkpoints que antecipam defeitos e riscos de conformidade.' },
        { title: 'Governança de custo e prazo', body: 'Melhoramos visibilidade de custos e decisões de lead-time antes de atrasos se espalharem.' },
        { title: 'Confiabilidade na transição entre funções', body: 'Fortalecemos a passagem entre abastecimento, desenvolvimento e produção para reduzir retrabalho.' },
        { title: 'Cadência de revisão operacional', body: 'Convertemos dados semanais em ações concretas para elevar vazão e confiabilidade.' },
      ],
      education: [
        { title: 'Alinhamento de programa ao mercado', body: `Alinhamos seu programa de ${roleName} às exigências atuais do mercado em modelagem, portfólio e empregabilidade.` },
        { title: 'Blocos de simulação de casting', body: 'Estruturamos simulações realistas de casting e feedback para preparar estudantes sob pressão de mercado.' },
        { title: 'Consistência da avaliação docente', body: 'Padronizamos rubricas de avaliação para sinais de progressão mais claros e justos.' },
        { title: 'Pipeline de parcerias com a indústria', body: 'Fortalecemos conexões com agências e marcas para melhorar resultados de colocação dos formandos.' },
        { title: 'Painel de desempenho do programa', body: 'Transformamos resultados de estudantes em melhorias mensuráveis no programa a cada ciclo.' },
      ],
    },
    de: {
      creative: [
        { title: 'Architektur kreativer Entscheidungen', body: `Wir übersetzen Ihre ${roleName}-Verantwortung in ein klares System für Konzeptqualität, Timing und Markenkohärenz.` },
        { title: 'Kalibrierung visueller Führung', body: 'Wir stärken Kritikroutinen, damit Teams Referenzen, Auswahl und Finalisierung schneller ausrichten.' },
        { title: 'Ausführungsrhythmus zwischen Bereichen', body: 'Wir verbessern Übergaben zwischen Kreativ-, Produkt- und Produktionsteams, um Lieferfriktion zu senken.' },
        { title: 'Portfolio- und Führungsnachweis', body: 'Wir positionieren Ihre Ergebnisse als Beleg für strategisches Urteil, nicht nur für Ästhetik.' },
        { title: 'Planung für Druckphasen', body: 'Wir bauen praktische Routinen für Spitzenwochen auf, damit Qualität unter engen Fristen stabil bleibt.' },
      ],
      operations: [
        { title: 'Lieferanten- und Musterflusskontrolle', body: `Wir strukturieren Ihren ${roleName}-Ablauf für klarere Lieferantenupdates, Musterstatus und Eskalationszeitpunkte.` },
        { title: 'Qualitäts- und Risikoprävention', body: 'Wir setzen Prüfstationen, die Defekte und Compliance-Risiken früher sichtbar machen.' },
        { title: 'Kosten- und Lead-Time-Governance', body: 'Wir verbessern Kostentransparenz und Lead-Time-Entscheidungen, bevor Verzögerungen in andere Teams laufen.' },
        { title: 'Zuverlässige Übergaben zwischen Funktionen', body: 'Wir stärken Übergänge zwischen Beschaffung, Entwicklung und Produktion, um Nacharbeit zu vermeiden.' },
        { title: 'Operative Review-Kadenz', body: 'Wir übersetzen Wochendaten in konkrete Maßnahmen für Durchsatz und Zuverlässigkeit.' },
      ],
      education: [
        { title: 'Programm-Markt-Abgleich', body: `Wir richten Ihr ${roleName}-Programm auf aktuelle Marktanforderungen für Modeling, Portfolioqualität und Beschäftigungsfähigkeit aus.` },
        { title: 'Praxisnahe Casting-Simulationsblöcke', body: 'Wir strukturieren realistische Casting- und Feedback-Simulationen für belastbare Einsatzreife der Studierenden.' },
        { title: 'Konsistente Bewertungsrubriken', body: 'Wir vereinheitlichen Bewertungsraster, damit Entwicklungssignale klarer und fairer werden.' },
        { title: 'Industrie-Partnerschaftspipeline', body: 'Wir stärken Schnittstellen zu Agenturen und Marken, um Platzierungsergebnisse zu verbessern.' },
        { title: 'Programm-Performance-Dashboard', body: 'Wir übersetzen Studierenden-Ergebnisse in messbare Programmverbesserungen pro Semester.' },
      ],
    },
  };

  const localeTemplates = templatesByLocale[locale] || templatesByLocale.en;
  if (localeTemplates[persona]) return localeTemplates[persona];

  const trackTemplates = trackFallbackByLocale[locale] || trackFallbackByLocale.en;
  return trackTemplates[roleTrack] || null;
}

function roleSpecificMasterclassOverride(profileId, roleName, roleReferenceEn, locale) {
  const persona = detectRolePersona(roleReferenceEn);
  const profileSpecific = {
    22: {
      en: {
        usp: `A market-facing Masterclass for ${roleName}, built for fashion UGC that performs inside e-commerce funnels, not just social reach.`,
        benefits: [
          'Build fashion-first UGC briefs that connect styling intent, product proof, and conversion goals in one short format.',
          'Train a repeatable e-commerce filming loop: hook, try-on, motion detail, CTA, and clean delivery across variants.',
          'Increase approval speed by translating brand feedback into shot-level corrections before reshoots are requested.',
          'Protect your business with clear usage-right tiers for ads, organic reuse, whitelist, and localization cutdowns.',
          'Track retention and add-to-cart signals to decide what to keep, what to cut, and what to scale next week.',
        ],
      },
      fr: {
        usp: `Une Masterclass orientée marché pour ${roleName}, conçue pour un UGC mode performant dans les tunnels e-commerce, pas seulement en portée sociale.`,
        benefits: [
          'Concevoir des briefs UGC mode qui relient intention stylistique, preuve produit et objectif de conversion dans un format court.',
          'Installer une boucle de tournage e-commerce répétable: accroche, essayage, détail en mouvement, CTA et livraison multi-versions.',
          'Accélérer les validations en traduisant les retours marque en corrections de plans avant demandes de reshoot.',
          'Sécuriser votre activité avec des paliers clairs de droits d’usage: ads, organique, whitelist et déclinaisons locales.',
          'Lire rétention et ajout panier pour décider quoi garder, couper et amplifier la semaine suivante.',
        ],
      },
      es: {
        usp: `Una Masterclass orientada al mercado para ${roleName}, diseñada para UGC de moda que rinde dentro del embudo e-commerce, no solo en alcance social.`,
        benefits: [
          'Construir briefs UGC de moda que conecten intención de estilismo, prueba de producto y objetivo de conversión en formato corto.',
          'Crear un ciclo repetible de filmación e-commerce: gancho, prueba, detalle en movimiento, CTA y entrega por variantes.',
          'Acelerar aprobaciones al convertir feedback de marca en correcciones de plano antes de pedir regrabación.',
          'Proteger tu negocio con niveles claros de derechos de uso para ads, orgánico, whitelist y versiones locales.',
          'Usar retención y add-to-cart para decidir qué mantener, qué recortar y qué escalar la semana siguiente.',
        ],
      },
      it: {
        usp: `Una Masterclass orientata al mercato per ${roleName}, pensata per UGC moda che performa dentro i funnel e-commerce, non solo in reach social.`,
        benefits: [
          'Costruire brief UGC fashion che uniscano intenzione stilistica, prova prodotto e obiettivo di conversione in formati brevi.',
          'Impostare un ciclo e-commerce ripetibile: hook, prova capo, dettaglio in movimento, CTA e consegna multi-variante.',
          'Velocizzare le approvazioni traducendo feedback brand in correzioni di inquadratura prima dei reshoot.',
          'Proteggere il lavoro con livelli chiari di diritti d’uso: ads, organico, whitelist e cutdown localizzati.',
          'Usare retention e add-to-cart per scegliere cosa mantenere, cosa tagliare e cosa scalare nella settimana successiva.',
        ],
      },
      pt: {
        usp: `Uma Masterclass orientada ao mercado para ${roleName}, desenhada para UGC de moda que performa dentro do funil e-commerce, não só em alcance social.`,
        benefits: [
          'Construir briefs de UGC de moda que conectem intenção de styling, prova de produto e meta de conversão em formato curto.',
          'Estruturar um ciclo repetível de gravação e-commerce: gancho, prova, detalhe em movimento, CTA e entrega por variações.',
          'Acelerar aprovações ao transformar feedback de marca em correções de plano antes de novas captações.',
          'Proteger o negócio com camadas claras de direitos de uso para ads, orgânico, whitelist e versões localizadas.',
          'Usar retenção e add-to-cart para decidir o que manter, cortar e escalar na semana seguinte.',
        ],
      },
      de: {
        usp: `Eine marktorientierte Masterclass für ${roleName}, entwickelt für Fashion-UGC, das im E-Commerce-Funnel performt und nicht nur Reichweite erzeugt.`,
        benefits: [
          'Fashion-UGC-Briefs entwickeln, die Styling-Intention, Produktbeweis und Konversionsziel in kurzen Formaten verbinden.',
          'Einen wiederholbaren E-Commerce-Drehzyklus aufbauen: Hook, Anprobe, Bewegungsdetail, CTA und Variantenlieferung.',
          'Freigaben beschleunigen, indem Markenfeedback vor Reshoots in konkrete Shot-Korrekturen übersetzt wird.',
          'Ihr Geschäft mit klaren Nutzungsrechtsstufen schützen: Ads, organische Nutzung, Whitelist und lokalisierte Cutdowns.',
          'Retention- und Add-to-Cart-Signale nutzen, um zu entscheiden, was bleibt, was entfällt und was nächste Woche skaliert.',
        ],
      },
    },
    37: {
      en: {
        usp: `A production-driven Masterclass for ${roleName}, focused on casting operations for fashion UGC and e-commerce model pipelines.`,
        benefits: [
          'Build model shortlists for UGC and e-commerce briefs with clearer fit, diversity, and conversion-readiness criteria.',
          'Run callback rounds with cleaner timing across agencies, creators, and fitting availability under compressed calendars.',
          'Translate creative and commerce requirements into board logic clients can approve faster and with fewer revisions.',
          'Reduce talent drop-off through clearer communication protocols from first outreach to final confirmation.',
          'Turn casting outcomes into data-backed adjustments for stronger next-round model recommendations.',
        ],
      },
      fr: {
        usp: `Une Masterclass orientée production pour ${roleName}, centrée sur les opérations de casting pour pipelines mannequins UGC mode et e-commerce.`,
        benefits: [
          'Construire des shortlists mannequins UGC et e-commerce avec des critères plus nets de fit, diversité et potentiel de conversion.',
          'Piloter les callbacks avec un timing plus propre entre agences, créateurs et disponibilités fitting.',
          'Traduire les exigences créatives et commerciales en logique de board validable plus vite par les clients.',
          'Réduire la perte de talents grâce à des protocoles de communication clairs du premier contact à la confirmation finale.',
          'Transformer les résultats casting en ajustements mesurables pour les recommandations du cycle suivant.',
        ],
      },
      es: {
        usp: `Una Masterclass de enfoque productivo para ${roleName}, centrada en operación de casting para pipelines de modelos de moda UGC y e-commerce.`,
        benefits: [
          'Construir shortlists de modelos para briefs UGC y e-commerce con criterios más claros de ajuste, diversidad y preparación para convertir.',
          'Gestionar callbacks con mejor sincronía entre agencias, creadores y disponibilidad de fitting en calendarios comprimidos.',
          'Traducir exigencias creativas y comerciales en lógica de board que el cliente apruebe más rápido y con menos cambios.',
          'Reducir la pérdida de talento con protocolos de comunicación más claros desde el primer contacto hasta la confirmación.',
          'Convertir resultados de casting en ajustes medibles para recomendaciones más sólidas en la siguiente ronda.',
        ],
      },
      it: {
        usp: `Una Masterclass orientata alla produzione per ${roleName}, focalizzata sulle operazioni di casting per pipeline modelli UGC fashion ed e-commerce.`,
        benefits: [
          'Costruire shortlist modelli per brief UGC ed e-commerce con criteri più chiari di aderenza, diversità e prontezza alla conversione.',
          'Gestire i callback con tempi più puliti tra agenzie, creator e disponibilità fitting sotto calendari compressi.',
          'Tradurre esigenze creative e commerciali in logiche board approvabili più rapidamente dai clienti.',
          'Ridurre perdita di talenti con protocolli comunicativi chiari dal primo contatto alla conferma finale.',
          'Trasformare esiti casting in correzioni misurabili per raccomandazioni più forti nel ciclo successivo.',
        ],
      },
      pt: {
        usp: `Uma Masterclass orientada à produção para ${roleName}, focada na operação de casting para pipelines de modelos de moda UGC e e-commerce.`,
        benefits: [
          'Construir shortlists de modelos para briefs UGC e e-commerce com critérios mais claros de fit, diversidade e prontidão de conversão.',
          'Conduzir callbacks com melhor sincronização entre agências, criadores e disponibilidade de fitting em calendários comprimidos.',
          'Traduzir exigências criativas e comerciais em lógica de board aprovada mais rápido e com menos revisões.',
          'Reduzir perda de talentos com protocolos de comunicação claros do primeiro contato à confirmação final.',
          'Transformar resultados de casting em ajustes mensuráveis para recomendações mais fortes no ciclo seguinte.',
        ],
      },
      de: {
        usp: `Eine produktionsorientierte Masterclass für ${roleName}, mit Fokus auf Casting-Operationen für Fashion-UGC- und E-Commerce-Model-Pipelines.`,
        benefits: [
          'Model-Shortlists für UGC- und E-Commerce-Briefs mit klareren Kriterien für Fit, Diversität und Konversionsreife aufbauen.',
          'Callback-Runden zeitlich sauber zwischen Agenturen, Creators und Fitting-Verfügbarkeiten steuern.',
          'Kreative und kommerzielle Anforderungen in Board-Logik übersetzen, die schneller und mit weniger Korrekturen freigegeben wird.',
          'Talent-Abbrüche durch klare Kommunikationsprotokolle vom Erstkontakt bis zur finalen Zusage senken.',
          'Casting-Ergebnisse in messbare Anpassungen für stärkere Empfehlungen im nächsten Zyklus überführen.',
        ],
      },
    },
    21: {
      en: {
        usp: `A field-ready Masterclass for ${roleName}, focused on the daily mechanics of high-volume fashion e-commerce shoots.`,
        benefits: [
          'Increase SKU throughput while preserving pose consistency and garment readability across long studio days.',
          'Master fast outfit transitions, angle discipline, and movement cues needed for cleaner product-page outcomes.',
          'Improve collaboration with stylists, photographers, and studio leads under tight delivery windows.',
          'Protect your rates and rights in recurring e-commerce contracts with clear negotiation checkpoints.',
          'Build repeatable routines that sustain energy, precision, and booking reliability over full seasons.',
        ],
      },
      fr: {
        usp: `Une Masterclass opérationnelle pour ${roleName}, centrée sur les mécanismes quotidiens des shootings mode e-commerce à haut volume.`,
        benefits: [
          'Augmenter le débit SKU tout en gardant constance de pose et lisibilité produit sur de longues journées studio.',
          'Maîtriser transitions rapides, discipline d’angles et repères de mouvement pour des pages produit plus nettes.',
          'Mieux collaborer avec stylistes, photographes et coordination studio sous délais serrés.',
          'Sécuriser tarifs et droits d’usage dans les contrats e-commerce récurrents avec des points de négociation clairs.',
          'Installer des routines durables pour maintenir énergie, précision et fiabilité de booking sur la saison.',
        ],
      },
      es: {
        usp: `Una Masterclass de terreno para ${roleName}, centrada en la mecánica diaria de shootings de moda e-commerce de alto volumen.`,
        benefits: [
          'Aumentar el rendimiento SKU manteniendo consistencia de pose y lectura de prenda en jornadas largas de estudio.',
          'Dominar cambios rápidos, disciplina de ángulos y señales de movimiento para resultados de ficha más limpios.',
          'Mejorar coordinación con estilismo, fotografía y estudio bajo ventanas de entrega exigentes.',
          'Proteger tarifas y derechos de uso en contratos e-commerce recurrentes con hitos de negociación claros.',
          'Construir rutinas repetibles para sostener energía, precisión y fiabilidad de booking durante toda la temporada.',
        ],
      },
      it: {
        usp: `Una Masterclass operativa per ${roleName}, focalizzata sulla meccanica quotidiana degli shooting moda e-commerce ad alto volume.`,
        benefits: [
          'Aumentare throughput SKU mantenendo costanza di posa e leggibilità capo durante lunghe giornate in studio.',
          'Gestire cambi rapidi, disciplina degli angoli e cue di movimento per pagine prodotto più pulite.',
          'Migliorare coordinamento con styling, fotografia e studio sotto finestre di consegna strette.',
          'Proteggere tariffe e diritti d’uso nei contratti e-commerce ricorrenti con checkpoint negoziali chiari.',
          'Costruire routine ripetibili che mantengano energia, precisione e affidabilità di booking durante la stagione.',
        ],
      },
      pt: {
        usp: `Uma Masterclass prática para ${roleName}, focada na mecânica diária de shootings de moda e-commerce em alto volume.`,
        benefits: [
          'Aumentar fluxo SKU mantendo consistência de pose e leitura de peça em longos dias de estúdio.',
          'Dominar trocas rápidas, disciplina de ângulo e sinais de movimento para páginas de produto mais limpas.',
          'Melhorar coordenação com styling, fotografia e estúdio em janelas de entrega apertadas.',
          'Proteger diária e direitos de uso em contratos e-commerce recorrentes com checkpoints de negociação claros.',
          'Construir rotinas repetíveis para sustentar energia, precisão e confiabilidade de booking ao longo da temporada.',
        ],
      },
      de: {
        usp: `Eine praxisnahe Masterclass für ${roleName}, fokussiert auf die tägliche Mechanik von Fashion-E-Commerce-Shootings mit hohem Volumen.`,
        benefits: [
          'SKU-Durchsatz steigern und zugleich Pose-Konsistenz sowie Produktlesbarkeit über lange Studiotage sichern.',
          'Schnelle Outfit-Wechsel, Winkel-Disziplin und Bewegungs-Cues für sauberere Produktseiten trainieren.',
          'Zusammenarbeit mit Styling, Fotografie und Studioleitung unter engen Lieferfenstern verbessern.',
          'Tagessätze und Nutzungsrechte in wiederkehrenden E-Commerce-Verträgen mit klaren Verhandlungspunkten absichern.',
          'Wiederholbare Routinen aufbauen, die Energie, Präzision und Booking-Zuverlässigkeit über ganze Saisons sichern.',
        ],
      },
    },
  };

  const localeEntry = profileSpecific[profileId];
  if (localeEntry) {
    return localeEntry[locale] || localeEntry.en || null;
  }

  return buildExtendedPersonaMasterclass(persona, roleName, locale);
}

function getTrackDayToDayFocus(locale, roleTrack) {
  const map = {
    en: {
      creative: {
        p1: 'creative priorities, review rhythm, and concept consistency',
        p2: 'cross-team alignment between design, image, and delivery',
        p3: 'quality decisions under calendar and budget pressure',
        p4: 'supplier and partner coordination without visual drift',
        p5: 'weekly choices that protect both identity and margin',
      },
      content: {
        p1: 'pre-production planning, set pacing, and shot continuity',
        p2: 'handoffs across capture, editing, and publishing windows',
        p3: 'quality control across campaign, e-commerce, and social formats',
        p4: 'daily approvals with clients and internal creative teams',
        p5: 'output consistency while deadlines compress',
      },
      talent: {
        p1: 'shortlist quality, casting readiness, and booking follow-through',
        p2: 'daily communication with talent, agencies, and clients',
        p3: 'fit, reliability, and timing decisions under pressure',
        p4: 'rights and contract checks before confirmations',
        p5: 'career-progression choices that hold over seasons',
      },
      operations: {
        p1: 'supplier updates, sample status, and escalation timing',
        p2: 'quality checkpoints before production drift expands',
        p3: 'planning adjustments across sourcing, production, and logistics',
        p4: 'cost and lead-time trade-offs in daily operations',
        p5: 'repeatable routines that reduce rework and risk',
      },
      marketing: {
        p1: 'message clarity across campaign, social, and PR channels',
        p2: 'daily decisions on content priority and launch timing',
        p3: 'audience-response reading and creative recalibration',
        p4: 'alignment between brand voice and commercial targets',
        p5: 'channel coordination that protects long-term trust',
      },
      digital: {
        p1: 'catalog quality, merchandising clarity, and conversion flow',
        p2: 'daily priorities between platform fixes and campaign requests',
        p3: 'journey friction checks from discovery to checkout',
        p4: 'governance around data quality and automation decisions',
        p5: 'retention actions based on real behavior signals',
      },
      education: {
        p1: 'curriculum updates aligned with real market expectations',
        p2: 'faculty calibration and consistent student feedback standards',
        p3: 'student progression reviews and intervention timing',
        p4: 'industry-bridge decisions tied to employability outcomes',
        p5: 'school-quality governance that protects reputation',
      },
    },
    fr: {
      creative: {
        p1: 'les priorités créatives, le rythme de revue et la cohérence des concepts',
        p2: 'l’alignement quotidien entre design, image et livraison',
        p3: 'les arbitrages qualité sous pression de calendrier et de budget',
        p4: 'la coordination fournisseurs et partenaires sans dérive visuelle',
        p5: 'les décisions hebdomadaires qui protègent identité et marge',
      },
      content: {
        p1: 'la préparation, le rythme de plateau et la continuité des plans',
        p2: 'les passages entre captation, montage et fenêtres de publication',
        p3: 'le contrôle qualité entre campagne, e-commerce et social',
        p4: 'les validations quotidiennes avec clients et direction créative',
        p5: 'la constance de sortie malgré des délais serrés',
      },
      talent: {
        p1: 'la qualité des shortlists, la préparation casting et le suivi booking',
        p2: 'la communication quotidienne avec talents, agences et clients',
        p3: 'les décisions d’adéquation, de fiabilité et de timing sous tension',
        p4: 'la vérification des droits et contrats avant confirmation',
        p5: 'les choix de progression de carrière dans la durée',
      },
      operations: {
        p1: 'les mises à jour fournisseurs, le statut des échantillons et les escalades',
        p2: 'les points de contrôle qualité avant propagation des écarts',
        p3: 'les ajustements de planification entre achats, production et logistique',
        p4: 'les arbitrages coût et délai dans l’exécution quotidienne',
        p5: 'les routines répétables qui réduisent reprises et risques',
      },
      marketing: {
        p1: 'la clarté du message entre campagne, social et relations publiques',
        p2: 'les choix quotidiens de priorité contenu et de timing de lancement',
        p3: 'la lecture de la réponse audience et le recalibrage créatif',
        p4: 'l’alignement entre voix de marque et objectifs commerciaux',
        p5: 'la coordination des canaux qui protège la confiance long terme',
      },
      digital: {
        p1: 'la qualité catalogue, la lisibilité merchandising et le flux de conversion',
        p2: 'les priorités quotidiennes entre corrections plateforme et demandes campagne',
        p3: 'la détection des frictions du parcours jusqu’au paiement',
        p4: 'la gouvernance de la qualité de données et des automatisations',
        p5: 'les actions de rétention basées sur des signaux d’usage réels',
      },
      education: {
        p1: 'les mises à jour de programme alignées sur le marché réel',
        p2: 'la calibration des formateurs et la cohérence du retour étudiant',
        p3: 'le suivi de progression et le bon timing d’intervention',
        p4: 'les décisions de passerelles industrie liées à l’employabilité',
        p5: 'la gouvernance qualité de l’école et la protection de réputation',
      },
    },
    es: {
      creative: {
        p1: 'las prioridades creativas, el ritmo de revisión y la coherencia conceptual',
        p2: 'la alineación diaria entre diseño, imagen y entrega',
        p3: 'las decisiones de calidad bajo presión de calendario y presupuesto',
        p4: 'la coordinación con proveedores y socios sin deriva visual',
        p5: 'las elecciones semanales que protegen identidad y margen',
      },
      content: {
        p1: 'la preparación, el ritmo de set y la continuidad de planos',
        p2: 'los traspasos entre captura, edición y ventanas de publicación',
        p3: 'el control de calidad entre campaña, e-commerce y social',
        p4: 'las aprobaciones diarias con cliente y dirección creativa',
        p5: 'la consistencia de salida aun con plazos comprimidos',
      },
      talent: {
        p1: 'la calidad de shortlists, la preparación de casting y el seguimiento de booking',
        p2: 'la comunicación diaria con talento, agencias y clientes',
        p3: 'las decisiones de ajuste, fiabilidad y timing bajo presión',
        p4: 'la revisión de derechos y contratos antes de confirmar',
        p5: 'las decisiones de progreso de carrera que sostienen el largo plazo',
      },
      operations: {
        p1: 'actualizaciones de proveedores, estado de muestras y escaladas',
        p2: 'hitos de control de calidad antes de que crezcan los desvíos',
        p3: 'ajustes de planificación entre abastecimiento, producción y logística',
        p4: 'equilibrios diarios entre coste y plazo',
        p5: 'rutinas repetibles para reducir retrabajo y riesgo',
      },
      marketing: {
        p1: 'la claridad del mensaje entre campaña, social y relaciones públicas',
        p2: 'decisiones diarias de prioridad de contenido y tiempo de lanzamiento',
        p3: 'lectura de respuesta de audiencia y recalibración creativa',
        p4: 'alineación entre voz de marca y objetivos comerciales',
        p5: 'coordinación de canales para proteger la confianza a largo plazo',
      },
      digital: {
        p1: 'la calidad de catálogo, claridad de merchandising y flujo de conversión',
        p2: 'prioridades diarias entre correcciones de plataforma y campañas',
        p3: 'detección de fricciones del recorrido hasta checkout',
        p4: 'gobernanza de calidad de datos y automatización',
        p5: 'acciones de retención basadas en señales reales de uso',
      },
      education: {
        p1: 'la actualización curricular alineada con expectativas de mercado',
        p2: 'la calibración docente y consistencia del feedback al alumnado',
        p3: 'revisión de progreso estudiantil y momento de intervención',
        p4: 'decisiones de puente con industria para empleabilidad',
        p5: 'gobernanza de calidad académica y reputación institucional',
      },
    },
    it: {
      creative: {
        p1: 'le priorità creative, il ritmo di revisione e la coerenza del concept',
        p2: 'l’allineamento quotidiano tra design, immagine e consegna',
        p3: 'gli arbitraggi qualità sotto pressione di calendario e budget',
        p4: 'la coordinazione con fornitori e partner senza deriva visiva',
        p5: 'le scelte settimanali che proteggono identità e margine',
      },
      content: {
        p1: 'la preparazione, il ritmo di set e la continuità delle inquadrature',
        p2: 'i passaggi tra acquisizione, montaggio e finestre di pubblicazione',
        p3: 'il controllo qualità tra campagna, e-commerce e social',
        p4: 'le approvazioni quotidiane con cliente e direzione creativa',
        p5: 'la costanza di output anche con scadenze compresse',
      },
      talent: {
        p1: 'la qualità delle shortlist, la preparazione casting e il follow-up booking',
        p2: 'la comunicazione quotidiana con talenti, agenzie e clienti',
        p3: 'le decisioni di aderenza, affidabilità e timing sotto pressione',
        p4: 'la verifica di diritti e contratti prima della conferma',
        p5: 'le scelte di progressione carriera che tengono nel tempo',
      },
      operations: {
        p1: 'gli aggiornamenti fornitori, lo stato campioni e le escalation',
        p2: 'i checkpoint qualità prima che gli scostamenti si allarghino',
        p3: 'gli aggiustamenti di pianificazione tra approvvigionamento, produzione e logistica',
        p4: 'gli arbitraggi quotidiani tra costo e tempi',
        p5: 'routine ripetibili per ridurre rilavorazioni e rischio',
      },
      marketing: {
        p1: 'la chiarezza del messaggio tra campagna, social e relazioni pubbliche',
        p2: 'le decisioni giornaliere su priorità contenuti e timing di lancio',
        p3: 'la lettura della risposta audience e il ricalibro creativo',
        p4: 'l’allineamento tra voce del brand e obiettivi commerciali',
        p5: 'la coordinazione canali che protegge la fiducia nel lungo periodo',
      },
      digital: {
        p1: 'la qualità catalogo, la chiarezza merchandising e il flusso di conversione',
        p2: 'le priorità giornaliere tra correzioni piattaforma e richieste campagna',
        p3: 'la verifica delle frizioni di percorso fino al checkout',
        p4: 'la governance su qualità dati e automazioni',
        p5: 'azioni di retention basate su segnali reali di utilizzo',
      },
      education: {
        p1: 'gli aggiornamenti curricolari allineati alle aspettative di mercato',
        p2: 'la calibrazione docenti e coerenza del feedback agli studenti',
        p3: 'la revisione della progressione studente e il timing di intervento',
        p4: 'le scelte di collegamento con l’industria per l’occupabilità',
        p5: 'la governance qualità scolastica e la reputazione istituzionale',
      },
    },
    pt: {
      creative: {
        p1: 'as prioridades criativas, o ritmo de revisão e a coerência de conceito',
        p2: 'o alinhamento diário entre design, imagem e entrega',
        p3: 'as decisões de qualidade sob pressão de calendário e orçamento',
        p4: 'a coordenação com fornecedores e parceiros sem deriva visual',
        p5: 'as escolhas semanais que protegem identidade e margem',
      },
      content: {
        p1: 'a preparação, o ritmo de set e a continuidade dos planos',
        p2: 'as passagens entre captação, edição e janelas de publicação',
        p3: 'o controlo de qualidade entre campanha, e-commerce e social',
        p4: 'as aprovações diárias com cliente e direção criativa',
        p5: 'a consistência de saída mesmo com prazos comprimidos',
      },
      talent: {
        p1: 'a qualidade de shortlist, a prontidão de casting e o seguimento de booking',
        p2: 'a comunicação diária com talentos, agências e clientes',
        p3: 'as decisões de encaixe, confiabilidade e timing sob pressão',
        p4: 'a revisão de direitos e contratos antes de confirmar',
        p5: 'as escolhas de progressão de carreira ao longo das temporadas',
      },
      operations: {
        p1: 'atualizações de fornecedores, estado de amostras e escalonamentos',
        p2: 'pontos de controlo de qualidade antes de os desvios crescerem',
        p3: 'ajustes de planeamento entre abastecimento, produção e logística',
        p4: 'equilíbrios diários entre custo e prazo',
        p5: 'rotinas repetíveis para reduzir retrabalho e risco',
      },
      marketing: {
        p1: 'a clareza da mensagem entre campanha, social e relações públicas',
        p2: 'decisões diárias de prioridade de conteúdo e momento de lançamento',
        p3: 'leitura da resposta de audiência e recalibração criativa',
        p4: 'alinhamento entre voz da marca e objetivos comerciais',
        p5: 'coordenação de canais para proteger confiança no longo prazo',
      },
      digital: {
        p1: 'a qualidade do catálogo, clareza de merchandising e fluxo de conversão',
        p2: 'prioridades diárias entre correções de plataforma e campanhas',
        p3: 'verificação de fricções da jornada até ao pagamento',
        p4: 'governança de qualidade de dados e automações',
        p5: 'ações de retenção baseadas em sinais reais de comportamento',
      },
      education: {
        p1: 'atualizações curriculares alinhadas às exigências reais do mercado',
        p2: 'calibração docente e consistência de feedback aos estudantes',
        p3: 'revisão de progressão e timing de intervenção pedagógica',
        p4: 'decisões de ponte com a indústria para empregabilidade',
        p5: 'governança de qualidade académica e reputação da escola',
      },
    },
    de: {
      creative: {
        p1: 'kreative Prioritäten, Review-Rhythmus und Konzeptkohärenz',
        p2: 'die tägliche Ausrichtung zwischen Design, Bildsprache und Auslieferung',
        p3: 'Qualitätsentscheidungen unter Kalender- und Budgetdruck',
        p4: 'Lieferanten- und Partnerabstimmung ohne visuelle Drift',
        p5: 'wöchentliche Entscheidungen zum Schutz von Identität und Marge',
      },
      content: {
        p1: 'Vorbereitung, Set-Taktung und Kontinuität der Aufnahmen',
        p2: 'Übergaben zwischen Aufnahme, Schnitt und Veröffentlichungsfenstern',
        p3: 'Qualitätssicherung zwischen Kampagne, E-Commerce und Social-Ausspielung',
        p4: 'tägliche Freigaben mit Kunden und Kreativleitung',
        p5: 'Output-Konsistenz trotz verdichteter Deadlines',
      },
      talent: {
        p1: 'Shortlist-Qualität, Casting-Reife und Booking-Nachverfolgung',
        p2: 'tägliche Kommunikation mit Talenten, Agenturen und Kunden',
        p3: 'Passungs-, Zuverlässigkeits- und Timing-Entscheidungen unter Druck',
        p4: 'Rechte- und Vertragsprüfung vor Zusagen',
        p5: 'Karriereentscheidungen mit Wirkung über ganze Saisons',
      },
      operations: {
        p1: 'Lieferanten-Updates, Musterstatus und Eskalationszeitpunkte',
        p2: 'Qualitätsprüfpunkte vor wachsender Prozessabweichung',
        p3: 'Planungsanpassungen zwischen Beschaffung, Produktion und Logistik',
        p4: 'tägliche Abwägung zwischen Kosten und Terminen',
        p5: 'wiederholbare Routinen zur Reduktion von Nacharbeit und Risiko',
      },
      marketing: {
        p1: 'Botschaftsklarheit über Kampagne, Social und Kommunikation',
        p2: 'tägliche Prioritätsentscheidungen zu Inhalt und Launch-Timing',
        p3: 'Auswertung der Publikumsreaktion und kreative Nachsteuerung',
        p4: 'Ausrichtung zwischen Markenstimme und kommerziellem Ziel',
        p5: 'Kanalkoordination zum Schutz langfristigen Vertrauens',
      },
      digital: {
        p1: 'Katalogqualität, Merchandising-Klarheit und Conversion-Fluss',
        p2: 'tägliche Prioritäten zwischen Plattformkorrekturen und Kampagnenbedarf',
        p3: 'Prüfung von Reibungspunkten entlang der Journey bis zum Kauf',
        p4: 'Governance für Datenqualität und Automatisierungsentscheidungen',
        p5: 'Retention-Maßnahmen aus realen Nutzungssignalen',
      },
      education: {
        p1: 'Curriculum-Updates entlang realer Marktanforderungen',
        p2: 'Dozierenden-Kalibrierung und konsistente Rückmeldestandards',
        p3: 'Lernfortschrittsreviews und passendes Interventions-Timing',
        p4: 'Brückenentscheidungen zur Industrie für Beschäftigungsfähigkeit',
        p5: 'Qualitätsgovernance der Schule und Schutz der Reputation',
      },
    },
  };

  const localeMap = map[locale] || map.en;
  return localeMap[roleTrack] || localeMap.creative;
}

function getProfileCycleVariant(locale, profileId) {
  const idx = Math.max(0, Number(profileId || 1) - 1) % 6;
  const variants = {
    en: ['start-of-day planning', 'pre-shoot preparation', 'live production windows', 'midday approvals', 'end-of-day review', 'next-week carryover'],
    fr: ['préparation du début de journée', 'préparation pré-plateau', 'fenêtres de production en direct', 'validations de milieu de journée', 'bilan de fin de journée', 'reporting vers la semaine suivante'],
    es: ['planificación de inicio de día', 'preparación previa al set', 'ventanas de producción en vivo', 'aprobaciones de mitad de jornada', 'cierre de fin de día', 'arrastre para la semana siguiente'],
    it: ['pianificazione di inizio giornata', 'preparazione pre-set', 'finestre di produzione live', 'approvazioni di metà giornata', 'revisione di fine giornata', 'riporto sulla settimana successiva'],
    pt: ['planeamento de início do dia', 'preparação antes do set', 'janelas de produção ao vivo', 'aprovações de meio do dia', 'revisão de fim de dia', 'transição para a semana seguinte'],
    de: ['Tagesstart-Planung', 'Vorbereitung vor dem Set', 'laufende Produktionsfenster', 'Freigaben zur Tagesmitte', 'Tagesabschluss-Review', 'Übertrag in die nächste Woche'],
  };
  return (variants[locale] || variants.en)[idx];
}

function normalizeServiceSignal(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/g, '')
    .trim();
}

function getAiSignalsFromServices(services, roleTrack, locale) {
  const titles = Array.isArray(services)
    ? services
      .map((item) => normalizeServiceSignal(item?.title || ''))
      .filter(Boolean)
    : [];

  const fallbackByLocale = {
    en: {
      creative: ['creative review flow', 'visual alignment decisions', 'campaign quality gates', 'approval readiness'],
      content: ['shot planning workflow', 'edit continuity checks', 'delivery timing control', 'publish readiness'],
      talent: ['shortlist decisions', 'casting-readiness checks', 'rights review', 'booking follow-up'],
      operations: ['supplier escalation flow', 'quality checkpoints', 'cost-time trade-offs', 'delivery reliability'],
      marketing: ['campaign message testing', 'channel-priority decisions', 'creative-performance review', 'launch timing'],
      digital: ['catalog quality control', 'journey friction analysis', 'automation governance', 'retention triggers'],
      education: ['curriculum review cycle', 'faculty calibration checks', 'student progression alerts', 'placement readiness'],
    },
  };

  const fallbackLocale = fallbackByLocale.en;
  const fallback = (fallbackLocale[roleTrack] || fallbackLocale.creative);
  const merged = [...titles, ...fallback];
  return merged.slice(0, 4);
}

function buildAiMasterclassTeachings(roleName, roleTrack, locale, profileId, services) {
  const cycleVariant = getProfileCycleVariant(locale, profileId);
  const [s1, s2, s3, s4] = getAiSignalsFromServices(services, roleTrack, locale);

  const map = {
    en: [
      `Set up an AI briefing board that turns ${s1} into concrete tasks, owners, and timing during ${cycleVariant}.`,
      `Use retrieval-based AI review to compare yesterday’s decisions on ${s2} and flag the first blocker before it slows delivery.`,
      `Run AI scenario simulations for ${s3} so you can choose the lower-risk option with clearer evidence, not guesswork.`,
      `Generate an AI end-of-day learning report for ${s4} with next-step recommendations you can apply in your ${roleName} workflow tomorrow.`,
    ],
    fr: [
      `Mettre en place un tableau IA qui transforme ${s1} en tâches concrètes, responsables et timing pendant ${cycleVariant}.`,
      `Utiliser une revue IA appuyée sur l’historique pour comparer les décisions d’hier sur ${s2} et repérer le premier blocage avant retard.`,
      `Lancer des simulations IA sur ${s3} pour choisir l’option la moins risquée avec des éléments concrets plutôt qu’à l’intuition.`,
      `Générer un bilan IA de fin de journée sur ${s4} avec des actions directement applicables dès demain dans votre pratique ${roleName}.`,
    ],
    es: [
      `Configurar un tablero de IA que convierta ${s1} en tareas concretas, responsables y tiempos durante ${cycleVariant}.`,
      `Usar una revisión de IA con historial para comparar decisiones de ayer sobre ${s2} y detectar el primer bloqueo antes de retrasar entregas.`,
      `Ejecutar simulaciones de IA sobre ${s3} para elegir la opción de menor riesgo con evidencia concreta y no por intuición.`,
      `Generar un informe de aprendizaje con IA al final del día sobre ${s4}, con acciones aplicables mañana en tu práctica de ${roleName}.`,
    ],
    it: [
      `Impostare una board IA che trasformi ${s1} in attività concrete, responsabili e tempi durante ${cycleVariant}.`,
      `Usare una revisione IA basata sullo storico per confrontare le scelte di ieri su ${s2} e intercettare il primo blocco prima dei ritardi.`,
      `Eseguire simulazioni IA su ${s3} per scegliere l’opzione a rischio minore con evidenze concrete, non a sensazione.`,
      `Generare un report IA di fine giornata su ${s4} con azioni applicabili da domani nella tua pratica ${roleName}.`,
    ],
    pt: [
      `Configurar um quadro de IA que converta ${s1} em tarefas concretas, responsáveis e tempos durante ${cycleVariant}.`,
      `Usar uma revisão de IA com histórico para comparar decisões de ontem sobre ${s2} e detetar o primeiro bloqueio antes de atrasar entregas.`,
      `Executar simulações de IA sobre ${s3} para escolher a opção de menor risco com evidência concreta, e não por intuição.`,
      `Gerar um relatório de aprendizagem com IA no fim do dia sobre ${s4}, com ações aplicáveis amanhã na sua prática ${roleName}.`,
    ],
    de: [
      `Ein KI-Board einrichten, das ${s1} in konkrete Aufgaben, Zuständigkeiten und Zeitfenster für ${cycleVariant} übersetzt.`,
      `Eine KI-gestützte Verlaufsprüfung nutzen, um Entscheidungen von gestern zu ${s2} zu vergleichen und den ersten Engpass vor Verzögerungen zu erkennen.`,
      `KI-Simulationen für ${s3} durchführen, damit Sie die risikoärmere Option auf Basis klarer Evidenz statt Bauchgefühl wählen.`,
      `Einen KI-Lernbericht zum Tagesende für ${s4} erzeugen, mit Schritten, die Sie morgen direkt in Ihrer ${roleName}-Praxis anwenden.`,
    ],
  };

  return map[locale] || map.en;
}

function expandMasterclassBenefits(existingBenefits, roleName, roleTrack, locale, profileId, services) {
  const practical = Array.isArray(existingBenefits) ? [...existingBenefits] : [];
  const focus = getTrackDayToDayFocus(locale, roleTrack);
  const practicalAdditionsByLocale = {
    en: [
      `Clarify your day-to-day operating priorities in ${focus.p1}.`,
      `Strengthen execution discipline for ${focus.p2}.`,
      `Use practical review checkpoints for ${focus.p3}.`,
      `Reduce avoidable friction around ${focus.p4}.`,
      `Convert weekly pressure into repeatable decisions around ${focus.p5}.`,
      `Leave each module with concrete next-week actions tied to your ${roleName} reality.`,
    ],
    fr: [
      `Clarifier vos priorités quotidiennes autour de ${focus.p1}.`,
      `Renforcer la discipline d’exécution sur ${focus.p2}.`,
      `Installer des points de revue concrets pour ${focus.p3}.`,
      `Réduire les frictions évitables liées à ${focus.p4}.`,
      `Transformer la pression hebdomadaire en décisions répétables sur ${focus.p5}.`,
      `Sortir de chaque module avec des actions applicables dès la semaine suivante dans votre réalité ${roleName}.`,
    ],
    es: [
      `Aclarar tus prioridades diarias en torno a ${focus.p1}.`,
      `Reforzar la disciplina de ejecución para ${focus.p2}.`,
      `Instalar puntos de revisión prácticos para ${focus.p3}.`,
      `Reducir fricciones evitables vinculadas a ${focus.p4}.`,
      `Convertir la presión semanal en decisiones repetibles sobre ${focus.p5}.`,
      `Salir de cada módulo con acciones aplicables la semana siguiente en tu realidad de ${roleName}.`,
    ],
    it: [
      `Chiarire le priorità quotidiane attorno a ${focus.p1}.`,
      `Rafforzare la disciplina esecutiva su ${focus.p2}.`,
      `Installare checkpoint pratici di revisione per ${focus.p3}.`,
      `Ridurre attriti evitabili legati a ${focus.p4}.`,
      `Trasformare la pressione settimanale in decisioni ripetibili su ${focus.p5}.`,
      `Uscire da ogni modulo con azioni applicabili già dalla settimana successiva nella tua realtà ${roleName}.`,
    ],
    pt: [
      `Clarificar as suas prioridades diárias em torno de ${focus.p1}.`,
      `Reforçar a disciplina de execução em ${focus.p2}.`,
      `Instalar pontos práticos de revisão para ${focus.p3}.`,
      `Reduzir fricções evitáveis ligadas a ${focus.p4}.`,
      `Transformar a pressão semanal em decisões repetíveis sobre ${focus.p5}.`,
      `Sair de cada módulo com ações aplicáveis na semana seguinte à sua realidade de ${roleName}.`,
    ],
    de: [
      `Ihre täglichen Prioritäten rund um ${focus.p1} klar ausrichten.`,
      `Die Ausführungsdisziplin für ${focus.p2} spürbar stärken.`,
      `Praktische Review-Punkte für ${focus.p3} einführen.`,
      `Vermeidbare Reibung bei ${focus.p4} reduzieren.`,
      `Wöchentlichen Druck in wiederholbare Entscheidungen zu ${focus.p5} übersetzen.`,
      `Jedes Modul mit umsetzbaren Schritten für die nächste Woche in Ihrer ${roleName}-Realität abschließen.`,
    ],
  };

  const practicalAdditions = practicalAdditionsByLocale[locale] || practicalAdditionsByLocale.en;
  while (practical.length < 6) {
    practical.push(practicalAdditions[practical.length % practicalAdditions.length]);
  }

  const aiTeachings = buildAiMasterclassTeachings(roleName, roleTrack, locale, profileId, services);
  return [...practical.slice(0, 6), ...aiTeachings];
}

function nativeizeLocaleText(value, locale) {
  if (typeof value !== 'string' || locale === 'en') return value;

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
        [/\bportafolio\b/g, 'portafolio'],
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
      [/\bfeedback\b/gi, 'retours'],
      [/\breview\b/gi, 'revue'],
      [/\bcheckpoints?\b/gi, 'jalons'],
      [/\bplaybook\b/gi, 'cadre operatoire'],
      [/\bbriefings?\b/gi, 'cadrages'],
      [/\bpipeline\b/gi, 'parcours'],
      [/\bfit\b/gi, 'adequation'],
      [/\bbookings?\b/gi, 'reservations'],
      [/\bcallbacks?\b/gi, 'rappels'],
      [/\brebookings?\b/gi, 'renouvellements'],
      [/\brunway\b/gi, 'defile'],
      [/\bpost-?production\b/gi, 'postproduction'],
      [/\bpostproduction\b/gi, 'postproduction'],
      [/\bset\b/gi, 'plateau'],
      [/\btiming\b/gi, 'calendrier'],
      [/\bbrief\b/gi, 'cadrage'],
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
      [/\bfeedback\b/gi, 'retroalimentacion'],
      [/\breview\b/gi, 'revision'],
      [/\bcheckpoints?\b/gi, 'hitos'],
      [/\bplaybook\b/gi, 'guia operativa'],
      [/\bbriefings?\b/gi, 'encuadres'],
      [/\bpipeline\b/gi, 'proceso'],
      [/\bfit\b/gi, 'ajuste'],
      [/\bbookings?\b/gi, 'reservas'],
      [/\bcallbacks?\b/gi, 'segundas convocatorias'],
      [/\brebookings?\b/gi, 'renovaciones'],
      [/\brunway\b/gi, 'pasarela'],
      [/\bpost-?production\b/gi, 'posproduccion'],
      [/\bset\b/gi, 'rodaje'],
      [/\btiming\b/gi, 'ritmo de ejecucion'],
      [/\bbrief\b/gi, 'resumen inicial'],
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
      [/\bfeedback\b/gi, 'riscontri'],
      [/\breview\b/gi, 'revisione'],
      [/\bcheckpoints?\b/gi, 'tappe di controllo'],
      [/\bplaybook\b/gi, 'guida operativa'],
      [/\bbriefings?\b/gi, 'inquadramenti'],
      [/\bpipeline\b/gi, 'percorso'],
      [/\bfit\b/gi, 'aderenza'],
      [/\bbookings?\b/gi, 'ingaggi'],
      [/\bcallbacks?\b/gi, 'richiami'],
      [/\brebookings?\b/gi, 'nuovi ingaggi'],
      [/\brunway\b/gi, 'passerella'],
      [/\bpost-?production\b/gi, 'postproduzione'],
      [/\bset\b/gi, 'set di ripresa'],
      [/\btiming\b/gi, 'cadenza operativa'],
      [/\bbrief\b/gi, 'inquadramento iniziale'],
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
      [/\bfeedback\b/gi, 'retorno'],
      [/\breview\b/gi, 'revisao'],
      [/\bcheckpoints?\b/gi, 'marcos de controle'],
      [/\bplaybook\b/gi, 'guia operacional'],
      [/\bbriefings?\b/gi, 'direcionamentos'],
      [/\bpipeline\b/gi, 'processo'],
      [/\bfit\b/gi, 'ajuste'],
      [/\bbookings?\b/gi, 'reservas'],
      [/\bcallbacks?\b/gi, 'reconvocacoes'],
      [/\brebookings?\b/gi, 'renovacoes'],
      [/\brunway\b/gi, 'passarela'],
      [/\bpost-?production\b/gi, 'pos-producao'],
      [/\btiming\b/gi, 'cadencia de execucao'],
      [/\bbrief\b/gi, 'direcionamento inicial'],
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
      [/\bfeedback\b/gi, 'Ruckmeldung'],
      [/\breview\b/gi, 'Uberprufung'],
      [/\bcheckpoints?\b/gi, 'Prufpunkte'],
      [/\bplaybook\b/gi, 'Arbeitsleitfaden'],
      [/\bbriefings?\b/gi, 'Einweisungen'],
      [/\bpipeline\b/gi, 'Ablaufkette'],
      [/\bfit\b/gi, 'Passung'],
      [/\bbookings?\b/gi, 'Buchungen'],
      [/\bcallbacks?\b/gi, 'Ruckmeldungen'],
      [/\brebookings?\b/gi, 'Folgebuchungen'],
      [/\brunway\b/gi, 'Laufsteg'],
      [/\bpost-?production\b/gi, 'Postproduktion'],
      [/\bset\b/gi, 'Drehumfeld'],
      [/\btiming\b/gi, 'Taktung'],
      [/\bbrief\b/gi, 'Ausgangsrahmen'],
    ],
  };

  const rules = replacementRules[locale] || [];
  const normalized = rules.reduce((text, [pattern, next]) => text.replace(pattern, next), value).replace(/\s{2,}/g, ' ').trim();
  return restoreLocaleDiacritics(normalized, locale);
}

function nativeizeLocaleEntry(value, locale) {
  if (typeof value === 'string') return nativeizeLocaleText(value, locale);
  if (Array.isArray(value)) return value.map((item) => nativeizeLocaleEntry(item, locale));
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [key, nativeizeLocaleEntry(entryValue, locale)]),
  );
}

function rewriteNonEnglishSourceCopy(library) {
  return Object.fromEntries(
    Object.entries(library).map(([profileKey, localeMap]) => [
      profileKey,
      Object.fromEntries(
        Object.entries(localeMap).map(([locale, copy]) => [locale, nativeizeLocaleEntry(copy, locale)]),
      ),
    ]),
  );
}

const CREATIVE_DIRECTOR_PACK = {
  en: {
    roleName: 'Creative Director',
    navProfile: 'Creative Director',
    heroEyebrow: 'If you are a',
    heroSubtitle: 'This message is for you.',
    labels: {
      profileEyebrow: 'How the role operates in reality',
      challengesTitle: 'Where the role is genuinely tested',
      servicesTitle: 'Support built for strategic creative leadership',
      masterclassTitle: 'Strengthen your creative leadership practice',
    },
    profileSlides: [
      { title: 'Vision With Consequence', text: 'Every aesthetic decision carries commercial, cultural, and team-level consequences. The role demands clarity under pressure, not just taste.' },
      { title: 'Direction Across Channels', text: 'You are aligning collections, campaign language, digital output, and internal standards into one coherent brand rhythm.' },
      { title: 'Authority Through Method', text: 'Your creative authority is sustained when instinct is paired with repeatable decision discipline and transparent leadership.' },
      { title: 'Relevance Without Drift', text: 'You must absorb emerging signals quickly while protecting the deeper identity that makes the brand unmistakable.' },
    ],
    challenges: [
      'Consumer expectations now shift faster than traditional fashion planning cycles.',
      'Commercial urgency can compress the space needed for thoughtful creative development.',
      'Cross-functional alignment gets harder as output expands across more channels.',
      'Innovation pressure can fragment brand coherence when priorities are unclear.',
      'Senior creative teams need both autonomy and sharper operating standards.',
      'High-stakes creative calls are often made with incomplete or conflicting signals.',
    ],
    services: [
      { title: 'Creative Decision Architecture', body: 'We design practical decision frameworks so your aesthetic direction stays coherent, defensible, and timely.' },
      { title: 'Brand Narrative Calibration', body: 'We refine how your brand voice moves from concept to campaign so expression stays precise across channels.' },
      { title: 'Creative Team Leadership Lab', body: 'We help you run clearer critiques, stronger rituals, and healthier accountability inside high-performance teams.' },
      { title: 'Executive Portfolio Positioning', body: 'We recast your portfolio as strategic evidence: choices made, outcomes delivered, leadership demonstrated.' },
      { title: 'Innovation Governance', body: 'We build a testing model for new ideas that protects signature quality while enabling meaningful evolution.' },
    ],
    masterclass: {
      name: 'Masterclass for Creative Directors',
      usp: 'A practice-led intensive for creative leaders who want stronger judgment, not louder output.',
      benefits: [
        'Build a reliable personal framework for high-impact creative decisions.',
        'Align ambition with business logic without flattening originality.',
        'Lead critiques that improve quality and reduce team friction.',
        'Translate trend noise into clear strategic opportunities.',
        'Present your portfolio as proof of leadership impact.',
      ],
      cta: 'View Program Details',
    },
  },
  fr: {
    roleName: 'Directeur artistique',
    navProfile: 'Directeur artistique',
    heroEyebrow: 'Si vous êtes',
    heroSubtitle: 'Ce message est pour vous.',
    labels: {
      profileEyebrow: 'Comment le rôle s’exerce dans la réalité',
      challengesTitle: 'Là où le rôle est vraiment mis à l’épreuve',
      servicesTitle: 'Un accompagnement conçu pour une direction créative stratégique',
      masterclassTitle: 'Renforcer votre pratique de direction créative',
    },
    profileSlides: [
      { title: 'Vision à effets réels', text: 'Chaque choix esthétique a des effets business, culturels et humains. Le rôle demande de la clarté sous pression, pas seulement du goût.' },
      { title: 'Direction à travers les canaux', text: 'Vous alignez collection, campagne, digital et standards d’équipe dans un même rythme de marque.' },
      { title: 'Autorité par la méthode', text: 'L’autorité créative tient dans le temps quand l’intuition s’appuie sur une discipline de décision lisible.' },
      { title: 'Pertinence sans dérive', text: 'Vous captez vite les signaux émergents tout en protégeant l’identité profonde qui rend la marque reconnaissable.' },
    ],
    challenges: [
      'Les attentes clients évoluent plus vite que les cycles de planification traditionnels.',
      'L’urgence commerciale peut réduire l’espace nécessaire au travail créatif de fond.',
      'L’alignement inter-équipes se complexifie à mesure que les canaux se multiplient.',
      'La pression d’innovation peut fragmenter la cohérence de marque.',
      'Les équipes créatives seniors demandent autonomie et standards plus nets.',
      'Les décisions les plus exposées se prennent souvent avec des signaux incomplets.',
    ],
    services: [
      { title: 'Architecture de décision créative', body: 'Nous construisons des cadres décisionnels concrets pour préserver cohérence, vitesse et justesse créative.' },
      { title: 'Calibration du récit de marque', body: 'Nous affinons la circulation de votre voix de marque, du concept à la campagne, sans perte de précision.' },
      { title: 'Laboratoire de leadership créatif', body: 'Nous renforçons vos critiques, vos rituels d’équipe et votre responsabilité opérationnelle.' },
      { title: 'Positionnement portfolio exécutif', body: 'Nous transformons votre portfolio en preuve stratégique: arbitrages, résultats, impact de leadership.' },
      { title: 'Gouvernance de l’innovation', body: 'Nous mettons en place un modèle de test qui ouvre de nouvelles pistes sans diluer la signature.' },
    ],
    masterclass: {
      name: 'Masterclass Directeur artistique',
      usp: 'Un format intensif orienté pratique pour affûter le jugement créatif en contexte réel.',
      benefits: [
        'Construire un cadre personnel fiable pour les décisions à fort enjeu.',
        'Aligner ambition créative et logique économique sans lisser l’originalité.',
        'Conduire des critiques qui élèvent le niveau et réduisent les frictions.',
        'Transformer le bruit des tendances en priorités stratégiques claires.',
        'Présenter votre portfolio comme preuve d’impact de direction.',
      ],
      cta: 'Voir le programme',
    },
  },
  es: {
    roleName: 'Director Creativo',
    navProfile: 'Director Creativo',
    heroEyebrow: 'Si eres',
    heroSubtitle: 'Este mensaje es para ti.',
    labels: {
      profileEyebrow: 'Cómo funciona el rol en la realidad',
      challengesTitle: 'Dónde el rol se pone realmente a prueba',
      servicesTitle: 'Acompañamiento para liderazgo creativo estratégico',
      masterclassTitle: 'Fortalece tu práctica de liderazgo creativo',
    },
    profileSlides: [
      { title: 'Visión con consecuencias', text: 'Cada decisión estética tiene impacto comercial, cultural y humano. El rol exige claridad bajo presión, no solo criterio visual.' },
      { title: 'Dirección entre canales', text: 'Alineas colección, campaña, digital y estándares de equipo dentro de un mismo pulso de marca.' },
      { title: 'Autoridad con método', text: 'La autoridad creativa se sostiene cuando la intuición se apoya en un sistema de decisión consistente.' },
      { title: 'Relevancia sin deriva', text: 'Lees señales emergentes con rapidez sin perder la identidad profunda que distingue a la marca.' },
    ],
    challenges: [
      'Las expectativas del consumidor cambian más rápido que los ciclos de planificación clásicos.',
      'La urgencia comercial puede reducir el espacio para un desarrollo creativo sólido.',
      'Alinear áreas se vuelve más complejo a medida que crecen los canales.',
      'La presión por innovar puede romper la coherencia de marca.',
      'Los equipos senior necesitan autonomía junto con estándares más claros.',
      'Las decisiones más visibles suelen tomarse con señales incompletas.',
    ],
    services: [
      { title: 'Arquitectura de decisión creativa', body: 'Diseñamos marcos de decisión para que tu dirección creativa sea coherente, rápida y defendible.' },
      { title: 'Calibración del relato de marca', body: 'Afinamos cómo viaja la voz de marca desde el concepto hasta la campaña.' },
      { title: 'Laboratorio de liderazgo creativo', body: 'Fortalecemos dinámicas de crítica, rituales de equipo y responsabilidad operativa.' },
      { title: 'Posicionamiento de portafolio ejecutivo', body: 'Convertimos tu portafolio en evidencia estratégica de decisiones, resultados e impacto de liderazgo.' },
      { title: 'Gobernanza de innovación', body: 'Construimos un modelo de prueba para nuevas ideas sin diluir la firma de marca.' },
    ],
    masterclass: {
      name: 'Masterclass para Director Creativo',
      usp: 'Un formato intensivo y práctico para afinar criterio creativo en escenarios de alta exigencia.',
      benefits: [
        'Construir un marco personal para decisiones de alto impacto.',
        'Alinear ambición creativa y lógica de negocio sin perder singularidad.',
        'Guiar críticas que elevan calidad y reducen fricción.',
        'Convertir ruido de tendencias en oportunidades estratégicas claras.',
        'Presentar tu portafolio como prueba de impacto de liderazgo.',
      ],
      cta: 'Ver programa',
    },
  },
  it: {
    roleName: 'Direttore Creativo',
    navProfile: 'Direttore Creativo',
    heroEyebrow: 'Se sei',
    heroSubtitle: 'Questo messaggio è per te.',
    labels: {
      profileEyebrow: 'Come il ruolo funziona nella pratica reale',
      challengesTitle: 'Dove il ruolo viene davvero messo alla prova',
      servicesTitle: 'Supporto pensato per una leadership creativa strategica',
      masterclassTitle: 'Rafforza la tua pratica di leadership creativa',
    },
    profileSlides: [
      { title: 'Visione con conseguenze', text: 'Ogni scelta estetica genera effetti commerciali, culturali e di team. Il ruolo richiede chiarezza sotto pressione, non solo gusto.' },
      { title: 'Direzione tra canali', text: 'Allinei collezione, campagna, digitale e standard operativi in un unico ritmo di marca.' },
      { title: 'Autorevolezza con metodo', text: 'L’autorevolezza creativa dura nel tempo quando l’intuizione è sostenuta da disciplina decisionale.' },
      { title: 'Rilevanza senza deriva', text: 'Interpreti segnali emergenti rapidamente proteggendo l’identità profonda del brand.' },
    ],
    challenges: [
      'Le aspettative del pubblico cambiano più rapidamente dei cicli tradizionali.',
      'L’urgenza commerciale può comprimere il tempo del lavoro creativo di qualità.',
      'Allineare funzioni diverse diventa più complesso con la crescita dei canali.',
      'La pressione all’innovazione può indebolire la coerenza di marca.',
      'I team senior chiedono autonomia insieme a standard più nitidi.',
      'Le decisioni più esposte arrivano spesso con segnali incompleti.',
    ],
    services: [
      { title: 'Architettura decisionale creativa', body: 'Progettiamo cornici decisionali pratiche per mantenere coerenza, velocità e qualità.' },
      { title: 'Calibrazione del racconto di marca', body: 'Affiniamo il passaggio della voce del brand dal concept alla campagna.' },
      { title: 'Laboratorio di leadership creativa', body: 'Rafforziamo critiche, rituali di team e responsabilità operativa.' },
      { title: 'Posizionamento portfolio executive', body: 'Trasformiamo il portfolio in evidenza strategica di scelte, risultati e impatto.' },
      { title: 'Governance dell’innovazione', body: 'Costruiamo un modello di test per nuove direzioni senza perdere identità.' },
    ],
    masterclass: {
      name: 'Masterclass per Direttore Creativo',
      usp: 'Un percorso intensivo e pratico per affinare il giudizio creativo in scenari ad alta pressione.',
      benefits: [
        'Costruire una struttura personale per decisioni ad alto impatto.',
        'Allineare ambizione creativa e logica economica senza appiattire lo stile.',
        'Guidare critiche che alzano qualità e riducono attrito interno.',
        'Tradurre il rumore di tendenza in priorità strategiche chiare.',
        'Presentare il portfolio come prova di leadership e risultati.',
      ],
      cta: 'Scopri il programma',
    },
  },
  pt: {
    roleName: 'Diretor Criativo',
    navProfile: 'Diretor Criativo',
    heroEyebrow: 'Se você é',
    heroSubtitle: 'Esta mensagem é para você.',
    labels: {
      profileEyebrow: 'Como o papel funciona na prática real',
      challengesTitle: 'Onde o papel é realmente testado',
      servicesTitle: 'Suporte para liderança criativa estratégica',
      masterclassTitle: 'Fortaleça sua prática de liderança criativa',
    },
    profileSlides: [
      { title: 'Visão com consequência', text: 'Cada decisão estética produz efeitos comerciais, culturais e humanos. O papel pede clareza sob pressão, não apenas gosto.' },
      { title: 'Direção entre canais', text: 'Você alinha coleção, campanha, digital e padrões de equipe em um único ritmo de marca.' },
      { title: 'Autoridade com método', text: 'A autoridade criativa se sustenta quando intuição e disciplina de decisão caminham juntas.' },
      { title: 'Relevância sem desvio', text: 'Você interpreta sinais emergentes com rapidez sem perder a identidade profunda da marca.' },
    ],
    challenges: [
      'As expectativas do público mudam mais rápido que os ciclos tradicionais de planejamento.',
      'A urgência comercial pode reduzir o espaço do trabalho criativo de qualidade.',
      'Alinhar áreas diferentes fica mais complexo com a multiplicação de canais.',
      'A pressão por inovação pode fragmentar a coerência de marca.',
      'Times seniores precisam de autonomia e padrões mais claros ao mesmo tempo.',
      'As decisões mais visíveis costumam ser tomadas com sinais incompletos.',
    ],
    services: [
      { title: 'Arquitetura de decisão criativa', body: 'Desenhamos estruturas de decisão para manter sua direção criativa coerente e sustentável.' },
      { title: 'Calibragem da narrativa de marca', body: 'Refinamos como a voz da marca atravessa do conceito à campanha.' },
      { title: 'Ateliê de liderança criativa', body: 'Fortalecemos rituais de equipe, qualidade de crítica e responsabilidade operacional.' },
      { title: 'Posicionamento de portfólio executivo', body: 'Transformamos o portfólio em evidência estratégica de escolhas e resultados.' },
      { title: 'Governança da inovação', body: 'Construímos um modelo de teste para novas ideias sem enfraquecer a assinatura da marca.' },
    ],
    masterclass: {
      name: 'Masterclass para Diretor Criativo',
      usp: 'Um intensivo prático para elevar a qualidade das decisões criativas em contextos reais.',
      benefits: [
        'Construir uma estrutura pessoal para decisões de alto impacto.',
        'Alinhar ambição criativa e lógica de negócio sem perder originalidade.',
        'Conduzir críticas que elevam qualidade e reduzem fricção.',
        'Converter ruído de tendência em prioridades estratégicas.',
        'Apresentar o portfólio como prova de impacto de liderança.',
      ],
      cta: 'Ver programa',
    },
  },
  de: {
    roleName: 'Kreativdirektor',
    navProfile: 'Kreativdirektor',
    heroEyebrow: 'Wenn Sie',
    heroSubtitle: 'Diese Botschaft ist für Sie.',
    labels: {
      profileEyebrow: 'Wie die Rolle in der Praxis wirklich funktioniert',
      challengesTitle: 'Wo die Rolle tatsächlich auf die Probe gestellt wird',
      servicesTitle: 'Unterstützung für strategische kreative Führung',
      masterclassTitle: 'Schärfen Sie Ihre Praxis kreativer Führung',
    },
    profileSlides: [
      { title: 'Vision mit Konsequenz', text: 'Jede ästhetische Entscheidung hat wirtschaftliche, kulturelle und teambezogene Folgen. Die Rolle verlangt Klarheit unter Druck.' },
      { title: 'Führung über Kanäle', text: 'Sie verbinden Kollektion, Kampagne, Digital und Teamstandards zu einem konsistenten Markenrhythmus.' },
      { title: 'Autorität durch Methode', text: 'Kreative Autorität bleibt tragfähig, wenn Intuition durch klare Entscheidungsdisziplin gestützt wird.' },
      { title: 'Relevanz ohne Drift', text: 'Sie lesen neue Signale schnell und schützen zugleich die Identität, die die Marke unverwechselbar macht.' },
    ],
    challenges: [
      'Kundenerwartungen verändern sich schneller als klassische Planungszyklen.',
      'Kommerzielle Dringlichkeit kann den Raum für fundierte kreative Entwicklung verkleinern.',
      'Bereichsübergreifende Ausrichtung wird mit zunehmender Kanalvielfalt schwieriger.',
      'Innovationsdruck kann die Markenkohärenz schwächen, wenn Prioritäten unklar sind.',
      'Senior-Kreativteams brauchen gleichzeitig Freiheit und klare Standards.',
      'Die sichtbarsten Entscheidungen entstehen oft aus unvollständigen Signalen.',
    ],
    services: [
      { title: 'Architektur kreativer Entscheidungen', body: 'Wir entwickeln praktikable Entscheidungsrahmen für konsistente, belastbare kreative Führung.' },
      { title: 'Kalibrierung der Markenerzählung', body: 'Wir schärfen den Weg der Markenstimme vom Konzept bis zur Kampagne.' },
      { title: 'Führungslabor für Kreativteams', body: 'Wir stärken Kritikformate, Teamrituale und operative Verantwortung.' },
      { title: 'Strategische Portfolio-Positionierung', body: 'Wir zeigen Ihr Portfolio als belastbaren Nachweis für Entscheidungen und Wirkung.' },
      { title: 'Innovations-Governance', body: 'Wir bauen ein Testmodell für neue Richtungen ohne Verlust der Markensignatur.' },
    ],
    masterclass: {
      name: 'Masterclass für Kreativdirektoren',
      usp: 'Ein praxisnahes Intensivformat für bessere kreative Entscheidungen in realen Drucksituationen.',
      benefits: [
        'Ein persönliches Modell für Entscheidungen mit hoher Tragweite entwickeln.',
        'Kreativen Anspruch und wirtschaftliche Logik verbinden ohne Originalitätsverlust.',
        'Kritiken führen, die Qualität steigern und Reibung reduzieren.',
        'Trendrauschen in klare strategische Prioritäten übersetzen.',
        'Das Portfolio als Beleg für Führungswirkung positionieren.',
      ],
      cta: 'Programm ansehen',
    },
  },
};

const FASHION_VIDEOGRAPHER_PACK = {
  en: {
    roleName: 'Fashion Videographer',
    navProfile: 'Fashion Videographer',
    heroEyebrow: 'If you are a',
    heroSubtitle: 'This message is for you.',
    labels: {
      profileEyebrow: 'What the role demands in real production cycles',
      challengesTitle: 'Where pressure accumulates in the workflow',
      servicesTitle: 'Support for stronger visual storytelling output',
      masterclassTitle: 'Develop a sharper video storytelling practice',
    },
    profileSlides: [
      { title: 'Speed With Intent', text: 'You are expected to move quickly across formats while preserving narrative intent and visual discipline.' },
      { title: 'Platform Intelligence', text: 'Every cut, pacing shift, and framing choice must respond to channel behavior without losing authorship.' },
      { title: 'Production Leadership', text: 'You are directing people, timing, and creative coherence from pre-production through final delivery.' },
      { title: 'Distinctive Signal', text: 'Your edge is the ability to turn trend energy into work that still feels authored and durable.' },
    ],
    challenges: [
      'Short-form demand can erode narrative depth when process is weak.',
      'Platform shifts can force reactive output if strategic filters are missing.',
      'Crew, gear, and post constraints often compress creative options.',
      'Maintaining quality across campaign and social cuts is structurally hard.',
      'Approvals are frequently expected on compressed timelines.',
      'A recognizable visual signature must survive across different content speeds.',
    ],
    services: [
      { title: 'Video Narrative Design', body: 'We strengthen your story architecture so short and long formats feel connected and intentional.' },
      { title: 'Channel-Specific Editing Strategy', body: 'We optimize edit logic per platform while preserving tone and visual integrity.' },
      { title: 'Set-to-Post Workflow Coaching', body: 'We improve your production flow from planning through final export for better consistency.' },
      { title: 'Visual Signature Development', body: 'We help define a clearer stylistic language so your work remains recognizable at scale.' },
      { title: 'Portfolio Positioning for Premium Projects', body: 'We frame your reel around outcomes and strategic value, not just aesthetics.' },
    ],
    masterclass: {
      name: 'Masterclass for Fashion Videographers',
      usp: 'A craft-focused intensive for creators who need sharper storytelling under real deadlines.',
      benefits: [
        'Build repeatable frameworks for concept, shot logic, and edit rhythm.',
        'Adapt to platform formats without losing visual authorship.',
        'Improve collaboration with stylists, producers, and creative leads.',
        'Increase operational clarity from pre-production to delivery.',
        'Position your body of work with stronger strategic relevance.',
      ],
      cta: 'View Program Details',
    },
  },
  fr: {
    roleName: 'Vidéaste de mode',
    navProfile: 'Vidéaste de mode',
    heroEyebrow: 'Si vous êtes',
    heroSubtitle: 'Ce message est pour vous.',
    labels: {
      profileEyebrow: 'Ce que le rôle exige sur des cycles de production réels',
      challengesTitle: 'Là où la pression s’accumule dans le flux de travail',
      servicesTitle: 'Un accompagnement pour une narration visuelle plus forte',
      masterclassTitle: 'Développer une pratique vidéo plus incisive',
    },
    profileSlides: [
      { title: 'Vitesse avec intention', text: 'Vous devez avancer vite sur plusieurs formats sans sacrifier l’intention narrative ni la précision visuelle.' },
      { title: 'Intelligence plateforme', text: 'Chaque coupe et chaque rythme doivent s’adapter au canal sans diluer votre signature.' },
      { title: 'Leadership de production', text: 'Vous coordonnez équipes, timing et cohérence créative de la préparation à la livraison.' },
      { title: 'Signal distinctif', text: 'Votre force: transformer l’énergie des tendances en contenu durable et clairement auteur.' },
    ],
    challenges: [
      'La demande de formats courts peut fragiliser la profondeur narrative.',
      'Les évolutions de plateforme peuvent pousser à une production réactive.',
      'Les contraintes d’équipe, de matériel et de postproduction réduisent les options.',
      'Maintenir la qualité entre campagne et social est un enjeu structurel.',
      'Les validations créatives arrivent souvent sur des délais très serrés.',
      'Une signature visuelle claire doit survivre à des cadences multiples.',
    ],
    services: [
      { title: 'Conception de narration vidéo', body: 'Nous renforçons votre architecture narrative pour relier formats courts et longs avec cohérence.' },
      { title: 'Stratégie de montage par canal', body: 'Nous adaptons la logique de montage à chaque plateforme sans perte de ton.' },
      { title: 'Coaching du flux, du tournage à la postproduction', body: 'Nous optimisons le flux opérationnel de la préparation jusqu’à la livraison finale.' },
      { title: 'Développement de signature visuelle', body: 'Nous clarifions votre langage visuel pour une reconnaissance stable dans le temps.' },
      { title: 'Portfolio pour projets premium', body: 'Nous repositionnons votre reel autour des résultats, de la méthode et de l’impact.' },
    ],
    masterclass: {
      name: 'Masterclass Vidéaste de mode',
      usp: 'Un laboratoire pratique pour mieux raconter sous contrainte de délais réels.',
      benefits: [
        'Construire des modèles répétables pour concept, cadrage et rythme de montage.',
        'Adapter les formats de plateforme sans perdre votre signature.',
        'Mieux collaborer avec stylistes, production et direction créative.',
        'Gagner en clarté opérationnelle de la prépa à la livraison.',
        'Positionner votre travail avec une valeur stratégique plus lisible.',
      ],
      cta: 'Voir le programme',
    },
  },
  es: {
    roleName: 'Videógrafo de moda',
    navProfile: 'Videógrafo de moda',
    heroEyebrow: 'Si eres',
    heroSubtitle: 'Este mensaje es para ti.',
    labels: {
      profileEyebrow: 'Lo que el rol exige en ciclos de producción reales',
      challengesTitle: 'Dónde se concentra la presión del flujo',
      servicesTitle: 'Acompañamiento para una narrativa visual más sólida',
      masterclassTitle: 'Desarrolla una práctica audiovisual más precisa',
    },
    profileSlides: [
      { title: 'Velocidad con intención', text: 'Debes trabajar rápido entre formatos sin perder intención narrativa ni consistencia visual.' },
      { title: 'Lectura de plataforma', text: 'Cada corte y ritmo se adapta al canal sin borrar tu autoría.' },
      { title: 'Liderazgo de producción', text: 'Coordinas personas, tiempos y coherencia creativa desde preproducción hasta entrega.' },
      { title: 'Señal propia', text: 'Tu diferencial está en convertir tendencia en piezas con identidad y permanencia.' },
    ],
    challenges: [
      'La demanda de formato corto puede reducir profundidad narrativa.',
      'Los cambios de plataforma empujan decisiones reactivas.',
      'Las limitaciones de equipo, rodaje y postproducción comprimen opciones.',
      'Sostener calidad entre campaña y social exige un método robusto.',
      'Las aprobaciones suelen llegar con ventanas de tiempo mínimas.',
      'La firma visual debe mantenerse en velocidades de salida muy distintas.',
    ],
    services: [
      { title: 'Diseño de narrativa audiovisual', body: 'Estructuramos arcos narrativos para mantener coherencia entre formatos cortos y largos.' },
      { title: 'Estrategia de edición por canal', body: 'Ajustamos la lógica de montaje por plataforma sin perder tono ni consistencia.' },
      { title: 'Acompañamiento de flujo, del set a la postproducción', body: 'Optimizamos la cadena operativa desde planificación hasta entrega final.' },
      { title: 'Desarrollo de firma visual', body: 'Definimos un lenguaje visual reconocible y sostenible en distintos contextos.' },
      { title: 'Portafolio para proyectos premium', body: 'Replanteamos reel y casos con foco en valor estratégico y resultados.' },
    ],
    masterclass: {
      name: 'Masterclass para videógrafos de moda',
      usp: 'Un laboratorio práctico para narrar mejor bajo plazos reales.',
      benefits: [
        'Crear marcos repetibles para concepto, toma y ritmo de edición.',
        'Adaptarte a formatos de plataforma sin perder autoría visual.',
        'Mejorar colaboración con estilismo, producción y dirección creativa.',
        'Ganar claridad operativa desde prepro hasta entrega.',
        'Presentar tu trabajo con posicionamiento estratégico más fuerte.',
      ],
      cta: 'Ver programa',
    },
  },
  it: {
    roleName: 'Videografo di moda',
    navProfile: 'Videografo di moda',
    heroEyebrow: 'Se sei',
    heroSubtitle: 'Questo messaggio è per te.',
    labels: {
      profileEyebrow: 'Cosa richiede davvero il ruolo in cicli produttivi reali',
      challengesTitle: 'Dove la pressione si concentra nel flusso',
      servicesTitle: 'Supporto per una narrazione visiva più solida',
      masterclassTitle: 'Sviluppa una pratica video più precisa',
    },
    profileSlides: [
      { title: 'Velocità con intenzione', text: 'Lavori su più formati con tempi stretti mantenendo intenzione narrativa e qualità visiva.' },
      { title: 'Intelligenza di piattaforma', text: 'Tagli e ritmo cambiano per canale senza perdere la tua impronta autoriale.' },
      { title: 'Leadership di produzione', text: 'Coordini persone, tempi e coerenza creativa dalla preproduzione alla consegna.' },
      { title: 'Segnale distintivo', text: 'Il vantaggio nasce quando trasformi la tendenza in contenuti riconoscibili e durevoli.' },
    ],
    challenges: [
      'La domanda short-form può ridurre la profondità narrativa.',
      'I cambi di piattaforma possono spingere scelte troppo reattive.',
      'Vincoli di troupe, attrezzatura e postproduzione comprimono le opzioni.',
      'Mantenere qualità tra campagna e social richiede metodo.',
      'Le approvazioni creative arrivano spesso con tempi molto stretti.',
      'Una firma visiva chiara deve reggere velocità di pubblicazione diverse.',
    ],
    services: [
      { title: 'Progettazione della narrativa video', body: 'Costruiamo archi narrativi coerenti tra formati brevi e lunghi.' },
      { title: 'Strategia di montaggio per canale', body: 'Affiniamo la logica di montaggio per piattaforma senza perdere tono e continuità.' },
      { title: 'Affiancamento del flusso, dal set alla postproduzione', body: 'Ottimizziamo il flusso operativo dalla pianificazione alla consegna finale.' },
      { title: 'Sviluppo della firma visiva', body: 'Rendiamo il linguaggio visivo più riconoscibile e sostenibile nel tempo.' },
      { title: 'Portfolio per progetti premium', body: 'Riposizioniamo reel e case history attorno a risultato e impatto strategico.' },
    ],
    masterclass: {
      name: 'Masterclass per videografi di moda',
      usp: 'Un laboratorio pratico per raccontare meglio sotto scadenze reali.',
      benefits: [
        'Creare framework ripetibili per concept, ripresa e ritmo di montaggio.',
        'Adattarsi ai formati piattaforma senza perdere autorialità visiva.',
        'Collaborare meglio con styling, produzione e direzione creativa.',
        'Aumentare la chiarezza operativa da pre-produzione a delivery.',
        'Presentare il lavoro con un posizionamento strategico più forte.',
      ],
      cta: 'Scopri il programma',
    },
  },
  pt: {
    roleName: 'Videógrafo de moda',
    navProfile: 'Videógrafo de moda',
    heroEyebrow: 'Se você é',
    heroSubtitle: 'Esta mensagem é para você.',
    labels: {
      profileEyebrow: 'O que o papel exige em ciclos de produção reais',
      challengesTitle: 'Onde a pressão se concentra no fluxo',
      servicesTitle: 'Suporte para uma narrativa visual mais forte',
      masterclassTitle: 'Desenvolva uma prática audiovisual mais precisa',
    },
    profileSlides: [
      { title: 'Velocidade com intenção', text: 'Você precisa operar rápido entre formatos sem perder intenção narrativa nem qualidade visual.' },
      { title: 'Leitura de plataforma', text: 'Cada corte e ritmo se adapta ao canal sem apagar sua autoria.' },
      { title: 'Liderança de produção', text: 'Você coordena pessoas, prazos e coerência criativa da pré-produção à entrega.' },
      { title: 'Sinal autoral', text: 'Seu diferencial está em transformar tendência em conteúdo com identidade e permanência.' },
    ],
    challenges: [
      'A demanda por short-form pode reduzir profundidade narrativa.',
      'Mudanças de plataforma podem empurrar decisões reativas.',
      'Limites de equipe, equipamento e pós-produção comprimem opções criativas.',
      'Manter qualidade entre campanha e social exige método consistente.',
      'Aprovações criativas costumam chegar com janelas de tempo muito curtas.',
      'A assinatura visual precisa sobreviver a velocidades de entrega diferentes.',
    ],
    services: [
      { title: 'Design de narrativa em vídeo', body: 'Estruturamos arcos narrativos para conectar formatos curtos e longos com coerência.' },
      { title: 'Estratégia de edição por canal', body: 'Refinamos a lógica de montagem por plataforma sem perder tom e continuidade.' },
      { title: 'Acompanhamento de fluxo, do set à pós-produção', body: 'Otimizamos o fluxo operacional da preparação até a entrega final.' },
      { title: 'Desenvolvimento de assinatura visual', body: 'Clarificamos sua linguagem visual para manter reconhecimento e consistência.' },
      { title: 'Portfólio para projetos premium', body: 'Reposicionamos reel e cases com foco em resultado e impacto estratégico.' },
    ],
    masterclass: {
      name: 'Masterclass para videógrafos de moda',
      usp: 'Um laboratório prático para contar melhor sob prazos reais.',
      benefits: [
        'Criar modelos repetíveis para conceito, captação e ritmo de edição.',
        'Adaptar formatos de plataforma sem perder autoria visual.',
        'Melhorar colaboração com styling, produção e direção criativa.',
        'Ganhar clareza operacional da pré até a entrega.',
        'Apresentar seu trabalho com posicionamento estratégico mais forte.',
      ],
      cta: 'Ver programa',
    },
  },
  de: {
    roleName: 'Videograf für Mode',
    navProfile: 'Videograf für Mode',
    heroEyebrow: 'Wenn Sie',
    heroSubtitle: 'Diese Botschaft ist für Sie.',
    labels: {
      profileEyebrow: 'Was die Rolle in realen Produktionszyklen verlangt',
      challengesTitle: 'Wo sich der Druck im Workflow verdichtet',
      servicesTitle: 'Unterstützung für stärkere visuelle Erzählqualität',
      masterclassTitle: 'Entwickeln Sie eine präzisere Praxis des Video-Storytellings',
    },
    profileSlides: [
      { title: 'Tempo mit Absicht', text: 'Sie arbeiten schnell über Formate hinweg und sichern trotzdem visuelle Intention und technische Qualität.' },
      { title: 'Plattformkompetenz', text: 'Schnitt, Rhythmus und Kadrierung passen sich dem Kanal an, ohne Ihre Handschrift zu verlieren.' },
      { title: 'Produktionsführung', text: 'Sie führen Menschen, Timing und kreative Kohärenz von der Vorbereitung bis zur finalen Ausspielung.' },
      { title: 'Eigenes Signal', text: 'Ihre Stärke: Trends in präzise Inhalte übersetzen, die erkennbar und tragfähig bleiben.' },
    ],
    challenges: [
      'Short-Form-Druck kann narrative Tiefe schwächen.',
      'Plattformwechsel fördern reaktive Entscheidungen.',
      'Team-, Technik- und Postproduktionsgrenzen engen kreative Optionen ein.',
      'Qualität über Kampagne und Social hinweg zu halten ist strukturell anspruchsvoll.',
      'Kreative Freigaben werden häufig in sehr kurzen Fenstern erwartet.',
      'Eine klare visuelle Handschrift muss über unterschiedliche Geschwindigkeiten bestehen.',
    ],
    services: [
      { title: 'Video-Narrativdesign', body: 'Wir schärfen Erzählbögen, damit kurze und lange Formate zusammenhängend wirken.' },
      { title: 'Edit-Strategie pro Kanal', body: 'Wir optimieren die Schnittlogik je Plattform bei stabiler Tonalität und Kohärenz.' },
      { title: 'Workflow-Coaching von Set bis Postproduktion', body: 'Wir verbessern den Produktionsfluss von der Planung bis zur finalen Ausspielung.' },
      { title: 'Entwicklung visueller Signatur', body: 'Wir präzisieren Ihre Bildsprache für verlässliche Wiedererkennbarkeit.' },
      { title: 'Portfolio für Premium-Projekte', body: 'Wir positionieren Reel und Cases über Wirkung, Entscheidungskraft und Ergebnis.' },
    ],
    masterclass: {
      name: 'Masterclass für Modevideografen',
      usp: 'Ein praxisnahes Intensivformat für besseres Storytelling unter realen Deadlines.',
      benefits: [
        'Wiederholbare Modelle für Konzept, Shot-Logik und Edit-Rhythmus entwickeln.',
        'Plattformformate bedienen, ohne visuelle Autorschaft zu verlieren.',
        'Zusammenarbeit mit Styling, Produktion und Creative Leads verbessern.',
        'Mehr Klarheit von Pre-Pro bis Delivery gewinnen.',
        'Ihr Portfolio strategisch stärker positionieren.',
      ],
      cta: 'Programm ansehen',
    },
  },
};

const EDUCATION_DIRECTOR_PACK = {
  en: {
    roleName: 'Fashion Modelling School Director',
    navProfile: 'Fashion Modelling School Director',
    heroEyebrow: 'If you are a',
    heroSubtitle: 'This message is for you.',
    labels: {
      profileEyebrow: 'How the school-director role works in reality',
      challengesTitle: 'Where academic leadership is truly tested',
      servicesTitle: 'Support for curriculum quality and student outcomes',
      masterclassTitle: 'Strengthen your school leadership practice',
    },
    profileSlides: [
      { title: 'Educational Direction With Industry Relevance', text: 'You shape curriculum choices that must stay academically credible while matching real hiring expectations.' },
      { title: 'Faculty Alignment And Pedagogical Standards', text: 'You lead teachers toward shared evaluation criteria so students experience consistent guidance and fair progression.' },
      { title: 'Student Pathway Governance', text: 'You monitor learner progression, intervention points, and portfolio readiness to reduce dropout risk and improve placement quality.' },
      { title: 'Institutional Reputation Under Pressure', text: 'Your decisions influence employability outcomes, parent trust, partner confidence, and long-term school credibility.' },
    ],
    challenges: [
      'Industry expectations evolve faster than traditional curriculum update cycles.',
      'Faculty calibration can drift without clear teaching and assessment standards.',
      'Students need both confidence support and objective performance accountability.',
      'Operational limits can weaken mentoring quality if scheduling is not redesigned.',
      'School reputation is exposed when employability metrics are inconsistent.',
      'AI adoption in pedagogy needs governance to protect fairness and learning integrity.',
    ],
    services: [
      { title: 'Curriculum Governance Design', body: 'We help structure curriculum architecture so standards stay current, assessable, and aligned with real market demand.' },
      { title: 'Faculty Calibration System', body: 'We establish shared rubrics and teaching rituals to improve consistency across instructors and cohorts.' },
      { title: 'Student Progression Intelligence', body: 'We implement practical checkpoints that flag risk early and guide targeted interventions.' },
      { title: 'Industry Partnership Activation', body: 'We strengthen school-to-industry bridges for internships, briefs, and hiring pathways that create measurable outcomes.' },
      { title: 'School Positioning And Credibility Strategy', body: 'We align leadership messaging, quality proof, and outcome reporting to reinforce institutional trust.' },
    ],
    masterclass: {
      name: 'Masterclass for Fashion School Directors',
      usp: 'A leadership-intensive format focused on curriculum quality, faculty alignment, and graduate readiness.',
      benefits: [
        'Build a repeatable model for curriculum updates tied to industry reality.',
        'Standardize faculty evaluation and feedback without flattening teaching style.',
        'Improve student progression monitoring with clear intervention protocols.',
        'Strengthen employability outcomes through structured partner engagement.',
        'Adopt AI in pedagogy with governance that protects fairness and quality.',
      ],
      cta: 'View Program Details',
    },
  },
  fr: {
    roleName: 'Directeur d\'école de mannequinat',
    navProfile: 'Directeur d\'école de mannequinat',
    heroEyebrow: 'Si vous êtes',
    heroSubtitle: 'Ce message est pour vous.',
    labels: {
      profileEyebrow: 'Comment le rôle de direction d’école fonctionne réellement',
      challengesTitle: 'Là où le leadership pédagogique est vraiment mis à l’épreuve',
      servicesTitle: 'Un accompagnement pour la qualité des parcours et l’employabilité',
      masterclassTitle: 'Renforcer votre pratique de direction pédagogique',
    },
    profileSlides: [
      { title: 'Direction pédagogique et exigence marché', text: 'Vous pilotez des choix de programme qui doivent rester académiquement solides et utiles à l’insertion professionnelle.' },
      { title: 'Alignement des formateurs', text: 'Vous harmonisez les critères d’évaluation pour garantir un suivi cohérent entre classes et intervenants.' },
      { title: 'Progression étudiante', text: 'Vous supervisez les jalons de progression, les points d’alerte et la préparation portfolio pour sécuriser les trajectoires.' },
      { title: 'Réputation institutionnelle', text: 'Vos arbitrages influencent l’employabilité des diplômés, la confiance des familles et la crédibilité de l’école.' },
    ],
    challenges: [
      'Les attentes de l’industrie évoluent plus vite que les cycles classiques de révision de programme.',
      'Sans calibration claire, les pratiques d’évaluation peuvent diverger entre formateurs.',
      'Les étudiants ont besoin d’un cadre exigeant sans perdre le soutien nécessaire à la confiance.',
      'Les contraintes opérationnelles peuvent affaiblir la qualité du mentorat.',
      'La réputation de l’école est exposée quand les indicateurs d’insertion sont irréguliers.',
      'L’intégration de l’IA pédagogique exige une gouvernance explicite.',
    ],
    services: [
      { title: 'Architecture de gouvernance curriculaire', body: 'Nous structurons vos programmes pour maintenir des standards à jour, lisibles et alignés avec les besoins du marché.' },
      { title: 'Système de calibration des formateurs', body: 'Nous mettons en place rubriques communes et rituels pédagogiques pour renforcer la cohérence d’enseignement.' },
      { title: 'Pilotage de progression étudiante', body: 'Nous installons des checkpoints concrets pour détecter les risques tôt et orienter les actions de soutien.' },
      { title: 'Activation des partenariats industrie', body: 'Nous renforçons les passerelles école-industrie pour créer des débouchés mesurables.' },
      { title: 'Stratégie de crédibilité institutionnelle', body: 'Nous alignons discours de direction, preuves de qualité et reporting résultats pour consolider la confiance.' },
    ],
    masterclass: {
      name: 'Masterclass Directeur d\'école de mannequinat',
      usp: 'Un format intensif centré sur la qualité pédagogique, l’alignement des équipes et la préparation à l’emploi.',
      benefits: [
        'Mettre en place un modèle de mise à jour curriculaire relié au terrain.',
        'Harmoniser l’évaluation pédagogique sans uniformiser les styles d’enseignement.',
        'Renforcer le suivi de progression avec des protocoles d’intervention clairs.',
        'Améliorer les résultats d’employabilité via des partenariats structurés.',
        'Intégrer l’IA pédagogique avec des garde-fous de qualité et d’équité.',
      ],
      cta: 'Voir le programme',
    },
  },
  es: {
    roleName: 'Director de escuela de modelaje de moda',
    navProfile: 'Director de escuela de modelaje de moda',
    heroEyebrow: 'Si eres',
    heroSubtitle: 'Este mensaje es para ti.',
    labels: {
      profileEyebrow: 'Cómo funciona realmente la dirección de escuela',
      challengesTitle: 'Dónde se pone a prueba el liderazgo académico',
      servicesTitle: 'Apoyo para calidad curricular y empleabilidad estudiantil',
      masterclassTitle: 'Fortalece tu práctica de dirección académica',
    },
    profileSlides: [
      { title: 'Dirección pedagógica con relevancia de mercado', text: 'Defiendes decisiones curriculares que deben ser rigurosas en lo académico y útiles para la inserción laboral real.' },
      { title: 'Alineación docente', text: 'Coordinas criterios de evaluación compartidos para dar coherencia entre profesores, grupos y niveles.' },
      { title: 'Gobernanza de trayectoria estudiantil', text: 'Supervisas progresión, alertas tempranas y preparación de portafolio para sostener resultados formativos.' },
      { title: 'Reputación institucional bajo presión', text: 'Tus decisiones impactan empleabilidad, confianza de familias y credibilidad de la escuela a largo plazo.' },
    ],
    challenges: [
      'La expectativa de la industria cambia más rápido que los ciclos tradicionales del plan de estudios.',
      'Sin calibración, los criterios de evaluación pueden desviarse entre docentes.',
      'El alumnado necesita exigencia objetiva y soporte de confianza al mismo tiempo.',
      'Las limitaciones operativas pueden erosionar la calidad de la mentoría.',
      'La reputación se resiente cuando los resultados de empleabilidad son irregulares.',
      'La adopción de IA educativa exige gobernanza para proteger calidad y equidad.',
    ],
    services: [
      { title: 'Diseño de gobernanza curricular', body: 'Estructuramos arquitectura curricular para mantener estándares actualizados, medibles y conectados al mercado.' },
      { title: 'Sistema de calibración docente', body: 'Definimos rúbricas y rituales pedagógicos compartidos para elevar consistencia formativa.' },
      { title: 'Inteligencia de progresión estudiantil', body: 'Implementamos checkpoints para detectar riesgo temprano y activar intervenciones concretas.' },
      { title: 'Activación de alianzas con la industria', body: 'Fortalecemos puentes escuela-industria para prácticas, briefs y colocación profesional medible.' },
      { title: 'Estrategia de credibilidad institucional', body: 'Alineamos relato directivo, pruebas de calidad y reporting de resultados para reforzar confianza.' },
    ],
    masterclass: {
      name: 'Masterclass para directores de escuelas de moda',
      usp: 'Un formato intensivo enfocado en calidad curricular, alineación docente y preparación laboral.',
      benefits: [
        'Construir un modelo repetible de actualización curricular conectado al sector.',
        'Estandarizar evaluación docente sin aplanar estilos pedagógicos.',
        'Mejorar monitoreo de progreso con protocolos claros de intervención.',
        'Elevar empleabilidad mediante alianzas estructuradas con la industria.',
        'Adoptar IA educativa con gobernanza que proteja equidad y nivel académico.',
      ],
      cta: 'Ver programa',
    },
  },
  it: {
    roleName: 'Direttore di scuola di design della moda',
    navProfile: 'Direttore di scuola di design della moda',
    heroEyebrow: 'Se sei',
    heroSubtitle: 'Questo messaggio è per te.',
    labels: {
      profileEyebrow: 'Come funziona davvero la direzione scolastica',
      challengesTitle: 'Dove la leadership didattica viene messa alla prova',
      servicesTitle: 'Supporto per qualità curricolare e occupabilità degli studenti',
      masterclassTitle: 'Rafforza la tua pratica di direzione accademica',
    },
    profileSlides: [
      { title: 'Direzione didattica con rilevanza di mercato', text: 'Guida scelte curricolari che devono restare rigorose sul piano formativo e utili all’inserimento professionale.' },
      { title: 'Allineamento del corpo docente', text: 'Coordini criteri di valutazione condivisi per garantire coerenza tra classi, docenti e percorsi.' },
      { title: 'Governance della progressione studente', text: 'Supervisioni avanzamento, segnali di rischio e portfolio readiness per migliorare esiti e continuità.' },
      { title: 'Reputazione istituzionale sotto pressione', text: 'Le tue decisioni influenzano occupabilità, fiducia delle famiglie e credibilità dell’istituto nel lungo periodo.' },
    ],
    challenges: [
      'Le aspettative dell’industria evolvono più rapidamente dei cicli curricolari tradizionali.',
      'Senza calibrazione, i criteri valutativi possono divergere tra docenti.',
      'Gli studenti hanno bisogno di rigore oggettivo e supporto alla fiducia insieme.',
      'Vincoli operativi possono ridurre la qualità del mentoring.',
      'La reputazione scolastica si indebolisce con risultati occupazionali discontinui.',
      'L’integrazione dell’AI didattica richiede governance esplicita su qualità ed equità.',
    ],
    services: [
      { title: 'Progettazione governance curricolare', body: 'Strutturiamo l’architettura del percorso per mantenere standard aggiornati, misurabili e coerenti con il mercato.' },
      { title: 'Sistema di calibrazione docenti', body: 'Definiamo rubriche comuni e rituali didattici per aumentare coerenza e qualità formativa.' },
      { title: 'Intelligence sulla progressione studenti', body: 'Implementiamo checkpoint pratici per rilevare rischi in anticipo e attivare interventi mirati.' },
      { title: 'Attivazione partnership con l’industria', body: 'Rafforziamo i ponti scuola-industria per stage, brief e percorsi di inserimento misurabili.' },
      { title: 'Strategia di credibilità istituzionale', body: 'Allineiamo narrativa direzionale, evidenze di qualità e reporting risultati per consolidare fiducia.' },
    ],
    masterclass: {
      name: 'Masterclass per direttori di scuole moda',
      usp: 'Un formato intensivo orientato a qualità didattica, allineamento docenti e preparazione professionale degli studenti.',
      benefits: [
        'Costruire un modello ripetibile di aggiornamento curricolare connesso al settore.',
        'Standardizzare la valutazione senza appiattire gli stili di insegnamento.',
        'Migliorare il monitoraggio progressivo con protocolli di intervento chiari.',
        'Rafforzare l’occupabilità con partnership strutturate con la filiera moda.',
        'Adottare AI didattica con governance che protegga qualità ed equità.',
      ],
      cta: 'Scopri il programma',
    },
  },
  pt: {
    roleName: 'Diretor de escola de modelagem de moda',
    navProfile: 'Diretor de escola de modelagem de moda',
    heroEyebrow: 'Se você é',
    heroSubtitle: 'Esta mensagem é para você.',
    labels: {
      profileEyebrow: 'Como a direção escolar funciona na prática real',
      challengesTitle: 'Onde a liderança pedagógica é realmente testada',
      servicesTitle: 'Apoio para qualidade curricular e empregabilidade dos estudantes',
      masterclassTitle: 'Fortaleça sua prática de direção acadêmica',
    },
    profileSlides: [
      { title: 'Direção pedagógica com relevância de mercado', text: 'Você orienta escolhas curriculares que precisam ser academicamente sólidas e alinhadas às exigências reais de contratação.' },
      { title: 'Alinhamento do corpo docente', text: 'Você coordena critérios de avaliação partilhados para garantir consistência entre turmas e professores.' },
      { title: 'Governança da progressão estudantil', text: 'Você acompanha evolução, pontos de risco e prontidão de portfólio para melhorar resultados formativos.' },
      { title: 'Reputação institucional sob pressão', text: 'Suas decisões impactam empregabilidade, confiança das famílias e credibilidade da escola no longo prazo.' },
    ],
    challenges: [
      'As expectativas da indústria evoluem mais rápido do que os ciclos curriculares tradicionais.',
      'Sem calibração, critérios de avaliação podem divergir entre docentes.',
      'Os estudantes precisam de exigência objetiva e suporte de confiança ao mesmo tempo.',
      'Restrições operacionais podem reduzir a qualidade da mentoria.',
      'A reputação da escola sofre quando resultados de empregabilidade são inconsistentes.',
      'A adoção de IA no ensino exige governança para proteger qualidade e equidade.',
    ],
    services: [
      { title: 'Desenho de governança curricular', body: 'Estruturamos a arquitetura curricular para manter padrões atualizados, mensuráveis e conectados ao mercado.' },
      { title: 'Sistema de calibração docente', body: 'Definimos rubricas partilhadas e rituais pedagógicos para elevar consistência e qualidade de ensino.' },
      { title: 'Inteligência de progressão estudantil', body: 'Implementamos checkpoints para detectar risco cedo e ativar intervenções concretas.' },
      { title: 'Ativação de parcerias com a indústria', body: 'Fortalecemos pontes escola-indústria para estágios, briefs e caminhos de colocação mensuráveis.' },
      { title: 'Estratégia de credibilidade institucional', body: 'Alinhamos narrativa de liderança, prova de qualidade e reporte de resultados para reforçar confiança.' },
    ],
    masterclass: {
      name: 'Masterclass para diretores de escolas de moda',
      usp: 'Um formato intensivo focado em qualidade curricular, alinhamento docente e preparação profissional dos estudantes.',
      benefits: [
        'Construir um modelo repetível de atualização curricular conectado ao setor.',
        'Padronizar avaliação docente sem anular estilos pedagógicos.',
        'Melhorar monitorização de progresso com protocolos claros de intervenção.',
        'Elevar empregabilidade com parcerias estruturadas com a indústria.',
        'Adotar IA pedagógica com governança que proteja qualidade e equidade.',
      ],
      cta: 'Ver programa',
    },
  },
  de: {
    roleName: 'Leiter einer Fashion-Modelschule',
    navProfile: 'Leiter einer Fashion-Modelschule',
    heroEyebrow: 'Wenn Sie',
    heroSubtitle: 'Diese Botschaft ist für Sie.',
    labels: {
      profileEyebrow: 'Wie die Schulleitungsrolle in der Praxis funktioniert',
      challengesTitle: 'Wo pädagogische Führung wirklich auf die Probe gestellt wird',
      servicesTitle: 'Unterstützung für Curriculum-Qualität und Beschäftigungsfähigkeit',
      masterclassTitle: 'Schärfen Sie Ihre akademische Führungspraxis',
    },
    profileSlides: [
      { title: 'Pädagogische Führung mit Marktrelevanz', text: 'Sie steuern Curriculum-Entscheidungen, die akademisch belastbar und zugleich arbeitsmarktnah sein müssen.' },
      { title: 'Dozierenden-Ausrichtung', text: 'Sie etablieren gemeinsame Bewertungsmaßstäbe, damit Lernwege über Klassen hinweg konsistent bleiben.' },
      { title: 'Steuerung der Lernprogression', text: 'Sie überwachen Entwicklung, Risikosignale und Portfolio-Reife, um Ausbildungsresultate zu stabilisieren.' },
      { title: 'Institutionelle Reputation unter Druck', text: 'Ihre Entscheidungen beeinflussen Beschäftigungsfähigkeit, Elternvertrauen und die langfristige Glaubwürdigkeit der Schule.' },
    ],
    challenges: [
      'Branchenanforderungen ändern sich schneller als klassische Curriculum-Zyklen.',
      'Ohne Kalibrierung driften Bewertungsmaßstäbe zwischen Lehrkräften auseinander.',
      'Studierende brauchen gleichzeitig klare Leistungserwartung und verlässliche Unterstützung.',
      'Operative Grenzen können die Qualität des Mentorings schwächen.',
      'Schulreputation leidet, wenn Employability-Ergebnisse nicht stabil sind.',
      'Der Einsatz von KI in der Lehre braucht Governance für Fairness und Qualitätskontrolle.',
    ],
    services: [
      { title: 'Curriculum-Governance-Design', body: 'Wir strukturieren die Curriculum-Architektur für aktuelle, messbare und marktrelevante Standards.' },
      { title: 'Dozierenden-Kalibrierungssystem', body: 'Wir etablieren gemeinsame Rubriken und Lehrrituale für konsistente Ausbildungsqualität.' },
      { title: 'Lernprogressions-Intelligence', body: 'Wir implementieren klare Checkpoints, um Risiken früh zu erkennen und gezielt zu intervenieren.' },
      { title: 'Industriepartnerschaften aktivieren', body: 'Wir stärken Schule-Industrie-Brücken für Praktika, Briefings und messbare Übergänge in den Beruf.' },
      { title: 'Strategie für institutionelle Glaubwürdigkeit', body: 'Wir verbinden Führungsnarrativ, Qualitätsnachweise und Ergebnisreporting zu belastbarem Vertrauen.' },
    ],
    masterclass: {
      name: 'Masterclass für Leitung von Modeschulen',
      usp: 'Ein intensives Format für Curriculum-Qualität, Dozierenden-Ausrichtung und berufsnahe Ausbildungsresultate.',
      benefits: [
        'Ein wiederholbares Modell für Curriculum-Updates mit Branchenbezug aufbauen.',
        'Bewertungssysteme standardisieren, ohne Lehrstile zu nivellieren.',
        'Lernfortschritt mit klaren Interventionsprotokollen besser steuern.',
        'Employability über strukturierte Industriepartnerschaften stärken.',
        'KI in der Lehre mit Governance für Fairness und Qualität einführen.',
      ],
      cta: 'Programm ansehen',
    },
  },
};

const TALENT_SCOUT_PACK = {
  en: {
    roleName: 'Talent Scout',
    navProfile: 'Talent Scout',
    heroEyebrow: 'If you are a',
    heroSubtitle: 'This message is for you.',
    labels: {
      profileEyebrow: 'What the role requires in the field',
      challengesTitle: 'Where the role is genuinely tested',
      servicesTitle: 'Support for stronger talent judgment',
      masterclassTitle: 'Build a stronger, ethical scouting practice',
    },
    profileSlides: [
      { title: 'Potential Before Visibility', text: 'You identify long-term potential before it becomes obvious in metrics or market attention.' },
      { title: 'Trust as Infrastructure', text: 'Your effectiveness depends on transparent process, ethical conduct, and consistent communication.' },
      { title: 'Network Intelligence', text: 'You create value through trusted relationships across agencies, casting, creators, and emerging scenes.' },
      { title: 'Fast Calls, Lasting Impact', text: 'You make rapid judgments that can shape careers, brand quality, and team credibility.' },
    ],
    challenges: [
      'High competition narrows early discovery windows.',
      'Digital traction can be misleading without context.',
      'Talent expectations and career realities often diverge early.',
      'Trust is fragile when communication lacks structure.',
      'Ethical standards require constant attention in fast-moving environments.',
      'Long-term potential is difficult to assess from short-term visibility.',
    ],
    services: [
      { title: 'Scouting Evaluation Frameworks', body: 'We help you evaluate potential through clearer criteria that combine intuition, context, and trajectory.' },
      { title: 'Ethical Scouting Protocols', body: 'We establish practical standards that protect talent dignity and strengthen professional trust.' },
      { title: 'Pipeline Quality Mapping', body: 'We redesign pipeline stages to improve fit quality, follow-through, and decision clarity.' },
      { title: 'Communication and Trust Practice', body: 'We sharpen how you communicate with talent and partners to reduce ambiguity.' },
      { title: 'Senior Scouting Positioning', body: 'We frame your track record as measurable impact across discovery, development, and placement.' },
    ],
    masterclass: {
      name: 'Masterclass for Talent Scouts',
      usp: 'A field-informed program for sharper judgment, stronger ethics, and durable influence.',
      benefits: [
        'Develop robust methods for evaluating potential beyond surface metrics.',
        'Improve ethical decision-making in fast recruitment contexts.',
        'Strengthen communication with agencies, talent, and brand partners.',
        'Build healthier pipelines with better conversion quality.',
        'Position your experience as strategic scouting leadership.',
      ],
      cta: 'View Program Details',
    },
  },
  fr: {
    roleName: 'Chargé de détection de talents mode',
    navProfile: 'Chargé de détection de talents mode',
    heroEyebrow: 'Si vous êtes',
    heroSubtitle: 'Ce message est pour vous.',
    labels: {
      profileEyebrow: 'Ce que le rôle demande réellement sur le terrain',
      challengesTitle: 'Là où le rôle est réellement mis à l’épreuve',
      servicesTitle: 'Un accompagnement pour affiner le jugement talent',
      masterclassTitle: 'Renforcer une pratique de scouting exigeante et éthique',
    },
    profileSlides: [
      { title: 'Potentiel avant visibilité', text: 'Vous repérez des trajectoires durables avant qu’elles n’apparaissent dans les métriques.' },
      { title: 'La confiance comme base', text: 'L’efficacité du rôle repose sur des process transparents, une éthique claire et une communication constante.' },
      { title: 'Intelligence réseau', text: 'Votre impact grandit grâce aux relations de confiance avec agences, casting et communautés émergentes.' },
      { title: 'Décisions rapides, effets durables', text: 'Vos arbitrages influencent des carrières, des standards de marque et la crédibilité des équipes.' },
    ],
    challenges: [
      'La concurrence élevée réduit les fenêtres de découverte précoce.',
      'La traction digitale peut être trompeuse sans lecture contextuelle.',
      'Les attentes des talents et la réalité du métier divergent souvent au départ.',
      'La confiance s’érode vite quand la communication reste floue.',
      'Les standards éthiques exigent une vigilance continue.',
      'Le potentiel long terme est difficile à lire sur la seule visibilité court terme.',
    ],
    services: [
      { title: 'Cadres d’évaluation scouting', body: 'Nous renforçons vos critères pour croiser intuition, contexte et trajectoire réelle.' },
      { title: 'Protocoles de scouting éthique', body: 'Nous installons des standards concrets qui protègent la dignité des talents.' },
      { title: 'Cartographie qualité du pipeline', body: 'Nous structurons les étapes de pipeline pour améliorer fit, suivi et lisibilité des décisions.' },
      { title: 'Pratique communication et confiance', body: 'Nous clarifions vos échanges avec talents et partenaires pour réduire l’ambiguïté.' },
      { title: 'Positionnement senior scouting', body: 'Nous valorisons votre parcours comme impact mesurable sur découverte et développement.' },
    ],
    masterclass: {
      name: 'Masterclass Chargé de détection de talents mode',
      usp: 'Un programme ancré terrain pour affûter jugement, éthique et influence durable.',
      benefits: [
        'Construire une méthode robuste d’évaluation au-delà de la visibilité.',
        'Élever la qualité des décisions éthiques en contexte rapide.',
        'Renforcer la communication avec agences, talents et marques.',
        'Concevoir des pipelines plus sains avec meilleure conversion.',
        'Positionner votre expérience comme leadership stratégique scouting.',
      ],
      cta: 'Voir le programme',
    },
  },
  es: {
    roleName: 'Cazatalentos de moda',
    navProfile: 'Cazatalentos de moda',
    heroEyebrow: 'Si eres',
    heroSubtitle: 'Este mensaje es para ti.',
    labels: {
      profileEyebrow: 'Lo que el rol exige realmente en campo',
      challengesTitle: 'Dónde el rol se pone realmente a prueba',
      servicesTitle: 'Acompañamiento para afinar criterio de talento',
      masterclassTitle: 'Fortalece una práctica de scouting ética y sólida',
    },
    profileSlides: [
      { title: 'Potencial antes de visibilidad', text: 'Detectas trayectorias de largo plazo antes de que aparezcan con claridad en métricas.' },
      { title: 'Confianza como estructura', text: 'El rol funciona cuando hay procesos transparentes, ética firme y comunicación constante.' },
      { title: 'Inteligencia de red', text: 'Tu impacto crece a través de relaciones confiables con agencias, casting y comunidades emergentes.' },
      { title: 'Decisiones rápidas, efecto duradero', text: 'Tus decisiones pueden definir carreras, estándares de marca y credibilidad de equipo.' },
    ],
    challenges: [
      'La competencia alta reduce ventanas de descubrimiento temprano.',
      'La tracción digital puede engañar cuando falta contexto.',
      'Las expectativas del talento y la realidad profesional divergen al inicio.',
      'La confianza se erosiona rápido con comunicación ambigua.',
      'Los estándares éticos exigen vigilancia continua.',
      'El potencial de largo plazo no siempre se refleja en visibilidad inmediata.',
    ],
    services: [
      { title: 'Marcos de evaluación scouting', body: 'Fortalecemos tus criterios para combinar intuición, contexto y trayectoria real.' },
      { title: 'Protocolos de scouting ético', body: 'Definimos estándares prácticos que protegen la dignidad del talento.' },
      { title: 'Mapeo de calidad del pipeline', body: 'Reordenamos etapas para mejorar fit, seguimiento y claridad de decisión.' },
      { title: 'Práctica de comunicación y confianza', body: 'Afinamos conversaciones con talento y socios para reducir ambigüedad.' },
      { title: 'Posicionamiento para scouting senior', body: 'Reencuadramos tu trayectoria como impacto medible en descubrimiento y desarrollo.' },
    ],
    masterclass: {
      name: 'Masterclass para cazatalentos de moda',
      usp: 'Un programa de campo para elevar criterio, ética e influencia sostenida.',
      benefits: [
        'Desarrollar métodos robustos para evaluar potencial más allá de la visibilidad.',
        'Mejorar decisiones éticas en contextos de reclutamiento acelerado.',
        'Fortalecer la comunicación con agencias, talento y marcas.',
        'Construir pipelines más sanos y con mejor conversión.',
        'Posicionar tu experiencia como liderazgo estratégico de scouting.',
      ],
      cta: 'Ver programa',
    },
  },
  it: {
    roleName: 'Talent scout della moda',
    navProfile: 'Talent scout della moda',
    heroEyebrow: 'Se sei',
    heroSubtitle: 'Questo messaggio è per te.',
    labels: {
      profileEyebrow: 'Cosa richiede davvero il ruolo sul campo',
      challengesTitle: 'Dove il ruolo viene realmente messo alla prova',
      servicesTitle: 'Supporto per affinare il giudizio sul talento',
      masterclassTitle: 'Rafforza una pratica di scouting etica e solida',
    },
    profileSlides: [
      { title: 'Potenziale prima della visibilità', text: 'Riconosci traiettorie di lungo periodo prima che emergano chiaramente nelle metriche.' },
      { title: 'Fiducia come struttura', text: 'Il ruolo regge su processi trasparenti, etica operativa e comunicazione costante.' },
      { title: 'Intelligenza di rete', text: 'Il tuo impatto cresce nella qualità delle relazioni con agenzie, casting e community emergenti.' },
      { title: 'Decisioni rapide, impatto duraturo', text: 'Le tue scelte possono orientare carriere, standard di brand e credibilità di team.' },
    ],
    challenges: [
      'La competizione alta riduce le finestre di scoperta precoce.',
      'La trazione digitale può essere fuorviante senza contesto.',
      'Aspettative dei talenti e realtà professionale divergono nelle fasi iniziali.',
      'La fiducia si indebolisce rapidamente con comunicazione poco chiara.',
      'Gli standard etici richiedono vigilanza continua.',
      'Il potenziale di lungo periodo non coincide sempre con la visibilità immediata.',
    ],
    services: [
      { title: 'Framework di valutazione scouting', body: 'Rafforziamo i criteri per unire intuizione, contesto e traiettoria concreta.' },
      { title: 'Protocolli di scouting etico', body: 'Definiamo standard pratici che proteggono dignità e fiducia professionale.' },
      { title: 'Mappatura qualità pipeline', body: 'Ridisegniamo le fasi del pipeline per migliorare fit e trasparenza decisionale.' },
      { title: 'Pratica di comunicazione e fiducia', body: 'Affiniamo il dialogo con talenti e partner per ridurre ambiguità.' },
      { title: 'Posizionamento scouting senior', body: 'Valorizziamo il tuo percorso come impatto misurabile su discovery e sviluppo.' },
    ],
    masterclass: {
      name: 'Masterclass per talent scout della moda',
      usp: 'Un programma sul campo per migliorare giudizio, etica e influenza nel tempo.',
      benefits: [
        'Sviluppare metodi robusti per valutare potenziale oltre la visibilità.',
        'Migliorare decisioni etiche in contesti di selezione rapidi.',
        'Rafforzare la comunicazione con agenzie, talenti e brand.',
        'Costruire pipeline più sane con conversione migliore.',
        'Posizionare l’esperienza come leadership strategica di scouting.',
      ],
      cta: 'Scopri il programma',
    },
  },
  pt: {
    roleName: 'Olheiro de talentos da moda',
    navProfile: 'Olheiro de talentos da moda',
    heroEyebrow: 'Se você é',
    heroSubtitle: 'Esta mensagem é para você.',
    labels: {
      profileEyebrow: 'O que o papel realmente exige no campo',
      challengesTitle: 'Onde o papel é realmente testado',
      servicesTitle: 'Suporte para refinar o julgamento de talento',
      masterclassTitle: 'Fortaleça uma prática de scouting ética e consistente',
    },
    profileSlides: [
      { title: 'Potencial antes da visibilidade', text: 'Você identifica trajetórias de longo prazo antes de elas aparecerem claramente nas métricas.' },
      { title: 'Confiança como estrutura', text: 'O papel depende de processos transparentes, ética aplicada e comunicação constante.' },
      { title: 'Inteligência de rede', text: 'Seu impacto cresce na qualidade das relações com agências, casting e comunidades emergentes.' },
      { title: 'Decisões rápidas, efeito duradouro', text: 'Suas escolhas podem influenciar carreiras, padrões de marca e credibilidade de equipe.' },
    ],
    challenges: [
      'A alta competição reduz janelas de descoberta precoce.',
      'Tração digital pode ser enganosa sem contexto.',
      'Expectativas do talento e realidade profissional divergem no início.',
      'A confiança se desgasta rápido com comunicação ambígua.',
      'Padrões éticos exigem vigilância contínua.',
      'Potencial de longo prazo não aparece sempre na visibilidade imediata.',
    ],
    services: [
      { title: 'Frameworks de avaliação scouting', body: 'Fortalecemos critérios para unir intuição, contexto e trajetória concreta.' },
      { title: 'Protocolos de scouting ético', body: 'Definimos padrões práticos que protegem dignidade e confiança profissional.' },
      { title: 'Mapeamento de qualidade do pipeline', body: 'Reestruturamos etapas para melhorar fit, acompanhamento e clareza decisória.' },
      { title: 'Prática de comunicação e confiança', body: 'Aprimoramos diálogos com talentos e parceiros para reduzir ambiguidade.' },
      { title: 'Posicionamento para scouting sênior', body: 'Reposicionamos sua trajetória como impacto mensurável em descoberta e desenvolvimento.' },
    ],
    masterclass: {
      name: 'Masterclass para olheiros de talentos da moda',
      usp: 'Um programa de campo para elevar julgamento, ética e influência sustentável.',
      benefits: [
        'Desenvolver métodos robustos para avaliar potencial além da visibilidade.',
        'Melhorar decisões éticas em contextos acelerados de recrutamento.',
        'Fortalecer a comunicação com agências, talentos e marcas.',
        'Construir pipelines mais saudáveis com melhor conversão.',
        'Posicionar a experiência como liderança estratégica de scouting.',
      ],
      cta: 'Ver programa',
    },
  },
  de: {
    roleName: 'Talentscout für Mode',
    navProfile: 'Talentscout für Mode',
    heroEyebrow: 'Wenn Sie',
    heroSubtitle: 'Diese Botschaft ist für Sie.',
    labels: {
      profileEyebrow: 'Was die Rolle im Feld wirklich verlangt',
      challengesTitle: 'Wo die Rolle wirklich auf die Probe gestellt wird',
      servicesTitle: 'Unterstützung für präziseres Talenturteil',
      masterclassTitle: 'Stärken Sie eine ethische, belastbare Scouting-Praxis',
    },
    profileSlides: [
      { title: 'Potenzial vor Sichtbarkeit', text: 'Sie erkennen langfristiges Potenzial, bevor es sich in Kennzahlen oder Marktaufmerksamkeit zeigt.' },
      { title: 'Vertrauen als Infrastruktur', text: 'Die Rolle funktioniert über transparente Prozesse, klare Ethik und verlässliche Kommunikation.' },
      { title: 'Netzwerkintelligenz', text: 'Ihr Einfluss wächst über belastbare Beziehungen zu Agenturen, Casting und aufstrebenden Szenen.' },
      { title: 'Schnelle Entscheidungen, nachhaltige Wirkung', text: 'Ihre Entscheidungen prägen Karrieren, Markenqualität und Teamglaubwürdigkeit.' },
    ],
    challenges: [
      'Hoher Wettbewerb verengt frühe Entdeckungsfenster.',
      'Digitale Traktion kann ohne Kontext irreführend sein.',
      'Talent-Erwartung und Berufsrealität driften früh auseinander.',
      'Vertrauen schwindet schnell bei unklarer Kommunikation.',
      'Ethische Standards brauchen kontinuierliche Aufmerksamkeit.',
      'Langfristiges Potenzial ist aus kurzfristiger Sichtbarkeit schwer abzuleiten.',
    ],
    services: [
      { title: 'Scouting-Bewertungsframeworks', body: 'Wir schärfen Kriterien, die Intuition, Kontext und Entwicklungspfad zusammenführen.' },
      { title: 'Ethische Scouting-Protokolle', body: 'Wir etablieren umsetzbare Standards zum Schutz von Würde und professionellem Vertrauen.' },
      { title: 'Pipeline-Qualitätsmapping', body: 'Wir strukturieren Pipeline-Stufen für bessere Fit-Qualität und klarere Entscheidungen.' },
      { title: 'Kommunikations- und Vertrauenspraxis', body: 'Wir verbessern Dialoge mit Talenten und Partnern, um Ambiguität zu reduzieren.' },
      { title: 'Positionierung für Senior-Scouting', body: 'Wir rahmen Ihre Laufbahn als messbaren Beitrag zu Discovery und Entwicklung.' },
    ],
    masterclass: {
      name: 'Masterclass für Talentscouts in der Mode',
      usp: 'Ein feldnahes Programm für schärferes Urteil, stärkere Ethik und nachhaltige Wirkung.',
      benefits: [
        'Robuste Methoden zur Potenzialbewertung jenseits reiner Sichtbarkeit entwickeln.',
        'Ethische Entscheidungen in schnellen Kontexten der Talentsuche verbessern.',
        'Kommunikation mit Agenturen, Talenten und Markenpartnern stärken.',
        'Gesündere Pipelines mit besserer Konversionsqualität aufbauen.',
        'Erfahrung als strategische Scouting-Führung positionieren.',
      ],
      cta: 'Programm ansehen',
    },
  },
};

const applyLocaleOverrides = (basePack, overrides) =>
  Object.fromEntries(
    Object.entries(basePack).map(([locale, copy]) => {
      const override = overrides[locale] || {};
      return [
        locale,
        {
          ...copy,
          ...override,
          labels: {
            ...copy.labels,
            ...(override.labels || {}),
          },
          profileSlides: override.profileSlides || copy.profileSlides,
          challenges: override.challenges || copy.challenges,
          services: override.services || copy.services,
          masterclass: {
            ...copy.masterclass,
            ...(override.masterclass || {}),
            benefits: override.masterclass?.benefits || copy.masterclass.benefits,
          },
        },
      ];
    }),
  );

const PROFILE_4_OVERRIDES = {
  en: {
    labels: {
      profileEyebrow: 'The role through an atelier lens',
      challengesTitle: 'Creative direction under cultural scrutiny',
      servicesTitle: 'Tools for high-craft, high-pressure leadership',
      masterclassTitle: 'Your change to discover the EOEX universe first hand',
    },
    profileSlides: [
      { title: 'Authorial Consistency', text: 'You are not curating isolated visuals; you are composing a long-form signature that must remain legible over seasons.' },
      { title: 'Aesthetic Governance', text: 'The role includes building guardrails so experimentation stays courageous without becoming stylistically fragmented.' },
      { title: 'Cultural Editing', text: 'You decide what enters the brand language and what gets cut, balancing novelty with editorial restraint.' },
      { title: 'Legacy in Motion', text: 'Your strongest work leaves continuity behind it: a team language, a visual doctrine, and a clearer future direction.' },
    ],
    masterclass: {
      usp: 'Designed for directors shaping long-form brand authorship, not one-season noise.',
    },
  },
  fr: {
    labels: {
      profileEyebrow: 'Le rôle vu par le prisme atelier',
      challengesTitle: 'Direction créative sous regard culturel permanent',
    },
    profileSlides: [
      { title: 'Signature d’auteur', text: 'Vous ne composez pas des images isolées: vous écrivez une continuité de marque lisible de saison en saison.' },
      { title: 'Gouvernance esthétique', text: 'Votre rôle consiste aussi à poser des garde-fous pour que l’expérimentation reste ambitieuse sans devenir dispersée.' },
      { title: 'Montage culturel', text: 'Vous choisissez ce qui entre dans le langage de marque et ce qui doit rester hors cadre.' },
      { title: 'Héritage en mouvement', text: 'Les meilleures directions laissent une méthode, un vocabulaire d’équipe et une trajectoire claire.' },
    ],
    masterclass: {
      usp: 'Pensé pour les directions artistiques qui construisent une signature durable, pas un effet de saison.',
    },
  },
  es: {
    labels: {
      profileEyebrow: 'El rol desde una mirada de atelier',
      challengesTitle: 'Dirección creativa bajo escrutinio cultural constante',
    },
    profileSlides: [
      { title: 'Firma autoral', text: 'No construyes imágenes sueltas: construyes una continuidad de marca reconocible a lo largo del tiempo.' },
      { title: 'Gobernanza estética', text: 'También defines límites para que la experimentación siga siendo valiente sin volverse caótica.' },
      { title: 'Edición cultural', text: 'Decides qué señales entran al lenguaje de marca y cuáles deben quedar fuera.' },
      { title: 'Legado en movimiento', text: 'La mejor dirección deja método, lenguaje de equipo y una ruta más clara.' },
    ],
    masterclass: {
      usp: 'Pensado para dirección creativa que construye autoría de largo plazo, no ruido de temporada.',
    },
  },
  it: {
    labels: {
      profileEyebrow: 'Il ruolo attraverso una prospettiva atelier',
      challengesTitle: 'Direzione creativa sotto osservazione culturale continua',
    },
    profileSlides: [
      { title: 'Firma autoriale', text: 'Non componi immagini isolate: costruisci una continuità di marca riconoscibile nel tempo.' },
      { title: 'Governance estetica', text: 'Definisci confini perché la sperimentazione resti coraggiosa senza diventare frammentata.' },
      { title: 'Editing culturale', text: 'Selezioni quali segnali entrano nel linguaggio del brand e quali restano fuori campo.' },
      { title: 'Eredità in movimento', text: 'La direzione migliore lascia metodo, linguaggio di team e traiettoria più chiara.' },
    ],
    masterclass: {
      usp: 'Pensato per chi costruisce una firma creativa duratura, non un effetto stagionale.',
    },
  },
  pt: {
    labels: {
      profileEyebrow: 'O papel sob uma perspectiva de ateliê',
      challengesTitle: 'Direção criativa sob escrutínio cultural contínuo',
    },
    profileSlides: [
      { title: 'Assinatura autoral', text: 'Você não monta imagens isoladas: constrói uma continuidade de marca reconhecível ao longo das temporadas.' },
      { title: 'Governança estética', text: 'Também define limites para que a experimentação continue ousada sem virar dispersão.' },
      { title: 'Edição cultural', text: 'Decide quais sinais entram na linguagem da marca e quais ficam fora.' },
      { title: 'Legado em movimento', text: 'A melhor direção deixa método, vocabulário de equipe e uma rota mais nítida.' },
    ],
    masterclass: {
      usp: 'Criado para líderes que constroem assinatura de longo prazo, não ruído de estação.',
    },
  },
  de: {
    labels: {
      profileEyebrow: 'Die Rolle aus Atelier-Perspektive',
      challengesTitle: 'Kreativführung unter kontinuierlicher kultureller Beobachtung',
    },
    profileSlides: [
      { title: 'Autorenschaft als Signatur', text: 'Sie bauen keine Einzelbilder, sondern eine langfristig lesbare Markenkontinuität.' },
      { title: 'Ästhetische Governance', text: 'Sie setzen Leitplanken, damit Experimentierfreude mutig bleibt, ohne stilistisch zu zerfasern.' },
      { title: 'Kulturelles Editing', text: 'Sie entscheiden, welche Signale in die Markensprache aufgenommen werden.' },
      { title: 'Vermächtnis in Bewegung', text: 'Starke Führung hinterlässt Methode, Teamvokabular und eine klarere Richtung.' },
    ],
    masterclass: {
      usp: 'Für Kreativdirektoren, die langfristige Handschrift entwickeln statt saisonalen Lärm produzieren.',
    },
  },
};

const PROFILE_5_OVERRIDES = {
  en: {
    labels: {
      profileEyebrow: 'The role in cinematic and campaign environments',
      challengesTitle: 'Pressure points from set to release',
      servicesTitle: 'Sharper systems for narrative, tempo, and execution',
    },
    profileSlides: [
      { title: 'Cinematic Precision', text: 'Your images carry emotion and structure at once; framing and rhythm become editorial decisions, not technical afterthoughts.' },
      { title: 'Production Orchestration', text: 'You are balancing set energy, crew dynamics, and delivery constraints while protecting creative coherence.' },
      { title: 'Narrative Compression', text: 'You condense story into short time windows without flattening nuance, texture, or intent.' },
      { title: 'Format Adaptation', text: 'You adapt cuts for platform logic while preserving one authored visual language across outputs.' },
    ],
    masterclass: {
      usp: 'A cinematic track for videographers shaping campaign-grade stories under real constraints.',
    },
  },
  fr: {
    profileSlides: [
      { title: 'Cadence cinématographique', text: 'Vous tenez une tension visuelle de campagne tout en respectant des délais de production serrés.' },
      { title: 'Direction de plateau', text: 'Vous régulez énergie d’équipe, tempo de tournage et cohérence esthétique en continu.' },
      { title: 'Compression narrative', text: 'Vous racontez juste en peu de temps sans appauvrir texture ni intention.' },
      { title: 'Adaptation multi-formats', text: 'Vous déclinez les sorties par canal en conservant une même signature visuelle.' },
    ],
    masterclass: { usp: 'Un parcours orienté cinéma pour des récits de campagne à haute exigence, sous contraintes réelles.' },
  },
  es: {
    profileSlides: [
      { title: 'Cadencia cinematográfica', text: 'Sostienes una tensión visual de campaña incluso con tiempos de producción ajustados.' },
      { title: 'Dirección de set', text: 'Regulas energía de equipo, ritmo de rodaje y coherencia estética de forma constante.' },
      { title: 'Compresión narrativa', text: 'Cuentas más en menos tiempo sin perder textura ni intención.' },
      { title: 'Adaptación multi-formato', text: 'Ajustas salidas por canal conservando una firma visual única.' },
    ],
    masterclass: { usp: 'Un recorrido con enfoque cinematográfico para relatos de campaña exigentes bajo restricciones reales.' },
  },
  it: {
    profileSlides: [
      { title: 'Cadenza cinematografica', text: 'Mantieni intensità visiva di campagna anche con tempi produttivi molto stretti.' },
      { title: 'Regia di set', text: 'Bilanci energia del team, ritmo di ripresa e coerenza estetica in tempo reale.' },
      { title: 'Compressione narrativa', text: 'Racconti di più in meno tempo senza perdere materia visiva e intenzione.' },
      { title: 'Adattamento multi-formato', text: 'Adatti gli output ai canali mantenendo una firma visiva coerente.' },
    ],
    masterclass: { usp: 'Un percorso a taglio cinematografico per storie di campagna ad alta precisione in contesti reali.' },
  },
  pt: {
    profileSlides: [
      { title: 'Cadência cinematográfica', text: 'Você sustenta tensão visual de campanha mesmo com prazos de produção comprimidos.' },
      { title: 'Direção de set', text: 'Equilibra energia de equipe, ritmo de captação e coerência estética em tempo real.' },
      { title: 'Compressão narrativa', text: 'Conta mais em menos tempo sem perder textura nem intenção.' },
      { title: 'Adaptação multi-formato', text: 'Ajusta entregas por canal mantendo uma assinatura visual consistente.' },
    ],
    masterclass: { usp: 'Um percurso com foco cinematográfico para narrativas de campanha exigentes sob restrições reais.' },
  },
  de: {
    profileSlides: [
      { title: 'Cineastische Taktung', text: 'Sie halten kampagnenfähige Bildspannung trotz stark verdichteter Produktionszeiten.' },
      { title: 'Set-Regie', text: 'Sie steuern Teamenergie, Drehtempo und ästhetische Kohärenz in Echtzeit.' },
      { title: 'Narrative Verdichtung', text: 'Sie erzählen mehr in kürzerer Zeit, ohne Textur und Intention zu verlieren.' },
      { title: 'Formatübergreifende Anpassung', text: 'Sie passen Ausspielungen je Kanal an und bewahren dennoch eine einheitliche Handschrift.' },
    ],
    masterclass: { usp: 'Ein cineastischer Schwerpunkt für kampagnentaugliches Storytelling unter realen Produktionsgrenzen.' },
  },
};

const PROFILE_AI_MASTERCLASS_CORE = {
  profile_1: {
    en: 'Includes AI-assisted creative direction labs for trend decoding, concept stress-testing, and brand-consistency decisions.',
    fr: 'Inclut des ateliers IA de direction artistique pour décoder les tendances, tester les concepts sous contrainte et sécuriser la cohérence de marque.',
    es: 'Incluye laboratorios de IA aplicados a dirección creativa para decodificar tendencias, tensionar conceptos y proteger la coherencia de marca.',
    it: 'Include laboratori di IA applicata alla direzione creativa per leggere i trend, stress-testare i concept e proteggere la coerenza del brand.',
    pt: 'Inclui laboratórios de IA aplicados à direção criativa para decodificar tendências, testar conceitos sob pressão e proteger a coerência da marca.',
    de: 'Enthält KI-gestützte Labs für Kreativführung zur Trendanalyse, Konzeptbelastung und konsistenten Markensteuerung.',
  },
  profile_2: {
    en: 'Built around AI-supported video planning: script refinement, shot logic, and platform-specific edit decisioning.',
    fr: 'Construit autour d’enseignements IA pour la vidéo: affinage script, logique de plans et décisions de montage par plateforme.',
    es: 'Diseñado con enseñanza de IA para vídeo: refinamiento de guion, lógica de planos y decisiones de edición por plataforma.',
    it: 'Costruito su didattica IA per il video: rifinitura script, logica di ripresa e decisioni di montaggio per piattaforma.',
    pt: 'Estruturado com ensino de IA para vídeo: refinamento de roteiro, lógica de planos e decisões de edição por plataforma.',
    de: 'Aufgebaut mit KI-Lehre für Video: Skriptverfeinerung, Shot-Logik und plattformspezifische Schnittentscheidungen.',
  },
  profile_3: {
    en: 'Integrates AI methods for bias-aware talent screening, potential scoring, and long-horizon development mapping.',
    fr: 'Intègre des méthodes IA pour un repérage des talents attentif aux biais, une lecture du potentiel et une cartographie de développement long terme.',
    es: 'Integra métodos de IA para detectar talento con control de sesgos, valorar potencial y mapear desarrollo a largo plazo.',
    it: 'Integra metodi IA per scouting con controllo dei bias, valutazione del potenziale e mappatura di sviluppo nel lungo periodo.',
    pt: 'Integra métodos de IA para scouting com controlo de vieses, avaliação de potencial e mapeamento de desenvolvimento de longo prazo.',
    de: 'Integriert KI-Methoden für bias-bewusstes Scouting, Potenzialbewertung und langfristige Entwicklungsplanung.',
  },
  profile_4: {
    en: 'Adds AI governance modules for aesthetic consistency controls, visual language drift detection, and signature protection.',
    fr: 'Ajoute des modules IA de gouvernance pour contrôler la cohérence esthétique, détecter les dérives de langage visuel et protéger la signature.',
    es: 'Añade módulos de gobernanza con IA para controlar coherencia estética, detectar deriva visual y proteger la firma creativa.',
    it: 'Aggiunge moduli di governance IA per controllo della coerenza estetica, rilevazione della deriva visiva e tutela della firma autoriale.',
    pt: 'Adiciona módulos de governança com IA para controlo de coerência estética, deteção de deriva visual e proteção de assinatura criativa.',
    de: 'Ergänzt KI-Governance-Module für ästhetische Konsistenz, Erkennung visueller Drift und Schutz der gestalterischen Handschrift.',
  },
  profile_5: {
    en: 'Centers AI teaching on previsualization, adaptive shot-listing, and post-production quality control for campaign delivery.',
    fr: 'Place l’IA au cœur de la prévisualisation, des shot-lists adaptatives et du contrôle qualité en postproduction campagne.',
    es: 'Sitúa la IA en el núcleo de previsualización, shot-list adaptativa y control de calidad de postproducción para campaña.',
    it: 'Mette l’IA al centro di previsualizzazione, shot list adattive e controllo qualità in post-produzione per campagne.',
    pt: 'Coloca a IA no centro da pré-visualização, shot-list adaptativa e controlo de qualidade de pós-produção para campanha.',
    de: 'Setzt KI in den Kern von Previsualisierung, adaptiver Shotlist und Postproduktions-Qualitätssicherung für Kampagnen.',
  },
  profile_6: {
    en: 'Includes AI-supported stewardship methods for risk detection, trajectory planning, and ethical talent-development decisions.',
    fr: 'Inclut des méthodes IA d’accompagnement pour détecter les risques, planifier les trajectoires et soutenir des décisions éthiques de développement.',
    es: 'Incluye métodos con IA para acompañamiento: detección de riesgos, planificación de trayectorias y decisiones éticas de desarrollo.',
    it: 'Include metodi IA per la stewardship: rilevazione rischi, pianificazione delle traiettorie e decisioni etiche di sviluppo.',
    pt: 'Inclui métodos com IA para acompanhamento: deteção de riscos, planeamento de trajetórias e decisões éticas de desenvolvimento.',
    de: 'Enthält KI-gestützte Stewardship-Methoden für Risikoerkennung, Trajektorienplanung und ethische Entwicklungsentscheidungen.',
  },
};

const PROFILE_AI_MASTERCLASS_BENEFIT = {
  profile_1: {
    en: 'Run AI-assisted creative review sessions that flag inconsistency before launch.',
    fr: 'Conduire des revues créatives assistées par IA qui signalent les incohérences avant diffusion.',
    es: 'Conducir revisiones creativas asistidas por IA que detectan incoherencias antes del lanzamiento.',
    it: 'Condurre revisioni creative assistite da IA che rilevano incoerenze prima del lancio.',
    pt: 'Conduzir revisões criativas assistidas por IA que sinalizam incoerências antes do lançamento.',
    de: 'KI-gestützte Creative Reviews durchführen, die Inkonsistenzen vor dem Launch erkennen.',
  },
  profile_2: {
    en: 'Apply AI workflows to optimize shot continuity, pacing, and cross-platform cutdowns.',
    fr: 'Appliquer des workflows IA pour optimiser continuité des plans, rythme et déclinaisons multi-formats.',
    es: 'Aplicar flujos de IA para optimizar continuidad de planos, ritmo y versiones por plataforma.',
    it: 'Applicare workflow IA per ottimizzare continuità dei piani, ritmo e versioni multi-piattaforma.',
    pt: 'Aplicar fluxos de IA para otimizar continuidade de planos, ritmo e versões por plataforma.',
    de: 'KI-Workflows nutzen, um Shot-Kontinuität, Rhythmus und Plattformversionen zu optimieren.',
  },
  profile_3: {
    en: 'Use AI scoring grids to compare talent potential while reducing selection bias.',
    fr: 'Utiliser des grilles IA de scoring pour comparer le potentiel tout en réduisant les biais de sélection.',
    es: 'Usar matrices de IA para comparar potencial y reducir sesgos de selección.',
    it: 'Usare griglie IA di scoring per confrontare il potenziale riducendo i bias di selezione.',
    pt: 'Usar grelhas de IA para comparar potencial e reduzir vieses de seleção.',
    de: 'KI-Scoringraster einsetzen, um Potenziale zu vergleichen und Auswahlbias zu senken.',
  },
  profile_4: {
    en: 'Deploy AI style-governance checks that preserve signature while scaling production.',
    fr: 'Déployer des contrôles IA de gouvernance stylistique qui préservent la signature à l’échelle.',
    es: 'Desplegar controles de gobernanza estilística con IA para preservar la firma al escalar producción.',
    it: 'Distribuire controlli IA di governance stilistica per preservare la firma durante la scalabilità produttiva.',
    pt: 'Implementar controlos de governança de estilo com IA para preservar a assinatura ao escalar produção.',
    de: 'KI-Style-Governance-Checks einsetzen, die die Handschrift beim Skalieren der Produktion sichern.',
  },
  profile_5: {
    en: 'Use AI previsualization and quality gates to stabilize campaign output under tight deadlines.',
    fr: 'Utiliser la prévisualisation IA et des gates qualité pour stabiliser la production campagne sous délai serré.',
    es: 'Usar previsualización con IA y puertas de calidad para estabilizar entregas de campaña en plazos cortos.',
    it: 'Usare previsualizzazione IA e quality gate per stabilizzare l’output campagna sotto scadenza.',
    pt: 'Usar pré-visualização com IA e gates de qualidade para estabilizar entregas de campanha com prazos curtos.',
    de: 'KI-Previsualisierung und Quality Gates nutzen, um Kampagnenoutput unter Zeitdruck zu stabilisieren.',
  },
  profile_6: {
    en: 'Operationalize AI risk signals to support ethical, long-term talent pathway decisions.',
    fr: 'Opérationnaliser des signaux IA de risque pour soutenir des décisions éthiques de trajectoire long terme.',
    es: 'Operativizar señales de riesgo con IA para respaldar decisiones éticas de trayectoria a largo plazo.',
    it: 'Operativizzare segnali di rischio IA per sostenere decisioni etiche sulle traiettorie di lungo periodo.',
    pt: 'Operacionalizar sinais de risco com IA para sustentar decisões éticas de trajetória no longo prazo.',
    de: 'KI-Risikosignale operationalisieren, um ethische Entscheidungen zu langfristigen Talentpfaden zu stützen.',
  },
};

const withProfileAiTeachings = (profileKey, pack) =>
  Object.fromEntries(
    Object.entries(pack).map(([locale, copy]) => {
      const coreByLocale = PROFILE_AI_MASTERCLASS_CORE[profileKey];
      const benefitByLocale = PROFILE_AI_MASTERCLASS_BENEFIT[profileKey];
      const coreText = coreByLocale?.[locale] || coreByLocale?.en;
      const benefitText = benefitByLocale?.[locale] || benefitByLocale?.en;
      return [
        locale,
        {
          ...copy,
          masterclass: {
            ...copy.masterclass,
            usp: coreText ? `${copy.masterclass.usp} ${coreText}` : copy.masterclass.usp,
            benefits: benefitText ? [...copy.masterclass.benefits, benefitText] : copy.masterclass.benefits,
          },
        },
      ];
    }),
  );

const PROFILE_6_OVERRIDES = {
  en: {
    labels: {
      profileEyebrow: 'You are building careers with care and consistency',
      challengesTitle: 'Where scouting, ethics, and development intersect',
      servicesTitle: 'Systems for responsible discovery and growth',
    },
    profileSlides: [
      { title: 'Stewardship Mindset', text: 'You are not only identifying talent; you are influencing how that talent enters the industry ecosystem.' },
      { title: 'Signal Integrity', text: 'You read early indicators critically, separating sustainable potential from temporary visibility spikes.' },
      { title: 'Ethical Leverage', text: 'How you scout shapes trust in your network, your brand partners, and the careers you touch.' },
      { title: 'Development Orientation', text: 'The strongest scouting practice includes pathways, support structures, and realistic progression design.' },
    ],
    masterclass: {
      usp: 'Focused on long-term talent stewardship, ethical decision-making, and development quality.',
    },
  },
  fr: {
    profileSlides: [
      { title: 'Logique d’accompagnement', text: 'Vous ne détectez pas seulement des profils: vous influencez les conditions de leur entrée dans l’écosystème.' },
      { title: 'Intégrité du signal', text: 'Vous distinguez les signaux durables des pics de visibilité passagers.' },
      { title: 'Levier éthique', text: 'Votre manière de sourcer impacte la confiance réseau et la qualité des trajectoires.' },
      { title: 'Orientation développement', text: 'Le scouting le plus solide prévoit aussi des passerelles et des rythmes de progression réalistes.' },
    ],
    masterclass: { usp: 'Centré sur l’accompagnement long terme des talents, l’éthique des décisions et la qualité du développement.' },
  },
  es: {
    profileSlides: [
      { title: 'Lógica de acompañamiento', text: 'No solo detectas perfiles: también influyes en cómo entran al ecosistema profesional.' },
      { title: 'Integridad de señal', text: 'Separas señales sostenibles de picos de visibilidad pasajera.' },
      { title: 'Palanca ética', text: 'Tu forma de scouting afecta la confianza de red y la calidad de las trayectorias.' },
      { title: 'Orientación al desarrollo', text: 'El scouting más sólido incluye rutas de crecimiento realistas y soporte continuo.' },
    ],
    masterclass: { usp: 'Enfocado en acompañamiento de largo plazo, ética de decisión y calidad de desarrollo del talento.' },
  },
  it: {
    profileSlides: [
      { title: 'Logica di accompagnamento', text: 'Non individui solo profili: influenzi come entrano nell’ecosistema professionale.' },
      { title: 'Integrità del segnale', text: 'Distingui segnali sostenibili da picchi di visibilità temporanei.' },
      { title: 'Leva etica', text: 'Il modo in cui fai scouting incide su fiducia di rete e qualità delle traiettorie.' },
      { title: 'Orientamento allo sviluppo', text: 'La pratica più solida include percorsi realistici e strutture di supporto continue.' },
    ],
    masterclass: { usp: 'Focalizzato su accompagnamento nel lungo periodo, etica decisionale e qualità dello sviluppo talenti.' },
  },
  pt: {
    profileSlides: [
      { title: 'Lógica de acompanhamento', text: 'Você não apenas identifica perfis: influencia como eles entram no ecossistema profissional.' },
      { title: 'Integridade de sinal', text: 'Separa sinais sustentáveis de picos temporários de visibilidade.' },
      { title: 'Alavanca ética', text: 'Seu modo de scouting afeta confiança de rede e qualidade de trajetória.' },
      { title: 'Orientação para desenvolvimento', text: 'A prática mais sólida inclui rotas realistas de evolução e suporte contínuo.' },
    ],
    masterclass: { usp: 'Focado em acompanhamento de longo prazo, ética nas decisões e qualidade no desenvolvimento de talentos.' },
  },
  de: {
    profileSlides: [
      { title: 'Begleitungslogik', text: 'Sie identifizieren nicht nur Profile, sondern prägen auch, wie Talente in das Ökosystem eintreten.' },
      { title: 'Signalintegrität', text: 'Sie trennen tragfähige Signale von kurzfristigen Sichtbarkeitsspitzen.' },
      { title: 'Ethischer Hebel', text: 'Ihre Scouting-Praxis beeinflusst Netzwerkvertrauen und Entwicklungsqualität.' },
      { title: 'Entwicklungsorientierung', text: 'Starkes Scouting umfasst realistische Entwicklungswege und dauerhafte Unterstützung.' },
    ],
    masterclass: { usp: 'Fokussiert auf langfristige Talentbegleitung, ethische Entscheidungen und Entwicklungsqualität.' },
  },
};

const trackTemplateByRole = (profileId) => {
  const canonicalEn = getCanonicalRoleLabel(`profile_${profileId}`, 'en');
  const track = detectRoleTrackFromLabel(canonicalEn);

  if (track === 'education') return EDUCATION_DIRECTOR_PACK;
  if (track === 'content') return FASHION_VIDEOGRAPHER_PACK;
  if (track === 'talent') return TALENT_SCOUT_PACK;
  return CREATIVE_DIRECTOR_PACK;
};

const withGeneratedTrackIdentity = (_profileId, pack) =>
  Object.fromEntries(
    Object.entries(pack).map(([locale, copy]) => [
      locale,
      {
        ...copy,
      },
    ]),
  );

const BASE_PROFILE_LIBRARY = {
  profile_1: withProfileAiTeachings('profile_1', CREATIVE_DIRECTOR_PACK),
  profile_2: withProfileAiTeachings('profile_2', FASHION_VIDEOGRAPHER_PACK),
  profile_3: withProfileAiTeachings('profile_3', TALENT_SCOUT_PACK),
  profile_4: withProfileAiTeachings('profile_4', applyLocaleOverrides(CREATIVE_DIRECTOR_PACK, PROFILE_4_OVERRIDES)),
  profile_5: withProfileAiTeachings('profile_5', applyLocaleOverrides(FASHION_VIDEOGRAPHER_PACK, PROFILE_5_OVERRIDES)),
  profile_6: withProfileAiTeachings('profile_6', applyLocaleOverrides(TALENT_SCOUT_PACK, PROFILE_6_OVERRIDES)),
};

const GENERATED_PROFILE_LIBRARY = Object.fromEntries(
  GENERATED_PROFILE_IDS.map((profileId) => {
    const basePack = trackTemplateByRole(profileId);
    return [`profile_${profileId}`, withGeneratedTrackIdentity(profileId, basePack)];
  }),
);

const PROFILE_COPY_LIBRARY_DRAFT = {
  ...BASE_PROFILE_LIBRARY,
  ...GENERATED_PROFILE_LIBRARY,
};

const enforceCanonicalRoleLabels = (library) =>
  Object.fromEntries(
    Object.entries(library).map(([profileKey, localeMap]) => [
      profileKey,
      Object.fromEntries(
        Object.entries(localeMap).map(([locale, copy]) => {
          const profileId = parseProfileId(profileKey);
          const canonical = getCanonicalRoleLabel(profileKey, locale);
          const canonicalEn = getCanonicalRoleLabel(profileKey, 'en');
          const canonicalTrack = detectRoleTrackFromLabel(canonicalEn);
          const servicesOverride = roleSpecificServices(canonical, canonicalEn, locale);
          const resolvedServices = servicesOverride || copy.services || [];
          const masterclassOverride = roleSpecificMasterclassOverride(profileId, canonical, canonicalEn, locale);
          const baseBenefits = masterclassOverride?.benefits || copy.masterclass?.benefits || [];
          const normalizedBenefits = expandMasterclassBenefits(baseBenefits, canonical, canonicalTrack, locale, profileId, resolvedServices);
          const roleBasedPrice = getMasterclassPriceByRole(canonicalEn);
          return [
            locale,
            {
              ...copy,
              roleName: canonical,
              navProfile: canonical,
              services: resolvedServices,
              labels: {
                ...copy.labels,
                challengesTitle: roleSpecificChallengesTitle(canonical, locale),
                masterclassTitle: roleSpecificMasterclassTitle(canonical, locale),
              },
              masterclass: {
                ...(copy.masterclass || {}),
                name: roleSpecificMasterclassName(canonical, locale),
                usp: masterclassOverride?.usp || roleSpecificMasterclassUsp(canonical, locale),
                benefits: normalizedBenefits,
                price: roleBasedPrice,
              },
            },
          ];
        }),
      ),
    ]),
  );

const PROFILE_COPY_LIBRARY_NATIVE = rewriteNonEnglishSourceCopy(PROFILE_COPY_LIBRARY_DRAFT);

const PROFILE_COPY_LIBRARY_NORMALIZED = enforceCanonicalRoleLabels(PROFILE_COPY_LIBRARY_NATIVE);

validateCanonicalRoleLexicon(PROFILE_COPY_LIBRARY_NORMALIZED);

export const PROFILE_COPY_LIBRARY = PROFILE_COPY_LIBRARY_NORMALIZED;
