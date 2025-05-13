import { ApiError } from '@/core';

export class InvalidCredentialsError extends ApiError {
  constructor() {
    super('Invalid credentials', 401);
  }
}
