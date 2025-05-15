import { Module } from '@/core';
import MiscController from './controllers/misc.controller';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import { MiscService } from './services/misc.service';

@Module({
  controllers: [MiscController],
  providers: [BasicAuthGuard, MiscService],
})
export class MiscModule {}
