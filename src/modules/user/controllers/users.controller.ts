import { Controller, Inject } from '@/core';
import { UserService } from '../services/user.service';

@Controller('/users')
export default class UsersController {
  constructor(
    @Inject('UserService') private readonly userService: UserService
  ) {}
}
