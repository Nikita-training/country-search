import { HttpError } from '../api/HttpError';

export type ErrorKind =
  | { kind: 'cancelled' }
  | { kind: 'timeout' }
  | { kind: 'http'; status: number }
  | { kind: 'unknown'; error: unknown };

export function classifyError(err: unknown): ErrorKind {
  if (err instanceof HttpError) {
    return { kind: 'http', status: err.status };
  }

  if (err instanceof DOMException) {
    if (err.name === 'AbortError') {
      return { kind: 'cancelled' };
    }
    if (err.name === 'TimeoutError') {
      return { kind: 'timeout' };
    }
  }

  return { kind: 'unknown', error: err };
}
