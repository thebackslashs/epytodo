import { ApiError } from '@/core';

export class InvalidCredentialsError extends ApiError {
  constructor() {
    super('Invalid Credentials', 401);
  }
}
