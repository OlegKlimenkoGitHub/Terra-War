
import { Country } from '../types';

// Real-world map data subset for the game.
// IDs must match Google Maps ISO 3166-1 alpha-2 codes for FeatureLayer styling.
export const INITIAL_COUNTRIES: Partial<Country>[] = [
  // North America
  {
    id: 'US',
    iso3: 'USA',
    name: 'United States',
    maxPopulation: 600,
    neighbors: ['CA', 'MX', 'RU', 'GB'], // RU via Bering, GB via Atlantic
    center: { lat: 39.0, lng: -98.0 }
  },
  {
    id: 'CA',
    iso3: 'CAN',
    name: 'Canada',
    maxPopulation: 400,
    neighbors: ['US', 'RU', 'GL'], // GL=Greenland (if added), RU via Arctic
    center: { lat: 56.0, lng: -106.0 }
  },
  {
    id: 'MX',
    iso3: 'MEX',
    name: 'Mexico',
    maxPopulation: 300,
    neighbors: ['US', 'BR', 'CO'], // Simplified path to S.America
    center: { lat: 23.0, lng: -102.0 }
  },
  // South America
  {
    id: 'BR',
    iso3: 'BRA',
    name: 'Brazil',
    maxPopulation: 400,
    neighbors: ['MX', 'AR', 'PE', 'CO', 'AF', 'NG'], // AF=Africa path
    center: { lat: -14.0, lng: -51.0 }
  },
  {
    id: 'AR',
    iso3: 'ARG',
    name: 'Argentina',
    maxPopulation: 300,
    neighbors: ['BR', 'CL'],
    center: { lat: -34.0, lng: -64.0 }
  },
  // Europe
  {
    id: 'GB',
    iso3: 'GBR',
    name: 'United Kingdom',
    maxPopulation: 300,
    neighbors: ['US', 'FR', 'DE', 'NO'],
    center: { lat: 54.0, lng: -2.0 }
  },
  {
    id: 'FR',
    iso3: 'FRA',
    name: 'France',
    maxPopulation: 350,
    neighbors: ['GB', 'DE', 'ES', 'IT'],
    center: { lat: 46.0, lng: 2.0 }
  },
  {
    id: 'DE',
    iso3: 'DEU',
    name: 'Germany',
    maxPopulation: 350,
    neighbors: ['FR', 'PL', 'IT', 'DK'],
    center: { lat: 51.0, lng: 10.0 }
  },
  {
    id: 'PL',
    iso3: 'POL',
    name: 'Poland',
    maxPopulation: 400,
    neighbors: ['DE', 'UA', 'RU'],
    center: { lat: 52.0, lng: 19.0 }
  },
  {
    id: 'UA',
    iso3: 'UKR',
    name: 'Ukraine',
    maxPopulation: 500,
    neighbors: ['RU', 'PL', 'TR'],
    center: { lat: 49.0, lng: 32.0 }
  },
  {
    id: 'RU',
    iso3: 'RUS',
    name: 'Russia',
    maxPopulation: 700,
    neighbors: ['US', 'CA', 'CN', 'MN', 'UA', 'FI', 'JP', 'TR', 'IR'],
    center: { lat: 61.0, lng: 95.0 }
  },
  {
    id: 'TR',
    iso3: 'TUR',
    name: 'Turkey',
    maxPopulation: 450,
    neighbors: ['RU', 'UA', 'SA', 'EG'],
    center: { lat: 39.0, lng: 35.0 }
  },
  // Asia
  {
    id: 'CN',
    iso3: 'CHN',
    name: 'China',
    maxPopulation: 800,
    neighbors: ['RU', 'IN', 'MN', 'VN', 'KP', 'JP', 'AU'],
    center: { lat: 35.0, lng: 104.0 }
  },
  {
    id: 'IN',
    iso3: 'IND',
    name: 'India',
    maxPopulation: 700,
    neighbors: ['CN', 'PK', 'SA', 'MM'], // SA via sea
    center: { lat: 20.0, lng: 78.0 }
  },
  {
    id: 'JP',
    iso3: 'JPN',
    name: 'Japan',
    maxPopulation: 300,
    neighbors: ['CN', 'RU', 'KR', 'US'],
    center: { lat: 36.0, lng: 138.0 }
  },
  {
    id: 'SA',
    iso3: 'SAU',
    name: 'Saudi Arabia',
    maxPopulation: 300,
    neighbors: ['IN', 'EG', 'TR', 'IR'],
    center: { lat: 23.0, lng: 45.0 }
  },
  // Africa
  {
    id: 'EG',
    iso3: 'EGY',
    name: 'Egypt',
    maxPopulation: 300,
    neighbors: ['SA', 'LY', 'SD', 'TR'],
    center: { lat: 26.0, lng: 30.0 }
  },
  {
    id: 'ZA',
    iso3: 'ZAF',
    name: 'South Africa',
    maxPopulation: 300,
    neighbors: ['EG', 'BR', 'AU'], // Sea routes
    center: { lat: -30.0, lng: 25.0 }
  },
  // Oceania
  {
    id: 'AU',
    iso3: 'AUS',
    name: 'Australia',
    maxPopulation: 300,
    neighbors: ['CN', 'ID', 'ZA', 'NZ'],
    center: { lat: -25.0, lng: 133.0 }
  }
];
