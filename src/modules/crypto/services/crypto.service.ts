import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '@/modules/user/models/user.model';
import { InvalidTokenError } from '../errors/invalid-token.error';
import { Injectable } from '@/core';

@Injectable('CryptoService')
export class CryptoService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: number = 24 * 60 * 60 * 1000;

  constructor() {
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
}

export default CryptoService;
