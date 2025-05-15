import { Controller, Get, Inject } from '@/core';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { User } from '@/modules/user/models/user.model';
import { Request } from 'express';
import UserService from '../services/user.service';

@Controller('/user')
export default class UserController {
  constructor(
    @Inject('AuthGuard') private readonly authGuard: AuthGuard,
    @Inject('UserService') private readonly userService: UserService
  ) {}

  @Get('/', 200)
  async getUser(req: Request): Promise<User> {
    const userId = await this.authGuard.guardUserIsAuthenticated(req);

    return await this.userService.findUserById(userId);
  }
}
