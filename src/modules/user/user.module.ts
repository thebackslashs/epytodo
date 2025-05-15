import { Module } from '@/core';
import UserController from './controllers/user.controller';
import UsersController from './controllers/users.controller';
import UserService from './services/user.service';
import UserRepo from './repos/user.repo';
import { UserGuard } from './guards/user.guard';

@Module({
  controllers: [UserController, UsersController],
  providers: [UserService, UserRepo, UserGuard],
  exports: [UserService],
})
export default class UserModule {}
