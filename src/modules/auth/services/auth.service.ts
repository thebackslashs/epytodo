import { User } from '@/modules/user/models/user.model';
import UserService from '@/modules/user/services/user.service';
import CryptoService from '@/modules/crypto/services/crypto.service';
import { Inject, Injectable } from '@/core';
import {
  AccountAlreadyExistsError,
  InvalidCredentialsError,
} from '@/modules/auth/errors';

@Injectable('AuthService')
export class AuthService {
  constructor(
    @Inject('UserService') private readonly userService: UserService,
    @Inject('CryptoService') private readonly cryptoService: CryptoService
  ) {}

  async register(userData: Omit<User, 'id' | 'created_at'>): Promise<{
    user: User;
    token: string;
  }> {
    const existingUsers = await this.userService.countUserByEmail(
      userData.email
    );
    if (existingUsers > 0) {
      throw new AccountAlreadyExistsError();
    }

    const hashedPassword = await this.cryptoService.hashPassword(
      userData.password
    );

    const newUser = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });

    const token = this.cryptoService.signToken(newUser);

    return { user: newUser, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const users = await this.userService.findUsers({ email });
    if (users.length === 0) {
      throw new InvalidCredentialsError();
    }

    const user = users[0];

    const isValidPassword = await this.cryptoService.comparePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    const token = this.cryptoService.signToken(user);

    return {
      user,
      token,
    };
  }
}

export default AuthService;
