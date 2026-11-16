import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from '../src/api/mapCountryResponse';
import type { RawCountry } from '../src/types';

describe('mapCountryResponse', () => {
  it('maps a full country correctly', () => {
    const raw: RawCountry = {
      name: 'Spain',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: [{ name: 'Spanish' }],
    };

    expect(mapCountryResponse(raw)).toEqual({
      name: 'Spain',
      flag: '🇪🇸',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      area: 0,
      borders: [],
      currencies: [],
      languages: ['Spanish'],
    });
  });

  it('handles missing data with fallbacks', () => {
    const raw: RawCountry = { name: 'Unknown' };

    expect(mapCountryResponse(raw)).toEqual({
      name: 'Unknown',
      flag: '🏳️',
      capital: '—',
      region: '—',
      population: 0,
      area: 0,
      borders: [],
      currencies: [],
      languages: [],
    });
  });

  it('maps detail fields for the detail view', () => {
    const raw: RawCountry = {
      name: 'Spain',
      area: 505990,
      borders: ['FRA', 'PRT'],
      currencies: [{ name: 'Euro' }],
    };

    expect(mapCountryResponse(raw)).toEqual(
      expect.objectContaining({
        area: 505990,
        borders: ['FRA', 'PRT'],
        currencies: ['Euro'],
      }),
    );
  });
});
