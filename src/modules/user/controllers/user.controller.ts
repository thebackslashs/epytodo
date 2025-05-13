import { Controller, Get, Inject } from '@/core';
import { AuthService } from '@/modules/auth/services/auth.service';
import { User } from '@/modules/user/models/user.model';
import { Request } from 'express';

@Controller('/user')
export default class UserController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService
  ) {}

  @Get()
  async getUser(req: Request): Promise<User> {
    return await this.authService.guardUserIsAuthenticated(req);
  }
}
