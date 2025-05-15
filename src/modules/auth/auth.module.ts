import { Module } from '@/core';
import AuthController from './controllers/auth.controller';
import AuthService from './services/auth.service';
import UserModule from '@/modules/user/user.module';
import { CryptoModule } from '@/modules/crypto/crypto.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [UserModule, CryptoModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
