import { searchCountries } from './searchCountries';
import type { CountryCard } from '../types';

export function createSearchCache() {
  const completed = new Map<string, CountryCard[]>();
  const inFlight = new Map<string, Promise<CountryCard[]>>();

  function getSharedPromise(query: string): Promise<CountryCard[]> {
    if (completed.has(query)) {
      return Promise.resolve(completed.get(query)!);
    }

    if (inFlight.has(query)) {
      return inFlight.get(query)!;
    }

    const internalController = new AbortController();

    const promise = searchCountries(query, internalController.signal)
      .then((data) => {
        completed.set(query, data);
        inFlight.delete(query);
        return data;
      })
      .catch((err) => {
        inFlight.delete(query);
        throw err;
      });

    inFlight.set(query, promise);
    return promise;
  }

  async function search(query: string, signal: AbortSignal): Promise<CountryCard[]> {
    if (completed.has(query)) {
      return completed.get(query)!;
    }

    const sharedPromise = getSharedPromise(query);

    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }

      const onAbort = () => {
        reject(new DOMException('Aborted', 'AbortError'));
      };

      signal.addEventListener('abort', onAbort);

      sharedPromise.then(
        (data) => {
          signal.removeEventListener('abort', onAbort);
          resolve(data);
        },
        (err) => {
          signal.removeEventListener('abort', onAbort);
          reject(err);
        },
      );
    });
  }

  return { search };
}
