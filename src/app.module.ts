import UserModule from '@/modules/user/user.module';
import { Module } from '@/core';
import { DatabaseService } from './modules/database/database.service';
import { AuthModule } from './modules/auth/auth.module';
import { MiscModule } from './modules/misc/misc.module';

@Module({
  imports: [UserModule, AuthModule, MiscModule],
  providers: [DatabaseService],
})
export default class AppModule {}
