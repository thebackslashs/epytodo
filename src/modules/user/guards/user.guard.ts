import { Inject, Injectable } from '@/core';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UserService } from '../services/user.service';

@Injectable('UserGuard')
export class UserGuard {
  constructor(
    @Inject('UserService') private readonly userService: UserService
  ) {}

  async guardUserExistById(id: number): Promise<void> {
    const count = await this.userService.countUserById(id);
    if (count === 0) {
      throw new UserNotFoundError();
    }
  }
}
