import React, { useEffect, useMemo, useState } from 'react';
import './LandingPage-base.css';
import './LandingPage.css';

const LANGUAGES = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'fr', short: 'FR', name: 'Français' },
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'it', short: 'IT', name: 'Italiano' },
  { code: 'pt', short: 'PT', name: 'Português' },
  { code: 'de', short: 'DE', name: 'Deutsch' },
];

const LANDING_COPY = {
  en: {
    locale: 'en-US',
    languageBanner: 'Language',
    toggleMenu: 'Toggle menu',
    brandTagline: 'The Elegance of Excellence',
    nav: { why: 'WHY YOU', promise: 'OUR PROMISE', join: 'JOIN US' },
    footer: {
      about: 'ABOUT',
      masterclasses: 'MASTERCLASSES',
      contact: 'CONTACT',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
    },
    hero: {
      eyebrow: 'YOUR DIFFERENCE MAKES THE DIFFERENCE',
      title: 'YOUR DIFFERENCE MAKES THE DIFFERENCE',
      subtitle: '',
      cta: 'DISCOVER MORE',
    },
    promiseHeading: { eyebrow: 'Our Promise', title: 'Our mission is to be an educational bridge between creators and talents.' },
    rows: [
      {
        title: 'The bridge between the two worlds',
        body:
          'EOEX exists to close the silent distance between fashion decision-makers and the talent they rely on. We translate hidden expectations into practical preparation, giving brands more confidence, giving models more clarity, and turning industry mystery into disciplined momentum.',
      },
      {
        title: 'A shared standard for every stakeholder',
        body:
          'We build a common language across brands, agencies, educators, publishers, and emerging talent, so each participant can enter the room better prepared, better understood, and better positioned to contribute lasting value to the fashion ecosystem.',
      },
      {
        title: 'Guidance shaped to each professional context',
        body:
          'From runway discipline to rights management, from visual identity to production etiquette, EOEX frames guidance in the context where it matters most. The result is support that feels precise, actionable, and worthy of a high-standard industry.',
      },
      {
        title: 'Agency support that protects ambition',
        body:
          'EOEX gives our community a support layer that is both elegant and rigorous: education, publishing, opportunity mapping, and strategic protection. We help talent and partners grow without sacrificing dignity, professionalism, or long-term control.',
      },
    ],
    discoverMore: 'DISCOVER MORE',
    join: {
      eyebrow: 'Join Us',
      title: 'Publishing, masterclasses, and so much more.',
      magazineTitle: 'EOEX Magazine',
      magazineSubtitle: 'Milan Fashion Week 2026',
      masterclassesTitle: 'Masterclass Recruitment',
      masterclassesSubtitle: 'Multi-city workshops to enter the EOEX ecosystem.',
      socialsTitle: 'Instagram',
      socialsSubtitle: 'Follow the studio and publishing desks.',
      backHome: 'RETURN TO MAIN SITE',
      backHomeCaption: 'Use the main EOEX site for the full public experience and current agency navigation.',
    },
    schedule: [
      { cityKey: 'lyon', city: 'Lyon', date: '22nd & 23rd August' },
      { cityKey: 'bruxelles', city: 'Bruxelles', date: '29th & 30th August' },
      { cityKey: 'grenoble', city: 'Grenoble', date: '5th & 6th September' },
      { cityKey: 'paris', city: 'Paris', date: '12th & 13th September' },
      { cityKey: 'lausanne', city: 'Lausanne', date: '17th & 18th September' },
      { cityKey: 'milan', city: 'Milan', date: '19th & 20th September' },
    ],
  },
  fr: {
    locale: 'fr-FR',
    languageBanner: 'Langue',
    toggleMenu: 'Basculer le menu',
    brandTagline: "L'elegance de l'excellence",
    nav: { why: 'POURQUOI VOUS', promise: 'NOTRE PROMESSE', join: 'REJOIGNEZ-NOUS' },
    hero: {
      eyebrow: 'VOTRE DIFFÉRENCE FAIT LA DIFFÉRENCE',
      title: 'VOTRE DIFFÉRENCE FAIT LA DIFFÉRENCE',
      subtitle: '',
      cta: 'DISCOVER MORE',
    },
    promiseHeading: { eyebrow: 'Notre Promesse', title: 'Notre mission est d être un pont éducatif entre créateurs et talents.' },
    rows: [
      {
        title: 'Le pont entre deux mondes',
        body:
          'EOEX reduit la distance silencieuse entre les decideurs de la mode et les talents sur lesquels ils comptent. Nous transformons les attentes implicites en preparation concrete afin d offrir plus de confiance aux marques et plus de clarte aux modeles.',
      },
      {
        title: 'Un niveau commun pour chaque acteur',
        body:
          'Nous construisons un langage partage entre marques, agences, editeurs, formateurs et nouveaux talents afin que chacun entre dans la piece avec plus de preparation, plus de precision et une vraie valeur a apporter.',
      },
      {
        title: 'Un accompagnement adapte a chaque contexte',
        body:
          'Du runway a la gestion des droits, de l image a l etiquette de production, EOEX propose un accompagnement pense pour le contexte reel de chaque acteur. Le resultat est precis, utile et digne d une industrie d excellence.',
      },
      {
        title: 'Un soutien d agence qui protege l ambition',
        body:
          'EOEX offre a sa communaute une structure d appui elegante et rigoureuse: education, edition, mise en relation et protection strategique. Nous aidons chacun a grandir sans sacrifier sa dignite ni sa maitrise du long terme.',
      },
    ],
    discoverMore: 'DISCOVER MORE',
    join: {
      eyebrow: 'Rejoignez-Nous',
      title: 'Edition, masterclasses et bien plus encore.',
      magazineTitle: 'EOEX Magazine',
      magazineSubtitle: 'Milan Fashion Week 2026',
      masterclassesTitle: 'Recrutement Masterclass',
      masterclassesSubtitle: 'Ateliers multi-villes pour entrer dans l ecosysteme EOEX.',
      socialsTitle: 'Instagram',
      socialsSubtitle: 'Suivez le studio et le pole publishing.',
      backHome: 'RETOUR AU SITE PRINCIPAL',
      backHomeCaption: 'Le site principal EOEX donne acces a l experience publique complete et a la navigation actuelle.',
    },
    schedule: [
      { cityKey: 'lyon', city: 'Lyon', date: '22 et 23 aout' },
      { cityKey: 'bruxelles', city: 'Bruxelles', date: '29 et 30 aout' },
      { cityKey: 'grenoble', city: 'Grenoble', date: '5 et 6 septembre' },
      { cityKey: 'paris', city: 'Paris', date: '12 et 13 septembre' },
      { cityKey: 'lausanne', city: 'Lausanne', date: '17 et 18 septembre' },
      { cityKey: 'milan', city: 'Milan', date: '19 et 20 septembre' },
    ],
  },
  es: {
    locale: 'es-ES',
    languageBanner: 'Idioma',
    toggleMenu: 'Mostrar menu',
    brandTagline: 'La elegancia de la excelencia',
    nav: { why: 'POR QUE TU', promise: 'NUESTRA PROMESA', join: 'UNETE' },
    hero: {
      eyebrow: 'TU DIFERENCIA MARCA LA DIFERENCIA',
      title: 'TU DIFERENCIA MARCA LA DIFERENCIA',
      subtitle: '',
      cta: 'DISCOVER MORE',
    },
    promiseHeading: { eyebrow: 'Nuestra Promesa', title: 'Nuestra misión es ser un puente educativo entre creadores y talentos.' },
    rows: [
      {
        title: 'El puente entre dos mundos',
        body:
          'EOEX reduce la distancia silenciosa entre quienes toman decisiones en moda y el talento que sostiene esa vision. Convertimos expectativas ocultas en preparacion real para que las marcas ganen confianza y las modelos entren con claridad y direccion.',
      },
      {
        title: 'Un estandar compartido para toda la comunidad',
        body:
          'Construimos un lenguaje comun entre marcas, agencias, editoriales, educadores y nuevos talentos para que cada parte llegue mejor preparada, mejor comprendida y con una contribucion mas solida al ecosistema de la moda.',
      },
      {
        title: 'Orientacion precisa para cada contexto profesional',
        body:
          'Desde disciplina de pasarela hasta derechos de imagen, desde identidad visual hasta modales de produccion, EOEX ofrece una guia adaptada al contexto donde cada decision realmente importa.',
      },
      {
        title: 'Apoyo de agencia que protege la ambicion',
        body:
          'EOEX ofrece una capa de apoyo elegante y rigurosa: educacion, publicacion, mapeo de oportunidades y proteccion estrategica. Ayudamos a crecer sin renunciar a la dignidad ni al control de largo plazo.',
      },
    ],
    discoverMore: 'DISCOVER MORE',
    join: {
      eyebrow: 'Unete',
      title: 'Publicación, masterclasses y mucho más.',
      magazineTitle: 'EOEX Magazine',
      magazineSubtitle: 'Milan Fashion Week 2026',
      masterclassesTitle: 'Reclutamiento Masterclass',
      masterclassesSubtitle: 'Talleres en varias ciudades para entrar al ecosistema EOEX.',
      socialsTitle: 'Instagram',
      socialsSubtitle: 'Sigue al estudio y a la division editorial.',
      backHome: 'VOLVER AL SITIO PRINCIPAL',
      backHomeCaption: 'El sitio principal de EOEX ofrece la experiencia publica completa y la navegacion oficial.',
    },
    schedule: [
      { cityKey: 'lyon', city: 'Lyon', date: '22 y 23 de agosto' },
      { cityKey: 'bruxelles', city: 'Bruxelles', date: '29 y 30 de agosto' },
      { cityKey: 'grenoble', city: 'Grenoble', date: '5 y 6 de septiembre' },
      { cityKey: 'paris', city: 'Paris', date: '12 y 13 de septiembre' },
      { cityKey: 'lausanne', city: 'Lausanne', date: '17 y 18 de septiembre' },
      { cityKey: 'milan', city: 'Milan', date: '19 y 20 de septiembre' },
    ],
  },
  it: {
    locale: 'it-IT',
    languageBanner: 'Lingua',
    toggleMenu: 'Apri menu',
    brandTagline: "L'eleganza dell'eccellenza",
    nav: { why: 'PERCHE TU', promise: 'LA NOSTRA PROMESSA', join: 'UNISCITI' },
    hero: {
      eyebrow: 'LA TUA DIFFERENZA FA LA DIFFERENZA',
      title: 'LA TUA DIFFERENZA FA LA DIFFERENZA',
      subtitle: '',
      cta: 'DISCOVER MORE',
    },
    promiseHeading: { eyebrow: 'La Nostra Promessa', title: 'La nostra missione e essere un ponte educativo tra creatori e talenti.' },
    rows: [
      {
        title: 'Il ponte tra due mondi',
        body:
          'EOEX riduce la distanza silenziosa tra i decisori della moda e i talenti da cui dipende l intera filiera creativa. Trasformiamo aspettative implicite in preparazione concreta, cosi brand e modelle lavorano con maggiore chiarezza e fiducia.',
      },
      {
        title: 'Uno standard condiviso per tutta la comunita',
        body:
          'Costruiamo un linguaggio comune tra brand, agenzie, editoria, formazione e nuovi talenti affinche ogni stakeholder entri nello spazio professionale con maggiore preparazione, precisione e valore.',
      },
      {
        title: 'Guida professionale nel contesto giusto',
        body:
          'Dalla disciplina di passerella ai diritti di immagine, dall identita visiva alle dinamiche di produzione, EOEX offre indicazioni pensate per il contesto reale in cui ogni decisione conta davvero.',
      },
      {
        title: 'Supporto d agenzia che tutela l ambizione',
        body:
          'EOEX offre una struttura di supporto elegante ma rigorosa: educazione, publishing, mappatura delle opportunita e protezione strategica. Aiutiamo la comunita a crescere senza perdere dignita, controllo e prospettiva a lungo termine.',
      },
    ],
    discoverMore: 'DISCOVER MORE',
    join: {
      eyebrow: 'Unisciti',
      title: 'Publishing, masterclass e molto altro.',
      magazineTitle: 'EOEX Magazine',
      magazineSubtitle: 'Milan Fashion Week 2026',
      masterclassesTitle: 'Reclutamento Masterclass',
      masterclassesSubtitle: 'Workshop in piu citta per entrare nell ecosistema EOEX.',
      socialsTitle: 'Instagram',
      socialsSubtitle: 'Segui lo studio e il dipartimento publishing.',
      backHome: 'TORNA AL SITO PRINCIPALE',
      backHomeCaption: 'Il sito principale EOEX resta il punto di accesso alla navigazione pubblica completa.',
    },
    schedule: [
      { cityKey: 'lyon', city: 'Lyon', date: '22 e 23 agosto' },
      { cityKey: 'bruxelles', city: 'Bruxelles', date: '29 e 30 agosto' },
      { cityKey: 'grenoble', city: 'Grenoble', date: '5 e 6 settembre' },
      { cityKey: 'paris', city: 'Paris', date: '12 e 13 settembre' },
      { cityKey: 'lausanne', city: 'Lausanne', date: '17 e 18 settembre' },
      { cityKey: 'milan', city: 'Milan', date: '19 e 20 settembre' },
    ],
  },
  pt: {
    locale: 'pt-PT',
    languageBanner: 'Idioma',
    toggleMenu: 'Abrir menu',
    brandTagline: 'A elegancia da excelencia',
    nav: { why: 'PORQUE TU', promise: 'A NOSSA PROMESSA', join: 'JUNTA-TE' },
    hero: {
      eyebrow: 'A TUA DIFERENÇA FAZ A DIFERENÇA',
      title: 'A TUA DIFERENÇA FAZ A DIFERENÇA',
      subtitle: '',
      cta: 'DISCOVER MORE',
    },
    promiseHeading: { eyebrow: 'A Nossa Promessa', title: 'A nossa missão é ser uma ponte educativa entre criadores e talentos.' },
    rows: [
      {
        title: 'A ponte entre dois mundos',
        body:
          'A EOEX reduz a distancia silenciosa entre quem decide no setor da moda e o talento que sustenta essa visao. Transformamos expectativas escondidas em preparacao concreta para dar mais clareza aos modelos e mais confianca aos parceiros.',
      },
      {
        title: 'Um padrao comum para toda a comunidade',
        body:
          'Construimos uma linguagem partilhada entre marcas, agencias, publishing, educacao e novos talentos para que cada parte entre no espaco profissional melhor preparada, melhor compreendida e pronta para gerar valor duradouro.',
      },
      {
        title: 'Orientacao certa para cada contexto',
        body:
          'Da disciplina de passarela aos direitos de imagem, da identidade visual ao protocolo de producao, a EOEX oferece orientacao pensada para o contexto real onde cada decisao tem consequencia.',
      },
      {
        title: 'Suporte de agencia que protege a ambicao',
        body:
          'A EOEX acrescenta uma camada de apoio elegante e rigorosa: educacao, publishing, mapeamento de oportunidades e protecao estrategica. Ajudamos a crescer sem abdicar da dignidade nem do controlo a longo prazo.',
      },
    ],
    discoverMore: 'DISCOVER MORE',
    join: {
      eyebrow: 'Junta-Te',
      title: 'Publishing, masterclasses e muito mais.',
      magazineTitle: 'EOEX Magazine',
      magazineSubtitle: 'Milan Fashion Week 2026',
      masterclassesTitle: 'Recrutamento Masterclass',
      masterclassesSubtitle: 'Workshops em varias cidades para entrar no ecossistema EOEX.',
      socialsTitle: 'Instagram',
      socialsSubtitle: 'Segue o estudio e a divisao publishing.',
      backHome: 'VOLTAR AO SITE PRINCIPAL',
      backHomeCaption: 'O site principal da EOEX continua a oferecer a experiencia publica completa.',
    },
    schedule: [
      { cityKey: 'lyon', city: 'Lyon', date: '22 e 23 de agosto' },
      { cityKey: 'bruxelles', city: 'Bruxelles', date: '29 e 30 de agosto' },
      { cityKey: 'grenoble', city: 'Grenoble', date: '5 e 6 de setembro' },
      { cityKey: 'paris', city: 'Paris', date: '12 e 13 de setembro' },
      { cityKey: 'lausanne', city: 'Lausanne', date: '17 e 18 de setembro' },
      { cityKey: 'milan', city: 'Milan', date: '19 e 20 de setembro' },
    ],
  },
  de: {
    locale: 'de-DE',
    languageBanner: 'Sprache',
    toggleMenu: 'Menu umschalten',
    brandTagline: 'Die Eleganz der Exzellenz',
    nav: { why: 'WARUM SIE', promise: 'UNSER VERSPRECHEN', join: 'MIT UNS' },
    hero: {
      eyebrow: 'DEIN UNTERSCHIED MACHT DEN UNTERSCHIED',
      title: 'DEIN UNTERSCHIED MACHT DEN UNTERSCHIED',
      subtitle: '',
      cta: 'DISCOVER MORE',
    },
    promiseHeading: { eyebrow: 'Unser Versprechen', title: 'Unsere Mission ist es, eine Bildungsbrücke zwischen Kreativen und Talenten zu sein.' },
    rows: [
      {
        title: 'Die Brucke zwischen zwei Welten',
        body:
          'EOEX uberbruckt die stille Distanz zwischen den Entscheidungstragern der Mode und dem Talent, auf das diese Industrie angewiesen ist. Wir machen unausgesprochene Erwartungen greifbar und ubersetzen sie in reale Vorbereitung und professionelle Sicherheit.',
      },
      {
        title: 'Ein gemeinsamer Standard fur alle Beteiligten',
        body:
          'Wir schaffen eine gemeinsame Sprache fur Marken, Agenturen, Bildung, Publishing und neue Talente, damit jede Partei besser vorbereitet, besser verstanden und mit klarerem Mehrwert in den Raum tritt.',
      },
      {
        title: 'Professionelle Fuhrung im richtigen Kontext',
        body:
          'Von Laufstegdisziplin uber Bildrechte bis zu visueller Identitat und Produktionsetikette bietet EOEX Orientierung, die exakt auf den jeweiligen professionellen Kontext zugeschnitten ist.',
      },
      {
        title: 'Agenturunterstutzung, die Ambition schutzt',
        body:
          'EOEX bietet eine elegante und strenge Schutzschicht aus Bildung, Publishing, Opportunity Mapping und strategischer Begleitung. So kann unsere Gemeinschaft wachsen, ohne Wurde, Sicherheit oder langfristige Kontrolle aufzugeben.',
      },
    ],
    discoverMore: 'DISCOVER MORE',
    join: {
      eyebrow: 'Mit Uns',
      title: 'Publishing, Masterclasses und vieles mehr.',
      magazineTitle: 'EOEX Magazine',
      magazineSubtitle: 'Milan Fashion Week 2026',
      masterclassesTitle: 'Masterclass Recruitment',
      masterclassesSubtitle: 'Workshops in mehreren Städten für den Einstieg ins EOEX Ökosystem.',
      socialsTitle: 'Instagram',
      socialsSubtitle: 'Folgen Sie dem Studio und dem Publishing Desk.',
      backHome: 'ZURÜCK ZUR HAUPTSEITE',
      backHomeCaption: 'Die EOEX Hauptseite bleibt der offizielle Zugang zur vollständigen öffentlichen Website.',
    },
    schedule: [
      { cityKey: 'lyon', city: 'Lyon', date: '22. und 23. August' },
      { cityKey: 'bruxelles', city: 'Bruxelles', date: '29. und 30. August' },
      { cityKey: 'grenoble', city: 'Grenoble', date: '5. und 6. September' },
      { cityKey: 'paris', city: 'Paris', date: '12. und 13. September' },
      { cityKey: 'lausanne', city: 'Lausanne', date: '17. und 18. September' },
      { cityKey: 'milan', city: 'Milan', date: '19. und 20. September' },
    ],
  },
};

