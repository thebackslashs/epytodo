import { ApiError } from '@/core';

export class BadParametersError extends ApiError {
  constructor() {
    super('Bad parameter', 400);
  }
}
