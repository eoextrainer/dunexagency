import React, { useState } from 'react';
import './App.css';
import './ProfilesMapPage.css';
import { getProfileRoleLabel, getProfileRoleSummary, getProfileSourceKey } from './careersDocumentIndex';

const PUBLIC_SITE_URL = 'https://eoextrainer.github.io/eoexagency/';
const ALL_PROFILE_IDS = Array.from({ length: 62 }, (_, index) => index + 1);

const ACTIVE_PROFILE_IDS = [
  1, // Creative Director
  2, // Fashion Designer
  10, // Fashion Photographer
  11, // Fashion Videographer
  12, // Fashion Stylist
  13, // Makeup Artist
  14, // Hair Stylist
  15, // Model Agent
  16, // Talent Scout
  17, // Casting Director
  18, // Runway Model
  19, // Editorial Model
  20, // Commercial Model
  21, // E-commerce Model
  22, // Ugc Content Creator
  23, // Plus-size / Curve Model
  24, // Fit Model
  25, // Parts Model
  26, // Fitness Model
  27, // Swimsuit / Lingerie Model
  36, // Booker / Booking Agent
  37, // Casting Assistant
  38, // Talent Agent
  39, // Talent Manager
  46, // Model Booker
  47, // Casting Director
  48, // Fashion Editor
  61, // Fashion Modelling School Director
  62, // Fashion Design School Director
];

const PROFILE_ROUTES = ACTIVE_PROFILE_IDS.map((id) => ({
  id,
  slug: `profile-${id}`,
  source: getProfileSourceKey(id),
}));

const PAGE_LANGUAGES = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'fr', short: 'FR', name: 'Français' },
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'it', short: 'IT', name: 'Italiano' },
  { code: 'pt', short: 'PT', name: 'Português' },
  { code: 'de', short: 'DE', name: 'Deutsch' },
];

