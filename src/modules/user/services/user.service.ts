import { User } from '@/modules/user/models/user.model';
import UserRepo from '../repos/user.repo';
import { Inject, Injectable } from '@/core';
import { formatDate } from '@/lib/dates';

@Injectable()
export class UserService {
  constructor(@Inject('UserRepo') private readonly userRepo: UserRepo) {}

  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    return await this.userRepo.create(userData);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<void> {
    await this.userRepo.update(id, userData);
  }

  async findUsers(criteria: Partial<User>): Promise<User[]> {
    const users = await this.userRepo.findBy(criteria);
    return users.map((user) => ({
      ...user,
      created_at: formatDate(new Date(user.created_at)),
    }));
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepo.findAll();
    return users.map((user) => ({
      ...user,
      created_at: formatDate(new Date(user.created_at)),
    }));
  }

  async deleteUser(criteria: Partial<User>): Promise<void> {
    return this.userRepo.deleteBy(criteria);
  }
}

export default UserService;
