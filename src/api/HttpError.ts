export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message = `HTTP ${status}`,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
