// ─── Shared types across KUNIMO ───────────────────────────
export interface Incident {
  id: number;
  type: 'Flood' | 'Cyclone' | 'Landslide' | 'Drought';
  lat: number;
  lng: number;
  title: string;
  loc: string;
  desc: string;
  timestamp: string;
}

export interface WeatherStation {
  name: string;
  region: 'N' | 'C' | 'S';
  label: string;
  lat: number;
  lng: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rainfall: number;
  loading: boolean;
  error: boolean;
}

export type PageView = 'home' | 'projects' | 'contribute' | 'account' | 'about';

// ─── Seed data ────────────────────────────────────────────
export const SEED_INCIDENTS: Incident[] = [
  {
    id: 1, type: 'Flood',
    lat: -16.0, lng: 35.0,
    title: 'Chikwawa Flood',
    loc: 'Chikwawa District',
    desc: 'Severe flooding in lower Shire — communities in Chikwawa being evacuated.',
    timestamp: '2025-03-21T08:14:00',
  },
  {
    id: 2, type: 'Cyclone',
    lat: -15.7, lng: 35.3,
    title: 'Nsanje Wind Damage',
    loc: 'Nsanje District',
    desc: 'Strong wind damage along M1 road, several structures collapsed.',
    timestamp: '2025-03-21T06:50:00',
  },
  {
    id: 3, type: 'Landslide',
    lat: -11.0, lng: 34.0,
    title: 'Nkhata Bay Road Blockage',
    loc: 'Nkhata Bay District',
    desc: 'Road blocked by landslide near Mzuzu-Nkhata Bay road.',
    timestamp: '2025-03-20T22:30:00',
  },
  {
    id: 4, type: 'Flood',
    lat: -12.93, lng: 34.32,
    title: '2025 Nkhotakota Flooding',
    loc: 'Dwangwa, Nkhotakota',
    desc: 'Lake-shore communities inundated. Dwangwa bridge under stress.',
    timestamp: '2025-03-20T14:00:00',
  },
  {
    id: 5, type: 'Flood',
    lat: -13.0, lng: 33.48,
    title: '2025 Kasungu Flooding',
    loc: 'Kasungu, M1 Road',
    desc: 'M1 road near Kasungu completely flooded — trucks cannot pass.',
    timestamp: '2025-03-19T09:20:00',
  },
];

export const WEATHER_STATIONS: WeatherStation[] = [
  { name: 'Lilongwe',   region: 'C', label: 'Central',  lat: -13.9669, lng: 33.7873 },
  { name: 'Blantyre',   region: 'S', label: 'Southern', lat: -15.7861, lng: 35.0058 },
  { name: 'Mzuzu',      region: 'N', label: 'Northern', lat: -11.4659, lng: 34.0207 },
  { name: 'Zomba',      region: 'S', label: 'Southern', lat: -15.3833, lng: 35.3167 },
  { name: 'Karonga',    region: 'N', label: 'Northern', lat: -9.9333,  lng: 33.9333 },
  { name: 'Nkhata Bay', region: 'N', label: 'Northern', lat: -11.6,    lng: 34.3    },
  { name: 'Salima',     region: 'C', label: 'Central',  lat: -13.7833, lng: 34.4333 },
  { name: 'Dedza',      region: 'C', label: 'Central',  lat: -14.3667, lng: 34.3333 },
  { name: 'Mangochi',   region: 'S', label: 'Southern', lat: -14.4667, lng: 35.2667 },
  { name: 'Nsanje',     region: 'S', label: 'Southern', lat: -16.9167, lng: 35.2667 },
  { name: 'Chikwawa',   region: 'S', label: 'Southern', lat: -16.0333, lng: 34.8    },
  { name: 'Mchinji',    region: 'C', label: 'Central',  lat: -13.8,    lng: 32.8833 },
];
