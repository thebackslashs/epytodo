import { Module } from '@/core';
import UserController from './controllers/user.controller';
import UsersController from './controllers/users.controller';
import { UserService } from './services/user.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import UserRepo from './repos/user.repo';

@Module({
  controllers: [UserController, UsersController],
  providers: [UserService, UserRepo, AuthService],
  exports: [UserService, UserRepo],
})
export default class UserModule {}
