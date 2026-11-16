import { describe, it, expect } from 'vitest';
import { HttpError } from '../src/api/HttpError';

describe('HttpError', () => {
  it('is a real Error', () => {
    const err = new HttpError(500, 'Server error');
    expect(err).toBeInstanceOf(Error);
  });

  it('saves the status code', () => {
    const err = new HttpError(500, 'Server error');
    expect(err.status).toBe(500);
  });

  it('saves the error message', () => {
    const err = new HttpError(404, 'Not found');
    expect(err.message).toBe('Not found');
  });

  it('has the correct name', () => {
    const err = new HttpError(500);
    expect(err.name).toBe('HttpError');
  });
});
