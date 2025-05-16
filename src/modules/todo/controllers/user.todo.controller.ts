import { Controller, Get, Inject } from '@/core';
import { Request } from 'express';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';

@Controller('/user')
export class UserTodoController {
  constructor(
    @Inject('TodoService') private readonly todoService: TodoService,
    @Inject('AuthGuard') private readonly authGuard: AuthGuard
  ) {}

  @Get('/todos', 200)
  async getUserTodos(req: Request): Promise<Todo[]> {
    const userId = await this.authGuard.guardUserIsAuthenticated(req);

    return this.todoService.getTodosByUserId(userId);
  }
}
