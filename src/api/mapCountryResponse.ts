import type { RawCountry, CountryCard } from '../types';

export function mapCountryResponse(raw: RawCountry): CountryCard {
  return {
    name: raw.name,
    flag: raw.flag ?? '🏳️',
    capital: raw.capital ?? '—',
    region: raw.region ?? '—',
    population: raw.population ?? 0,
    area: raw.area ?? 0,
    borders: raw.borders ?? [],
    currencies: raw.currencies?.map((c) => c.name) ?? [],
    languages: raw.languages?.map((l) => l.name) ?? [],
  };
}
