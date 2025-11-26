
import { Country } from '../types';

// Real-world map data subset for the game.
// IDs must match ISO 3166-1 alpha-2 codes (e.g. 'US') for map markers.
// ISO3 codes (e.g. 'USA') are used for GeoJSON polygon matching.

export const INITIAL_COUNTRIES: Partial<Country>[] = [
  // --- NORTH & CENTRAL AMERICA ---
  {
    id: 'US', iso3: 'USA', name: 'United States', maxPopulation: 600,
    neighbors: ['CA', 'MX', 'RU', 'GB', 'CU', 'BS'], center: { lat: 39.0, lng: -98.0 }
  },
  {
    id: 'CA', iso3: 'CAN', name: 'Canada', maxPopulation: 400,
    neighbors: ['US', 'RU', 'GL'], center: { lat: 56.0, lng: -106.0 }
  },
  {
    id: 'MX', iso3: 'MEX', name: 'Mexico', maxPopulation: 300,
    neighbors: ['US', 'GT', 'BZ', 'CU'], center: { lat: 23.0, lng: -102.0 }
  },
  {
    id: 'GL', iso3: 'GRL', name: 'Greenland', maxPopulation: 100,
    neighbors: ['CA', 'IS', 'NO', 'GB'], center: { lat: 71.7, lng: -42.6 }
  },
  {
    id: 'CU', iso3: 'CUB', name: 'Cuba', maxPopulation: 150,
    neighbors: ['US', 'MX', 'BS', 'JM', 'HT'], center: { lat: 21.5, lng: -77.7 }
  },
  {
    id: 'GT', iso3: 'GTM', name: 'Guatemala', maxPopulation: 150,
    neighbors: ['MX', 'BZ', 'HN', 'SV'], center: { lat: 15.7, lng: -90.2 }
  },
  {
    id: 'BZ', iso3: 'BLZ', name: 'Belize', maxPopulation: 100,
    neighbors: ['MX', 'GT'], center: { lat: 17.1, lng: -88.4 }
  },
  {
    id: 'HN', iso3: 'HND', name: 'Honduras', maxPopulation: 120,
    neighbors: ['GT', 'SV', 'NI'], center: { lat: 15.2, lng: -86.2 }
  },
  {
    id: 'SV', iso3: 'SLV', name: 'El Salvador', maxPopulation: 120,
    neighbors: ['GT', 'HN'], center: { lat: 13.7, lng: -88.8 }
  },
  {
    id: 'NI', iso3: 'NIC', name: 'Nicaragua', maxPopulation: 120,
    neighbors: ['HN', 'CR'], center: { lat: 12.8, lng: -85.2 }
  },
  {
    id: 'CR', iso3: 'CRI', name: 'Costa Rica', maxPopulation: 120,
    neighbors: ['NI', 'PA'], center: { lat: 9.7, lng: -83.7 }
  },
  {
    id: 'PA', iso3: 'PAN', name: 'Panama', maxPopulation: 120,
    neighbors: ['CR', 'CO'], center: { lat: 8.5, lng: -80.7 }
  },
  {
    id: 'HT', iso3: 'HTI', name: 'Haiti', maxPopulation: 150,
    neighbors: ['DO', 'CU', 'JM'], center: { lat: 18.9, lng: -72.2 }
  },
  {
    id: 'DO', iso3: 'DOM', name: 'Dominican Rep.', maxPopulation: 150,
    neighbors: ['HT', 'PR'], center: { lat: 18.7, lng: -70.1 }
  },
  {
    id: 'JM', iso3: 'JAM', name: 'Jamaica', maxPopulation: 120,
    neighbors: ['CU', 'HT'], center: { lat: 18.1, lng: -77.2 }
  },

  // --- SOUTH AMERICA ---
  {
    id: 'BR', iso3: 'BRA', name: 'Brazil', maxPopulation: 500,
    neighbors: ['VE', 'CO', 'PE', 'BO', 'PY', 'AR', 'UY', 'GY', 'SR', 'GF', 'NG', 'AO'], center: { lat: -14.0, lng: -51.0 }
  },
  {
    id: 'AR', iso3: 'ARG', name: 'Argentina', maxPopulation: 300,
    neighbors: ['BR', 'CL', 'PY', 'UY', 'BO'], center: { lat: -34.0, lng: -64.0 }
  },
  {
    id: 'CL', iso3: 'CHL', name: 'Chile', maxPopulation: 200,
    neighbors: ['AR', 'PE', 'BO'], center: { lat: -35.6, lng: -71.5 }
  },
  {
    id: 'PE', iso3: 'PER', name: 'Peru', maxPopulation: 250,
    neighbors: ['EC', 'CO', 'BR', 'BO', 'CL'], center: { lat: -9.1, lng: -75.0 }
  },
  {
    id: 'EC', iso3: 'ECU', name: 'Ecuador', maxPopulation: 150,
    neighbors: ['CO', 'PE'], center: { lat: -1.8, lng: -78.1 }
  },
  {
    id: 'CO', iso3: 'COL', name: 'Colombia', maxPopulation: 300,
    neighbors: ['VE', 'BR', 'PE', 'EC', 'PA'], center: { lat: 4.5, lng: -74.2 }
  },
  {
    id: 'VE', iso3: 'VEN', name: 'Venezuela', maxPopulation: 250,
    neighbors: ['CO', 'BR', 'GY'], center: { lat: 6.4, lng: -66.5 }
  },
  {
    id: 'BO', iso3: 'BOL', name: 'Bolivia', maxPopulation: 200,
    neighbors: ['BR', 'PY', 'AR', 'CL', 'PE'], center: { lat: -16.2, lng: -63.5 }
  },
  {
    id: 'PY', iso3: 'PRY', name: 'Paraguay', maxPopulation: 150,
    neighbors: ['BR', 'AR', 'BO'], center: { lat: -23.4, lng: -58.4 }
  },
  {
    id: 'UY', iso3: 'URY', name: 'Uruguay', maxPopulation: 150,
    neighbors: ['BR', 'AR'], center: { lat: -32.5, lng: -55.7 }
  },
  {
    id: 'GY', iso3: 'GUY', name: 'Guyana', maxPopulation: 100,
    neighbors: ['VE', 'BR', 'SR'], center: { lat: 4.8, lng: -58.9 }
  },
  {
    id: 'SR', iso3: 'SUR', name: 'Suriname', maxPopulation: 100,
    neighbors: ['GY', 'BR', 'GF'], center: { lat: 3.9, lng: -56.0 }
  },
  {
    id: 'GF', iso3: 'GUF', name: 'French Guiana', maxPopulation: 80, // Often treated as France, but separate on map
    neighbors: ['SR', 'BR'], center: { lat: 3.9, lng: -53.1 }
  },

  // --- EUROPE ---
  {
    id: 'GB', iso3: 'GBR', name: 'United Kingdom', maxPopulation: 350,
    neighbors: ['FR', 'IE', 'NO', 'GL', 'IS', 'NL', 'BE'], center: { lat: 54.0, lng: -2.0 }
  },
  {
    id: 'IE', iso3: 'IRL', name: 'Ireland', maxPopulation: 150,
    neighbors: ['GB'], center: { lat: 53.4, lng: -8.2 }
  },
  {
    id: 'IS', iso3: 'ISL', name: 'Iceland', maxPopulation: 100,
    neighbors: ['GL', 'GB', 'NO'], center: { lat: 64.9, lng: -19.0 }
  },
  {
    id: 'FR', iso3: 'FRA', name: 'France', maxPopulation: 400,
    neighbors: ['GB', 'DE', 'ES', 'IT', 'CH', 'BE', 'LU', 'DZ'], center: { lat: 46.0, lng: 2.0 }
  },
  {
    id: 'DE', iso3: 'DEU', name: 'Germany', maxPopulation: 450,
    neighbors: ['FR', 'PL', 'CZ', 'AT', 'CH', 'NL', 'DK', 'BE', 'LU'], center: { lat: 51.0, lng: 10.0 }
  },
  {
    id: 'ES', iso3: 'ESP', name: 'Spain', maxPopulation: 350,
    neighbors: ['FR', 'PT', 'MA', 'DZ'], center: { lat: 40.4, lng: -3.7 }
  },
  {
    id: 'PT', iso3: 'PRT', name: 'Portugal', maxPopulation: 200,
    neighbors: ['ES', 'MA'], center: { lat: 39.3, lng: -8.2 }
  },
  {
    id: 'IT', iso3: 'ITA', name: 'Italy', maxPopulation: 350,
    neighbors: ['FR', 'CH', 'AT', 'SI', 'HR', 'LY', 'TN', 'GR'], center: { lat: 41.8, lng: 12.5 }
  },
  {
    id: 'NL', iso3: 'NLD', name: 'Netherlands', maxPopulation: 250,
    neighbors: ['DE', 'BE', 'GB'], center: { lat: 52.1, lng: 5.2 }
  },
  {
    id: 'BE', iso3: 'BEL', name: 'Belgium', maxPopulation: 200,
    neighbors: ['FR', 'DE', 'NL', 'LU'], center: { lat: 50.5, lng: 4.4 }
  },
  {
    id: 'CH', iso3: 'CHE', name: 'Switzerland', maxPopulation: 200,
    neighbors: ['FR', 'DE', 'IT', 'AT'], center: { lat: 46.8, lng: 8.2 }
  },
  {
    id: 'AT', iso3: 'AUT', name: 'Austria', maxPopulation: 200,
    neighbors: ['DE', 'CZ', 'SK', 'HU', 'SI', 'IT', 'CH'], center: { lat: 47.5, lng: 14.5 }
  },
  {
    id: 'CZ', iso3: 'CZE', name: 'Czechia', maxPopulation: 200,
    neighbors: ['DE', 'PL', 'SK', 'AT'], center: { lat: 49.8, lng: 15.4 }
  },
  {
    id: 'SK', iso3: 'SVK', name: 'Slovakia', maxPopulation: 150,
    neighbors: ['CZ', 'PL', 'UA', 'HU', 'AT'], center: { lat: 48.6, lng: 19.6 }
  },
  {
    id: 'HU', iso3: 'HUN', name: 'Hungary', maxPopulation: 150,
    neighbors: ['SK', 'UA', 'RO', 'RS', 'HR', 'SI', 'AT'], center: { lat: 47.1, lng: 19.5 }
  },
  {
    id: 'PL', iso3: 'POL', name: 'Poland', maxPopulation: 300,
    neighbors: ['DE', 'UA', 'BY', 'LT', 'CZ', 'SK', 'RU'], center: { lat: 52.0, lng: 19.0 }
  },
  {
    id: 'DK', iso3: 'DNK', name: 'Denmark', maxPopulation: 150,
    neighbors: ['DE', 'SE', 'NO'], center: { lat: 56.2, lng: 9.5 }
  },
  {
    id: 'NO', iso3: 'NOR', name: 'Norway', maxPopulation: 200,
    neighbors: ['SE', 'FI', 'RU', 'GB', 'DK'], center: { lat: 60.4, lng: 8.4 }
  },
  {
    id: 'SE', iso3: 'SWE', name: 'Sweden', maxPopulation: 200,
    neighbors: ['NO', 'FI', 'DK'], center: { lat: 60.1, lng: 18.6 }
  },
  {
    id: 'FI', iso3: 'FIN', name: 'Finland', maxPopulation: 200,
    neighbors: ['SE', 'NO', 'RU', 'EE'], center: { lat: 61.9, lng: 25.7 }
  },
  {
    id: 'EE', iso3: 'EST', name: 'Estonia', maxPopulation: 100,
    neighbors: ['FI', 'RU', 'LV'], center: { lat: 58.5, lng: 25.0 }
  },
  {
    id: 'LV', iso3: 'LVA', name: 'Latvia', maxPopulation: 100,
    neighbors: ['EE', 'RU', 'BY', 'LT'], center: { lat: 56.8, lng: 24.6 }
  },
  {
    id: 'LT', iso3: 'LTU', name: 'Lithuania', maxPopulation: 100,
    neighbors: ['LV', 'BY', 'PL', 'RU'], center: { lat: 55.1, lng: 23.8 }
  },
  {
    id: 'BY', iso3: 'BLR', name: 'Belarus', maxPopulation: 200,
    neighbors: ['RU', 'UA', 'PL', 'LT', 'LV'], center: { lat: 53.7, lng: 27.9 }
  },
  {
    id: 'UA', iso3: 'UKR', name: 'Ukraine', maxPopulation: 350,
    neighbors: ['RU', 'PL', 'BY', 'RO', 'MD', 'SK', 'HU', 'TR'], center: { lat: 49.0, lng: 32.0 }
  },
  {
    id: 'RO', iso3: 'ROU', name: 'Romania', maxPopulation: 250,
    neighbors: ['UA', 'MD', 'HU', 'RS', 'BG'], center: { lat: 45.9, lng: 24.9 }
  },
  {
    id: 'MD', iso3: 'MDA', name: 'Moldova', maxPopulation: 100,
    neighbors: ['UA', 'RO'], center: { lat: 47.4, lng: 28.3 }
  },
  {
    id: 'BG', iso3: 'BGR', name: 'Bulgaria', maxPopulation: 150,
    neighbors: ['RO', 'RS', 'MK', 'GR', 'TR'], center: { lat: 42.7, lng: 25.4 }
  },
  {
    id: 'GR', iso3: 'GRC', name: 'Greece', maxPopulation: 200,
    neighbors: ['AL', 'MK', 'BG', 'TR', 'IT', 'EG'], center: { lat: 39.0, lng: 21.8 }
  },
  {
    id: 'RS', iso3: 'SRB', name: 'Serbia', maxPopulation: 150,
    neighbors: ['HU', 'RO', 'BG', 'MK', 'XK', 'ME', 'BA', 'HR'], center: { lat: 44.0, lng: 21.0 }
  },
  {
    id: 'HR', iso3: 'HRV', name: 'Croatia', maxPopulation: 120,
    neighbors: ['SI', 'HU', 'RS', 'BA', 'ME', 'IT'], center: { lat: 45.1, lng: 15.2 }
  },
  {
    id: 'SI', iso3: 'SVN', name: 'Slovenia', maxPopulation: 100,
    neighbors: ['IT', 'AT', 'HU', 'HR'], center: { lat: 46.1, lng: 14.9 }
  },
  {
    id: 'BA', iso3: 'BIH', name: 'Bosnia', maxPopulation: 120,
    neighbors: ['HR', 'RS', 'ME'], center: { lat: 43.9, lng: 17.6 }
  },
  {
    id: 'AL', iso3: 'ALB', name: 'Albania', maxPopulation: 100,
    neighbors: ['ME', 'XK', 'MK', 'GR', 'IT'], center: { lat: 41.1, lng: 20.1 }
  },
  {
    id: 'MK', iso3: 'MKD', name: 'Macedonia', maxPopulation: 100,
    neighbors: ['XK', 'RS', 'BG', 'GR', 'AL'], center: { lat: 41.6, lng: 21.7 }
  },
  {
    id: 'RU', iso3: 'RUS', name: 'Russia', maxPopulation: 800,
    neighbors: ['US', 'CA', 'CN', 'MN', 'UA', 'FI', 'BY', 'KZ', 'GE', 'AZ', 'KP', 'JP', 'NO', 'EE', 'LV', 'LT', 'PL'], center: { lat: 61.0, lng: 95.0 }
  },

  // --- ASIA ---
  {
    id: 'TR', iso3: 'TUR', name: 'Turkey', maxPopulation: 450,
    neighbors: ['GR', 'BG', 'GE', 'AR', 'IR', 'IQ', 'SY', 'RU', 'UA', 'EG'], center: { lat: 39.0, lng: 35.0 }
  },
  {
    id: 'GE', iso3: 'GEO', name: 'Georgia', maxPopulation: 120,
    neighbors: ['RU', 'AZ', 'AM', 'TR'], center: { lat: 42.3, lng: 43.3 }
  },
  {
    id: 'AM', iso3: 'ARM', name: 'Armenia', maxPopulation: 100,
    neighbors: ['TR', 'GE', 'AZ', 'IR'], center: { lat: 40.0, lng: 45.0 }
  },
  {
    id: 'AZ', iso3: 'AZE', name: 'Azerbaijan', maxPopulation: 120,
    neighbors: ['RU', 'GE', 'AM', 'IR'], center: { lat: 40.1, lng: 47.5 }
  },
  {
    id: 'KZ', iso3: 'KAZ', name: 'Kazakhstan', maxPopulation: 300,
    neighbors: ['RU', 'CN', 'KG', 'UZ', 'TM'], center: { lat: 48.0, lng: 66.9 }
  },
  {
    id: 'UZ', iso3: 'UZB', name: 'Uzbekistan', maxPopulation: 200,
    neighbors: ['KZ', 'KG', 'TJ', 'AF', 'TM'], center: { lat: 41.3, lng: 64.5 }
  },
  {
    id: 'TM', iso3: 'TKM', name: 'Turkmenistan', maxPopulation: 150,
    neighbors: ['KZ', 'UZ', 'AF', 'IR'], center: { lat: 38.9, lng: 59.5 }
  },
  {
    id: 'KG', iso3: 'KGZ', name: 'Kyrgyzstan', maxPopulation: 150,
    neighbors: ['KZ', 'CN', 'TJ', 'UZ'], center: { lat: 41.2, lng: 74.7 }
  },
  {
    id: 'TJ', iso3: 'TJK', name: 'Tajikistan', maxPopulation: 150,
    neighbors: ['UZ', 'KG', 'CN', 'AF'], center: { lat: 38.8, lng: 71.2 }
  },
  {
    id: 'AF', iso3: 'AFG', name: 'Afghanistan', maxPopulation: 300,
    neighbors: ['IR', 'TM', 'UZ', 'TJ', 'CN', 'PK'], center: { lat: 33.9, lng: 67.7 }
  },
  {
    id: 'PK', iso3: 'PAK', name: 'Pakistan', maxPopulation: 500,
    neighbors: ['IR', 'AF', 'CN', 'IN'], center: { lat: 30.3, lng: 69.3 }
  },
  {
    id: 'IN', iso3: 'IND', name: 'India', maxPopulation: 1000,
    neighbors: ['CN', 'NP', 'BT', 'MM', 'BD', 'PK', 'LK', 'SA', 'ID'], center: { lat: 20.0, lng: 78.0 }
  },
  {
    id: 'NP', iso3: 'NPL', name: 'Nepal', maxPopulation: 200,
    neighbors: ['CN', 'IN'], center: { lat: 28.3, lng: 84.1 }
  },
  {
    id: 'BT', iso3: 'BTN', name: 'Bhutan', maxPopulation: 80,
    neighbors: ['CN', 'IN'], center: { lat: 27.5, lng: 90.4 }
  },
  {
    id: 'BD', iso3: 'BGD', name: 'Bangladesh', maxPopulation: 350,
    neighbors: ['IN', 'MM'], center: { lat: 23.6, lng: 90.3 }
  },
  {
    id: 'LK', iso3: 'LKA', name: 'Sri Lanka', maxPopulation: 150,
    neighbors: ['IN'], center: { lat: 7.8, lng: 80.7 }
  },
  {
    id: 'CN', iso3: 'CHN', name: 'China', maxPopulation: 1000,
    neighbors: ['RU', 'MN', 'KP', 'VN', 'LA', 'MM', 'IN', 'BT', 'NP', 'PK', 'AF', 'TJ', 'KG', 'KZ', 'JP', 'TW', 'PH'], center: { lat: 35.0, lng: 104.0 }
  },
  {
    id: 'MN', iso3: 'MNG', name: 'Mongolia', maxPopulation: 150,
    neighbors: ['RU', 'CN'], center: { lat: 46.8, lng: 103.8 }
  },
  {
    id: 'JP', iso3: 'JPN', name: 'Japan', maxPopulation: 350,
    neighbors: ['RU', 'CN', 'KR', 'KP', 'US', 'TW'], center: { lat: 36.0, lng: 138.0 }
  },
  {
    id: 'KR', iso3: 'KOR', name: 'South Korea', maxPopulation: 300,
    neighbors: ['KP', 'JP', 'CN'], center: { lat: 35.9, lng: 127.7 }
  },
  {
    id: 'KP', iso3: 'PRK', name: 'North Korea', maxPopulation: 250,
    neighbors: ['CN', 'RU', 'KR'], center: { lat: 40.3, lng: 127.5 }
  },
  {
    id: 'TW', iso3: 'TWN', name: 'Taiwan', maxPopulation: 200,
    neighbors: ['CN', 'JP', 'PH'], center: { lat: 23.6, lng: 121.0 }
  },
  {
    id: 'MM', iso3: 'MMR', name: 'Myanmar', maxPopulation: 250,
    neighbors: ['CN', 'LA', 'TH', 'BD', 'IN'], center: { lat: 21.9, lng: 95.9 }
  },
  {
    id: 'TH', iso3: 'THA', name: 'Thailand', maxPopulation: 300,
    neighbors: ['MM', 'LA', 'KH', 'MY'], center: { lat: 15.8, lng: 100.9 }
  },
  {
    id: 'LA', iso3: 'LAO', name: 'Laos', maxPopulation: 150,
    neighbors: ['CN', 'VN', 'KH', 'TH', 'MM'], center: { lat: 19.8, lng: 102.4 }
  },
  {
    id: 'VN', iso3: 'VNM', name: 'Vietnam', maxPopulation: 350,
    neighbors: ['CN', 'LA', 'KH', 'PH'], center: { lat: 14.0, lng: 108.2 }
  },
  {
    id: 'KH', iso3: 'KHM', name: 'Cambodia', maxPopulation: 200,
    neighbors: ['LA', 'VN', 'TH'], center: { lat: 12.5, lng: 104.9 }
  },
  {
    id: 'MY', iso3: 'MYS', name: 'Malaysia', maxPopulation: 250,
    neighbors: ['TH', 'ID', 'SG', 'BN'], center: { lat: 4.2, lng: 101.9 }
  },
  {
    id: 'ID', iso3: 'IDN', name: 'Indonesia', maxPopulation: 500,
    neighbors: ['MY', 'PG', 'TL', 'AU', 'IN', 'PH'], center: { lat: -0.7, lng: 113.9 }
  },
  {
    id: 'PH', iso3: 'PHL', name: 'Philippines', maxPopulation: 300,
    neighbors: ['TW', 'VN', 'ID', 'CN'], center: { lat: 12.8, lng: 121.7 }
  },
  
  // --- MIDDLE EAST ---
  {
    id: 'IR', iso3: 'IRN', name: 'Iran', maxPopulation: 450,
    neighbors: ['IQ', 'TR', 'AM', 'AZ', 'TM', 'AF', 'PK', 'RU', 'SA', 'AE'], center: { lat: 32.4, lng: 53.6 }
  },
  {
    id: 'IQ', iso3: 'IRQ', name: 'Iraq', maxPopulation: 300,
    neighbors: ['TR', 'IR', 'KW', 'SA', 'JO', 'SY'], center: { lat: 33.2, lng: 43.6 }
  },
  {
    id: 'SY', iso3: 'SYR', name: 'Syria', maxPopulation: 250,
    neighbors: ['TR', 'IQ', 'JO', 'IL', 'LB'], center: { lat: 34.8, lng: 38.9 }
  },
  {
    id: 'IL', iso3: 'ISR', name: 'Israel', maxPopulation: 200,
    neighbors: ['SY', 'JO', 'EG', 'LB'], center: { lat: 31.0, lng: 34.8 }
  },
  {
    id: 'JO', iso3: 'JOR', name: 'Jordan', maxPopulation: 150,
    neighbors: ['SY', 'IQ', 'SA', 'IL'], center: { lat: 30.5, lng: 36.2 }
  },
  {
    id: 'SA', iso3: 'SAU', name: 'Saudi Arabia', maxPopulation: 300,
    neighbors: ['JO', 'IQ', 'KW', 'QA', 'AE', 'OM', 'YE', 'EG', 'SD', 'IR', 'IN'], center: { lat: 23.0, lng: 45.0 }
  },
  {
    id: 'YE', iso3: 'YEM', name: 'Yemen', maxPopulation: 200,
    neighbors: ['SA', 'OM', 'DJ', 'ER'], center: { lat: 15.5, lng: 48.5 }
  },
  {
    id: 'OM', iso3: 'OMN', name: 'Oman', maxPopulation: 150,
    neighbors: ['SA', 'YE', 'AE', 'IR'], center: { lat: 21.4, lng: 57.0 }
  },
  {
    id: 'AE', iso3: 'ARE', name: 'UAE', maxPopulation: 150,
    neighbors: ['SA', 'OM', 'QA', 'IR'], center: { lat: 23.4, lng: 53.8 }
  },
  {
    id: 'QA', iso3: 'QAT', name: 'Qatar', maxPopulation: 100,
    neighbors: ['SA', 'AE'], center: { lat: 25.3, lng: 51.1 }
  },
  {
    id: 'KW', iso3: 'KWT', name: 'Kuwait', maxPopulation: 100,
    neighbors: ['IQ', 'SA'], center: { lat: 29.3, lng: 47.4 }
  },

  // --- AFRICA ---
  {
    id: 'EG', iso3: 'EGY', name: 'Egypt', maxPopulation: 400,
    neighbors: ['LY', 'SD', 'IL', 'SA', 'TR', 'GR'], center: { lat: 26.0, lng: 30.0 }
  },
  {
    id: 'LY', iso3: 'LBY', name: 'Libya', maxPopulation: 250,
    neighbors: ['EG', 'SD', 'TD', 'NE', 'DZ', 'TN', 'IT'], center: { lat: 26.3, lng: 17.2 }
  },
  {
    id: 'TN', iso3: 'TUN', name: 'Tunisia', maxPopulation: 150,
    neighbors: ['LY', 'DZ', 'IT'], center: { lat: 33.8, lng: 9.5 }
  },
  {
    id: 'DZ', iso3: 'DZA', name: 'Algeria', maxPopulation: 300,
    neighbors: ['TN', 'LY', 'NE', 'ML', 'MR', 'MA', 'ES'], center: { lat: 28.0, lng: 1.6 }
  },
  {
    id: 'MA', iso3: 'MAR', name: 'Morocco', maxPopulation: 250,
    neighbors: ['DZ', 'MR', 'ES', 'PT'], center: { lat: 31.7, lng: -7.0 }
  },
  {
    id: 'MR', iso3: 'MRT', name: 'Mauritania', maxPopulation: 150,
    neighbors: ['MA', 'DZ', 'ML', 'SN'], center: { lat: 21.0, lng: -10.9 }
  },
  {
    id: 'ML', iso3: 'MLI', name: 'Mali', maxPopulation: 200,
    neighbors: ['DZ', 'NE', 'BF', 'CI', 'GN', 'SN', 'MR'], center: { lat: 17.5, lng: -4.0 }
  },
  {
    id: 'NE', iso3: 'NER', name: 'Niger', maxPopulation: 200,
    neighbors: ['LY', 'TD', 'NG', 'BJ', 'BF', 'ML', 'DZ'], center: { lat: 17.6, lng: 8.0 }
  },
  {
    id: 'TD', iso3: 'TCD', name: 'Chad', maxPopulation: 200,
    neighbors: ['LY', 'SD', 'CF', 'CM', 'NG', 'NE'], center: { lat: 15.4, lng: 18.7 }
  },
  {
    id: 'SD', iso3: 'SDN', name: 'Sudan', maxPopulation: 300,
    neighbors: ['EG', 'LY', 'TD', 'CF', 'SS', 'ET', 'ER', 'SA'], center: { lat: 12.8, lng: 30.2 }
  },
  {
    id: 'SS', iso3: 'SSD', name: 'South Sudan', maxPopulation: 200,
    neighbors: ['SD', 'ET', 'KE', 'UG', 'CD', 'CF'], center: { lat: 6.8, lng: 31.3 }
  },
  {
    id: 'ER', iso3: 'ERI', name: 'Eritrea', maxPopulation: 100,
    neighbors: ['SD', 'ET', 'DJ', 'YE', 'SA'], center: { lat: 15.1, lng: 39.7 }
  },
  {
    id: 'DJ', iso3: 'DJI', name: 'Djibouti', maxPopulation: 80,
    neighbors: ['ER', 'ET', 'SO', 'YE'], center: { lat: 11.8, lng: 42.5 }
  },
  {
    id: 'ET', iso3: 'ETH', name: 'Ethiopia', maxPopulation: 400,
    neighbors: ['ER', 'DJ', 'SO', 'KE', 'SS', 'SD'], center: { lat: 9.1, lng: 40.4 }
  },
  {
    id: 'SO', iso3: 'SOM', name: 'Somalia', maxPopulation: 200,
    neighbors: ['DJ', 'ET', 'KE'], center: { lat: 5.1, lng: 46.1 }
  },
  {
    id: 'KE', iso3: 'KEN', name: 'Kenya', maxPopulation: 300,
    neighbors: ['ET', 'SO', 'TZ', 'UG', 'SS'], center: { lat: -0.0, lng: 37.9 }
  },
  {
    id: 'UG', iso3: 'UGA', name: 'Uganda', maxPopulation: 200,
    neighbors: ['SS', 'KE', 'TZ', 'RW', 'CD'], center: { lat: 1.3, lng: 32.2 }
  },
  {
    id: 'TZ', iso3: 'TZA', name: 'Tanzania', maxPopulation: 300,
    neighbors: ['KE', 'MZ', 'MW', 'ZM', 'CD', 'BI', 'RW', 'UG'], center: { lat: -6.3, lng: 34.8 }
  },
  {
    id: 'RW', iso3: 'RWA', name: 'Rwanda', maxPopulation: 100,
    neighbors: ['UG', 'TZ', 'BI', 'CD'], center: { lat: -1.9, lng: 29.8 }
  },
  {
    id: 'BI', iso3: 'BDI', name: 'Burundi', maxPopulation: 100,
    neighbors: ['RW', 'TZ', 'CD'], center: { lat: -3.3, lng: 29.9 }
  },
  {
    id: 'CD', iso3: 'COD', name: 'DR Congo', maxPopulation: 350,
    neighbors: ['CG', 'CF', 'SS', 'UG', 'RW', 'BI', 'TZ', 'ZM', 'AO'], center: { lat: -4.0, lng: 21.7 }
  },
  {
    id: 'CF', iso3: 'CAF', name: 'Central African Rep.', maxPopulation: 150,
    neighbors: ['TD', 'SD', 'SS', 'CD', 'CG', 'CM'], center: { lat: 6.6, lng: 20.9 }
  },
  {
    id: 'CG', iso3: 'COG', name: 'Congo', maxPopulation: 150,
    neighbors: ['CM', 'CF', 'CD', 'GA', 'AO'], center: { lat: -0.2, lng: 15.8 }
  },
  {
    id: 'GA', iso3: 'GAB', name: 'Gabon', maxPopulation: 100,
    neighbors: ['CM', 'CG', 'GQ'], center: { lat: -0.8, lng: 11.6 }
  },
  {
    id: 'CM', iso3: 'CMR', name: 'Cameroon', maxPopulation: 200,
    neighbors: ['NG', 'TD', 'CF', 'CG', 'GA', 'GQ'], center: { lat: 7.3, lng: 12.3 }
  },
  {
    id: 'NG', iso3: 'NGA', name: 'Nigeria', maxPopulation: 500,
    neighbors: ['BJ', 'NE', 'TD', 'CM', 'BR'], center: { lat: 9.0, lng: 8.6 }
  },
  {
    id: 'BJ', iso3: 'BEN', name: 'Benin', maxPopulation: 100,
    neighbors: ['NE', 'NG', 'TG', 'BF'], center: { lat: 9.3, lng: 2.3 }
  },
  {
    id: 'TG', iso3: 'TGO', name: 'Togo', maxPopulation: 100,
    neighbors: ['BF', 'BJ', 'GH'], center: { lat: 8.6, lng: 0.8 }
  },
  {
    id: 'GH', iso3: 'GHA', name: 'Ghana', maxPopulation: 150,
    neighbors: ['BF', 'TG', 'CI'], center: { lat: 7.9, lng: -1.0 }
  },
  {
    id: 'CI', iso3: 'CIV', name: 'Ivory Coast', maxPopulation: 200,
    neighbors: ['ML', 'BF', 'GH', 'LR', 'GN'], center: { lat: 7.5, lng: -5.5 }
  },
  {
    id: 'LR', iso3: 'LBR', name: 'Liberia', maxPopulation: 100,
    neighbors: ['GN', 'CI', 'SL'], center: { lat: 6.4, lng: -9.4 }
  },
  {
    id: 'SL', iso3: 'SLE', name: 'Sierra Leone', maxPopulation: 100,
    neighbors: ['GN', 'LR'], center: { lat: 8.4, lng: -11.7 }
  },
  {
    id: 'GN', iso3: 'GIN', name: 'Guinea', maxPopulation: 120,
    neighbors: ['GW', 'SN', 'ML', 'CI', 'LR', 'SL'], center: { lat: 9.9, lng: -9.6 }
  },
  {
    id: 'SN', iso3: 'SEN', name: 'Senegal', maxPopulation: 120,
    neighbors: ['MR', 'ML', 'GN', 'GW', 'GM'], center: { lat: 14.4, lng: -14.4 }
  },
  {
    id: 'BF', iso3: 'BFA', name: 'Burkina Faso', maxPopulation: 150,
    neighbors: ['ML', 'NE', 'BJ', 'TG', 'GH', 'CI'], center: { lat: 12.2, lng: -1.5 }
  },
  {
    id: 'AO', iso3: 'AGO', name: 'Angola', maxPopulation: 250,
    neighbors: ['CD', 'ZM', 'NA', 'CG', 'BR'], center: { lat: -11.2, lng: 17.8 }
  },
  {
    id: 'ZM', iso3: 'ZMB', name: 'Zambia', maxPopulation: 200,
    neighbors: ['CD', 'TZ', 'MW', 'MZ', 'ZW', 'BW', 'NA', 'AO'], center: { lat: -13.1, lng: 27.8 }
  },
  {
    id: 'MW', iso3: 'MWI', name: 'Malawi', maxPopulation: 100,
    neighbors: ['TZ', 'MZ', 'ZM'], center: { lat: -13.2, lng: 34.3 }
  },
  {
    id: 'MZ', iso3: 'MOZ', name: 'Mozambique', maxPopulation: 250,
    neighbors: ['TZ', 'MW', 'ZM', 'ZW', 'ZA', 'SZ'], center: { lat: -18.6, lng: 35.5 }
  },
  {
    id: 'ZW', iso3: 'ZWE', name: 'Zimbabwe', maxPopulation: 150,
    neighbors: ['ZM', 'MZ', 'ZA', 'BW'], center: { lat: -19.0, lng: 29.1 }
  },
  {
    id: 'BW', iso3: 'BWA', name: 'Botswana', maxPopulation: 150,
    neighbors: ['ZM', 'ZW', 'ZA', 'NA'], center: { lat: -22.3, lng: 24.6 }
  },
  {
    id: 'NA', iso3: 'NAM', name: 'Namibia', maxPopulation: 150,
    neighbors: ['AO', 'ZM', 'BW', 'ZA'], center: { lat: -22.9, lng: 18.4 }
  },
  {
    id: 'ZA', iso3: 'ZAF', name: 'South Africa', maxPopulation: 350,
    neighbors: ['NA', 'BW', 'ZW', 'MZ', 'SZ', 'LS', 'AU', 'BR', 'MG'], center: { lat: -30.0, lng: 25.0 }
  },
  {
    id: 'MG', iso3: 'MDG', name: 'Madagascar', maxPopulation: 200,
    neighbors: ['MZ', 'ZA'], center: { lat: -18.7, lng: 46.8 }
  },

  // --- OCEANIA ---
  {
    id: 'AU', iso3: 'AUS', name: 'Australia', maxPopulation: 300,
    neighbors: ['ID', 'PG', 'NZ', 'ZA'], center: { lat: -25.0, lng: 133.0 }
  },
  {
    id: 'NZ', iso3: 'NZL', name: 'New Zealand', maxPopulation: 200,
    neighbors: ['AU'], center: { lat: -40.9, lng: 174.8 }
  },
  {
    id: 'PG', iso3: 'PNG', name: 'Papua New Guinea', maxPopulation: 150,
    neighbors: ['ID', 'AU'], center: { lat: -6.3, lng: 143.9 }
  }
];
