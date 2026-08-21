import React, { useEffect, useMemo, useRef, useState } from 'react';
import modelsData from './data/models.json';
import newsData from './data/news.json';
import testimonialsData from './data/testimonials.json';
import runwayHighlightsData from './data/runway-highlights.json';
import './App.css';

const LANGUAGES = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'fr', short: 'FR', name: 'Fran\u00e7ais' },
  { code: 'es', short: 'ES', name: 'Espa\u00f1ol' },
  { code: 'it', short: 'IT', name: 'Italiano' },
  { code: 'pt', short: 'PT', name: 'Portugu\u00eas' },
  { code: 'de', short: 'DE', name: 'Deutsch' },
];

const DICTIONARY = {
  en: {
    locale: 'en-US',
    languageBanner: 'Language',
    skipToMain: 'Skip to main content',
    toggleMenu: 'Toggle menu',
    nav: {
      hero: 'Home',
      about: 'About',
      masterclasses: 'Masterclasses',
      gallery: 'Gallery',
      testimonials: 'Testimonials',
      news: 'News',
      contact: 'Contact',
    },
    brandTagline: 'The Elegance of Excellence',
    hero: {
      aria: 'Featured fashion carousel',
      iframeTitle: 'EOEX featured runway carousel',
      kicker: 'The runway awaits you',
      heading: 'EOEX',
      subheading: 'The Elegance of Excellence',
      copy: 'Ethical representation for the next generation of global fashion talent.',
      cta: 'Discover the Runway',
    },
    about: {
      eyebrow: 'The EOEX Value',
      title: 'The Elegance of Excellence.',
      cards: [
        {
          title: 'Education First',
          description:
            'Every talent starts with real-world fashion literacy: contracts, rights, boundaries, and the business behind the glamour.',
        },
        {
          title: 'Fair Compensation',
          description:
            'EOEX ensures payment for runway, editorial, commercial, and digital placements with transparent earning structures.',
        },
        {
          title: 'No Castings',
          description:
            'We handpick and pre-select talent for aligned opportunities, reducing uncertainty and protecting creative energy.',
        },
        {
          title: 'Mother Agency Model',
          description:
            'Models can collaborate with external agencies while EOEX remains their strategic and legal protection layer.',
        },
        {
          title: 'Masterclass Recruitment',
          description:
            'Entry is earned through intensive city-based workshops assessing aesthetics, coachability, and discipline.',
        },
        {
          title: 'Code of Ethics',
          description:
            'A strict ethics framework governs all stakeholders to maintain dignity, safety, and professional accountability.',
        },
      ],
      stats: ['Cities', 'Runway Shows', '100+ Commercial & Editorial opportunities'],
    },
    masterclasses: {
      eyebrow: 'JOIN US',
      title: '19th & 20th September',
      register: 'REGISTER',
      modalTitle: 'Register for',
      modalName: 'Name',
      modalEmail: 'Email',
      modalPhone: 'Phone',
      modalCity: 'City',
      modalMessage: 'Message',
      modalPlaceholder: 'Tell us about your modelling goals',
      modalSubmit: 'Submit',
      modalClose: 'Close',
      schedule: [
        { city: 'Grenoble', date: '14th & 15th August', venue: 'venue to be confirmed' },
        { city: 'Paris', date: '21st & 22nd August', venue: 'venue to be confirmed' },
        { city: 'Lyon', date: '28th & 29th August', venue: 'venue to be confirmed' },
        { city: 'Madrid', date: '4th & 5th September', venue: 'venue to be confirmed' },
        { city: 'Bruxelles', date: '11th & 12th September', venue: 'venue to be confirmed' },
        { city: 'Milan', date: '18th & 19th September', venue: 'venue to be confirmed' },
      ],
    },
    gallery: {
      eyebrow: 'Model Portfolio',
      title: 'Curated talent across runway, editorial, and commercial work.',
      categoriesAria: 'Model categories',
      filters: {
        All: 'All',
        Runway: 'Runway',
        Editorial: 'Editorial',
        Commercial: 'Commercial',
        'New Faces': 'New Faces',
      },
      viewProfile: 'View Profile',
      closeProfile: 'Close Profile',
      portfolioSuffix: 'portfolio',
      categories: {
        Runway: 'Runway',
        Editorial: 'Editorial',
        Commercial: 'Commercial',
        'New Faces': 'New Faces',
      },
      bios: {
        1: 'Paris-based runway specialist known for couture catwalk precision and editorial versatility.',
        2: 'Campaign-forward model blending natural charisma with high-concept beauty narratives.',
        3: 'Milan-trained talent balancing structured runway movement with adaptable brand storytelling.',
        4: 'Emerging face selected via EOEX masterclass track, praised for expressive visual range.',
        5: 'Athletic runway profile with striking symmetry and disciplined rehearsal ethic.',
        6: 'New generation campaign model delivering clean posing language and approachable impact.',
      },
    },
    testimonials: {
      eyebrow: 'Voices',
      title: 'From models and partner brands.',
      portraitSuffix: 'portrait',
      roles: {
        1: 'Runway Model',
        2: 'Creative Director, Maison Verre',
        3: 'Editorial Model',
      },
      quotes: {
        1: 'EOEX taught me contract clarity before my first international show. That education changed everything.',
        2: 'The talent quality is exceptional, but what stands out is professionalism and ethical structure.',
        3: 'I joined through a masterclass and felt protected from day one, with transparent pay and guidance.',
      },
    },
    news: {
      eyebrow: 'Magazine',
      title: 'Agency updates, model spotlights, and industry intelligence.',
      readMore: 'Read More',
      loadMore: 'Load More',
      comingSoon: 'To be published soon',
      items: {
        1: {
          title: 'EOEX Announces Winter Masterclass Circuit',
          excerpt: 'Seven-city recruitment series opens with expanded mentorship modules and legal literacy sessions.',
        },
        2: {
          title: 'Model Spotlight: The Editorial Rise of Yara Sol',
          excerpt: 'From first workshop to international campaign boards in under six months.',
        },
        3: {
          title: 'Behind the Scenes: Milan Couture Prep',
          excerpt: 'A day inside movement coaching, fittings, and team choreography before show day.',
        },
        4: {
          title: 'Client Briefing: Ethical Booking Framework',
          excerpt: 'How EOEX aligns creative output with safety, transparency, and performance metrics.',
        },
        5: {
          title: 'Paris Team Expands Litigation Support Desk',
          excerpt: 'New dedicated legal intervention channel added to the mother-agency support model.',
        },
        6: {
          title: 'Tokyo Runway Diary from EOEX Alumni',
          excerpt: 'First-person account of pacing, backstage discipline, and campaign opportunities post-show.',
        },
      },
    },
    contact: {
      eyebrow: 'Contact EOEX',
      title: 'Applications, bookings, and press inquiries.',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      inquiryType: 'Inquiry Type',
      inquiryOptions: {
        modelling: 'Modelling Application',
        booking: 'Client Booking',
        press: 'Press',
        general: 'General',
      },
      message: 'Message',
      send: 'Send Message',
      hq: 'EOEX Headquarters',
      address: '44 Rue du Faubourg Saint-Honore, Paris',
      mapTitle: 'EOEX map',
    },
    footer: {
      about: 'About',
      masterclasses: 'Masterclasses',
      contact: 'Contact',
      newsletter: 'Newsletter',
      subscribe: 'Subscribe',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      emailPlaceholder: 'you@example.com',
    },
  },
  fr: {
    locale: 'fr-FR',
    languageBanner: 'Langue',
    skipToMain: 'Aller au contenu principal',
    toggleMenu: 'Basculer le menu',
    nav: {
      hero: 'Accueil',
      about: '\u00c0 propos',
      masterclasses: 'Masterclasses',
      gallery: 'Galerie',
      videos: 'Vid\u00e9os',
      testimonials: 'T\u00e9moignages',
      news: 'Actualit\u00e9s',
      contact: 'Contact',
    },
    brandTagline: "L'\u00e9l\u00e9gance de l'excellence",
    hero: {
      aria: 'Carrousel mode en vedette',
      iframeTitle: 'Carrousel podium EOEX',
      kicker: 'Le podium vous attend',
      heading: 'EOEX',
      subheading: "L'\u00e9l\u00e9gance de l'excellence",
      copy: 'Repr\u00e9sentation \u00e9thique pour la nouvelle g\u00e9n\u00e9ration de talents de la mode mondiale.',
      cta: 'D\u00e9couvrir le Podium',
    },
    about: {
      eyebrow: 'La Valeur EOEX',
      title: "L'\u00e9l\u00e9gance de l'excellence.",
      cards: [
        {
          title: '\u00c9ducation Avant Tout',
          description:
            'Chaque talent commence par une vraie culture mode: contrats, droits, limites et \u00e9conomie du secteur.',
        },
        {
          title: 'R\u00e9mun\u00e9ration \u00c9quitable',
          description:
            'EOEX garantit une r\u00e9mun\u00e9ration transparente pour le podium, l\'\u00e9ditorial, le commercial et le digital.',
        },
        {
          title: 'Sans Castings',
          description:
            'Nous pr\u00e9s\u00e9lectionnons les talents pour des opportunit\u00e9s align\u00e9es, avec moins d\'incertitude et plus de protection.',
        },
        {
          title: 'Mod\u00e8le Mother Agency',
          description: 'Les mod\u00e8les peuvent collaborer avec d\'autres agences, EOEX restant leur protection strat\u00e9gique et l\u00e9gale.',
        },
        {
          title: 'Recrutement Masterclass',
          description:
            'L\'entr\u00e9e se m\u00e9rite via des ateliers intensifs qui \u00e9valuent esth\u00e9tique, coachabilit\u00e9 et discipline.',
        },
        {
          title: 'Code \u00c9thique',
          description:
            'Un cadre \u00e9thique strict garantit dignit\u00e9, s\u00e9curit\u00e9 et responsabilit\u00e9 professionnelle pour toutes les parties.',
        },
      ],
      stats: ['Villes', 'D\u00e9fil\u00e9s', '100+ Opportunit\u00e9s commerciales et \u00e9ditoriales'],
    },
    masterclasses: {
      eyebrow: 'Recrutement Masterclass',
      title: 'Ateliers multi-villes pour int\u00e9grer l\'\u00e9cosyst\u00e8me EOEX.',
      register: 'S\'inscrire',
      modalTitle: 'S\'inscrire \u00e0',
      modalName: 'Nom',
      modalEmail: 'E-mail',
      modalPhone: 'T\u00e9l\u00e9phone',
      modalCity: 'Ville',
      modalMessage: 'Message',
      modalPlaceholder: 'Parlez-nous de vos objectifs de mannequinat',
      modalSubmit: 'Envoyer',
      modalClose: 'Fermer',
      schedule: [
        { city: 'Grenoble', date: '14 et 15 ao\u00fbt', venue: 'lieu \u00e0 confirmer' },
        { city: 'Paris', date: '21 et 22 ao\u00fbt', venue: 'lieu \u00e0 confirmer' },
        { city: 'Lyon', date: '28 et 29 ao\u00fbt', venue: 'lieu \u00e0 confirmer' },
        { city: 'Madrid', date: '4 et 5 septembre', venue: 'lieu \u00e0 confirmer' },
        { city: 'Bruxelles', date: '11 et 12 septembre', venue: 'lieu \u00e0 confirmer' },
        { city: 'Milan', date: '18 et 19 septembre', venue: 'lieu \u00e0 confirmer' },
      ],
    },
    gallery: {
      eyebrow: 'Portfolio Modeles',
      title: 'Talents s\u00e9lectionn\u00e9s pour podium, \u00e9ditorial et commercial.',
      categoriesAria: 'Cat\u00e9gories de mod\u00e8les',
      filters: { All: 'Tout', Runway: 'Podium', Editorial: 'Editorial', Commercial: 'Commercial', 'New Faces': 'Nouveaux Visages' },
      viewProfile: 'Voir le Profil',
      closeProfile: 'Fermer le Profil',
      portfolioSuffix: 'portfolio',
      categories: { Runway: 'Podium', Editorial: 'Editorial', Commercial: 'Commercial', 'New Faces': 'Nouveaux Visages' },
      bios: {
        1: 'Specialiste podium basee a Paris, reconnue pour sa precision couture et sa polyvalence editoriale.',
        2: 'Modele orientee campagnes, alliant charisme naturel et narrations beaute conceptuelles.',
        3: 'Talent forme a Milan, entre mouvement podium structure et storytelling de marque adaptable.',
        4: 'Nouveau visage issu des masterclasses EOEX, salue pour son expressivite visuelle.',
        5: 'Profil athletique de podium, symetrie marquante et discipline exemplaire en repetition.',
        6: 'Modele campagne nouvelle generation, pose claire et impact accessible.',
      },
    },
    videos: {
      eyebrow: 'Moments de Podium',
      title: 'Moments cin\u00e9matographiques des d\u00e9fil\u00e9s, coulisses et t\u00e9moignages.',
      pauseAria: 'Mettre en pause la vid\u00e9o',
      playAria: 'Lire la vid\u00e9o',
      pause: 'Pause',
      play: 'Lire',
      next: 'Clip Suivant',
      progressAria: 'Progression video',
      titles: { v1: 'Ouverture du Podium Paris', v2: 'Atelier en Coulisses', v3: 'Test de Mouvement Editorial' },
    },
    testimonials: {
      eyebrow: 'Voix',
      title: 'Mod\u00e8les et marques partenaires.',
      portraitSuffix: 'portrait',
      roles: { 1: 'Modele Podium', 2: 'Directeur Creatif, Maison Verre', 3: 'Modele Editoriale' },
      quotes: {
        1: 'EOEX m a appris la clarte contractuelle avant mon premier defile international. Cette formation a tout change.',
        2: 'La qualite des talents est exceptionnelle, mais ce qui marque, c est le professionnalisme et la structure ethique.',
        3: 'J ai integre via une masterclass et je me suis sentie protegee des le premier jour, avec remuneration transparente.',
      },
    },
    news: {
      eyebrow: 'Magazine',
      title: 'Actualit\u00e9s agence, mod\u00e8les mis en lumi\u00e8re et intelligence sectorielle.',
      readMore: 'Lire Plus',
      loadMore: 'Voir Plus',
      comingSoon: 'A publier bientot',
      items: {
        1: {
          title: 'EOEX annonce le circuit hivernal des masterclasses',
          excerpt: 'Le recrutement sur sept villes s ouvre avec mentorat elargi et sessions de culture juridique.',
        },
        2: {
          title: 'Focus Modele: l ascension editoriale de Yara Sol',
          excerpt: 'Du premier atelier aux campagnes internationales en moins de six mois.',
        },
        3: {
          title: 'Coulisses: preparation couture a Milan',
          excerpt: 'Une journee entre coaching mouvement, essayages et choregraphie avant le defile.',
        },
        4: {
          title: 'Brief Client: cadre de booking ethique',
          excerpt: 'Comment EOEX aligne creation, securite, transparence et performance.',
        },
        5: {
          title: 'L equipe de Paris etend le support contentieux',
          excerpt: 'Nouveau canal d intervention juridique dedie dans le modele mother agency.',
        },
        6: {
          title: 'Journal podium de Tokyo par les alumni EOEX',
          excerpt: 'Recit sur le rythme, la discipline backstage et les opportunites post-defile.',
        },
      },
    },
    contact: {
      eyebrow: 'Contacter EOEX',
      title: 'Candidatures, bookings et demandes presse.',
      name: 'Nom',
      email: 'E-mail',
      subject: 'Sujet',
      inquiryType: 'Type de Demande',
      inquiryOptions: {
        modelling: 'Candidature Mannequin',
        booking: 'Booking Client',
        press: 'Presse',
        general: 'G\u00e9n\u00e9ral',
      },
      message: 'Message',
      send: 'Envoyer le Message',
      hq: 'Si\u00e8ge EOEX',
      address: '44 Rue du Faubourg Saint-Honore, Paris',
      mapTitle: 'Carte EOEX',
    },
    footer: {
      about: '\u00c0 propos',
      masterclasses: 'Masterclasses',
      contact: 'Contact',
      newsletter: 'Newsletter',
      subscribe: 'S\'abonner',
      privacy: 'Politique de Confidentialite',
      terms: 'Conditions d Utilisation',
      emailPlaceholder: 'vous@exemple.com',
    },
  },
  es: {
    locale: 'es-ES',
    languageBanner: 'Idioma',
    skipToMain: 'Ir al contenido principal',
    toggleMenu: 'Mostrar men\u00fa',
    nav: {
      hero: 'Inicio', about: 'Nosotros', masterclasses: 'Masterclasses', gallery: 'Galer\u00eda', videos: 'V\u00eddeos', testimonials: 'Testimonios', news: 'Noticias', contact: 'Contacto',
    },
    brandTagline: 'La elegancia de la excelencia',
    hero: {
      aria: 'Carrusel de moda destacado', iframeTitle: 'Carrusel de pasarela EOEX', kicker: 'La pasarela te espera', heading: 'EOEX', subheading: 'La elegancia de la excelencia', copy: 'Representaci\u00f3n \u00e9tica para la nueva generaci\u00f3n de talento global de moda.', cta: 'Descubrir la Pasarela',
    },
    about: {
      eyebrow: 'El Valor EOEX', title: 'La elegancia de la excelencia.',
      cards: [
        { title: 'Educaci\u00f3n Primero', description: 'Cada talento comienza con alfabetizaci\u00f3n real de moda: contratos, derechos, l\u00edmites y negocio.' },
        { title: 'Compensaci\u00f3n Justa', description: 'EOEX asegura pago transparente para pasarela, editorial, comercial y digital.' },
        { title: 'Sin Castings', description: 'Preseleccionamos talento para oportunidades alineadas, reduciendo incertidumbre.' },
        { title: 'Modelo Mother Agency', description: 'Las modelos colaboran con otras agencias mientras EOEX protege estrategia y legalidad.' },
        { title: 'Reclutamiento Masterclass', description: 'La entrada se gana en talleres intensivos que eval\u00faan est\u00e9tica y disciplina.' },
        { title: 'C\u00f3digo \u00c9tico', description: 'Un marco \u00e9tico estricto mantiene dignidad, seguridad y responsabilidad.' },
      ],
      stats: ['Ciudades', 'Desfiles', '100+ Oportunidades comerciales y editoriales'],
    },
    masterclasses: {
      eyebrow: 'Reclutamiento Masterclass', title: 'Talleres en varias ciudades para entrar al ecosistema EOEX.', register: 'Registrar', modalTitle: 'Registrar en', modalName: 'Nombre', modalEmail: 'Correo', modalPhone: 'Tel\u00e9fono', modalCity: 'Ciudad', modalMessage: 'Mensaje', modalPlaceholder: 'Cu\u00e9ntanos tus metas de modelaje', modalSubmit: 'Enviar', modalClose: 'Cerrar',
      schedule: [
        { city: 'Grenoble', date: '14 y 15 de agosto', venue: 'lugar por confirmar' },
        { city: 'Paris', date: '21 y 22 de agosto', venue: 'lugar por confirmar' },
        { city: 'Lyon', date: '28 y 29 de agosto', venue: 'lugar por confirmar' },
        { city: 'Madrid', date: '4 y 5 de septiembre', venue: 'lugar por confirmar' },
        { city: 'Bruxelles', date: '11 y 12 de septiembre', venue: 'lugar por confirmar' },
        { city: 'Milan', date: '18 y 19 de septiembre', venue: 'lugar por confirmar' },
      ],
    },
    gallery: {
      eyebrow: 'Portfolio de Modelos', title: 'Talento curado para pasarela, editorial y comercial.', categoriesAria: 'Categorias de modelos', filters: { All: 'Todo', Runway: 'Pasarela', Editorial: 'Editorial', Commercial: 'Comercial', 'New Faces': 'Nuevas Caras' }, viewProfile: 'Ver Perfil', closeProfile: 'Cerrar Perfil', portfolioSuffix: 'portfolio', categories: { Runway: 'Pasarela', Editorial: 'Editorial', Commercial: 'Comercial', 'New Faces': 'Nuevas Caras' },
      bios: {
        1: 'Especialista de pasarela en Paris, conocida por precision couture y versatilidad editorial.',
        2: 'Modelo enfocada en campanas, con carisma natural y narrativa visual sofisticada.',
        3: 'Talento formado en Milan, equilibrio entre movimiento de pasarela y storytelling de marca.',
        4: 'Rostro emergente del circuito masterclass EOEX, destacada por su rango expresivo.',
        5: 'Perfil atletico de pasarela con simetria marcada y gran disciplina de ensayo.',
        6: 'Modelo de nueva generacion para campanas, pose limpia e impacto cercano.',
      },
    },
    videos: {
      eyebrow: 'Momentos de Pasarela', title: 'Momentos cinematograficos de desfiles, backstage y testimonios.', pauseAria: 'Pausar video de pasarela', playAria: 'Reproducir video de pasarela', pause: 'Pausar', play: 'Reproducir', next: 'Siguiente Clip', progressAria: 'Progreso del video', titles: { v1: 'Apertura de Pasarela en Paris', v2: 'Atelier en Backstage', v3: 'Prueba de Movimiento Editorial' },
    },
    testimonials: {
      eyebrow: 'Voces', title: 'De modelos y marcas asociadas.', portraitSuffix: 'retrato', roles: { 1: 'Modelo de Pasarela', 2: 'Director Creativo, Maison Verre', 3: 'Modelo Editorial' },
      quotes: {
        1: 'EOEX me ense\u00f1\u00f3 claridad contractual antes de mi primer desfile internacional. Esa formaci\u00f3n lo cambi\u00f3 todo.',
        2: 'La calidad del talento es excepcional, pero destaca su profesionalismo y estructura etica.',
        3: 'Entr\u00e9 por una masterclass y me sent\u00ed protegida desde el primer d\u00eda, con pago transparente y gu\u00eda.',
      },
    },
    news: {
      eyebrow: 'Magazine', title: 'Actualizaciones de agencia, foco en modelos e inteligencia del sector.', readMore: 'Leer M\u00e1s', loadMore: 'Cargar M\u00e1s',
      comingSoon: 'Se publicara pronto',
      items: {
        1: { title: 'EOEX anuncia su circuito invernal de masterclasses', excerpt: 'La serie de reclutamiento en siete ciudades abre con mentoria ampliada y formacion legal.' },
        2: { title: 'Modelo destacada: ascenso editorial de Yara Sol', excerpt: 'Del primer taller a campanas internacionales en menos de seis meses.' },
        3: { title: 'Detras de escena: preparacion couture en Milan', excerpt: 'Un dia entre coaching de movimiento, fittings y coreografia antes del show.' },
        4: { title: 'Briefing cliente: marco etico de booking', excerpt: 'Como EOEX alinea creatividad con seguridad, transparencia y rendimiento.' },
        5: { title: 'El equipo de Paris amplia soporte legal', excerpt: 'Nuevo canal de intervencion juridica dentro del modelo mother agency.' },
        6: { title: 'Diario de pasarela en Tokio de alumni EOEX', excerpt: 'Relato en primera persona sobre ritmo, disciplina backstage y oportunidades post-show.' },
      },
    },
    contact: {
      eyebrow: 'Contacto EOEX', title: 'Postulaciones, reservas y prensa.', name: 'Nombre', email: 'Correo', subject: 'Asunto', inquiryType: 'Tipo de Consulta', inquiryOptions: { modelling: 'Postulacion de Modelaje', booking: 'Reserva de Cliente', press: 'Prensa', general: 'General' }, message: 'Mensaje', send: 'Enviar Mensaje', hq: 'Sede EOEX', address: '44 Rue du Faubourg Saint-Honore, Paris', mapTitle: 'Mapa EOEX',
    },
    footer: {
      about: 'Nosotros', masterclasses: 'Masterclasses', contact: 'Contacto', newsletter: 'Newsletter', subscribe: 'Suscribirse', privacy: 'Pol\u00edtica de Privacidad', terms: 'T\u00e9rminos del Servicio', emailPlaceholder: 'tu@ejemplo.com',
    },
  },
  it: {
    locale: 'it-IT',
    languageBanner: 'Lingua',
    skipToMain: 'Vai al contenuto principale',
    toggleMenu: 'Apri menu',
    nav: { hero: 'Home', about: 'Chi Siamo', masterclasses: 'Masterclass', gallery: 'Galleria', videos: 'Video', testimonials: 'Testimonianze', news: 'News', contact: 'Contatti' },
    brandTagline: "L'eleganza dell'eccellenza",
    hero: { aria: 'Carousel moda in evidenza', iframeTitle: 'Carousel passerella EOEX', kicker: 'La passerella ti aspetta', heading: 'EOEX', subheading: "L'eleganza dell'eccellenza", copy: 'Rappresentanza etica per la nuova generazione di talenti globali della moda.', cta: 'Scopri la Passerella' },
    about: {
      eyebrow: 'Il Valore EOEX', title: "L'eleganza dell'eccellenza.",
      cards: [
        { title: 'Prima l\'Educazione', description: 'Ogni talento inizia con vera cultura moda: contratti, diritti, limiti e business.' },
        { title: 'Compenso Equo', description: 'EOEX garantisce compensi trasparenti per passerella, editoriale, commerciale e digitale.' },
        { title: 'Niente Casting', description: 'Preselezioniamo talenti per opportunit\u00e0 coerenti, riducendo incertezza.' },
        { title: 'Modello Mother Agency', description: 'Le modelle collaborano con agenzie esterne mentre EOEX resta protezione strategica e legale.' },
        { title: 'Reclutamento Masterclass', description: 'L\'ingresso si conquista con workshop intensivi su estetica e disciplina.' },
        { title: 'Codice Etico', description: 'Un quadro etico rigoroso tutela dignit\u00e0, sicurezza e responsabilit\u00e0 professionale.' },
      ],
      stats: ['Citt\u00e0', 'Sfilate', '100+ Opportunit\u00e0 commerciali ed editoriali'],
    },
    masterclasses: { eyebrow: 'Reclutamento Masterclass', title: 'Workshop in pi\u00f9 citt\u00e0 per entrare nell\'ecosistema EOEX.', register: 'Iscriviti', modalTitle: 'Iscriviti a', modalName: 'Nome', modalEmail: 'Email', modalPhone: 'Telefono', modalCity: 'Citt\u00e0', modalMessage: 'Messaggio', modalPlaceholder: 'Parlaci dei tuoi obiettivi nel modeling', modalSubmit: 'Invia', modalClose: 'Chiudi', schedule: [
      { city: 'Grenoble', date: '14 e 15 agosto', venue: 'sede da confermare' },
      { city: 'Paris', date: '21 e 22 agosto', venue: 'sede da confermare' },
      { city: 'Lyon', date: '28 e 29 agosto', venue: 'sede da confermare' },
      { city: 'Madrid', date: '4 e 5 settembre', venue: 'sede da confermare' },
      { city: 'Bruxelles', date: '11 e 12 settembre', venue: 'sede da confermare' },
      { city: 'Milan', date: '18 e 19 settembre', venue: 'sede da confermare' },
    ] },
    gallery: {
      eyebrow: 'Portfolio Modelle', title: 'Talento curato per passerella, editoriale e commerciale.', categoriesAria: 'Categorie modelle', filters: { All: 'Tutte', Runway: 'Passerella', Editorial: 'Editoriale', Commercial: 'Commerciale', 'New Faces': 'Nuovi Volti' }, viewProfile: 'Vedi Profilo', closeProfile: 'Chiudi Profilo', portfolioSuffix: 'portfolio', categories: { Runway: 'Passerella', Editorial: 'Editoriale', Commercial: 'Commerciale', 'New Faces': 'Nuovi Volti' },
      bios: {
        1: 'Specialista passerella con base a Parigi, nota per precisione couture e versatilita editoriale.',
        2: 'Modella orientata alle campagne, con carisma naturale e narrativa beauty ad alto concept.',
        3: 'Talento formato a Milano, equilibrio tra movimento di passerella e storytelling di brand.',
        4: 'Nuovo volto selezionato nel percorso masterclass EOEX, apprezzata per ampiezza espressiva.',
        5: 'Profilo atletico da passerella, simmetria marcata e disciplina nelle prove.',
        6: 'Modella campagna nuova generazione con posa pulita e impatto autentico.',
      },
    },
    videos: { eyebrow: 'Highlights Passerella', title: 'Momenti cinematografici da show, backstage e testimonianze.', pauseAria: 'Metti in pausa il video passerella', playAria: 'Riproduci il video passerella', pause: 'Pausa', play: 'Play', next: 'Clip Successiva', progressAria: 'Progresso video', titles: { v1: 'Apertura Passerella Parigi', v2: 'Backstage Atelier', v3: 'Test Movimento Editoriale' } },
    testimonials: {
      eyebrow: 'Voci', title: 'Da modelle e brand partner.', portraitSuffix: 'ritratto', roles: { 1: 'Modella Passerella', 2: 'Direttore Creativo, Maison Verre', 3: 'Modella Editoriale' },
      quotes: {
        1: 'EOEX mi ha insegnato chiarezza contrattuale prima del mio primo show internazionale. Ha cambiato tutto.',
        2: 'La qualit\u00e0 dei talenti \u00e8 eccezionale, ma spiccano professionalit\u00e0 e struttura etica.',
        3: 'Sono entrata tramite masterclass e mi sono sentita protetta dal primo giorno, con compensi trasparenti.',
      },
    },
    news: {
      eyebrow: 'Magazine', title: 'Aggiornamenti agenzia, spotlight modelle e analisi del settore.', readMore: 'Leggi di Pi\u00f9', loadMore: 'Carica Altro',
      comingSoon: 'Sara pubblicato presto',
      items: {
        1: { title: 'EOEX annuncia il circuito invernale delle masterclass', excerpt: 'La serie di reclutamento in sette citta apre con mentoring esteso e alfabetizzazione legale.' },
        2: { title: 'Model Spotlight: la crescita editoriale di Yara Sol', excerpt: 'Dal primo workshop alle campagne internazionali in meno di sei mesi.' },
        3: { title: 'Dietro le quinte: preparazione couture a Milano', excerpt: 'Una giornata tra coaching di movimento, fitting e coreografia prima della sfilata.' },
        4: { title: 'Briefing clienti: framework etico di booking', excerpt: 'Come EOEX allinea output creativo con sicurezza, trasparenza e performance.' },
        5: { title: 'Il team di Parigi amplia il supporto legale', excerpt: 'Nuovo canale dedicato di intervento legale nel modello mother agency.' },
        6: { title: 'Diario passerella Tokyo dagli alumni EOEX', excerpt: 'Racconto su ritmo, disciplina backstage e opportunita post-show.' },
      },
    },
    contact: {
      eyebrow: 'Contatta EOEX', title: 'Candidature, booking e richieste stampa.', name: 'Nome', email: 'Email', subject: 'Oggetto', inquiryType: 'Tipo di Richiesta', inquiryOptions: { modelling: 'Candidatura Modella', booking: 'Booking Cliente', press: 'Stampa', general: 'Generale' }, message: 'Messaggio', send: 'Invia Messaggio', hq: 'Sede EOEX', address: '44 Rue du Faubourg Saint-Honore, Paris', mapTitle: 'Mappa EOEX',
    },
    footer: { about: 'Chi Siamo', masterclasses: 'Masterclass', contact: 'Contatti', newsletter: 'Newsletter', subscribe: 'Iscriviti', privacy: 'Privacy Policy', terms: 'Termini di Servizio', emailPlaceholder: 'tuo@esempio.com' },
  },
  pt: {
    locale: 'pt-PT',
    languageBanner: 'Idioma',
    skipToMain: 'Ir para o conteudo principal',
    toggleMenu: 'Abrir menu',
    nav: { hero: 'Inicio', about: 'Sobre', masterclasses: 'Masterclasses', gallery: 'Galeria', videos: 'Videos', testimonials: 'Testemunhos', news: 'Noticias', contact: 'Contacto' },
    brandTagline: 'A eleg\u00e2ncia da excel\u00eancia',
    hero: { aria: 'Carrossel de moda em destaque', iframeTitle: 'Carrossel de passarela EOEX', kicker: 'A passarela espera por ti', heading: 'EOEX', subheading: 'A eleg\u00e2ncia da excel\u00eancia', copy: 'Representa\u00e7\u00e3o \u00e9tica para a nova gera\u00e7\u00e3o de talento global de moda.', cta: 'Descobrir a Passarela' },
    about: {
      eyebrow: 'O Valor EOEX', title: 'A eleg\u00e2ncia da excel\u00eancia.',
      cards: [
        { title: 'Educa\u00e7\u00e3o Primeiro', description: 'Todo talento come\u00e7a com literacia real de moda: contratos, direitos, limites e neg\u00f3cio.' },
        { title: 'Compensa\u00e7\u00e3o Justa', description: 'A EOEX garante pagamento transparente em passarela, editorial, comercial e digital.' },
        { title: 'Sem Castings', description: 'Pr\u00e9-selecionamos talento para oportunidades alinhadas, reduzindo incerteza.' },
        { title: 'Modelo Mother Agency', description: 'Modelos podem colaborar com outras agencias; a EOEX protege estrategia e legalidade.' },
        { title: 'Recrutamento Masterclass', description: 'A entrada e conquistada em workshops intensivos de estetica e disciplina.' },
        { title: 'C\u00f3digo de \u00c9tica', description: 'Um quadro \u00e9tico rigoroso preserva dignidade, seguran\u00e7a e responsabilidade profissional.' },
      ],
      stats: ['Cidades', 'Desfiles', '100+ Oportunidades comerciais e editoriais'],
    },
    masterclasses: { eyebrow: 'Recrutamento Masterclass', title: 'Workshops em v\u00e1rias cidades para entrar no ecossistema EOEX.', register: 'Registar', modalTitle: 'Registar em', modalName: 'Nome', modalEmail: 'Email', modalPhone: 'Telefone', modalCity: 'Cidade', modalMessage: 'Mensagem', modalPlaceholder: 'Conta-nos os teus objetivos de modelagem', modalSubmit: 'Enviar', modalClose: 'Fechar', schedule: [
      { city: 'Grenoble', date: '14 e 15 de agosto', venue: 'local a confirmar' },
      { city: 'Paris', date: '21 e 22 de agosto', venue: 'local a confirmar' },
      { city: 'Lyon', date: '28 e 29 de agosto', venue: 'local a confirmar' },
      { city: 'Madrid', date: '4 e 5 de setembro', venue: 'local a confirmar' },
      { city: 'Bruxelles', date: '11 e 12 de setembro', venue: 'local a confirmar' },
      { city: 'Milan', date: '18 e 19 de setembro', venue: 'local a confirmar' },
    ] },
    gallery: {
      eyebrow: 'Portfolio de Modelos', title: 'Talento curado para passarela, editorial e comercial.', categoriesAria: 'Categorias de modelos', filters: { All: 'Todos', Runway: 'Passarela', Editorial: 'Editorial', Commercial: 'Comercial', 'New Faces': 'Novos Rostos' }, viewProfile: 'Ver Perfil', closeProfile: 'Fechar Perfil', portfolioSuffix: 'portfolio', categories: { Runway: 'Passarela', Editorial: 'Editorial', Commercial: 'Comercial', 'New Faces': 'Novos Rostos' },
      bios: {
        1: 'Especialista de passarela em Paris, conhecida por precisao couture e versatilidade editorial.',
        2: 'Modelo orientada a campanhas, combinando carisma natural e narrativa beauty sofisticada.',
        3: 'Talento formado em Milao, equilibrando movimento de passarela e storytelling de marca.',
        4: 'Novo rosto vindo da via masterclass EOEX, elogiada pelo alcance expressivo.',
        5: 'Perfil atletico de passarela com simetria marcante e disciplina de ensaio.',
        6: 'Modelo de nova geracao para campanhas com linguagem de pose limpa e impacto proximo.',
      },
    },
    videos: { eyebrow: 'Destaques de Passarela', title: 'Momentos cinematogr\u00e1ficos de desfiles, bastidores e testemunhos.', pauseAria: 'Pausar v\u00eddeo da passarela', playAria: 'Reproduzir v\u00eddeo da passarela', pause: 'Pausar', play: 'Reproduzir', next: 'Pr\u00f3ximo Clip', progressAria: 'Progresso do v\u00eddeo', titles: { v1: 'Abertura da Passarela em Paris', v2: 'Atelier de Bastidores', v3: 'Teste de Movimento Editorial' } },
    testimonials: {
      eyebrow: 'Vozes', title: 'De modelos e marcas parceiras.', portraitSuffix: 'retrato', roles: { 1: 'Modelo de Passarela', 2: 'Diretor Criativo, Maison Verre', 3: 'Modelo Editorial' },
      quotes: {
        1: 'A EOEX ensinou-me clareza contratual antes do meu primeiro desfile internacional. Isso mudou tudo.',
        2: 'A qualidade do talento e excecional, mas o destaque e o profissionalismo e a estrutura etica.',
        3: 'Entrei por uma masterclass e senti-me protegida desde o primeiro dia, com pagamento transparente.',
      },
    },
    news: {
      eyebrow: 'Magazine', title: 'Atualiza\u00e7\u00f5es da ag\u00eancia, destaque de modelos e intelig\u00eancia do setor.', readMore: 'Ler Mais', loadMore: 'Carregar Mais',
      comingSoon: 'Sera publicado em breve',
      items: {
        1: { title: 'EOEX anuncia circuito de masterclasses de inverno', excerpt: 'Serie de recrutamento em sete cidades abre com mentoria ampliada e literacia legal.' },
        2: { title: 'Destaque: a ascensao editorial de Yara Sol', excerpt: 'Do primeiro workshop a campanhas internacionais em menos de seis meses.' },
        3: { title: 'Bastidores: preparacao couture em Milao', excerpt: 'Um dia entre coaching de movimento, fittings e coreografia antes do desfile.' },
        4: { title: 'Briefing cliente: framework etico de booking', excerpt: 'Como a EOEX alinha criacao com seguranca, transparencia e desempenho.' },
        5: { title: 'Equipa de Paris amplia apoio juridico', excerpt: 'Novo canal dedicado de intervencao legal no modelo mother agency.' },
        6: { title: 'Diario de passarela em Toquio por alumni EOEX', excerpt: 'Relato sobre ritmo, disciplina de bastidores e oportunidades pos-show.' },
      },
    },
    contact: {
      eyebrow: 'Contacto EOEX', title: 'Candidaturas, bookings e pedidos de imprensa.', name: 'Nome', email: 'Email', subject: 'Assunto', inquiryType: 'Tipo de Pedido', inquiryOptions: { modelling: 'Candidatura de Modelo', booking: 'Booking de Cliente', press: 'Imprensa', general: 'Geral' }, message: 'Mensagem', send: 'Enviar Mensagem', hq: 'Sede EOEX', address: '44 Rue du Faubourg Saint-Honore, Paris', mapTitle: 'Mapa EOEX',
    },
    footer: { about: 'Sobre', masterclasses: 'Masterclasses', contact: 'Contacto', newsletter: 'Newsletter', subscribe: 'Subscrever', privacy: 'Pol\u00edtica de Privacidade', terms: 'Termos de Servi\u00e7o', emailPlaceholder: 'tu@exemplo.com' },
  },
  de: {
    locale: 'de-DE',
    languageBanner: 'Sprache',
    skipToMain: 'Zum Hauptinhalt springen',
    toggleMenu: 'Men\u00fc umschalten',
    nav: { hero: 'Start', about: '\u00dcber uns', masterclasses: 'Masterclasses', gallery: 'Galerie', videos: 'Videos', testimonials: 'Stimmen', news: 'News', contact: 'Kontakt' },
    brandTagline: 'Die Eleganz der Exzellenz',
    hero: { aria: 'Ausgew\u00e4hltes Modekarussell', iframeTitle: 'EOEX Laufsteg-Karussell', kicker: 'Der Laufsteg wartet auf dich', heading: 'EOEX', subheading: 'Die Eleganz der Exzellenz', copy: 'Ethische Repr\u00e4sentation f\u00fcr die neue Generation globaler Modetalente.', cta: 'Laufsteg entdecken' },
    about: {
      eyebrow: 'Der EOEX-Wert', title: 'Die Eleganz der Exzellenz.',
      cards: [
        { title: 'Bildung zuerst', description: 'Jedes Talent beginnt mit echter Fashion-Kompetenz: Vertr\u00e4ge, Rechte, Grenzen und Business.' },
        { title: 'Faire Verg\u00fctung', description: 'EOEX sorgt f\u00fcr transparente Verg\u00fctung bei Laufsteg, Editorial, Commercial und Digital.' },
        { title: 'Keine Castings', description: 'Wir selektieren Talente im Voraus f\u00fcr passende Chancen und reduzieren Unsicherheit.' },
        { title: 'Mother-Agency-Modell', description: 'Models arbeiten mit externen Agenturen, w\u00e4hrend EOEX strategischen und rechtlichen Schutz bietet.' },
        { title: 'Masterclass-Rekrutierung', description: 'Der Einstieg wird in intensiven City-Workshops zu \u00c4sthetik und Disziplin verdient.' },
        { title: 'Ethik-Kodex', description: 'Ein strenger Ethikrahmen sichert W\u00fcrde, Sicherheit und Professionalit\u00e4t.' },
      ],
      stats: ['St\u00e4dte', 'Runway-Shows', '100+ Kommerzielle & editoriale Chancen'],
    },
    masterclasses: { eyebrow: 'Masterclass-Rekrutierung', title: 'Workshops in mehreren St\u00e4dten f\u00fcr den Einstieg ins EOEX-\u00d6kosystem.', register: 'Anmelden', modalTitle: 'Anmelden f\u00fcr', modalName: 'Name', modalEmail: 'E-Mail', modalPhone: 'Telefon', modalCity: 'Stadt', modalMessage: 'Nachricht', modalPlaceholder: 'Erz\u00e4hle uns von deinen Modelzielen', modalSubmit: 'Senden', modalClose: 'Schlie\u00dfen', schedule: [
      { city: 'Grenoble', date: '14. & 15. August', venue: 'Ort wird best\u00e4tigt' },
      { city: 'Paris', date: '21. & 22. August', venue: 'Ort wird best\u00e4tigt' },
      { city: 'Lyon', date: '28. & 29. August', venue: 'Ort wird best\u00e4tigt' },
      { city: 'Madrid', date: '4. & 5. September', venue: 'Ort wird best\u00e4tigt' },
      { city: 'Bruxelles', date: '11. & 12. September', venue: 'Ort wird best\u00e4tigt' },
      { city: 'Milan', date: '18. & 19. September', venue: 'Ort wird best\u00e4tigt' },
    ] },
    gallery: {
      eyebrow: 'Model-Portfolio', title: 'Kuratiertes Talent f\u00fcr Laufsteg, Editorial und Commercial.', categoriesAria: 'Model-Kategorien', filters: { All: 'Alle', Runway: 'Laufsteg', Editorial: 'Editorial', Commercial: 'Commercial', 'New Faces': 'Neue Gesichter' }, viewProfile: 'Profil ansehen', closeProfile: 'Profil schlie\u00dfen', portfolioSuffix: 'Portfolio', categories: { Runway: 'Laufsteg', Editorial: 'Editorial', Commercial: 'Commercial', 'New Faces': 'Neue Gesichter' },
      bios: {
        1: 'Paris-basierte Laufsteg-Spezialistin mit Couture-Pr\u00e4zision und editorialer Vielseitigkeit.',
        2: 'Kampagnenorientiertes Model mit nat\u00fcrlichem Charisma und moderner Beauty-Narrative.',
        3: 'In Mailand ausgebildetes Talent zwischen Runway-Movement und Brand-Storytelling.',
        4: 'Neues Gesicht aus dem EOEX-Masterclass-Track mit starker Ausdrucksbreite.',
        5: 'Athletisches Runway-Profil mit klarer Symmetrie und hoher Proben-Disziplin.',
        6: 'Model der neuen Generation mit klarer Pose-Sprache und nahbarer Wirkung.',
      },
    },
    videos: { eyebrow: 'Runway-Highlights', title: 'Filmische Momente aus Shows, Backstage und Testimonials.', pauseAria: 'Runway-Video pausieren', playAria: 'Runway-Video abspielen', pause: 'Pause', play: 'Abspielen', next: 'N\u00e4chster Clip', progressAria: 'Video-Fortschritt', titles: { v1: 'Runway-Opening in Paris', v2: 'Backstage-Atelier', v3: 'Editorial-Movement-Test' } },
    testimonials: {
      eyebrow: 'Stimmen', title: 'Von Models und Partnerbrands.', portraitSuffix: 'Portr\u00e4t', roles: { 1: 'Runway-Model', 2: 'Creative Director, Maison Verre', 3: 'Editorial-Model' },
      quotes: {
        1: 'EOEX hat mir vor meiner ersten internationalen Show Vertragsklarheit gegeben. Das hat alles ver\u00e4ndert.',
        2: 'Die Talentqualit\u00e4t ist stark, aber besonders sind Professionalit\u00e4t und ethische Struktur.',
        3: 'Ich kam \u00fcber eine Masterclass und f\u00fchlte mich vom ersten Tag an gesch\u00fctzt und fair bezahlt.',
      },
    },
    news: {
      eyebrow: 'Magazin', title: 'Agentur-Updates, Model-Spotlights und Branchenwissen.', readMore: 'Mehr lesen', loadMore: 'Mehr laden',
      comingSoon: 'Wird bald veroffentlicht',
      items: {
        1: { title: 'EOEX startet die Winter-Masterclass-Serie', excerpt: 'Die Rekrutierungsreihe in sieben St\u00e4dten startet mit erweitertem Mentoring und Rechtswissen.' },
        2: { title: 'Model-Spotlight: Yara Sols editorialer Aufstieg', excerpt: 'Vom ersten Workshop zu internationalen Kampagnen in unter sechs Monaten.' },
        3: { title: 'Behind the Scenes: Couture-Vorbereitung in Mailand', excerpt: 'Ein Tag zwischen Movement-Coaching, Fittings und Choreografie vor der Show.' },
        4: { title: 'Client-Briefing: Ethischer Booking-Rahmen', excerpt: 'Wie EOEX Kreativit\u00e4t mit Sicherheit, Transparenz und Performance verbindet.' },
        5: { title: 'Pariser Team erweitert Rechts-Support', excerpt: 'Neuer dedizierter Kanal f\u00fcr rechtliche Intervention im Mother-Agency-Modell.' },
        6: { title: 'Tokyo-Runway-Tagebuch von EOEX-Alumni', excerpt: 'Erfahrungen zu Rhythmus, Backstage-Disziplin und Chancen nach der Show.' },
      },
    },
    contact: {
      eyebrow: 'Kontakt EOEX', title: 'Bewerbungen, Bookings und Presseanfragen.', name: 'Name', email: 'E-Mail', subject: 'Betreff', inquiryType: 'Anfragetyp', inquiryOptions: { modelling: 'Model-Bewerbung', booking: 'Kunden-Booking', press: 'Presse', general: 'Allgemein' }, message: 'Nachricht', send: 'Nachricht senden', hq: 'EOEX Hauptsitz', address: '44 Rue du Faubourg Saint-Honore, Paris', mapTitle: 'EOEX Karte',
    },
    footer: { about: '\u00dcber uns', masterclasses: 'Masterclasses', contact: 'Kontakt', newsletter: 'Newsletter', subscribe: 'Abonnieren', privacy: 'Datenschutzrichtlinie', terms: 'Nutzungsbedingungen', emailPlaceholder: 'du@beispiel.com' },
  },
};

