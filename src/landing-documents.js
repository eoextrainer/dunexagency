import careers1Raw from '../gallery/Landing-Pages/CAREERS-1.txt?raw';
import careers2Raw from '../gallery/Landing-Pages/CAREERS-2.txt?raw';
import careers3Raw from '../gallery/Landing-Pages/CAREERS-3.txt?raw';
import fashionTechRaw from '../gallery/Landing-Pages/EOEX FashionTech Research.txt?raw';

const HOME_URL = 'http://localhost:3000/eoexagency/';

const toLines = (raw) => raw.replace(/\r\n/g, '\n').split('\n');

export const LANDING_DOCUMENTS = {
  'careers-1': {
    slug: 'careers-1',
    title: 'EOEX Careers Landing 1',
    subtitle: 'CAREERS-1 Complete Source',
    sourcePath: 'gallery/Landing-Pages/CAREERS-1.txt',
    homeUrl: HOME_URL,
    lines: toLines(careers1Raw),
  },
  'careers-2': {
    slug: 'careers-2',
    title: 'EOEX Careers Landing 2',
    subtitle: 'CAREERS-2 Complete Source',
    sourcePath: 'gallery/Landing-Pages/CAREERS-2.txt',
    homeUrl: HOME_URL,
    lines: toLines(careers2Raw),
  },
  'careers-3': {
    slug: 'careers-3',
    title: 'EOEX Careers Landing 3',
    subtitle: 'CAREERS-3 Complete Source',
    sourcePath: 'gallery/Landing-Pages/CAREERS-3.txt',
    homeUrl: HOME_URL,
    lines: toLines(careers3Raw),
  },
  fashiontech: {
    slug: 'fashiontech',
    title: 'EOEX FashionTech Research Landing',
    subtitle: 'EOEX FashionTech Research Complete Source',
    sourcePath: 'gallery/Landing-Pages/EOEX FashionTech Research.txt',
    homeUrl: HOME_URL,
    lines: toLines(fashionTechRaw),
  },
};

export const LANDING_NAV = [
  { href: '/eoexagency/careers-1', label: 'Careers 1' },
  { href: '/eoexagency/careers-2', label: 'Careers 2' },
  { href: '/eoexagency/careers-3', label: 'Careers 3' },
  { href: '/eoexagency/fashiontech', label: 'FashionTech' },
];
