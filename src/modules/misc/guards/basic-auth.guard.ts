import { Inject, Injectable } from '@/core';
import { Request, Response } from 'express';
import { Logger } from '@/lib/logger';
import CryptoService from '@/modules/crypto/services/crypto.service';

import { BasicAuthError } from '../errors/basic-auth.error';

@Injectable('BasicAuthGuard')
export class BasicAuthGuard {
  private readonly username?: string;
  private readonly hashedPassword?: string;
  private readonly logger = new Logger('BasicAuthGuard');

  constructor(
    @Inject('CryptoService') private readonly cryptoService: CryptoService
  ) {
    this.username = process.env.ADMIN_USERNAME;
    this.hashedPassword = process.env.ADMIN_HASHED_PASSWORD;

    if (!this.isConfigured()) {
      this.logger.warn('Basic auth is not configured');
    }
  }

  private isConfigured(): boolean {
    return !!this.username && !!this.hashedPassword;
  }

  private async isCredentialsValid(
    username: string,
    password: string
  ): Promise<boolean> {
    if (!this.hashedPassword) {
      return false;
    }

    const passwordIsValid = await this.cryptoService.comparePassword(
      password,
      this.hashedPassword
    );

    return username === this.username && passwordIsValid;
  }

  async guardIsAdmin(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Private Area"');
      throw new BasicAuthError();
    }

    if (!this.isConfigured()) {
      this.logger.warn(
        'User tried to access protected route but Basic auth is not configured'
      );
      throw new BasicAuthError();
    }

    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':');

    const isCredentialsValid = await this.isCredentialsValid(
      username,
      password
    );

    if (!isCredentialsValid) {
      throw new BasicAuthError();
    }
  }
}
