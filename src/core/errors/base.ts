export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string = 'Internal server error', statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