const MAP_COPY = {
  en: {
    language: 'Language',
    mapTag: 'Profiles Map',
    eyebrow: 'Profiles Editorial Directory',
    title: 'Curated Access to Every Profile Experience',
    intro: 'A refined QA and navigation surface for all profile routes, with role context and source clarity.',
    profileRoutesTitle: 'Profile Routes',
    careersMappingTitle: 'CAREERS Source Mapping',
    careersMappingBody: 'Profiles 2-10 reuse the same structure, layout, theme, and language variants while rotating across CAREERS source files. Mapping: 2->CAREERS-2, 3->CAREERS-3, 4->CAREERS-1, 5->CAREERS-2, 6->CAREERS-3, 7->CAREERS-1, 8->CAREERS-2, 9->CAREERS-3, 10->CAREERS-1.',
    sourceLabel: 'Source',
    routeLabel: 'Route',
    roleLabel: 'Role',
    profileLabel: 'Profile',
    openProfile: 'Open Profile',
    openRoute: 'Open Route',
    utility: {
      home: 'EOEX Home',
      homeNote: 'Main website root',
      landing: 'Primary Landing',
      landingNote: 'Landing page experience',
      review: 'Review Hub',
      reviewNote: 'Route quality dashboard',
      profiles: 'Profiles Map',
      profilesNote: 'This navigation page',
    },
    qa: {
      title: 'Automated QA Status',
      matrixTitle: 'Per-Profile QA Matrix',
      overall: 'Overall',
      pass: 'PASS',
      checkRequired: 'CHECK REQUIRED',
      routeReachability: 'Route Reachability',
      checking: 'Checking...',
      canonicalLexicon: 'Canonical Role Lexicon',
      passAll: 'PASS (all profiles/locales)',
      failed: 'FAILED',
      route: 'Route',
      lexicon: 'Lexicon',
      ok: 'OK',
      fail: 'FAIL',
    },
    roles: {
      creative: {
        heading: 'Creative Direction',
        description: 'Strategic authorship, brand coherence, and long-range visual governance.',
      },
      video: {
        heading: 'Fashion Videography',
        description: 'Cinematic storytelling, production precision, and platform-native adaptation.',
      },
      scout: {
        heading: 'Talent Scouting',
        description: 'Ethical discovery, potential evaluation, and long-term talent stewardship.',
      },
    },
    footer: {
      about: 'About',
      masterclasses: 'Masterclasses',
      contact: 'Contact',
      legal: 'Privacy Policy · Terms of Service',
    },
  },
  fr: {
    language: 'Langue',
    mapTag: 'Carte des Profils',
    eyebrow: 'Répertoire Editorial des Profils',
    title: 'Accès soigné à chaque expérience profil',
    intro: 'Un espace QA et navigation plus élégant, avec contexte métier et traçabilité des sources.',
    profileRoutesTitle: 'Parcours Profils',
    careersMappingTitle: 'Cartographie des Sources CAREERS',
    careersMappingBody: 'Les profils 2-10 reprennent la même structure, le même thème et les variantes linguistiques en alternant les sources CAREERS. Mapping: 2->CAREERS-2, 3->CAREERS-3, 4->CAREERS-1, 5->CAREERS-2, 6->CAREERS-3, 7->CAREERS-1, 8->CAREERS-2, 9->CAREERS-3, 10->CAREERS-1.',
    sourceLabel: 'Source',
    routeLabel: 'Route',
    roleLabel: 'Rôle',
    profileLabel: 'Profil',
    openProfile: 'Ouvrir le Profil',
    openRoute: 'Ouvrir la Route',
    utility: {
      home: 'Accueil EOEX',
      homeNote: 'Point d’entrée principal',
      landing: 'Landing Principal',
      landingNote: 'Expérience landing',
      review: 'Hub de Revue',
      reviewNote: 'Tableau qualité des routes',
      profiles: 'Carte des Profils',
      profilesNote: 'Page de navigation active',
    },
    qa: {
      title: 'Statut QA Automatisé',
      matrixTitle: 'Matrice QA par Profil',
      overall: 'Global',
      pass: 'VALIDÉ',
      checkRequired: 'VÉRIFICATION REQUISE',
      routeReachability: 'Accessibilité des Routes',
      checking: 'Vérification...',
      canonicalLexicon: 'Lexique Canonique des Rôles',
      passAll: 'VALIDÉ (tous profils/langues)',
      failed: 'ÉCHEC',
      route: 'Route',
      lexicon: 'Lexique',
      ok: 'OK',
      fail: 'KO',
    },
    roles: {
      creative: {
        heading: 'Direction artistique',
        description: 'Autorité créative, cohérence de marque et gouvernance visuelle à long terme.',
      },
      video: {
        heading: 'Vidéographie mode',
        description: 'Narration cinématographique, précision de production et déclinaison multi-canal.',
      },
      scout: {
        heading: 'Détection de talents',
        description: 'Repérage éthique, lecture du potentiel et accompagnement durable des talents.',
      },
    },
    footer: {
      about: 'À propos',
      masterclasses: 'Masterclasses',
      contact: 'Contact',
      legal: 'Politique de confidentialité · Conditions d’utilisation',
    },
  },
  es: {
    language: 'Idioma',
    mapTag: 'Mapa de Perfiles',
    eyebrow: 'Directorio Editorial de Perfiles',
    title: 'Acceso curado a cada experiencia de perfil',
    intro: 'Un espacio de QA y navegación más elegante con contexto de rol y trazabilidad de fuentes.',
    profileRoutesTitle: 'Rutas de Perfil',
    careersMappingTitle: 'Mapa de Fuentes CAREERS',
    careersMappingBody: 'Los perfiles 2-10 reutilizan la misma estructura, tema y variantes de idioma, rotando las fuentes CAREERS. Mapeo: 2->CAREERS-2, 3->CAREERS-3, 4->CAREERS-1, 5->CAREERS-2, 6->CAREERS-3, 7->CAREERS-1, 8->CAREERS-2, 9->CAREERS-3, 10->CAREERS-1.',
    sourceLabel: 'Fuente',
    routeLabel: 'Ruta',
    roleLabel: 'Rol',
    profileLabel: 'Perfil',
    openProfile: 'Abrir Perfil',
    openRoute: 'Abrir Ruta',
    utility: {
      home: 'Inicio EOEX',
      homeNote: 'Raíz principal del sitio',
      landing: 'Landing Principal',
      landingNote: 'Experiencia de landing',
      review: 'Hub de Revisión',
      reviewNote: 'Panel de calidad de rutas',
      profiles: 'Mapa de Perfiles',
      profilesNote: 'Página de navegación actual',
    },
    qa: {
      title: 'Estado QA Automatizado',
      matrixTitle: 'Matriz QA por Perfil',
      overall: 'Global',
      pass: 'APROBADO',
      checkRequired: 'REVISIÓN REQUERIDA',
      routeReachability: 'Disponibilidad de Rutas',
      checking: 'Comprobando...',
      canonicalLexicon: 'Lexicón Canónico de Roles',
      passAll: 'APROBADO (todos perfiles/idiomas)',
      failed: 'FALLÓ',
      route: 'Ruta',
      lexicon: 'Lexicón',
      ok: 'OK',
      fail: 'FALLO',
    },
    roles: {
      creative: {
        heading: 'Dirección creativa',
        description: 'Autoría estratégica, coherencia de marca y gobernanza visual de largo plazo.',
      },
      video: {
        heading: 'Videografía de moda',
        description: 'Relato cinematográfico, precisión de producción y adaptación por plataforma.',
      },
      scout: {
        heading: 'Scouting de talento',
        description: 'Descubrimiento ético, evaluación de potencial y acompañamiento sostenido.',
      },
    },
    footer: {
      about: 'Acerca de',
      masterclasses: 'Masterclasses',
      contact: 'Contacto',
      legal: 'Política de privacidad · Términos de servicio',
    },
  },
  it: {
    language: 'Lingua',
    mapTag: 'Mappa Profili',
    eyebrow: 'Directory Editoriale Profili',
    title: 'Accesso curato a ogni esperienza profilo',
    intro: 'Un hub QA e di navigazione più elegante con contesto di ruolo e trasparenza delle fonti.',
    profileRoutesTitle: 'Percorsi Profilo',
    utilityRoutesTitle: 'Route di Servizio',
    careersMappingTitle: 'Mappatura Sorgenti CAREERS',
    careersMappingBody: 'I profili 2-10 riutilizzano stessa struttura, tema e varianti linguistiche ruotando le sorgenti CAREERS. Mappatura: 2->CAREERS-2, 3->CAREERS-3, 4->CAREERS-1, 5->CAREERS-2, 6->CAREERS-3, 7->CAREERS-1, 8->CAREERS-2, 9->CAREERS-3, 10->CAREERS-1.',
    sourceLabel: 'Sorgente',
    routeLabel: 'Percorso',
    roleLabel: 'Ruolo',
    profileLabel: 'Profilo',
    openProfile: 'Apri Profilo',
    openRoute: 'Apri Route',
    utility: {
      home: 'Home EOEX',
      homeNote: 'Ingresso principale del sito',
      landing: 'Landing Principale',
      landingNote: 'Esperienza landing',
      review: 'Review Hub',
      reviewNote: 'Dashboard qualità percorsi',
      profiles: 'Mappa Profili',
      profilesNote: 'Pagina di navigazione corrente',
    },
    qa: {
      title: 'Stato QA Automatizzato',
      matrixTitle: 'Matrice QA per Profilo',
      overall: 'Complessivo',
      pass: 'OK',
      checkRequired: 'VERIFICA RICHIESTA',
      routeReachability: 'Raggiungibilità Route',
      checking: 'Verifica in corso...',
      canonicalLexicon: 'Lessico Canonico dei Ruoli',
      passAll: 'OK (tutti profili/lingue)',
      failed: 'ERRORE',
      route: 'Route',
      lexicon: 'Lessico',
      ok: 'OK',
      fail: 'KO',
    },
    roles: {
      creative: {
        heading: 'Direzione creativa',
        description: 'Autorialità strategica, coerenza di brand e governance visiva di lungo periodo.',
      },
      video: {
        heading: 'Videografia moda',
        description: 'Storytelling cinematografico, precisione produttiva e adattamento multi-piattaforma.',
      },
      scout: {
        heading: 'Talent scouting',
        description: 'Scoperta etica, valutazione del potenziale e accompagnamento sostenibile.',
      },
    },
    footer: {
      about: 'Chi siamo',
      masterclasses: 'Masterclass',
      contact: 'Contatti',
      legal: 'Privacy policy · Termini di servizio',
    },
  },
  pt: {
    language: 'Idioma',
    mapTag: 'Mapa de Perfis',
    eyebrow: 'Diretório Editorial de Perfis',
    title: 'Acesso curado a cada experiência de perfil',
    intro: 'Um espaço de QA e navegação mais elegante com contexto de função e clareza de fontes.',
    profileRoutesTitle: 'Rotas de Perfil',
    careersMappingTitle: 'Mapeamento das Fontes CAREERS',
    careersMappingBody: 'Os perfis 2-10 reutilizam a mesma estrutura, tema e variantes de idioma, alternando as fontes CAREERS. Mapeamento: 2->CAREERS-2, 3->CAREERS-3, 4->CAREERS-1, 5->CAREERS-2, 6->CAREERS-3, 7->CAREERS-1, 8->CAREERS-2, 9->CAREERS-3, 10->CAREERS-1.',
    sourceLabel: 'Fonte',
    routeLabel: 'Rota',
    roleLabel: 'Função',
    profileLabel: 'Perfil',
    openProfile: 'Abrir Perfil',
    openRoute: 'Abrir Rota',
    utility: {
      home: 'Início EOEX',
      homeNote: 'Raiz principal do website',
      landing: 'Landing Principal',
      landingNote: 'Experiência de landing',
      review: 'Hub de Revisão',
      reviewNote: 'Painel de qualidade de rotas',
      profiles: 'Mapa de Perfis',
      profilesNote: 'Página de navegação atual',
    },
    qa: {
      title: 'Estado QA Automatizado',
      matrixTitle: 'Matriz QA por Perfil',
      overall: 'Geral',
      pass: 'APROVADO',
      checkRequired: 'REVISÃO NECESSÁRIA',
      routeReachability: 'Acessibilidade das Rotas',
      checking: 'A verificar...',
      canonicalLexicon: 'Léxico Canónico de Funções',
      passAll: 'APROVADO (todos perfis/idiomas)',
      failed: 'FALHOU',
      route: 'Rota',
      lexicon: 'Léxico',
      ok: 'OK',
      fail: 'FALHA',
    },
    roles: {
      creative: {
        heading: 'Direção criativa',
        description: 'Autoria estratégica, coerência de marca e governança visual de longo prazo.',
      },
      video: {
        heading: 'Videografia de moda',
        description: 'Narrativa cinematográfica, precisão de produção e adaptação por plataforma.',
      },
      scout: {
        heading: 'Scouting de talentos',
        description: 'Descoberta ética, avaliação de potencial e acompanhamento sustentado.',
      },
    },
    footer: {
      about: 'Sobre',
      masterclasses: 'Masterclasses',
      contact: 'Contacto',
      legal: 'Política de privacidade · Termos de serviço',
    },
  },
  de: {
    language: 'Sprache',
    mapTag: 'Profile-Karte',
    eyebrow: 'Editoriales Profilverzeichnis',
    title: 'Kuratierten Zugang zu allen Profilerlebnissen',
    intro: 'Ein eleganteres QA- und Navigationspanel mit Rollenkontext und klarer Quellenzuordnung.',
    profileRoutesTitle: 'Profilrouten',
    utilityRoutesTitle: 'Systemrouten',
    careersMappingTitle: 'CAREERS-Quellenzuordnung',
    careersMappingBody: 'Profile 2-10 nutzen dieselbe Struktur, dasselbe Theme und dieselben Sprachvarianten mit rotierenden CAREERS-Quellen. Zuordnung: 2->CAREERS-2, 3->CAREERS-3, 4->CAREERS-1, 5->CAREERS-2, 6->CAREERS-3, 7->CAREERS-1, 8->CAREERS-2, 9->CAREERS-3, 10->CAREERS-1.',
    sourceLabel: 'Quelle',
    routeLabel: 'Route',
    roleLabel: 'Rolle',
    profileLabel: 'Profil',
    openProfile: 'Profil Öffnen',
    openRoute: 'Route Öffnen',
    utility: {
      home: 'EOEX Start',
      homeNote: 'Haupt-Einstieg der Website',
      landing: 'Primäre Landing',
      landingNote: 'Landing-Erlebnis',
      review: 'Review Hub',
      reviewNote: 'Qualitäts-Dashboard für Routen',
      profiles: 'Profile-Karte',
      profilesNote: 'Aktuelle Navigationsseite',
    },
    qa: {
      title: 'Automatisierter QA-Status',
      matrixTitle: 'QA-Matrix je Profil',
      overall: 'Gesamt',
      pass: 'BESTANDEN',
      checkRequired: 'PRÜFUNG ERFORDERLICH',
      routeReachability: 'Erreichbarkeit der Routen',
      checking: 'Prüfung läuft...',
      canonicalLexicon: 'Kanonisches Rollenlexikon',
      passAll: 'BESTANDEN (alle Profile/Sprachen)',
      failed: 'FEHLER',
      route: 'Route',
      lexicon: 'Lexikon',
      ok: 'OK',
      fail: 'FEHLER',
    },
    roles: {
      creative: {
        heading: 'Kreativdirektion',
        description: 'Strategische Autorenschaft, Markenkohärenz und visuelle Governance auf lange Sicht.',
      },
      video: {
        heading: 'Modevideografie',
        description: 'Cineastisches Storytelling, Produktionspräzision und Plattformanpassung.',
      },
      scout: {
        heading: 'Talentscouting',
        description: 'Ethische Entdeckung, Potenzialbewertung und nachhaltige Talentbegleitung.',
      },
    },
    footer: {
      about: 'Über uns',
      masterclasses: 'Masterclasses',
      contact: 'Kontakt',
      legal: 'Datenschutz · Nutzungsbedingungen',
    },
  },
};

