import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../src/utils/debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits for the delay before calling', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer if called again', () => {
    const fn = vi.fn();
    const d = debounce(fn, 300);
    d();
    vi.advanceTimersByTime(200);
    d();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes the arguments to the function', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d('a', 1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('a', 1);
  });

  it('keeps the correct this context', () => {
    const ctx = { value: 42, fn: vi.fn() };
    const d = debounce(function (this: typeof ctx) {
      ctx.fn(this.value);
    }, 100);
    d.call(ctx);
    vi.advanceTimersByTime(100);
    expect(ctx.fn).toHaveBeenCalledWith(42);
  });
});
