import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSearchCache } from '../src/api/cache';

describe('search cache', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify([{ name: 'Spain' }]), { status: 200 })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('caches the result and does not call fetch again', async () => {
    const cache = createSearchCache();
    const signal = new AbortController().signal;

    const result1 = await cache.search('spain', signal);
    const result2 = await cache.search('spain', signal);

    expect(result1).toEqual(result2);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('remove concurrent identical requests', async () => {
    const cache = createSearchCache();
    const signal = new AbortController().signal;

    const [result1, result2] = await Promise.all([
      cache.search('spain', signal),
      cache.search('spain', signal),
    ]);

    expect(result1).toEqual(result2);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
