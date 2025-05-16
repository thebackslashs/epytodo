import { Inject, Injectable } from '@/core';
import { TodoRepo } from '../repos/todo.repo';
import { Todo } from '../models/todo.model';
import { InferCreateTodoDTO } from './../dtos/create-todo.dto';
import { NotFoundError } from '../errors/not-found.error';
import { NotAutorizedError } from '../errors/not-autorized.error';

@Injectable()
export class TodoService {
  constructor(@Inject('TodoRepo') private readonly todoRepo: TodoRepo) {}

  async createTodo(todoData: InferCreateTodoDTO): Promise<Todo> {
    return this.todoRepo.create(todoData);
  }

  async getTodos(): Promise<Todo[]> {
    return this.todoRepo.findAll();
  }

  async getTodosByUserId(userId: number): Promise<Todo[]> {
    return this.todoRepo.findAllByUserId(userId);
  }

  async getTodoById(id: number): Promise<Todo> {
    const todo = await this.todoRepo.findOneBy({ id });

    if (!todo) {
      throw new NotFoundError();
    }

    return todo;
  }

  async getUserTodoById(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepo.findOneBy({ id });

    if (!todo) {
      throw new NotFoundError();
    }

    if (todo.user_id !== userId) {
      throw new NotAutorizedError();
    }

    return todo;
  }
}
