const STORAGE_KEY = 'country_search_history';
const MAX_ITEMS = 10;

export function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;

  try {
    let history = getHistory();
    history = history.filter((item) => item !== trimmed);
    history.unshift(trimmed);
    history = history.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('Could not save search history', err);
  }
}