export default function ProfilesMapPage() {
  const [language, setLanguage] = useState('en');
  const homePageUrl = typeof window !== 'undefined' ? `${window.location.origin}${import.meta.env.BASE_URL}` : PUBLIC_SITE_URL;
  const homeLogo = new URL('../gallery/logo/2.png', import.meta.url).href;
  const copy = MAP_COPY[language] || MAP_COPY.en;

  return (
    <div className="dunex-site profiles-map-page">
      <header className="site-header">
        <nav className="top-nav solid profiles-top-nav">
          <a href={homePageUrl} className="brand brand-with-logo">
            <img className="brand-logo" src={homeLogo} alt="EOEX logo" />
            <span className="brand-tagline">The Elegance of Excellence</span>
          </a>
          <div className="profiles-top-tools">
            <div className="profiles-language-switch" aria-label={copy.language}>
              <span className="profiles-language-label">{copy.language}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                {PAGE_LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.short} · {item.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="profiles-tag">{copy.mapTag}</span>
          </div>
        </nav>
      </header>

      <main className="section profiles-main">
        <div className="section-heading reveal is-visible">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
        </div>

        <section className="profiles-routes" aria-label="Profile page routes">
          {PROFILE_ROUTES.map((profile) => {
            const href = `${homePageUrl}profiles/${profile.slug}`;
            const canonicalRole = getProfileRoleLabel(profile.id, language);
            const roleSummary = getProfileRoleSummary(profile.id, language);

            return (
              <article key={profile.slug} className="profiles-route-card profile-card">
                <h3>{canonicalRole}</h3>
                <p className="profile-description">{roleSummary}</p>
                <a href={href} target="_blank" rel="noreferrer">{copy.openProfile}</a>
              </article>
            );
          })}
        </section>

        <section className="profiles-url-table-shell" aria-label="All profiles URL table">
          <div className="profiles-table-header">
            <h3>{copy.profileRoutesTitle} · 62</h3>
            <p>{copy.routeLabel}: {homePageUrl}profiles/profile-1 ... profile-62</p>
          </div>

          <div className="profiles-url-table-wrap">
            <table className="profiles-url-table">
              <thead>
                <tr>
                  <th>{copy.profileLabel}</th>
                  <th>{copy.roleLabel}</th>
                  <th>{copy.routeLabel}</th>
                </tr>
              </thead>
              <tbody>
                {ALL_PROFILE_IDS.map((profileId) => {
                  const href = `${homePageUrl}profiles/profile-${profileId}`;
                  const roleLabel = getProfileRoleLabel(profileId, language);
                  return (
                    <tr key={`table-profile-${profileId}`}>
                      <td>Profile {profileId}</td>
                      <td>{roleLabel}</td>
                      <td>
                        <a href={href} target="_blank" rel="noreferrer">{href}</a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand-block">
            <a href={homePageUrl} className="brand brand-with-logo" onClick={(event) => {
              event.preventDefault();
              window.location.assign(homePageUrl);
            }}>
              <img className="brand-logo" src={homeLogo} alt="EOEX logo" />
              <span className="brand-tagline">The Elegance of Excellence</span>
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
          <span> © {new Date().getFullYear()} EOEX. {copy.footer.legal}</span>
        </small>
      </footer>
    </div>
  );
}
