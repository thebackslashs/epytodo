import { Inject, Injectable } from '@/core';
import { Request } from 'express';
import { UnauthorizedNoTokenError } from '../errors';
import { CryptoService } from '@/modules/crypto/services/crypto.service';
import { UserService } from '@/modules/user/services/user.service';

@Injectable('AuthGuard')
export class AuthGuard {
  constructor(
    @Inject('UserService') private readonly userService: UserService,
    @Inject('CryptoService') private readonly cryptoService: CryptoService
  ) {}

  async guardUserIsAuthenticated(req: Request): Promise<number> {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedNoTokenError();
    }

    const { userId } = this.cryptoService.verifyToken(token);

    const user = await this.userService.countUserById(userId);
    if (user === 0) {
      throw new UnauthorizedNoTokenError();
    }

    return userId;
  }

  async guardUserCanModifyUserRessource(
    req: Request,
    id: number
  ): Promise<number> {
    const userId = await this.guardUserIsAuthenticated(req);

    if (userId !== id) {
      throw new UnauthorizedNoTokenError();
    }

    return userId;
  }
}