const GALLERY_FILTER_KEYS = ['All', 'Runway', 'Editorial', 'Commercial', 'New Faces'];

const ARCHIVE_VIDEO_PATHS = [
  'ALBINA mariage 2.mp4',
  'CATIA mariage 3.mp4',
  'FLORINE ROBE 1.mp4',
];

const KIOSK_COPY = {
  en: {
    eyebrow: 'Kiosk',
    title: 'EOEX Editions',
    subtitle: 'An elegant digital shelf for premium magazines and collector books.',
    featuredTitle: 'Featured Magazine Covers',
    bookshelfTitle: 'Bookshelf Collection',
    lastMonth: 'Last Month Cover',
    thisMonth: 'This Month Cover',
    nextMonth: 'Next Month Cover',
    openIssue: 'OPEN ISSUE',
    close: 'Close',
    exitCta: 'Return to archive',
    magazineLabel: 'Magazine',
    bookLabel: 'Book',
    issuePrefix: 'Issue',
    bookPrefix: 'Book',
    metadata: {
      title: 'Title',
      issue: 'Issue Number',
      subtitle: 'Subtitle',
      summary: 'Summary',
      pages: 'Pages',
      date: 'Issue Date',
    },
    featuredSubtitles: [
      'August 2026',
      'September 2026',
      'October 2026',
    ],
    featuredSummaries: [
      'Premium briefing on agency movement, trends, and legal clarity for talents.',
      'Curated issue with campaign analysis, backstage insight, and model development.',
      'Forward look at upcoming castings, production discipline, and market direction.',
    ],
  },
  fr: {
    eyebrow: 'Kiosk',
    title: 'Editions EOEX',
    subtitle: 'Une etagere numerique elegante pour magazines premium et livres de collection.',
    featuredTitle: 'Couvertures Magazine en Vedette',
    bookshelfTitle: 'Collection Bibliotheque',
    lastMonth: 'Couverture du Mois Dernier',
    thisMonth: 'Couverture de ce Mois',
    nextMonth: 'Couverture du Mois Prochain',
    openIssue: 'OUVRIR LE NUMERO',
    close: 'Fermer',
    exitCta: 'Retour à l’archive',
    magazineLabel: 'Magazine',
    bookLabel: 'Livre',
    issuePrefix: 'Numero',
    bookPrefix: 'Livre',
    metadata: {
      title: 'Titre',
      issue: 'Numero',
      subtitle: 'Sous-titre',
      summary: 'Resume',
      pages: 'Pages',
      date: 'Date',
    },
    featuredSubtitles: [
      'Intelligence editoriale et strategie runway.',
      'Profils, direction de casting et recits couture.',
      'Dossier d anticipation pour la prochaine saison.',
    ],
    featuredSummaries: [
      'Brief premium sur les mouvements d agence, les tendances et la clarte legale.',
      'Numero organise avec analyses de campagne, coulisses et progression modele.',
      'Vue d ensemble sur castings a venir, discipline de production et direction de marche.',
    ],
  },
  es: {
    eyebrow: 'Kiosco',
    title: 'Ediciones EOEX',
    subtitle: 'Una estanteria digital elegante para revistas premium y libros de coleccion.',
    featuredTitle: 'Portadas de Revista Destacadas',
    bookshelfTitle: 'Coleccion de Estanteria',
    lastMonth: 'Portada del Mes Pasado',
    thisMonth: 'Portada de Este Mes',
    nextMonth: 'Portada del Proximo Mes',
    openIssue: 'ABRIR NUMERO',
    close: 'Cerrar',
    exitCta: 'Volver al archivo',
    magazineLabel: 'Revista',
    bookLabel: 'Libro',
    issuePrefix: 'Numero',
    bookPrefix: 'Libro',
    metadata: {
      title: 'Titulo',
      issue: 'Numero',
      subtitle: 'Subtitulo',
      summary: 'Resumen',
      pages: 'Paginas',
      date: 'Fecha',
    },
    featuredSubtitles: [
      'Inteligencia editorial y estrategia de pasarela.',
      'Perfiles, direccion de casting y narrativas couture.',
      'Dossier de avance para oportunidades de la proxima temporada.',
    ],
    featuredSummaries: [
      'Informe premium sobre movimiento de agencia, tendencias y claridad legal.',
      'Edicion curada con analisis de campanas, vision backstage y desarrollo de modelo.',
      'Panorama de castings proximos, disciplina de produccion y direccion de mercado.',
    ],
  },
  it: {
    eyebrow: 'Kiosk',
    title: 'Edizioni EOEX',
    subtitle: 'Una libreria digitale elegante per magazine premium e libri da collezione.',
    featuredTitle: 'Copertine Magazine in Evidenza',
    bookshelfTitle: 'Collezione Libreria',
    lastMonth: 'Copertina del Mese Scorso',
    thisMonth: 'Copertina di Questo Mese',
    nextMonth: 'Copertina del Prossimo Mese',
    openIssue: 'APRI NUMERO',
    close: 'Chiudi',
    exitCta: 'Torna all’archivio',
    magazineLabel: 'Magazine',
    bookLabel: 'Libro',
    issuePrefix: 'Numero',
    bookPrefix: 'Libro',
    metadata: {
      title: 'Titolo',
      issue: 'Numero',
      subtitle: 'Sottotitolo',
      summary: 'Sommario',
      pages: 'Pagine',
      date: 'Data',
    },
    featuredSubtitles: [
      'Intelligenza editoriale e strategia runway.',
      'Profili, direzione casting e narrazioni couture.',
      'Dossier di anteprima per opportunita della prossima stagione.',
    ],
    featuredSummaries: [
      'Brief premium su movimenti agenzia, trend e chiarezza legale per i talenti.',
      'Numero curato con analisi campagne, insight backstage e sviluppo modello.',
      'Panoramica su casting futuri, disciplina di produzione e direzione mercato.',
    ],
  },
  pt: {
    eyebrow: 'Kiosk',
    title: 'Edicoes EOEX',
    subtitle: 'Uma estante digital elegante para revistas premium e livros de colecao.',
    featuredTitle: 'Capas de Revista em Destaque',
    bookshelfTitle: 'Colecao de Estante',
    lastMonth: 'Capa do Mes Passado',
    thisMonth: 'Capa Deste Mes',
    nextMonth: 'Capa do Proximo Mes',
    openIssue: 'ABRIR EDICAO',
    close: 'Fechar',
    exitCta: 'Voltar ao arquivo',
    magazineLabel: 'Revista',
    bookLabel: 'Livro',
    issuePrefix: 'Edicao',
    bookPrefix: 'Livro',
    metadata: {
      title: 'Titulo',
      issue: 'Numero',
      subtitle: 'Subtitulo',
      summary: 'Resumo',
      pages: 'Paginas',
      date: 'Data',
    },
    featuredSubtitles: [
      'Inteligencia editorial e estrategia de passarela.',
      'Perfis, direcao de casting e narrativas couture.',
      'Dossie de previsao para oportunidades da proxima temporada.',
    ],
    featuredSummaries: [
      'Brief premium sobre movimento da agencia, tendencias e clareza legal.',
      'Edicao curada com analise de campanhas, visao de bastidores e desenvolvimento.',
      'Panorama de castings futuros, disciplina de producao e direcao de mercado.',
    ],
  },
  de: {
    eyebrow: 'Kiosk',
    title: 'EOEX Editionen',
    subtitle: 'Ein elegantes digitales Regal fur Premium-Magazine und Sammlerbucher.',
    featuredTitle: 'Magazincover im Fokus',
    bookshelfTitle: 'Bucherregal Kollektion',
    lastMonth: 'Cover vom Letzten Monat',
    thisMonth: 'Cover von Diesem Monat',
    nextMonth: 'Cover vom Nachsten Monat',
    openIssue: 'AUSGABE OFFNEN',
    close: 'Schliessen',
    exitCta: 'Zurück zum Archiv',
    magazineLabel: 'Magazin',
    bookLabel: 'Buch',
    issuePrefix: 'Ausgabe',
    bookPrefix: 'Buch',
    metadata: {
      title: 'Titel',
      issue: 'Ausgabenummer',
      subtitle: 'Untertitel',
      summary: 'Kurzfassung',
      pages: 'Seiten',
      date: 'Ausgabedatum',
    },
    featuredSubtitles: [
      'Editoriale Intelligenz und Runway-Strategie.',
      'Profile, Casting-Richtung und Couture-Erzahlungen.',
      'Vorschau-Dossier fur Chancen der nachsten Saison.',
    ],
    featuredSummaries: [
      'Premium-Briefing zu Agenturbewegungen, Trends und rechtlicher Klarheit fur Talente.',
      'Kuratiertes Heft mit Kampagnenanalysen, Backstage-Einblicken und Modellaufbau.',
      'Ausblick auf kommende Castings, Produktionsdisziplin und Marktrichtung.',
    ],
  },
};

