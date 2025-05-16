import { Module } from '@/core';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { TodoRepo } from './repos/todo.repo';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserTodoController } from './controllers/user.todo.controller';

@Module({
  controllers: [TodoController, UserTodoController],
  providers: [TodoService, TodoRepo, AuthGuard],
  exports: [TodoService],
})
export class TodoModule {}
