import UserModule from '@/modules/user/user.module';
import { Module } from '@/core';
import { DatabaseService } from './modules/database/database.service';
import { AuthModule } from './modules/auth/auth.module';
import { MiscModule } from './modules/misc/misc.module';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [AuthModule, UserModule, TodoModule, MiscModule],
  providers: [DatabaseService],
})
export default class AppModule {}
