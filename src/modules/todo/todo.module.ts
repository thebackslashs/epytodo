import { Module } from '@/core';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';
import { TodoRepo } from './repos/todo.repo';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoRepo],
  exports: [TodoService]
})
export class TodoModule {}