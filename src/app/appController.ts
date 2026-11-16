import { debounce } from '../utils/debounce';
import { searchCountries } from '../api/searchCountries';
import { classifyError } from './classifyError';
import type { CountryCard } from '../types';

export type AppState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'results'; data: CountryCard[] }
  | { type: 'empty' }
  | { type: 'error'; message: string; query: string };

export function createApp(onStateChange: (state: AppState) => void) {
  let currentController: AbortController | null = null;
  let lastQuery = '';

  const executeSearch = async (query: string) => {
    currentController = new AbortController();
    const controller = currentController;

    onStateChange({ type: 'loading' });

    try {
      const data = await searchCountries(query, controller.signal);
      onStateChange(data.length > 0 ? { type: 'results', data } : { type: 'empty' });
    } catch (err) {
      const classified = classifyError(err);

      if (classified.kind === 'cancelled') return;

      if (classified.kind === 'timeout') {
        return onStateChange({ type: 'error', message: 'Request timed out. Please retry.', query });
      }
      if (classified.kind === 'http') {
        return onStateChange({
          type: 'error',
          message: `Server error (${classified.status})`,
          query,
        });
      }

      onStateChange({ type: 'error', message: 'Network error', query });
    }
  };

  const debouncedSearch = debounce(executeSearch, 350);

  return {
    onInput(value: string) {
      if (currentController) {
        currentController.abort();
        currentController = null;
      }

      lastQuery = value.trim();

      if (!lastQuery) {
        onStateChange({ type: 'idle' });
        return;
      }

      debouncedSearch(lastQuery);
    },

    retry() {
      if (lastQuery) {
        executeSearch(lastQuery);
      }
    },

    getLastQuery: () => lastQuery,
  };
}
