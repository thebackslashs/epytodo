import { ApiError } from '@/core';

export class BasicAuthError extends ApiError {
  constructor() {
    super('Authentication required.', 401);
  }
}
