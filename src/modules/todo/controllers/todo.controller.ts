import { Controller, Inject, Post } from '@/core';
import { Request } from 'express';
import { TodoService } from '../services/todo.service';
import { Middleware } from '@/core/decorators/middleware.decorator';
import ValidatorMiddleware from '@/middlewares/validator.middleware';
import CreateTodoDTO, { InferCreateTodoDTO } from './../dtos/create-todo.dto';
import { Todo } from '../models/todo.model';

@Controller('/todos')
export class TodoController {
  constructor(
    @Inject('TodoService') private readonly todoService: TodoService
  ) {}

  @Post('/')
  @Middleware(ValidatorMiddleware(CreateTodoDTO))
  async createTodo(req: Request): Promise<{ todo: Todo }> {
    const todoData = req.body as InferCreateTodoDTO;
    const todo = await this.todoService.createTodo(todoData);
    return { todo };
  }
}
