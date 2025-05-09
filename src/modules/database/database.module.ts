import { Module } from '@/core';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export default class DatabaseModule {}
