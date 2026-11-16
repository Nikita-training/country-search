import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchCountries } from '../src/api/searchCountries';
import { HttpError } from '../src/api/HttpError';

describe('searchCountries', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns mapped data for a 200 response', async () => {
    const mockRaw = [{ name: 'Spain', capital: 'Madrid' }];
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(mockRaw), { status: 200 }));

    const result = await searchCountries('spain', new AbortController().signal);
    expect(result).toEqual([
      { name: 'Spain', flag: '🏳️', capital: 'Madrid', region: '—', population: 0, languages: [] },
    ]);
  });

  it('returns empty array for a 404 response', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }));

    const result = await searchCountries('unknown', new AbortController().signal);
    expect(result).toEqual([]);
  });

  it('throws HttpError for a 500 response', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));

    await expect(searchCountries('error', new AbortController().signal)).rejects.toBeInstanceOf(
      HttpError,
    );
  });
});
