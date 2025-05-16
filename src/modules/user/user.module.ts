import { Module } from '@/core';
import UserController from './controllers/user.controller';
import UsersController from './controllers/users.controller';
import UserService from './services/user.service';
import UserRepo from './repos/user.repo';
import { UserGuard } from './guards/user.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import CryptoService from '../crypto/services/crypto.service';

@Module({
  controllers: [UserController, UsersController],
  providers: [UserService, UserRepo, UserGuard, AuthGuard, CryptoService],
  exports: [UserService],
})
export default class UserModule {}
