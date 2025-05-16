import { Inject, Injectable } from '@/core';
import { TodoRepo } from '../repos/todo.repo';
import { Todo } from '../models/todo.model';
import { InferCreateTodoDTO } from './../dtos/create-todo.dto';

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
    return this.todoRepo.findBy({ id });
  }
}
