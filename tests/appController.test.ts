import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp } from '../src/app/appController';
import type { AppState } from '../src/types';

describe('appController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('aborts the previous request when a new input arrives', async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    const states: AppState[] = [];
    const app = createApp((state: AppState) => states.push(state));

    app.onInput('s');

    app.onInput('sp');

    vi.advanceTimersByTime(400);

    await Promise.resolve();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/sp'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
