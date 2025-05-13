import { ApiError } from '@/core';

export class UnauthorizedNoTokenError extends ApiError {
  constructor() {
    super('No token, authorization denied', 401);
  }
}
