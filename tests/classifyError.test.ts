import { describe, it, expect } from 'vitest';
import { classifyError } from '../src/app/classifyError';
import { HttpError } from '../src/api/HttpError';

describe('classifyError', () => {
  it('identifies AbortError as cancelled', () => {
    const err = new DOMException('Aborted', 'AbortError');
    expect(classifyError(err)).toEqual({ kind: 'cancelled' });
  });

  it('identifies TimeoutError as timeout', () => {
    const err = new DOMException('Timeout', 'TimeoutError');
    expect(classifyError(err)).toEqual({ kind: 'timeout' });
  });

  it('identifies HttpError as http', () => {
    const err = new HttpError(500);
    expect(classifyError(err)).toEqual({ kind: 'http', status: 500 });
  });

  it('identifies unknown errors', () => {
    const err = new Error('Random network fail');
    expect(classifyError(err)).toEqual({ kind: 'unknown', error: err });
  });
});
