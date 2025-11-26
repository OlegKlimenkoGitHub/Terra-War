import { Country } from '../types';

// Real-world map data subset for the game.
// IDs must match Google Maps ISO 3166-1 alpha-2 codes for FeatureLayer styling.
export const INITIAL_COUNTRIES: Partial<Country>[] = [
  // North America
  {
    id: 'US',
    name: 'United States',
    maxPopulation: 600,
    neighbors: ['CA', 'MX', 'RU', 'GB'], // RU via Bering, GB via Atlantic
    center: { lat: 39.0, lng: -98.0 }
  },
  {
    id: 'CA',
    name: 'Canada',
    maxPopulation: 400,
    neighbors: ['US', 'RU', 'GL'], // GL=Greenland (if added), RU via Arctic
    center: { lat: 56.0, lng: -106.0 }
  },
  {
    id: 'MX',
    name: 'Mexico',
    maxPopulation: 300,
    neighbors: ['US', 'BR', 'CO'], // Simplified path to S.America
    center: { lat: 23.0, lng: -102.0 }
  },
  // South America
  {
    id: 'BR',
    name: 'Brazil',
    maxPopulation: 400,
    neighbors: ['MX', 'AR', 'PE', 'CO', 'AF', 'NG'], // AF=Africa path
    center: { lat: -14.0, lng: -51.0 }
  },
  {
    id: 'AR',
    name: 'Argentina',
    maxPopulation: 300,
    neighbors: ['BR', 'CL'],
    center: { lat: -34.0, lng: -64.0 }
  },
  // Europe
  {
    id: 'GB',
    name: 'United Kingdom',
    maxPopulation: 300,
    neighbors: ['US', 'FR', 'DE', 'NO'],
    center: { lat: 54.0, lng: -2.0 }
  },
  {
    id: 'FR',
    name: 'France',
    maxPopulation: 350,
    neighbors: ['GB', 'DE', 'ES', 'IT'],
    center: { lat: 46.0, lng: 2.0 }
  },
  {
    id: 'DE',
    name: 'Germany',
    maxPopulation: 350,
    neighbors: ['FR', 'PL', 'IT', 'DK'],
    center: { lat: 51.0, lng: 10.0 }
  },
  {
    id: 'RU',
    name: 'Russia',
    maxPopulation: 700,
    neighbors: ['US', 'CA', 'CN', 'MN', 'UA', 'FI', 'JP', 'TR', 'IR'],
    center: { lat: 61.0, lng: 95.0 }
  },
  // Asia
  {
    id: 'CN',
    name: 'China',
    maxPopulation: 800,
    neighbors: ['RU', 'IN', 'MN', 'VN', 'KP', 'JP', 'AU'],
    center: { lat: 35.0, lng: 104.0 }
  },
  {
    id: 'IN',
    name: 'India',
    maxPopulation: 700,
    neighbors: ['CN', 'PK', 'SA', 'MM'], // SA via sea
    center: { lat: 20.0, lng: 78.0 }
  },
  {
    id: 'JP',
    name: 'Japan',
    maxPopulation: 300,
    neighbors: ['CN', 'RU', 'KR', 'US'],
    center: { lat: 36.0, lng: 138.0 }
  },
  {
    id: 'SA',
    name: 'Saudi Arabia',
    maxPopulation: 300,
    neighbors: ['IN', 'EG', 'TR', 'IR'],
    center: { lat: 23.0, lng: 45.0 }
  },
  // Africa
  {
    id: 'EG',
    name: 'Egypt',
    maxPopulation: 300,
    neighbors: ['SA', 'LY', 'SD', 'TR'],
    center: { lat: 26.0, lng: 30.0 }
  },
  {
    id: 'ZA',
    name: 'South Africa',
    maxPopulation: 300,
    neighbors: ['EG', 'BR', 'AU'], // Sea routes
    center: { lat: -30.0, lng: 25.0 }
  },
  // Oceania
  {
    id: 'AU',
    name: 'Australia',
    maxPopulation: 300,
    neighbors: ['CN', 'ID', 'ZA', 'NZ'],
    center: { lat: -25.0, lng: 133.0 }
  }
];