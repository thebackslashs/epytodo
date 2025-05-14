import { ApiError } from '@/core';

export class InvalidTokenError extends ApiError {
  constructor() {
    super('Invalid token', 401);
    this.name = 'InvalidTokenError';
  }
}
