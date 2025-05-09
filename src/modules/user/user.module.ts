import { Module } from '@/core';
import UserController from './controllers/user.controller';
import { UserService } from './services/user.service';
import UserRepo from './repos/user.repo';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepo],
  exports: [UserService, UserRepo],
})
export default class UserModule {}
