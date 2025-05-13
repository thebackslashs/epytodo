import { ApiError } from '@/core';

export class AccountAlreadyExistsError extends ApiError {
  constructor() {
    super('Account already exists', 400);
  }
}
