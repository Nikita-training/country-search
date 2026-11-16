import { HttpError } from './HttpError';
import { mapCountryResponse } from './mapCountryResponse';
import type { RawCountry, CountryCard } from '../types';

const BASE_URL = 'https://countries.dev/name';
const TIMEOUT_MS = 8000;

export async function searchCountries(query: string, signal: AbortSignal): Promise<CountryCard[]> {
  const combinedSignal = AbortSignal.any
    ? AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)])
    : manualCombine(signal, TIMEOUT_MS);

  const response = await fetch(`${BASE_URL}/${encodeURIComponent(query)}`, {
    signal: combinedSignal,
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const raw: RawCountry[] = await response.json();
  return raw.map(mapCountryResponse);
}

function manualCombine(signal: AbortSignal, timeoutMs: number): AbortSignal {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException('Timeout', 'TimeoutError'));
  }, timeoutMs);

  const onAbort = () => {
    clearTimeout(timeoutId);
    controller.abort(signal.reason);
  };

  if (signal.aborted) {
    onAbort();
  } else {
    signal.addEventListener('abort', onAbort, { once: true });
  }

  return controller.signal;
}
