import { Module } from '@/core';
import { AuthService } from './services/auth.service';
import AuthController from './controllers/auth.controller';
import UserService from '@/modules/user/services/user.service';
import UserModule from '@/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
