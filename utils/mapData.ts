import { Country } from '../types';

// Simplified world map represented as SVG paths (1000x500 coordinate space)
// Neighbors are critical for movement logic.
export const INITIAL_COUNTRIES: Partial<Country>[] = [
  {
    id: 'NA',
    name: 'North America',
    maxPopulation: 500,
    path: "M 50,50 L 300,50 L 250,250 L 100,200 Z",
    neighbors: ['SA', 'EU', 'RU'], // RU via Bering Strait
    center: [175, 125]
  },
  {
    id: 'SA',
    name: 'South America',
    maxPopulation: 300,
    path: "M 250,250 L 350,250 L 300,450 L 200,350 Z",
    neighbors: ['NA', 'AF'],
    center: [275, 325]
  },
  {
    id: 'EU',
    name: 'Europe',
    maxPopulation: 300,
    path: "M 400,50 L 550,50 L 520,150 L 400,150 Z",
    neighbors: ['NA', 'AF', 'RU', 'ME'],
    center: [470, 100]
  },
  {
    id: 'AF',
    name: 'Africa',
    maxPopulation: 400,
    path: "M 400,200 L 550,200 L 500,450 L 400,350 Z",
    neighbors: ['SA', 'EU', 'ME'],
    center: [460, 300]
  },
  {
    id: 'RU',
    name: 'Russia/North Asia',
    maxPopulation: 600,
    path: "M 550,50 L 950,50 L 900,150 L 550,150 Z",
    neighbors: ['NA', 'EU', 'CN', 'ME'],
    center: [750, 100]
  },
  {
    id: 'CN',
    name: 'China/South Asia',
    maxPopulation: 500,
    path: "M 600,150 L 900,150 L 850,300 L 600,250 Z",
    neighbors: ['RU', 'ME', 'AU'],
    center: [740, 210]
  },
  {
    id: 'ME',
    name: 'Middle East',
    maxPopulation: 200,
    path: "M 520,150 L 600,150 L 600,250 L 520,200 Z",
    neighbors: ['EU', 'AF', 'RU', 'CN'],
    center: [560, 190]
  },
  {
    id: 'AU',
    name: 'Australia',
    maxPopulation: 200,
    path: "M 750,350 L 950,350 L 900,480 L 750,450 Z",
    neighbors: ['CN'],
    center: [840, 410]
  }
];
