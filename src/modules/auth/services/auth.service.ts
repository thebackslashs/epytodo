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

  sanitizeUser(user: User): Omit<User, 'password'> {
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
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

  async register(userData: Omit<User, 'id' | 'created_at'>): Promise<{
    user: Omit<User, 'password'>;
    token: string;
  }> {
    // Check if user already exists
    const existingUsers = await this.userService.findUsers({
      email: userData.email,
    });
    if (existingUsers.length > 0) {
      throw new AccountAlreadyExistsError();
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user with hashed password
    const newUser = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });

    // Generate JWT token
    const signOptions: SignOptions = { expiresIn: this.JWT_EXPIRES_IN };
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      this.JWT_SECRET,
      signOptions
    );

    // Remove password from response
    return { user: this.sanitizeUser(newUser), token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // Find user by email
    const users = await this.userService.findUsers({ email });
    if (users.length === 0) {
      throw new InvalidCredentialsError();
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    // Generate JWT token
    const signOptions: SignOptions = { expiresIn: this.JWT_EXPIRES_IN };
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET,
      signOptions
    );

    // Remove password from response
    const { password: _password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token,
    };
  }

  async guardUserIsAuthenticated(
    req: Request
  ): Promise<Omit<User, 'password'>> {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedNoTokenError();
    }
    const { userId } = this.verifyToken(token);
    const user = await this.userService.findUsers({ id: userId });
    if (user.length === 0) {
      throw new InvalidTokenError();
    }
    return this.sanitizeUser(user[0]);
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
}

export default AuthService;
