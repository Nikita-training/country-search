import type { RawCountry, CountryCard } from '../types';

export function mapCountryResponse(raw: RawCountry): CountryCard {
  return {
    name: raw.name,
    flag: raw.flag ?? '🏳️',
    capital: raw.capital ?? '—',
    region: raw.region ?? '—',
    population: raw.population ?? 0,
    languages: raw.languages?.map((l) => l.name) ?? [],
  };
}