const KIOSK_MAGAZINE_ISSUES = [
  {
    id: 'kiosk-mag-1',
    issueNumber: 1,
    pages: 184,
    releaseDate: '2026-08-01',
    externalUrl: 'https://publications.dune-x.fr/eoex-magazine-august-26-eng',
  },
  { id: 'kiosk-mag-2', issueNumber: 2, pages: 196, releaseDate: '2026-09-01' },
  { id: 'kiosk-mag-3', issueNumber: 3, pages: 208, releaseDate: '2026-10-01' },
];

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const getArchiveImageNarrative = (item, language) => {
  const posterPath = (item.poster || '').replace(/^\//, '').toLowerCase();
  const folderMatch = posterPath.includes('/runway-highlights/')
    ? posterPath.split('/runway-highlights/')[1].split('/')[0]
    : 'archive';

  const archiveNarratives = {
    en: {
      maguy: { label: 'Velvet Tension', summary: 'A quiet but charged frame that reflects EOEX’s mission to connect creative vision with disciplined, protected talent.' },
      moov: { label: 'Motion Discipline', summary: 'This study captures poise in motion, where ethics, preparation, and professional rigor shape a stronger runway presence.' },
      paulas: { label: 'Quiet Precision', summary: 'A composed editorial portrait that mirrors EOEX’s promise of a fair, respectful bridge between creators and emerging talent.' },
      field: { label: 'Field Study', summary: 'A candid archive moment showing how industry preparation transforms raw potential into confident, career-ready practice.' },
      archive: { label: 'Studio Signal', summary: 'An archive frame that honours the human story behind fashion: trust, craft, and the ethical bridge EOEX builds between talent and culture.' },
    },
    fr: {
      maguy: { label: 'Tension Veloutée', summary: 'Une image calme mais intense qui reflète la mission EOEX: relier la vision créative au talent protégé et discipliné.' },
      moov: { label: 'Discipline du Mouvement', summary: 'Cette étude montre la grâce dans le mouvement, où la préparation, l’éthique et le professionnalisme donnent plus de présence.' },
      paulas: { label: 'Précision Silencieuse', summary: 'Un portrait éditorial posé qui incarne la promesse EOEX: un pont juste et respectueux entre créateurs et talents émergents.' },
      field: { label: 'Étude de Terrain', summary: 'Un instant d’archive qui montre comment la préparation professionnelle transforme le potentiel brut en présence de carrière.' },
      archive: { label: 'Signal du Studio', summary: 'Une image d’archive qui célèbre l’histoire humaine de la mode: confiance, métier et pont éthique entre talent et culture.' },
    },
    es: {
      maguy: { label: 'Tensión de Velo', summary: 'Un encuadre sereno pero cargado que refleja la misión de EOEX: conectar la visión creativa con talento protegido y disciplinado.' },
      moov: { label: 'Disciplina del Movimiento', summary: 'Este estudio capta el equilibrio en movimiento, donde la ética, la preparación y el rigor profesional fortalecen la presencia.' },
      paulas: { label: 'Precisión Silenciosa', summary: 'Un retrato editorial sereno que encarna la promesa EOEX: un puente justo y respetuoso entre creadores y talentos emergentes.' },
      field: { label: 'Estudio de Campo', summary: 'Un instante de archivo que muestra cómo la preparación profesional transforma el potencial en práctica segura y profesional.' },
      archive: { label: 'Señal de Estudio', summary: 'Un marco de archivo que honra la historia humana de la moda: confianza, oficio y el puente ético que EOEX crea entre talento y cultura.' },
    },
    it: {
      maguy: { label: 'Tensione Velata', summary: 'Un’immagine calma ma carica che riflette la missione EOEX: collegare visione creativa e talento disciplinato, protetto e pronto.' },
      moov: { label: 'Disciplina del Movimento', summary: 'Questo studio cattura la grazia del movimento, dove etica, preparazione e rigore professionale costruiscono una presenza più forte.' },
      paulas: { label: 'Precisione Silenziosa', summary: 'Un ritratto editoriale composto che incarna la promessa EOEX: un ponte rispettoso tra creatori e talenti emergenti.' },
      field: { label: 'Studio sul Campo', summary: 'Un momento d’archivio che mostra come la preparazione professionale trasformi il potenziale in pratica pronta per la carriera.' },
      archive: { label: 'Segnale di Studio', summary: 'Un fotogramma d’archivio che celebra la storia umana della moda: fiducia, mestiere e ponte etico tra talento e cultura.' },
    },
    pt: {
      maguy: { label: 'Tensão de Veludo', summary: 'Uma imagem serena e carregada que reflete a missão da EOEX: ligar a visão criativa a talentos protegidos e disciplinados.' },
      moov: { label: 'Disciplina do Movimento', summary: 'Este estudo capta a elegância em movimento, onde ética, preparação e rigor profissional elevam a presença de passarela.' },
      paulas: { label: 'Precisão Silenciosa', summary: 'Um retrato editorial composto que encarna a promessa da EOEX: uma ponte justa e respeitosa entre criadores e talentos emergentes.' },
      field: { label: 'Estudo de Campo', summary: 'Um momento de arquivo que mostra como a preparação profissional transforma potencial em prática de carreira.' },
      archive: { label: 'Sinal de Estúdio', summary: 'Uma imagem de arquivo que honra a história humana da moda: confiança, oficio e a ponte ética entre talento e cultura.' },
    },
    de: {
      maguy: { label: 'Samtene Spannung', summary: 'Ein ruhiger, aber kraftvoller Blick, der EOEX’ Ziel widerspiegelt: kreative Vision mit diszipliniertem, geschütztem Talent zu verbinden.' },
      moov: { label: 'Bewegungsdisziplin', summary: 'Diese Studie zeigt Haltung in Bewegung, wo Ethik, Vorbereitung und Professionalität eine stärkere Präsenz schaffen.' },
      paulas: { label: 'Stille Präzision', summary: 'Ein ruhiges Editorial-Porträt, das EOEX’ Versprechen verkörpert: eine faire und respektvolle Brücke zwischen Schöpfern und Talenten.' },
      field: { label: 'Feldstudie', summary: 'Ein Archivmoment zeigt, wie professionelle Vorbereitung rohes Potenzial in sichere, karrierebereite Praxis verwandelt.' },
      archive: { label: 'Studio-Signal', summary: 'Ein Archivrahmen, der die menschliche Geschichte der Mode ehrt: Vertrauen, Handwerk und die ethische Brücke zwischen Talent und Kultur.' },
    },
  };

  const key = folderMatch.includes('maguy') ? 'maguy' : folderMatch.includes('moov') ? 'moov' : folderMatch.includes('paulas') ? 'paulas' : folderMatch.startsWith('s-') ? 'field' : 'archive';
  return archiveNarratives[language]?.[key] || archiveNarratives.en[key];
};

function App() {
  const [language, setLanguage] = useState('en');

  const copy = DICTIONARY[language] || DICTIONARY.en;
  const kioskCopy = KIOSK_COPY[language] || KIOSK_COPY.en;
  const homeLogo = assetPath('/gallery/logo/2.png');

  const extractYouTubeId = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.searchParams.get('v') || '';
    } catch {
      return '';
    }
  };

  const buildYouTubeEmbedUrl = (url) => {
    const id = extractYouTubeId(url);
    if (!id) return '';
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&loop=1&playlist=${id}&start=20`;
  };

  const sectionIds = useMemo(
    () => ['hero', 'about', 'masterclasses', 'gallery', 'testimonials', 'news', 'contact'],
    [],
  );

  const topCarouselVideos = useMemo(
    () => [
      { source: 'https://www.youtube.com/watch?v=5Tc4ruN1xR8&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.02 },
      { source: 'https://www.youtube.com/watch?v=HgTSS7Lgw3M&pp=ygUYZmFzaGlvbiBtb2RlbGxpbmcgYWdlbmN52AYY', cropScaleX: 1.35, cropScaleY: 2.08 },
      { source: 'https://www.youtube.com/watch?v=yo6GklFH2sg&pp=ygUYZmFzaGlvbiBtb2RlbGxpbmcgYWdlbmN5', cropScaleX: 1.35, cropScaleY: 2.06 },
      { source: 'https://www.youtube.com/watch?v=SdSSPF1S-Uc&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.04 },
      { source: 'https://www.youtube.com/watch?v=Wr4w5i1xFEo&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.05 },
      { source: 'https://www.youtube.com/watch?v=5D0i7mtlqLs&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.04 },
      { source: 'https://www.youtube.com/watch?v=Nq-taA3DQEE&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.04 },
      { source: 'https://www.youtube.com/watch?v=CwmKr-wkj1M&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr2AYL', cropScaleX: 1.35, cropScaleY: 2.06 },
      { source: 'https://www.youtube.com/watch?v=HfJgt9oEXms&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.04 },
      { source: 'https://www.youtube.com/watch?v=vK3Jq8AJO5s&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.04 },
      { source: 'https://www.youtube.com/watch?v=25956Au5n8Y&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.04 },
      { source: 'https://www.youtube.com/watch?v=6eCl9q2x77U&pp=ygUeZmFzaGlvbiBtb2RlbGxpbmcgZmFzaGlvbiB3ZWVr', cropScaleX: 1.35, cropScaleY: 2.04 },
    ],
    [],
  );

  const masterclassImages = useMemo(
    () =>
      Array.from({ length: 21 }, (_, index) => {
        const number = String(index + 1).padStart(2, '0');
        return assetPath(`/res/images/masterclasses/mc-${number}.jpg`);
      }),
    [],
  );

  const aboutCards = useMemo(() => copy.about.cards, [copy]);

  const stats = useMemo(
    () => [
      { label: copy.about.stats[0], value: 7, suffix: '+' },
      { label: copy.about.stats[1], value: 50, suffix: '+' },
      { label: copy.about.stats[2], value: 100, suffix: '+' },
    ],
    [copy],
  );

  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registrationModal, setRegistrationModal] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [topCarouselIndex, setTopCarouselIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [saveDataMode, setSaveDataMode] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [pauseTestimonials, setPauseTestimonials] = useState(false);
  const [heroVideoHidden, setHeroVideoHidden] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [heroParallax, setHeroParallax] = useState(0);
  const [heroContentParallax, setHeroContentParallax] = useState(0);
  const [masterclassesParallax, setMasterclassesParallax] = useState(0);
  const [masterclassImageIndex, setMasterclassImageIndex] = useState(0);
  const [archiveVideoIndex, setArchiveVideoIndex] = useState(0);
  const [activeArchiveVideoIndex, setActiveArchiveVideoIndex] = useState(null);
  const [visibleArchiveImagesCount, setVisibleArchiveImagesCount] = useState(30);
  const [activeArchiveImage, setActiveArchiveImage] = useState(null);
  const [activeKioskItem, setActiveKioskItem] = useState(null);

  const statsRef = useRef(null);

  const imageFallbacks = useMemo(
    () => ({
      model: assetPath('/placeholders/model-fallback.svg'),
      editorial: encodeURI(assetPath('/gallery/fashion/magazines/aug6/EOEX Magazine - August 26 - FRA-pages-1.png')),
      video: assetPath('/placeholders/video-fallback.svg'),
    }),
    [],
  );

  const formatDate = (dateString) => {
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return dateString;
    return new Intl.DateTimeFormat(copy.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsed);
  };

  const localizedTestimonials = useMemo(
    () =>
      testimonialsData.map((item) => ({
        ...item,
        role: copy.testimonials.roles[item.id] || item.role,
        quote: copy.testimonials.quotes[item.id] || item.quote,
      })),
    [copy],
  );

  const localizedNews = useMemo(
    () =>
      newsData.map((item) => ({
        ...item,
        date: formatDate(item.date),
        title: copy.news.items[item.id]?.title || item.title,
        excerpt: copy.news.items[item.id]?.excerpt || item.excerpt,
      })),
    [copy],
  );

  const localizedModels = useMemo(
    () =>
      modelsData.map((item) => ({
        ...item,
        categoriesLocalized: item.categories.map((category) => copy.gallery.categories[category] || category),
        bio: copy.gallery.bios[item.id] || item.bio,
      })),
    [copy],
  );

  const masterclassesSchedule = useMemo(() => copy.masterclasses.schedule || [], [copy]);

  const extendedNews = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => {
        const sourceItem = newsData[index % newsData.length];
        const localizedItem = copy.news.items[sourceItem.id] || {};

        return {
          ...sourceItem,
          id: `${sourceItem.id}-${index + 1}`,
          title: localizedItem.title || sourceItem.title,
          excerpt: localizedItem.excerpt || sourceItem.excerpt,
          date: formatDate(sourceItem.date),
        };
      }),
    [copy],
  );

  const getSrcSet = (source) => {
    if (!source) return undefined;
    return `${source} 1x, ${source}${source.includes('?') ? '&' : '?'}dpr=2 2x`;
  };

  const toAssetUrl = (source) => encodeURI(assetPath(source));
  const withPreviewOffset = (source, seconds = 2) => {
    if (!source || source.includes('#')) return source;
    return `${source}#t=${seconds}`;
  };

  const archiveVideos = useMemo(
    () =>
      ARCHIVE_VIDEO_PATHS.map((fileName, index) => ({
        id: `archive-video-${index + 1}`,
        title: fileName.replace('.mp4', ''),
        src: toAssetUrl(`/res/videos/gallery/${fileName}`),
        previewSrc: withPreviewOffset(toAssetUrl(`/res/videos/gallery/${fileName}`), 2),
      })),
    [],
  );

  const archiveImages = useMemo(
    () =>
      runwayHighlightsData.map((item) => {
        const narrative = getArchiveImageNarrative(item, language);
        return {
          id: item.id,
          title: item.title,
          label: narrative.label,
          summary: narrative.summary,
          src: toAssetUrl(item.poster),
          caption: `Archive reference ${item.id.toUpperCase()} · EOEX field collection`,
        };
      }),
    [language],
  );

  const orderedArchiveVideos = useMemo(
    () =>
      archiveVideos.map((_, offset) => {
        const originalIndex = (archiveVideoIndex + offset) % archiveVideos.length;
        return { ...archiveVideos[originalIndex], originalIndex };
      }),
    [archiveVideoIndex, archiveVideos],
  );

  const visibleArchiveImages = useMemo(
    () => archiveImages.slice(0, visibleArchiveImagesCount),
    [archiveImages, visibleArchiveImagesCount],
  );

  const hasMoreArchiveImages = visibleArchiveImagesCount < archiveImages.length;

  const kioskMagazineIssues = useMemo(() => {
    const firstMagazineCover = toAssetUrl('/gallery/fashion/magazines/aug6/EOEX Magazine - August 26 - FRA-pages-1.png');
    const coverPool = [
      firstMagazineCover,
      newsData[1]?.image,
      newsData[2]?.image,
    ].filter(Boolean);

    return KIOSK_MAGAZINE_ISSUES.map((issue, index) => {
      const issueDate = new Intl.DateTimeFormat(copy.locale, {
        month: 'long',
        year: 'numeric',
      }).format(new Date(issue.releaseDate));

      return {
        id: issue.id,
        type: kioskCopy.magazineLabel,
        badge: issueDate,
        cover: coverPool[index] || imageFallbacks.editorial,
        title: `EOEX ${kioskCopy.magazineLabel}`,
        issueNumber: `${kioskCopy.issuePrefix} ${issue.issueNumber}`,
        externalUrl: issue.externalUrl || null,
        subtitle: kioskCopy.featuredSubtitles[index],
        summary: kioskCopy.featuredSummaries[index],
        pages: issue.pages,
        issueDate,
      };
    });
  }, [copy.locale, imageFallbacks.editorial, kioskCopy]);

  const kioskBooks = useMemo(() => {
    if (!archiveImages.length) return [];

    return Array.from({ length: 15 }, (_, index) => {
      const source = archiveImages[index % archiveImages.length];
      const monthSequence = ['2026-08-01', '2026-09-01', '2026-10-01'];
      const releaseMonth = monthSequence[index % monthSequence.length];
      const issueDate = new Intl.DateTimeFormat(copy.locale, {
        month: 'long',
        year: 'numeric',
      }).format(new Date(releaseMonth));

      const monthLabels = ['August 2026', 'September 2026', 'October 2026'];
      const monthLabel = monthLabels[index % monthLabels.length];

      return {
        id: `kiosk-book-${index + 1}`,
        type: kioskCopy.bookLabel,
        cover: source.src,
        title: source.title || `EOEX ${kioskCopy.bookPrefix}`,
        issueNumber: `${kioskCopy.bookPrefix} ${String(index + 1).padStart(2, '0')}`,
        subtitle: monthLabel,
        summary: monthLabel,
        pages: 120 + (index % 6) * 12,
        issueDate,
      };
    });
  }, [archiveImages, copy.locale, kioskCopy]);

  const kioskBookRows = useMemo(
    () => Array.from({ length: 3 }, (_, rowIndex) => kioskBooks.slice(rowIndex * 5, rowIndex * 5 + 5)),
    [kioskBooks],
  );

  const handleImageFallback = (event, type = 'editorial') => {
    const fallback = imageFallbacks[type] || imageFallbacks.editorial;
    const target = event.currentTarget;
    if (target.src.endsWith(fallback)) return;
    target.src = fallback;
    target.removeAttribute('srcset');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const handlePreferences = () => {
      const reduced = motionQuery.matches;
      const saveData = Boolean(connection?.saveData);
      setPrefersReducedMotion(reduced);
      setSaveDataMode(saveData);

      if (reduced || saveData) {
        setHeroVideoHidden(true);
      }
    };

    handlePreferences();
    motionQuery.addEventListener('change', handlePreferences);
    connection?.addEventListener?.('change', handlePreferences);

    return () => {
      motionQuery.removeEventListener('change', handlePreferences);
      connection?.removeEventListener?.('change', handlePreferences);
    };
  }, []);

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

      const heroOffset = Math.min(window.scrollY * 0.2, 160);
      setHeroParallax(heroOffset);
      setHeroContentParallax(window.scrollY * -0.08);

      const masterclassesSection = document.getElementById('masterclasses');
      if (masterclassesSection) {
        const masterTop = masterclassesSection.offsetTop;
        const distance = window.scrollY - masterTop;
        setMasterclassesParallax(Math.max(-40, Math.min(distance * 0.08, 80)));
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      setRegistrationModal(null);
      setSelectedModel(null);
      setActiveArchiveVideoIndex(null);
      setActiveArchiveImage(null);
      setActiveKioskItem(null);
      setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll('.reveal').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [language]);

  useEffect(() => {
    const element = statsRef.current;
    if (!element || statsAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || statsAnimated) return;

          const start = performance.now();
          const duration = 1400;

          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedStats(stats.map((item) => Math.round(item.value * eased)));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setStatsAnimated(true);
            }
          };

          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [stats, statsAnimated]);

  useEffect(() => {
    setAnimatedStats(stats.map(() => 0));
    setStatsAnimated(false);
  }, [language, stats]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const interval = window.setInterval(() => {
      setMasterclassImageIndex((previous) => (previous + 1) % masterclassImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, masterclassImages.length]);

  useEffect(() => {
    if (pauseTestimonials) return undefined;
    if (prefersReducedMotion) return undefined;

    const interval = window.setInterval(() => {
      setTestimonialIndex((previous) => (previous + 1) % localizedTestimonials.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, [pauseTestimonials, prefersReducedMotion, localizedTestimonials.length]);

  const filteredModels = useMemo(() => {
    if (galleryFilter === 'All') return localizedModels;
    return localizedModels.filter((model) => model.categories.includes(galleryFilter));
  }, [galleryFilter, localizedModels]);

  const visibleNews = useMemo(() => extendedNews.slice(0, 6), [extendedNews]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const currentLocation = typeof window !== 'undefined' ? window.location : null;
  const homePageUrl = currentLocation ? `${currentLocation.origin}${import.meta.env.BASE_URL}` : import.meta.env.BASE_URL;
  const landingPageUrl = `${homePageUrl}#landing`;

  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    return window.location.hash === '#landing' ? 'landing' : 'home';
  });

  useEffect(() => {
    const handleHashRoute = () => {
      const isLandingRoute = window.location.hash === '#landing';
      setCurrentPage(isLandingRoute ? 'landing' : 'home');
    };

    handleHashRoute();
    window.addEventListener('hashchange', handleHashRoute);
    return () => window.removeEventListener('hashchange', handleHashRoute);
  }, []);

  const renderSharedFooter = () => (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand-block">
          <a href={homePageUrl} className="brand brand-with-logo" onClick={(event) => {
            event.preventDefault();
            window.location.assign(homePageUrl);
          }}>
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
          <p className="eyebrow">Instagram</p>
          <h3>FOLLOW US</h3>
          <ul className="footer-social-list">
            <li>
              <a href="https://www.instagram.com/eoexpublishing/" target="_blank" rel="noreferrer">@eoexpublishing</a>
            </li>
          </ul>
        </div>
      </div>
      <small>
        <a href={homePageUrl} className="footer-back-home">BACK TO HOME</a>
        <span> © {new Date().getFullYear()} EOEX. {copy.footer.privacy} · {copy.footer.terms}</span>
      </small>
    </footer>
  );

  const currentTestimonial = localizedTestimonials[testimonialIndex];
  const topCarouselTotal = topCarouselVideos.length;
  const topCarouselCurrentConfig = topCarouselVideos[topCarouselIndex];
  const topCarouselCurrent = buildYouTubeEmbedUrl(topCarouselCurrentConfig?.source || '');
  const topCarouselCurrentCropX = topCarouselCurrentConfig?.cropScaleX || 1.35;
  const topCarouselCurrentCropY = topCarouselCurrentConfig?.cropScaleY || 2.04;

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const interval = window.setInterval(() => {
      setTopCarouselIndex((previous) => (previous + 1) % topCarouselTotal);
    }, 20000);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, topCarouselTotal]);

  return (
    <div className="dunex-site">
      <a className="skip-link" href="#about">
        {copy.skipToMain}
      </a>
      <header className="site-header">
        <nav className={`top-nav ${activeSection !== 'hero' ? 'solid' : ''}`}>
          <a href="#hero" className="brand brand-with-logo" onClick={(event) => {
            event.preventDefault();
            scrollToSection('hero');
          }}>
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
        <section id="hero" className="hero-section">
          <div className="hero-overlay" />
          <video
            className={`hero-video ${heroVideoHidden ? 'is-hidden' : ''}`}
            autoPlay={!saveDataMode && !prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80"
            style={{ '--hero-parallax': `${heroParallax}px` }}
            onError={() => setHeroVideoHidden(true)}
          >
            <source src="https://cdn.coverr.co/videos/coverr-a-model-walks-on-the-runway-1578371181624?download=1080p" type="video/mp4" />
          </video>
          <div className="hero-content" style={{ '--hero-content-parallax': `${heroContentParallax}px` }}>
            <div className="top-carousel hero-carousel reveal is-visible" aria-label={copy.hero.aria}>
              <div className="top-carousel-frame">
                <iframe
                  className="top-carousel-video"
                  key={topCarouselCurrent}
                  src={topCarouselCurrent}
                  title={copy.hero.iframeTitle}
                  style={{ '--video-crop-scale-x': topCarouselCurrentCropX, '--video-crop-scale-y': topCarouselCurrentCropY }}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="eager"
                />
                <div className="carousel-overlay">
                  <p className="kicker reveal is-visible">{copy.hero.kicker}</p>
                  <h1 className="reveal is-visible">{copy.hero.heading}</h1>
                  <h2 className="reveal is-visible">{copy.hero.subheading}</h2>
                  <p className="hero-copy reveal is-visible">{copy.hero.copy}</p>
                  <button className="cta-button reveal is-visible" type="button" onClick={() => scrollToSection('about')}>
                    {copy.hero.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="section-heading reveal">
            <p className="eyebrow">{copy.about.eyebrow}</p>
            <h2>{copy.about.title}</h2>
          </div>

          <div className="about-grid">
            {aboutCards.map((card, index) => (
              <article key={card.title} className="about-card reveal" style={{ '--delay': `${index * 80}ms` }}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>

          <div className="stats-grid reveal" ref={statsRef}>
            {stats.map((item, index) => (
              <div className="stat-card" key={item.label}>
                <strong>
                  {animatedStats[index]}
                  {item.suffix}
                </strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="masterclasses"
          className="section masterclasses-section"
          style={{
            '--masterclasses-parallax': `${masterclassesParallax}px`,
          }}
        >
          <div className="section-heading reveal">
            <p className="eyebrow">{copy.masterclasses.eyebrow}</p>
            <h2>{copy.masterclasses.title}</h2>
          </div>

          <div className="cities-grid">
            {masterclassesSchedule.map((city, index) => (
              <article className="city-card reveal" key={city.city} style={{ '--delay': `${index * 70}ms` }}>
                <h3>{city.city}</h3>
                <p>{city.date}</p>
                <p>{city.venue}</p>
                <button type="button" onClick={() => setRegistrationModal(city)}>{copy.masterclasses.register}</button>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="section gallery-section">
          <div className="section-heading reveal">
            <p className="eyebrow">{copy.gallery.eyebrow}</p>
            <h2>{copy.gallery.title}</h2>
          </div>

          <div className="filter-group reveal" role="tablist" aria-label={copy.gallery.categoriesAria}>
            {GALLERY_FILTER_KEYS.map((filter) => (
              <button key={filter} className={galleryFilter === filter ? 'active' : ''} type="button" onClick={() => setGalleryFilter(filter)}>
                {copy.gallery.filters[filter]}
              </button>
            ))}
          </div>

          <div className="models-grid">
            {filteredModels.map((model, index) => (
              <article key={model.id} className="model-card reveal" style={{ '--delay': `${index * 60}ms` }}>
                <img
                  loading="lazy"
                  decoding="async"
                  src={model.image}
                  srcSet={getSrcSet(model.image)}
                  alt={`${model.name} ${copy.gallery.portfolioSuffix}`}
                  onError={(event) => handleImageFallback(event, 'model')}
                />
                <div className="model-meta">
                  <h3>{model.name}</h3>
                  <p>{model.categoriesLocalized.join(' • ')}</p>
                  <button type="button" onClick={() => setSelectedModel(model)}>{copy.gallery.viewProfile}</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="archive" className="section archive-section">
          <div className="section-heading reveal">
            <p className="eyebrow">Field Archive</p>
            <h2>Image and moving-image catalog assembled from the full gallery collection.</h2>
          </div>

          <div className="archive-media reveal">
            <div className="archive-video-header">
              <h3>Film Gallery</h3>
              <div className="archive-video-nav" aria-label="Video carousel controls">
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setArchiveVideoIndex((previous) => (previous - 1 + archiveVideos.length) % archiveVideos.length)}
                >
                  &larr;
                </button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setArchiveVideoIndex((previous) => (previous + 1) % archiveVideos.length)}
                >
                  &rarr;
                </button>
              </div>
            </div>

            <div className="archive-video-strip">
              {orderedArchiveVideos.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  className={index === 0 ? 'archive-video-card is-active' : 'archive-video-card'}
                  onClick={() => {
                    setArchiveVideoIndex(video.originalIndex);
                    setActiveArchiveVideoIndex(video.originalIndex);
                  }}
                >
                  <video muted playsInline preload="metadata" src={video.previewSrc} />
                  <span>{video.title}</span>
                </button>
              ))}
            </div>

            <div className="archive-image-header">
              <h3>Image Gallery</h3>
              <p>{visibleArchiveImages.length} / {archiveImages.length}</p>
            </div>

            <div className="archive-image-wall">
              {visibleArchiveImages.map((image) => (
                <button key={image.id} type="button" className="archive-image-card" onClick={() => setActiveArchiveImage(image)}>
                  <img
                    loading="lazy"
                    decoding="async"
                    src={image.src}
                    srcSet={getSrcSet(image.src)}
                    alt={image.title}
                    onError={(event) => handleImageFallback(event, 'video')}
                  />
                  <span>{image.title}</span>
                </button>
              ))}
            </div>

            {hasMoreArchiveImages && (
              <button
                className="load-more archive-load-more"
                type="button"
                onClick={() => setVisibleArchiveImagesCount((count) => Math.min(count + 15, archiveImages.length))}
              >
                Load More Images
              </button>
            )}
          </div>
        </section>

        <section id="testimonials" className="section testimonials-section">
          <div className="section-heading reveal">
            <p className="eyebrow">{copy.testimonials.eyebrow}</p>
            <h2>{copy.testimonials.title}</h2>
          </div>

          <article className="testimonial-card reveal" onMouseEnter={() => setPauseTestimonials(true)} onMouseLeave={() => setPauseTestimonials(false)}>
            <img
              loading="lazy"
              decoding="async"
              src={currentTestimonial.image}
              srcSet={getSrcSet(currentTestimonial.image)}
              alt={`${currentTestimonial.name} ${copy.testimonials.portraitSuffix}`}
              onError={(event) => handleImageFallback(event, 'editorial')}
            />
            <blockquote>{currentTestimonial.quote}</blockquote>
            <div className="testimonial-meta">
              <h3>{currentTestimonial.name}</h3>
              <p>{currentTestimonial.role}</p>
              <p>{'★'.repeat(currentTestimonial.rating)}</p>
            </div>
          </article>
        </section>

        <section id="news" className="section news-section">
          <div className="section-heading reveal">
            <p className="eyebrow">{copy.news.eyebrow}</p>
            <h2>{copy.news.title}</h2>
          </div>

          <div className="news-grid">
            {visibleNews.map((post, index) => (
              <article className="news-card reveal" key={post.id} style={{ '--delay': `${index * 70}ms` }}>
                <img
                  loading="lazy"
                  decoding="async"
                  src={post.image}
                  srcSet={getSrcSet(post.image)}
                  alt={post.title}
                  onError={(event) => handleImageFallback(event, 'editorial')}
                />
                <div>
                  <p className="news-date">{post.date}</p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <a href="#news" onClick={(event) => event.preventDefault()}>{copy.news.readMore}</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="section-heading reveal">
            <p className="eyebrow">{copy.contact.eyebrow}</p>
            <h2>{copy.contact.title}</h2>
          </div>

          <div className="contact-grid">
            <form className="contact-form reveal" onSubmit={(event) => event.preventDefault()}>
              <label>
                {copy.contact.name}
                <input type="text" name="name" required />
              </label>
              <label>
                {copy.contact.email}
                <input type="email" name="email" autoComplete="email" required />
              </label>
              <label>
                {copy.contact.subject}
                <input type="text" name="subject" required />
              </label>
              <label>
                {copy.contact.inquiryType}
                <select name="inquiryType" defaultValue="general">
                  <option value="modelling">{copy.contact.inquiryOptions.modelling}</option>
                  <option value="booking">{copy.contact.inquiryOptions.booking}</option>
                  <option value="press">{copy.contact.inquiryOptions.press}</option>
                  <option value="general">{copy.contact.inquiryOptions.general}</option>
                </select>
              </label>
              <label>
                {copy.contact.message}
                <textarea name="message" rows="4" required />
              </label>
              <button type="submit">{copy.contact.send}</button>
            </form>

            <div className="contact-details reveal">
              <div className="contact-intro-video-frame">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                >
                  <source src={withPreviewOffset(toAssetUrl('/res/videos/gallery/EOEX-INTRO.mp4'), 2)} type="video/mp4" />
                </video>
              </div>
              <div className="social-links">
                <a href="https://www.instagram.com/eoex.studio/" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
              </div>
            </div>
          </div>
        </section>

        <section id="kiosk" className="section kiosk-section">
          <div className="section-heading reveal">
            <p className="eyebrow">{kioskCopy.eyebrow}</p>
            <h2>{kioskCopy.title}</h2>
            <p className="kiosk-subtitle">{kioskCopy.subtitle}</p>
          </div>

          <div className="kiosk-block reveal">
            <h3>{kioskCopy.featuredTitle}</h3>
            <div className="kiosk-featured-grid">
              {kioskMagazineIssues.map((issue, index) => (
                <article
                  key={issue.id}
                  className="kiosk-cover-card"
                  style={{ '--delay': `${index * 80}ms` }}
                >
                  {issue.externalUrl ? (
                    <a href={issue.externalUrl} target="_blank" rel="noreferrer" aria-label={`${issue.title} ${issue.issueNumber}`}>
                      <img
                        loading="lazy"
                        decoding="async"
                        src={issue.cover}
                        srcSet={getSrcSet(issue.cover)}
                        alt={`${issue.title} ${issue.issueNumber}`}
                        onError={(event) => handleImageFallback(event, 'editorial')}
                      />
                    </a>
                  ) : (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={issue.cover}
                      srcSet={getSrcSet(issue.cover)}
                      alt={`${issue.title} ${issue.issueNumber}`}
                      onError={(event) => handleImageFallback(event, 'editorial')}
                    />
                  )}
                  <div className="kiosk-cover-meta">
                    <span>{issue.badge}</span>
                    <strong>{issue.issueNumber}</strong>
                    {issue.externalUrl ? (
                      <a
                        className="kiosk-cover-cta"
                        href={issue.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {kioskCopy.openIssue}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="kiosk-cover-cta"
                        onClick={() => setActiveKioskItem(issue)}
                      >
                        {kioskCopy.openIssue}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="kiosk-block reveal">
            <h3>{kioskCopy.bookshelfTitle}</h3>
            <div className="kiosk-bookshelf">
              {kioskBookRows.map((row, rowIndex) => (
                <div key={`kiosk-row-${rowIndex + 1}`} className="kiosk-shelf-row">
                  <div className="kiosk-book-grid">
                    {row.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        className="kiosk-book"
                        onClick={() => setActiveKioskItem(book)}
                      >
                        <img
                          loading="lazy"
                          decoding="async"
                          src={book.cover}
                          srcSet={getSrcSet(book.cover)}
                          alt={`${book.title} ${book.issueNumber}`}
                          onError={(event) => handleImageFallback(event, 'editorial')}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="kiosk-shelf-plank" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {renderSharedFooter()}

      {registrationModal && (
        <div className="modal-backdrop" role="presentation" onClick={() => setRegistrationModal(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3>{copy.masterclasses.modalTitle} {registrationModal.city}</h3>
            <p>{formatDate(registrationModal.date)} · {registrationModal.venue}</p>
            <form onSubmit={(event) => event.preventDefault()}>
              <label>
                {copy.masterclasses.modalName}
                <input type="text" required />
              </label>
              <label>
                {copy.masterclasses.modalEmail}
                <input type="email" required />
              </label>
              <label>
                {copy.masterclasses.modalPhone}
                <input type="tel" required />
              </label>
              <label>
                {copy.masterclasses.modalCity}
                <input type="text" defaultValue={registrationModal.city} required />
              </label>
              <label>
                {copy.masterclasses.modalMessage}
                <textarea rows="3" placeholder={copy.masterclasses.modalPlaceholder} />
              </label>
              <div className="modal-actions">
                <button type="submit">{copy.masterclasses.modalSubmit}</button>
                <button type="button" className="ghost" onClick={() => setRegistrationModal(null)}>{copy.masterclasses.modalClose}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedModel && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedModel(null)}>
          <article className="modal-card profile" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <img
              src={selectedModel.image}
              srcSet={getSrcSet(selectedModel.image)}
              alt={selectedModel.name}
              onError={(event) => handleImageFallback(event, 'model')}
            />
            <h3>{selectedModel.name}</h3>
            <p>{selectedModel.categoriesLocalized.join(' • ')}</p>
            <p>{selectedModel.bio}</p>
            <button type="button" className="ghost" onClick={() => setSelectedModel(null)}>{copy.gallery.closeProfile}</button>
          </article>
        </div>
      )}

      {activeArchiveVideoIndex !== null && (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveArchiveVideoIndex(null)}>
          <article className="modal-card archive-video-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="archive-modal-topbar">
              <h3>{archiveVideos[activeArchiveVideoIndex].title}</h3>
              <div className="archive-video-nav">
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setActiveArchiveVideoIndex((previous) => (previous - 1 + archiveVideos.length) % archiveVideos.length)}
                >
                  &larr;
                </button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setActiveArchiveVideoIndex((previous) => (previous + 1) % archiveVideos.length)}
                >
                  &rarr;
                </button>
              </div>
            </div>
            <video
              key={archiveVideos[activeArchiveVideoIndex].id}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src={archiveVideos[activeArchiveVideoIndex].src}
            />
          </article>
        </div>
      )}

      {activeArchiveImage && (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveArchiveImage(null)}>
          <article className="modal-card archive-image-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <img
              src={activeArchiveImage.src}
              srcSet={getSrcSet(activeArchiveImage.src)}
              alt={activeArchiveImage.title}
              onError={(event) => handleImageFallback(event, 'video')}
            />
            <div className="archive-modal-copy">
              <span className="archive-modal-kicker">EOEX field archive</span>
              <h3>{activeArchiveImage.label || activeArchiveImage.title}</h3>
              <p>{activeArchiveImage.summary || activeArchiveImage.caption}</p>
            </div>
            <button type="button" className="archive-modal-exit" onClick={() => setActiveArchiveImage(null)}>
              {kioskCopy.exitCta}
            </button>
          </article>
        </div>
      )}

      {activeKioskItem && (
        <div className="modal-backdrop" role="presentation" onClick={() => setActiveKioskItem(null)}>
          <article className="modal-card kiosk-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="kiosk-close" onClick={() => setActiveKioskItem(null)}>
              {kioskCopy.close}
            </button>
            <img
              src={activeKioskItem.cover}
              srcSet={getSrcSet(activeKioskItem.cover)}
              alt={`${activeKioskItem.title} ${activeKioskItem.issueNumber}`}
              onError={(event) => handleImageFallback(event, 'editorial')}
            />
            <div className="kiosk-modal-meta">
              <p><strong>{kioskCopy.metadata.title}:</strong> {activeKioskItem.title}</p>
              <p><strong>{kioskCopy.metadata.issue}:</strong> {activeKioskItem.issueNumber}</p>
              <p><strong>{kioskCopy.metadata.subtitle}:</strong> {activeKioskItem.subtitle}</p>
              <p><strong>{kioskCopy.metadata.summary}:</strong> {activeKioskItem.summary}</p>
              <p><strong>{kioskCopy.metadata.pages}:</strong> {activeKioskItem.pages}</p>
              <p><strong>{kioskCopy.metadata.date}:</strong> {activeKioskItem.issueDate}</p>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

export default App;