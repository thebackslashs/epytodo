import { ApiError } from '@/core';

export class BadParameterError extends ApiError {
  constructor() {
    super('Bad parameter', 400);
  }
}
