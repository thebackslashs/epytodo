import { Module } from '@/core';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { TodoRepo } from './repos/todo.repo';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoRepo, AuthGuard],
  exports: [TodoService],
})
export class TodoModule {}
