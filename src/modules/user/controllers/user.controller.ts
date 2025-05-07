import { Controller, Inject } from '@/core';
import { UserService } from '../services/user.service';

@Controller('/users')
export default class UserController {
  constructor(
    @Inject('UserService') private readonly userService: UserService
  ) {}
}
