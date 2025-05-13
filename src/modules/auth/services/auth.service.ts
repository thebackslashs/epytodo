import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '@/modules/user/models/user.model';
import UserService from '@/modules/user/services/user.service';
import {
  AccountAlreadyExistsError,
  InvalidCredentialsError,
  InvalidTokenError,
  UnauthorizedNoTokenError,
} from '@/modules/auth/errors/auth.error';
import { Inject } from '@/core';
import { Request } from 'express';
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: number = 24 * 60 * 60 * 1000;

  constructor(
    @Inject('UserService') private readonly userService: UserService
  ) {
    this.JWT_SECRET = process.env.SECRET || 'your-secret-key';
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  signToken(user: User): string {
    const signOptions: SignOptions = { expiresIn: this.JWT_EXPIRES_IN };
    return jwt.sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET,
      signOptions
    );
  }

  verifyToken(token: string): { userId: number; email: string } {
    try {
      return jwt.verify(token, this.JWT_SECRET) as {
        userId: number;
        email: string;
      };
    } catch {
      throw new InvalidTokenError();
    }
  }

  async register(userData: Omit<User, 'id' | 'created_at'>): Promise<{
    user: User;
    token: string;
  }> {
    const existingUsers = await this.userService.findUsers({
      email: userData.email,
    });
    if (existingUsers.length > 0) {
      throw new AccountAlreadyExistsError();
    }

    const hashedPassword = await this.hashPassword(userData.password);

    const newUser = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });

    const token = this.signToken(newUser);

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

    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    const token = this.signToken(user);

    return {
      user,
      token,
    };
  }

  async guardUserIsAuthenticated(req: Request): Promise<User> {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedNoTokenError();
    }

    const { userId } = this.verifyToken(token);

    const user = await this.userService.findUsers({ id: userId });
    if (user.length === 0) {
      throw new InvalidTokenError();
    }

    return user[0];
  }
}

export default AuthService;
