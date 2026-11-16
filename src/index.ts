import './style.css';
import { createApp, type AppState } from './app/appController';
import type { CountryCard } from './types';
import { addToHistory, getHistory } from './history/searchHistory';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text = '',
  className = '',
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.textContent = text;
  if (className) e.className = className;
  return e;
}

const title = el('h1', 'Country Search');
const input = el('input');
input.placeholder = 'Search country...';
input.autocomplete = 'off';

const output = el('div');
document.body.append(title, input, output);

const app = createApp((state: AppState) => {
  if (state.type === 'results' || state.type === 'empty') {
    addToHistory(app.getLastQuery());
  }
  render(state);
});

function render(state: AppState) {
  output.replaceChildren();

  if (state.type === 'loading') {
    output.append(el('p', 'Loading...', 'loading'));
  } else if (state.type === 'empty') {
    output.append(el('p', 'Nothing found.', 'empty'));
  } else if (state.type === 'error') {
    const msg = el('p', state.message, 'error');
    const btn = el('button', 'Retry');
    btn.onclick = () => app.retry();
    output.append(msg, btn);
  } else if (state.type === 'results') {
    state.data.forEach((country) => {
      const card = el('div', `${country.flag} ${country.name}`, 'card');
      card.onclick = () => showDetail(country);
      output.append(card);
    });
  } else if (state.type === 'idle') {
    renderHistory();
  }
}

function renderHistory() {
  const history = getHistory();
  if (history.length === 0) return;

  output.append(el('h3', 'Recent searches'));

  history.forEach((query) => {
    const btn = el('button', query, 'card');
    btn.onclick = () => {
      input.value = query;
      app.onInput(query);
    };
    output.append(btn);
  });
}

function showDetail(c: CountryCard) {
  output.replaceChildren();

  const backBtn = el('button', '← Back');
  backBtn.onclick = () => {
    if (input.value.trim()) {
      app.onInput(input.value);
    } else {
      render({ type: 'idle' });
    }
  };

  const details = el('div', '', 'card');
  details.style.cursor = 'default';

  details.append(
    el('h2', `${c.flag} ${c.name}`),
    el('p', `Capital: ${c.capital}`),
    el('p', `Region: ${c.region}`),
    el('p', `Population: ${c.population.toLocaleString()}`),
    el('p', `Area: ${c.area.toLocaleString()} km²`),
    el('p', `Borders: ${c.borders.join(', ') || 'None'}`),
    el('p', `Languages: ${c.languages.join(', ') || 'None'}`),
    el('p', `Currencies: ${c.currencies.join(', ') || 'None'}`),
  );

  output.append(backBtn, details);
}

input.oninput = (e) => {
  const value = (e.target as HTMLInputElement).value;
  app.onInput(value);
};

render({ type: 'idle' });
