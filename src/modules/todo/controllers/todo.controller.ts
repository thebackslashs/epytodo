import { Controller, Get, Inject, Post } from '@/core';
import { Request } from 'express';
import { TodoService } from '../services/todo.service';
import { Middleware } from '@/core/decorators/middleware.decorator';
import ValidatorMiddleware from '@/middlewares/validator.middleware';
import CreateTodoDTO, { InferCreateTodoDTO } from './../dtos/create-todo.dto';
import { Todo } from '../models/todo.model';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';

@Controller('/todos')
export class TodoController {
  constructor(
    @Inject('TodoService') private readonly todoService: TodoService,
    @Inject('AuthGuard') private readonly authGuard: AuthGuard
  ) {}

  @Get('/', 200)
  async getTodos(req: Request): Promise<Todo[]> {
    await this.authGuard.guardUserIsAuthenticated(req);

    return this.todoService.getTodos();
  }

  @Post('/', 201)
  @Middleware(ValidatorMiddleware(CreateTodoDTO))
  async createTodo(req: Request): Promise<Todo> {
    await this.authGuard.guardUserCanModifyUserRessource(req, req.body.user_id);

    const todoData = req.body as InferCreateTodoDTO;
    const todo = await this.todoService.createTodo(todoData);
    return todo;
  }
}
