import { Controller, Get, Inject } from '@/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { Request } from 'express';
@Controller('/users')
export default class UsersController {
  constructor(
    @Inject('UserService') private readonly userService: UserService,
    @Inject('AuthService') private readonly authService: AuthService
  ) {}

  @Get('/:idOrEmail')
  async getUser(req: Request): Promise<Omit<User, 'password'>> {
    await this.authService.guardUserIsAuthenticated(req);

    const idOrEmail = req.params['idOrEmail'];
    if (isNaN(parseInt(idOrEmail))) {
      const user = await this.userService.findUsers({ email: idOrEmail });
      if (user.length === 0) {
        throw new UserNotFoundError();
      }
      return this.authService.sanitizeUser(user[0]);
    }
    const user = await this.userService.findUsers({ id: parseInt(idOrEmail) });
    if (user.length === 0) {
      throw new UserNotFoundError();
    }
    return this.authService.sanitizeUser(user[0]);
  }
}
