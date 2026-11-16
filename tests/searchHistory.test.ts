import { describe, it, expect, beforeEach } from 'vitest';
import { addToHistory, getHistory } from '../src/history/searchHistory';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('searchHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves queries to localStorage', () => {
    addToHistory('spain');
    addToHistory('france');
    expect(getHistory()).toEqual(['france', 'spain']);
  });

  it('does not add duplicates, but moves them to the top', () => {
    addToHistory('spain');
    addToHistory('france');
    addToHistory('spain');
    expect(getHistory()).toEqual(['spain', 'france']);
  });

  it('limits history to 10 items', () => {
    for (let i = 0; i < 15; i++) {
      addToHistory(`query${i}`);
    }
    const history = getHistory();
    expect(history.length).toBe(10);
    expect(history[0]).toBe('query14');
  });
});
