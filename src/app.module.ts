import UserModule from '@/modules/user/user.module';
import { Module } from '@/core';
import { DatabaseService } from './modules/database/database.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  providers: [DatabaseService],
})
export default class AppModule {}
