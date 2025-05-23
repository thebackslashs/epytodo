import { User } from '@/modules/user/models/user.model';
import UserRepo from '../repos/user.repo';
import { Inject, Injectable } from '@/core';
import { UserNotFoundError } from '../errors/user-not-found.error';
import CryptoService from '@/modules/crypto/services/crypto.service';
import { BadParametersError } from '../errors/bad-parameter.error';

@Injectable('UserService')
export class UserService {
  constructor(
    @Inject('UserRepo') private readonly userRepo: UserRepo,
    @Inject('CryptoService') private readonly cryptoService: CryptoService
  ) {}

  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    return await this.userRepo.create(userData);
  }

  async updateUser(
    id: number,
    data: Partial<Omit<User, 'id' | 'created_at'>>
  ): Promise<User> {
    if (Object.keys(data).length === 0) {
      throw new BadParametersError();
    }

    if (data.password) {
      data.password = await this.cryptoService.hashPassword(data.password);
    }

    return await this.userRepo.update(id, data);
  }

  async countUserById(id: number): Promise<number> {
    return await this.userRepo.countBy({ id });
  }

  async countUserByEmail(email: string): Promise<number> {
    return await this.userRepo.countBy({ email });
  }

  async countUserBy(criteria: Partial<User>): Promise<number> {
    return await this.userRepo.countBy(criteria);
  }

  async findUserById(id: number): Promise<User> {
    return (await this.findUsers({ id }))[0];
  }

  async findUsers(criteria: Partial<User>): Promise<User[]> {
    return await this.userRepo.findBy(criteria);
  }

  async findUserByIdOrEmail(idOrEmail: string): Promise<User> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(idOrEmail)) {
      const user = await this.findUsers({ email: idOrEmail });
      if (user.length === 0) {
        throw new UserNotFoundError();
      }
      return user[0];
    } else {
      const user = await this.findUsers({ id: parseInt(idOrEmail) });
      if (user.length === 0) {
        throw new UserNotFoundError();
      }
      return user[0];
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.findAll();
  }

  async deleteUserById(id: number): Promise<void> {
    return await this.deleteUserBy({ id });
  }

  async deleteUserBy(criteria: Partial<User>): Promise<void> {
    return await this.userRepo.deleteBy(criteria);
  }
}

export default UserService;