const HERO_VIDEO_MAP = import.meta.glob('../gallery/models/*.{mp4,mov,webm,m4v}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const PROMISE_ROW_MEDIA_MAPS = [
  import.meta.glob('../gallery/fashion/1/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }),
  import.meta.glob('../gallery/fashion/2/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }),
  import.meta.glob('../gallery/fashion/3/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }),
  import.meta.glob('../gallery/fashion/4/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' }),
];

const MAGAZINE_COVER_MAP = import.meta.glob('../gallery/fashion/magazines/aug6/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const sortedAssets = (assetMap) =>
  Object.entries(assetMap)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, url]) => url);

function assetFromGallery(path) {
  return new URL(`../gallery/${path}`, import.meta.url).href;
}

function ImageCarouselCard({ images, altPrefix }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, [images]);

  return (
    <div className="promise-card image-carousel-card reveal">
      {images.map((image, index) => (
        <div key={image} className={`image-carousel-slide ${index === activeIndex ? 'is-active' : ''}`}>
          <img src={image} alt={`${altPrefix} ${index + 1}`} loading="lazy" decoding="async" />
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('why-you');
  const [heroVideoIndex, setHeroVideoIndex] = useState(0);

  const copy = LANDING_COPY[language] || LANDING_COPY.en;
  const homeHref = import.meta.env.BASE_URL;
  const logoSrc = assetFromGallery('logo/2.png');
  const footerCopy = copy.footer || LANDING_COPY.en.footer;
  const currentLocation = typeof window !== 'undefined' ? window.location : null;
  const homePageUrl = currentLocation ? `${currentLocation.origin}${import.meta.env.BASE_URL}` : import.meta.env.BASE_URL;
  const heroVideos = useMemo(() => sortedAssets(HERO_VIDEO_MAP), []);
  const promiseRowImages = useMemo(() => PROMISE_ROW_MEDIA_MAPS.map((assetMap) => sortedAssets(assetMap)), []);
  const magazineCover = useMemo(() => sortedAssets(MAGAZINE_COVER_MAP)[0] || '', []);
  const kioskIssues = useMemo(
    () => Array.from({ length: 9 }, (_, index) => ({ id: `issue-${index + 1}`, cover: magazineCover })),
    [magazineCover],
  );

  const promiseRows = useMemo(
    () => copy.rows.map((row, index) => ({ ...row, images: promiseRowImages[index] || [] })),
    [copy, promiseRowImages],
  );

  const currentMonthLabel = useMemo(
    () => new Intl.DateTimeFormat(copy.locale, { month: 'long', year: 'numeric' }).format(new Date()),
    [copy.locale],
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (heroVideos.length < 2) return undefined;
    const interval = window.setInterval(() => {
      setHeroVideoIndex((current) => (current + 1) % heroVideos.length);
    }, 8500);
    return () => window.clearInterval(interval);
  }, [heroVideos.length]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['why-you', 'our-promise', 'join-us'];
      const midpoint = window.scrollY + window.innerHeight * 0.28 + 88;

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (!section) continue;
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (midpoint >= top && midpoint < bottom) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [language]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const heroVideo = heroVideos[heroVideoIndex] || heroVideos[0] || '';

  return (
    <div className="dunex-site landing-page">
      <header className="site-header">
        <nav className={`top-nav ${activeSection !== 'why-you' ? 'solid' : ''}`}>
          <a
            href={homeHref}
            className="brand brand-with-logo"
          >
            <img className="brand-logo" src={logoSrc} alt="EOEX logo" />
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
            {[
              ['why-you', copy.nav.why],
              ['our-promise', copy.nav.promise],
              ['join-us', copy.nav.join],
            ].map(([id, label]) => (
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
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section id="why-you" className="hero-section">
          <div className="hero-overlay" />
          <div className="hero-content landing-hero-shell">
            <div className="top-carousel hero-carousel reveal is-visible" aria-label={copy.hero.title}>
              <div className="top-carousel-frame">
                <video className="landing-carousel-video" key={heroVideo} autoPlay muted loop playsInline preload="metadata" src={heroVideo} />
                <div className="carousel-overlay">
                  <p className="kicker landing-eyebrow reveal is-visible">{copy.hero.eyebrow}</p>
                  <h1 className="reveal is-visible">EOEX</h1>
                  <button className="cta-button reveal is-visible" type="button" onClick={() => scrollToSection('our-promise')}>
                    {copy.hero.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="our-promise" className="section promise-section">
          <div className="section-heading reveal">
            <p className="eyebrow">{copy.promiseHeading.eyebrow}</p>
            <h2>{copy.promiseHeading.title}</h2>
          </div>

          <div className="promise-stack">
            {promiseRows.map((row, index) => {
              const reversed = index % 2 === 1;
              return (
                <div key={row.title} className={`promise-row ${reversed ? 'is-reversed' : ''}`}>
                  <div className="promise-media">
                    <ImageCarouselCard images={row.images} altPrefix={row.title} />
                  </div>
                  <article className="promise-card promise-copy reveal">
                    <h3>{row.title}</h3>
                    <p>{row.body}</p>
                    <button type="button" className="promise-cta" onClick={() => scrollToSection('join-us')}>
                      {copy.discoverMore}
                    </button>
                  </article>
                </div>
              );
            })}
          </div>
        </section>

        <section id="join-us" className="section join-section">
          <div className="section-heading reveal">
            <p className="eyebrow">{copy.join.eyebrow}</p>
            <h2>{copy.join.title}</h2>
          </div>

          <div className="join-grid">
            <article className="join-card reveal">
              <div className="magazine-frame">
                <img src={magazineCover} alt={copy.join.magazineTitle} loading="lazy" decoding="async" />
              </div>
              <div className="magazine-caption">
                <h3>{copy.join.magazineTitle} {currentMonthLabel}</h3>
                <p>{copy.join.magazineSubtitle}</p>
              </div>
            </article>

            <article className="join-card reveal kiosk-grid-card">
              <p className="eyebrow">Kiosk</p>
              <h3>EOEX Digital Issues</h3>
              <div className="kiosk-issues-grid">
                {kioskIssues.map((issue) => (
                  <article key={issue.id} className="kiosk-issue-tile">
                    <img src={issue.cover} alt={`${copy.join.magazineTitle} ${issue.id}`} loading="lazy" decoding="async" />
                  </article>
                ))}
              </div>
            </article>

            <article className="join-card reveal join-masterclass-row">
              <p className="eyebrow">{copy.join.masterclassesTitle}</p>
              <h3>{copy.join.masterclassesSubtitle}</h3>
              <div className="masterclass-list">
                {copy.schedule.map((city) => (
                  <div key={city.cityKey} className="masterclass-item">
                    <div>
                      <strong>{city.city}</strong>
                      <span>{city.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
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
              <img className="brand-logo" src={logoSrc} alt="EOEX logo" />
              <span className="brand-tagline">{copy.brandTagline}</span>
            </a>
          </div>

          <ul className="footer-nav-list">
            <li>
              <a href={`${homePageUrl}#about`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#about`);
              }}>
                {footerCopy.about}
              </a>
            </li>
            <li>
              <a href={`${homePageUrl}#masterclasses`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#masterclasses`);
              }}>
                {footerCopy.masterclasses}
              </a>
            </li>
            <li>
              <a href={`${homePageUrl}#contact`} onClick={(event) => {
                event.preventDefault();
                window.location.assign(`${homePageUrl}#contact`);
              }}>
                {footerCopy.contact}
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
          <span> © {new Date().getFullYear()} EOEX. {footerCopy.privacy} · {footerCopy.terms}</span>
        </small>
      </footer>
    </div>
  );
}