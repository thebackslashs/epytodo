import { Controller, Delete, Get, Inject, Post, Put } from '@/core';
import { Request } from 'express';
import { TodoService } from '../services/todo.service';
import { Middleware } from '@/core/decorators/middleware.decorator';
import {
  BodyValidatorMiddleware,
  ParamsValidatorMiddleware,
} from '@/middlewares/validator.middleware';
import CreateTodoDTO, { InferCreateTodoDTO } from './../dtos/create-todo.dto';
import { Todo } from '../models/todo.model';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import TodoIdDTO from '../dtos/user-id.dto';
import UpdateTodoDTO, { InferUpdateTodoDTO } from '../dtos/update-todo.dto';
@Controller('/todos')
export class TodoController {
  constructor(
    @Inject('TodoService') private readonly todoService: TodoService,
    @Inject('AuthGuard') private readonly authGuard: AuthGuard
  ) {}

  @Get('/', 200)
  async getTodos(req: Request): Promise<Todo[]> {
    await this.authGuard.guardUserIsAuthenticated(req);

    return await this.todoService.getTodos();
  }

  @Get('/:id', 200)
  @Middleware(ParamsValidatorMiddleware(TodoIdDTO))
  async getTodoById(req: Request): Promise<Todo> {
    const userId = await this.authGuard.guardUserIsAuthenticated(req);

    return await this.todoService.getUserTodoById(
      Number(req.params.id),
      userId
    );
  }

  @Post('/', 201)
  @Middleware(BodyValidatorMiddleware(CreateTodoDTO))
  async createTodo(req: Request): Promise<Todo> {
    await this.authGuard.guardUserCanModifyUserRessource(req, req.body.user_id);

    const todoData = req.body as InferCreateTodoDTO;
    const todo = await this.todoService.createTodo(todoData);
    return todo;
  }

  @Put('/:id', 200)
  @Middleware(ParamsValidatorMiddleware(TodoIdDTO))
  @Middleware(BodyValidatorMiddleware(UpdateTodoDTO))
  async updateTodo(req: Request): Promise<Todo> {
    const userId = await this.authGuard.guardUserIsAuthenticated(req);

    const todoData = req.body as InferUpdateTodoDTO;

    return await this.todoService.updateUserTodoById(
      todoData,
      Number(req.params.id),
      userId
    );
  }

  @Delete('/:id', 200)
  @Middleware(ParamsValidatorMiddleware(TodoIdDTO))
  async deleteTodo(req: Request): Promise<{ msg: string }> {
    const userId = await this.authGuard.guardUserIsAuthenticated(req);

    return await this.todoService.deleteUserTodoById(
      Number(req.params.id),
      userId
    );
  }
}
