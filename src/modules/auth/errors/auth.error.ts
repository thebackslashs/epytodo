import { ApiError } from '@/core';

export class InvalidTokenError extends ApiError {
  constructor() {
    super('Invalid token', 401);
  }
}

export class InvalidCredentialsError extends ApiError {
  constructor() {
    super('Invalid credentials', 401);
  }
}

export class AccountAlreadyExistsError extends ApiError {
  constructor() {
    super('Account already exists', 400);
  }
}

export class UnauthorizedNoTokenError extends ApiError {
  constructor() {
    super('No token, authorization denied', 401);
  }
}
