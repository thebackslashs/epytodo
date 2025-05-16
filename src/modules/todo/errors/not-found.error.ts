import { ApiError } from '@/core';

export class NotFoundError extends ApiError {
  constructor() {
    super('Not found', 404);
  }
}
