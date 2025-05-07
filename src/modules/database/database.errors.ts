import { ApiError } from '@/core';
import { Logger } from '@/lib/logger';

const DatabaseLogger = new Logger('DatabaseService');

export class DatabaseConnectionError extends ApiError {
  constructor() {
    super('Internal server error', 500);
    DatabaseLogger.error('Failed to connect to database');
  }
}

export class SuspiciousDataError extends ApiError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
    DatabaseLogger.error('Suspicious data detected');
  }
}

export class DatabaseQueryError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    DatabaseLogger.error('Database query error');
  }
}
