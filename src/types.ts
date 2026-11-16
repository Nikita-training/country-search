export interface RawCountry {
  name: string;
  flag?: string;
  capital?: string;
  region?: string;
  population?: number;
  languages?: { name: string }[];
  currencies?: { name: string }[];
}

export interface CountryCard {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
}

export type AppState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'results'; data: CountryCard[] }
  | { type: 'empty' }
  | { type: 'error'; message: string; query: string };
