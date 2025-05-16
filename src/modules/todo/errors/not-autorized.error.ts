import { ApiError } from '@/core';

export class NotAutorizedError extends ApiError {
  constructor() {
    super('No token, authorization denied', 401);
  }
}
