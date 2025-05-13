import { Controller, Get, Inject } from '@/core';
import { AuthService } from '@/modules/auth/services/auth.service';
import { User } from '@/modules/user/models/user.model';
import { Request } from 'express';
import UserService from '../services/user.service';

@Controller('/user')
export default class UserController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
    @Inject('UserService') private readonly userService: UserService
  ) {}

  @Get()
  async getUser(req: Request): Promise<User> {
    const userId = await this.authService.guardUserIsAuthenticated(req);

    return await this.userService.findUserById(userId);
  }
}
