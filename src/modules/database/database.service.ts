import { Injectable } from '@/core';
import mysql from 'mysql2/promise';
import {
  DatabaseConnectionError,
  DatabaseQueryError,
  SuspiciousDataError,
} from './database.errors';
import { Logger } from '@/lib/logger';

const DatabaseLogger = new Logger('DatabaseService');

@Injectable('DatabaseService')
export class DatabaseService {
  private connection: mysql.Connection | undefined;
  private readonly retryDelay = 5000;
  private readonly maxRetries = 3;
  private retryCount = 0;
  private config: mysql.ConnectionOptions;

  constructor() {
    this.config = {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    };
    this.connect();
  }

  private isSuspicious(input: string): boolean {
    const suspiciousChars = /('|--|;)/g;
    const keywords =
      /\b(select|drop|union|insert|update|delete|sleep|benchmark)\b/gi;
    const longInput = input.length > 50;

    return (
      (suspiciousChars.test(input) && keywords.test(input)) ||
      (longInput && keywords.test(input))
    );
  }

  private isObjectSuspicious(obj: Record<string, unknown>): boolean {
    if (!obj || typeof obj !== 'object') {
      return false;
    }
    return Object.values(obj).some(
      (value) => typeof value === 'string' && this.isSuspicious(value)
    );
  }

  async connect(): Promise<void> {
    if (process.env.DEBUG === 'true') {
      DatabaseLogger.info(
        `Connecting to ${this.config.user}@${this.config.host}/${this.config.database}...`
      );
    }

    try {
      this.connection = await mysql.createConnection(this.config);

      if (process.env.DEBUG === 'true') {
        DatabaseLogger.info(
          `Connected to ${this.config.user}@${this.config.host}/${this.config.database}`
        );
      }
    } catch (error: unknown) {
      const err = error as Error;
      DatabaseLogger.warn(
        `Failed to connect to database after ${this.retryCount} retries`
      );

      if (process.env.DEBUG === 'true') {
        DatabaseLogger.debug(err);
      }

      if (this.retryCount < this.maxRetries) {
        setTimeout(() => this.connect(), this.retryDelay);
        this.retryCount++;
      } else {
        throw new Error(
          `\x1b[31mFailed to connect to database after ${this.maxRetries} retries\x1b[0m`
        );
      }
    }
  }

  async query(
    sql: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: any[]
  ): Promise<ReturnType<mysql.Connection['query']>> {
    if (!this.connection) {
      throw new DatabaseConnectionError();
    }

    if (
      values &&
      this.isObjectSuspicious(values as unknown as Record<string, unknown>)
    ) {
      throw new SuspiciousDataError();
    }

    try {
      const res = await this.connection.query.bind(this.connection)(
        sql,
        values
      );

      return res;
    } catch (error: unknown) {
      const err = error as Error;
      throw new DatabaseQueryError(err.message);
    }
  }
}
