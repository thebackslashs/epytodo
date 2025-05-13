import { ApiError } from '@/core';

export class UnauthorizedUserError extends ApiError {
  constructor() {
    super('Unauthorized action', 401);
  }
}
