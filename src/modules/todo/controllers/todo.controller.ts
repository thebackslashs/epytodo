import { Controller, Inject, Post, Put } from '@/core';
import { Request } from 'express';
import { TodoService } from '../services/todo.service';
import { Middleware } from '@/core/decorators/middleware.decorator';
import ValidatorMiddleware from '@/middlewares/validator.middleware';
import CreateTodoDTO, { InferCreateTodoDTO } from './../dtos/create-todo.dto';
import UpdateTodoDTO, { InferUpdateTodoDTO } from '../dtos/update-todo.dto';
import { Todo } from '../models/todo.model';
import { AuthService } from '@/modules/auth/services/auth.service';

@Controller('/todos')
export class TodoController {
    constructor(
        @Inject('TodoService') private readonly todoService: TodoService,
        @Inject('AuthService') private readonly authService: AuthService
    ) {}

    @Post('/')
    @Middleware(ValidatorMiddleware(CreateTodoDTO))
    async createTodo(req: Request): Promise<{ todo: Todo }> {
        const todoData = req.body as InferCreateTodoDTO;
        const todo = await this.todoService.createTodo(todoData);
        return { todo };
    }

    @Put('/:id')
    @Middleware(ValidatorMiddleware(UpdateTodoDTO))
    async updateTodo(req: Request): Promise<{ todo: Todo }> {
        await this.authService.guardUserIsAuthenticated(req);
        
        const id = parseInt(req.params.id);
        const todoData = req.body as InferUpdateTodoDTO;
        const todo = await this.todoService.updateTodo(id, todoData);
        
        return { todo };
    }
}