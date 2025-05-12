import { ApiError } from '@/core';

export class UserNotFoundError extends ApiError {
  constructor() {
    super('Not found', 404);
  }
}
