import { User } from '@/modules/user/models/user.model';
import UserRepo from '../repos/user.repo';
import { Inject, Injectable } from '@/core';

@Injectable()
export class UserService {
  constructor(@Inject('UserRepo') private readonly userRepo: UserRepo) {}

  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    return this.userRepo.create(userData);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return this.userRepo.update(id, userData);
  }

  async findUsers(criteria: Partial<User>): Promise<User[]> {
    return this.userRepo.findBy(criteria);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async deleteUser(criteria: Partial<User>): Promise<void> {
    return this.userRepo.deleteBy(criteria);
  }
}

export default UserService;
